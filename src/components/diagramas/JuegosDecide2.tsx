import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» para los temas 1, 3, 4, 6, 7, 8 y 9. Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string, pista?: string): CartaDecide => ({ icono, nombre, correcta, explica, pista })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function DescubridoresJuego() {
  return (
    <JuegoDecide
      titulo="¿Quién lo dijo?"
      pregunta="¿Quién hizo este aporte a la teoría celular?"
      instrucciones="Cada tarjeta es un descubrimiento o una idea. Di de quién es."
      clave="cien:descubridores-mejor"
      opciones={[o('hooke', 'Hooke', '🔬'), o('leeu', 'Leeuwenhoek', '💧'), o('ss', 'Schleiden y Schwann', '🌿'), o('virchow', 'Virchow', '🧫')]}
      cartas={[
        c('🪵', 'Vio «celdas» en un trozo de corcho', 'hooke', 'Robert Hooke, 1665: las llamó células por las celdas de un monasterio.'),
        c('📖', 'Escribió Micrographia', 'hooke', 'Su libro de 1665 mostró por primera vez dibujos hechos al microscopio.'),
        c('🦠', 'Vio «animálculos» moviéndose en agua', 'leeu', 'Antonie van Leeuwenhoek observó por primera vez células vivas, como bacterias y protozoos.'),
        c('🔍', 'Fabricó sus propios lentes, de más de 200 aumentos', 'leeu', 'Sus microscopios simples eran los mejores de su época.'),
        c('🌱', 'Todas las plantas están hechas de células', 'ss', 'Matthias Schleiden, 1838.'),
        c('🐾', 'Los animales también están hechos de células', 'ss', 'Theodor Schwann, 1839: junto con Schleiden, la célula es la unidad de los seres vivos.'),
        c('🧬', '«Toda célula proviene de otra célula»', 'virchow', 'Rudolf Virchow, 1855: el tercer postulado.'),
        c('🩺', 'Estudió enfermedades como cambios en las células', 'virchow', 'Virchow fue médico: fundó la patología celular.'),
      ]}
      cierre="Hooke les puso nombre, Leeuwenhoek vio células vivas, Schleiden y Schwann dijeron que todo ser vivo está hecho de células y Virchow, que toda célula viene de otra."
    />
  )
}

export function UniPluriJuego() {
  return (
    <JuegoDecide
      titulo="¿Una, varias o muchas?"
      pregunta="¿Cómo está organizado este ser vivo?"
      instrucciones="Decide si es un organismo unicelular, una colonia de células iguales o un ser pluricelular."
      clave="cien:unipluri-mejor"
      opciones={[o('uni', 'Unicelular', '🦠'), o('colonia', 'Colonia', '🫧'), o('pluri', 'Pluricelular', '🌳')]}
      cartas={[
        c('🦠', 'Bacteria del yogur', 'uni', 'Una sola célula hace todo: comer, crecer y reproducirse.'),
        c('🟢', 'Volvox', 'colonia', 'Una esfera de cientos de algas casi iguales que nadan juntas.'),
        c('🍄', 'Hongo de champiñón', 'pluri', 'Millones de células formando hilos y el sombrero.'),
        c('🍞', 'Levadura del pan', 'uni', 'Es un hongo de una sola célula.'),
        c('🐟', 'Pez', 'pluri', 'Tejidos, órganos y sistemas: muchas células especializadas.'),
        c('💧', 'Ameba', 'uni', 'Una célula que se mueve sacando «pies».'),
        c('🌿', 'Helecho', 'pluri', 'Una planta: células especializadas en hojas, tallo y raíz.'),
        c('🧫', 'Grupo de algas iguales pegadas', 'colonia', 'Viven juntas, pero cada una podría vivir sola.', 'Si se separan, cada una sobrevive.'),
        c('🪱', 'Lombriz', 'pluri', 'Un animal: sus células no podrían vivir solas.'),
      ]}
      cierre="Unicelular: una célula lo hace todo. Colonia: células iguales que viven juntas. Pluricelular: células especializadas que dependen unas de otras."
    />
  )
}

