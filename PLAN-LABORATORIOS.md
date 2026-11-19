# Plan — Laboratorios virtuales (Química y Biología)

Aprobado el 18 nov 2026. Se empieza cuando termine Química (área 5).

## Fuentes (banco de ideas, no contenido para copiar)
- Materiales esenciales de bajo costo → inventario de la mesa / versión casera.
- Guía de seguridad en clase práctica → práctica cero.
- 201 experimentos de química → variantes y prácticas caseras (revisar explicaciones).
- Plan de 40 clases prácticas de química → planeaciones.
- Guía de Química General (U. de Pamplona, 2018) → base de la ruta de química.
- Manual de Bioquímica (U. Surcolombiana, 2018) → biomoléculas, enzimas, cromatografía, espectrofotometría, seguridad GHS y residuos.
- Experimentos peligrosos (Faraón, ácidos fuertes…) → solo simulación, con aviso.

## Formato común de cada práctica
1. Objetivo y materiales (del inventario; marca «también en casa» si aplica).
2. Procedimiento interactivo en la mesa: tocar instrumento → destino, botones +/–, flechas del teclado. Se puede equivocar.
3. Efectos SVG (color, burbujas, fuego, precipitado); no tienen que ser realistas.
4. **Comprobar**: calcula el resultado real y explica el error.
5. Mini informe (de la guía de cuaderno e informe): datos, resultado, error, conclusión.
6. Casillas por grado: bajo con calculadora y pistas; 11° sin ayudas y con errores más finos.
Nivel inicial: **medio**; se mejora después hacia uno más realista.

## Regla: todas las prácticas como Tinciones (mesa viva)
Decidido el 18 nov 2026. **Toda práctica nueva o convertida se hace como Tinciones** (`practicas/Tinciones.tsx`):
- **Mesa viva** (`components/lab/MesaViva.tsx`) a todo el ancho: los materiales están sobre la mesa y se toman
  con clic (o se arrastran) y se sueltan en su destino; teclado ←/→, Enter, Esc. Nada de paneles de botones para
  los pasos del procedimiento.
- Cada paso real del laboratorio es una acción del estudiante (p. ej. poner la muestra, **poner el cubreobjetos**,
  echar el colorante, lavar): no se hace solo ni se salta.
- Animaciones al usar los objetos (verter, gotas, polvo, poner, frotar); los destinos válidos se iluminan y lo que
  no se puede hacer da un aviso con el porqué.
- **El tiempo corre de verdad** cuando el proceso depende del tiempo (temporizador con cuenta regresiva y alarma;
  si el estudiante se demora, el resultado lo muestra). Si una espera real es muy larga, se acelera con aviso.
- Si hay que observar, se usa el **microscopio que se maneja tocándolo** (`components/lab/MicroscopioPanel.tsx`):
  objetivos, macro, micro, luz y aceite; el resultado solo sale al enfocar con el aumento indicado.
- Dibujos reutilizables en `components/lab/dibujos.tsx` (se agregan ahí los nuevos instrumentos).
- Se mantienen la lógica, los errores posibles, las casillas por grado y el «Comprobar» / revisión de cada práctica.
- Cada práctica tiene su **guía de laboratorio** (objetivo, fundamento, materiales, procedimiento, seguridad y
  preguntas) en `data/guiasLab.ts`; se abre con el botón «📄 Guía de laboratorio». Se escribe al crear o convertir la práctica.
- Botones solo para lo que no es manipular: elegir modo o parte, quices, tablas de datos.

### Prácticas por convertir (una por sesión, en este orden)
Hechas: ✅ Tinciones (simples y Gram). ✅ Montaje húmedo (18 nov 2026: papel para limpiar y secar, pinza → cebolla → lámina,
aguja, cubreobjetos que se inclina con W/S o la rueda mientras se sostiene; se revisa al enfocar con 10x). ✅ Ósmosis (18 nov 2026: elodea con cambio de medio por el borde con papel,
plasmólisis en el MicroscopioPanel a 40x, tiempo ×6; papa: pesar, vaso, 30 min con 1 s = 1 min, secar y volver a pesar). ✅ Biomoléculas (18 nov 2026: reactivos tubo por tubo,
gradilla al baño María con tiempo ×10, Biuret soda→cobre, manchas en papel con secado ×20). ✅ Enzimas (18 nov 2026: catalasa con muestra 10 min en su vaso ×20,
pH con goteros, espuma en tiempo real; amilasa con el tubo en su baño y gota a la placa minuto a minuto ×6). ✅ Fotosíntesis (18 nov 2026: lámpara a mano a las marcas de la regla,
interruptor, celofán, bicarbonato, burbujas en tiempo real contadas tocando el contador 10 s × 6; cromatografía con
gotas que deben secar, alcohol en el vaso, tira colgada, tiempo ×12 y sacarla a la bandeja). ✅ Fermentación (18 nov 2026: cada botella se arma a mano con
levadura, azúcar, agua y globo; tiempo por botella 1 s = 1 min; cinta métrica y botella al agua de cal). ✅ Extracción de ADN (18 nov 2026: fresas, mano, agua, jabón, sal,
cuchara o batidora, bolsa al colador, alcohol frío o tibio por la pared o de golpe, 5 min ×10 y palillo). ✅ Microbiología (18 nov 2026: técnica aséptica con objetos, hisopo nuevo por caja, aire ×1, incubación ×2 h por segundo; halos con discos y regla).

