import { expect, test, type Page, type Request } from "@playwright/test";

/**
 * Contra fexpo-backend real (puerto 3000, proxy /api/v1 de Next) y la BD local de
 * fexpo_database/local-dev, con las cuentas de prueba creadas por `scripts/set-password.mjs`.
 * Solo corre con `E2E_REAL_BACKEND=1`: `E2E_REAL_BACKEND=1 pnpm test:e2e real-backend`.
 */
test.skip(process.env.E2E_REAL_BACKEND !== "1", "Requiere el backend y la BD local levantados.");

const PASSWORD = process.env.E2E_PASSWORD ?? "Prueba1234!";
const EXHIBITOR_HOME = /\/panel\/mi-stand$/;
const ORGANIZER_HOME = /\/panel$/;

async function login(page: Page, email: string, panel: "expositor" | "organizador") {
  await page.route("https://accounts.google.com/**", (route) => route.abort());
  await page.goto(`/acceso?panel=${panel}`);
  const form = page.getByRole("form", { name: "Iniciar sesión" });
  await form.getByLabel("Correo").fill(email);
  await form.getByLabel("Contraseña", { exact: true }).fill(PASSWORD);
  await form.getByRole("button", { name: "Iniciar sesión" }).click();
  await expect(page).toHaveURL(panel === "expositor" ? EXHIBITOR_HOME : ORGANIZER_HOME);
}

function storedTokens(page: Page): Promise<{ accessToken: string; refreshToken: string }> {
  return page.evaluate(() => {
    const session = JSON.parse(sessionStorage.getItem("expovia-company-auth:v4") ?? "{}").state?.session;
    return { accessToken: session?.accessToken ?? "", refreshToken: session?.refreshToken ?? "" };
  });
}

