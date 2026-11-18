import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de ácidos, bases y pH (Química área 4, tema 8). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })
const ABN = [o('a', 'Ácido', '🍋'), o('n', 'Neutro', '💧'), o('b', 'Básico', '🧼')]

export function AcidoOBaseJuego() {
  return (
    <JuegoDecide titulo="¿Ácido o base?" pregunta="¿Qué es?" instrucciones="Ácidos: agrios, sueltan H⁺. Bases: amargas y jabonosas, sueltan OH⁻." clave="cien:acido-o-base-mejor"
      opciones={ABN}
      cartas={[
        c('🍋', 'Jugo de limón', 'a', 'Ácido cítrico.'),
        c('🧼', 'Jabón de barra', 'b', 'Se siente jabonoso.'),
        c('🫙', 'Vinagre', 'a', 'Ácido acético.'),
        c('💧', 'Agua pura', 'n', 'pH 7.'),
        c('🧂', 'Bicarbonato en agua', 'b', 'Una base suave.'),
        c('🥤', 'Gaseosa', 'a', 'Ácido carbónico y fosfórico.'),
        c('🪨', 'Cal en agua', 'b', 'Hidróxido de calcio.'),
        c('🍊', 'Naranja', 'a', 'Ácido cítrico.'),
        c('🧴', 'Blanqueador', 'b', 'Hipoclorito de sodio: muy básico y peligroso.'),
      ]}
      cierre="Ácidos sueltan H⁺; bases sueltan OH⁻ (Arrhenius)." />
  )
}

export function PhJuego() {
  return (
    <JuegoDecide titulo="Ubica en la escala" pregunta="¿En qué parte de la escala está?" instrucciones="0 a 6: ácido · 7: neutro · 8 a 14: básico" clave="cien:ph-escala-mejor" tiempo={12}
      opciones={ABN}
      cartas={[
        c('🔴', 'pH 2', 'a', 'Muy ácido, como el limón.'),
        c('🟢', 'pH 7', 'n', 'Neutro, como el agua pura.'),
        c('🔵', 'pH 12', 'b', 'Muy básico, como el agua de cal.'),
        c('🩸', 'La sangre: pH 7,4', 'b', 'Ligeramente básica.'),
        c('☕', 'El tinto: pH 5', 'a', 'Algo ácido.'),
        c('🌊', 'Agua de mar: pH 8,1', 'b', 'Ligeramente básica.'),
        c('🥛', 'Leche: pH 6,6', 'a', 'Apenas ácida, casi neutra.'),
      ]}
      cierre="Un pH 3 es 10 veces más ácido que un pH 4, y 100 veces más que un pH 5." />
  )
}

export function IndicadorJuego() {
  return (
    <JuegoDecide titulo="El repollo dice" pregunta="Con el indicador de repollo morado, ¿de qué color se ve?" instrucciones="Ácido: rojo o rosado. Neutro: morado. Básico: azul, verde o amarillo." clave="cien:indicador-mejor"
      opciones={[o('rojo', 'Rojo o rosado', '🔴'), o('morado', 'Morado', '🟣'), o('verde', 'Verde o amarillo', '🟢')]}
      cartas={[
        c('🍋', 'Limón', 'rojo', 'Ácido.'),
        c('🧼', 'Agua jabonosa', 'verde', 'Básica.'),
        c('💧', 'Agua de la llave', 'morado', 'Casi neutra.'),
        c('🫙', 'Vinagre', 'rojo', 'Ácido.'),
        c('🪨', 'Agua de cal', 'verde', 'Muy básica: hasta amarillo.'),
        c('🧂', 'Bicarbonato', 'verde', 'Básico (azul verdoso).'),
        c('🥤', 'Gaseosa sin color', 'rojo', 'Ácida.'),
      ]}
      cierre="Los indicadores son sustancias que cambian de color según el pH." />
  )
}

