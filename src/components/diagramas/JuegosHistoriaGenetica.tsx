import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de la historia de la genética (área 2, tema 1). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function GriffithJuego() {
  return (
    <JuegoDecide
      titulo="¿Vive o muere?"
      pregunta="¿Qué le pasa al ratón?"
      instrucciones="Mira qué se le inyecta a cada ratón y decide si vive o muere."
      clave="cien:griffith-mejor"
      opciones={[o('vive', 'Vive', '🐭'), o('muere', 'Muere', '💀')]}
      cartas={[
        c('🔵', 'Bacterias S vivas', 'muere', 'La cápsula protege a la cepa S de las defensas: causa neumonía.'),
        c('🟠', 'Bacterias R vivas', 'vive', 'Sin cápsula, las defensas del ratón las eliminan.'),
        c('🔥', 'Bacterias S muertas por calor', 'vive', 'Muertas no pueden reproducirse ni enfermar al ratón.'),
        c('🔥🟠', 'Bacterias S muertas + bacterias R vivas', 'muere', 'Las R se transformaron en S con algo de las S muertas.'),
        c('🔥🔥', 'Bacterias R muertas por calor', 'vive', 'Ni vivas ni muertas las R son peligrosas.'),
        c('🟠🟠', 'El doble de bacterias R vivas', 'vive', 'Más bacterias R siguen sin poder esquivar las defensas.'),
      ]}
      cierre="Solo muere el ratón que recibe bacterias S vivas… o R que se volvieron S."
    />
  )
}

export function AveryJuego() {
  return (
    <JuegoDecide
      titulo="¿Hubo transformación?"
      pregunta="¿Aparecen bacterias S?"
      instrucciones="Al extracto de bacterias S muertas se le quita algo y se le agregan bacterias R vivas. Decide si se transforman."
      clave="cien:avery-mejor"
      opciones={[o('si', 'Sí, aparecen S', '🔵'), o('no', 'No, solo R', '🟠')]}
      cartas={[
        c('✂️', 'Extracto tratado con proteasa (sin proteínas)', 'si', 'Quitar las proteínas no impide la transformación.'),
        c('✂️', 'Extracto tratado con RNasa (sin ARN)', 'si', 'Quitar el ARN tampoco la impide.'),
        c('✂️', 'Extracto tratado con DNasa (sin ADN)', 'no', 'Sin ADN no hay transformación: el ADN es el factor.'),
        c('🧪', 'Extracto completo, sin ninguna enzima', 'si', 'Es como el cuarto ratón de Griffith: las R se transforman.'),
        c('🧬', 'Solo el ADN purificado de las S', 'si', 'El ADN solo basta para transformar a las R.'),
      ]}
      cierre="Solo cuando se destruye el ADN desaparece la transformación."
    />
  )
}

export function HersheyChaseJuego() {
  return (
    <JuegoDecide
      titulo="¿Proteína o ADN?"
      pregunta="¿De cuál de los dos es?"
      instrucciones="En el fago hay proteína por fuera y ADN por dentro. Decide a cuál corresponde cada dato."
      clave="cien:hershey-mejor"
      opciones={[o('prot', 'Proteína', '🛡️'), o('adn', 'ADN', '🧬')]}
      cartas={[
        c('🟡', 'Se marcó con azufre radiactivo', 'prot', 'Las proteínas tienen azufre; el ADN no.'),
        c('🔴', 'Se marcó con fósforo radiactivo', 'adn', 'El ADN tiene fósforo; las proteínas casi no.'),
        c('🛡️', 'Forma la cubierta del virus', 'prot', 'La cabeza, la cola y las patas son de proteína.'),
        c('💉', 'Entra en la bacteria', 'adn', 'El fago inyecta su ADN y deja la cubierta afuera.'),
        c('🌀', 'Se despega con la licuadora y queda en el líquido', 'prot', 'Las cubiertas vacías quedan arriba al centrifugar.'),
        c('🏭', 'Lleva las instrucciones para hacer virus nuevos', 'adn', 'Con el ADN del fago, la bacteria fabrica cientos de virus.'),
      ]}
      cierre="La proteína se queda afuera; el ADN entra y lleva las instrucciones."
    />
  )
}

