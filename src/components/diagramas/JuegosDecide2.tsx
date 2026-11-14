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

export function FotoRespJuego() {
  return (
    <JuegoDecide
      titulo="¿Fotosíntesis o respiración?"
      pregunta="¿De qué proceso se trata?"
      instrucciones="Las dos son la cara y la sello de la energía de la vida. Decide cuál describe cada tarjeta."
      clave="cien:fotoresp-mejor"
      opciones={[o('foto', 'Fotosíntesis', '🌿'), o('resp', 'Respiración', '🔋')]}
      cartas={[
        c('☀️', 'Necesita luz', 'foto', 'La energía de la luz es la que arma la glucosa.'),
        c('🍬', 'Fabrica glucosa', 'foto', 'Con CO₂ y agua se construye glucosa.'),
        c('🔥', 'Gasta glucosa para hacer ATP', 'resp', 'La glucosa se rompe y su energía pasa al ATP.'),
        c('🫁', 'Usa oxígeno', 'resp', 'El oxígeno se consume en la mitocondria.'),
        c('🫧', 'Libera oxígeno', 'foto', 'El oxígeno sale del agua que se rompe con la luz.'),
        c('🟢', 'Ocurre en el cloroplasto', 'foto', 'Solo en plantas, algas y algunas bacterias.'),
        c('🔋', 'Ocurre en la mitocondria', 'resp', 'En casi todos los seres vivos con núcleo, plantas incluidas.'),
        c('💨', 'Suelta CO₂', 'resp', 'Es lo que exhalamos.'),
        c('🌙', 'La planta la hace también de noche', 'resp', 'Las plantas respiran siempre; la fotosíntesis, solo con luz.'),
      ]}
      cierre="La fotosíntesis fabrica glucosa y oxígeno con luz; la respiración los usa para hacer ATP y devuelve CO₂ y agua. Las plantas hacen las dos."
    />
  )
}

export function PartesMicroscopioJuego() {
  return (
    <JuegoDecide
      titulo="¿Mecánica, óptica o iluminación?"
      pregunta="¿A qué sistema del microscopio pertenece esta parte?"
      instrucciones="Las partes del microscopio óptico se agrupan en tres sistemas. Clasifica cada una."
      clave="cien:partesmicro-mejor"
      opciones={[o('mec', 'Mecánica', '🔩'), o('opt', 'Óptica', '🔍'), o('ilu', 'Iluminación', '💡')]}
      cartas={[
        c('👁️', 'Ocular', 'opt', 'Es el lente por donde miras; casi siempre aumenta 10×.'),
        c('🔭', 'Objetivos', 'opt', 'Lentes cerca de la muestra: 4×, 10×, 40× (y 100× con aceite).'),
        c('🔄', 'Revólver', 'mec', 'Gira para cambiar de objetivo.'),
        c('🟦', 'Platina', 'mec', 'La plataforma donde se pone la lámina.'),
        c('📎', 'Pinzas', 'mec', 'Sujetan la lámina sobre la platina.'),
        c('⚙️', 'Tornillo macrométrico', 'mec', 'Movimiento grueso para enfocar.'),
        c('🪛', 'Tornillo micrométrico', 'mec', 'Movimiento fino para el enfoque final.'),
        c('💡', 'Lámpara o espejo', 'ilu', 'Da la luz que atraviesa la muestra.'),
        c('🔘', 'Diafragma', 'ilu', 'Regula cuánta luz llega a la muestra.'),
        c('🔦', 'Condensador', 'ilu', 'Concentra la luz sobre la muestra.'),
        c('🦾', 'Brazo', 'mec', 'Sostiene el tubo y por ahí se agarra el microscopio.'),
      ]}
      cierre="Óptica: ocular y objetivos. Iluminación: lámpara o espejo, condensador y diafragma. Mecánica: todo lo que sostiene y mueve."
    />
  )
}