test("expositor real: edita su stand, confirma persistencia y revoca su sesión", async ({ page }) => {
  test.setTimeout(90_000);
  await login(page, "expositor@fexpo.test", "expositor");
  await expect(page.getByRole("button", { name: /Expositor · / })).toBeVisible();
  const { accessToken, refreshToken } = await storedTokens(page);
  expect(accessToken).not.toBe("");
  expect(refreshToken).not.toBe("");

  await page.goto("/panel/mi-stand/editar");
  const description = page.getByLabel("Descripción");
  const originalDescription = await description.inputValue();
  const changedDescription = `Persistencia E2E ${Date.now()}`;
  let changedOnServer = false;
  let changedStandId = "";
  const writeFlow: string[] = [];
  const recordWriteFlow = (request: Request) => {
    const pathname = new URL(request.url()).pathname;
    if (
      (request.method() === "PATCH" && /\/api\/v1\/stands\/[^/]+$/.test(pathname))
      || (request.method() === "GET" && /\/api\/v1\/companies\/[^/]+\/stands$/.test(pathname))
    ) {
      writeFlow.push(`${request.method()} ${pathname}`);
    }
  };
  page.on("request", recordWriteFlow);
  try {
    await description.fill(changedDescription);
    const patchResponsePromise = page.waitForResponse((response) =>
      response.request().method() === "PATCH" && /\/api\/v1\/stands\/[^/]+$/.test(new URL(response.url()).pathname));
    const rereadResponsePromise = page.waitForResponse((response) =>
      response.request().method() === "GET" && /\/api\/v1\/companies\/[^/]+\/stands$/.test(new URL(response.url()).pathname));
    await page.getByRole("button", { name: "Guardar cambios" }).click();
    const patchResponse = await patchResponsePromise;
    changedStandId = new URL(patchResponse.url()).pathname.split("/").at(-1) ?? "";
    changedOnServer = patchResponse.ok();
    expect(patchResponse.ok()).toBe(true);
    expect((await rereadResponsePromise).ok()).toBe(true);
    const patchIndex = writeFlow.findIndex((request) => request.startsWith("PATCH "));
    const rereadIndex = writeFlow.findIndex((request, index) => index > patchIndex && request.startsWith("GET "));
    expect(patchIndex).toBeGreaterThanOrEqual(0);
    expect(rereadIndex).toBeGreaterThan(patchIndex);

    await expect(page).toHaveURL(EXHIBITOR_HOME);
    await expect(page.getByText(changedDescription)).toBeVisible();
    await page.reload();
    await expect(page.getByText(changedDescription)).toBeVisible();
  } finally {
    page.off("request", recordWriteFlow);
    if (changedOnServer && changedStandId) {
      const restoreResponse = await page.request.patch(`/api/v1/stands/${encodeURIComponent(changedStandId)}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        data: { description: originalDescription || null },
      });
      expect(
        restoreResponse.ok(),
        `No se pudo restaurar el stand real (${restoreResponse.status()}): ${await restoreResponse.text()}`,
      ).toBe(true);
    }
  }

  await page.getByRole("button", { name: /Expositor · / }).click();
  await page.getByRole("menuitem", { name: "Cerrar sesión", exact: true }).click();
  await expect(page).toHaveURL(/\/acceso\?panel=expositor/);

  // Criterio de aceptación de la #58: POST /auth/refresh con ese token da error.
  await expect.poll(async () => (await page.request.post("/api/v1/auth/refresh", { data: { refreshToken } })).status()).toBe(401);
});

test("expositor real: emite un código QR y lo revoca en el backend", async ({ page }) => {
  await login(page, "expositor@fexpo.test", "expositor");
  await page.goto("/panel/mi-stand/qr");
  await page.getByLabel("Máximo de escaneos").fill("50");
  await page.getByRole("button", { name: "Generar QR" }).click();

  await expect(page.getByRole("button", { name: "Revocar QR" })).toBeVisible();
  await expect(page.getByRole("note")).toContainText("Guárdalo ahora: no se puede recuperar al recargar");

  await page.getByRole("button", { name: "Revocar QR" }).click();
  await expect(page.getByRole("button", { name: "Revocar QR" })).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText("Código QR revocado");
});

test("organizador real: entra a su panel y vuelve a él desde rutas del expositor", async ({ page }) => {
  await login(page, "organizador@fexpo.test", "organizador");
  await expect(page.getByRole("complementary", { name: "Navegación del panel" }).getByRole("link", { name: "Expositores" })).toBeVisible();

  await page.goto("/panel/mi-stand");
  await expect(page).toHaveURL(/\/panel$/);
  await expect(page.getByRole("complementary", { name: "Navegación del panel" }).getByRole("link", { name: "Expositores" })).toBeVisible();
});

test("organizador real: cada pantalla de su panel carga datos del backend sin errores", async ({ page }) => {
  await login(page, "organizador@fexpo.test", "organizador");
  const main = page.getByRole("main");
  const screens: [string, RegExp | string][] = [
    ["/panel", "Cafe Altiplano"],
    ["/panel/expositores", "Cafe Altiplano"],
    ["/panel/metricas-evento", "Bloque Rojo"],
    ["/panel/mapa-evento", "Publicada"],
    ["/panel/zonas-categorias", "Bloque Rojo"],
    ["/panel/gamificacion", "Nueva misión"],
    ["/panel/eventos", "Evento activo"],
  ];
  for (const [path, text] of screens) {
    await page.goto(path);
    await expect(main.getByText(text).first(), path).toBeVisible();
    await expect(main.getByRole("alert"), path).toHaveCount(0);
  }
  await page.goto("/panel/expositores/5a000000-0000-4000-8000-000000000001");
  await expect(main.getByRole("heading", { name: "Cafe Altiplano" })).toBeVisible();
  await expect(main.getByRole("alert")).toHaveCount(0);
  await expect(page.getByText("Datos de demostración.")).toHaveCount(0);
});

test("cuenta real sin rol: ve 'Sin acceso' con la opción de registrar su empresa", async ({ page }) => {
  await page.route("https://accounts.google.com/**", (route) => route.abort());
  await page.goto("/acceso?panel=expositor");
  const form = page.getByRole("form", { name: "Iniciar sesión" });
  await form.getByLabel("Correo").fill("sinrol@fexpo.test");
  await form.getByLabel("Contraseña", { exact: true }).fill(PASSWORD);
  await form.getByRole("button", { name: "Iniciar sesión" }).click();

  await expect(page.getByRole("heading", { name: "Sin acceso al panel" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Registrar mi empresa" })).toBeVisible();
});

test("contraseña incorrecta contra el backend real", async ({ page }) => {
  await page.route("https://accounts.google.com/**", (route) => route.abort());
  await page.goto("/acceso?panel=expositor");
  const form = page.getByRole("form", { name: "Iniciar sesión" });
  await form.getByLabel("Correo").fill("expositor@fexpo.test");
  await form.getByLabel("Contraseña", { exact: true }).fill("no-es-la-clave");
  await form.getByRole("button", { name: "Iniciar sesión" }).click();
  await expect(form.getByRole("alert")).toHaveText("Correo o contraseña incorrectos.");
});
