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
src/components/                             SelectorContenido, LineaTiempo, Quiz, Insignia
scripts/validate-data.mjs                   valida los JSON (npm run check:data)
scripts/seleccion.test.ts                   pruebas de la lógica (npm test)
```

## Comandos
- `npm run dev` · `npm run build` · `npm test` · `npm run check:data`

## Hecho
- Esqueleto del proyecto, PWA, modo claro/oscuro.
- Esquema de datos (bloques, capas, perfiles).
- Subtema 1.1 «Postulados de la teoría celular»: 6 bloques con fichas y 9 preguntas (todos en borrador).
- Línea de tiempo con casillas, perfiles guardados en el navegador y mini-quiz.

## Pendiente (en este orden)
1. Revisar y corregir el contenido de teoría celular contra la fuente elegida; marcar `revisado: true`.
2. Fijar una sola fuente para la redacción de los postulados (tres o cuatro según el libro).
3. Primer dibujo SVG con **capas**: célula procariota y eucariota, con fichas al tocar cada parte y nivel básico/intermedio/completo (usa los tipos `Dibujo` y `Capa`).
4. Resto de subtemas del tema 1 (niveles de organización, endosimbiosis, uni/pluricelulares).
5. Después: login compartido con Supabase y tablas `lab_` para guardar progreso.
6. Desplegar en Vercel.

## Decisiones abiertas
- Nombre definitivo de la app (provisional: «100cias»).
- Cuántos niveles por tema (por ahora tres: básico, intermedio, avanzado).
- En qué área vive la síntesis de proteínas (tema 4 de celular o área de genética) para no duplicarla.