export function AumentoJuego() {
  return (
    <JuegoDecide
      titulo="¿Cuánto aumenta?"
      pregunta="¿Cuál es el aumento total?"
      instrucciones="El aumento total es el aumento del ocular por el del objetivo. Calcula rápido."
      clave="cien:aumento-mejor"
      opciones={[o('40', '40×', '🔹'), o('100', '100×', '🔷'), o('400', '400×', '🔶'), o('1000', '1000×', '🟠')]}
      cartas={[
        c('🔍', 'Ocular 10× y objetivo 4×', '40', '10 × 4 = 40 veces.'),
        c('🔍', 'Ocular 10× y objetivo 10×', '100', '10 × 10 = 100 veces.'),
        c('🔍', 'Ocular 10× y objetivo 40×', '400', '10 × 40 = 400 veces.'),
        c('💧', 'Ocular 10× y objetivo 100× con aceite', '1000', '10 × 100 = 1000 veces: necesita aceite de inmersión.'),
        c('🔍', 'Ocular 5× y objetivo 20×', '100', '5 × 20 = 100 veces.'),
        c('🔍', 'Ocular 20× y objetivo 20×', '400', '20 × 20 = 400 veces.'),
        c('🔍', 'Ocular 10× y el objetivo más pequeño', '40', 'El más pequeño suele ser 4×: 40 veces.'),
        c('🔍', 'Ocular 25× y objetivo 40×', '1000', '25 × 40 = 1000 veces.'),
      ]}
      cierre="Aumento total = ocular × objetivo. Con el ocular de 10×: 40×, 100×, 400× y 1000×."
    />
  )
}

export function OpticoElectronicoJuego() {
  return (
    <JuegoDecide
      titulo="¿Óptico o electrónico?"
      pregunta="¿Con qué microscopio se puede ver o hacer esto?"
      instrucciones="Los dos sirven, pero no para lo mismo. Decide."
      clave="cien:optelec-mejor"
      opciones={[o('opt', 'Óptico', '💡'), o('ele', 'Electrónico', '⚡')]}
      cartas={[
        c('🧅', 'Ver las células de la piel de cebolla', 'opt', 'Las células y su núcleo se ven bien con luz.'),
        c('⚫', 'Ver ribosomas', 'ele', 'Son demasiado pequeños para la luz.'),
        c('🦠', 'Ver bacterias vivas moviéndose', 'opt', 'El electrónico necesita muestras muertas y en vacío.'),
        c('🧬', 'Ver la forma de un virus', 'ele', 'Los virus son mucho más pequeños que el límite de la luz.'),
        c('🌈', 'Ver la muestra en colores naturales', 'opt', 'El electrónico da imágenes en blanco y negro (los colores se agregan después).'),
        c('🏫', 'Usarlo en el laboratorio del colegio', 'opt', 'El electrónico es enorme y muy costoso.'),
        c('🧱', 'Ver las membranas del retículo', 'ele', 'Las membranas internas solo se distinguen con electrones.'),
        c('🟢', 'Ver los cloroplastos de una hoja de elodea', 'opt', 'Se ven como granitos verdes con el óptico.'),
      ]}
      cierre="Óptico: luz, colores, muestras vivas, hasta unas 1000 veces. Electrónico: electrones, en vacío, hasta un millón de veces: ribosomas, membranas y virus."
    />
  )
}

export function ReproUnicelularesJuego() {
  return (
    <JuegoDecide
      titulo="¿Cómo se reproduce?"
      pregunta="¿Qué tipo de reproducción es?"
      instrucciones="Los unicelulares se reproducen sobre todo de forma asexual. Decide cuál."
      clave="cien:repuni-mejor"
      opciones={[o('bip', 'Bipartición', '✂️'), o('gem', 'Gemación', '🫧'), o('esp', 'Esporulación', '💥')]}
      cartas={[
        c('🦠', 'Una bacteria se parte en dos iguales', 'bip', 'Bipartición: dos hijas del mismo tamaño.'),
        c('🍞', 'A la levadura le sale una yema que se separa', 'gem', 'Gemación: la hija empieza más pequeña.'),
        c('💧', 'Una ameba se estira y se divide por la mitad', 'bip', 'Bipartición.'),
        c('🦟', 'El parásito de la malaria forma muchas células a la vez', 'esp', 'Esporulación: el núcleo se divide muchas veces y luego salen muchas hijas.'),
        c('🥿', 'Un paramecio se divide en dos', 'bip', 'Bipartición (transversal).'),
        c('🟢', 'Una euglena se parte a lo largo', 'bip', 'Bipartición (longitudinal).'),
        c('🫧', 'Queda una célula grande con una pequeña pegada', 'gem', 'Así se ve la gemación.'),
        c('🎆', 'Una célula se rompe y libera muchas esporas', 'esp', 'Esporulación.'),
      ]}
      cierre="Bipartición: 1 → 2 iguales. Gemación: una yema que crece y se separa. Esporulación: 1 → muchas a la vez."
    />
  )
}

