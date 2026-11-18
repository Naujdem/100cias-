import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de la historia del pensamiento evolutivo (área 4, tema 1). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })
const VF = [o('v', 'Cierto', '✅'), o('f', 'Falso', '❌')]

export function LinneoJuego() {
  return (
    <JuegoDecide titulo="Género y especie" pregunta="¿Qué parte del nombre es?" instrucciones="En cada nombre científico, decide si la palabra marcada es el género o la especie." clave="cien:linneo-mejor"
      opciones={[o('g', 'Género', '🔠'), o('e', 'Especie', '🔡')]}
      cartas={[
        c('🐻', 'TREMARCTOS ornatus (oso de anteojos)', 'g', 'La primera palabra, con mayúscula, es el género.'),
        c('🐆', 'Panthera ONCA (jaguar)', 'e', 'La segunda palabra, en minúscula, es la especie.'),
        c('🧍', 'HOMO sapiens (ser humano)', 'g', 'Homo es el género; sapiens, la especie.'),
        c('🌿', 'Espeletia GRANDIFLORA (un frailejón)', 'e', 'Espeletia es el género de los frailejones.'),
        c('🐸', 'PHYLLOBATES terribilis (rana dorada)', 'g', 'Phyllobates es el género; terribilis, la especie.'),
      ]}
      cierre="Género con mayúscula, especie con minúscula, y todo en cursiva." />
  )
}

export function LamarckJuego() {
  return (
    <JuegoDecide titulo="¿Se hereda?" pregunta="¿Lo heredan los hijos?" instrucciones="Decide si cada característica pasa a los hijos o se queda en quien la adquirió." clave="cien:lamarck-mejor"
      opciones={[o('si', 'Se hereda', '🧬'), o('no', 'No se hereda', '🚫')]}
      cartas={[
        c('💪', 'Músculos ganados haciendo pesas', 'no', 'Es un cambio adquirido en vida: no cambia los genes.'),
        c('👁️', 'Color de ojos de los padres', 'si', 'Depende de los genes, que sí pasan a los hijos.'),
        c('🩹', 'Una cicatriz de una caída', 'no', 'Las heridas no modifican el ADN de las células sexuales.'),
        c('🐕', 'Un perro al que le cortaron la cola', 'no', 'Sus cachorros nacen con cola normal.'),
        c('🦒', 'Cuello largo con el que nació una jirafa', 'si', 'Si nació así, es genético y puede heredarlo.'),
        c('🗣️', 'Un idioma aprendido', 'no', 'Lo aprendido no está en los genes.'),
      ]}
      cierre="Solo se hereda lo que está en los genes, no lo que se gana en vida." />
  )
}

export function CuvierJuego() {
  return (
    <JuegoDecide titulo="¿Vive o se extinguió?" pregunta="¿Existe hoy?" instrucciones="Decide si cada animal vive todavía o solo se conoce por fósiles." clave="cien:cuvier-mejor"
      opciones={[o('vive', 'Vive hoy', '🌿'), o('ext', 'Extinto', '🦴')]}
      cartas={[
        c('🦣', 'Mamut lanudo', 'ext', 'Cuvier mostró que era distinto de los elefantes vivos.'),
        c('🐘', 'Elefante africano', 'vive', 'Es pariente del mamut, pero de otra especie.'),
        c('🦥', 'Perezoso gigante terrestre (megaterio)', 'ext', 'Darwin encontró sus fósiles en Argentina.'),
        c('🐢', 'Tortuga gigante de Galápagos', 'vive', 'Sigue viva, aunque varias de sus especies están amenazadas.'),
        c('🦖', 'Tiranosaurio', 'ext', 'Desapareció hace unos 66 millones de años.'),
      ]}
      cierre="Los fósiles prueban que muchas especies se extinguieron." />
  )
}

