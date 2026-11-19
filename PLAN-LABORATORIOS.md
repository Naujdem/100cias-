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
✅ Tipos de reacción (18 nov 2026: lija al clavo; hierro, zinc y cobre a vasos de CuSO₄ con tiempo real 1 s = 1 min; goteros a cuatro tubos con ocho parejas de precipitado; electrólisis con agua, bicarbonato y batería que se toca, gases 2:1 probados con fósforo y astilla).
✅ Reactivo límite con globos (18 nov 2026: vinagre de a 25 mL a cinco botellas, bicarbonato de a 1 g a cinco globos, globo a la botella y levantarlo soltándolo otra vez; se infla en tiempo real; cinta métrica; aviso si el vinagre no es igual).
✅ Gases (18 nov 2026: Boyle con tapón y pesas de 1 kg que se ponen y quitan del émbolo, tocar la jeringa para anotar; Charles con botella y globo a tres baños, temperatura que cambia en tiempo real, termómetro y cinta; gráficas; cero absoluto en 11°).
✅ Dilución y solubilidad (18 nov 2026: pipetas aforadas de 5, 10 y 25 mL a la solución madre y al matraz, agua hasta el aforo, tapón e inversiones; solubilidad con espátulas de KNO₃ y NaCl, varilla, estufa que se toca, temperatura en tiempo real, cristales al enfriar, tocar el vaso saturado para anotar y curva).
✅ Ácidos, bases y pH (18 nov 2026: repollo a la olla, estufa que se toca y hervor en tiempo real, colador y olla al frasco; gotero de indicador a ocho tubos; tiras universales desde 9°; pH-metro y [H⁺] en 11°; clasificar ácida/neutra/básica).
✅ Titulación (19 nov 2026: embudo a la bureta y quitarlo, NaOH al embudo con lectura inicial que hay que leer, pipeta de 10 mL a HCl desconocido o vinagre 1:10, fenolftaleína, erlenmeyer bajo la bureta, llave que se toca con chorro en tiempo real o gota a gota, agitar tocando el erlenmeyer; 11°: pH-metro y curva).
✅ Velocidad de reacción (19 nov 2026: tres vasos llenados de a 50 mL con agua fría, al clima, caliente o vinagre; pastilla entera al vaso o al mortero, que se toca para triturar; los tres corren a la vez en tiempo real; termómetro al vaso; tocar el vaso cuando paran las burbujas anota el tiempo, con aviso si fue antes o tarde).
✅ Saponificación, solo simulación (19 nov 2026: gafas y guantes que se tocan, aceite de a 25 g y NaOH de a 2 g al vaso del baño María, estufa que se toca y temperatura en tiempo real, varilla al vaso que agita 5 min, la reacción solo avanza caliente y agitada hasta la traza (1 s = 1 min), sal desde 9°, vaso al molde y tira de pH; la proporción decide grasoso, bueno, fuerte o cáustico).
✅ Combustión (19 nov 2026: llave de gas que se toca, fósforo al mechero —gas acumulado si se abre antes—, anillo de aire que se toca, cápsula, vaso frío y vaso con agua de cal sobre la llama; vela con frasco pequeño y grande que la apaga en tiempo real; tabla y clasificación completa/incompleta).
Con esto quedan hechas todas las prácticas de la ruta.

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

## Prácticas extra (aprobadas el 19 nov 2026)
Se suman a la ruta, con la regla «como Tinciones» y su guía imprimible; una por PR, en este orden. Varias son
clásicas de los «201 experimentos»; las de bórax o similares, con aviso de simulación.
1. **Cuaderno e informe de laboratorio** (práctica cero, desde 6°; guía de Pamplona): armar un informe con sus partes
   y encontrar los errores de uno mal hecho.
2. **Pila de limones** (Química área 3, desde 6°): electrodos de zinc y cobre en limones, cables, voltímetro, LED con
   varios en serie; serie de potenciales en 11°.
