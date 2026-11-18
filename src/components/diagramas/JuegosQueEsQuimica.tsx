import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de Química, área 1, tema 1 (¿Qué es la química?). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function EsMateriaJuego() {
  return (
    <JuegoDecide titulo="¿Es materia?" pregunta="¿Tiene masa y ocupa espacio?" instrucciones="Decide si cada cosa es materia o no." clave="cien:es-materia-mejor"
      opciones={[o('si', 'Es materia', '🧱'), o('no', 'No es materia', '✨')]}
      cartas={[
        c('🪨', 'Una piedra del río', 'si', 'Tiene masa y ocupa espacio.'),
        c('🎈', 'El aire dentro de un globo', 'si', 'El aire es materia: por eso infla el globo.'),
        c('💡', 'La luz de un bombillo', 'no', 'La luz es energía, no materia.'),
        c('🔊', 'El sonido de un tiple', 'no', 'El sonido es energía que viaja por la materia.'),
        c('💧', 'Una gota de agua', 'si', 'Tiene masa y ocupa espacio, aunque sea poco.'),
        c('🌫️', 'El humo del fogón', 'si', 'Son partículas y gases: es materia.'),
        c('😊', 'La alegría', 'no', 'Un sentimiento no tiene masa.'),
        c('🔥', 'El calor de la estufa', 'no', 'El calor es energía.'),
      ]}
      cierre="Materia es todo lo que tiene masa y ocupa espacio; la luz, el sonido y el calor son energía." />
  )
}

export function QueCienciaJuego() {
  return (
    <JuegoDecide titulo="¿Qué ciencia responde?" pregunta="¿Quién estudia esta pregunta?" instrucciones="Elige la ciencia que mejor responde cada pregunta." clave="cien:que-ciencia-mejor"
      opciones={[o('qui', 'Química', '⚗️'), o('fis', 'Física', '🧲'), o('bio', 'Biología', '🌿')]}
      cartas={[
        c('🔪', '¿Por qué se oxida el machete?', 'qui', 'El hierro reacciona con el oxígeno y el agua.'),
        c('🍊', '¿Qué tan rápido cae una naranja del árbol?', 'fis', 'Es movimiento y gravedad.'),
        c('🐸', '¿Cómo se reproduce la rana?', 'bio', 'Es un proceso de los seres vivos.'),
        c('🧼', '¿Qué tiene el jabón que quita la grasa?', 'qui', 'Sus moléculas atrapan la grasa y el agua.'),
        c('🌈', '¿Por qué se forma el arcoíris?', 'fis', 'La luz se separa en colores.'),
        c('🧂', '¿De qué está hecha la sal?', 'qui', 'De sodio y cloro unidos.'),
        c('🍞', '¿Por qué se infla el pan con levadura?', 'qui', 'La levadura produce CO₂; la química explica la reacción (y la biología, el hongo).'),
      ]}
      cierre="La química estudia de qué están hechas las cosas y cómo se transforman." />
  )
}

export function QuimicaCampoJuego() {
  return (
    <JuegoDecide titulo="Química en la finca" pregunta="¿Para qué se usa?" instrucciones="Decide para qué sirve cada producto en el campo." clave="cien:quimica-campo-mejor"
      opciones={[o('abono', 'Nutre la planta', '🌱'), o('cal', 'Corrige la acidez del suelo', '🪨'), o('plaga', 'Controla plagas o enfermedades', '🐛')]}
      cartas={[
        c('🧪', 'Urea', 'abono', 'Aporta nitrógeno, que la planta usa para crecer.'),
        c('⚪', 'Cal dolomita', 'cal', 'Neutraliza los suelos ácidos y aporta calcio y magnesio.'),
        c('🐔', 'Gallinaza', 'abono', 'Abono orgánico con nitrógeno y fósforo.'),
        c('🍂', 'Fungicida contra la roya del café', 'plaga', 'Controla el hongo que ataca las hojas.'),
        c('🔢', 'Triple 15 (N-P-K)', 'abono', 'Nitrógeno, fósforo y potasio en partes iguales.'),
        c('🔵', 'Caldo bordelés (sulfato de cobre y cal)', 'plaga', 'Fungicida tradicional.'),
        c('🪵', 'Ceniza del fogón', 'cal', 'Es básica: sube el pH del suelo (y aporta potasio).'),
      ]}
      cierre="Abonar, encalar y controlar plagas es química aplicada: hay que usar la dosis correcta." />
  )
}

export function LabSeguroJuego() {
  return (
    <JuegoDecide titulo="¿Laboratorio seguro?" pregunta="¿Está bien hecho?" instrucciones="Decide si cada acción es segura o peligrosa." clave="cien:lab-seguro-mejor"
      opciones={[o('si', 'Seguro', '✅'), o('no', 'Peligroso', '⛔')]}
      cartas={[
        c('🥽', 'Usar gafas y bata al calentar', 'si', 'Protegen ojos, piel y ropa.'),
        c('👃', 'Oler un frasco acercando la nariz', 'no', 'Se abanica el olor con la mano, de lejos.'),
        c('🏷️', 'Leer la etiqueta antes de usar un reactivo', 'si', 'Los pictogramas avisan del peligro.'),
        c('🥤', 'Guardar ácido en una botella de gaseosa', 'no', 'Alguien se lo puede tomar: siempre en su frasco rotulado.'),
        c('🧪', 'Apuntar el tubo de ensayo hacia el compañero', 'no', 'Si salpica, lo quema: se apunta hacia la pared.'),
        c('🍎', 'Comer en el laboratorio', 'no', 'La comida se puede contaminar.'),
        c('🧯', 'Saber dónde está el extintor', 'si', 'Antes de empezar, se ubica la salida y el extintor.'),
      ]}
      cierre="En el laboratorio: protección, etiquetas leídas y nada de comida." />
  )
}