export function LyellJuego() {
  return (
    <JuegoDecide titulo="¿Lento o de golpe?" pregunta="¿Cómo ocurre?" instrucciones="Decide si cada cambio del paisaje es lento o repentino." clave="cien:lyell-mejor"
      opciones={[o('lento', 'Lento', '🐢'), o('golpe', 'De golpe', '⚡')]}
      cartas={[
        c('🏞️', 'Un río excava su cañón', 'lento', 'Grano a grano, durante miles de años.'),
        c('🌋', 'Una erupción cubre un valle de ceniza', 'golpe', 'Ocurre en horas o días.'),
        c('🏜️', 'La lluvia talla las cárcavas de la Tatacoa', 'lento', 'Cada aguacero quita un poco de tierra.'),
        c('🌊', 'Un terremoto levanta una costa', 'golpe', 'Darwin lo vio en Chile en 1835.'),
        c('⛰️', 'Los Andes crecen hasta miles de metros', 'lento', 'Sube milímetros por año durante millones de años.'),
      ]}
      cierre="Lyell mostró que los cambios lentos, sumados, forman montañas." />
  )
}

export function BeagleJuego() {
  return (
    <JuegoDecide titulo="El viaje de Darwin" pregunta="¿Es cierto?" instrucciones="Decide si cada frase sobre el viaje del Beagle es cierta o falsa." clave="cien:beagle-mejor" opciones={VF}
      cartas={[
        c('⛵', 'El viaje duró unos cinco años', 'v', 'De 1831 a 1836.'),
        c('🎓', 'Darwin era un científico famoso cuando partió', 'f', 'Tenía 22 años y apenas había terminado sus estudios.'),
        c('🦥', 'Encontró fósiles de animales gigantes en Sudamérica', 'v', 'Perezosos y armadillos gigantes, parecidos a los actuales.'),
        c('🐦', 'Darwin supo enseguida que los pinzones eran especies distintas', 'f', 'Se lo mostró el ornitólogo John Gould en 1837.'),
        c('🏝️', 'Las Galápagos son islas volcánicas frente a Ecuador', 'v', 'Cada isla tiene sus propias tortugas y aves.'),
      ]}
      cierre="El viaje le dio a Darwin las preguntas; la respuesta tardó 20 años." />
  )
}

export function DarwinWallaceJuego() {
  return (
    <JuegoDecide titulo="¿Lamarck o Darwin?" pregunta="¿Quién lo explicaría así?" instrucciones="Lee cada explicación y decide si es de Lamarck o de Darwin y Wallace." clave="cien:darwin-lamarck-mejor"
      opciones={[o('l', 'Lamarck', '🦒'), o('d', 'Darwin y Wallace', '🐦')]}
      cartas={[
        c('🦒', 'Las jirafas estiraron el cuello y sus crías lo heredaron', 'l', 'Herencia de caracteres adquiridos.'),
        c('🦒', 'Las jirafas que nacieron con cuello más largo comieron más y tuvieron más crías', 'd', 'Variación + supervivencia diferencial = selección natural.'),
        c('🐇', 'Los conejos claros sobreviven más en la nieve y dejan más hijos', 'd', 'El ambiente selecciona una variación que ya existía.'),
        c('🐍', 'Las serpientes perdieron las patas por no usarlas', 'l', 'Es la idea del uso y desuso.'),
        c('🦠', 'Las bacterias que ya resistían el antibiótico sobrevivieron y se multiplicaron', 'd', 'Las resistentes ya existían: el antibiótico las seleccionó.'),
      ]}
      cierre="Darwin: la variación ya existe y el ambiente la selecciona. Lamarck: el individuo cambia y lo hereda." />
  )
}

