/* eslint-disable @typescript-eslint/no-require-imports -- Runner `node:test` sobre TypeScript (ver test-utils/register-ts.cjs). */
require("../../../test-utils/register-ts.cjs");

const { test, before, afterEach } = require("node:test");
const assert = require("node:assert/strict");

// http-client resuelve la URL base con `window`; en Node (sin `window`) exige BACKEND_URL.
before(() => { process.env.BACKEND_URL = "http://fake-backend.test"; });

const { exhibitorApi } = require("@/lib/api/exhibitor");

function envelope(data) {
  return { success: true, data, meta: null };
}

function json(status, body) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

/** Reemplaza `fetch` por una única respuesta y registra la petición enviada (sin parsear el body: puede ser FormData). */
function mockFetchOnce(response) {
  let call = null;
  globalThis.fetch = async (url, init = {}) => {
    call = { path: String(url).replace(/^.*\/api\/v1/, ""), method: init.method, headers: init.headers ?? {}, body: init.body };
    return response;
  };
  return () => call;
}

const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });

test("uploadLogo: envía el archivo como multipart (FormData), sin forzar Content-Type", async () => {
  const uploaded = { id: "f0000000-0000-4000-8000-000000000001", path: "/api/v1/uploads/f0000000-0000-4000-8000-000000000001", url: "/api/v1/uploads/f0000000-0000-4000-8000-000000000001", fileName: "logo.png", mimeType: "image/png", size: 1024 };
  const getCall = mockFetchOnce(json(201, envelope(uploaded)));

  const file = new File([new Uint8Array([1, 2, 3])], "logo.png", { type: "image/png" });
  const result = await exhibitorApi.uploadLogo(file);

  const call = getCall();
  assert.equal(call.method, "POST");
  assert.equal(call.path, "/uploads");
  // El navegador debe fijar el boundary del multipart; forzarlo a mano lo rompería.
  assert.equal(call.headers["Content-Type"], undefined);
  assert.ok(call.body instanceof FormData, "el body debe ser FormData, no JSON serializado");
  assert.equal(call.body.get("file"), file);
  assert.deepEqual(result, uploaded);
});

test("updateStand: incluye logoPath y website en el PATCH cuando se envían", async () => {
  const getCall = mockFetchOnce(json(200, envelope({ id: "5a000000-0000-4000-8000-000000000001" })));

  await exhibitorApi.updateStand("5a000000-0000-4000-8000-000000000001", {
    logoPath: "/api/v1/uploads/f0000000-0000-4000-8000-000000000001",
    website: "https://alturalabs.bo",
  });

  const call = getCall();
  assert.equal(call.headers["Content-Type"], "application/json");
  assert.deepEqual(JSON.parse(call.body), {
    logoPath: "/api/v1/uploads/f0000000-0000-4000-8000-000000000001",
    website: "https://alturalabs.bo",
  });
});
