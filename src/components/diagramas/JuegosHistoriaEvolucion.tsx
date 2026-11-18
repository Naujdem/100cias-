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

/* ═══ Tema 3 · Selección natural ═══ */

export function IngredientesJuego() {
  return (
    <JuegoDecide titulo="Los ingredientes" pregunta="¿Qué ingrediente es?" instrucciones="Cada frase describe un ingrediente de la selección natural. Decide cuál." clave="cien:ingredientes-mejor"
      opciones={[o('var', 'Variación', '🎨'), o('her', 'Herencia', '🧬'), o('sob', 'Sobreproducción', '🥚'), o('sup', 'Supervivencia diferencial', '🏆')]}
      cartas={[
        c('🐸', 'Las ranas de una charca tienen manchas distintas', 'var', 'Los individuos no son iguales.'),
        c('🐟', 'Un pez pone miles de huevos, pero pocos llegan a adultos', 'sob', 'Nacen más de los que el ambiente puede sostener.'),
        c('👪', 'Los hijos se parecen a sus padres', 'her', 'Las características pasan de padres a hijos.'),
        c('🦎', 'Los lagartos más rápidos escapan más y dejan más crías', 'sup', 'No todos sobreviven y se reproducen igual.'),
        c('🌱', 'Unas plantas toleran mejor la sequía y producen más semillas', 'sup', 'El ambiente favorece a unas más que a otras.'),
        c('🐞', 'Las mariquitas de una especie tienen distinto número de puntos', 'var', 'Otra muestra de variación.'),
      ]}
      cierre="Variación + herencia + sobreproducción + supervivencia diferencial = selección natural." />
  )
}

export function PolillasJuego() {
  return (
    <JuegoDecide titulo="¿Quién sobrevive?" pregunta="¿Qué polilla se salva mejor?" instrucciones="Mira el fondo y decide qué polilla tiene más probabilidad de sobrevivir." clave="cien:polillas-mejor"
      opciones={[o('c', 'La clara', '🤍'), o('o', 'La oscura', '🖤')]}
      cartas={[
        c('🌳', 'Tronco claro cubierto de líquenes', 'c', 'La clara se confunde con el tronco.'),
        c('🏭', 'Tronco negro de hollín', 'o', 'La oscura pasa desapercibida.'),
        c('🌫️', 'Bosque cerca de una fábrica en 1890', 'o', 'El hollín oscureció los troncos.'),
        c('🍃', 'Bosque en 1990, con leyes de aire limpio', 'c', 'Los troncos volvieron a aclararse.'),
      ]}
      cierre="El ambiente decide qué variación es favorable." />
  )
}

export function ArtificialJuego() {
  return (
    <JuegoDecide titulo="¿Natural o artificial?" pregunta="¿Quién selecciona?" instrucciones="Decide si en cada caso selecciona el ambiente (natural) o las personas (artificial)." clave="cien:artificial-mejor"
      opciones={[o('nat', 'Natural', '🌿'), o('art', 'Artificial', '👩‍🌾')]}
      cartas={[
        c('🌽', 'Del teosinte al maíz de mazorca grande', 'art', 'Los agricultores escogieron las semillas.'),
        c('🐕', 'Del lobo a los perros de todas las razas', 'art', 'Las personas eligieron qué perros se cruzaban.'),
        c('🦠', 'Bacterias resistentes a un antibiótico', 'nat', 'El antibiótico, parte del ambiente, las seleccionó.'),
        c('🐄', 'Vacas que dan más leche', 'art', 'Los ganaderos cruzan a las que más producen.'),
        c('🐦', 'Pinzones con picos más grandes tras una sequía', 'nat', 'Solo los de pico grande podían romper las semillas duras.'),
        c('☕', 'Variedades de café resistentes a la roya', 'art', 'Se cruzaron y escogieron plantas resistentes.'),
      ]}
      cierre="En la artificial elige la persona; en la natural, el ambiente." />
  )
}