export function SintesisJuego() {
  return (
    <JuegoDecide titulo="¿Quién lo explicó?" pregunta="¿De dónde viene la idea?" instrucciones="Decide si cada idea venía de Darwin, de Mendel o se sumó con la síntesis moderna." clave="cien:sintesis-mejor"
      opciones={[o('d', 'Darwin', '🐦'), o('m', 'Mendel', '🫛'), o('s', 'Síntesis', '🧩')]}
      cartas={[
        c('🐦', 'La selección natural cambia a las especies', 'd', 'Es la idea central de Darwin y Wallace.'),
        c('🫛', 'Los caracteres pasan por factores que no se mezclan', 'm', 'Los factores de Mendel son los genes.'),
        c('📊', 'La evolución es el cambio de las frecuencias de los alelos', 's', 'Lo calcularon Fisher, Haldane y Wright.'),
        c('🌳', 'Todas las especies descienden de antepasados comunes', 'd', 'Lo propuso Darwin en El origen de las especies.'),
        c('🧬', 'Las mutaciones son la fuente de la variación', 's', 'La genética explicó de dónde salen las variaciones.'),
      ]}
      cierre="Darwin + Mendel + mutaciones = la síntesis moderna." />
  )
}

export function RitmosJuego() {
  return (
    <JuegoDecide titulo="¿Qué ritmo?" pregunta="¿Gradual o puntuado?" instrucciones="Decide qué ritmo de cambio describe cada registro fósil." clave="cien:ritmos-mejor"
      opciones={[o('g', 'Gradual', '📈'), o('p', 'Puntuado', '📶')]}
      cartas={[
        c('🐚', 'Un caracol fósil igual durante 5 millones de años y luego otra forma', 'p', 'Larga quietud y un cambio corto.'),
        c('🐴', 'Los dientes de los caballos se alargan poco a poco en cada capa', 'g', 'Cambio lento y constante.'),
        c('🪲', 'Un trilobite casi sin cambios durante millones de años', 'p', 'Es el «equilibrio» del equilibrio puntuado.'),
        c('🦕', 'Una forma cambia un poco en cada época, sin saltos', 'g', 'Es la rampa suave del gradualismo.'),
      ]}
      cierre="Los dos ritmos existen: depende del grupo y de la época." />
  )
}

/* ═══ Tema 2 · Evidencias de la evolución ═══ */

export function FosilJuego() {
  return (
    <JuegoDecide titulo="¿Es un fósil?" pregunta="¿Es fósil?" instrucciones="Decide si cada hallazgo es un fósil o no." clave="cien:fosil-mejor"
      opciones={[o('si', 'Es fósil', '🦴'), o('no', 'No es fósil', '🚫')]}
      cartas={[
        c('🐊', 'Mandíbula de caimán convertida en roca en la Tatacoa', 'si', 'Los minerales reemplazaron el hueso: es un fósil.'),
        c('👣', 'Huellas de dinosaurio en una roca', 'si', 'Las huellas también son fósiles.'),
        c('🦴', 'Hueso de vaca enterrado el año pasado', 'no', 'Es reciente: no ha pasado el tiempo para fosilizarse.'),
        c('🐚', 'Concha marina dentro de una roca en lo alto de una montaña', 'si', 'Esa roca se formó en el mar y luego se levantó.'),
        c('🪨', 'Una piedra con forma de corazón', 'no', 'Su forma no viene de un ser vivo.'),
        c('🍂', 'Molde de una hoja en una roca', 'si', 'Una huella o molde de un ser vivo es un fósil.'),
      ]}
      cierre="Fósil: resto o huella de un ser vivo antiguo conservado en la roca." />
  )
}

