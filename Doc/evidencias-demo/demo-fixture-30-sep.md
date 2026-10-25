# Fixture demo FIPAZ 2026 — guía de ejecución

**Estado:** alineado con el contrato `fexpo_global_docs/demo-fixture-30-sep.md`. Los datos son ficticios y no constituyen una confirmación oficial de FIPAZ.

**Evento:** `event-fipaz-2026` · **FIPAZ 2026** · La Paz, Bolivia. En la interfaz, fechas y recinto aparecen como **sujetos a confirmación**. El código web contiene horarios de ejemplo para actividades; esos horarios no son una confirmación de FIPAZ.

## Fixture propuesto

Los tres stands seleccionados son ficticios. Sus códigos, bloques, categorías, actividades y promociones coinciden con el mock móvil.

| Stand | Código | Bloque propuesto | Categoría | Actividad de ejemplo | Promoción de ejemplo |
| --- | --- | --- | --- | --- | --- |
| Altura Labs | B-117 | B · Amarillo | Tecnología | Demo en vivo de asistente de voz en quechua · 16:00 | 30 % de descuento en plan Starter |
| Kawsay Salud | R-24 | R · Rojo | Salud | Consulta rápida de bienestar | Control de presión sin costo |
| Sabor Andino | G-08 | G · Verde | Gastronomía | Degustación de singani de altura | Degustación 11:00 a 13:00 |

**Misión de ejemplo:** Ruta FIPAZ — visitar Altura Labs, Kawsay Salud y Sabor Andino una vez cada uno.

**Regla de puntos:** una visita nueva y única suma 50 puntos; repetir el check-in del mismo stand suma 0 puntos. Completar la Ruta FIPAZ no añade un bono aparte; los puntos ya se acreditan por las visitas. El estado web de inicio representa dos visitas de ejemplo: 2 de 3 stands y 100 puntos. Al visitar el tercer stand: 3 de 3 y 150 puntos.

## Sincronización por superficie

| Dato | Web `/demo` | Panel `/panel` | App móvil | ¿Se sincroniza en vivo? |
| --- | --- | --- | --- | --- |
| Evento e `eventId` | `event-fipaz-2026`, fixture local | Evento real resuelto desde la sesión del organizador | El ID comunicado para sus mocks es `event-fipaz-2026` | No |
| Stands, códigos, categoría, actividad y promoción | Catálogo local `src/data/demo-fixture.ts` | Directorio y detalle consultan siempre la API; nunca importan este fixture | Mock móvil contrastado mediante pruebas locales | No |
| Misión y puntos | Store de demo del navegador | Datos del backend del evento activo | Store/backend simulado móvil según el contrato recibido | No |
| Visitas y progreso | Estado persistido en el navegador | Check-ins y métricas del backend | Estado local/mock de la app | No |
| Premios | Catálogo ilustrativo; la acción de canje es una simulación local | Datos del backend | No verificado contra el repositorio móvil | No |
| Fechas y recinto | No se anuncian como confirmados | Datos del evento asignado a la sesión | Portada con aviso de confirmación | No |

El panel y la app tienen estados separados. Compartir el mismo identificador o copiar el fixture no transmite visitas, puntos, premios ni cambios de perfil entre superficies. No existe un puente web↔móvil implementado y probado en este alcance.

## Frase para presentación

> “Esta es una demostración con stands ficticios: cada primera visita suma 50 puntos y repetir el check-in suma cero. Los premios son propuestas; las fechas y el recinto de FIPAZ 2026 están sujetos a confirmación.”

## Preparación y pruebas

- `/demo` no requiere flags: carga únicamente sus módulos y fixtures locales.
- Para revisar `/panel/expositores`, iniciar sesión como organizador con un evento asignado y levantar el backend. El panel no cambia a datos demo cuando la API falla.
- Reiniciar `/demo`: dos visitas y 100 puntos; Sabor lleva a 150 y 3/3. Un navegador nuevo también inicia con dos visitas, no con cero.
- En móvil mock, iniciar con cero. El check-in se confirma localmente; la cola pendiente del flujo API se prueba por separado y no acredita puntos antes de confirmar.
- Ejecutar `node scripts/check-demo-fixture.cjs` desde la raíz web con dependencias instaladas y `../fexpo-expo-app` disponible. Verifica el fixture exclusivo de `/demo`, que el adaptador de `/panel` siempre use HTTP, puntos, duplicados, misión y pendientes con almacenamiento simulado.

## Resultado de la validación local

- `node scripts/check-demo-fixture.cjs`: verifica fixtures aislados, adaptador HTTP del panel, mock explícito de `/admin`, propagación de errores HTTP, duplicados, puntos, misión y pendientes.
- TypeScript (`tsc --noEmit`): aprobado.
- Las capturas históricas del directorio con fixtures ya no representan `/panel`; la demostración local se valida exclusivamente en `/demo`.
- Para repetir el navegador de `/demo`: iniciar Next en `127.0.0.1:3100` y ejecutar `node scripts/check-demo-browser.cjs` (requiere Edge).