export function ResistenciaJuego() {
  return (
    <JuegoDecide titulo="Antibióticos" pregunta="¿Ayuda o empeora la resistencia?" instrucciones="Decide si cada acción ayuda a evitar bacterias resistentes o la empeora." clave="cien:resistencia-mejor"
      opciones={[o('ayuda', 'Ayuda a evitarla', '✅'), o('empeora', 'La empeora', '⚠️')]}
      cartas={[
        c('💊', 'Dejar el antibiótico apenas te sientes mejor', 'empeora', 'Pueden sobrevivir las más resistentes y multiplicarse.'),
        c('🩺', 'Tomarlo solo cuando el médico lo receta', 'ayuda', 'Menos uso innecesario, menos selección de resistentes.'),
        c('🤧', 'Tomar antibióticos para una gripa', 'empeora', 'La gripa es por virus: el antibiótico no sirve y selecciona bacterias.'),
        c('🧼', 'Lavarse las manos', 'ayuda', 'Menos infecciones, menos antibióticos.'),
        c('🐔', 'Dar antibióticos a animales sanos para que engorden', 'empeora', 'Selecciona bacterias resistentes en las granjas.'),
      ]}
      cierre="Cada uso innecesario de antibióticos selecciona bacterias resistentes." />
  )
}

export function TiposSeleccionJuego() {
  return (
    <JuegoDecide titulo="Tres tipos de selección" pregunta="¿Qué tipo es?" instrucciones="Decide qué tipo de selección describe cada caso." clave="cien:tipos-seleccion-mejor"
      opciones={[o('dir', 'Direccional', '➡️'), o('est', 'Estabilizadora', '🎯'), o('dis', 'Disruptiva', '↔️')]}
      cartas={[
        c('🐦', 'Tras una sequía sobreviven los pinzones de pico más grande', 'dir', 'Se favorece un extremo.'),
        c('👶', 'Los bebés de peso medio sobreviven más que los muy pequeños o muy grandes', 'est', 'Se favorece el promedio.'),
        c('🐟', 'En un lago sobreviven los peces muy pequeños y los muy grandes', 'dis', 'Se favorecen los dos extremos.'),
        c('🦒', 'Las jirafas de cuello más largo alcanzan más hojas', 'dir', 'La población se corre hacia cuellos más largos.'),
        c('🥚', 'Las aves que ponen un número medio de huevos crían más pollos', 'est', 'Muy pocos o demasiados huevos son una desventaja.'),
      ]}
      cierre="Direccional: un extremo. Estabilizadora: el promedio. Disruptiva: los dos extremos." />
  )
}

/* ═══ Tema 4 · Adaptaciones ═══ */

export function AdaptacionJuego() {
  return (
    <JuegoDecide titulo="¿Adaptación o no?" pregunta="¿Es una adaptación?" instrucciones="Decide si cada caso es una adaptación (heredada) o un cambio que ocurre en la vida de un individuo." clave="cien:adaptacion-mejor"
      opciones={[o('si', 'Adaptación', '🧬'), o('no', 'Cambio en vida', '🔄')]}
      cartas={[
        c('🌿', 'Los pelos blancos de las hojas del frailejón', 'si', 'Se heredan y lo protegen del frío y del sol.'),
        c('🏖️', 'Una persona que se broncea en la playa', 'no', 'Es una respuesta del cuerpo, no se hereda.'),
        c('🐦', 'El pico largo del colibrí pico de espada', 'si', 'Heredado; le permite alcanzar flores muy largas.'),
        c('🏋️', 'Un atleta que aumenta su capacidad pulmonar', 'no', 'Lo gana con entrenamiento; sus hijos no lo heredan.'),
        c('🐻', 'El pelaje grueso del oso de anteojos en el páramo', 'si', 'Rasgo heredado que conserva el calor.'),
      ]}
      cierre="Una adaptación se hereda; lo que se gana en vida no." />
  )
}

