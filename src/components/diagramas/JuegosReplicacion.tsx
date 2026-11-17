import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del tema 3 del área 2 (Replicación del ADN). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })
const VF = [o('v', 'Cierto', '✅'), o('f', 'Falso', '❌')]

export function ParaQueCopiarJuego() {
  return (
    <JuegoDecide titulo="¿Para qué se copia el ADN?" pregunta="¿Es cierto?" instrucciones="Decide si cada frase es cierta o falsa." clave="cien:para-que-copiar-mejor" opciones={VF}
      cartas={[
        c('✂️', 'El ADN se copia antes de que la célula se divida', 'v', 'Así cada célula hija recibe una copia completa.'),
        c('🕐', 'La copia ocurre en la fase S de la interfase', 'v', 'S de síntesis: se fabrica el ADN nuevo.'),
        c('➗', 'Cada célula hija recibe la mitad del ADN', 'f', 'Cada una recibe una copia completa, no la mitad.'),
        c('✖️', 'Las dos cromátidas hermanas son copias idénticas', 'v', 'Salen de copiar una misma molécula de ADN.'),
        c('🧫', 'Solo se copia el ADN de las células de la piel', 'f', 'Toda célula que se divide copia su ADN.'),
      ]}
      cierre="Primero se copia, después se divide: cada hija lleva el ADN completo." />
  )
}

export function HorquillaJuego() {
  return (
    <JuegoDecide titulo="¿Quién hace qué?" pregunta="¿Qué lo hace?" instrucciones="En la horquilla trabajan varias piezas. Decide a cuál corresponde cada acción." clave="cien:horquilla-mejor"
      opciones={[o('hel', 'Helicasa', '✂️'), o('pol', 'ADN polimerasa', '🧱'), o('mol', 'Hebra molde', '📄')]}
      cartas={[
        c('🔓', 'Abre la doble hélice rompiendo los puentes entre bases', 'hel', 'La helicasa separa las dos hebras.'),
        c('🧱', 'Pone nucleótidos nuevos, A frente a T y G frente a C', 'pol', 'La polimerasa fabrica la hebra nueva.'),
        c('📄', 'Indica qué base va en cada lugar de la hebra nueva', 'mol', 'Cada hebra vieja sirve de molde.'),
        c('🍴', 'Forma la «horquilla» al ir separando las hebras', 'hel', 'La horquilla es la zona en forma de Y donde se abre el ADN.'),
        c('✔️', 'Revisa que la base puesta sea la correcta', 'pol', 'La polimerasa corrige sus propios errores.'),
      ]}
      cierre="La helicasa abre, cada hebra es molde y la polimerasa construye." />
  )
}

export function ModelosJuego() {
  return (
    <JuegoDecide titulo="¿Qué modelo es?" pregunta="¿Con qué modelo encaja?" instrucciones="Había tres ideas sobre cómo se copia el ADN. Decide a cuál corresponde cada descripción." clave="cien:modelos-replicacion-mejor"
      opciones={[o('con', 'Conservativa', '🔒'), o('semi', 'Semiconservativa', '🌓'), o('dis', 'Dispersiva', '🧩')]}
      cartas={[
        c('🌓', 'Cada molécula nueva tiene una hebra vieja y una nueva', 'semi', 'Es lo que pasa de verdad.'),
        c('🔒', 'La molécula original queda entera y la copia es toda nueva', 'con', 'Meselson y Stahl la descartaron.'),
        c('🧩', 'Cada hebra queda hecha de trozos viejos y nuevos mezclados', 'dis', 'También fue descartada.'),
        c('🔬', 'La que comprobaron Meselson y Stahl en 1958', 'semi', 'El ADN de la 1.ª generación tenía peso intermedio.'),
        c('⚖️', 'Daría una banda pesada y una liviana en la 1.ª generación', 'con', 'Pero apareció una sola banda intermedia.'),
      ]}
      cierre="La replicación es semiconservativa: una hebra vieja y una nueva." />
  )
}

export function EnzimasJuego() {
  return (
    <JuegoDecide titulo="Las enzimas de la horquilla" pregunta="¿Qué enzima es?" instrucciones="Decide qué enzima hace cada trabajo." clave="cien:enzimas-replicacion-mejor"
      opciones={[o('hel', 'Helicasa', '✂️'), o('pri', 'Primasa', '🔴'), o('pol', 'ADN polimerasa', '🧱'), o('lig', 'Ligasa', '🔗')]}
      cartas={[
        c('🔓', 'Separa las dos hebras', 'hel', 'Rompe los puentes de hidrógeno entre las bases.'),
        c('🔴', 'Pone un cebador corto de ARN para empezar', 'pri', 'La polimerasa no puede empezar de cero.'),
        c('➡️', 'Alarga la hebra nueva solo en sentido 5′ → 3′', 'pol', 'Por eso una hebra se copia seguida y la otra a trozos.'),
        c('🔗', 'Une los fragmentos de Okazaki', 'lig', 'Sella los cortes de la hebra rezagada.'),
        c('🩹', 'Cambia los cebadores de ARN por ADN', 'pol', 'Otra ADN polimerasa hace ese reemplazo.'),
      ]}
      cierre="Helicasa abre, primasa ceba, polimerasa copia y ligasa une." />
  )
}

export function ErroresJuego() {
  return (
    <JuegoDecide titulo="Errores en la copia" pregunta="¿Es cierto?" instrucciones="Decide si cada frase sobre los errores de la replicación es cierta o falsa." clave="cien:errores-replicacion-mejor" opciones={VF}
      cartas={[
        c('🔍', 'La polimerasa revisa y corrige sus propios errores', 'v', 'Se llama corrección de pruebas.'),
        c('💯', 'La copia del ADN nunca tiene errores', 'f', 'Muy pocos, pero alguno se escapa.'),
        c('🧬', 'Un error que no se corrige puede volverse una mutación', 'v', 'En la siguiente copia queda como un par cambiado.'),
        c('🎯', 'Queda más o menos un error por cada mil millones de bases', 'v', 'Es una de las copias más precisas que se conocen.'),
        c('☠️', 'Todas las mutaciones son dañinas', 'f', 'Muchas no cambian nada y algunas resultan útiles.'),
      ]}
      cierre="Copia rápida, revisión y reparación: muy pocos errores, pero no cero." />
  )
}
