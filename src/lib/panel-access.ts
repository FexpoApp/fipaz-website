import { PANEL_NAVIGATION, type PanelRole } from "@/config/panel-navigation";
import type { ActiveEventSummary, AppRole, RoleAssignment } from "@/lib/api/company-auth";

/** Lo mínimo que estas funciones necesitan de una sesión (evita acoplarlas al store). */
export interface SessionRoles {
  roles: readonly RoleAssignment[];
  activeRoleId: string | null;
  /** Opcional para aceptar sesiones v4 persistidas antes de que `/auth/me` incluyera el campo. */
  activeEvent?: ActiveEventSummary | null;
}

export interface OrganizerEventScope {
  eventId: string;
  eventName: string;
}

/** Panel al que da acceso cada rol del backend. */
const PANEL_BY_ROLE: Record<AppRole, PanelRole> = {
  company_admin: "expositor",
  company_staff: "expositor",
  event_admin: "organizador",
  super_admin: "organizador",
};

export const PANEL_LABELS: Record<PanelRole, string> = {
  expositor: "Expositor",
  organizador: "Organizador",
};

export function panelForRole(role: AppRole): PanelRole {
  return PANEL_BY_ROLE[role];
}

/** Rol con el que la persona está operando ahora (el elegido, o el primero si el elegido ya no existe). */
export function getActiveRole(session: SessionRoles | null | undefined): RoleAssignment | null {
  if (!session) return null;
  return session.roles.find((role) => role.id === session.activeRoleId) ?? session.roles[0] ?? null;
}

export function getActivePanel(session: SessionRoles | null | undefined): PanelRole | null {
  const role = getActiveRole(session);
  return role ? panelForRole(role.role) : null;
}

/** Roles de la sesión que dan acceso a un panel concreto. */
export function getRolesForPanel(session: SessionRoles | null | undefined, panel: PanelRole): RoleAssignment[] {
  return session?.roles.filter((role) => panelForRole(role.role) === panel) ?? [];
}

export function hasPanelAccess(session: SessionRoles | null | undefined, panel: PanelRole): boolean {
  return getRolesForPanel(session, panel).length > 0;
}

/** Paneles a los que puede entrar la sesión (en orden estable: expositor primero). */
export function getAvailablePanels(session: SessionRoles | null | undefined): PanelRole[] {
  return (["expositor", "organizador"] as const).filter((panel) => hasPanelAccess(session, panel));
}

/** Empresa a la que está acotado el rol activo (solo roles de expositor). */
export function getActiveCompany(session: SessionRoles | null | undefined): { id: string; name: string } | null {
  const role = getActiveRole(session);
  return role?.companyId ? { id: role.companyId, name: role.companyName ?? "Mi empresa" } : null;
}

/**
 * Evento administrado por el rol activo. Un `event_admin` siempre conserva el alcance de su rol;
 * un `super_admin`, que no trae `eventId` en el rol, usa el evento activo resuelto por `/auth/me`.
 */
export function getOrganizerEvent(session: SessionRoles | null | undefined): OrganizerEventScope | null {
  const role = getActiveRole(session);
  if (role?.role === "event_admin" && role.eventId) {
    const activeName = session?.activeEvent?.id === role.eventId ? session.activeEvent.name : null;
    return { eventId: role.eventId, eventName: role.eventName ?? activeName ?? "el evento" };
  }
  if (role?.role === "super_admin" && session?.activeEvent) {
    return { eventId: session.activeEvent.id, eventName: session.activeEvent.name };
  }
  return null;
}

/**
 * Si el rol activo puede editar los datos de la empresa. `company_staff` opera el stand pero no
 * la empresa: el backend le responde 403 en `PATCH /companies/:id`, así que no se le ofrece.
 */
export function canEditCompany(session: SessionRoles | null | undefined): boolean {
  const role = getActiveRole(session)?.role;
  return role === "company_admin" || role === "super_admin";
}

/** Texto corto para identificar un rol en menús: "Mi Empresa" o "FIPAZ 2026". */
export function describeRole(role: RoleAssignment): string {
  if (role.role === "super_admin") return "Plataforma";
  return role.companyName ?? role.eventName ?? PANEL_LABELS[panelForRole(role.role)];
}

/**
 * Panel que exige una ruta de `/panel/*`, o `null` si es común (el resumen `/panel`).
 * Se deduce de la navegación: la entrada de menú con el prefijo más largo que coincida.
 */
export function requiredPanelForPath(pathname: string): PanelRole | null {
  let match: { href: string; role: PanelRole } | null = null;
  for (const item of PANEL_NAVIGATION) {
    if (item.href === "/panel") continue;
    const matches = pathname === item.href || pathname.startsWith(`${item.href}/`);
    if (matches && (!match || item.href.length > match.href.length)) match = item;
  }
  return match?.role ?? null;
}

/** Pantalla de acceso a la que se envía a quien no tiene sesión o permiso para un panel. */
export function accessRoute(panel?: PanelRole | null): string {
  return panel ? `/acceso?panel=${panel}` : "/acceso";
}