export function ProEuJuego() {
  return (
    <JuegoDecide
      titulo="¿Con núcleo o sin núcleo?"
      pregunta="¿Procariota o eucariota?"
      instrucciones="Clasifica cada ser vivo o cada característica según el tipo de célula."
      clave="cien:proeu-mejor"
      opciones={[o('pro', 'Procariota', '🦠'), o('eu', 'Eucariota', '🟣')]}
      cartas={[
        c('🦠', 'Bacteria', 'pro', 'Sin núcleo: su ADN está suelto en el nucleoide.'),
        c('🍄', 'Hongo', 'eu', 'Sus células tienen núcleo y orgánulos.'),
        c('🌋', 'Arquea de aguas termales', 'pro', 'Las arqueas también son procariotas.'),
        c('🧑', 'Célula de tu piel', 'eu', 'Todas las células animales son eucariotas.'),
        c('🟢', 'Alga verde', 'eu', 'Tiene núcleo y cloroplastos.'),
        c('🧬', 'ADN encerrado en un núcleo', 'eu', '«Eu» = verdadero: núcleo verdadero.'),
        c('🔋', 'Tiene mitocondrias', 'eu', 'Los orgánulos con membrana son de eucariotas.'),
        c('📏', 'Mide unas pocas milésimas de milímetro', 'pro', 'Las procariotas suelen ser unas 10 veces más pequeñas.'),
        c('💧', 'Ameba', 'eu', 'Es un protista: una sola célula, pero eucariota.'),
      ]}
      cierre="Procariotas (bacterias y arqueas): sin núcleo ni orgánulos con membrana. Eucariotas (protistas, hongos, plantas, animales): con núcleo y orgánulos."
    />
  )
}

export function AnimalVegetalJuego() {
  return (
    <JuegoDecide
      titulo="¿De quién es?"
      pregunta="¿En qué célula está esta estructura?"
      instrucciones="Decide si es propia de la célula animal, de la vegetal o si la tienen las dos."
      clave="cien:anveg-mejor"
      opciones={[o('animal', 'Animal', '🐾'), o('vegetal', 'Vegetal', '🌿'), o('ambas', 'Las dos', '🤝')]}
      cartas={[
        c('🧱', 'Pared celular', 'vegetal', 'De celulosa: da forma rectangular y sostén.'),
        c('🟢', 'Cloroplasto', 'vegetal', 'Hace la fotosíntesis.'),
        c('🔋', 'Mitocondria', 'ambas', 'Las plantas también respiran.'),
        c('🟣', 'Núcleo', 'ambas', 'Las dos son eucariotas.'),
        c('💧', 'Vacuola central grande', 'vegetal', 'Llena de agua, mantiene la célula firme.'),
        c('♻️', 'Lisosomas abundantes', 'animal', 'Son mucho más comunes en la célula animal.'),
        c('🚪', 'Membrana', 'ambas', 'Toda célula tiene membrana.'),
        c('⚙️', 'Centríolos', 'animal', 'Ayudan a organizar el huso; las plantas con flor no los tienen.'),
        c('📦', 'Aparato de Golgi', 'ambas', 'Las dos empacan y envían proteínas.'),
      ]}
      cierre="Propias de la vegetal: pared, cloroplastos y vacuola grande. Más típicos de la animal: lisosomas y centríolos. Lo demás lo comparten."
    />
  )
}

