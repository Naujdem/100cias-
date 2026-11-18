import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del tema 4 del área 2 (Expresión génica). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function DogmaJuego() {
  return (
    <JuegoDecide titulo="¿ADN, ARN o proteína?" pregunta="¿De cuál se trata?" instrucciones="Del gen a la proteína: decide a cuál corresponde cada pista." clave="cien:dogma-mejor"
      opciones={[o('adn', 'ADN', '🧬'), o('arn', 'ARN', '📨'), o('pro', 'Proteína', '🧶')]}
      cartas={[
        c('🗄️', 'Guarda las instrucciones y no sale del núcleo', 'adn', 'Es el archivo original.'),
        c('📨', 'Copia un gen y lleva el mensaje al ribosoma', 'arn', 'Es el ARN mensajero.'),
        c('🧶', 'Es una cadena de aminoácidos', 'pro', 'Los aminoácidos se unen en el ribosoma.'),
        c('🧪', 'Acelera las reacciones químicas de la célula (enzima)', 'pro', 'La mayoría de las enzimas son proteínas.'),
        c('🅤', 'Tiene uracilo', 'arn', 'U en lugar de T.'),
        c('🩸', 'La hemoglobina, que lleva oxígeno', 'pro', 'Es una proteína de los glóbulos rojos.'),
      ]}
      cierre="ADN → ARN → proteína: el gen se copia y el mensaje se traduce." />
  )
}

export function TranscripcionJuego() {
  return (
    <JuegoDecide titulo="Eres la ARN polimerasa" pregunta="¿Qué base pones en el ARN?" instrucciones="Mira la base de la hebra molde de ADN y elige la que va en el ARN." clave="cien:transcripcion-mejor"
      opciones={[o('A', 'A', '🟩'), o('U', 'U', '🟪'), o('G', 'G', '🟨'), o('C', 'C', '🟦')]}
      cartas={[
        c('🟩', 'Frente a una A del ADN', 'U', 'En el ARN no hay T: frente a A va U.'),
        c('🟥', 'Frente a una T del ADN', 'A', 'Frente a T va A.'),
        c('🟨', 'Frente a una G del ADN', 'C', 'G con C, como en el ADN.'),
        c('🟦', 'Frente a una C del ADN', 'G', 'C con G.'),
        c('🔤', 'La base que el ARN usa en lugar de la timina', 'U', 'El uracilo.'),
      ]}
      cierre="El ARN es complementario a la hebra molde, con U donde iría T." />
  )
}

export function CodigoGeneticoJuego() {
  return (
    <JuegoDecide titulo="¿Qué dice el codón?" pregunta="¿Qué aminoácido indica?" instrucciones="Usa la rueda si lo necesitas. Fíjate en que varios codones dicen lo mismo." clave="cien:codigo-genetico-mejor"
      opciones={[o('M', 'Metionina (inicio)', '🟢'), o('F', 'Fenilalanina', '🟡'), o('G', 'Glicina', '🔵'), o('stop', 'Parada', '🛑')]}
      cartas={[
        c('🔤', 'AUG', 'M', 'AUG es metionina y además marca el inicio.'),
        c('🔤', 'UUU', 'F', 'Fenilalanina: fue el primer codón descifrado.'),
        c('🔤', 'UUC', 'F', 'También fenilalanina: el código es redundante.'),
        c('🔤', 'GGA', 'G', 'Glicina.'),
        c('🔤', 'GGU', 'G', 'También glicina: GGU, GGC, GGA y GGG dicen lo mismo.'),
        c('🔤', 'UAA', 'stop', 'Codón de parada.'),
        c('🔤', 'UGA', 'stop', 'Otro codón de parada (hay tres: UAA, UAG y UGA).'),
      ]}
      cierre="64 codones, 20 aminoácidos y 3 paradas: varios codones dicen lo mismo." />
  )
}

export function TraduccionJuego() {
  return (
    <JuegoDecide titulo="¿Quién hace qué en la traducción?" pregunta="¿Quién es?" instrucciones="Decide a quién corresponde cada tarea." clave="cien:traduccion-mejor"
      opciones={[o('arnm', 'ARN mensajero', '📨'), o('arnt', 'ARN de transferencia', '🚚'), o('rib', 'Ribosoma', '🏭')]}
      cartas={[
        c('📨', 'Trae la copia del gen desde el núcleo', 'arnm', 'Lleva los codones que se van a leer.'),
        c('🚚', 'Trae un aminoácido y tiene un anticodón', 'arnt', 'Su anticodón encaja con el codón.'),
        c('🏭', 'Se mueve codón por codón y une los aminoácidos', 'rib', 'Es la fábrica de proteínas.'),
        c('🔑', 'Su anticodón UAC encaja con AUG', 'arnt', 'Es el ARNt que trae la metionina.'),
        c('🛑', 'Al llegar a un codón de parada, suelta la proteína', 'rib', 'No hay ARNt para los codones de parada.'),
        c('🔤', 'Tiene los codones AUG, UUC, GGA…', 'arnm', 'Su orden de letras dice qué proteína hacer.'),
      ]}
      cierre="El ARNm trae el mensaje, el ARNt los aminoácidos y el ribosoma los une." />
  )
}

export function RegulacionJuego() {
  return (
    <JuegoDecide titulo="Genes encendidos y apagados" pregunta="¿Es cierto?" instrucciones="Decide si cada frase es cierta o falsa." clave="cien:regulacion-mejor" opciones={[o('v', 'Cierto', '✅'), o('f', 'Falso', '❌')]}
      cartas={[
        c('🧬', 'Una neurona y una célula de músculo tienen el mismo ADN', 'v', 'Vienen de la misma célula inicial.'),
        c('💡', 'Todas las células usan todos sus genes al mismo tiempo', 'f', 'Cada tipo de célula enciende solo algunos.'),
        c('🔛', 'Un gen «encendido» se transcribe y produce su proteína', 'v', 'Así se usa la información.'),
        c('🩸', 'Las neuronas fabrican hemoglobina', 'f', 'Ese gen se enciende en las células que forman glóbulos rojos.'),
        c('🗝️', 'Los factores de transcripción ayudan a encender genes', 'v', 'Se pegan al promotor y dejan entrar a la ARN polimerasa.'),
      ]}
      cierre="Mismo ADN en todas las células; lo que cambia es qué genes se usan." />
  )
}

export function SplicingJuego() {
  return (
    <JuegoDecide titulo="¿Se queda o se va?" pregunta="¿Qué pasa con esta parte?" instrucciones="Al madurar el ARN, algunas partes se quedan y otras se cortan." clave="cien:splicing-mejor"
      opciones={[o('queda', 'Se queda', '✅'), o('va', 'Se corta', '✂️')]}
      cartas={[
        c('🟦', 'Los exones', 'queda', 'Forman el ARNm maduro.'),
        c('⬜', 'Los intrones', 'va', 'Se cortan y se descartan.'),
        c('🎩', 'La caperuza del extremo 5′', 'queda', 'Se agrega para proteger el ARN.'),
        c('〰️', 'La cola poli-A', 'queda', 'Se agrega en el extremo 3′.'),
      ]}
      cierre="Se cortan los intrones, se unen los exones y se agregan caperuza y cola." />
  )
}
