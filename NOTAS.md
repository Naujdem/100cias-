# Notas de trabajo · 100cias

Última actualización: 28 oct 2026.

## Qué es
App de material didáctico interactivo de ciencias naturales (React + Vite + Tailwind, PWA). Empieza con biología celular; la estructura permite sumar física, química y otras materias.

## Idea central
- Cada tema guarda **todo** su contenido en un archivo JSON.
- Cada curso o docente elige qué se muestra con **perfiles** y **casillas**; los grados son etiquetas de los perfiles, no carpetas.
- Los bloques pueden tener **requisitos** (activar uno activa sus bases) y un **núcleo** que no se puede apagar.
- El quiz solo pregunta lo que está activo.
- Todo contenido nuevo entra como `"revisado": false` (se ve como «Borrador») hasta que una persona lo verifique contra una fuente.
- El plan de área del colegio es solo guía, no fuente oficial.

## Estructura
```
src/data/schema.ts                          tipos: Bloque, Tema, Capa, Dibujo, Perfil
src/data/materias/<materia>/<area>/*.json   un archivo por tema
src/data/perfiles.json                      perfiles (6°, 9°, 11°)
src/lib/seleccion.ts                        activar/desactivar con núcleo y dependencias
src/components/                             SelectorContenido, LineaTiempo, DetalleBloque, Quiz, Insignia
src/components/diagramas/                   diagramas SVG interactivos y su registro
src/components/Retrato.tsx                  retrato enmarcado de un autor
src/components/VisorZoom.tsx                visor con zoom y desplazamiento
src/components/Ilustraciones.tsx            tira de imágenes del hito
src/components/ilustraciones/               ilustraciones SVG y su registro
public/imagenes/                            imágenes de archivo (con crédito y licencia en el JSON)
src/lib/usePantallaCompleta.ts              pantalla completa con respaldo
src/components/linea/                       vistas de la línea de tiempo (registro en vistas.ts), miniaturas
scripts/validate-data.mjs                   valida los JSON (npm run check:data)
scripts/seleccion.test.ts                   pruebas de la lógica (npm test)
```

## Comandos
- `npm run dev` · `npm run build` · `npm test` · `npm run check:data`

## Hecho
- Esqueleto del proyecto, PWA, modo claro/oscuro.
- Esquema de datos (bloques, autores, diagramas, capas, perfiles).
- Subtema 1.1 «Postulados de la teoría celular»: 8 hitos (Hooke, Leeuwenhoek, Schleiden, Schwann, Virchow, Pasteur, endosimbiosis, teoría moderna) con fichas y 9 preguntas, todos en borrador.
- Línea de tiempo **horizontal**. Al tocar el «+», la imagen o el texto de un hito se abre un **recuadro emergente** (fondo oscuro; se cierra con la X, Esc o tocando fuera; el foco vuelve al hito).
- **Ficha del hito** (diseño de JuanMed en Paint): a la izquierda el retrato enmarcado con placa de nombre y descripción debajo; a la derecha las pestañas Historia, Diagrama (si existe) y Evidencia y límites. Sin imagen propia se muestra una silueta ilustrativa; para poner una imagen real libre de derechos, usar `autor.imagen`. Los autores adicionales aparecen bajo la descripción.
- **Visor con zoom** (`VisorZoom`): botones +/−/1×, pellizco, doble toque, Ctrl + rueda y arrastre. Se usa en el diagrama del corcho y en las ilustraciones de cada hito.
- **Ilustraciones por hito** (`bloque.ilustraciones`): tira «Mira de cerca» en la pestaña Historia. Hooke tiene el corcho, el microscopio (SVG propios, esquemáticos) y la lámina original de *Micrographia* (1665, dominio público, en `public/imagenes/`). Toda imagen de archivo debe llevar `credito` y `alt` (lo exige `npm run check:data`).
- **Pantalla completa** de la línea de tiempo (API nativa con respaldo para iPhone); el recuadro funciona dentro de ella.
- **Vistas intercambiables** de la línea de tiempo con selector «Ver como» (se recuerda la elección): *Alternada* (hitos arriba y abajo de la línea, con tallo, año, texto e imagen enmarcada; inspirada en la plantilla «Timeline Educación» de Genially) y *Tarjetas*. Para agregar una plantilla nueva: crear un componente que reciba `PropsVista` y añadirlo a `src/components/linea/vistas.ts`.
- Miniaturas de los hitos: ilustración propia si existe (hoy solo Hooke); si no, iniciales del autor como marcador de posición.
- **Diagrama interactivo del corcho de Hooke** (control de aumento y puntos tocables). Registro de diagramas en `src/components/diagramas/index.ts`; para agregar uno se crea el componente y se pone su id en `bloque.diagrama`.
- **Comparativo corcho ↔ celdas de monasterio**: al acercar (≥ 4,5×) aparece el botón «Comparar con celdas de monasterio» (tecla `C`) con dos dibujos esquemáticos y tres parecidos; explica el origen de la palabra «célula». Borrador.
- **Hooke ampliado (28 oct, 2.ª pasada)**: la pestaña Diagrama tiene tres actividades: *Explorar el corcho*, *Su dibujo* (lámina de Micrographia por zonas: completa, corte A, corte B) y *Calcula como Hooke* (rehacer la cuenta de 60 cavidades en 1/18 de pulgada → pulgada cúbica). La pestaña Historia suma `ficha.contexto` (por qué corcho, panal y monasterio, otras plantas, Malpighi y Grew, el libro). Origen del nombre corregido: Hooke habló de un panal; *cellula* = «cuarto pequeño». Quiz de Hooke: 4 preguntas.
- **Leeuwenhoek ampliado (28 oct)**: mismo molde que Hooke. Diagrama `gota-leeuwenhoek` con dos actividades (*Mira una gota*: aumento, animálculos que se mueven —respeta «reducir movimiento»— y bacterias tocables; *¿Qué tan pequeño?*: eje logarítmico de 1 µm a 1 mm con el límite del ojo y el de sus lentes). Dos ilustraciones propias (su microscopio, la gota), `ficha.contexto` con cinco datos y 4 preguntas. Sigue con silueta (sin retrato) y todo en borrador.
- **Schleiden y Schwann ampliados (28 oct)**: comparten el componente `TejidosCelulas` (claves `tejido-planta` y `tejido-animal`, que solo cambian la pestaña inicial): *Tejido vegetal* y *Tejido animal* con partes que se resaltan al tocar (pared, núcleo, vacuola, cloroplastos / membrana, núcleo, citoplasma) y *Compara* (lo común y lo que cambia). Ilustraciones `tejido-vegetal` y `tejido-animal`, `ficha.contexto` de cuatro datos cada uno y 3 preguntas nuevas por hito. `diagramas/index.ts` pasó a `index.tsx`.
- Validador: ahora los ids de pregunta deben ser únicos en todo el tema (había un `hl-2` repetido, corregido).
- Perfiles guardados en el navegador y mini-quiz.