export function MorfologicaJuego() {
  return (
    <JuegoDecide titulo="¿Para qué sirve?" pregunta="¿Qué ventaja da?" instrucciones="Decide para qué le sirve a cada ser vivo su estructura." clave="cien:morfologica-mejor"
      opciones={[o('frio', 'Aguantar el frío', '❄️'), o('comer', 'Conseguir alimento', '🍽️'), o('mover', 'Moverse', '🏊')]}
      cartas={[
        c('🌿', 'Hojas secas que cubren el tallo del frailejón', 'frio', 'Funcionan como abrigo.'),
        c('🐦', 'Pico largo y delgado del colibrí', 'comer', 'Alcanza el néctar en el fondo de la flor.'),
        c('🦆', 'Patas palmeadas del pato', 'mover', 'Remos para nadar.'),
        c('🐻', 'Pelaje grueso del oso de anteojos', 'frio', 'Conserva el calor en el páramo.'),
        c('🐜', 'Mandíbulas fuertes de la hormiga arriera', 'comer', 'Corta hojas para cultivar su hongo.'),
        c('🐬', 'Cuerpo en forma de torpedo del delfín', 'mover', 'Corta el agua con poca resistencia.'),
      ]}
      cierre="La forma de cada estructura encaja con su función en el ambiente." />
  )
}

export function FisiologicaJuego() {
  return (
    <JuegoDecide titulo="Por dentro" pregunta="¿Es cierto?" instrucciones="Decide si cada frase sobre adaptaciones fisiológicas es cierta o falsa." clave="cien:fisiologica-mejor" opciones={VF}
      cartas={[
        c('🌵', 'Los cactus abren sus estomas de noche para perder menos agua', 'v', 'De día, con calor, los mantienen cerrados.'),
        c('🐸', 'La rana dorada produce un veneno muy potente en su piel', 'v', 'Se considera de los animales más venenosos.'),
        c('🐪', 'Los camellos guardan agua en la joroba', 'f', 'La joroba guarda grasa; ahorran agua de otras formas.'),
        c('🐻‍❄️', 'Algunos animales hibernan para ahorrar energía en invierno', 'v', 'Bajan su temperatura y su ritmo cardíaco.'),
        c('🌿', 'Las plantas del páramo dejan de hacer fotosíntesis por el frío', 'f', 'Siguen haciéndola; tienen adaptaciones para el frío.'),
      ]}
      cierre="Las adaptaciones fisiológicas cambian cómo funciona el cuerpo por dentro." />
  )
}

export function ConductaJuego() {
  return (
    <JuegoDecide titulo="¿Qué tipo de adaptación?" pregunta="¿Forma, función o conducta?" instrucciones="Decide si cada adaptación es morfológica (forma), fisiológica (funcionamiento) o de conducta (comportamiento)." clave="cien:tipo-adaptacion-mejor"
      opciones={[o('mor', 'Morfológica', '📐'), o('fis', 'Fisiológica', '⚙️'), o('con', 'De conducta', '🏃')]}
      cartas={[
        c('🐦', 'Aves que viajan del norte a Colombia cada año', 'con', 'La migración es un comportamiento.'),
        c('🦇', 'El guácharo sale de la cueva solo de noche', 'con', 'Evita depredadores y busca frutos de noche.'),
        c('🐦', 'El pico de espada del colibrí', 'mor', 'Es una forma del cuerpo.'),
        c('🐸', 'El veneno de la rana dorada', 'fis', 'Es una sustancia que su cuerpo produce.'),
        c('🐜', 'Las arrieras cultivan un hongo con las hojas que cortan', 'con', 'Es un comportamiento de la colonia.'),
        c('🌵', 'El cactus abre los estomas de noche', 'fis', 'Es su forma de funcionar.'),
      ]}
      cierre="Forma (morfológica), funcionamiento (fisiológica) y comportamiento (conducta)." />
  )
}

export function MimetismoJuego() {
  return (
    <JuegoDecide titulo="Esconderse o avisar" pregunta="¿Qué estrategia usa?" instrucciones="Decide si cada ser vivo se esconde, avisa que es peligroso o imita a otro." clave="cien:mimetismo-mejor"
      opciones={[o('cam', 'Camuflaje', '🍃'), o('adv', 'Advertencia', '⚠️'), o('imi', 'Imita a otro', '🎭')]}
      cartas={[
        c('🍃', 'Un insecto con forma y color de hoja', 'cam', 'Se confunde con el fondo.'),
        c('🐸', 'Rana dorada amarilla brillante y venenosa', 'adv', 'Sus colores avisan del peligro.'),
        c('🐍', 'Falsa coral inofensiva con anillos rojos, negros y amarillos', 'imi', 'Imita a la coral venenosa.'),
        c('🦋', 'Polilla con manchas como ojos grandes en las alas', 'imi', 'Parece la cara de un animal más grande.'),
        c('🦎', 'Lagartija del mismo color que la corteza', 'cam', 'Pasa desapercibida.'),
        c('🐝', 'Avispa con rayas amarillas y negras', 'adv', 'Avisa que pica.'),
      ]}
      cierre="Esconderse, avisar o engañar: tres formas de no ser comido." />
  )
}

