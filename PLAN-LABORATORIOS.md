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
