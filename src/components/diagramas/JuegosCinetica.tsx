import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de la velocidad de reacción (Química área 4, tema 6). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function RapidaLentaJuego() {
  return (
    <JuegoDecide titulo="¿Rápida o lenta?" pregunta="¿Cuánto tarda esta reacción?" instrucciones="Rápida: segundos o menos. Lenta: horas o días. Muy lenta: meses, años o millones de años." clave="cien:rapida-lenta-mejor"
      opciones={[o('r', 'Rápida', '⚡'), o('l', 'Lenta', '🐢'), o('ml', 'Muy lenta', '🦕')]}
      cartas={[
        c('🎆', 'La pólvora de un volador', 'r', 'Una explosión: casi instantánea.'),
        c('🍞', 'La masa del pan que se esponja', 'l', 'Horas de fermentación.'),
        c('🔩', 'Una puerta de hierro que se oxida', 'ml', 'Meses o años.'),
        c('💊', 'Una pastilla efervescente en agua', 'r', 'Segundos.'),
        c('🍌', 'Un banano que se madura', 'l', 'Unos días.'),
        c('🛢️', 'La formación del petróleo', 'ml', 'Millones de años.'),
        c('🔥', 'El gas de la estufa al encenderlo', 'r', 'Combustión inmediata.'),
        c('🍇', 'El guarapo que se fermenta', 'l', 'Días.'),
      ]}
      cierre="La velocidad mide cuánto producto aparece (o cuánto reactivo se gasta) por unidad de tiempo." />
  )
}

export function MasRapidoJuego() {
  return (
    <JuegoDecide titulo="¿Más rápido o más lento?" pregunta="Con este cambio, la reacción va…" instrucciones="Temperatura, superficie, concentración y catalizadores." clave="cien:mas-rapido-mejor"
      opciones={[o('mas', 'Más rápido', '⏩'), o('menos', 'Más lento', '⏪')]}
      cartas={[
        c('🧊', 'Guardar la carne en la nevera', 'menos', 'El frío frena las reacciones.'),
        c('🪵', 'Prender el fogón con astillas en vez de un tronco', 'mas', 'Más superficie.'),
        c('🍲', 'Cocinar en olla a presión (más temperatura)', 'mas', 'A más temperatura, más rápido.'),
        c('🧪', 'Usar vinagre con agua en vez de vinagre puro', 'menos', 'Menos concentración.'),
        c('🥔', 'Echar papa al agua oxigenada', 'mas', 'La papa tiene catalasa, una enzima.'),
        c('💊', 'Partir en pedacitos la pastilla efervescente', 'mas', 'Más superficie.'),
        c('🌬️', 'Soplarle aire a las brasas', 'mas', 'Más oxígeno: más concentración.'),
        c('🥫', 'Empacar el café al vacío', 'menos', 'Sin oxígeno se oxida más lento.'),
      ]}
      cierre="Más choques o choques más fuertes → reacción más rápida." />
  )
}

export function ColisionJuego() {
  return (
    <JuegoDecide titulo="¿Hay reacción?" pregunta="¿Este choque produce reacción?" instrucciones="Se necesita chocar, con energía suficiente y con la orientación correcta." clave="cien:colision-mejor" tiempo={12}
      opciones={[o('si', 'Sí reacciona', '💥'), o('no', 'No reacciona', '↩️')]}
      cartas={[
        c('🐢', 'Dos moléculas chocan muy despacio', 'no', 'No alcanzan la energía de activación.'),
        c('🎯', 'Chocan rápido y por las partes que reaccionan', 'si', 'Choque efectivo.'),
        c('🔄', 'Chocan rápido pero por el lado equivocado', 'no', 'Mala orientación.'),
        c('🚫', 'Las moléculas nunca se encuentran', 'no', 'Sin choque no hay reacción.'),
        c('🔥', 'En la llama, una molécula de gas choca de frente con una de oxígeno', 'si', 'Mucha energía.'),
        c('🧪', 'Con catalizador, un choque de energía media', 'si', 'El catalizador baja la energía necesaria.'),
      ]}
      cierre="De todos los choques, solo unos pocos son efectivos." />
  )
}

export function ActivacionJuego() {
  return (
    <JuegoDecide titulo="La colina de energía" pregunta="¿Qué pasa con la energía de activación o con el calor?" instrucciones="Ea: la energía mínima para reaccionar. Exotérmica: libera calor. Endotérmica: absorbe calor." clave="cien:activacion-mejor" tiempo={14}
      opciones={[o('baja', 'Baja la Ea', '⬇️'), o('exo', 'Exotérmica', '🔥'), o('endo', 'Endotérmica', '🧊')]}
      cartas={[
        c('⚗️', 'Se agrega un catalizador', 'baja', 'Abre un camino con menos energía.'),
        c('🔥', 'La leña al quemarse', 'exo', 'Libera calor y luz.'),
        c('🍳', 'Cocinar un huevo', 'endo', 'Hay que darle calor todo el tiempo.'),
        c('🧬', 'Una enzima de la saliva rompe el almidón', 'baja', 'Las enzimas son catalizadores.'),
        c('🌿', 'La fotosíntesis', 'endo', 'Absorbe la energía de la luz.'),
        c('🧤', 'Un calentador de manos de hierro que se oxida', 'exo', 'Libera calor.'),
        c('🚗', 'El convertidor catalítico del carro', 'baja', 'Acelera la transformación de los gases tóxicos.'),
      ]}
      cierre="Un catalizador no cambia el calor de la reacción: solo baja la colina." />
  )
}

export function ConservarAlimentosJuego() {
  return (
    <JuegoDecide titulo="Frenar o acelerar en la cocina" pregunta="¿Qué hace este truco?" instrucciones="Frenar: conservar la comida. Acelerar: cocinar, fermentar o ablandar." clave="cien:conservar-alimentos-mejor"
      opciones={[o('frena', 'Frena', '🛑'), o('acelera', 'Acelera', '🚀')]}
      cartas={[
        c('🧊', 'Congelar el pescado', 'frena', 'El frío frena las reacciones.'),
        c('🥩', 'Ablandar la carne con papaya', 'acelera', 'La papaína rompe proteínas.'),
        c('🧂', 'Salar la carne', 'frena', 'Quita el agua a los microbios.'),
        c('🍞', 'Ponerle levadura a la masa', 'acelera', 'La levadura fermenta el azúcar.'),
        c('🍋', 'Echarle limón al aguacate picado', 'frena', 'El ácido frena la enzima que lo pone negro.'),
        c('🫙', 'Hacer encurtidos con vinagre', 'frena', 'El ácido detiene a los microbios.'),
        c('🍌', 'Guardar los bananos con un aguacate en una bolsa', 'acelera', 'El gas etileno acelera la maduración.'),
      ]}
      cierre="Conservar alimentos es, en el fondo, frenar reacciones químicas." />
  )
}
