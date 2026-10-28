# Fexpo · Guía de marca · v1.0 — Referencia completa para agentes

> Fuente: `Fexpo · Guía de marca · v1.0.pdf` (PROPUESTA v1.0 / octubre 2026, revisión general del 21 de octubre de 2026, base documentada en Notion).
> Este documento transcribe TODAS las reglas y especificaciones de la guía de marca
> para que cualquier agente que trabaje en el sitio web, la PWA, los paneles o
> materiales de Fexpo las cumpla sin necesidad de abrir el PDF.
> Los datos marcados como "propuesta" u "orientativo" son decisiones aún no aprobadas
> formalmente, pero deben respetarse hasta que haya una versión aprobada.

---

## 1. Qué es Fexpo

Plataforma multiferia que **conecta la exploración del visitante con la actividad
real de cada stand**. Primer piloto: **FIPAZ 2026**.

Tres públicos, cada uno con su foco:

| Público | Foco |
|---|---|
| Visitante | Orientación, descubrimiento y progreso visible |
| Expositor | Presencia de marca y visitas verificadas |
| Organizador | Mapa, operación y métricas del evento |

## 2. Personalidad y promesa (OBLIGATORIO en todo copy)

Dirección de marca propuesta a partir de los públicos y la experiencia del producto.

**Promesa / eslogan**: "Explora la feria. Encuentra tu próxima conexión."

Tres atributos que definen cómo se comunica:

1. **Clara**: una sola instrucción por momento. Mensajes cortos y lenguaje cotidiano.
2. **Activa**: invita a recorrer, descubrir y participar, **sin exagerar los premios**.
3. **Confiable**: distingue siempre datos confirmados, pendientes y demostraciones.

## 3. Logo: lectura y construcción

- Tipografía del logo original: **sans geométrica de peso alto**, con la «o» circular
  y la «e» abierta que equilibran el peso; minúsculas que aportan cercanía.
- Equivalente tipográfico propuesto: **Poppins ExtraBold 800**.
- El símbolo son **tres módulos inclinados** que sugieren avance.
- El rótulo «02 · MÓDULOS» que acompaña al logo original se interpreta como rótulo
  editorial y **queda excluido de las firmas de marca** (nunca reproducirlo).

### 3.1 Sistema de firmas

| Firma | Descripción | Uso |
|---|---|---|
| **Vertical** (principal) | Símbolo encima, nombre debajo; conserva la proporción de la referencia original | Portadas, señalética, piezas con espacio vertical. **Uso preferente** |
| **Horizontal** | Adaptación propuesta | Cabeceras, banners y piezas apaisadas |
| **Isotipo** | Solo el símbolo | Avatar y espacios pequeños |
| **Logotipo** | Solo el nombre | Firma secundaria cuando el contexto ya identifica a Fexpo |

Reglas:

- El nombre siempre aparece en **minúsculas** (`fexpo`).
- El símbolo mantiene siempre sus **tres módulos**; nunca se altera su dibujo.
- La firma vertical conserva la composición aportada; la horizontal es una
  adaptación propuesta.
- Antes de producir a gran escala, **cotejar la reconstrucción vectorial con el
  archivo maestro del logo**.

### 3.2 Versiones cromáticas de la firma

Una sola tinta por firma. **El contraste del fondo decide la versión**:

- Azul sobre marfil
- Blanco sobre azul
- Azul sobre lima
- Blanco sobre negro

### 3.3 Área de protección y tamaño mínimo (OBLIGATORIO)

- `x = 1/8` del ancho de la firma vertical → reservar **al menos `x` alrededor**.
- Para la firma horizontal y el isotipo: `x = 1/4` de la altura del símbolo.

Mínimos iniciales:

| Firma | Digital | Impresión |
|---|---|---|
| Vertical | 96 px de ancho | 24 mm de ancho |
| Horizontal | 160 px de ancho | 40 mm de ancho |
| Isotipo | 24 px de alto | 8 mm de alto |

- **Validar los mínimos en el soporte final.**
- Bordado: altura del isotipo recomendada de **30 mm o mayor**.

### 3.4 Usos prohibidos del logo (los 6 casos de la guía)

1. **Deformación** — no estirar ni comprimir.
2. **Giro del símbolo** — no rotar los módulos ni la firma.
3. **Color ajeno** — solo las tintas de la paleta.
4. **Bajo contraste** — la versión cromática debe garantizar legibilidad.
5. **Tipografía sustituta** — nunca reemplazar Poppins en el wordmark.
6. **Elementos invasivos** — nada cruza ni tapa la firma; respetar el área `x`.

El dibujo y la relación entre símbolo y nombre se mantienen estables siempre.