export function MiescherJuego() {
  return (
    <JuegoDecide
      titulo="¿Qué hizo Miescher?"
      pregunta="¿Es cierto?"
      instrucciones="Decide si cada frase sobre Friedrich Miescher es cierta o falsa."
      clave="cien:miescher-mejor"
      opciones={[o('v', 'Cierto', '✅'), o('f', 'Falso', '❌')]}
      cartas={[
        c('🩹', 'Sacó células del pus de vendajes de hospital', 'v', 'El pus está lleno de glóbulos blancos, con un núcleo grande.'),
        c('🐖', 'Usó pepsina para deshacer las proteínas', 'v', 'La pepsina es una enzima digestiva del estómago.'),
        c('🅿️', 'La nucleína era rica en fósforo', 'v', 'Por eso supo que no era una proteína común.'),
        c('🧬', 'Supo que la nucleína guardaba la herencia', 'f', 'No conoció su función: eso se demostró casi 80 años después.'),
        c('🌀', 'Vio que la nucleína tenía forma de doble hélice', 'f', 'La forma la propusieron Watson y Crick en 1953.'),
        c('🐟', 'Luego usó esperma de salmón', 'v', 'Esas células son casi todo núcleo: más nucleína.'),
      ]}
      cierre="Miescher aisló el ADN en 1869, aunque no sabía para qué servía."
    />
  )
}

export function Foto51Juego() {
  return (
    <JuegoDecide
      titulo="¿Qué dice la Foto 51?"
      pregunta="¿Es cierto?"
      instrucciones="Decide si cada frase sobre Rosalind Franklin y la Foto 51 es cierta o falsa."
      clave="cien:foto51-mejor"
      opciones={[o('v', 'Cierto', '✅'), o('f', 'Falso', '❌')]}
      cartas={[
        c('✖️', 'La X del centro indica que el ADN es una hélice', 'v', 'Una molécula en hélice deja una X al desviar los rayos X.'),
        c('🔬', 'Es una foto tomada con un microscopio óptico', 'f', 'Es un patrón de difracción: rayos X que se desvían en los átomos.'),
        c('📅', 'Se tomó en mayo de 1952', 'v', 'La tomó Raymond Gosling, estudiante de Franklin.'),
        c('🧭', 'Los fosfatos van por fuera de la hélice', 'v', 'Franklin lo concluyó de sus datos.'),
        c('🤝', 'Franklin le entregó la foto a Watson', 'f', 'Wilkins se la mostró a Watson sin que ella lo supiera.'),
        c('🏅', 'Franklin recibió el Nobel de 1962', 'f', 'Murió en 1958 y el Nobel no se da a personas fallecidas.'),
      ]}
      cierre="La Foto 51 mostró la hélice; Franklin no recibió el reconocimiento que merecía."
    />
  )
}

export function PiezasDobleHeliceJuego() {
  return (
    <JuegoDecide
      titulo="¿Quién aportó la pieza?"
      pregunta="¿De quién es esta pieza?"
      instrucciones="El modelo de la doble hélice juntó datos de varias personas. Decide de quién es cada aporte."
      clave="cien:piezas-helice-mejor"
      opciones={[o('fr', 'Franklin', '📷'), o('ch', 'Chargaff', '⚖️'), o('wc', 'Watson y Crick', '🧩')]}
      cartas={[
        c('📷', 'La Foto 51, con la X de la hélice', 'fr', 'Franklin y Gosling la tomaron en 1952.'),
        c('⚖️', 'Hay tanta A como T, y tanta G como C', 'ch', 'Chargaff lo midió en 1950 en muchas especies.'),
        c('🧩', 'Armar el modelo con piezas de cartón y metal', 'wc', 'No hicieron experimentos: construyeron modelos.'),
        c('📐', 'Medidas del ancho de la hélice y de sus vueltas', 'fr', 'Salieron de los datos de rayos X de Franklin.'),
        c('🔗', 'A se une con T y G con C en los peldaños', 'wc', 'Explicaba las reglas de Chargaff.'),
        c('🌍', 'Las proporciones de bases cambian entre especies', 'ch', 'Así se supo que el ADN no es una repetición simple.'),
        c('📄', 'El artículo de una página en Nature, 1953', 'wc', 'Terminaba insinuando cómo se copia el ADN.'),
      ]}
      cierre="La doble hélice fue un rompecabezas armado con piezas de muchas personas."
    />
  )
}

const VF = [o('v', 'Cierto', '✅'), o('f', 'Falso', '❌')]

