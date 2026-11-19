import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del área 6, temas 9 (Cuerpo y salud) y 10 (Reproducción humana). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

/* ── Tema 9 ─────────────────────────────────────────────────────────────── */

export function SaludDimensionesJuego() {
  return (
    <JuegoDecide titulo="¿Qué salud cuida?" pregunta="¿Este hábito cuida sobre todo la salud física, la mental o la social?" instrucciones="Decide qué parte de la salud cuida más cada hábito." clave="cien:salud-dimensiones-mejor"
      opciones={[o('fis', 'Física', '💪'), o('men', 'Mental', '🧠'), o('soc', 'Social', '🤝')]}
      cartas={[
        c('🚲', 'Montar en bicicleta', 'fis', 'Corazón, pulmones y músculos.'),
        c('🗣️', 'Contarle a un amigo lo que te preocupa', 'men', 'Hablar alivia.'),
        c('⚽', 'Jugar en equipo con el curso', 'soc', 'Y también la física.'),
        c('🧼', 'Lavarse las manos antes de comer', 'fis', 'Previene infecciones.'),
        c('📵', 'Desconectarse del celular un rato', 'men', 'Descansa la mente.'),
        c('🎉', 'Participar en la fiesta de la vereda', 'soc', 'Comunidad y amistades.'),
      ]}
      cierre="La salud es bienestar físico, mental y social." />
  )
}

export function SuenoJuego() {
  return (
    <JuegoDecide titulo="¿Ayuda o daña el sueño?" pregunta="¿Esto ayuda a dormir bien?" instrucciones="Decide si cada costumbre ayuda o daña el sueño." clave="cien:sueno-mejor"
      opciones={[o('ayuda', 'Ayuda', '😴'), o('dana', 'Daña', '🚫')]}
      cartas={[
        c('📱', 'Ver el celular en la cama hasta tarde', 'dana', 'La luz y los videos espantan el sueño.'),
        c('🕘', 'Acostarse a la misma hora cada día', 'ayuda', 'El cuerpo se acostumbra.'),
        c('☕', 'Tomar café en la noche', 'dana', 'La cafeína dura horas.'),
        c('🌙', 'Cuarto oscuro y en silencio', 'ayuda', 'Facilita el sueño profundo.'),
        c('🏃', 'Hacer ejercicio durante el día', 'ayuda', 'Se duerme mejor.'),
        c('🍔', 'Comer mucho justo antes de dormir', 'dana', 'La digestión no deja descansar.'),
      ]}
      cierre="Rutina, oscuridad y nada de pantallas antes de dormir." />
  )
}

export function PlatoJuego() {
  return (
    <JuegoDecide titulo="¿En qué parte del plato va?" pregunta="¿Dónde pondrías este alimento?" instrucciones="Ubica cada alimento en su parte del plato saludable." clave="cien:plato-mejor"
      opciones={[o('ver', 'Verduras y frutas', '🥦'), o('cer', 'Cereales y tubérculos', '🍚'), o('pro', 'Proteínas', '🫘'), o('poco', 'De vez en cuando', '🍭')]}
      cartas={[
        c('🥕', 'Ensalada de zanahoria y repollo', 'ver', 'La mitad del plato.'),
        c('🥔', 'Papa cocida', 'cer', 'Es un tubérculo: energía.'),
        c('🫘', 'Fríjoles', 'pro', 'Proteína vegetal (también aportan energía).'),
        c('🍟', 'Paquete de papas fritas', 'poco', 'Mucha sal y grasa.'),
        c('🍌', 'Plátano maduro', 'cer', 'En Colombia se usa como el arroz o la papa.'),
        c('🥚', 'Huevo', 'pro', 'Proteína completa.'),
        c('🥤', 'Gaseosa', 'poco', 'Mucha azúcar: mejor agua.'),
      ]}
      cierre="Mitad verduras y frutas, un cuarto cereales, un cuarto proteínas, y agua." />
  )
}

