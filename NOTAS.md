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
- **Virchow ampliado (28 oct)**: diagrama `division-celular` con *Una célula se divide* (5 pasos con deslizador: preparación, cromosomas visibles, alineados, se separan, dos células; solo 4 cromosomas por claridad) y *Generaciones* (botón «Dividir», 1→64 células). Ilustración `celula-anafase`, `ficha.contexto` de cinco datos (tifus en Silesia, Raspail, Remak, patología celular, Flemming), 3 preguntas nuevas. Por verificar: Raspail ~1825, polémica con Remak, libro de 1858, términos «leucemia» y «embolia», Flemming ~1880. Las etapas de mitosis están simplificadas (nivel básico); la versión avanzada (profase, prometafase…) y la meiosis van en el tema 4.
- **Pasteur y Redi ampliados (28 oct)**: diagrama `experimento-pasteur` con *Redi, 1668* (dos frascos, deslizador de días: larvas solo en el abierto) y *Pasteur, 1861* (matraz de cuello de cisne o recto, botón «Romper el cuello», deslizador de días: el caldo se enturbia según el caso). Ilustraciones `frascos-redi` y `matraz-cisne`, `ficha.contexto` de cinco datos (químico, debate con Pouchet, objeción del aire con Needham y Spallanzani, matraces en la montaña, esporas resistentes), 3 preguntas nuevas. Por verificar: premio de la Academia, matraces abiertos en un glaciar alpino, que algunos matraces se conserven con el caldo limpio, esporas explicando a Pouchet, rabia 1885.
- **Teoría moderna y endosimbiosis (28 oct)**: con esto el subtema 1.1 tiene sus 8 hitos ampliados. `cuenta-celula`: «¿Cuenta como célula?» (8 casos —bacteria, neurona, glóbulo rojo, músculo, yema, virus, corcho, mitocondria—, el estudiante apuesta sí/no y ve cuatro criterios y una nota; marcador de aciertos). `endosimbiosis`: *Paso a paso* (5 pasos con deslizador) y *Pruebas* (tabla bacteria / mitocondria / resto de la célula con explicación por rasgo). Hitos reordenados por año en el JSON. Por verificar: 1944 y 1953 (ADN), Wallin, artículo de Margulis rechazado por muchas revistas, firma «Lynn Sagan», pruebas de ADN de los años 70-80, flagelos, ~2.000 millones de años, tamaño de mitocondrias, yema como célula.
- **Subtema 1.2 «Niveles de organización» (28 oct)**: la app ahora carga todos los JSON de `data/materias` y muestra un selector de subtema (1.1, 1.2) arriba; cada subtema recuerda sus casillas (`cien:<tema.id>`). El tema declara `orden`, `etiqueta`, `vistas`, `tituloVista` y `unidad`; los bloques pueden usar `etiqueta` («Nivel 3») en vez del año. Nueva vista **Niveles** (pila de menor a mayor; ↑ ↓ mueven el foco). 10 niveles (átomos, moléculas, macromoléculas, orgánulos, célula, tejido, órgano, sistema, organismo, más allá del organismo) con ficha, 3 datos de contexto, ejemplos, límites y 2 preguntas cada uno. Diagrama `nivel-<id>` (uno por nivel): *Niveles anidados* (recuadros uno dentro de otro, ejemplo persona o planta, deslizador) y *Ordénalos* (juego de ordenar de menor a mayor). Perfiles: 6° (orgánulos→organismo), 9° (suma moléculas y macromoléculas), 11° (todo). Todo en borrador; por verificar: 96 % de masa, 30–40 billones de células, 200 tipos celulares, agua entre la mitad y dos tercios, clasificaciones de tejidos y sistemas.
- **Buscador global (28 oct)**: barra arriba, busca en todos los subtemas (títulos, autores, resumen, idea, contexto, evidencia, límites y preguntas) sin distinguir tildes ni mayúsculas, exige todas las palabras y resalta lo hallado. Al elegir un resultado cambia de subtema y abre la ficha; si el perfil la tenía oculta, la activa (y pasa a «Personalizado»). Teclado: `/` enfoca el buscador, ↑ ↓ eligen, Enter abre, Esc borra o sale. Lógica en `src/lib/buscar.ts` (con prueba) y vista en `components/Buscador.tsx`.
- **Acordeón (29 oct)**: componente reutilizable `components/Acordeon.tsx` (título siempre visible, texto plegable con animación que respeta «reducir movimiento», accesible con teclado, contenido cerrado con `inert`). La pestaña Historia lo usa para `ficha.contexto` (antes lista siempre abierta): solo el primer dato abierto al entrar. Orden de la pestaña Historia: texto general (idea), ilustraciones («Mira de cerca») y acordeón de contexto. Opciones: `abiertosAlInicio` y `soloUno`. Sin probar todavía a mano en el navegador.
- **Retratos (29 oct)**: Leeuwenhoek (pintura de Verkolje), Schleiden (grabado ~1850, solo 338×427 px: se ve borroso con zoom), Schwann (litografía de Hoffmann, 1857), Virchow (foto de 1891, Wellcome, **CC BY 4.0**), Pasteur (foto de Nadar), Redi (retrato de Voet) y Margulis (foto de Jpedreira, 2005, **CC BY-SA 2.5**, conserva esa licencia). Reducidas a 450-600 px de ancho en `public/imagenes/` (la app precargada pasó de ~0,8 a ~1,4 MB). Los autores adicionales con `imagen` (hoy Redi) muestran su retrato más pequeño bajo el principal, con su pie y crédito. Mereschkowski sigue con texto, sin imagen.
- **Teclado en diagramas (29 oct)**: en las pestañas Diagrama y Para el cuaderno, `← →` son de la pestaña (antes cambiaban de hito y los deslizadores solo respondían si tenían el foco). Orden: 1) el componente que use `useFlechas` (`lib/flechasDiagrama.ts`) se queda la flecha (casos, partes, rasgos, zonas, generaciones, nivel de lectura); 2) si no, avanza un paso el primer deslizador visible; 3) si no hay nada, cambia de hito. Los hitos se cambian con `RePág/AvPág` o con los botones. `Espacio`/`Enter` pulsan el botón marcado con `data-principal` (Dividir, Romper el cuello). Un diagrama nuevo con deslizador funciona sin código extra; sin deslizador, usar `useFlechas`. «Ordénalos» no usa flechas a propósito (es un juego de tocar).
- **Pantalla completa en todos los diagramas (29 oct)**: `PantallaCompleta` acepta `conBoton` para contenido sin `VisorZoom`. Ahora la tienen también *Generaciones*, *Calcula como Hooke*, *¿Qué tan pequeño?*, *Ordénalos*, *Pruebas*, *Compara* y *¿Cuenta como célula?*. Regla para diagramas nuevos: envolver cada actividad en `PantallaCompleta` (con `conBoton` si no lleva visor). En *Generaciones*, «Dividir» pasó arriba del dibujo, el dibujo tiene altura máxima y se arregló el texto «billones,.».
- **Pestaña «Para el cuaderno» (29 oct)**: opcional, solo aparece si la ficha tiene `ficha.cuaderno` (`{ facil, media, avanzada }`, frases cortas para dictar o decir en clase). Los niveles se suman: Fácil muestra `facil`; Media, `facil` + `media`; Avanzada, las tres listas. El nivel elegido se recuerda (`cien:nivel-cuaderno`), `← →` cambian de nivel y hay botón «Copiar texto». Cargado en las 18 fichas (8 hitos y 10 niveles), redactado solo con lo que ya decía cada ficha, **todo en borrador**; el validador revisa que no haya frases vacías o repetidas y el buscador también las lee. Componente `components/Cuaderno.tsx`.
- **Mejoras de «Niveles de organización» (29 oct)**: (1) una ilustración SVG por nivel (`components/ilustraciones/Niveles.tsx`, claves `nivel-<id>`, esquemas no a escala); (2) «Hilo: una gota de sangre» como dato de contexto en los 10 niveles, con su frase en `cuaderno.media`; (3) actividad *¿Qué niveles tiene?* (persona, planta de fríjol y bacteria; ← → mueven el foco entre casillas, Espacio marca, «Comprobar» con Espacio/Enter); (4) actividad *¿Qué aparece?* (propiedad emergente, 5 pasos, ← → cambian de paso); (5) 4 preguntas por nivel (2 nuevas cada uno, sin repetir las anteriores); (6) dato «Conexión con la teoría celular» en orgánulos, célula, tejido y organismo (+ frase en `cuaderno.avanzada`); (7) hoja `VERIFICAR.md` con los datos por verificar. Todo en borrador.
- **Subtema 1.3 «Unicelulares y pluricelulares» (29 oct)**: `unicelulares-pluricelulares.json`, vista *Niveles* (pila «Paso 1…6», título «De una célula a muchas»). 6 bloques: unicelulares, colonias (intermedio), pluricelulares, división del trabajo, ventajas y costos (intermedio) y origen de la pluricelularidad (avanzado); cada uno con ficha, 3 datos de contexto, evidencia, límites, «Para el cuaderno» y 3 preguntas. Perfiles: 6° (unicelulares, pluricelulares, división del trabajo), 9° (suma colonias y ventajas), 11° (todo). Diagrama `components/diagramas/UniPluri.tsx` con *De una a muchas* (5 pasos con deslizador) y *Clasifícalos* (8 seres: unicelular, colonia o pluricelular; ← → cambian de ser). Ilustraciones en `ilustraciones/UniPluri.tsx` (ejemplos unicelulares, Volvox, esponja, pluricelular con tejidos, superficie/volumen, varios orígenes). `VistaNiveles` ya no dice «niveles de organización» en su etiqueta de accesibilidad. Todo en borrador.
- **Revisión de interfaz (29 oct)**: medida en navegador real (Playwright, 70 diagramas, 1280×800, 1366×768 y 390×800). (1) `VisorZoom` limita el dibujo a `max-h-[32dvh]` fuera de pantalla completa, para que el deslizador y la explicación se vean sin desplazarse (antes 32 de 70 diagramas los dejaban fuera). (2) La pila de niveles numera con el número de la etiqueta («Nivel 5» → 5) y el pie del recuadro dice «Nivel 5 · 2 de 6 en tu perfil»; antes decía «2» y «1 de 6». (3) `perfiles.json` tiene `descripciones` por subtema (la general queda de respaldo) y el validador avisa si falta alguna. Lo pendiente de esa revisión está en el apartado siguiente.
- **Pantalla reorganizada (29 oct)**: (1) «Qué mostrar» ahora está plegado bajo «Personalizar contenido · N de M mostrados» (`SelectorContenido`, cerrado al empezar). (2) Nueva `components/Guia.tsx` antes del contenido: «Al terminar podrás» (campo `objetivos` del tema, 3 por subtema), cómo moverse y botón «Empezar por el primer paso», que abre el primer bloque visible (una búsqueda más reciente gana). (3) Un solo perfil: elegir 6°, 9° u 11° lo guarda en todos los subtemas (`cien:perfil`) y un subtema sin guardado propio lo hereda; el perfil «Personalizado» sigue siendo por subtema y se sobrescribe al elegir uno. Pendiente: progreso (✓ en lo visto, puntaje del quiz), pestaña «Comprueba», analogías, pestaña para el docente, ruta vertical para el 1.3.
- **Dibujos de los postulados (29 oct)**: tres ilustraciones SVG en `ilustraciones/Postulados.tsx` (`postulado-seres`, `postulado-unidad`, `postulado-origen`) en el hito «La teoría celular hoy» (antes sin dibujos). Pendiente: una tarjeta resumen de los tres postulados sobre la línea de tiempo.
- Validador: ahora los ids de pregunta deben ser únicos en todo el tema (había un `hl-2` repetido, corregido).
- Perfiles guardados en el navegador y mini-quiz.

