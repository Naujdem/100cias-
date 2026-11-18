import type { ComponentType } from 'react'
import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de Química orgánica (Química área 5). Solo datos.
// Todas las claves empiezan con «org-» para no chocar con juegos de otras áreas.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })
type Def = [titulo: string, pregunta: string, instrucciones: string, opciones: OpcionDecide[], cartas: CartaDecide[], cierre: string]
const J = (clave: string, [titulo, pregunta, instrucciones, opciones, cartas, cierre]: Def): ComponentType =>
  function Juego() {
    return <JuegoDecide titulo={titulo} pregunta={pregunta} instrucciones={instrucciones} clave={`cien:${clave}-mejor`} opciones={opciones} cartas={cartas} cierre={cierre} />
  }

const DEFS: Record<string, Def> = {
  /* ── Tema 1: el carbono ── */
  'org-organico-juego': ['¿Orgánico o inorgánico?', '¿Es un compuesto orgánico?', 'Orgánico: compuesto del carbono (salvo CO₂, CO, carbonatos y cianuros).',
    [o('org', 'Orgánico', '🧬'), o('ino', 'Inorgánico', '🪨')], [
      c('🍬', 'Azúcar de mesa (sacarosa)', 'org', 'C₁₂H₂₂O₁₁.'),
      c('🧂', 'Sal de cocina (NaCl)', 'ino', 'No tiene carbono.'),
      c('⛽', 'Gasolina', 'org', 'Mezcla de hidrocarburos.'),
      c('🫧', 'Dióxido de carbono', 'ino', 'Tiene carbono, pero se estudia con la inorgánica.'),
      c('🍞', 'Bicarbonato de sodio', 'ino', 'Es un carbonato ácido.'),
      c('🧴', 'Bolsa de polietileno', 'org', 'Cadenas larguísimas de carbono.'),
      c('🍶', 'Vinagre (ácido acético)', 'org', 'CH₃COOH.'),
      c('🐚', 'Concha de caracol (CaCO₃)', 'ino', 'Carbonato de calcio.'),
      c('💊', 'Acetaminofén', 'org', 'Un medicamento orgánico.'),
    ], 'Que tenga carbono casi siempre significa orgánico, con unas pocas excepciones.'],
  'org-valencia-juego': ['¿Está bien escrita?', '¿Cada átomo cumple su valencia?', 'C hace 4 enlaces, N 3, O 2, H 1. Un doble cuenta 2 y un triple 3.',
    [o('si', 'Sí', '✅'), o('no', 'No', '❌')], [
      c('🧪', 'CH₄', 'si', 'C con 4 enlaces.'),
      c('🧪', 'CH₃', 'no', 'Al carbono le falta un enlace.'),
      c('🧪', 'H₂C=CH₂', 'si', 'Cada C: doble (2) + 2 H = 4.'),
      c('🧪', 'H₃C=CH₃', 'no', 'Cada C tendría 5 enlaces.'),
      c('🧪', 'HC≡CH', 'si', 'Triple (3) + 1 H = 4.'),
      c('🧪', 'CH₃–OH', 'si', 'El O hace 2 enlaces: C y H.'),
      c('🧪', 'CH₃–O–H₂', 'no', 'El oxígeno tendría 3 enlaces.'),
      c('🧪', 'CH₃–NH₂', 'si', 'El N hace 3 enlaces.'),
      c('🧪', 'O=C=O', 'si', 'C: 2 + 2 = 4; cada O: 2.'),
    ], 'Contar enlaces es la forma más rápida de revisar una fórmula.'],
  'org-formulas-juego': ['¿Qué fórmula es?', '¿Qué tipo de fórmula ves?', 'Molecular: solo cuenta. Semidesarrollada: CH₃–CH₂… Esqueleto: zigzag. Desarrollada: todos los enlaces.',
    [o('mol', 'Molecular', '🔢'), o('semi', 'Semidesarrollada', '✏️'), o('esq', 'Esqueleto', '〰️')], [
      c('🧪', 'C₃H₈', 'mol', 'Solo dice cuántos átomos hay.'),
      c('🧪', 'CH₃–CH₂–CH₃', 'semi', 'H agrupados con su C.'),
      c('〰️', '/\\/\\ (un zigzag de 5 puntas)', 'esq', 'Cada punta es un C: pentano.'),
      c('🧪', 'C₂H₆O', 'mol', 'Puede ser etanol o éter dimetílico.'),
      c('🧪', 'CH₃–CH₂–OH', 'semi', 'Etanol.'),
      c('〰️', '/\\/OH (zigzag que termina en OH)', 'esq', 'Los O sí se escriben en el esqueleto.'),
      c('🧪', 'C₆H₁₂O₆', 'mol', 'La glucosa.'),
    ], 'La fórmula molecular no basta para saber cuál sustancia es.'],
  'org-hibridacion-juego': ['¿sp³, sp² o sp?', '¿Qué hibridación tiene el carbono señalado?', 'Solo sencillos: sp³. Un doble: sp². Un triple (o dos dobles): sp.',
    [o('3', 'sp³', '🔺'), o('2', 'sp²', '🔻'), o('1', 'sp', '➖')], [
      c('🧪', 'El carbono del metano, CH₄', '3', '4 sencillos: tetraedro.'),
      c('🧪', 'Un carbono del eteno, H₂C=CH₂', '2', 'Un doble: plano, 120°.'),
      c('🧪', 'Un carbono del etino, HC≡CH', '1', 'Triple: lineal.'),
      c('🧪', 'El carbono del CH₃ del etanol', '3', 'Solo enlaces sencillos.'),
      c('🧪', 'El carbono del C=O de la acetona', '2', 'Un doble con el oxígeno.'),
      c('🧪', 'El carbono del CO₂, O=C=O', '1', 'Dos dobles: lineal.'),
      c('🧪', 'Un carbono del anillo de benceno', '2', 'Plano, 120°.'),
    ], 'La hibridación explica la forma: tetraedro, triángulo plano o línea.'],
  /* ── Tema 2: grupos funcionales ── */
  'org-familia-juego': ['¿Qué cambió?', '¿Qué grupo funcional apareció?', 'Mira qué se le agregó al esqueleto de carbonos.',
    [o('oh', '–OH', '🍶'), o('cooh', '–COOH', '🍋'), o('co', 'C=O', '💅'), o('n', '–NH₂', '🐟')], [
      c('🧪', 'CH₃–CH₃ → CH₃–CH₂–OH', 'oh', 'Etano → etanol.'),
      c('🧪', 'CH₄ → CH₃–OH', 'oh', 'Metano → metanol.'),
      c('🧪', 'CH₃–CH₃ → CH₃–COOH', 'cooh', 'Etano → ácido acético.'),
      c('🧪', 'CH₃–CH₂–CH₃ → CH₃–CO–CH₃', 'co', 'Propano → propanona (acetona).'),
      c('🧪', 'CH₄ → CH₃–NH₂', 'n', 'Metano → metilamina.'),
      c('🧪', 'H–CH₃ → H–COOH', 'cooh', 'Ácido fórmico, el de las hormigas.'),
      c('🧪', 'CH₃–CH₃ → CH₃–CHO', 'co', 'Etanal: un aldehído.'),
    ], 'El grupo funcional cambia la familia y las propiedades.'],
  'org-grupo-juego': ['¿Qué familia es?', '¿A qué familia pertenece?', 'Busca el grupo o la terminación del nombre.',
    [o('ol', 'Alcohol', '🍶'), o('al', 'Aldehído o cetona', '💅'), o('ac', 'Ácido o éster', '🍍'), o('hc', 'Hidrocarburo', '⛽')], [
      c('🧪', 'Propanol', 'ol', 'Terminación -ol.'),
      c('🧪', 'Butano', 'hc', 'Solo C e H, -ano.'),
      c('🧪', 'Propanona', 'al', '-ona: cetona.'),
      c('🧪', 'Ácido etanoico', 'ac', 'El del vinagre.'),
      c('🧪', 'Etanoato de etilo', 'ac', '-ato de -ilo: éster.'),
      c('🧪', 'Metanal (formol)', 'al', '-al: aldehído.'),
      c('🧪', 'Eteno', 'hc', 'Doble enlace, -eno.'),
      c('🧪', 'CH₃–OH', 'ol', 'Metanol.'),
      c('🧪', 'HC≡CH', 'hc', 'Etino.'),
    ], 'La terminación del nombre ya dice la familia.'],
  'org-detector-juego': ['Grupos en la casa', '¿Qué grupo funcional manda en esta sustancia?', 'Piensa en la familia de cada sustancia.',
    [o('oh', 'Alcohol', '🍶'), o('cooh', 'Ácido', '🍋'), o('est', 'Éster', '🍍'), o('n', 'Con nitrógeno', '☕')], [
      c('🧴', 'Alcohol antiséptico', 'oh', 'Etanol o isopropanol.'),
      c('🍶', 'Vinagre', 'cooh', 'Ácido acético.'),
      c('🍌', 'Aroma artificial de banano', 'est', 'Acetato de isoamilo.'),
      c('☕', 'Cafeína', 'n', 'Un alcaloide.'),
      c('🍋', 'Ácido cítrico del limón', 'cooh', 'Tres grupos –COOH.'),
      c('💅', 'Quitaesmalte con acetato de etilo', 'est', 'Olor afrutado.'),
      c('🌱', 'Urea del abono', 'n', 'Una amida.'),
      c('🧈', 'Glicerina', 'oh', 'Tres grupos –OH.'),
    ], 'Si hay N, piensa en aminas y amidas; si huele a fruta, en ésteres.'],
  /* ── Tema 3: alcanos ── */
  'org-estado-alcano-juego': ['¿Gas, líquido o sólido?', '¿En qué estado está a temperatura ambiente?', 'Pocos carbonos: gas. De 5 a unos 17: líquido. Más: sólido.',
    [o('g', 'Gas', '💨'), o('l', 'Líquido', '💧'), o('s', 'Sólido', '🧱')], [
      c('🧪', 'Metano, CH₄', 'g', '1 carbono.'),
      c('🧪', 'Butano, C₄H₁₀', 'g', 'Va licuado a presión en el cilindro.'),
      c('🧪', 'Octano, C₈H₁₈', 'l', 'Parte de la gasolina.'),
      c('🧪', 'Hexano, C₆H₁₄', 'l', 'Un solvente.'),
      c('🕯️', 'C₂₅H₅₂ de la parafina', 's', 'La vela.'),
      c('🧪', 'Propano, C₃H₈', 'g', 'Gas del cilindro.'),
      c('🧪', 'Decano, C₁₀H₂₂', 'l', 'Queroseno.'),
    ], 'Más carbonos → más fuerzas entre moléculas → más difícil hervir.'],
  'org-prefijo-juego': ['¿Cuántos carbonos?', '¿Cuántos carbonos tiene la cadena?', 'met 1 · et 2 · prop 3 · but 4 · pent 5 · hex 6 · hept 7 · oct 8.',
    [o('2', '2', '2️⃣'), o('3', '3', '3️⃣'), o('4', '4', '4️⃣'), o('5', '5 o más', '🖐️')], [
      c('🧪', 'Etano', '2', 'et-.'),
      c('🧪', 'Propano', '3', 'prop-.'),
      c('🧪', 'Butano', '4', 'but-.'),
      c('🧪', 'Octano', '5', '8 carbonos.'),
      c('🍶', 'Etanol', '2', 'Los prefijos sirven para todas las familias.'),
      c('💅', 'Propanona', '3', 'prop-.'),
      c('🧈', 'Ácido butanoico', '4', 'but-.'),
      c('🧪', 'Pentano', '5', 'pent-.'),
    ], 'Mi Elefante Prefiere Bananos: met, et, prop, but.'],
  'org-ramificado-juego': ['¿Bien o mal nombrado?', '¿El nombre está bien escrito?', 'Cadena más larga, números más bajos, ramas iguales con di- o tri-.',
    [o('si', 'Bien', '✅'), o('no', 'Mal', '❌')], [
      c('🧪', '2-metilbutano', 'si', 'Correcto.'),
      c('🧪', '3-metilbutano', 'no', 'Numerado al revés: es 2-metilbutano.'),
      c('🧪', '2,2-dimetilpropano', 'si', 'El neopentano.'),
      c('🧪', '1-metilpropano', 'no', 'Un metilo en la punta alarga la cadena: es butano.'),
      c('🧪', '2-dimetilbutano', 'no', 'Faltan números: 2,2-dimetilbutano.'),
      c('🧪', '2,3-dimetilpentano', 'si', 'Correcto.'),
      c('🧪', '2-etilbutano', 'no', 'La cadena más larga tiene 5: es 3-metilpentano.'),
    ], 'Un metilo en el carbono 1 o un etilo en el 2 delatan que no se tomó la cadena más larga.'],
  'org-isomero-juego': ['¿Isómeros o no?', '¿Son isómeros entre sí?', 'Isómeros: misma fórmula molecular y distinta estructura.',
    [o('si', 'Sí, isómeros', '🔀'), o('no', 'No', '🚫'), o('igual', 'Es la misma molécula', '🟰')], [
      c('🧪', 'Butano y metilpropano', 'si', 'Los dos C₄H₁₀.'),
      c('🧪', 'Butano y propano', 'no', 'C₄H₁₀ y C₃H₈.'),
      c('🧪', 'Etanol y éter dimetílico', 'si', 'Los dos C₂H₆O.'),
      c('🧪', 'CH₃–CH₂–CH₂–CH₃ y CH₃–CH₂–CH₂–CH₃ dibujado al revés', 'igual', 'Girarla no la cambia.'),
      c('🧪', 'Pentano y 2,2-dimetilpropano', 'si', 'Los dos C₅H₁₂.'),
      c('🧪', '1-propanol y 2-propanol', 'si', 'Isómeros de posición.'),
      c('🧪', 'Metano y etano', 'no', 'Fórmulas distintas.'),
    ], 'Para saber si son isómeros, primero cuenta los átomos.'],
  'org-combustion-juego': ['¿Completa o incompleta?', '¿Qué tipo de combustión es?', 'Completa: llama azul, CO₂ y agua. Incompleta: llama amarilla, CO y hollín.',
    [o('c', 'Completa', '🔵'), o('i', 'Incompleta', '🟠')], [
      c('🔥', 'La estufa con llama azul', 'c', 'Suficiente oxígeno.'),
      c('🔥', 'Una olla que queda negra por debajo', 'i', 'Hollín.'),
      c('🚗', 'Humo negro del exosto de un camión', 'i', 'Partículas de carbono.'),
      c('🕯️', 'La punta amarilla de la vela', 'i', 'Brilla por el hollín caliente.'),
      c('🧪', 'CH₄ + 2 O₂ → CO₂ + 2 H₂O', 'c', 'Solo CO₂ y agua.'),
      c('🧪', '2 CH₄ + 3 O₂ → 2 CO + 4 H₂O', 'i', 'Sale CO.'),
    ], 'Nunca se debe usar un calentador o una planta a gasolina en un lugar cerrado.'],
  /* ── Tema 4: alquenos y alquinos ── */
  'org-ano-eno-ino-juego': ['¿-ano, -eno o -ino?', '¿Qué familia es?', 'Solo sencillos: alcano. Un doble: alqueno. Un triple: alquino.',
    [o('ano', 'Alcano', '➖'), o('eno', 'Alqueno', '🟰'), o('ino', 'Alquino', '≡')], [
      c('🧪', 'C₂H₄', 'eno', 'CₙH₂ₙ.'),
      c('🧪', 'C₃H₈', 'ano', 'CₙH₂ₙ₊₂.'),
      c('🧪', 'C₂H₂', 'ino', 'CₙH₂ₙ₋₂.'),
      c('🧪', 'CH₃–CH=CH₂', 'eno', 'Propeno.'),
      c('🔥', 'El gas del soplete de soldar', 'ino', 'Acetileno.'),
      c('🍌', 'El gas que madura las frutas', 'eno', 'Etileno.'),
      c('⛽', 'El butano del cilindro', 'ano', 'Solo enlaces sencillos.'),
      c('🧪', 'C₄H₆ de cadena abierta con un triple', 'ino', 'Butino.'),
    ], 'Contar los H ayuda: CₙH₂ₙ₊₂, CₙH₂ₙ, CₙH₂ₙ₋₂.'],
  'org-nombre-eno-juego': ['¿Qué número?', '¿Dónde empieza el enlace múltiple?', 'Numera desde el extremo más cercano al doble o triple.',
    [o('1', '1', '1️⃣'), o('2', '2', '2️⃣'), o('3', '3', '3️⃣')], [
      c('🧪', 'CH₂=CH–CH₂–CH₃', '1', '1-buteno.'),
      c('🧪', 'CH₃–CH=CH–CH₃', '2', '2-buteno.'),
      c('🧪', 'CH₃–CH₂–CH=CH₂', '1', 'Se numera desde la derecha: 1-buteno.'),
      c('🧪', 'CH₃–C≡C–CH₂–CH₃', '2', '2-pentino.'),
      c('🧪', 'CH₃–CH₂–CH=CH–CH₂–CH₃', '3', '3-hexeno.'),
      c('🧪', 'CH≡C–CH₂–CH₂–CH₃', '1', '1-pentino.'),
      c('🧪', 'CH₃–CH₂–CH₂–CH=CH–CH₃', '2', 'Desde la derecha: 2-hexeno.'),
    ], 'El enlace múltiple tiene prioridad sobre las ramas.'],
  'org-cis-trans-juego': ['¿Cis, trans o ninguno?', '¿Qué isómero es?', 'Cis: grupos iguales del mismo lado. Trans: opuestos. Si un C del doble tiene dos H iguales: ninguno.',
    [o('cis', 'Cis', '⬆️'), o('trans', 'Trans', '↗️'), o('no', 'No tiene', '🚫')], [
      c('🧪', '2-buteno con los dos CH₃ arriba', 'cis', 'Mismo lado.'),
      c('🧪', '2-buteno con un CH₃ arriba y el otro abajo', 'trans', 'Lados opuestos.'),
      c('🧪', '1-buteno', 'no', 'El C1 tiene dos H.'),
      c('🧪', 'Eteno', 'no', 'Cada C tiene dos H.'),
      c('👁️', 'El retinal antes de recibir la luz', 'cis', 'La luz lo pasa a trans.'),
      c('🧈', 'Grasas que quedan rectas al endurecer aceites', 'trans', 'Las grasas trans.'),
    ], 'Sin giro alrededor del doble enlace, cis y trans no se convierten solos.'],
  'org-adicion-juego': ['¿Qué se le suma?', '¿Qué se agregó al doble enlace?', 'En la adición se abre el doble y entra un átomo a cada carbono.',
    [o('h2', 'H₂', '🎈'), o('br', 'Br₂', '🟤'), o('hcl', 'HCl', '🧪'), o('h2o', 'H₂O', '💧')], [
      c('🧪', 'CH₂=CH₂ → CH₃–CH₃', 'h2', 'Hidrogenación.'),
      c('🧪', 'CH₂=CH₂ → CH₂Br–CH₂Br', 'br', 'Decolora el agua de bromo.'),
      c('🧪', 'CH₂=CH₂ → CH₃–CH₂Cl', 'hcl', 'Cloroetano.'),
      c('🧪', 'CH₂=CH₂ → CH₃–CH₂OH', 'h2o', 'Hidratación: etanol.'),
      c('🧈', 'Aceite líquido → margarina', 'h2', 'Se saturan los dobles enlaces.'),
      c('🧪', 'CH₃–CH=CH₂ → CH₃–CHCl–CH₃', 'hcl', 'El H va al carbono con más H (Markovnikov).'),
    ], 'Los alquenos suman; los alcanos no pueden porque no tienen enlace π.'],
  'org-plastico-juego': ['¿Qué plástico es?', '¿De qué plástico está hecho?', 'Polietileno (2, 4), PVC (3), polipropileno (5), poliestireno (6).',
    [o('pe', 'Polietileno', '🛍️'), o('pvc', 'PVC', '🚰'), o('pp', 'Polipropileno', '🪣'), o('ps', 'Poliestireno', '🥡')], [
      c('🛍️', 'Bolsa del supermercado', 'pe', 'Código 2 o 4.'),
      c('🚰', 'Tubo de agua blanco', 'pvc', 'Código 3.'),
      c('🥡', 'Plato de icopor', 'ps', 'Poliestireno expandido.'),
      c('🪣', 'Balde y tapas de botella', 'pp', 'Código 5.'),
      c('🧴', 'Tarro de champú opaco', 'pe', 'Polietileno de alta densidad.'),
      c('🥤', 'Vaso desechable transparente y rígido', 'ps', 'Código 6.'),
      c('🔌', 'Forro de los cables', 'pvc', 'Aislante.'),
    ], 'El número del triángulo ayuda a separar para reciclar.'],
}

export const JUEGOS_ORGANICA: Record<string, ComponentType> = Object.fromEntries(Object.entries(DEFS).map(([k, d]) => [k, J(k.replace(/-juego$/, ''), d)]))