Biología:
1. ~~Montaje húmedo~~ ✅ — gotero, pinza con la telita, extender, bajar el cubreobjetos inclinándolo, papel absorbente; observar en el MicroscopioPanel.
2. ~~Ósmosis~~ ✅ — elodea en los medios con el MicroscopioPanel; tiras de papa a los vasos y a la balanza; tiempo de espera.
3. ~~Biomoléculas~~ ✅ — gotear cada reactivo en los tubos de la gradilla, llevar al baño María (con tiempo).
4. ~~Enzimas~~ ✅ — agua oxigenada sobre la papa o el hígado; gotas de lugol en la placa de toque minuto a minuto.
5. ~~Fotosíntesis~~ ✅ — acercar o alejar la lámpara con la mano; poner bicarbonato; meter la tira en el solvente.
6. ~~Fermentación~~ ✅ — echar levadura, azúcar y agua en cada botella, poner el globo; el tiempo corre.
7. ~~Extracción de ADN~~ ✅ — machacar, echar agua, jabón y sal, filtrar, alcohol frío por la pared, enrollar con el palillo.
8. ~~Microbiología~~ ✅ — hisopo, frotar la superficie, abrir la caja y sembrar, incubadora, contar colonias.
9. ~~El microscopio~~ ✅ — el enfoque y el reto usan el MicroscopioPanel (un solo motor de enfoque); las partes siguen como exploración.

Química:
10. ~~Prepara 100 mL de solución 0,5 M~~ ✅ (18 nov 2026: espátula y microespátula cargadas en el frasco, vidrio de reloj a la balanza y TARA tocándola, quitar lo de más a residuos, jarra/piseta/gotero, varilla, embudo —sin él se derrama—, enjuague, lupa del menisco, tapón e inversiones tocando el matraz). Se retiró el motor viejo `Mesa.tsx`.
11. ~~Medición~~ ✅ (18 nov 2026: el ojo se arrastra hasta el nivel del menisco; cada instrumento se llena en el bidón y se vierte en el vaso de la balanza, que hay que tarar tocándola antes de cada medida; vertedero para vaciar).
12. ~~Densidades~~ ✅ (18 nov 2026: cada objeto se lleva a la balanza, a la regla o a la probeta y se saca de ella tomándolo; el alfiler hunde lo que flota; en la torre se vierte cada frasco y se sueltan los objetos en el vaso).
13. ~~Mezclas y separación~~ ✅ (18 nov 2026: imán y agua al vaso; el vaso se vierte en el tamiz, el embudo con filtro, el embudo de decantación, la estufa o el destilador; cromatografía con marcador a la tira, tira al vaso de agua o alcohol y tiempo real 1 s = 1 min).
14. ~~Conservación de la masa~~ ✅ (18 nov 2026: vinagre de a 25 mL y bicarbonato de a 1 g al papelito o al globo; recipiente y papelito a la balanza; globo o tapa a la botella; levantar el globo soltándolo otra vez; si se tapa tarde se escapa gas (tiempo real); la balanza se toca para anotar antes y después).

Se quedan como están (son quices o tablas): Seguridad (preguntas; solo «Vístete» podría pasar a arrastrar la ropa a la figura), Reconoce tu material, Calidad del agua y del suelo.

Prácticas nuevas hechas con la regla: ✅ Ensayo a la llama (18 nov 2026: mechero que se enciende tocándolo, asa al HCl para limpiar, a la sal y a la llama; el color dura 6 s reales y deja restos si no se limpia; muestra desconocida; espectroscopio desde 9°; cobalto y mezcla Na+K en 11°).
Prácticas nuevas pendientes (ya se hacen con la regla): Tipos de reacción, Reactivo límite con globos, Gases, Dilución y solubilidad, Ácidos, bases y pH, Titulación, Velocidad de reacción, Saponificación, Combustión.