## 4. Paleta de colores (valores exactos)

| Color | HEX | RGB | CMYK (orientativo) | Rol |
|---|---|---|---|---|
| **Azul feria** | `#132D46` | 19, 45, 70 | 73, 36, 0, 73 | Confianza: color principal de la plataforma |
| **Lima activa** | `#D5F24A` | 213, 242, 74 | 12, 0, 69, 5 | Energía: acciones y momentos del recorrido |
| **Marfil** | `#F5F4EF` | 245, 244, 239 | 0, 0, 2, 4 | Neutro: fondos que sostienen la lectura |
| **Tinta** | `#111820` | 17, 24, 32 | 47, 25, 0, 87 | Neutro oscuro |
| **Gris lectura** | `#626D78` | 98, 109, 120 | 18, 9, 0, 53 | Neutro: información secundaria |

- Proporción orientativa de composición: **55% neutro / 30% azul / 10% lima / 5% tinta**.
- El lima **destaca acciones y momentos**; los fondos neutros sostienen la lectura.
- ⚠️ CMYK orientativo por conversión matemática: en impresión ajustar con perfil
  ICC, material y prueba de color del proveedor.

## 5. Contraste y accesibilidad (OBLIGATORIO, WCAG 2.2)

Ratios calculados en sRGB:

| Combinación | Ratio | Veredicto |
|---|---|---|
| Azul sobre marfil | **12,79:1** | Apto para texto |
| Lima sobre azul | **11,15:1** | Apto para texto |
| Blanco sobre lima | **1,26:1** | **EVITAR en texto** |

- Mínimo WCAG AA: **4,5:1** en texto normal y **3:1** en texto grande.
- Toda combinación texto/fondo del producto debe cumplir AA.

## 6. Tipografía

Familia única: **Poppins** (Google Fonts). Geométrica, cercana y legible.
Incluye acentos y signos españoles (á é í ó ú ü ñ ¿? ¡!) y el set numérico/símbolos.

### 6.1 Jerarquías y escala (digital)

| Rol | Peso | Tamaño | Interlineado |
|---|---|---|---|
| Titular | Bold 700 | 48–72 px | 105–115% |
| Subtítulo | SemiBold 600 | — | — |
| Texto | Regular 400 | 16–20 px | 145–160% |
| Etiqueta | Medium 500 | 12–14 px | — |

### 6.2 Reglas de composición tipográfica

- **Alineación a la izquierda.**
- **Máximo dos pesos por pieza.**
- **Mayúsculas solo en rótulos breves.**
- En impresión manda la **distancia de lectura** (los tamaños digitales son referencia).

## 7. Lenguaje gráfico modular

- Los tres módulos del símbolo pueden funcionar como **recurso secundario**.
- Reglas: **un acento por composición**; mantener la **inclinación original**
  de los módulos; **un patrón nunca reemplaza la firma** (la firma va intacta
  y el módulo solo acompaña como acento).

## 8. Retícula y jerarquía de piezas

Para piezas promocionales (editable, proporciones orientativas):

1. **Margen exterior**: 5–7% del lado corto.
2. **Una idea principal**: titular breve y una acción.
3. **Una firma visible**: sin competir con el mensaje.

⚠️ **El área de protección de la firma prevalece sobre la retícula.**

## 9. Voz y mensajes (OBLIGATORIO en todo texto de producto)

Comunicación cercana, con instrucciones concretas y **promesas verificables**.

### 9.1 Ejemplos válidos de la guía

- Invitación:
  - "Encuentra tu próximo stand."
  - "Guarda tus favoritos para volver."
- Estados del producto (ejemplos):
  - "Visita pendiente de confirmación."
  - "Misiones: próxima publicación."

### 9.2 Mensajes que se EVITAN

- ❌ "Escanea este anuncio y gana puntos" (no exagerar premios).
- ❌ "Premios garantizados para todos".
- ❌ "Descarga la app en las tiendas".

Criterio transversal: **las promesas coinciden con el estado del producto**.

## 10. Aplicaciones en objetos (especificaciones de arte)

- Gorra, tote bag y stickers existen como mockups generados con IA (solo
  visualización conceptual); **el arte de referencia son las aplicaciones planas**.

### 10.1 Gorra

- Isotipo **bordado**, frente centrado.
- Alto **30–40 mm**, **una tinta**.
- Requerir prueba sobre muestra textil.

### 10.2 Tote bag

- **Firma vertical**, área orientativa **140 × 230 mm**.
- Serigrafía azul sobre algodón natural.

### 10.3 Stickers (tres formatos, todos en una sola tinta)