export function CicloJuego() {
  return (
    <JuegoDecide
      titulo="¿En qué etapa va?"
      pregunta="¿En qué etapa del ciclo celular está la célula?"
      instrucciones="Cada tarjeta describe lo que hace la célula. Di en qué etapa del ciclo está."
      clave="cien:ciclo-mejor"
      opciones={[o('g1', 'G1', '📏'), o('s', 'S', '📋'), o('g2', 'G2', '🔎'), o('m', 'M', '✂️')]}
      cartas={[
        c('📏', 'Acaba de nacer y está creciendo', 'g1', 'G1: crece y hace su trabajo normal.'),
        c('📋', 'Está copiando su ADN', 's', 'S de síntesis: se fabrica ADN nuevo.'),
        c('🔎', 'Revisa que el ADN copiado esté bien', 'g2', 'G2: se prepara y revisa antes de dividirse.'),
        c('✖️', 'Sus cromosomas se ven en forma de X', 'm', 'Ya está en mitosis, dentro de la fase M.'),
        c('🔋', 'Duplica sus mitocondrias', 'g2', 'En G2 se fabrican los orgánulos que necesitarán las hijas.'),
        c('🎒', 'Se estrangula por la mitad', 'm', 'La citocinesis es el final de la fase M.'),
        c('🍽️', 'Fabrica proteínas y trabaja en el tejido', 'g1', 'G1 es la etapa más larga en muchas células.'),
        c('🧬', 'Pasa de tener una copia a dos copias de cada cromosoma', 's', 'Al terminar S, cada cromosoma tiene dos cromátidas.'),
      ]}
      cierre="G1: crecer. S: copiar el ADN. G2: prepararse y revisar. M: dividirse (mitosis y citocinesis)."
    />
  )
}

export function DiploideJuego() {
  return (
    <JuegoDecide
      titulo="¿2n o n?"
      pregunta="¿Esta célula es diploide o haploide?"
      instrucciones="Las células del cuerpo tienen los cromosomas en pares (2n); los gametos llevan uno de cada par (n)."
      clave="cien:diploide-mejor"
      opciones={[o('2n', 'Diploide (2n)', '👫'), o('n', 'Haploide (n)', '🧍')]}
      cartas={[
        c('🧠', 'Neurona', '2n', 'Es una célula del cuerpo: 46 cromosomas.'),
        c('🥚', 'Óvulo', 'n', 'Es un gameto: 23 cromosomas.'),
        c('👶', 'Cigoto', '2n', 'Óvulo (n) + espermatozoide (n) = 2n.'),
        c('🏊', 'Espermatozoide', 'n', 'Es un gameto: lleva uno de cada par.'),
        c('🩹', 'Célula de la piel', '2n', 'Se forma por mitosis: conserva los 46.'),
        c('🌼', 'Gameto del polen', 'n', 'El polen lleva el gameto masculino de la planta.'),
        c('🔢', 'Tiene 23 cromosomas sueltos', 'n', 'Sin parejas: haploide.'),
        c('🔢', 'Tiene 23 pares de cromosomas', '2n', '23 pares = 46: diploide.'),
      ]}
      cierre="Diploide (2n): las células del cuerpo y el cigoto. Haploide (n): los gametos, que se forman por meiosis."
    />
  )
}

export function MetabolismoJuego() {
  return (
    <JuegoDecide
      titulo="¿Romper o construir?"
      pregunta="¿Catabolismo o anabolismo?"
      instrucciones="Cada tarjeta es una reacción de la célula. ¿Rompe moléculas y libera energía, o construye y la gasta?"
      clave="cien:metab-mejor"
      opciones={[o('cata', 'Catabolismo (romper)', '🔨'), o('ana', 'Anabolismo (construir)', '🧱')]}
      cartas={[
        c('🍬', 'Partir la glucosa para sacar energía', 'cata', 'Se rompe una molécula y se libera energía.'),
        c('🔗', 'Unir aminoácidos para formar una proteína', 'ana', 'Se construye una molécula grande: gasta ATP.'),
        c('🍞', 'Digerir el almidón del pan', 'cata', 'El almidón se rompe en glucosas.'),
        c('🌿', 'Fotosíntesis: fabricar glucosa', 'ana', 'Se construye glucosa con la energía de la luz.'),
        c('🧈', 'Guardar grasa de reserva', 'ana', 'Se arman moléculas de grasa.'),
        c('📋', 'Copiar el ADN', 'ana', 'Se construye una cadena nueva de ADN.'),
        c('🥩', 'Romper proteínas en aminoácidos', 'cata', 'Las proteínas se desarman en piezas.'),
        c('🔥', 'Respiración celular', 'cata', 'La glucosa se rompe del todo y se forma ATP.'),
      ]}
      cierre="Catabolismo: romper y liberar energía. Anabolismo: construir y gastar energía. Las dos van juntas: lo que una libera, la otra lo usa."
    />
  )
}

