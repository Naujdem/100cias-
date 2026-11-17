import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del tema 2 del área 2 (ADN, genes y cromosomas). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function DondeEstaJuego() {
  return (
    <JuegoDecide titulo="¿De qué nivel hablamos?" pregunta="¿Qué es?" instrucciones="Del cuerpo al ADN: decide a qué nivel corresponde cada pista." clave="cien:donde-adn-mejor"
      opciones={[o('cel', 'Célula', '🔵'), o('nuc', 'Núcleo', '🟣'), o('cro', 'Cromosoma', '✖️'), o('adn', 'ADN', '🧬')]}
      cartas={[
        c('🏛️', 'Controla las actividades de la célula y guarda la información genética', 'nuc', 'El núcleo es el «archivo» de la célula.'),
        c('🧱', 'La unidad básica de la vida', 'cel', 'Todo ser vivo está hecho de células.'),
        c('🧬', 'La molécula que tiene las instrucciones', 'adn', 'El ADN guarda la información genética.'),
        c('✖️', 'ADN muy enrollado, con forma de X antes de dividirse', 'cro', 'Así se ve un cromosoma cuando la célula se va a dividir.'),
        c('🔤', 'Está hecho de cuatro bases: A, T, G y C', 'adn', 'Las bases son las «letras» del ADN.'),
        c('4️⃣6️⃣', 'En una célula humana hay 46', 'cro', 'Son 23 pares de cromosomas.'),
      ]}
      cierre="Cuerpo → célula → núcleo → cromosoma → ADN → bases." />
  )
}

export function NucleotidoJuego() {
  return (
    <JuegoDecide titulo="Las piezas del nucleótido" pregunta="¿Qué parte es?" instrucciones="Un nucleótido tiene tres partes. Decide a cuál corresponde cada pista." clave="cien:nucleotido-mejor"
      opciones={[o('fos', 'Fosfato', '🟡'), o('azu', 'Azúcar', '⬠'), o('bas', 'Base', '🔤')]}
      cartas={[
        c('🔤', 'Puede ser A, T, G o C', 'bas', 'Las cuatro bases nitrogenadas del ADN.'),
        c('⬠', 'En el ADN se llama desoxirribosa', 'azu', 'Por eso es ácido desoxirribonucleico.'),
        c('🅿️', 'Tiene fósforo', 'fos', 'Por eso Miescher encontró tanto fósforo en la nucleína.'),
        c('🪜', 'Forma los peldaños de la escalera', 'bas', 'Las bases de las dos cadenas se unen en el medio.'),
        c('🛤️', 'Junto con el azúcar, forma los pasamanos', 'fos', 'Fosfato y azúcar se alternan a lo largo de la cadena.'),
        c('📝', 'Lleva la información: su orden es el mensaje', 'bas', 'El orden de las bases es lo que distingue un gen de otro.'),
      ]}
      cierre="Fosfato + azúcar + base = nucleótido. Lo que cambia entre nucleótidos es la base." />
  )
}

export function ParejaBaseJuego() {
  return (
    <JuegoDecide titulo="¿Cuál es la pareja?" pregunta="¿Con qué base se une?" instrucciones="En la doble hélice cada base tiene una pareja fija. Elige la que corresponde." clave="cien:pareja-base-mejor"
      opciones={[o('A', 'A', '🟩'), o('T', 'T', '🟥'), o('G', 'G', '🟨'), o('C', 'C', '🟦')]}
      cartas={[
        c('🟩', 'La pareja de A', 'T', 'A siempre se une con T, con 2 puentes.'),
        c('🟨', 'La pareja de G', 'C', 'G siempre se une con C, con 3 puentes.'),
        c('🟥', 'La pareja de T', 'A', 'T se une con A.'),
        c('🟦', 'La pareja de C', 'G', 'C se une con G.'),
        c('🔢', 'La que se une con 3 puentes a C', 'G', 'El par G–C tiene 3 puentes; el A–T, 2.'),
        c('📏', 'La que completa A T G _ en la otra cadena, frente a C', 'G', 'Frente a una C siempre va una G.'),
      ]}
      cierre="A con T, G con C: si sabes una cadena, sabes la otra." />
  )
}