/* ═══ Tema 5 · Mecanismos de cambio en poblaciones ═══ */

export function MecanismosJuego() {
  return (
    <JuegoDecide titulo="¿Qué mecanismo es?" pregunta="¿Qué cambió las frecuencias?" instrucciones="Decide qué mecanismo explica cada caso." clave="cien:mecanismos-mejor"
      opciones={[o('mut', 'Mutación', '🧬'), o('der', 'Deriva', '🎲'), o('flu', 'Flujo génico', '🚶'), o('sel', 'Selección', '🏆')]}
      cartas={[
        c('🔥', 'Un incendio mata al azar a casi todos los venados de un bosque', 'der', 'Cuello de botella: decide el azar, no la ventaja.'),
        c('🌳', 'Un corredor biológico une dos bosques y llegan monos de otro grupo', 'flu', 'Los migrantes traen alelos nuevos.'),
        c('☢️', 'Aparece un alelo nuevo por un error al copiar el ADN', 'mut', 'Es la fuente de variación nueva.'),
        c('🦠', 'Las bacterias resistentes sobreviven al antibiótico', 'sel', 'Hay una ventaja que se hereda.'),
        c('🏝️', 'Unas pocas iguanas llegan a una isla en un tronco y fundan una población', 'der', 'Efecto fundador: los alelos de esas pocas.'),
        c('🐦', 'Los gallitos de roca más vistosos consiguen más parejas', 'sel', 'Es selección sexual.'),
      ]}
      cierre="Mutación crea, deriva sortea, flujo mezcla y selección escoge." />
  )
}

export function DerivaJuego() {
  return (
    <JuegoDecide titulo="¿Azar o ventaja?" pregunta="¿Deriva o selección?" instrucciones="Decide si el cambio se debe al azar (deriva) o a una ventaja (selección)." clave="cien:deriva-mejor"
      opciones={[o('der', 'Azar (deriva)', '🎲'), o('sel', 'Ventaja (selección)', '🏆')]}
      cartas={[
        c('🌊', 'Una inundación arrastra a la mitad de los escarabajos, sin importar su color', 'der', 'Nadie tenía ventaja: fue el azar.'),
        c('🐦', 'Las aves comen más escarabajos verdes sobre tierra oscura', 'sel', 'El color marrón da ventaja.'),
        c('🚜', 'Una carretera deja aislados a 6 armadillos', 'der', 'Población pequeña: el azar pesa mucho.'),
        c('❄️', 'En una helada sobreviven más las plantas con hojas peludas', 'sel', 'Las hojas peludas dan ventaja.'),
        c('🏝️', 'Tres lagartijas llegan a una isla y todas son de rayas', 'der', 'Efecto fundador.'),
      ]}
      cierre="En la deriva decide la suerte; en la selección, la ventaja." />
  )
}

export function FlujoJuego() {
  return (
    <JuegoDecide titulo="¿Más o menos flujo?" pregunta="¿Qué pasa con el flujo génico?" instrucciones="Decide si cada situación aumenta o disminuye el flujo de genes entre poblaciones." clave="cien:flujo-mejor"
      opciones={[o('mas', 'Aumenta', '⬆️'), o('menos', 'Disminuye', '⬇️')]}
      cartas={[
        c('🛣️', 'Una carretera parte un bosque en dos', 'menos', 'Los animales ya no se cruzan con los del otro lado.'),
        c('🌳', 'Se siembra un corredor de árboles entre dos bosques', 'mas', 'Los animales pueden pasar y cruzarse.'),
        c('🌾', 'El viento lleva polen de un maizal a otro', 'mas', 'El polen lleva genes.'),
        c('🏙️', 'Se tala el bosque y quedan parches pequeños', 'menos', 'Las poblaciones quedan aisladas.'),
        c('🌉', 'Se construye un paso de fauna sobre una vía', 'mas', 'Reconecta las poblaciones.'),
      ]}
      cierre="El flujo génico mantiene unidas a las poblaciones; el aislamiento las separa." />
  )
}