3. **Corrosión de clavos** (área 3, desde 6°): agua, agua con sal, vinagre, aceite y aire seco; días acelerados en
   tiempo real; redox y protección del hierro desde 9°.
4. **Cristalización** (área 4, desde 6°): sal, azúcar y alumbre saturados, enfriamiento rápido o lento, hilo semilla;
   tamaño y forma de los cristales.
5. **Colorimetría** (área 4, desde 9°): escala de patrones de CuSO₄ para estimar una concentración desconocida;
   absorbancia y ley de Beer en 11° (versión escolar de la espectrofotometría de la guía Surcolombiana).
6. **Antiácidos y soluciones amortiguadoras** (área 4, desde 9°): «ácido estomacal» con repollo morado y cuánto
   neutraliza cada antiácido; en 11°, buffer frente a agua al agregar ácido.
7. **Polímeros: slime y bioplástico** (área 5, desde 6°): pegante + bórax (la proporción decide líquido, slime o
   caucho) y bioplástico de fécula con o sin glicerina.

**Más prácticas extra (aprobadas el 19 nov 2026, después de las 1–7):**
8. **Curva de calentamiento del agua** (Química área 1, desde 6°; DBA 6°-2): hielo al fuego, termómetro minuto a minuto,
   gráfica t–T con las mesetas de fusión y ebullición.
9. **Reacciones que calientan o enfrían** (área 3, desde 6°): disolver sustancias y medir si el agua sube o baja de
   temperatura (compresas frías y calientes); exotérmico y endotérmico.
10. **Potabilización del agua** (desde 6°; PRAE): agua turbia de la quebrada → alumbre (coagulación) → sedimentar →
    filtro casero de arena y carbón → desinfección.
11. **Selección natural con picos** (Biología, área 4; DBA 9°-6): «aves» con pinza, cuchara o pitillo compiten por
    semillas durante varias generaciones.
12. **Muestreo con cuadrantes** (Biología, área 3): contar plantas en un potrero virtual; densidad y diversidad.

## Mesa libre (aprobada el 19 nov 2026)
Decisiones de JuanMed: abierta desde el inicio (cada práctica suma reactivos al estante); primero solo la Fase 1;
Supabase va mucho después; solo química por ahora (biología, si se hace, al final).

**Fase 1 — local, sin internet**
- Mesa viva grande con recipientes vacíos (vasos, tubos, erlenmeyer), mechero, estufa y balanza; estante con los
  reactivos de las prácticas de química (mismo motor y dibujos, nada nuevo que dibujar salvo lo mínimo).
- Catálogo de reacciones en el repo (`data/reaccionesLibre.ts`): las de las 15 prácticas + algunas extra; cada una
  con color, efecto SVG (burbujas, precipitado, calor, llama, espuma), condiciones (cantidad, exceso, temperatura),
  explicación por grado y aviso «solo simulación» si es peligrosa.
- Mezcla fuera del catálogo → «se mezcla, no hay reacción visible» y se guarda en el dispositivo como pendiente
  (ingredientes ordenados como clave, cuántas veces, fecha).
- Panel del docente (con el modo docente): pendientes, las más intentadas primero → «Definir reacción» o «Sin reacción».
  Exportar lo definido a un archivo; importarlo al catálogo del repo para que lo vean todos.
- Libreta de descubrimientos (colección) con las reacciones encontradas.
- Orden: catálogo y estante → mesa con efectos → panel local con exportar/importar → libreta.

**Fase 2 — compartir (mucho después)**
- Supabase con el login de SimulaPro: `lab_mezclas_pendientes` y `lab_reacciones` con RLS; solo el docente define;
  sin conexión se guarda y se sube al volver la red.

**Más adelante:** retos opcionales («consigue un azul más claro», «infla más el globo»); mesa libre de biología.

## Orden de construcción
Mesa (0.1) → Química 9 (piloto) → seguridad (0.2) → Biología 1–2 → el resto, una práctica por sesión,
alternando química y biología → prácticas extra (1–12) → Mesa libre al final (aprobada: ver arriba).