## Método de trabajo del subtema 1.1
Se profundiza **un hito a la vez**: se revisa el contenido con JuanMed, se agrega diagrama interactivo y se marca `revisado: true`. Hitos 3 y 4 (Schleiden, Schwann) con primera pasada profunda; por verificar: la cena de 1837 (anécdota), Brown 1831 en orquídeas, estudios de Schleiden, Schwann y la pepsina / células de Schwann / «metabolismo» / fermentación, notocorda y cartílago. Hito 2 (Leeuwenhoek) con primera pasada profunda; por verificar: fechas (1674 protozoos, 1676 bacterias, 1683 sarro), ~200 aumentos, cartas durante unos 50 años, confirmación de Hooke en 1677, tamaños de la escala. Hito 1 (Hooke) con segunda pasada hecha; por verificar contra el texto de Micrographia: 60 cavidades en 1/18 de pulgada, Observación 18, plantas con jugos, cita de Pepys, Grew y Malpighi.

## Fuente de referencia
La presentación «La célula» de JuanMed (34 diapositivas, tres postulados, analogías de la ciudad para los organelos). El plan de área del colegio es solo guía.

## Teclado y uso en el aula
JuanMed usa la app en clase y no le resulta cómodo el mouse, así que todo se puede hacer con teclado:
- **Buscador:** `/` lo enfoca desde cualquier parte (si no hay recuadro abierto).
- **Línea de tiempo:** `← →` mueven el foco entre hitos, `Inicio`/`Fin` van al primero/último, `Enter` abre el hito, `F` pantalla completa.
- **Recuadro abierto:** `← →` (o `RePág`/`AvPág`, que usan muchos controles remotos de presentación) pasan al hito anterior o siguiente; `↑ ↓` cambian de pestaña; `Esc` cierra y devuelve el foco al hito actual. Hay también botones Anterior/Siguiente y el contador «Hito X de N». **Excepción:** en las pestañas Diagrama y Para el cuaderno, `← →` cambian el control de la pestaña (paso, días, caso, nivel…) y los hitos se cambian con `RePág`/`AvPág` o con los botones; `Espacio`/`Enter` pulsan el botón principal del diagrama.
- **Diagrama del corcho:** `+` y `−` cambian el aumento; `C` activa la comparación con celdas de monasterio (con zoom alto); `F` lo pone a pantalla completa (con el control de aumento y los textos).
- **Visor con zoom:** con el visor enfocado, `+ −` acercan o alejan y `0` restablece; con zoom, las flechas mueven la imagen (pulsar `0` para volver a cambiar de hito con las flechas).
- Pantalla completa: API nativa con respaldo para iPhone; `Esc` sale.