export function PrevencionJuego() {
  return (
    <JuegoDecide titulo="¿Qué previene?" pregunta="¿Qué problema previene este hábito?" instrucciones="Elige qué previene cada hábito." clave="cien:prevencion-mejor"
      opciones={[o('infec', 'Infecciones', '🦠'), o('parasit', 'Parásitos', '🪱'), o('sol', 'Daño del sol', '☀️'), o('dientes', 'Caries', '🦷')]}
      cartas={[
        c('🧼', 'Lavarse las manos con jabón', 'infec', 'Quita los microbios.'),
        c('🔥', 'Hervir el agua del aljibe', 'parasit', 'Mata huevos y quistes.'),
        c('👟', 'No andar descalzo en el barro', 'parasit', 'Algunos gusanos entran por la piel.'),
        c('🧢', 'Usar gorra y bloqueador al mediodía', 'sol', 'La radiación es fuerte en la montaña.'),
        c('🪥', 'Cepillarse después de comer', 'dientes', 'Quita la placa bacteriana.'),
        c('💉', 'Tener el carné de vacunas al día', 'infec', 'Protege contra varias enfermedades.'),
      ]}
      cierre="Pequeños hábitos previenen muchas enfermedades." />
  )
}

export function SellosJuego() {
  return (
    <JuegoDecide titulo="Lee la etiqueta" pregunta="¿Este producto llevaría un sello de advertencia?" instrucciones="Decide si cada producto tendría sellos de «exceso en» azúcares, sodio o grasas." clave="cien:sellos-mejor"
      opciones={[o('si', 'Sí, con sellos', '⬛'), o('no', 'No', '✅')]}
      cartas={[
        c('🥤', 'Gaseosa', 'si', 'Exceso en azúcares.'),
        c('🍊', 'Una naranja', 'no', 'Es un alimento natural.'),
        c('🍜', 'Sopa instantánea de paquete', 'si', 'Exceso en sodio.'),
        c('🥛', 'Leche sin azúcar', 'no', 'Alimento poco procesado.'),
        c('🍪', 'Galletas rellenas', 'si', 'Azúcares y grasas.'),
        c('🫘', 'Fríjoles secos', 'no', 'Alimento natural.'),
      ]}
      cierre="Los sellos negros avisan de exceso en azúcares, sodio o grasas: menos sellos, mejor." />
  )
}

/* ── Tema 10 ────────────────────────────────────────────────────────────── */

export function ReproductorJuego() {
  return (
    <JuegoDecide titulo="¿Qué órgano es?" pregunta="¿Qué órgano cumple esta función?" instrucciones="Elige el órgano que corresponde a cada función." clave="cien:reproductor-mejor"
      opciones={[o('ovario', 'Ovario', '🟣'), o('utero', 'Útero', '🍐'), o('testiculo', 'Testículo', '🔵'), o('trompa', 'Trompa', '〰️')]}
      cartas={[
        c('🥚', 'Produce los óvulos', 'ovario', 'Y hormonas como los estrógenos.'),
        c('🤰', 'Alberga al bebé durante el embarazo', 'utero', 'Su pared crece cada ciclo.'),
        c('🏊', 'Produce los espermatozoides', 'testiculo', 'Y la testosterona.'),
        c('✨', 'Donde ocurre la fecundación', 'trompa', 'El óvulo viaja por ella.'),
        c('🩸', 'Su capa interna sale en la menstruación', 'utero', 'Es el endometrio.'),
      ]}
      cierre="Ovarios y testículos hacen gametos; el útero alberga el embarazo." />
  )
}

export function FecundacionJuego() {
  return (
    <JuegoDecide titulo="¿Óvulo o espermatozoide?" pregunta="¿De qué gameto se habla?" instrucciones="Decide si cada característica es del óvulo o del espermatozoide." clave="cien:fecundacion-mejor"
      opciones={[o('ovulo', 'Óvulo', '🟡'), o('esperma', 'Espermatozoide', '🔵')]}
      cartas={[
        c('🔵', 'Tiene cola (flagelo) para nadar', 'esperma', 'Se mueve por sí mismo.'),
        c('🟡', 'Es la célula más grande del cuerpo', 'ovulo', 'Apenas visible a simple vista.'),
        c('🗓️', 'Normalmente madura uno cada ciclo', 'ovulo', 'En la ovulación.'),
        c('🔢', 'Se producen millones cada día', 'esperma', 'Desde la pubertad.'),
        c('🍱', 'Lleva reservas para las primeras divisiones', 'ovulo', 'Por eso es tan grande.'),
      ]}
      cierre="Los dos gametos aportan 23 cromosomas cada uno." />
  )
}