export function SexualJuego() {
  return (
    <JuegoDecide titulo="Selección sexual" pregunta="¿Es cierto?" instrucciones="Decide si cada frase sobre la selección sexual es cierta o falsa." clave="cien:sexual-mejor" opciones={VF}
      cartas={[
        c('🦚', 'La cola del pavo real ayuda a conseguir pareja', 'v', 'Las hembras prefieren colas grandes y vistosas.'),
        c('🐦', 'Los colores vivos de los machos nunca tienen costo', 'f', 'También los hacen más visibles para los depredadores.'),
        c('💃', 'Los saltarines de la selva hacen bailes para atraer hembras', 'v', 'Es una conducta seleccionada por las hembras.'),
        c('🦌', 'Las astas de los venados machos sirven para pelear por las hembras', 'v', 'Competencia entre machos.'),
      ]}
      cierre="La selección sexual favorece lo que ayuda a conseguir pareja, aunque cueste." />
  )
}

export function HardyJuego() {
  return (
    <JuegoDecide titulo="¿Hay equilibrio?" pregunta="¿Se mantiene el equilibrio?" instrucciones="El equilibrio de Hardy-Weinberg se mantiene solo si no actúa ningún mecanismo. Decide en cada caso." clave="cien:hardy-mejor"
      opciones={[o('si', 'Se mantiene', '⚖️'), o('no', 'Se rompe', '💥')]}
      cartas={[
        c('🐁', 'Población enorme, sin migración, sin mutaciones, apareamiento al azar y sin selección', 'si', 'Se cumplen todas las condiciones.'),
        c('🏝️', 'Población de 8 individuos', 'no', 'Es pequeña: actúa la deriva.'),
        c('🚶', 'Llegan individuos de otra población', 'no', 'Hay flujo génico.'),
        c('🦚', 'Las hembras prefieren a los machos más vistosos', 'no', 'El apareamiento no es al azar.'),
        c('🦠', 'Un alelo da resistencia a una enfermedad', 'no', 'Hay selección natural.'),
      ]}
      cierre="En la naturaleza casi siempre actúa algún mecanismo: por eso las poblaciones evolucionan." />
  )
}

/* ═══ Tema 6 · Especiación ═══ */

export function EspecieJuego() {
  return (
    <JuegoDecide titulo="¿Misma especie?" pregunta="¿Son de la misma especie?" instrucciones="Decide si cada pareja es de la misma especie según si pueden tener hijos fértiles." clave="cien:especie-mejor"
      opciones={[o('si', 'Misma especie', '✅'), o('no', 'Especies distintas', '❌')]}
      cartas={[
        c('🐕', 'Un chihuahua y un gran danés', 'si', 'Se ven muy distintos, pero son la misma especie.'),
        c('🫏', 'Un burro y una yegua (su cría, la mula, es estéril)', 'no', 'Su descendencia no es fértil.'),
        c('🧍', 'Dos personas de continentes distintos', 'si', 'Todos los humanos somos Homo sapiens.'),
        c('🦁', 'Un león y un tigre (en la naturaleza no se cruzan)', 'no', 'Solo se han cruzado en cautiverio y sus crías suelen ser estériles.'),
        c('🐦', 'Dos pinzones de islas distintas que ya no se aparean', 'no', 'Si no se cruzan en la naturaleza, son especies distintas.'),
      ]}
      cierre="Lo que define la especie no es el aspecto, sino tener hijos fértiles juntos." />
  )
}

