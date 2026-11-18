import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del área 3, tema 6 (Sucesión ecológica). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function SucesionPrimariaJuego() {
  return (
    <JuegoDecide titulo="¿Primero o después?" pregunta="¿Llega pronto o tarde?" instrucciones="En la sucesión primaria, sobre roca desnuda: decide si cada ser vivo llega al comienzo o al final." clave="cien:sucesion-primaria-mejor"
      opciones={[o('pronto', 'Al comienzo', '🌱'), o('tarde', 'Al final', '🌳')]}
      cartas={[
        c('🟡', 'Líquenes', 'pronto', 'Son los pioneros: viven sobre la roca.'),
        c('🌳', 'Árboles grandes', 'tarde', 'Necesitan suelo profundo.'),
        c('🟢', 'Musgos', 'pronto', 'Llegan después de los líquenes.'),
        c('🐒', 'Monos que viven en las copas', 'tarde', 'Necesitan un bosque maduro.'),
        c('🌿', 'Arbustos', 'tarde', 'Aparecen cuando ya hay suelo.'),
      ]}
      cierre="Líquenes → musgos → hierbas → arbustos → bosque." />
  )
}

export function SucesionSecundariaJuego() {
  return (
    <JuegoDecide titulo="¿Primaria o secundaria?" pregunta="¿Qué sucesión es?" instrucciones="Primaria: sin suelo. Secundaria: el suelo sigue ahí." clave="cien:sucesion-secundaria-mejor"
      opciones={[o('pri', 'Primaria', '🪨'), o('sec', 'Secundaria', '🌾')]}
      cartas={[
        c('🌋', 'Lava recién enfriada de un volcán', 'pri', 'No hay suelo.'),
        c('🐄', 'Un potrero que se deja de usar', 'sec', 'El suelo y las semillas siguen ahí.'),
        c('🔥', 'Un bosque después de un incendio', 'sec', 'Quedan suelo, semillas y raíces.'),
        c('🧊', 'Roca que deja un glaciar al derretirse', 'pri', 'Roca desnuda.'),
        c('🪓', 'Un terreno talado y abandonado', 'sec', 'Se recupera más rápido.'),
      ]}
      cierre="La secundaria es más rápida porque el suelo ya existe." />
  )
}

export function PerturbacionesJuego() {
  return (
    <JuegoDecide titulo="¿Natural o humana?" pregunta="¿Qué tipo de perturbación es?" instrucciones="Decide quién causa cada perturbación." clave="cien:perturbaciones-mejor"
      opciones={[o('nat', 'Natural', '🌋'), o('hum', 'Humana', '🪓')]}
      cartas={[
        c('⛰️', 'Un deslizamiento por lluvias muy fuertes', 'nat', 'Aunque la deforestación lo vuelve más probable.'),
        c('🔥', 'Quemar un rastrojo para sembrar', 'hum', 'Las quemas son una causa frecuente de incendios.'),
        c('⛏️', 'Minería a cielo abierto', 'hum', 'Destruye el suelo.'),
        c('🌋', 'Una erupción del Nevado del Huila', 'nat', 'Un volcán activo.'),
        c('🪓', 'Talar un bosque para potreros', 'hum', 'La causa principal de pérdida de bosques en Colombia.'),
      ]}
      cierre="Las naturales son parte de la vida del ecosistema; las humanas suelen ser más frecuentes e intensas." />
  )
}