export function CicloMenstrualJuego() {
  return (
    <JuegoDecide titulo="¿Qué fase es?" pregunta="¿En qué fase del ciclo pasa esto?" instrucciones="Elige la fase del ciclo menstrual de cada tarjeta." clave="cien:ciclo-menstrual-mejor"
      opciones={[o('mens', 'Menstruación', '🔴'), o('prep', 'Preparación', '🟡'), o('ovu', 'Ovulación', '🟢')]}
      cartas={[
        c('🩸', 'Sale la capa del útero que no se usó', 'mens', 'Dura de 3 a 7 días.'),
        c('🥚', 'El ovario suelta un óvulo', 'ovu', 'A mitad del ciclo, más o menos.'),
        c('🧱', 'El útero forma una capa nueva y gruesa', 'prep', 'Por si hay embarazo.'),
        c('📅', 'Es el día 1 del ciclo', 'mens', 'Así se cuenta.'),
        c('🌱', 'Madura un óvulo en el ovario', 'prep', 'Por acción de las hormonas.'),
      ]}
      cierre="Menstruación → preparación → ovulación → espera, y otra vez." />
  )
}

export function EmbarazoJuego() {
  return (
    <JuegoDecide titulo="¿Verdad o mito?" pregunta="¿Es verdad o es un mito?" instrucciones="Decide si cada frase sobre el embarazo es verdad o mito." clave="cien:embarazo-mejor"
      opciones={[o('v', 'Verdad', '✅'), o('m', 'Mito', '❌')]}
      cartas={[
        c('🫀', 'El corazón del embrión late desde las primeras semanas', 'v', 'Hacia la semana 6.'),
        c('🍺', 'Un poco de alcohol en el embarazo no afecta', 'm', 'Ninguna cantidad es segura para el bebé.'),
        c('🔗', 'La placenta lleva oxígeno y alimento al bebé', 'v', 'Por el cordón umbilical.'),
        c('🩺', 'Los controles prenatales cuidan a la madre y al bebé', 'v', 'Hay que ir desde el inicio.'),
        c('🚬', 'Fumar no pasa a la placenta', 'm', 'Las sustancias sí llegan al bebé.'),
      ]}
      cierre="Unas 40 semanas; la placenta alimenta y los controles cuidan." />
  )
}

export function SexualidadJuego() {
  return (
    <JuegoDecide titulo="¿Respeta o no respeta?" pregunta="¿Esta situación es respetuosa?" instrucciones="Decide si en cada situación hay respeto y cuidado." clave="cien:sexualidad-mejor"
      opciones={[o('si', 'Respeta', '🤝'), o('no', 'No respeta', '🚫')]}
      cartas={[
        c('🙅', 'Alguien dice «no» y el otro insiste', 'no', '«No» significa no.'),
        c('🗣️', 'Le cuentas a un adulto de confianza algo que te incomodó', 'si', 'Pedir ayuda es tu derecho.'),
        c('📸', 'Compartir la foto de otra persona sin su permiso', 'no', 'Es una falta grave a su intimidad.'),
        c('⏳', 'Esperar a sentirse listo para una relación', 'si', 'Cada quien decide su tiempo.'),
        c('🤫', 'Un adulto pide guardar un secreto sobre caricias', 'no', 'Ningún adulto debe pedir eso: cuéntalo.'),
        c('💬', 'Preguntar antes de abrazar a alguien', 'si', 'El consentimiento se pregunta.'),
      ]}
      cierre="Respeto, consentimiento y pedir ayuda cuando algo incomoda." />
  )
}

export function PrevencionRepJuego() {
  return (
    <JuegoDecide titulo="¿Verdad o mito?" pregunta="¿Es verdad o es un mito?" instrucciones="Decide si cada frase sobre prevención es verdad o mito." clave="cien:prevencion-rep-mejor"
      opciones={[o('v', 'Verdad', '✅'), o('m', 'Mito', '❌')]}
      cartas={[
        c('🩺', 'Los adolescentes tienen derecho a consulta en salud sexual', 'v', 'Hay servicios amigables para jóvenes.'),
        c('🦠', 'Las ITS siempre dan síntomas', 'm', 'Muchas no dan síntomas al principio.'),
        c('💉', 'Hay una vacuna contra el virus del papiloma humano (VPH)', 'v', 'Previene el cáncer de cuello uterino.'),
        c('🛡️', 'El condón protege de embarazos y de ITS', 'v', 'Es el único método que protege de las dos cosas.'),
        c('🗓️', 'En la primera relación no hay riesgo de embarazo', 'm', 'Sí puede haber embarazo.'),
      ]}
      cierre="Informarse y consultar a tiempo es parte del autocuidado." />
  )
}