## Fase 0 — Base común
- 0.1 Mesa de laboratorio (motor reutilizable; cada práctica es configuración).
- 0.2 Práctica cero: seguridad (minijuego: pictogramas GHS, EPP, normas, residuos).
- 0.3 Reconoce tu material (nombre, uso y versión casera).

## Laboratorio de Química (orden de PLAN-QUIMICA)
**Área 1 — Materia y sus cambios**
1. Medición: precisión y exactitud (menisco; probeta vs pipeta vs matraz).
2. Densidades (regulares, irregulares por desplazamiento; torre de densidades).
3. Mezclas y separación (filtración, decantación, evaporación, destilación, cromatografía de tintas).
4. Conservación de la masa (vinagre + bicarbonato, abierto vs cerrado con globo).

**Área 2 — Átomo y tabla periódica**
5. Ensayo a la llama (color por sal → espectros).

**Área 3 — Compuestos y reacciones**
6. Tipos de reacción (clavo en CuSO₄, precipitados, electrólisis del agua).
7. Reactivo límite con globos.

**Área 4 — Gases, soluciones y equilibrio**
8. Gases (jeringa: Boyle; globo frío/caliente: Charles).
9. **Prepara 100 mL de solución 0,5 M de CuSO₄** — práctica piloto (errores: pesar mal, pasarse del aforo, probeta en vez de matraz, masa molar equivocada).
10. Dilución + solubilidad y temperatura (curva).
11. Ácidos, bases y pH (repollo morado; ácidas, básicas y neutras).
12. Titulación ácido-base (bureta, fenolftaleína); 11° opcional: curva y buffers.
13. Velocidad de reacción (pastilla efervescente: temperatura, partícula, concentración).

**Área 5 — Química orgánica**
14. Saponificación (solo simulación).
15. Combustión completa e incompleta (color de llama, hollín).

## Laboratorio de Biología
1. Microscopio: partes, enfoque, aumento total.
2. Montaje húmedo (portaobjetos, cubreobjetos sin burbujas): cebolla, elodea, mucosa bucal.
3. Tinciones: lugol, azul de metileno; Gram (11°).
4. Ósmosis: plasmólisis en elodea, papa en agua dulce/salada.
5. Biomoléculas: almidón (lugol), azúcares (Benedict), proteínas (Biuret), lípidos (mancha en papel).
6. Enzimas: amilasa + almidón + yodo; catalasa (papa + agua oxigenada) con temperatura y pH.
7. Fotosíntesis: burbujas de elodea según la luz; cromatografía de pigmentos.
8. Fermentación: levadura + azúcar + globo.
9. Extracción de ADN de fresa (área 2).
10. Microbiología: técnica aséptica, siembra en caja de Petri, colonias en tiempo acelerado; con/sin jabón.
11. Opcional: calidad del agua y del suelo (área 5, PRAE).

## Modo libre (propuesta, por decidir)
Además de las prácticas guiadas, una **Mesa libre** que se desbloquea con las prácticas:
- Usa el mismo motor e inventario de las prácticas ya hechas (no hay material nuevo).
- Las mezclas salen de un catálogo de reacciones conocidas (las de las prácticas + algunas extra);
  si la combinación no está en el catálogo → «se mezcla, no hay reacción visible».
- **Mezclas por definir** (idea de JuanMed): cada combinación que no está en el catálogo se guarda en
  Supabase (`lab_mezclas_pendientes`: ingredientes ordenados como clave, cuántas veces se intentó,
  fecha). Sin conexión, se guarda en el dispositivo y se sube al volver la red.
- **Panel del docente**: lista de mezclas pendientes (las más intentadas primero) → «Definir reacción»
  (color, efecto SVG, gas/precipitado/calor, explicación por grado) o «Sin reacción» (para que deje de aparecer).
  Lo definido va a `lab_reacciones` y desde ese momento cualquiera que repita la mezcla ve el efecto.
  Solo el rol docente/administrador puede definir (RLS).
- El catálogo base vive en el repo; lo agregado desde el panel vive en Supabase y se suma al cargar.
- Libreta de descubrimientos: cada reacción nueva encontrada queda registrada (estilo colección).
- Retos opcionales: «consigue una solución azul más clara», «haz que el globo se infle más».
- Lo peligroso sigue siendo solo simulación, con aviso.

## Orden de construcción
Mesa (0.1) → Química 9 (piloto) → seguridad (0.2) → Biología 1–2 → el resto, una práctica por sesión,
alternando química y biología → Mesa libre al final (si se aprueba).