| Formato | Medida | Contenido | Uso |
|---|---|---|---|
| Circular | 50 mm | Isotipo centrado | Promocional |
| Rectangular | 80 × 40 mm | Wordmark | Objetos estrechos |
| Vertical | 45 × 70 mm | Firma completa | Identificación |

## 11. Presencia física en la feria

### 11.1 Roll-up de bienvenida

- Formato propuesto: **85 × 200 cm**.
- Orden de lectura obligatorio:
  1. Firma en el **tercio superior**.
  2. Titular central, **corto y con alto contraste**.
  3. Una **llamada a la acción al final**.
- Producción:
  - Margen lateral inicial: **5 cm**.
  - Reserva inferior: **10–15 cm según cassette**.
  - Texto principal orientativo: **120–180 pt**.
- Mensaje legible desde el pasillo.

### 11.2 Banner físico

- Formato propuesto: **300 × 100 cm**. Firma y mensaje con **lectura a distancia**.
- Margen seguro inicial: **10 cm**.
- Reservar **costuras y ojales**.
- **Evitar información pequeña y URLs largas**.

## 12. Redes sociales

Plantillas editables en tres formatos:

| Formato | Medida |
|---|---|
| Publicación cuadrada 1:1 | 1080 × 1080 px |
| Vertical 4:5 | 1080 × 1350 px |
| Story 9:16 | 1080 × 1920 px |

- Margen de contenido **≥ 6%**.
- En stories, reservar **14% superior e inferior** para la interfaz
  (sujeto a la plataforma).

## 13. Banner digital y firma de correo

- Banner base: **1200 × 300 px**.
- Firma de correo: **nombre, rol y sitio web (`fexpo.lat`) como texto real**
  (nunca imagen).

## 14. Isotipo en entornos digitales

| Aplicación | Reglas |
|---|---|
| **Icono de app** | Área segura central para recortes; **sin esquinas incluidas** en el arte |
| **Avatar de redes** | Símbolo completo; comprobar el recorte circular a tamaño real |
| **Favicón** | Probar en **16, 32 y 48 px**; sin nombre ni detalles nuevos |

## 15. Convivencia con marcas de eventos

- **Fexpo conserva su identidad en cada edición y feria.**
- El evento (p. ej. "FIPAZ 2026") se muestra como **texto de referencia**,
  posicionado como "tecnología para la experiencia del visitante".
- Incorporar el logo oficial de un evento **solo con autorización y archivo válido**.

## 16. Producción y control de calidad (checklist obligatorio)

### Archivos
- Logos en **SVG o PDF vectorial**.
- Digital en **sRGB**.
- Impresión con el **perfil ICC del proveedor**.

### Materiales
- Probar **bordado y serigrafía** antes de producción.
- Verificar el **lima sobre el soporte real**.
- Ajustar **sangrado, troquel y costuras**.

### Revisión de cada pieza (antes de publicar o fabricar)
- [ ] Proporción intacta.
- [ ] Espacio de protección respetado.
- [ ] Contraste correcto.
- [ ] Texto legible y **enlaces comprobados**.
- [ ] Las promesas coinciden con el estado del producto.

## 17. Estado de las decisiones

**Decisiones propuestas** (aplicar hasta que exista versión aprobada):
- Paleta azul y lima.
- Poppins como equivalente tipográfico.
- Firma horizontal y sistema de aplicaciones.
- Medidas mínimas y reglas de producción.

**Pendiente de aprobación:**
- Cotejo con vector maestro del logo.
- Pruebas de color y materiales.
- Validación de mensajes con producto.

## 18. Fuentes citadas por la guía

- Documentación del proyecto Fexpo (Notion): 01 · Visión y alcance del producto,
  05 · Frontend · Web y paneles, 06 · App del visitante PWA.
- Poppins / Google Fonts.
- WCAG 2.2 (contraste).

---

### TL;DR para agentes (reglas que no se pueden romper)

1. Colores exactos: azul `#132D46`, lima `#D5F24A`, marfil `#F5F4EF`, tinta `#111820`, gris `#626D78`.
2. Tipografía **Poppins**: titulares 700, subtítulos 600, texto 400, etiquetas 500; máx. 2 pesos por pieza; alineación izquierda.
3. Contraste AA siempre (≥ 4.5:1 / 3:1). **Nunca texto blanco sobre lima.**
4. Logo en minúsculas, símbolo intacto (sin deformar/girar/recolor), una tinta por firma, área de protección `x` alrededor siempre.
5. Lima solo como acento (≈10% de la composición), para acciones y momentos.
6. Copy corto, una instrucción por momento, promesas verificables; nada de premios exagerados ni "descarga la app en las tiendas".
7. Estados del producto claros: confirmado / pendiente / demostración.