export function SueloPhJuego() {
  return (
    <JuegoDecide titulo="Cuidar el suelo" pregunta="¿Qué hace con el pH del suelo?" instrucciones="Lo vuelve más ácido, más básico (o menos ácido), o no lo cambia mucho." clave="cien:suelo-ph-mejor"
      opciones={[o('acido', 'Más ácido', '⬇️'), o('basico', 'Menos ácido', '⬆️'), o('igual', 'Casi no lo cambia', '⏸️')]}
      cartas={[
        c('🪨', 'Echar cal agrícola', 'basico', 'Neutraliza la acidez.'),
        c('🌧️', 'Mucha lluvia durante años', 'acido', 'Lava el calcio y el magnesio.'),
        c('🧪', 'Abonar siempre con abonos de amonio', 'acido', 'Con el tiempo acidifican el suelo.'),
        c('🌋', 'Agregar ceniza de leña', 'basico', 'La ceniza es básica.'),
        c('🍂', 'Hojarasca y compost bien hecho', 'igual', 'Mejora el suelo y lo amortigua.'),
        c('⛏️', 'Aguas ácidas de una mina', 'acido', 'Contaminan y acidifican.'),
      ]}
      cierre="Antes de encalar se hace un análisis de suelo: cada cultivo tiene su pH preferido." />
  )
}

export function FuerteDebilJuego() {
  return (
    <JuegoDecide titulo="¿Fuerte o débil?" pregunta="¿Cómo es este ácido o base?" instrucciones="Fuerte: se disocia por completo. Débil: solo en parte (equilibrio)." clave="cien:fuerte-debil-mejor" tiempo={12}
      opciones={[o('f', 'Fuerte', '💪'), o('d', 'Débil', '🪶')]}
      cartas={[
        c('⚗️', 'Ácido clorhídrico, HCl', 'f', 'Todo se disocia.'),
        c('🫙', 'Ácido acético del vinagre', 'd', 'Solo un poquito se disocia.'),
        c('🔋', 'Ácido sulfúrico de las baterías', 'f', 'Muy fuerte y corrosivo.'),
        c('🥤', 'Ácido carbónico de la gaseosa', 'd', 'Débil.'),
        c('🧴', 'Hidróxido de sodio (soda cáustica)', 'f', 'Base fuerte.'),
        c('🧽', 'Amoníaco de limpieza', 'd', 'Base débil.'),
        c('🍋', 'Ácido cítrico del limón', 'd', 'Débil.'),
        c('🧪', 'Ácido nítrico', 'f', 'Fuerte.'),
      ]}
      cierre="Fuerte o débil depende de cuánto se disocia, no de cuánto hay." />
  )
}

export function BronstedJuego() {
  return (
    <JuegoDecide titulo="¿Quién da y quién recibe?" pregunta="Según Brønsted-Lowry, esta sustancia actúa como…" instrucciones="Ácido: dona un H⁺. Base: acepta un H⁺." clave="cien:bronsted-mejor" tiempo={14}
      opciones={[o('a', 'Ácido (dona H⁺)', '🎁'), o('b', 'Base (acepta H⁺)', '🤲')]}
      cartas={[
        c('⚗️', 'HCl en HCl + H₂O → H₃O⁺ + Cl⁻', 'a', 'Le da su H⁺ al agua.'),
        c('💧', 'H₂O en HCl + H₂O → H₃O⁺ + Cl⁻', 'b', 'Recibe el H⁺.'),
        c('🧽', 'NH₃ en NH₃ + H₂O ⇌ NH₄⁺ + OH⁻', 'b', 'Acepta un H⁺ del agua.'),
        c('💧', 'H₂O en NH₃ + H₂O ⇌ NH₄⁺ + OH⁻', 'a', 'El agua puede ser ácido o base.'),
        c('🔁', 'NH₄⁺ en la reacción inversa', 'a', 'Ácido conjugado del NH₃.'),
        c('🔁', 'Cl⁻ (base conjugada del HCl)', 'b', 'Podría aceptar un H⁺, aunque muy débilmente.'),
      ]}
      cierre="El agua es anfótera: puede actuar como ácido o como base." />
  )
}