export function ReproPlantasJuego() {
  return (
    <JuegoDecide
      titulo="¿Semilla o pedazo?"
      pregunta="¿Reproducción sexual o asexual?"
      instrucciones="Si viene de una semilla (flor, polinización), es sexual. Si viene de un pedazo de la planta, es asexual."
      clave="cien:repplantas-mejor"
      opciones={[o('sex', 'Sexual (semilla)', '🌸'), o('asex', 'Asexual (un pedazo)', '✂️')]}
      cartas={[
        c('🫘', 'Sembrar frijol', 'sex', 'La semilla viene de la flor fecundada.'),
        c('🌹', 'Un esqueje de rosa que echa raíces', 'asex', 'Un pedazo de tallo forma una planta igual.'),
        c('🥔', 'Sembrar un pedazo de papa con «ojos»', 'asex', 'El tubérculo es un tallo subterráneo.'),
        c('🍓', 'La fresa que lanza estolones', 'asex', 'Tallos que corren por el suelo y echan raíces.'),
        c('🌿', 'Sembrar yuca por estacas', 'asex', 'Un trozo de tallo: plantas iguales a la madre.'),
        c('🐝', 'Una abeja lleva polen de flor en flor', 'sex', 'La polinización es el inicio de la reproducción sexual.'),
        c('🧅', 'Una cebolla que retoña', 'asex', 'El bulbo forma una planta nueva.'),
        c('🥭', 'Un árbol de mango que nació de una pepa', 'sex', 'La pepa es la semilla.'),
        c('🎋', 'Sembrar caña con trozos de tallo', 'asex', 'Como la yuca: por estacas.'),
      ]}
      cierre="Semilla = reproducción sexual (flor, polen, fecundación): hijos distintos. Pedazo de planta = asexual: hijos iguales a la madre."
    />
  )
}

export function ReproAnimalesJuego() {
  return (
    <JuegoDecide
      titulo="¿Huevo o vientre?"
      pregunta="¿Cómo se desarrollan sus crías?"
      instrucciones="Ovíparos: el embrión crece en un huevo fuera del cuerpo. Vivíparos: dentro de la madre. Ovovivíparos: en un huevo que se queda dentro de la madre."
      clave="cien:repanimales-mejor"
      opciones={[o('ovi', 'Ovíparo', '🥚'), o('viv', 'Vivíparo', '🤰'), o('ovov', 'Ovovivíparo', '🥚🤰')]}
      cartas={[
        c('🐔', 'Gallina', 'ovi', 'Pone huevos y los empolla fuera de su cuerpo.'),
        c('🐕', 'Perro', 'viv', 'Las crías crecen dentro de la madre.'),
        c('🐢', 'Tortuga', 'ovi', 'Entierra sus huevos en la arena.'),
        c('🐋', 'Ballena', 'viv', 'Es un mamífero: la cría nace viva.'),
        c('🐍', 'Boa', 'ovov', 'Los huevos se quedan dentro y las crías nacen vivas.'),
        c('🐟', 'Guppy', 'ovov', 'Pez de acuario: las crías salen del huevo dentro de la madre.'),
        c('🐸', 'Rana', 'ovi', 'Pone huevos en el agua.'),
        c('🦇', 'Murciélago', 'viv', 'Es un mamífero.'),
        c('🦆', 'Ornitorrinco', 'ovi', 'Un mamífero raro que pone huevos.'),
      ]}
      cierre="Ovíparo: huevo afuera. Vivíparo: crece dentro de la madre. Ovovivíparo: huevo que se queda dentro hasta que nace la cría."
    />
  )
}
