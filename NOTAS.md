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
- Línea de tiempo **horizontal** con panel de detalle por pestañas: Historia (con autores), Diagrama (si existe) y Evidencia y límites.
- **Vistas intercambiables** de la línea de tiempo con selector «Ver como» (se recuerda la elección): *Alternada* (hitos arriba y abajo de la línea, con tallo, año, texto e imagen enmarcada; inspirada en la plantilla «Timeline Educación» de Genially) y *Tarjetas*. Para agregar una plantilla nueva: crear un componente que reciba `PropsVista` y añadirlo a `src/components/linea/vistas.ts`.
- Miniaturas de los hitos: ilustración propia si existe (hoy solo Hooke); si no, iniciales del autor como marcador de posición.
- **Diagrama interactivo del corcho de Hooke** (control de aumento y puntos tocables). Registro de diagramas en `src/components/diagramas/index.ts`; para agregar uno se crea el componente y se pone su id en `bloque.diagrama`.
- Perfiles guardados en el navegador y mini-quiz.

## Método de trabajo del subtema 1.1
Se profundiza **un hito a la vez**: se revisa el contenido con JuanMed, se agrega diagrama interactivo y se marca `revisado: true`. Hito 1 (Hooke) hecho en versión inicial; esperando revisión.

## Fuente de referencia
La presentación «La célula» de JuanMed (34 diapositivas, tres postulados, analogías de la ciudad para los organelos). El plan de área del colegio es solo guía.

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
