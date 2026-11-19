import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del área 6, tema 8 (Huesos y músculos). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function EsqueletoFuncionJuego() {
  return (
    <JuegoDecide titulo="¿Para qué sirve?" pregunta="¿Qué función cumple el esqueleto aquí?" instrucciones="Elige la función del esqueleto en cada caso." clave="cien:esqueleto-funcion-mejor"
      opciones={[o('sos', 'Sostén', '🏛️'), o('pro', 'Protección', '🛡️'), o('mov', 'Movimiento', '🏃'), o('fab', 'Fábrica de sangre', '🩸')]}
      cartas={[
        c('🧠', 'El cráneo rodea el encéfalo', 'pro', 'Como un casco natural.'),
        c('🦵', 'Las piernas cargan el peso del cuerpo', 'sos', 'Son columnas.'),
        c('🩸', 'La médula roja del esternón', 'fab', 'Produce células de la sangre.'),
        c('🫁', 'Las costillas rodean los pulmones', 'pro', 'Una jaula que protege.'),
        c('⚽', 'Los músculos jalan el fémur para patear', 'mov', 'Huesos y músculos trabajan juntos.'),
        c('🧍', 'La columna nos mantiene erguidos', 'sos', 'Es el eje del cuerpo.'),
      ]}
      cierre="Sostener, proteger, mover y fabricar sangre." />
  )
}

export function HuesoVivoJuego() {
  return (
    <JuegoDecide titulo="¿Verdad o mito?" pregunta="¿Es verdad lo que dice sobre los huesos?" instrucciones="Decide si cada frase sobre los huesos es verdad o mito." clave="cien:hueso-vivo-mejor"
      opciones={[o('v', 'Verdad', '✅'), o('m', 'Mito', '❌')]}
      cartas={[
        c('💀', 'Los huesos son piedras muertas dentro del cuerpo', 'm', 'Son tejido vivo, con vasos y células.'),
        c('🦴', 'Un hueso roto se puede reparar solo', 'v', 'Con el tiempo forma un callo; el yeso lo mantiene en su sitio.'),
        c('🥛', 'El calcio y la vitamina D los hacen fuertes', 'v', 'El sol ayuda a producir vitamina D.'),
        c('👶', 'Un bebé tiene menos huesos que un adulto', 'm', 'Tiene más: unos 300, y algunos se fusionan.'),
        c('🏋️', 'El ejercicio fortalece los huesos', 'v', 'El hueso se refuerza donde recibe carga.'),
      ]}
      cierre="El hueso es un tejido vivo que crece, se repara y se refuerza." />
  )
}

export function ArticulacionesJuego() {
  return (
    <JuegoDecide titulo="¿Cuánto se mueve?" pregunta="¿Qué tipo de articulación es?" instrucciones="Decide si cada articulación es fija, semimóvil o móvil." clave="cien:articulaciones-mejor"
      opciones={[o('fija', 'Fija', '🔒'), o('semi', 'Semimóvil', '↔️'), o('movil', 'Móvil', '🔄')]}
      cartas={[
        c('💀', 'Entre los huesos del cráneo', 'fija', 'Suturas.'),
        c('🦵', 'La rodilla', 'movil', 'Se dobla como una bisagra.'),
        c('🧍', 'Entre dos vértebras', 'semi', 'Con un disco de cartílago.'),
        c('💪', 'El hombro', 'movil', 'Gira en muchas direcciones.'),
        c('🫁', 'Las costillas con el esternón', 'semi', 'Se mueven un poco al respirar.'),
        c('🖐️', 'Los nudillos de los dedos', 'movil', 'Doblan y estiran.'),
      ]}
      cierre="Fijas, semimóviles y móviles." />
  )
}

export function MusculosTiposJuego() {
  return (
    <JuegoDecide titulo="¿Qué músculo es?" pregunta="¿Qué tipo de músculo hace esto?" instrucciones="Elige el tipo de músculo de cada tarjeta." clave="cien:musculos-tipos-mejor"
      opciones={[o('esq', 'Esquelético', '💪'), o('liso', 'Liso', '〰️'), o('car', 'Cardíaco', '❤️')]}
      cartas={[
        c('🏃', 'Mover las piernas al correr', 'esq', 'Voluntario y pegado a los huesos.'),
        c('💓', 'Latir sin parar toda la vida', 'car', 'Solo está en el corazón.'),
        c('🍽️', 'Empujar el alimento en el intestino', 'liso', 'Involuntario.'),
        c('✍️', 'Mover los dedos para escribir', 'esq', 'Lo controlas tú.'),
        c('🩸', 'Estrechar un vaso sanguíneo', 'liso', 'En las paredes de los vasos.'),
        c('😊', 'Sonreír', 'esq', 'Los músculos de la cara son esqueléticos.'),
      ]}
      cierre="Esquelético: voluntario. Liso y cardíaco: involuntarios." />
  )
}

export function PalancaJuego() {
  return (
    <JuegoDecide titulo="Partes de la palanca" pregunta="En el cuerpo, ¿qué papel cumple?" instrucciones="Decide qué parte de la palanca es cada cosa." clave="cien:palanca-mejor"
      opciones={[o('apoyo', 'Punto de apoyo', '🔺'), o('fuerza', 'Fuerza', '💪'), o('carga', 'Carga', '🏋️')]}
      cartas={[
        c('🦵', 'La articulación del codo', 'apoyo', 'Sobre ella gira el antebrazo.'),
        c('💪', 'El bíceps que jala', 'fuerza', 'El músculo aplica la fuerza.'),
        c('🎒', 'El morral que llevas en la mano', 'carga', 'Es lo que se levanta.'),
        c('🦴', 'La rodilla al patear un balón', 'apoyo', 'La pierna gira sobre ella.'),
        c('🦵', 'El gemelo de la pantorrilla', 'fuerza', 'Jala el talón hacia arriba.'),
        c('⚽', 'El balón que se patea', 'carga', 'Es lo que se mueve.'),
      ]}
      cierre="Punto de apoyo (articulación), fuerza (músculo) y carga (peso)." />
  )
}

export function SarcomeroJuego() {
  return (
    <JuegoDecide titulo="Dentro del músculo" pregunta="¿Verdad o falso?" instrucciones="Decide si cada frase sobre la contracción muscular es verdadera o falsa." clave="cien:sarcomero-mejor"
      opciones={[o('v', 'Verdad', '✅'), o('f', 'Falso', '❌')]}
      cartas={[
        c('🧵', 'Al contraerse, los filamentos se acortan', 'f', 'No se acortan: se deslizan unos sobre otros.'),
        c('🔋', 'La contracción gasta ATP', 'v', 'La miosina usa ATP para jalar.'),
        c('↔️', 'El sarcómero se acorta cuando la miosina jala la actina', 'v', 'Así se acorta todo el músculo.'),
        c('💪', 'Un músculo puede empujar', 'f', 'Solo jala; por eso trabajan en pareja.'),
        c('⚡', 'La orden de contraerse llega por un nervio', 'v', 'Desde una neurona motora.'),
      ]}
      cierre="Actina y miosina se deslizan; miles de sarcómeros acortan el músculo." />
  )
}
