import type { Page, Route } from "@playwright/test";



type AppRole = "company_admin" | "company_staff" | "event_admin" | "super_admin";



export interface FakeRole {

  id: string;

  role: AppRole;

  companyId: string | null;

  companyName: string | null;

  eventId: string | null;

  eventName: string | null;

  grantedAt: string;

}



export interface FakeUser {

  id: string;

  email: string;

  password: string;

  displayName: string;

  roles: FakeRole[];

  activeEvent: FakeActiveEvent | null;

}



export interface FakeActiveEvent {

  id: string;

  slug: string;

  name: string;

  status: string;

  startsAt: string;

  endsAt: string;

  venueName: string | null;

  venue: string | null;

  city: string | null;

  isSimulated?: boolean;

}



export interface RecordedCall {

  method: string;

  path: string;

  body: unknown;

  authorization: string | null;

}



const GRANTED_AT = "2026-10-01T00:00:00.000Z";

const DEFAULT_EVENT_ID = "e0000000-0000-4000-8000-000000000001";

const DEFAULT_ACTIVE_EVENT: FakeActiveEvent = {

  id: DEFAULT_EVENT_ID,

  slug: "fipaz-2026",

  name: "FIPAZ 2026",

  status: "active",

  startsAt: "2026-10-01T04:00:00.000Z",

  endsAt: "2026-11-09T04:00:00.000Z",

  venueName: "Campo Ferial Chuquiago Marka",

  venue: "Campo Ferial Chuquiago Marka",

  city: "La Paz",

};

let sequence = 0;

const nextId = (prefix: string) => `${prefix}-${++sequence}`;



export function companyRole(role: "company_admin" | "company_staff", companyId: string, companyName: string): FakeRole {

  return { id: nextId("role"), role, companyId, companyName, eventId: null, eventName: null, grantedAt: GRANTED_AT };

}



export function eventAdminRole(eventId: string, eventName: string): FakeRole {

  return { id: nextId("role"), role: "event_admin", companyId: null, companyName: null, eventId, eventName, grantedAt: GRANTED_AT };

}



const ok = (data: unknown) => ({ success: true, data, meta: null });

const fail = (code: string, message = code) => ({ success: false, error: { code, message, details: null } });



/**

 * Backend de autenticación en memoria con el contrato de `fexpo-backend`: login y registro con

 * contraseña, `/auth/me`, refresh con rotación, logout y alta de empresa. Registra cada llamada.

 */

export class FakeBackend {

  readonly calls: RecordedCall[] = [];
  failCheckins = false;

  private readonly users: FakeUser[] = [];

  private readonly accessTokens = new Map<string, string>();

  private readonly refreshTokens = new Map<string, string>();

  private readonly companies = new Map<string, Record<string, unknown>>();

  private readonly stands = new Map<string, Record<string, unknown>>();

  private readonly qrCodes = new Map<string, {

    qrId: string;

    standId: string;

    token: string;

    expiresAt: string;

    maxScans: number;

    scanCount: number;

    isRevoked: boolean;

  }>();

  private readonly checkins = new Map<string, Array<{

    id: string;

    standId: string;

    userId: string;

    method: "nfc" | "qr" | "manual" | "system";

    acceptedAt: string;

  }>>();

  private readonly persistentFailures = new Map<string, { status: number; code: string }>();

  private readonly oneShotFailures = new Map<string, { status: number; code: string }>();

  private readonly delays = new Map<string, number>();