## Retratos de autores
Hooke usa la reconstrucción de Rita Greer (2004, Free Art License, Wikimedia Commons; versión reducida en `public/imagenes/`, con `pieImagen` y `credito` en el JSON). Desde el 29 oct también tienen imagen Leeuwenhoek, Schleiden, Schwann, Virchow, Pasteur, Redi y Margulis (ver «Retratos» arriba); Mereschkowski usa texto sin imagen. Las imágenes con licencia CC (Virchow, Margulis) exigen mostrar el crédito: ya va en `credito`. Para poner una imagen real: guardarla en `public/imagenes/`, y completar `autor.imagen` y `autor.credito` (autor y licencia). Verificar siempre en la fuente (p. ej. Wikimedia Commons) **a quién retrata** la imagen y su licencia. De Hooke no se conoce ningún retrato auténtico; no etiquetar un cuadro como «Hooke» sin fuente que lo respalde.

## Pendiente (en este orden)
0. Probar a mano en el navegador lo del 29 oct (acordeón, retratos, flechas en diagramas, pantalla completa, «Para el cuaderno»): se compiló y pasaron validador y pruebas, pero no se vio en pantalla. Ideas sin hacer: tarjeta resumen de los postulados sobre la línea de tiempo, pregunta de comprobación al final de cada ficha, glosario táctil, hoja con todos los datos «por verificar».
1. JuanMed revisa los 8 hitos del subtema 1.1 (borrador) y dice qué cambiar; marcar `revisado: true` lo verificado.
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

## Proceso pedagógico (progreso, Comprueba, modo docente, analogías, ruta)
- **Progreso** (`src/lib/progreso.ts`, clave `cien:progreso`): fichas vistas, última respuesta de cada pregunta y mejor puntaje del quiz. Chips «Visto» / «Comprobado» en las vistas; la Guía muestra «Llevas N de M» y «Seguir con…»; botón «Borrar mi progreso» (dos pasos). Se guarda por navegador; entre dispositivos requerirá el inicio de sesión (Supabase).
- **Pestaña «Comprueba»** en cada ficha con preguntas: teclas 1–4 responden.  El quiz final lista qué fichas repasar.
- **Ajustes** (`src/lib/ajustes.ts`, en «Personalizar contenido»): modo docente y analogías.
- **Para el docente** (`ficha.docente`: abrir, actividad, errores, minutos): borradores míos para los 24 bloques; revisar.
- **Analogías** (`ficha.analogia`): organulos y celula salen de la presentación de JuanMed (ciudad); pluricelulares y division-trabajo son borradores míos.
- **Vista «Ruta»** vertical, usada por 1.3.