export function TejidosVegetalesJuego() {
  return (
    <JuegoDecide
      titulo="¿Qué tejido de la planta?"
      pregunta="¿Qué tejido vegetal hace esto?"
      instrucciones="Decide qué tejido de la planta se encarga de cada trabajo."
      clave="cien:tejveg-mejor"
      opciones={[o('meri', 'Meristemo', '🌱'), o('epi', 'Epidermis', '🛡️'), o('cond', 'Xilema o floema', '🚰'), o('paren', 'Parénquima', '🍃')]}
      cartas={[
        c('📏', 'Hace crecer la punta de la raíz', 'meri', 'Los meristemos se dividen sin parar.'),
        c('🕳️', 'Tiene estomas para el intercambio de gases', 'epi', 'La epidermis de la hoja tiene estomas.'),
        c('⬆️', 'Sube el agua desde la raíz', 'cond', 'Ese es el xilema.'),
        c('🍬', 'Reparte el azúcar de las hojas', 'cond', 'Ese es el floema.'),
        c('☀️', 'Hace fotosíntesis dentro de la hoja', 'paren', 'El parénquima de la hoja está lleno de cloroplastos.'),
        c('🥔', 'Guarda almidón en la papa', 'paren', 'El parénquima de reserva.'),
        c('🧴', 'Cubre la hoja con una capa cerosa', 'epi', 'La cutícula de la epidermis evita que pierda agua.'),
        c('🌳', 'Hace que el tallo engrose cada año', 'meri', 'Un meristemo lateral forma los anillos de la madera.'),
      ]}
      cierre="Meristemo: crecer. Epidermis: proteger. Xilema y floema: conducir. Parénquima: fotosíntesis y reservas."
    />
  )
}

export function SistemasJuego() {
  return (
    <JuegoDecide
      titulo="¿Qué sistema?"
      pregunta="¿A qué sistema pertenece este órgano?"
      instrucciones="Cada tarjeta es un órgano del cuerpo humano. Di de qué sistema forma parte."
      clave="cien:sistemas-mejor"
      opciones={[o('dig', 'Digestivo', '🍽️'), o('resp', 'Respiratorio', '🫁'), o('circ', 'Circulatorio', '❤️'), o('nerv', 'Nervioso', '🧠')]}
      cartas={[
        c('🫃', 'Estómago', 'dig', 'Digiere los alimentos.'),
        c('🫁', 'Pulmones', 'resp', 'Intercambian oxígeno y CO₂.'),
        c('❤️', 'Corazón', 'circ', 'Bombea la sangre.'),
        c('🧠', 'Cerebro', 'nerv', 'Coordina todo el cuerpo.'),
        c('🌀', 'Intestino delgado', 'dig', 'Absorbe los nutrientes.'),
        c('🩸', 'Venas y arterias', 'circ', 'Los tubos por donde viaja la sangre.'),
        c('👃', 'Tráquea', 'resp', 'Lleva el aire a los pulmones.'),
        c('🦴', 'Médula espinal', 'nerv', 'Lleva mensajes entre el cerebro y el cuerpo.'),
        c('🟤', 'Hígado', 'dig', 'Fabrica la bilis, que ayuda a digerir las grasas.'),
      ]}
      cierre="Los sistemas trabajan en equipo: el digestivo da la glucosa, el respiratorio el oxígeno, el circulatorio los reparte y el nervioso coordina."
    />
  )
}