export function AislamientoJuego() {
  return (
    <JuegoDecide titulo="Barreras reproductivas" pregunta="¿Qué barrera es?" instrucciones="Decide qué tipo de barrera impide que las dos especies tengan hijos fértiles." clave="cien:aislamiento-mejor"
      opciones={[o('hab', 'De hábitat', '🏞️'), o('tiem', 'De tiempo', '📅'), o('con', 'De conducta', '🎶'), o('post', 'Híbrido estéril', '🚫')]}
      cartas={[
        c('🐸', 'Dos ranas cantan canciones distintas y las hembras solo responden a la suya', 'con', 'El cortejo no coincide.'),
        c('🌸', 'Dos plantas florecen en meses distintos', 'tiem', 'Su polen nunca coincide.'),
        c('🐍', 'Una serpiente vive en el agua y otra en el bosque seco', 'hab', 'No se encuentran.'),
        c('🫏', 'El burro y la yegua tienen mulas que no se reproducen', 'post', 'La barrera actúa después de la fecundación.'),
        c('🐦', 'Dos aves tienen bailes de cortejo diferentes', 'con', 'La hembra no reconoce al macho de la otra especie.'),
        c('🐞', 'Dos insectos se reproducen uno de día y otro de noche', 'tiem', 'No coinciden en el tiempo.'),
      ]}
      cierre="Las barreras antes o después de la fecundación mantienen separadas a las especies." />
  )
}

export function AlopatricaJuego() {
  return (
    <JuegoDecide titulo="¿Con o sin barrera?" pregunta="¿Alopátrica o simpátrica?" instrucciones="Decide si la especie nueva se formó con una barrera geográfica (alopátrica) o en el mismo lugar (simpátrica)." clave="cien:alopatrica-mejor"
      opciones={[o('alo', 'Alopátrica', '⛰️'), o('sim', 'Simpátrica', '📍')]}
      cartas={[
        c('🦐', 'Camarones separados por el cierre del istmo de Panamá', 'alo', 'Una barrera de tierra separó el Caribe y el Pacífico.'),
        c('🌾', 'Una planta duplica sus cromosomas y ya no se cruza con las demás', 'sim', 'Poliploidía, en el mismo lugar.'),
        c('🐒', 'Monos separados por un río que se formó', 'alo', 'El río es la barrera.'),
        c('🪰', 'Moscas que empiezan a vivir en otro árbol frutal del mismo huerto', 'sim', 'Cambio de hospedero sin barrera geográfica.'),
        c('🌿', 'Frailejones aislados en páramos separados por valles cálidos', 'alo', 'Los valles funcionan como el mar entre islas.'),
      ]}
      cierre="Alopátrica: con barrera geográfica. Simpátrica: en el mismo lugar." />
  )
}

export function RadiacionJuego() {
  return (
    <JuegoDecide titulo="Radiación adaptativa" pregunta="¿Es cierto?" instrucciones="Decide si cada frase sobre la radiación adaptativa es cierta o falsa." clave="cien:radiacion-mejor" opciones={VF}
      cartas={[
        c('🐦', 'Los pinzones de las Galápagos vienen de un antepasado común', 'v', 'Llegó del continente y se diversificó.'),
        c('🌿', 'En los páramos hay más de cien especies de frailejones', 'v', 'Se diversificaron en pocos millones de años.'),
        c('🏝️', 'La radiación adaptativa ocurre más en lugares llenos de competidores', 'f', 'Ocurre sobre todo donde hay nichos vacíos.'),
        c('🦖', 'Tras la extinción de los dinosaurios, los mamíferos se diversificaron', 'v', 'Ocuparon los nichos que quedaron libres.'),
      ]}
      cierre="Un antepasado + muchos nichos vacíos = muchas especies nuevas." />
  )
}

/* ═══ Tema 7 · Clasificación y árbol de la vida ═══ */