  constructor() {

    // Empresa y stand inicial en categoría Gastronomía

    this.companies.set("c0000000-0000-4000-8000-000000000002", {

      id: "c0000000-0000-4000-8000-000000000002",

      displayName: "Cafe Altiplano",

      description: "Cafetería y tostado de altura",

      logoPath: null,

      website: null,

      contactEmail: "cafe@fexpo.test",

    });

    this.stands.set("5a000000-0000-4000-8000-000000000002", {

      id: "5a000000-0000-4000-8000-000000000002",

      companyId: "c0000000-0000-4000-8000-000000000002",

      eventId: DEFAULT_EVENT_ID,

      eventName: "FIPAZ 2026",

      boothCode: "G-01",

      displayName: "Cafe Altiplano",

      description: "Stand de café boliviano",

      categories: [{ id: "ca000000-0000-4000-8000-000000000001", slug: "gastronomia", label: "Gastronomía" }],

      tags: ["gastronomia", "cafe"],

      visitPoints: 50,

      status: "active",

    });



    // Empresa y stand inicial en categoría Salud

    this.companies.set("c0000000-0000-4000-8000-000000000003", {

      id: "c0000000-0000-4000-8000-000000000003",

      displayName: "BioSalud Farmacéutica",

      description: "Productos médicos y farmacia",

      logoPath: null,

      website: null,

      contactEmail: "salud@fexpo.test",

    });

    this.stands.set("5a000000-0000-4000-8000-000000000003", {

      id: "5a000000-0000-4000-8000-000000000003",

      companyId: "c0000000-0000-4000-8000-000000000003",

      eventId: DEFAULT_EVENT_ID,

      eventName: "FIPAZ 2026",

      boothCode: "S-01",

      displayName: "BioSalud Farmacéutica",

      description: "Stand de salud y bienestar",

      categories: [{ id: "ca000000-0000-4000-8000-000000000002", slug: "salud", label: "Salud" }],

      tags: ["salud", "medicina"],

      visitPoints: 50,

      status: "active",

    });

  }



  addUser(user: Omit<FakeUser, "id" | "roles" | "activeEvent"> & {

    roles?: FakeRole[];

    activeEvent?: FakeActiveEvent | null;

  }): FakeUser {

    const roles = user.roles ?? [];

    const created: FakeUser = {

      id: nextId("user"),

      ...user,

      roles,

      activeEvent: user.activeEvent === undefined ? (roles.length > 0 ? DEFAULT_ACTIVE_EVENT : null) : user.activeEvent,

    };

    this.users.push(created);

    for (const role of created.roles) {

      if (!role.companyId || this.companies.has(role.companyId)) continue;

      this.companies.set(role.companyId, {

        id: role.companyId, displayName: role.companyName, description: "Empresa de prueba",

        logoPath: null, website: null, contactEmail: "contacto@fexpo.test",

      });

      const standId = "5a000000-0000-4000-8000-000000000001";

      this.stands.set(standId, {

        id: standId, companyId: role.companyId,

        eventId: DEFAULT_EVENT_ID, eventName: "FIPAZ 2026",

        boothCode: "A-01", displayName: role.companyName, description: "Stand de prueba",

        tags: ["tecnología"], activityHighlight: null, promotionHighlight: null,

        visitPoints: 50, status: "active",

      });

    }

    return created;

  }



  removeStandsForCompany(companyId: string): void {

    for (const [standId, stand] of this.stands) {

      if (stand.companyId === companyId) this.stands.delete(standId);

    }

    const comp = this.event.companies.find((c) => c.companyId === companyId);

    if (comp) comp.standCount = 0;

  }



  addStand(stand: Record<string, unknown>): void {

    const id = String(stand.id ?? "");

    if (!id) throw new Error("El stand simulado necesita id.");

    this.stands.set(id, { ...stand });

  }