export function RedescubrimientoJuego() {
  return (
    <JuegoDecide titulo="1900: ¿cierto o falso?" pregunta="¿Es cierto?" instrucciones="Decide si cada frase sobre el redescubrimiento de Mendel es cierta o falsa." clave="cien:redescubrimiento-mejor" opciones={VF}
      cartas={[
        c('👥', 'Tres botánicos llegaron a los resultados de Mendel casi al mismo tiempo', 'v', 'De Vries, Correns y Tschermak, cada uno por su lado.'),
        c('🫛', 'Mendel vivió para ver su trabajo reconocido', 'f', 'Murió en 1884, dieciséis años antes.'),
        c('🔤', 'Johannsen inventó la palabra «gen» en 1909', 'v', 'También «genotipo» y «fenotipo».'),
        c('🧬', 'En 1900 ya se sabía que los genes son de ADN', 'f', 'Eso se demostró en 1944 y 1952.'),
        c('🎯', 'Sutton y Boveri relacionaron los factores de Mendel con los cromosomas', 'v', 'Los cromosomas se separan en la meiosis igual que los factores.'),
      ]}
      cierre="En 1900 nace la genética, sobre el trabajo olvidado de Mendel." />
  )
}

export function MorganJuego() {
  return (
    <JuegoDecide titulo="Las moscas de Morgan" pregunta="¿Es cierto?" instrucciones="Decide si cada frase sobre el experimento de Morgan es cierta o falsa." clave="cien:morgan-mejor" opciones={VF}
      cartas={[
        c('🪰', 'Usó moscas de la fruta porque se reproducen muy rápido', 'v', 'Una generación cada dos semanas.'),
        c('👁️', 'El primer mutante de ojos blancos fue un macho', 'v', 'Lo encontró entre miles de moscas de ojos rojos.'),
        c('🔴', 'Todos los hijos del cruce tuvieron ojos blancos', 'f', 'Todos los hijos (F1) tuvieron ojos rojos: el blanco es recesivo.'),
        c('♂️', 'En los nietos, los ojos blancos aparecían solo en machos', 'v', 'Así supo que el gen iba con el cromosoma X.'),
        c('🧬', 'El gen del color de ojos está en el cromosoma Y', 'f', 'Está en el X; el macho tiene un solo X.'),
        c('🗺️', 'Su equipo hizo el primer mapa genético', 'v', 'Alfred Sturtevant, en 1913.'),
      ]}
      cierre="Morgan comprobó que los genes están en los cromosomas." />
  )
}

export function ChargaffJuego() {
  return (
    <JuegoDecide titulo="¿Cumple las reglas de Chargaff?" pregunta="¿Puede ser ADN de doble cadena?" instrucciones="Mira los porcentajes de bases y decide si cumplen A = T y G = C." clave="cien:chargaff-mejor"
      opciones={[o('si', 'Sí cumple', '✅'), o('no', 'No cumple', '❌')]}
      cartas={[
        c('🧬', 'A 30 % · T 30 % · G 20 % · C 20 %', 'si', 'A = T y G = C: es el ADN humano, aproximadamente.'),
        c('🧬', 'A 25 % · T 25 % · G 25 % · C 25 %', 'si', 'Todas iguales también cumple las reglas.'),
        c('🧬', 'A 30 % · T 20 % · G 30 % · C 20 %', 'no', 'A no es igual a T.'),
        c('🧬', 'A 18 % · T 18 % · G 32 % · C 32 %', 'si', 'Cumple: muchas bacterias tienen más G y C.'),
        c('🧬', 'A 40 % · T 40 % · G 15 % · C 5 %', 'no', 'G no es igual a C.'),
      ]}
      cierre="En el ADN de doble cadena siempre hay tanta A como T y tanta G como C." />
  )
}

export function MeselsonJuego() {
  return (
    <JuegoDecide titulo="¿Qué banda aparece?" pregunta="¿Dónde queda este ADN en la centrífuga?" instrucciones="El ADN pesado baja más. Decide en qué banda queda cada molécula." clave="cien:meselson-mejor"
      opciones={[o('pes', 'Abajo (pesado)', '⬇️'), o('int', 'En el medio', '↔️'), o('liv', 'Arriba (liviano)', '⬆️')]}
      cartas={[
        c('⚖️', 'ADN con las dos cadenas pesadas', 'pes', 'Es el ADN de las bacterias criadas en nitrógeno pesado.'),
        c('🧬', 'ADN con una cadena pesada y una liviana', 'int', 'Es lo que aparece en la primera generación.'),
        c('🪶', 'ADN con las dos cadenas livianas', 'liv', 'Aparece desde la segunda generación.'),
        c('1️⃣', 'Todo el ADN de la 1.ª generación', 'int', 'Cada copia tiene una cadena vieja (pesada) y una nueva (liviana).'),
      ]}
      cierre="Una sola banda intermedia en la 1.ª generación: la copia es semiconservativa." />
  )
}