## Método de trabajo del subtema 1.1
Se profundiza **un hito a la vez**: se revisa el contenido con JuanMed, se agrega diagrama interactivo y se marca `revisado: true`. Hitos 3 y 4 (Schleiden, Schwann) con primera pasada profunda; por verificar: la cena de 1837 (anécdota), Brown 1831 en orquídeas, estudios de Schleiden, Schwann y la pepsina / células de Schwann / «metabolismo» / fermentación, notocorda y cartílago. Hito 2 (Leeuwenhoek) con primera pasada profunda; por verificar: fechas (1674 protozoos, 1676 bacterias, 1683 sarro), ~200 aumentos, cartas durante unos 50 años, confirmación de Hooke en 1677, tamaños de la escala. Hito 1 (Hooke) con segunda pasada hecha; por verificar contra el texto de Micrographia: 60 cavidades en 1/18 de pulgada, Observación 18, plantas con jugos, cita de Pepys, Grew y Malpighi.

## Fuente de referencia
La presentación «La célula» de JuanMed (34 diapositivas, tres postulados, analogías de la ciudad para los organelos). El plan de área del colegio es solo guía.

## Teclado y uso en el aula
JuanMed usa la app en clase y no le resulta cómodo el mouse, así que todo se puede hacer con teclado:
- **Línea de tiempo:** `← →` mueven el foco entre hitos, `Inicio`/`Fin` van al primero/último, `Enter` abre el hito, `F` pantalla completa.
- **Recuadro abierto:** `← →` (o `RePág`/`AvPág`, que usan muchos controles remotos de presentación) pasan al hito anterior o siguiente; `↑ ↓` cambian de pestaña; `Esc` cierra y devuelve el foco al hito actual. Hay también botones Anterior/Siguiente y el contador «Hito X de N».
- **Diagrama del corcho:** `+` y `−` cambian el aumento; `C` activa la comparación con celdas de monasterio (con zoom alto); `F` lo pone a pantalla completa (con el control de aumento y los textos).
- **Visor con zoom:** con el visor enfocado, `+ −` acercan o alejan y `0` restablece; con zoom, las flechas mueven la imagen (pulsar `0` para volver a cambiar de hito con las flechas).
- Pantalla completa: API nativa con respaldo para iPhone; `Esc` sale.

## Retratos de autores
Hooke usa la reconstrucción de Rita Greer (2004, Free Art License, Wikimedia Commons; versión reducida en `public/imagenes/`, con `pieImagen` y `credito` en el JSON). Los demás autores usan silueta ilustrativa hasta tener imagen. Para poner una imagen real: guardarla en `public/imagenes/`, y completar `autor.imagen` y `autor.credito` (autor y licencia). Verificar siempre en la fuente (p. ej. Wikimedia Commons) **a quién retrata** la imagen y su licencia. De Hooke no se conoce ningún retrato auténtico; no etiquetar un cuadro como «Hooke» sin fuente que lo respalde.

## Pendiente (en este orden)
1. Revisar Hooke con JuanMed y seguir con Leeuwenhoek, Schleiden, Schwann y Virchow, uno por uno, cada uno con su diagrama (ideas: gota de agua con «animálculos», tejido vegetal y animal, división celular).
2. Contenido de mayor profundidad: historia ampliada (Brown, Purkinje, Remak, Flemming), postulados como hipótesis con evidencia, excepciones y casos límite (virus, sincitios, glóbulos rojos, neuronas, origen de la primera célula), interactivos («¿cuenta como célula?», relación superficie/volumen, escalas), preguntas de análisis.
3. Decidir hasta dónde llega el nivel avanzado (11° o cercano a universidad).
4. Dibujo SVG de la célula con **capas** (procariota, eucariota animal y vegetal) usando las analogías de la ciudad como nivel básico de cada ficha (tipos `Dibujo` y `Capa`).
5. Resto de subtemas del tema 1 (niveles de organización, uni/pluricelulares).
6. Login compartido con Supabase y tablas `lab_` para guardar progreso.
7. Desplegar en Vercel.

## Decisiones abiertas
- Nombre definitivo de la app (provisional: «100cias»).
- Cuántos niveles por tema (por ahora tres: básico, intermedio, avanzado).
- En qué área vive la síntesis de proteínas (tema 4 de celular o área de genética) para no duplicarla.