  setActiveEvent(email: string, eventId: string, name: string): void {

    const user = this.users.find((candidate) => candidate.email === email);

    if (!user) throw new Error(`No existe el usuario simulado ${email}.`);

    user.activeEvent = {

      ...DEFAULT_ACTIVE_EVENT,

      id: eventId,

      slug: name.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),

      name,

    };

  }



  seedCheckins(standId: string, count: number): void {
    const list: Array<{ id: string; standId: string; userId: string; method: "nfc" | "qr"; acceptedAt: string }> = [];
    const now = Date.now();
    for (let i = 0; i < count; i++) {
      list.push({
        id: crypto.randomUUID(),
        standId,
        userId: `00000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`,
        method: i % 2 === 0 ? "qr" : "nfc",
        acceptedAt: new Date(now - i * 60_000).toISOString(),
      });
    }
    this.checkins.set(standId, list);
  }

  simulateCheckin(standId: string, userId: string, method: "nfc" | "qr" = "qr"): { checkinId: string; dailyDuplicate: boolean } {

    const list = this.checkins.get(standId) ?? [];

    const dailyDuplicate = list.some((item) => item.userId === userId);

    const checkinId = crypto.randomUUID();

    list.unshift({

      id: checkinId,

      standId,

      userId,

      method,

      acceptedAt: new Date().toISOString(),

    });

    this.checkins.set(standId, list);

    return { checkinId, dailyDuplicate };

  }



  getQr(qrId: string) {

    return this.qrCodes.get(qrId) ?? null;

  }



  fail(method: string, path: string, status = 503, code = "DATABASE_UNAVAILABLE"): void {

    this.persistentFailures.set(`${method.toUpperCase()} ${path}`, { status, code });

  }



  clearFailures(): void {

    this.persistentFailures.clear();

    this.oneShotFailures.clear();

  }



  failNext(method: string, path: string, status = 503, code = "DATABASE_UNAVAILABLE"): void {

    this.oneShotFailures.set(`${method.toUpperCase()} ${path}`, { status, code });

  }



  delay(method: string, path: string, milliseconds: number): void {

    this.delays.set(`${method.toUpperCase()} ${path}`, milliseconds);

  }



  /** Simula que el servidor revocó todas las sesiones (p. ej. logout-all desde otro equipo). */

  revokeAllSessions(): void {

    this.refreshTokens.clear();

    this.accessTokens.clear();

  }



  /** Refresh tokens que el servidor todavía acepta. */

  liveRefreshTokens(): string[] {

    return [...this.refreshTokens.keys()];

  }



  async install(page: Page): Promise<void> {

    await page.route("https://accounts.google.com/**", (route) => route.abort());

    await page.route("**/api/v1/**", (route) => this.handle(route));

  }



  private issueTokens(user: FakeUser) {

    const accessToken = nextId("access");

    const refreshToken = nextId("refresh");

    this.accessTokens.set(accessToken, user.id);

    this.refreshTokens.set(refreshToken, user.id);

    return { accessToken, refreshToken, expiresIn: 900, user: { id: user.id, displayName: user.displayName, avatarUrl: null } };

  }



  private userFromBearer(authorization: string | null): FakeUser | undefined {

    const token = authorization?.replace(/^Bearer /, "") ?? "";

    const userId = this.accessTokens.get(token);

    return this.users.find((user) => user.id === userId);

  }



  /** Proyecta el registro de gestión al contrato público de GET /events/:id/stands y /stands/:id. */

  private publicStand(stand: Record<string, unknown>, includeRelevance = false) {

    const companyId = String(stand.companyId ?? "");

    const company = this.companies.get(companyId);

    const categories = Array.isArray(stand.categories)

      ? stand.categories.filter((category) =>

          typeof category === "object"

          && category !== null

          && typeof (category as Record<string, unknown>).id === "string"

          && typeof (category as Record<string, unknown>).slug === "string"

          && typeof (category as Record<string, unknown>).label === "string")

      : [];

    const tags = Array.isArray(stand.tags) ? stand.tags.filter((tag): tag is string => typeof tag === "string") : [];

    const location = typeof stand.location === "object" && stand.location !== null ? stand.location : null;



    return {

      id: String(stand.id ?? ""),

      boothCode: String(stand.boothCode ?? ""),

      displayName: String(stand.displayName ?? company?.displayName ?? ""),

      description: typeof stand.description === "string" ? stand.description : null,

      company: {

        id: companyId,

        displayName: String(company?.displayName ?? stand.displayName ?? ""),

      },

      categories,

      tags,

      featured: stand.featured === true,

      activityHighlight: typeof stand.activityHighlight === "string" ? stand.activityHighlight : null,

      promotionHighlight: typeof stand.promotionHighlight === "string" ? stand.promotionHighlight : null,

      location,

      ...(includeRelevance ? { relevance: 1 } : {}),

    };

  }



  private async handle(route: Route): Promise<void> {

    const request = route.request();

    const url = new URL(request.url());

    const path = url.pathname.replace(/^\/api\/v1/, "");

    const method = request.method();

    const authorization = (await request.headerValue("authorization")) ?? null;

    let body: unknown = undefined;

    try { body = request.postDataJSON(); } catch { body = request.postData(); }

    this.calls.push({ method, path, body, authorization });



    const input = (body ?? {}) as Record<string, unknown>;

    const reply = (status: number, payload?: unknown) =>

      route.fulfill(payload === undefined

        ? { status }

        : { status, contentType: "application/json", body: JSON.stringify(payload) });



    const requestKey = `${method} ${path}`;

    const delay = this.delays.get(requestKey) ?? 0;

    if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));

    const forcedFailure = this.persistentFailures.get(requestKey) ?? this.oneShotFailures.get(requestKey);

    if (forcedFailure) {

      this.oneShotFailures.delete(requestKey);

      return reply(forcedFailure.status, fail(forcedFailure.code));

    }



    if (method === "POST" && path === "/auth/login") {

      const user = this.users.find((candidate) => candidate.email.toLowerCase() === String(input.email).toLowerCase());

      if (!user || user.password !== input.password) return reply(401, fail("INVALID_CREDENTIALS", "Invalid credentials."));

      return reply(200, ok(this.issueTokens(user)));

    }



    if (method === "POST" && path === "/auth/register") {

      if (this.users.some((candidate) => candidate.email.toLowerCase() === String(input.email).toLowerCase())) {

        return reply(409, fail("EMAIL_IN_USE", "Email already in use."));

      }

      const user = this.addUser({ email: String(input.email), password: String(input.password), displayName: String(input.displayName) });

      return reply(201, ok(this.issueTokens(user)));

    }



    if (method === "POST" && path === "/auth/refresh") {

      const userId = this.refreshTokens.get(String(input.refreshToken));

      const user = this.users.find((candidate) => candidate.id === userId);

      if (!user) return reply(401, fail("INVALID_REFRESH_TOKEN", "Invalid refresh token."));

      this.refreshTokens.delete(String(input.refreshToken));

      return reply(200, ok(this.issueTokens(user)));

    }



    if (method === "GET" && path === "/auth/me") {

      const user = this.userFromBearer(authorization);

      if (!user) return reply(401, fail("AUTH_REQUIRED", "Authentication required."));

      return reply(200, ok({

        id: user.id,

        email: user.email,

        profile: { displayName: user.displayName, avatarUrl: null },

        roles: user.roles,

        activeEvent: user.activeEvent,

      }));

    }



    if (method === "POST" && path === "/auth/logout") {

      if (!this.userFromBearer(authorization)) return reply(401, fail("AUTH_REQUIRED"));

      this.refreshTokens.delete(String(input.refreshToken));

      return reply(204);

    }



    if (method === "POST" && path === "/auth/logout-all") {

      const user = this.userFromBearer(authorization);

      if (!user) return reply(401, fail("AUTH_REQUIRED"));

      for (const [token, userId] of this.refreshTokens) if (userId === user.id) this.refreshTokens.delete(token);

      return reply(204);

    }



    if (method === "POST" && path === "/companies") {

      const user = this.userFromBearer(authorization);

      if (!user) return reply(401, fail("AUTH_REQUIRED"));

      const company = { id: crypto.randomUUID(), displayName: String(input.displayName) };

      user.roles.push(companyRole("company_admin", company.id, company.displayName));

      this.companies.set(company.id, { ...company, description: (input.description as string | null) ?? null, logoPath: null, website: null, contactEmail: null });

      return reply(201, ok(company));

    }



    // Listado de eventos accesibles (GET /events)

    if (method === "GET" && path === "/events") {

      const user = this.userFromBearer(authorization);

      if (!user) return reply(401, fail("AUTH_REQUIRED"));

      return reply(200, ok([

        {

          id: DEFAULT_EVENT_ID,

          slug: "fipaz-2026",

          name: "FIPAZ 2026",

          status: "active",

          startsAt: "2026-10-20T00:00:00Z",

          endsAt: "2026-11-05T00:00:00Z",

          venueName: "Campo Ferial Chuquiago Marka",

          venue: "Campo Ferial Chuquiago Marka",

          city: "La Paz",

          description: "Feria Internacional de La Paz 2026",

          isCurrentActive: true,

        },

      ]));

    }



    // Estos dos endpoints son públicos en el backend real. Se resuelven antes de exigir Bearer

    // para que el directorio de /panel/expositores pruebe el mismo contrato que producción.

    const publicStandListMatch = path.match(/^\/events\/([^/]+)\/stands$/);

    if (method === "GET" && publicStandListMatch) {

      const eventId = publicStandListMatch[1];

      const query = (url.searchParams.get("query") ?? "").trim().toLocaleLowerCase();

      const categoryId = url.searchParams.get("categoryId");

      const featured = url.searchParams.get("featured");

      const floorId = url.searchParams.get("floorId");

      const zoneId = url.searchParams.get("zoneId");

      const page = Math.max(1, Number(url.searchParams.get("page")) || 1);

      const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit")) || 20));



      const matching = [...this.stands.values()]

        .filter((stand) => stand.eventId === eventId && stand.status === "active")

        .map((stand) => this.publicStand(stand, true))

        .filter((stand) => {

          const searchable = [stand.displayName, stand.company.displayName, stand.description ?? "", ...stand.tags]

            .join(" ")

            .toLocaleLowerCase();

          if (query && !searchable.includes(query)) return false;

          if (categoryId && !stand.categories.some((category) => (category as Record<string, unknown>).id === categoryId || (category as Record<string, unknown>).slug === categoryId)) return false;

          if (featured !== null && String(stand.featured) !== featured) return false;

          if (floorId && (stand.location as Record<string, unknown> | null)?.floorId !== floorId) return false;

          if (zoneId && (stand.location as Record<string, unknown> | null)?.zoneId !== zoneId) return false;

          return true;

        })

        .sort((left, right) => Number(right.featured) - Number(left.featured) || left.displayName.localeCompare(right.displayName));

      const total = matching.length;

      const items = matching.slice((page - 1) * limit, page * limit);

      return reply(200, {

        success: true,

        data: items,

        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },

      });

    }



    const publicStandDetailMatch = path.match(/^\/stands\/([^/]+)$/);

    if (method === "GET" && publicStandDetailMatch) {

      const stand = this.stands.get(publicStandDetailMatch[1]);

      if (!stand || stand.status !== "active") return reply(404, fail("STAND_NOT_FOUND"));

      return reply(200, ok(this.publicStand(stand)));

    }



    const user = this.userFromBearer(authorization);

    const companyMatch = path.match(/^\/companies\/([^/]+)(?:\/(stands|kpis))?$/);

    if (companyMatch && user) {

      const [, companyId, resource] = companyMatch;

      if (!user.roles.some((role) => role.companyId === companyId)) return reply(403, fail("INSUFFICIENT_PERMISSIONS"));

      const company = this.companies.get(companyId);

      if (!company) return reply(404, fail("COMPANY_NOT_FOUND"));

      if (method === "GET" && resource === "stands") return reply(200, ok([...this.stands.values()].filter((stand) => stand.companyId === companyId)));

      if (method === "GET" && resource === "kpis") {
        const companyStands = [...this.stands.values()].filter((stand) => stand.companyId === companyId);
        const standIds = new Set(companyStands.map((s) => s.id));
        let checkinCount = 0;
        const users = new Set<string>();
        for (const [sId, cList] of this.checkins.entries()) {
          if (standIds.has(sId)) {
            checkinCount += cList.length;
            for (const c of cList) users.add(c.userId);
          }
        }
        return reply(200, ok({
          activeStands: companyStands.length || 1,
          uniqueVisitors: 2 + users.size,
          totalCheckins: 3 + checkinCount,
          firstVisits: 2 + (checkinCount > 0 ? 1 : 0),
          activityAttendees: 0,
          redemptionsValidated: 0,
          unitsDelivered: 0,
        }));
      }

      if (method === "GET" && !resource) return reply(200, ok(company));

      if (method === "PATCH" && !resource) {

        if (!user.roles.some((role) => role.companyId === companyId && role.role === "company_admin")) return reply(403, fail("INSUFFICIENT_PERMISSIONS"));

        Object.assign(company, input);

        for (const account of this.users) {

          for (const role of account.roles) {

            if (role.companyId === companyId) role.companyName = String(company.displayName);

          }

        }

        return reply(200, ok(company));

      }

    }



    const standMatch = path.match(/^\/stands\/([^/]+)(?:\/(check-ins|qr))?$/);

    if (standMatch && user) {

      const [, standId, resource] = standMatch;

      const stand = this.stands.get(standId);

      if (!stand) return reply(404, fail("STAND_NOT_FOUND"));



      // Check-in de visitante mediante QR o NFC (abierto a todo usuario autenticado)

      if (method === "POST" && resource === "check-ins") {

        const credential = String(input.credential ?? "");

        const qr = [...this.qrCodes.values()].find((item) => item.standId === standId && item.token === credential);

        if (!qr) return reply(422, fail("QR_INVALID", "El código QR no es válido."));

        if (qr.isRevoked) return reply(422, fail("QR_REVOKED", "Este QR fue revocado."));

        if (Date.parse(qr.expiresAt) <= Date.now()) return reply(422, fail("QR_EXPIRED", "El código QR expiró."));

        if (qr.scanCount >= qr.maxScans) return reply(422, fail("QR_SCAN_LIMIT", "Este QR alcanzó su límite de escaneos."));



        qr.scanCount += 1;

        const list = this.checkins.get(standId) ?? [];

        const dailyDuplicate = list.some((item) => item.userId === user.id);

        const checkinId = crypto.randomUUID();

        const visitId = crypto.randomUUID();

        const pointsAwarded = dailyDuplicate ? 0 : 50;



        list.unshift({

          id: checkinId,

          standId,

          userId: user.id,

          method: "qr",

          acceptedAt: new Date().toISOString(),

        });

        this.checkins.set(standId, list);



        return reply(200, ok({

          checkinId,

          visitId,

          isFirstVisit: !dailyDuplicate,

          dailyDuplicate,

          pointsAwarded,

          scoreAwarded: pointsAwarded,

        }));

      }



      // Endpoints que requieren rol de operador sobre el stand

      if (!user.roles.some((role) => role.companyId === stand.companyId)) return reply(403, fail("INSUFFICIENT_PERMISSIONS"));

      if (method === "PATCH" && !resource) {

        if (!user.roles.some((role) => role.companyId === stand.companyId && role.role === "company_admin")) return reply(403, fail("INSUFFICIENT_PERMISSIONS"));

        Object.assign(stand, input);

        return reply(200, ok(stand));

      }

      if (method === "GET" && resource === "check-ins") {

        if (this.failCheckins) return reply(500, fail("CHECKINS_ERROR", "Error de conexión temporal."));

        return reply(200, ok(this.checkins.get(standId) ?? []));

      }

      if (method === "POST" && resource === "qr") {

        const ttlSeconds = Number(input.ttlSeconds ?? 60);

        const maxScans = Number(input.maxScans ?? 1);

        if (maxScans < 1 || maxScans > 1000) return reply(400, fail("VALIDATION_ERROR", "maxScans fuera de rango"));

        if (ttlSeconds < 10 || ttlSeconds > 3600) return reply(400, fail("VALIDATION_ERROR", "ttlSeconds fuera de rango"));



        const qrId = crypto.randomUUID();

        const token = nextId("stand-qr");

        const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();

        this.qrCodes.set(qrId, {

          qrId,

          standId,

          token,

          expiresAt,

          maxScans,

          scanCount: 0,

          isRevoked: false,

        });

        return reply(201, ok({ qrId, token, expiresAt }));

      }

    }

    const deleteQrMatch = path.match(/^\/qr\/([0-9a-f-]+)$/);

    if (method === "DELETE" && deleteQrMatch && user) {

      const qrId = deleteQrMatch[1];

      const qr = this.qrCodes.get(qrId);

      if (qr) qr.isRevoked = true;

      return reply(204);

    }



    const eventMatch = path.match(/^\/events\/([^/]+)(\/.*)$/);

    if (eventMatch && user) {

      const [, eventId, rest] = eventMatch;

      if (!user.roles.some((role) => role.eventId === eventId)) return reply(403, fail("INSUFFICIENT_PERMISSIONS"));

      const result = this.handleEvent(eventId, method, rest, body as Record<string, unknown> | undefined);

      if (result) return reply(result[0], result[1]);

    }



    if (method === "GET") return reply(200, ok([]));

    return reply(404, fail("NOT_FOUND"));

  }



  /** Datos del evento del organizador: KPIs, empresas, mapa, categorías, misiones y premios. */

  readonly event = {

    kpis: { activeStands: 2, pointsIssued: 520, uniqueVisits: 8, totalCheckins: 9, activityAttendees: 1, totalParticipants: 4, redemptionsValidated: 0 },

    companies: [

      { id: "ec000000-0000-4000-8000-000000000001", companyId: "c0000000-0000-4000-8000-000000000001", displayName: "Altura Labs", description: null, status: "active", standCount: 1 },

      { id: "ec000000-0000-4000-8000-000000000002", companyId: "c0000000-0000-4000-8000-000000000002", displayName: "Cafe Altiplano", description: null, status: "active", standCount: 1 },

      { id: "ec000000-0000-4000-8000-000000000003", companyId: "c0000000-0000-4000-8000-000000000003", displayName: "BioSalud Farmacéutica", description: null, status: "active", standCount: 1 },

    ],

    categories: [

      { id: "ca000000-0000-4000-8000-000000000001", slug: "gastronomia", label: "Gastronomía", colorToken: null, sortOrder: 1 },

    ] as Record<string, unknown>[],

    zones: [

      { id: "b0000000-0000-4000-8000-000000000001", floorId: "f0000000-0000-4000-8000-000000000001", name: "Bloque Rojo", shortCode: "R", description: "Pabellón I", colorToken: "red" },

    ] as Record<string, unknown>[],

    missions: [] as Record<string, unknown>[],

    rewards: [

      { id: "fe000000-0000-4000-8000-000000000001", name: "Taza FIPAZ", type: "merch", costPoints: 100, isActive: true, onHand: 50, available: 50, inventoryTracked: true },

    ] as Record<string, unknown>[],

    mapVersions: [

      { id: "d0000000-0000-4000-8000-000000000001", version: 1, status: "published", notes: "Plano local", publishedAt: GRANTED_AT },

      { id: "d0000000-0000-4000-8000-000000000002", version: 2, status: "draft", notes: "Borrador de ampliación", publishedAt: null },

    ] as Record<string, unknown>[],

  };



  private handleEvent(eventId: string, method: string, rest: string, input: Record<string, unknown> = {}): [number, unknown] | null {

    const event = this.event;

    const floor = { id: "f0000000-0000-4000-8000-000000000001", code: "PB", name: "Planta Baja", sortOrder: 1 };

    const byId = (list: Record<string, unknown>[], id: string) => list.find((item) => item.id === id);



    if (method === "GET") {

      if (rest.startsWith("/map/versions/") && rest.endsWith("/floors")) {

        return [200, ok([floor])];

      }

      switch (rest) {

        case "/kpis": {
          let extraCheckins = 0;
          for (const list of this.checkins.values()) {
            extraCheckins += list.length;
          }
          return [200, ok({
            ...this.event.kpis,
            totalCheckins: this.event.kpis.totalCheckins + extraCheckins,
            uniqueVisits: this.event.kpis.uniqueVisits + extraCheckins,
          })];
        }

        case "/companies": return [200, ok(event.companies)];

        case "/categories": return [200, ok(event.categories)];

        case "/manage/stands": {

          const list = [...this.stands.values()]

            .filter((s) => s.eventId === eventId)

            .map((s) => ({

              ...s,

              companyName: this.companies.get(String(s.companyId))?.displayName ?? s.displayName,

            }));

          return [200, ok(list)];

        }

        case "/missions": return [200, ok(event.missions)];

        case "/rewards": return [200, ok(event.rewards)];

        case "/leaderboard": return [200, ok([{ position: 1, userId: "u-1", displayName: "Saúl Prueba", avatarUrl: null, rankingScore: 130, level: 2 }])];

        case "/map/versions": return [200, ok(event.mapVersions)];

        case `/map/floors/${floor.id}/zones`: return [200, ok(event.zones)];

        case "/map": {

          const published = event.mapVersions.find((v) => v.status === "published") ?? event.mapVersions[0];

          const verNum = Number(published?.version ?? 1);

          return [200, ok({

            version: verNum,

            floors: [{

              ...floor, viewBox: "0 0 800 600", outline: "M0 0H800V600H0Z",

              zones: event.zones.map((zone) => ({ ...zone, path: "M20 20H400V300H20Z" })),

              stands: [{ standId: "5a000000-0000-4000-8000-000000000001", boothCode: "A-01", displayName: "Altura Labs", zoneId: event.zones[0]?.id ?? null, x: 0.25, y: 0.3 }],

            }],

          })];

        }

      }

    }



    if (method === "POST" && rest === "/stands") {

      const boothCode = String(input.boothCode ?? "").trim().toUpperCase();

      const companyId = String(input.companyId ?? "");



      const existingStand = [...this.stands.values()].find(

        (s) => s.eventId === eventId && String(s.boothCode ?? "").toUpperCase() === boothCode

      );

      if (existingStand) {

        return [409, fail("BOOTH_CODE_IN_USE", "El stand ya está asignado")];

      }



      const standId = crypto.randomUUID();

      const company = this.companies.get(companyId);

      const displayName = input.displayName ? String(input.displayName) : (company?.displayName ?? "Nuevo Stand");

      const newStand = {

        id: standId,

        eventId,

        companyId,

        eventCompanyId: crypto.randomUUID(),

        boothCode,

        displayName,

        description: input.description ? String(input.description) : null,

        tags: Array.isArray(input.tags) ? input.tags : [],

        visitPoints: 50,

        visitScore: 50,

        status: input.status ?? "active",

        eventName: "FIPAZ 2026",

        activityHighlight: null,

        promotionHighlight: null,

        createdAt: new Date().toISOString(),

        updatedAt: new Date().toISOString(),

      };

      this.stands.set(standId, newStand);

      const comp = this.event.companies.find((c) => c.companyId === companyId);

      if (comp) {

        comp.standCount = (comp.standCount ?? 0) + 1;

      }

      return [201, ok(newStand)];

    }



    if (method === "POST" && rest === "/categories") {

      const category = { id: crypto.randomUUID(), slug: input.slug, label: input.label, colorToken: input.colorToken ?? null, sortOrder: 0 };

      event.categories.push(category);

      return [201, ok(category)];

    }

    const categoryMatch = rest.match(/^\/categories\/([^/]+)$/);

    if (categoryMatch) {

      const category = byId(event.categories, categoryMatch[1]);

      if (!category) return [404, fail("CATEGORY_NOT_FOUND")];

      if (method === "PATCH") return [200, ok(Object.assign(category, input))];

      if (method === "DELETE") { event.categories.splice(event.categories.indexOf(category), 1); return [204, undefined]; }

    }

    const floorZoneMatch = rest.match(/^\/map\/floors\/([^/]+)\/zones$/);

    if (floorZoneMatch && method === "POST") {

      const newZone = {

        id: crypto.randomUUID(),

        floorId: floorZoneMatch[1],

        name: input.name,

        shortCode: input.shortCode ?? null,

        description: input.description ?? null,

        colorToken: input.colorToken ?? null,

      };

      event.zones.push(newZone);

      return [201, ok(newZone)];

    }



    const zoneMatch = rest.match(/^\/map\/zones\/([^/]+)$/);

    if (zoneMatch) {

      const zone = byId(event.zones, zoneMatch[1]);

      if (!zone) return [404, fail("ZONE_NOT_FOUND")];

      if (method === "PATCH") return [200, ok(Object.assign(zone, input))];

      if (method === "DELETE") {

        event.zones.splice(event.zones.indexOf(zone), 1);

        return [204, undefined];

      }

    }



    const versionMatch = rest.match(/^\/map\/versions\/([^/]+)$/);

    if (versionMatch && method === "PATCH") {

      const ver = byId(event.mapVersions, versionMatch[1]);

      if (!ver) return [404, fail("VERSION_NOT_FOUND")];

      if (input.status === "published") {

        for (const v of event.mapVersions) {

          if (v.status === "published") v.status = "retired";

        }

        ver.status = "published";

        ver.publishedAt = new Date().toISOString();

      }

      if (input.notes !== undefined) ver.notes = input.notes;

      return [200, ok(ver)];

    }



    if (method === "POST" && rest === "/rewards") {

      const initialStock = Number(input.initialStock) || 0;

      const reward = {

        id: crypto.randomUUID(),

        name: input.name,

        type: input.type ?? "physical",

        costPoints: Number(input.costPoints) || 100,

        isActive: true,

        description: input.description ?? null,

        onHand: initialStock,

        available: initialStock,

        inventoryTracked: true,

      };

      event.rewards.push(reward);

      return [201, ok(reward)];

    }



    const rewardMatch = rest.match(/^\/rewards\/([^/]+)$/);

    if (rewardMatch) {

      const reward = byId(event.rewards, rewardMatch[1]);

      if (!reward) return [404, fail("REWARD_NOT_FOUND")];

      if (method === "PATCH") return [200, ok(Object.assign(reward, input))];

      if (method === "DELETE") {

        event.rewards.splice(event.rewards.indexOf(reward), 1);

        return [204, undefined];

      }

    }



    if (method === "POST" && rest === "/missions") {

      if (input.mode === "categories" && !(input.categoryIds as unknown[] | undefined)?.length) return [400, fail("VALIDATION_ERROR")];

      const mission = {

        id: crypto.randomUUID(), title: input.title, description: input.description ?? null, mode: input.mode,

        targetCount: input.targetCount ?? 1, pointsReward: input.pointsReward ?? 0, isActive: true, featured: false,

      };

      event.missions.push(mission);

      return [201, ok(mission)];

    }

    const missionMatch = rest.match(/^\/missions\/([^/]+)$/);

    if (missionMatch) {

      const mission = byId(event.missions, missionMatch[1]);

      if (!mission) return [404, fail("MISSION_NOT_FOUND")];

      if (method === "PATCH") return [200, ok(Object.assign(mission, input))];

      if (method === "DELETE") { event.missions.splice(event.missions.indexOf(mission), 1); return [204, undefined]; }

    }

    return null;

  }

}