export function CodigoJuego() {
  return (
    <JuegoDecide titulo="El código genético" pregunta="¿Es cierto?" instrucciones="Decide si cada frase sobre el código genético es cierta o falsa." clave="cien:codigo-mejor" opciones={VF}
      cartas={[
        c('🔤', 'El código se lee de a tres letras', 'v', 'Cada grupo de tres es un codón.'),
        c('🧪', 'UUU indica el aminoácido fenilalanina', 'v', 'Fue la primera palabra descifrada, en 1961.'),
        c('🔢', 'Hay 20 codones, uno por aminoácido', 'f', 'Hay 64 codones: varios indican el mismo aminoácido y 3 son de parada.'),
        c('🛑', 'Algunos codones indican dónde terminar', 'v', 'Son los 3 codones de parada.'),
      ]}
      cierre="Tres letras, un aminoácido: el código se descifró entre 1961 y 1966." />
  )
}

export function GenomaJuego() {
  return (
    <JuegoDecide titulo="El genoma humano en números" pregunta="¿A qué corresponde?" instrucciones="Decide a qué corresponde cada número." clave="cien:genoma-mejor"
      opciones={[o('pb', 'Pares de bases', '🧬'), o('gen', 'Genes', '📦'), o('cro', 'Cromosomas', '🧵')]}
      cartas={[
        c('🔢', 'Unos 3000 millones', 'pb', 'Son las «letras» de nuestro ADN.'),
        c('🔢', 'Unos 20 000', 'gen', 'Muchos menos de los 100 000 que se esperaban.'),
        c('🔢', '46 (23 pares)', 'cro', 'El ADN de cada célula está repartido en 46 cromosomas.'),
        c('🔢', 'Se esperaban unos 100 000', 'gen', 'La sorpresa fue que resultaron unos 20 000.'),
      ]}
      cierre="Unos 3000 millones de pares de bases, unos 20 000 genes y 46 cromosomas." />
  )
}

export function CrisprJuego() {
  return (
    <JuegoDecide titulo="¿Bacteria o laboratorio?" pregunta="¿Dónde pasa esto?" instrucciones="CRISPR nació en las bacterias y luego se volvió una herramienta. Decide a cuál corresponde cada frase." clave="cien:crispr-mejor"
      opciones={[o('bac', 'En la bacteria', '🦠'), o('lab', 'En el laboratorio', '🧪')]}
      cartas={[
        c('📁', 'Guarda pedazos del ADN de los virus que la atacaron', 'bac', 'Es su memoria contra los virus.'),
        c('✂️', 'Cas9 corta el ADN de un virus que vuelve', 'bac', 'Así se defiende de un nuevo ataque.'),
        c('🎯', 'Se le pone una guía para cortar un gen elegido', 'lab', 'Es lo que mostraron Doudna y Charpentier en 2012.'),
        c('🌾', 'Se mejora un cultivo cambiando uno de sus genes', 'lab', 'Es una de las aplicaciones de la herramienta.'),
        c('🧂', 'Mojica encontró sus repeticiones en microbios de unas salinas', 'bac', 'Fue en las salinas de Santa Pola, en España.'),
      ]}
      cierre="Un sistema de defensa de las bacterias se convirtió en tijeras para editar genes." />
  )
}

export function MendelVidaJuego() {
  return (
    <JuegoDecide titulo="La vida de Mendel" pregunta="¿Es cierto?" instrucciones="Decide si cada frase sobre Gregor Mendel es cierta o falsa." clave="cien:mendel-vida-mejor" opciones={VF}
      cartas={[
        c('⛪', 'Era un monje agustino', 'v', 'Vivía en la abadía de Santo Tomás, en Brno.'),
        c('🔢', 'Estudió física y matemáticas en Viena', 'v', 'Por eso contó sus plantas y buscó proporciones.'),
        c('🫛', 'Cruzó unas 28 000 plantas de arveja', 'v', 'Durante ocho años, de 1856 a 1863.'),
        c('🏆', 'Fue famoso en vida por sus leyes', 'f', 'Su trabajo se ignoró hasta 1900; murió en 1884.'),
        c('🧬', 'Sabía que los factores eran genes de ADN', 'f', 'No sabía qué eran ni dónde estaban.'),
      ]}
      cierre="Mendel descubrió las leyes de la herencia sin saber qué eran los genes." />
  )
}