export function AdnArnJuego() {
  return (
    <JuegoDecide titulo="¿ADN o ARN?" pregunta="¿De cuál se trata?" instrucciones="Decide si la pista es del ADN, del ARN o de los dos." clave="cien:adn-arn-mejor"
      opciones={[o('adn', 'ADN', '🧬'), o('arn', 'ARN', '📨'), o('dos', 'Los dos', '🤝')]}
      cartas={[
        c('🪜', 'Tiene dos cadenas', 'adn', 'El ARN tiene una sola.'),
        c('🅤', 'Tiene uracilo (U)', 'arn', 'El ARN usa U donde el ADN usa T.'),
        c('🅣', 'Tiene timina (T)', 'adn', 'La timina es exclusiva del ADN.'),
        c('🔤', 'Tiene adenina, guanina y citosina', 'dos', 'A, G y C están en ambos.'),
        c('📨', 'Lleva el mensaje del núcleo a los ribosomas', 'arn', 'Es una copia de trabajo de un gen.'),
        c('🗄️', 'Guarda la información y se queda en el núcleo', 'adn', 'Es el archivo original.'),
        c('🧪', 'Es un ácido nucleico hecho de nucleótidos', 'dos', 'Los dos son ácidos nucleicos.'),
        c('⬠', 'Su azúcar es la ribosa', 'arn', 'El del ADN es la desoxirribosa, con un oxígeno menos.'),
      ]}
      cierre="El ADN guarda la información; el ARN la copia y la lleva." />
  )
}

export function CromosomasJuego() {
  return (
    <JuegoDecide titulo="Cromosomas: ¿cierto o falso?" pregunta="¿Es cierto?" instrucciones="Decide si cada frase sobre los cromosomas es cierta o falsa." clave="cien:cromosomas-mejor"
      opciones={[o('v', 'Cierto', '✅'), o('f', 'Falso', '❌')]}
      cartas={[
        c('4️⃣6️⃣', 'Las células del cuerpo humano tienen 46 cromosomas', 'v', 'Son 23 pares: uno de cada par viene de cada padre.'),
        c('📏', 'Estirado, el ADN de una célula mide unos 2 metros', 'v', 'Por eso tiene que enrollarse tanto.'),
        c('✖️', 'Los cromosomas tienen forma de X todo el tiempo', 'f', 'Solo se ven así, condensados, cuando la célula se va a dividir.'),
        c('🟡', 'El ADN se enrolla en unas proteínas llamadas histonas', 'v', 'Forman el «collar de perlas».'),
        c('♂️', 'El par 23 define el sexo: XX o XY', 'v', 'Son los cromosomas sexuales.'),
        c('🧫', 'Un cromosoma está hecho solo de proteínas', 'f', 'Es una molécula de ADN enrollada en proteínas.'),
      ]}
      cierre="Un cromosoma es una molécula de ADN muy larga, enrollada en histonas." />
  )
}

export function GenAleloJuego() {
  return (
    <JuegoDecide titulo="¿Gen, alelo, cromosoma o genoma?" pregunta="¿Qué es?" instrucciones="Decide qué palabra corresponde a cada definición." clave="cien:gen-alelo-mejor"
      opciones={[o('gen', 'Gen', '📦'), o('ale', 'Alelo', '🔀'), o('cro', 'Cromosoma', '✖️'), o('gno', 'Genoma', '📚')]}
      cartas={[
        c('📦', 'Un tramo de ADN con la instrucción para una proteína', 'gen', 'Es la unidad de la herencia.'),
        c('🔀', 'Una versión de un gen, como «ojos azules»', 'ale', 'Un mismo gen puede tener varios alelos.'),
        c('📚', 'Todo el ADN de un ser vivo', 'gno', 'En los humanos, unos 3000 millones de pares de bases.'),
        c('✖️', 'Una molécula larga de ADN que lleva muchos genes', 'cro', 'Los humanos tenemos 46.'),
        c('📖', 'Si el genoma fuera un libro, sería un capítulo', 'cro', 'Cada cromosoma reúne muchos genes.'),
        c('✏️', 'Si el genoma fuera un libro, sería una receta dentro de un capítulo', 'gen', 'Un gen es una instrucción concreta.'),
      ]}
      cierre="Genoma ⊃ cromosomas ⊃ genes; cada gen puede tener varios alelos." />
  )
}