export function AnatomiaJuego() {
  return (
    <JuegoDecide titulo="Homólogas, análogas o vestigiales" pregunta="¿Qué tipo de estructura?" instrucciones="Decide qué tipo de estructuras son en cada caso." clave="cien:anatomia-mejor"
      opciones={[o('ho', 'Homólogas', '🦇'), o('an', 'Análogas', '🦋'), o('ve', 'Vestigial', '🦴')]}
      cartas={[
        c('🐋', 'Aleta de ballena y brazo humano', 'ho', 'Mismos huesos, funciones distintas.'),
        c('🦅', 'Ala de águila y ala de mosca', 'an', 'Las dos sirven para volar, pero tienen origen distinto.'),
        c('🧍', 'El coxis humano', 've', 'Es el resto de una cola.'),
        c('🐈', 'Pata de gato y ala de murciélago', 'ho', 'Mismo plan de huesos de mamífero.'),
        c('🦈', 'Aleta de tiburón y aleta de delfín', 'an', 'Un pez y un mamífero con la misma solución para nadar.'),
        c('🐍', 'Huesitos de cadera de la boa', 've', 'Restos de las patas de sus antepasados.'),
        c('🐦', 'Ala de ave y pata delantera de lagarto', 'ho', 'Vienen del mismo plan de extremidad.'),
      ]}
      cierre="Homólogas: mismo origen. Análogas: misma función. Vestigiales: restos." />
  )
}

export function EmbrionesJuego() {
  return (
    <JuegoDecide titulo="Embriones" pregunta="¿Es cierto?" instrucciones="Decide si cada frase sobre los embriones de vertebrados es cierta o falsa." clave="cien:embriones-mejor" opciones={VF}
      cartas={[
        c('🐣', 'Los embriones tempranos de pez, pollo y humano se parecen', 'v', 'Comparten cola y arcos faríngeos.'),
        c('👶', 'El embrión humano tiene cola durante unas semanas', 'v', 'Luego se reduce hasta formar el coxis.'),
        c('🐟', 'El embrión humano respira con branquias', 'f', 'Tiene arcos faríngeos, pero nunca branquias que funcionen.'),
        c('🐖', 'Los adultos son tan parecidos como los embriones', 'f', 'Los adultos son muy distintos; el parecido es temprano.'),
        c('🧬', 'El parecido viene de un programa de desarrollo heredado', 'v', 'Lo heredaron de un antepasado común.'),
      ]}
      cierre="Desarrollos que empiezan igual: un antepasado común." />
  )
}

export function BiogeografiaJuego() {
  return (
    <JuegoDecide titulo="¿De dónde vienen?" pregunta="¿A quién se parecen más?" instrucciones="Decide a qué se parecen más los seres vivos de cada lugar." clave="cien:biogeografia-mejor"
      opciones={[o('cerca', 'Al continente cercano', '📍'), o('lejos', 'A un lugar lejano de clima igual', '🌍')]}
      cartas={[
        c('🐦', 'Pinzones de las Galápagos', 'cerca', 'Se parecen a aves de Sudamérica.'),
        c('🦎', 'Lagartos de las islas de Cabo Verde', 'cerca', 'Se parecen a los de África, el continente cercano.'),
        c('🌿', 'Frailejones de un páramo de Colombia', 'cerca', 'Se parecen a los de los páramos vecinos, no a plantas de montañas de África.'),
      ]}
      cierre="Las especies de las islas descienden de las del continente más cercano." />
  )
}

export function MolecularJuego() {
  return (
    <JuegoDecide titulo="¿Quién es más pariente?" pregunta="¿Qué especie es más cercana?" instrucciones="Compara las diferencias en un mismo gen y elige la especie más emparentada con la primera." clave="cien:molecular-mejor"
      opciones={[o('a', 'La primera opción', '1️⃣'), o('b', 'La segunda opción', '2️⃣')]}
      cartas={[
        c('🧍', 'Humano: ¿chimpancé (1 diferencia) o ratón (12)?', 'a', 'Menos diferencias, antepasado más reciente.'),
        c('🐈', 'Gato: ¿pez (20 diferencias) o perro (4)?', 'b', 'Gato y perro son mamíferos carnívoros.'),
        c('🐔', 'Pollo: ¿pato (3 diferencias) o tiburón (25)?', 'a', 'Pollo y pato son aves.'),
        c('🐸', 'Rana: ¿humano (18 diferencias) o salamandra (6)?', 'b', 'Rana y salamandra son anfibios.'),
      ]}
      cierre="Menos diferencias en el ADN = parentesco más cercano. (Cifras de ejemplo.)" />
  )
}
