import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de la nomenclatura de ácidos y sales (Química área 3, tema 3). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function HidracidosJuego() {
  return (
    <JuegoDecide titulo="¿Qué hidrácido es?" pregunta="¿De cuál se trata?" instrucciones="Hidrácido: hidrógeno + no metal, sin oxígeno." clave="cien:hidracidos-mejor"
      opciones={[o('hcl', 'Ácido clorhídrico (HCl)', '🟢'), o('h2s', 'Ácido sulfhídrico (H₂S)', '🟡'), o('hf', 'Ácido fluorhídrico (HF)', '🔵')]}
      cartas={[
        c('🫃', 'Está en el jugo gástrico', 'hcl', 'Ayuda a digerir las proteínas.'),
        c('🥚', 'Huele a huevo podrido', 'h2s', 'Sale de la materia orgánica en descomposición.'),
        c('🪟', 'Se usa para grabar vidrio', 'hf', 'Es tan reactivo que ataca el vidrio.'),
        c('🧪', 'H + Cl', 'hcl', 'Cloro con un hidrógeno.'),
        c('♨️', 'Sale de las aguas termales azufradas', 'h2s', 'El azufre es −2: lleva dos H.'),
        c('🧹', 'Se vende diluido como ácido muriático', 'hcl', 'Muriático es su nombre comercial.'),
        c('🔢', 'Lleva dos hidrógenos', 'h2s', 'S²⁻ necesita dos H⁺.'),
        c('🦷', 'Viene del flúor, el no metal más electronegativo', 'hf', 'H + F.'),
      ]}
      cierre="En agua: ácido + no metal + -hídrico." />
  )
}

export function OsoIcoJuego() {
  return (
    <JuegoDecide titulo="¿-oso o -ico?" pregunta="¿Qué terminación lleva el ácido?" instrucciones="Calcula el estado del no metal: el menor va con -oso, el mayor con -ico." clave="cien:oso-ico-mejor" tiempo={12}
      opciones={[o('oso', '-oso (menor)', '⬇️'), o('ico', '-ico (mayor)', '⬆️')]}
      cartas={[
        c('🔋', 'H₂SO₄ (S +6)', 'ico', 'Ácido sulfúrico.'),
        c('🌋', 'H₂SO₃ (S +4)', 'oso', 'Ácido sulfuroso.'),
        c('💥', 'HNO₃ (N +5)', 'ico', 'Ácido nítrico.'),
        c('🥓', 'HNO₂ (N +3)', 'oso', 'Ácido nitroso.'),
        c('🌱', 'H₃PO₄ (P +5)', 'ico', 'Ácido fosfórico.'),
        c('🧪', 'H₃PO₃ (P +3)', 'oso', 'Ácido fosforoso.'),
        c('🏊', 'HClO₃ (Cl +5)', 'ico', 'Ácido clórico.'),
        c('🏊', 'HClO₂ (Cl +3)', 'oso', 'Ácido cloroso.'),
      ]}
      cierre="Primero el estado del no metal; después la terminación." />
  )
}

export function AnionesJuego() {
  return (
    <JuegoDecide titulo="El oso bonito y el pico de pato" pregunta="¿Cómo termina el anión?" instrucciones="-hídrico → -uro · -oso → -ito · -ico → -ato." clave="cien:aniones-mejor"
      opciones={[o('uro', '-uro', '💧'), o('ito', '-ito', '🐻'), o('ato', '-ato', '🦆')]}
      cartas={[
        c('🧂', 'El anión del ácido clorhídrico', 'uro', 'Cloruro, Cl⁻.'),
        c('🔋', 'El anión del ácido sulfúrico', 'ato', 'Sulfato, SO₄²⁻.'),
        c('🥓', 'El anión del ácido nitroso', 'ito', 'Nitrito, NO₂⁻.'),
        c('🌱', 'El anión del ácido fosfórico', 'ato', 'Fosfato, PO₄³⁻.'),
        c('🥚', 'El anión del ácido sulfhídrico', 'uro', 'Sulfuro, S²⁻.'),
        c('🧺', 'El anión del ácido hipocloroso', 'ito', 'Hipoclorito, ClO⁻ (el del blanqueador).'),
        c('🪨', 'El anión del ácido carbónico', 'ato', 'Carbonato, CO₃²⁻.'),
        c('🌋', 'El anión del ácido sulfuroso', 'ito', 'Sulfito, SO₃²⁻.'),
      ]}
      cierre="El oso bonito (-oso → -ito) y el pico de pato (-ico → -ato)." />
  )
}

export function SalesJuego() {
  return (
    <JuegoDecide titulo="Sales de la finca" pregunta="¿Qué tipo de sal es?" instrucciones="Binaria: el anión no tiene oxígeno. Oxisal: sí tiene." clave="cien:sales-mejor"
      opciones={[o('bin', 'Sal binaria', '🧂'), o('oxi', 'Oxisal', '🌾')]}
      cartas={[
        c('🧂', 'NaCl: sal de cocina', 'bin', 'Cloruro: sin oxígeno.'),
        c('🌱', 'KNO₃: nitrato de potasio (abono)', 'oxi', 'Nitrato: con oxígeno.'),
        c('🪨', 'CaCO₃: cal agrícola', 'oxi', 'Carbonato: con oxígeno.'),
        c('🌱', 'KCl: cloruro de potasio (abono)', 'bin', 'Cloruro.'),
        c('🌾', '(NH₄)₂SO₄: sulfato de amonio', 'oxi', 'Sulfato.'),
        c('🦷', 'NaF: fluoruro de sodio (crema dental)', 'bin', 'Fluoruro.'),
        c('🍇', 'CuSO₄: sulfato de cobre (II)', 'oxi', 'Sulfato.'),
        c('✨', 'FeS: sulfuro de hierro (II)', 'bin', 'Sulfuro: sin oxígeno.'),
      ]}
      cierre="-uro: binaria. -ito o -ato: oxisal." />
  )
}