export function CategoriasJuego() {
  return (
    <JuegoDecide titulo="¿Qué categoría es?" pregunta="¿A qué nivel corresponde?" instrucciones="Decide a qué categoría taxonómica corresponde cada nombre." clave="cien:categorias-mejor"
      opciones={[o('reino', 'Reino', '👑'), o('clase', 'Clase', '🏫'), o('familia', 'Familia', '🏠'), o('especie', 'Especie', '🔹')]}
      cartas={[
        c('🐻', 'Animalia', 'reino', 'El reino de los animales.'),
        c('🐦', 'Aves', 'clase', 'La clase de las aves.'),
        c('🐆', 'Felidae', 'familia', 'Las familias de animales terminan en -idae.'),
        c('🧍', 'Homo sapiens', 'especie', 'Nombre de dos palabras: especie.'),
        c('🍄', 'Fungi', 'reino', 'El reino de los hongos.'),
        c('🐸', 'Amphibia', 'clase', 'La clase de los anfibios.'),
        c('🌿', 'Asteraceae', 'familia', 'Las familias de plantas terminan en -aceae.'),
      ]}
      cierre="Dominio, reino, filo, clase, orden, familia, género y especie." />
  )
}

export function DominiosJuego() {
  return (
    <JuegoDecide titulo="Tres dominios" pregunta="¿En qué dominio va?" instrucciones="Decide a qué dominio pertenece cada ser vivo." clave="cien:dominios-mejor"
      opciones={[o('bac', 'Bacteria', '🦠'), o('arq', 'Archaea', '♨️'), o('euk', 'Eukarya', '🧫')]}
      cartas={[
        c('🍄', 'Un champiñón', 'euk', 'Los hongos tienen células con núcleo.'),
        c('🦠', 'La bacteria del yogur', 'bac', 'Sin núcleo: dominio Bacteria.'),
        c('♨️', 'Un microbio de las aguas termales hirvientes', 'arq', 'Muchas arqueas viven en ambientes extremos.'),
        c('🌿', 'Un frailejón', 'euk', 'Las plantas son eucariotas.'),
        c('🦠', 'La bacteria que causa la tuberculosis', 'bac', 'Es una bacteria.'),
        c('🧫', 'Una ameba', 'euk', 'Es un protista: tiene núcleo.'),
      ]}
      cierre="Bacteria y Archaea no tienen núcleo; Eukarya sí." />
  )
}

export function CladogramaJuego() {
  return (
    <JuegoDecide titulo="¿Quién es más pariente?" pregunta="¿Más pariente de cuál?" instrucciones="Usa el cladograma (lanceta, pez, rana, lagarto, oso) y elige al pariente más cercano." clave="cien:cladograma-mejor"
      opciones={[o('a', 'El primero', '1️⃣'), o('b', 'El segundo', '2️⃣')]}
      cartas={[
        c('🐻', 'El oso: ¿del lagarto o del pez?', 'a', 'Oso y lagarto comparten el huevo con cáscara (amnios).'),
        c('🐸', 'La rana: ¿de la lanceta o del oso?', 'b', 'Rana y oso comparten columna y cuatro patas.'),
        c('🐟', 'El pez: ¿de la lanceta o de la rana?', 'b', 'Pez y rana comparten la columna vertebral.'),
        c('🦎', 'El lagarto: ¿del oso o de la rana?', 'a', 'Comparten un antepasado más reciente.'),
      ]}
      cierre="Más caracteres compartidos = antepasado común más reciente." />
  )
}

export function ArbolVidaJuego() {
  return (
    <JuegoDecide titulo="El árbol de la vida" pregunta="¿Es cierto?" instrucciones="Decide si cada frase sobre el parentesco de los seres vivos es cierta o falsa." clave="cien:arbol-vida-mejor" opciones={VF}
      cartas={[
        c('🐒', 'Los humanos venimos de los chimpancés actuales', 'f', 'Compartimos un antepasado común: somos primos.'),
        c('🐦', 'Las aves son descendientes de dinosaurios', 'v', 'Son el único grupo de dinosaurios que sobrevivió.'),
        c('🍄', 'Los hongos son más parientes de los animales que de las plantas', 'v', 'Comparten un antepasado común más reciente.'),
        c('🌳', 'Todos los seres vivos tienen un antepasado común', 'v', 'Lo indican el ADN y el código genético compartidos.'),
        c('🐋', 'Las ballenas son más parientes de los tiburones que de las vacas', 'f', 'Las ballenas son mamíferos, parientes de los hipopótamos y las vacas.'),
      ]}
      cierre="Todos somos ramas del mismo árbol." />
  )
}
