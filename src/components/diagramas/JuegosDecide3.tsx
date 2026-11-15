import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» para las fichas que no tenían «Juega» (revisión del área 1, 14 nov). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string, pista?: string): CartaDecide => ({ icono, nombre, correcta, explica, pista })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })
const VF = [o('v', 'Cierto', '✅'), o('f', 'Falso', '❌')]

/* ── Tema 1 · Teoría celular ─────────────────────────────── */

export function HookeLeeuJuego() {
  return (
    <JuegoDecide
      titulo="¿Hooke o Leeuwenhoek?"
      pregunta="¿De cuál de los dos es?"
      instrucciones="Los dos miraron por el microscopio en el siglo XVII. Decide a quién corresponde cada dato."
      clave="cien:hooke-leeu-mejor"
      opciones={[o('hooke', 'Hooke', '🪵'), o('leeu', 'Leeuwenhoek', '💧')]}
      cartas={[
        c('🪵', 'Miró una lámina de corcho', 'hooke', 'Hooke vio celdas vacías: las paredes de células muertas.'),
        c('🏛️', 'Puso el nombre «célula»', 'hooke', 'Las celdas le recordaron los cuartos de un monasterio.'),
        c('📖', 'Publicó Micrographia en 1665', 'hooke', 'Un libro lleno de dibujos hechos al microscopio.'),
        c('🔬', 'Usaba un microscopio compuesto, de varios lentes', 'hooke', 'El de Leeuwenhoek era simple: una sola lente muy pequeña.'),
        c('🦠', 'Vio por primera vez células vivas moviéndose', 'leeu', 'Sus «animálculos» eran bacterias y protozoos.'),
        c('🧵', 'Era comerciante de telas', 'leeu', 'Usaba lentes para revisar los hilos y empezó a fabricarlas.'),
        c('🔍', 'Pulía lentes de más de 200 aumentos', 'leeu', 'Sus lentes simples superaban a los microscopios de la época.'),
        c('✉️', 'Contaba lo que veía en cartas a la Royal Society', 'leeu', 'Envió cientos de cartas desde Delft, en Holanda.'),
        c('🐜', 'Dibujó una pulga gigante', 'hooke', 'Es una de las láminas más famosas de Micrographia.'),
      ]}
      cierre="Hooke vio y nombró las celdas del corcho; Leeuwenhoek fue el primero en ver células vivas."
    />
  )
}

export function SchleidenSchwannJuego() {
  return (
    <JuegoDecide
      titulo="¿Schleiden o Schwann?"
      pregunta="¿De cuál de los dos es?"
      instrucciones="Uno estudió plantas y el otro animales. Decide a quién corresponde cada dato."
      clave="cien:schleiden-schwann-mejor"
      opciones={[o('schleiden', 'Schleiden', '🌱'), o('schwann', 'Schwann', '🐾')]}
      cartas={[
        c('🌱', 'Todas las plantas están hechas de células', 'schleiden', 'Matthias Schleiden, botánico, 1838.'),
        c('🐾', 'Los animales también están hechos de células', 'schwann', 'Theodor Schwann, 1839.'),
        c('🌿', 'Era botánico', 'schleiden', 'Estudiaba tejidos de plantas al microscopio.'),
        c('🩺', 'Era fisiólogo y estudiaba tejidos animales', 'schwann', 'Comparó cartílago y nervios con los tejidos vegetales.'),
        c('🧠', 'Su nombre quedó en unas células que rodean los nervios', 'schwann', 'Las células de Schwann forman la vaina de mielina.'),
        c('📅', 'Publicó primero, en 1838', 'schleiden', 'Schwann extendió la idea a los animales un año después.'),
        c('🧪', 'Estudió la digestión y descubrió la pepsina', 'schwann', 'La pepsina es una enzima del estómago.'),
        c('🔵', 'Se fijó en el núcleo de las células vegetales', 'schleiden', 'Pensaba, equivocadamente, que las células nuevas brotaban del núcleo.'),
      ]}
      cierre="Schleiden (plantas) y Schwann (animales) juntaron sus resultados: todo ser vivo está hecho de células."
    />
  )
}

export function PasteurJuego() {
  return (
    <JuegoDecide
      titulo="¿De dónde salió esa vida?"
      pregunta="¿Qué idea apoya esto?"
      instrucciones="¿La vida sale de materia sin vida (generación espontánea) o solo de otra vida (biogénesis)?"
      clave="cien:pasteur-mejor"
      opciones={[o('esp', 'Generación espontánea', '🌫️'), o('bio', 'La vida viene de la vida', '🐣')]}
      cartas={[
        c('🥩', 'Las moscas nacen de la carne podrida', 'esp', 'Así se creía antes de Redi.'),
        c('🪰', 'Solo hay larvas donde las moscas pudieron poner huevos', 'bio', 'Redi, 1668: la carne tapada con gasa no tuvo larvas.'),
        c('🍲', 'Un caldo hervido se llena de microbios solo con el aire', 'esp', 'Era el argumento de quienes defendían la generación espontánea.'),
        c('🦢', 'El caldo con cuello de cisne intacto sigue limpio', 'bio', 'Pasteur: el aire entra, pero el polvo con microbios queda en la curva.'),
        c('🧺', 'Los ratones nacen de trapos sucios con trigo', 'esp', 'Una receta famosa del siglo XVII.'),
        c('✂️', 'Al romper el cuello del frasco, el caldo se daña', 'bio', 'Ahora los microbios del polvo sí llegan al caldo.'),
        c('🧫', 'Toda célula viene de otra célula', 'bio', 'Virchow, 1855: el tercer postulado.'),
        c('🐸', 'Las ranas nacen del barro', 'esp', 'Otra creencia antigua de la generación espontánea.'),
      ]}
      cierre="Redi y Pasteur mostraron que hoy la vida no sale de la nada: siempre viene de otra vida."
    />
  )
}

export function TeoriaModernaJuego() {
  return (
    <JuegoDecide
      titulo="¿Clásico o de hoy?"
      pregunta="¿Es un postulado clásico o se añadió después?"
      instrucciones="Los tres postulados vienen del siglo XIX. Hoy se suman otras ideas. Decide."
      clave="cien:teoria-moderna-mejor"
      opciones={[o('clasico', 'Clásico (siglo XIX)', '📜'), o('hoy', 'Se añade hoy', '🧬')]}
      cartas={[
        c('🧱', 'Todo ser vivo está formado por células', 'clasico', 'La célula es la unidad estructural.'),
        c('⚙️', 'La célula es la unidad que hace funcionar al ser vivo', 'clasico', 'La célula es la unidad funcional.'),
        c('🧫', 'Toda célula viene de otra célula', 'clasico', 'Virchow, 1855.'),
        c('🧬', 'La célula guarda el ADN y lo pasa a sus hijas', 'hoy', 'Se añadió cuando se supo que el ADN es el material hereditario.'),
        c('🔥', 'Las reacciones químicas de la vida ocurren dentro de las células', 'hoy', 'El metabolismo sucede en las células.'),
        c('⚗️', 'Todas las células tienen una química parecida', 'hoy', 'Agua, proteínas, lípidos, azúcares y ácidos nucleicos en todas.'),
        c('🔋', 'La energía de la vida fluye dentro de las células', 'hoy', 'Por ejemplo, con el ATP.'),
        c('🔬', 'Lo dijeron Schleiden y Schwann', 'clasico', 'Ellos formularon el primer postulado en 1838–1839.'),
      ]}
      cierre="Los tres postulados siguen en pie; hoy se les suma lo que sabemos del ADN y del metabolismo."
    />
  )
}

export function OrigenCelulasJuego() {
  return (
    <JuegoDecide
      titulo="¿Cierto o falso? El origen"
      pregunta="¿Es cierto?"
      instrucciones="Ideas sobre cómo aparecieron las primeras células. Decide si son ciertas."
      clave="cien:origen-celulas-mejor"
      opciones={VF}
      cartas={[
        c('🌋', 'La Tierra primitiva casi no tenía oxígeno libre', 'v', 'El oxígeno abundante llegó mucho después, con la fotosíntesis.'),
        c('⚡', 'Miller y Urey obtuvieron aminoácidos con chispas eléctricas', 'v', 'Fue en 1953, simulando gases y rayos.'),
        c('🦠', 'Miller y Urey crearon una célula viva en el laboratorio', 'f', 'Obtuvieron moléculas de la vida, no células.'),
        c('🍲', 'Oparin y Haldane imaginaron una «sopa» de moléculas', 'v', 'Propusieron que las moléculas se fueron juntando en el agua.'),
        c('🧪', 'Esto demuestra que Pasteur estaba equivocado', 'f', 'Pasteur habló de hoy: la vida actual viene de vida. El origen fue hace miles de millones de años.'),
        c('⏳', 'Las primeras células aparecieron hace unos 3800 millones de años', 'v', 'Es la cifra que más se usa, aunque se sigue estudiando.'),
        c('🫧', 'Las protocélulas eran gotitas con membrana', 'v', 'Una envoltura de lípidos que separaba un adentro de un afuera.'),
        c('✅', 'Ya se sabe con total certeza cómo pasó', 'f', 'Es una hipótesis muy estudiada, pero sigue abierta.'),
      ]}
      cierre="De moléculas simples a protocélulas: es la mejor explicación que tenemos, y se sigue investigando."
    />
  )
}

export function EndosimbiosisJuego() {
  return (
    <JuegoDecide
      titulo="¿Mitocondria, cloroplasto o las dos?"
      pregunta="¿De cuál se dice esto?"
      instrucciones="Las dos fueron bacterias libres, pero no son iguales. Decide."
      clave="cien:endosimbiosis-mejor"
      opciones={[o('mito', 'Mitocondria', '🔋'), o('cloro', 'Cloroplasto', '🌿'), o('dos', 'Las dos', '🤝')]}
      cartas={[
        c('🧬', 'Tiene su propio ADN circular', 'dos', 'Como el de las bacterias.'),
        c('🫧', 'Tiene doble membrana', 'dos', 'La interna sería la de la bacteria; la externa, de la célula que la engulló.'),
        c('⚙️', 'Tiene ribosomas pequeños, como los de las bacterias', 'dos', 'Ribosomas 70S, no 80S como el resto de la célula.'),
        c('☀️', 'Viene de una cianobacteria que hacía fotosíntesis', 'cloro', 'Por eso capta la luz.'),
        c('💨', 'Viene de una bacteria que usaba oxígeno', 'mito', 'Por eso hace la respiración celular.'),
        c('🐾', 'La tienen las células animales', 'mito', 'Los animales no tienen cloroplastos.'),
        c('➗', 'Se divide por su cuenta, como una bacteria', 'dos', 'No se fabrican de cero: se parten en dos.'),
        c('⚡', 'Produce la mayor parte del ATP', 'mito', 'Es la central de energía de la célula.'),
        c('🌱', 'Solo está en plantas y algas', 'cloro', 'Es donde se hace la fotosíntesis.'),
      ]}
      cierre="Mitocondrias y cloroplastos guardan pistas de su pasado como bacterias: ADN, ribosomas y doble membrana."
    />
  )
}

/* ── Tema 3 · Tipos de células ───────────────────────────── */

export function EucariotasJuego() {
  return (
    <JuegoDecide
      titulo="¿De qué grupo es?"
      pregunta="¿Protista, hongo, planta o animal?"
      instrucciones="Todos son eucariotas. Decide a qué gran grupo pertenece cada uno."
      clave="cien:eucariotas-mejor"
      opciones={[o('protista', 'Protista', '💧'), o('hongo', 'Hongo', '🍄'), o('planta', 'Planta', '🌿'), o('animal', 'Animal', '🐾')]}
      cartas={[
        c('💧', 'Ameba', 'protista', 'Una sola célula que se mueve con «pies».'),
        c('🦶', 'Paramecio', 'protista', 'Unicelular cubierto de cilios.'),
        c('🦟', 'El parásito de la malaria', 'protista', 'Plasmodium: un protista que vive dentro de nuestras células.'),
        c('🍞', 'Levadura del pan', 'hongo', 'Un hongo de una sola célula.', 'Pared de quitina.'),
        c('🍄', 'Champiñón', 'hongo', 'Se alimenta absorbiendo; no hace fotosíntesis.'),
        c('🟢', 'Moho del pan', 'hongo', 'Hilos (hifas) que absorben el alimento.'),
        c('🌿', 'Helecho', 'planta', 'Hace fotosíntesis y tiene pared de celulosa.'),
        c('🟩', 'Musgo', 'planta', 'Una planta pequeña sin flores.'),
        c('🧽', 'Esponja de mar', 'animal', 'Parece una planta, pero es un animal: no hace fotosíntesis.', 'No tiene pared celular.'),
        c('🪸', 'Coral', 'animal', 'Pequeños animales que viven en colonia.'),
        c('🦋', 'Mariposa', 'animal', 'Pluricelular, sin pared, se alimenta de otros.'),
      ]}
      cierre="Protistas, hongos, plantas y animales: todos con núcleo, pero con formas de vida muy distintas."
    />
  )
}

export function EspecializadasJuego() {
  return (
    <JuegoDecide
      titulo="¿Qué célula es?"
      pregunta="Por su forma, ¿qué célula es?"
      instrucciones="La forma habla de la función. Lee la pista y reconoce la célula."
      clave="cien:especializadas-mejor"
      opciones={[o('neurona', 'Neurona', '⚡'), o('globulo', 'Glóbulo rojo', '🔴'), o('esperma', 'Espermatozoide', '🏊'), o('musculo', 'Célula muscular', '💪')]}
      cartas={[
        c('🌳', 'Ramas cortas para recibir señales de muchas células', 'neurona', 'Las dendritas reciben mensajes.'),
        c('📏', 'Una prolongación larguísima para llevar mensajes', 'neurona', 'El axón puede medir más de un metro.'),
        c('🥏', 'Disco hundido en el centro y sin núcleo', 'globulo', 'Más espacio para la hemoglobina y más superficie.'),
        c('🌀', 'Se dobla para pasar por vasos muy estrechos', 'globulo', 'Los capilares son más angostos que la célula.'),
        c('🏊', 'Una cola para nadar', 'esperma', 'El flagelo lo lleva hasta el óvulo.'),
        c('🎯', 'Cabeza con enzimas para entrar al óvulo', 'esperma', 'El acrosoma rompe la cubierta del óvulo.'),
        c('🧵', 'Larga, con filamentos que se deslizan para acortarse', 'musculo', 'Así se contrae.'),
        c('🔢', 'Fibra larga con muchos núcleos', 'musculo', 'La fibra del músculo esquelético nace de varias células unidas.'),
      ]}
      cierre="Cada célula especializada tiene la forma que necesita su trabajo."
    />
  )
}

export function VirusJuego() {
  return (
    <JuegoDecide
      titulo="¿Virus o bacteria?"
      pregunta="¿De quién se dice esto?"
      instrucciones="Una bacteria es una célula; un virus no. Decide de cuál se habla, o si vale para los dos."
      clave="cien:virus-mejor"
      opciones={[o('virus', 'Virus', '🦠'), o('bacteria', 'Bacteria', '🧫'), o('dos', 'Los dos', '🤝')]}
      cartas={[
        c('🫧', 'Tiene membrana y citoplasma', 'bacteria', 'Es una célula completa.'),
        c('⚙️', 'Tiene sus propios ribosomas', 'bacteria', 'El virus usa los de la célula que invade.'),
        c('➗', 'Se reproduce sola, partiéndose en dos', 'bacteria', 'Bipartición.'),
        c('🏠', 'Solo se multiplica dentro de una célula', 'virus', 'Fuera de una célula no hace nada.'),
        c('🛡️', 'Es material genético dentro de una cubierta de proteínas', 'virus', 'Esa cubierta se llama cápside.'),
        c('💊', 'Los antibióticos la combaten', 'bacteria', 'Los antibióticos no sirven contra los virus.'),
        c('🧬', 'Tiene material genético', 'dos', 'El virus tiene ADN o ARN; la bacteria, ADN.'),
        c('🤒', 'Puede causar enfermedades', 'dos', 'Gripa (virus), tuberculosis (bacteria).'),
        c('🥛', 'Algunas viven en tu intestino y te ayudan', 'bacteria', 'La microbiota digiere y nos protege.'),
        c('🔬', 'Solo se ve con microscopio electrónico', 'virus', 'Es decenas de veces más pequeño que una bacteria.'),
      ]}
      cierre="La bacteria es una célula que vive por su cuenta; el virus no es una célula y necesita una para multiplicarse."
    />
  )
}

/* ── Tema 2b · Unicelulares y pluricelulares ─────────────── */

export function UnicelularesJuego() {
  return (
    <JuegoDecide
      titulo="Una célula lo hace todo"
      pregunta="¿Qué está haciendo?"
      instrucciones="Un ser unicelular se alimenta, se mueve, responde y se reproduce. ¿Qué hace en cada caso?"
      clave="cien:unicelulares-mejor"
      opciones={[o('comer', 'Alimentarse', '🍽️'), o('mover', 'Moverse', '🏊'), o('responder', 'Responder', '👀'), o('repro', 'Reproducirse', '➗')]}
      cartas={[
        c('💧', 'La ameba envuelve un trozo de alimento', 'comer', 'Fagocitosis: lo rodea con sus pseudópodos.'),
        c('🦶', 'El paramecio bate sus cilios', 'mover', 'Miles de pelitos que reman.'),
        c('🧫', 'La bacteria se parte en dos', 'repro', 'Bipartición.'),
        c('☀️', 'La euglena se dirige hacia la luz', 'responder', 'Detecta la luz con su mancha ocular.', 'Reacciona a algo del ambiente.'),
        c('🍞', 'A la levadura le sale una yema', 'repro', 'Gemación.'),
        c('☣️', 'Una bacteria se aleja de una sustancia tóxica', 'responder', 'Percibe el químico y cambia de rumbo.'),
        c('🌀', 'Una bacteria gira su flagelo', 'mover', 'El flagelo funciona como una hélice.'),
        c('🕳️', 'El paramecio lleva comida a su surco oral', 'comer', 'Los cilios empujan el alimento hacia esa «boca».'),
      ]}
      cierre="Una sola célula cumple todas las funciones de la vida: no es un ser «simple»."
    />
  )
}

export function ColoniasJuego() {
  return (
    <JuegoDecide
      titulo="¿Colonia o pluricelular?"
      pregunta="¿Colonia o pluricelular?"
      instrucciones="En una colonia cada célula podría vivir sola; en un pluricelular, no. Decide."
      clave="cien:colonias-mejor"
      opciones={[o('colonia', 'Colonia', '🫧'), o('pluri', 'Pluricelular', '🌳')]}
      cartas={[
        c('🟢', 'Volvox', 'colonia', 'Una esfera de algas casi iguales, con un reparto de tareas sencillo.'),
        c('🧫', 'Algas pegadas que, si se separan, sobreviven', 'colonia', 'Cada una puede vivir por su cuenta.'),
        c('🟩', 'Gonium: de 4 a 16 algas en una placa', 'colonia', 'Todas iguales, unidas tras dividirse.'),
        c('🌸', 'Coanoflagelados en roseta', 'colonia', 'Parientes de los animales que viven juntos en grupos.'),
        c('🧽', 'Esponja de mar', 'pluri', 'Es un animal, con células de distintos tipos.'),
        c('🪱', 'Lombriz', 'pluri', 'Sus células no podrían vivir solas.'),
        c('🫀', 'Las células de tu hígado', 'pluri', 'Separadas del cuerpo no sobreviven por su cuenta.'),
        c('🌳', 'Un árbol', 'pluri', 'Raíz, tallo y hojas con células especializadas.'),
      ]}
      cierre="La colonia es un paso intermedio: células juntas que todavía pueden vivir solas."
    />
  )
}

export function OficioJuego() {
  return (
    <JuegoDecide
      titulo="Cada célula, su oficio"
      pregunta="¿Cuál es su oficio?"
      instrucciones="En un pluricelular el trabajo se reparte. ¿Qué tarea cumple cada célula?"
      clave="cien:oficio-mejor"
      opciones={[o('llevar', 'Transportar', '🚚'), o('mover', 'Contraerse', '💪'), o('luz', 'Captar luz', '☀️'), o('defender', 'Defender', '🛡️')]}
      cartas={[
        c('🔴', 'Glóbulo rojo', 'llevar', 'Lleva oxígeno a todo el cuerpo.'),
        c('💪', 'Célula del músculo del brazo', 'mover', 'Se acorta para mover el hueso.'),
        c('🍃', 'Célula de la hoja llena de cloroplastos', 'luz', 'Hace la fotosíntesis.'),
        c('⚪', 'Glóbulo blanco', 'defender', 'Ataca microbios.'),
        c('🪵', 'Célula del xilema', 'llevar', 'Forma tubos que suben el agua desde la raíz.'),
        c('🫀', 'Célula del corazón', 'mover', 'Se contrae para bombear la sangre.'),
        c('🧪', 'Linfocito que fabrica anticuerpos', 'defender', 'Reconoce a los invasores y los marca.'),
        c('🌿', 'Célula verde del tallo joven', 'luz', 'Los tallos verdes también hacen fotosíntesis.'),
      ]}
      cierre="Cada tipo de célula se especializa en una tarea y depende de las demás para todo lo otro."
    />
  )
}

export function VentajasJuego() {
  return (
    <JuegoDecide
      titulo="¿Ventaja o costo?"
      pregunta="Ser pluricelular, ¿qué trae esto?"
      instrucciones="Ser grande y tener muchas células tiene ganancias y precios. Decide."
      clave="cien:ventajas-mejor"
      opciones={[o('ventaja', 'Ventaja', '👍'), o('costo', 'Costo', '💸')]}
      cartas={[
        c('🥔', 'Guardar más reservas de alimento', 'ventaja', 'Un cuerpo grande almacena más.'),
        c('🌳', 'Llegar más alto o más lejos', 'ventaja', 'Un árbol alcanza la luz; una raíz, el agua.'),
        c('🦠', 'No ser comido por depredadores pequeños', 'ventaja', 'Una ameba se come a una bacteria, no a un perro.'),
        c('🧩', 'Tener células que hacen muy bien una sola tarea', 'ventaja', 'La especialización hace más eficiente el trabajo.'),
        c('🔗', 'Las células ya no pueden vivir solas', 'costo', 'Dependen del resto del cuerpo.'),
        c('🩸', 'Hace falta un sistema de transporte', 'costo', 'Las células del interior quedan lejos del exterior.'),
        c('⏳', 'Se tarda más en crecer y reproducirse', 'costo', 'Una bacteria se divide en minutos; un humano tarda años en madurar.'),
        c('⚠️', 'Si una célula se descontrola, daña a todo el cuerpo', 'costo', 'Es lo que pasa en el cáncer.'),
      ]}
      cierre="Ser pluricelular no es «mejor»: es otra solución, con ventajas y costos."
    />
  )
}

export function OrigenPluriJuego() {
  return (
    <JuegoDecide
      titulo="¿Cierto o falso? Pluricelulares"
      pregunta="¿Es cierto?"
      instrucciones="Ideas sobre cómo surgieron los seres pluricelulares. Decide si son ciertas."
      clave="cien:origen-pluri-mejor"
      opciones={VF}
      cartas={[
        c('1️⃣', 'Los pluricelulares aparecieron una sola vez', 'f', 'Surgieron varias veces, en linajes distintos.'),
        c('🌍', 'Animales, plantas y hongos se volvieron pluricelulares por separado', 'v', 'Cada linaje lo logró por su cuenta.'),
        c('🧲', 'Una forma de empezar: células que no se separan al dividirse', 'v', 'Así se forman las colonias de algas.'),
        c('🤝', 'Otra forma: células sueltas que se juntan', 'v', 'Como la ameba social Dictyostelium cuando falta alimento.'),
        c('🍞', 'En el laboratorio, unas levaduras empezaron a formar grupos', 'v', 'Al seleccionar las que caían más rápido, formaron «copos».'),
        c('🫧', 'Las colonias pudieron ser un paso intermedio', 'v', 'Células juntas, con un reparto de tareas sencillo.'),
        c('📚', 'Ya se sabe con total certeza cómo pasó', 'f', 'Todavía se investiga.'),
        c('🧽', 'Los animales y las plantas tienen un ancestro pluricelular común', 'f', 'Su ancestro común era unicelular.'),
      ]}
      cierre="La pluricelularidad apareció muchas veces y de varias maneras; todavía se investiga cómo."
    />
  )
}

/* ── Tema 6 · Procesos celulares ─────────────────────────── */

export function ParaQueDividirseJuego() {
  return (
    <JuegoDecide
      titulo="¿Para qué se divide?"
      pregunta="¿Para qué se divide aquí la célula?"
      instrucciones="Las células se dividen para crecer, para reparar o para reproducirse. Decide."
      clave="cien:dividirse-mejor"
      opciones={[o('crecer', 'Crecer', '📈'), o('reparar', 'Reparar', '🩹'), o('repro', 'Reproducirse', '🐣')]}
      cartas={[
        c('👶', 'Un bebé que se vuelve niño', 'crecer', 'Más células, cuerpo más grande.'),
        c('🩹', 'Una herida en la piel que se cierra', 'reparar', 'Células nuevas reemplazan las dañadas.'),
        c('🧫', 'Una bacteria que se vuelve dos bacterias', 'repro', 'En un unicelular, dividirse es reproducirse.'),
        c('🦴', 'Un hueso roto que suelda', 'reparar', 'Las células del hueso se multiplican en la fractura.'),
        c('🍞', 'La levadura que se multiplica en la masa', 'repro', 'Cada levadura nueva es un individuo nuevo.'),
        c('🌱', 'Una raíz que se alarga', 'crecer', 'En las puntas hay células que se dividen sin parar.'),
        c('🦎', 'La cola de una lagartija que vuelve a salir', 'reparar', 'Regeneración: se reconstruye lo perdido.'),
        c('🥚', 'Un cigoto que se vuelve embrión', 'crecer', 'De una célula a millones.'),
      ]}
      cierre="Crecer, reparar y reproducirse: tres razones para dividirse."
    />
  )
}

export function CromatinaJuego() {
  return (
    <JuegoDecide
      titulo="¿Cromatina o cromosoma?"
      pregunta="¿Cómo está el ADN en este momento?"
      instrucciones="El mismo ADN puede estar suelto (cromatina) o muy enrollado (cromosoma). Decide."
      clave="cien:cromatina-mejor"
      opciones={[o('cromatina', 'Cromatina (suelto)', '🧶'), o('cromosoma', 'Cromosoma (compacto)', '✖️')]}
      cartas={[
        c('🧶', 'Hilos sueltos y enredados en el núcleo', 'cromatina', 'Así está casi todo el tiempo.'),
        c('✖️', 'Forma de X en plena mitosis', 'cromosoma', 'Dos cromátidas unidas por el centrómero.'),
        c('📖', 'La célula está leyendo sus genes', 'cromatina', 'Suelto, el ADN se puede leer.'),
        c('📦', 'El ADN está listo para repartirse', 'cromosoma', 'Compacto, no se enreda ni se rompe.'),
        c('🗂️', 'Se ordena por pares en un cariotipo', 'cromosoma', 'Para contarlos hay que verlos compactos.'),
        c('⏸️', 'La célula está en interfase', 'cromatina', 'Entre divisiones el ADN está suelto.'),
        c('📋', 'El ADN se está copiando', 'cromatina', 'La copia ocurre en la interfase, con el ADN suelto.'),
        c('🔬', 'Se puede contar con un microscopio óptico', 'cromosoma', 'Solo compactos se ven y se cuentan.'),
      ]}
      cierre="Suelto para leerlo y copiarlo; compacto para repartirlo sin que se enrede."
    />
  )
}

export function CitocinesisJuego() {
  return (
    <JuegoDecide
      titulo="¿Animal o vegetal?"
      pregunta="¿Así se parte una célula animal o una vegetal?"
      instrucciones="La célula animal se estrangula; la vegetal no puede apretarse por la pared. Decide."
      clave="cien:citocinesis-mejor"
      opciones={[o('animal', 'Animal', '🐾'), o('vegetal', 'Vegetal', '🌿')]}
      cartas={[
        c('⭕', 'Un anillo que aprieta por la mitad', 'animal', 'Es un anillo de microfilamentos.'),
        c('〰️', 'Se forma un surco en la superficie', 'animal', 'El surco de división se va hundiendo.'),
        c('🧱', 'Se arma una placa en el centro', 'vegetal', 'La placa celular crece hacia los lados.'),
        c('🫧', 'Vesículas del Golgi se juntan en el medio', 'vegetal', 'Traen el material de la pared nueva.'),
        c('🪵', 'Termina con una pared nueva entre las dos células', 'vegetal', 'Cada hija queda con su pared.'),
        c('🎗️', 'Se estrangula como un globo con un cordón', 'animal', 'No tiene pared: se puede apretar.'),
        c('⬅️', 'Se divide de afuera hacia adentro', 'animal', 'El surco avanza desde la membrana.'),
        c('➡️', 'Se divide de adentro hacia afuera', 'vegetal', 'La placa crece desde el centro hasta la pared.'),
      ]}
      cierre="Animal: surco que estrangula. Vegetal: placa que crece y se vuelve pared."
    />
  )
}

export function ControlCicloJuego() {
  return (
    <JuegoDecide
      titulo="¿Sigue o se detiene?"
      pregunta="En el punto de control, ¿qué hace la célula?"
      instrucciones="Los puntos de control son semáforos del ciclo. ¿Verde o rojo?"
      clave="cien:control-ciclo-mejor"
      opciones={[o('sigue', 'Sigue (verde)', '🟢'), o('para', 'Se detiene (rojo)', '🔴')]}
      cartas={[
        c('✅', 'El ADN se copió bien y la célula creció lo suficiente', 'sigue', 'Puede pasar a la siguiente fase.'),
        c('☀️', 'El sol dañó el ADN', 'para', 'Se detiene para repararlo; si no puede, se elimina.'),
        c('🧲', 'Un cromosoma no está unido al huso', 'para', 'Control de la metafase: nadie se separa hasta que todos estén unidos.'),
        c('📏', 'Todos los cromosomas alineados y unidos al huso', 'sigue', 'Puede empezar la anafase.'),
        c('🍽️', 'Faltan nutrientes y la célula es muy pequeña', 'para', 'No conviene dividirse todavía.'),
        c('📋', 'Al final de G2, el ADN está completo y sin errores', 'sigue', 'Puede entrar a la mitosis.'),
        c('🚬', 'Sustancias del humo del tabaco dañaron el ADN', 'para', 'Las mutaciones se deben revisar antes de seguir.'),
        c('🧬', 'Falta una parte del ADN por copiar', 'para', 'No puede dividirse con una copia incompleta.'),
      ]}
      cierre="Si los semáforos fallan, una célula dañada puede dividirse sin control: así empieza un cáncer."
    />
  )
}

/* ── Tema 7 · Meiosis ────────────────────────────────────── */

export function CuantosCromosomasJuego() {
  return (
    <JuegoDecide
      titulo="¿Cuántos cromosomas?"
      pregunta="En una persona, ¿cuántos cromosomas tiene esta célula?"
      instrucciones="Las células del cuerpo tienen 46; los gametos, la mitad. ¿Y si no existiera la meiosis?"
      clave="cien:cuantos-cromosomas-mejor"
      opciones={[o('23', '23', '½'), o('46', '46', '✔️'), o('92', '92', '✖️2')]}
      cartas={[
        c('🖐️', 'Una célula de la piel', '46', 'Es diploide (2n = 46).'),
        c('🥚', 'Un óvulo', '23', 'Es haploide (n = 23).'),
        c('🏊', 'Un espermatozoide', '23', 'Es haploide (n = 23).'),
        c('👶', 'Un cigoto', '46', '23 del óvulo + 23 del espermatozoide.'),
        c('⚡', 'Una neurona', '46', 'Todas las células del cuerpo son diploides.'),
        c('🔁', 'Un gameto hecho por mitosis, si existiera', '46', 'La mitosis no reduce: daría gametos con 46.'),
        c('⚠️', 'El hijo de dos gametos hechos por mitosis', '92', '46 + 46: se duplicaría en cada generación.'),
        c('🧬', 'Cada célula al final de la meiosis', '23', 'La meiosis reparte a la mitad.'),
      ]}
      cierre="La meiosis reduce a la mitad para que, al juntarse dos gametos, se recupere el número de la especie."
    />
  )
}

export function MeiosisIoIIJuego() {
  return (
    <JuegoDecide
      titulo="¿Meiosis I o meiosis II?"
      pregunta="¿En cuál de las dos divisiones pasa esto?"
      instrucciones="La meiosis I separa los pares; la II separa las cromátidas. Decide."
      clave="cien:meiosis-i-ii-mejor"
      opciones={[o('i', 'Meiosis I', '1️⃣'), o('ii', 'Meiosis II', '2️⃣')]}
      cartas={[
        c('👫', 'Los homólogos se juntan en pares', 'i', 'Pasa en la profase I.'),
        c('🔀', 'Hay entrecruzamiento', 'i', 'Los homólogos intercambian trozos en la profase I.'),
        c('↔️', 'Se separan los homólogos', 'i', 'Anafase I: un cromosoma de cada par a cada polo.'),
        c('✂️', 'Se separan las cromátidas hermanas', 'ii', 'Anafase II: como en una mitosis.'),
        c('🔻', 'De diploide (2n) se pasa a haploide (n)', 'i', 'Al separar los pares se reduce a la mitad.'),
        c('🪞', 'Se parece mucho a una mitosis', 'ii', 'Separa cromátidas, sin cambiar el número.'),
        c('4️⃣', 'Termina con cuatro células', 'ii', 'Dos células se dividen otra vez.'),
        c('🚫', 'Empieza sin copiar el ADN antes', 'ii', 'Entre las dos divisiones no hay otra copia.'),
      ]}
      cierre="Meiosis I: separa los pares y reduce a la mitad. Meiosis II: separa las cromátidas."
    />
  )
}

export function VariedadJuego() {
  return (
    <JuegoDecide
      titulo="¿De dónde sale la variedad?"
      pregunta="¿Qué fuente de variedad es esta?"
      instrucciones="Dos hermanos no son iguales por tres razones. Reconoce cada una."
      clave="cien:variedad-mejor"
      opciones={[o('entre', 'Entrecruzamiento', '🔀'), o('azar', 'Reparto al azar', '🎲'), o('fecun', 'Fecundación al azar', '💞')]}
      cartas={[
        c('🔀', 'Los homólogos intercambian trozos', 'entre', 'Pasa en la profase I.'),
        c('🧩', 'Un cromosoma con un trozo del abuelo y otro de la abuela', 'entre', 'Resultado del entrecruzamiento.'),
        c('🎲', 'Cada par se acomoda al azar en la metafase I', 'azar', 'Cada gameto recibe una mezcla distinta de cromosomas.'),
        c('🔢', 'Más de 8 millones de gametos distintos por persona', 'azar', '2 elevado a 23, solo por el reparto.'),
        c('💞', 'Cuál espermatozoide llega primero al óvulo', 'fecun', 'Cualquiera de millones puede ser.'),
        c('👨‍👩‍👧', 'Más de 70 billones de hijos posibles por pareja', 'fecun', 'Al juntar dos gametos al azar, las combinaciones se multiplican.'),
        c('⏱️', 'Pasa antes de que se separen los homólogos', 'entre', 'Mientras los pares están juntos.'),
        c('↕️', 'Que el cromosoma de la madre vaya arriba o abajo', 'azar', 'Cada par se orienta sin depender de los otros.'),
      ]}
      cierre="Entrecruzamiento, reparto al azar y fecundación al azar: por eso cada hermano es único."
    />
  )
}

/* ── Tema 8 · Metabolismo ────────────────────────────────── */

export function AtpJuego() {
  return (
    <JuegoDecide
      titulo="¿Gasta o recarga?"
      pregunta="¿Aquí se gasta ATP o se recarga?"
      instrucciones="El ATP es una pila recargable. Decide si cada proceso la descarga o la carga."
      clave="cien:atp-mejor"
      opciones={[o('gasta', 'Gasta ATP', '🪫'), o('recarga', 'Recarga ATP', '🔋')]}
      cartas={[
        c('💪', 'Un músculo se contrae', 'gasta', 'Moverse cuesta energía.'),
        c('🔥', 'La respiración en la mitocondria', 'recarga', 'Es donde más ATP se fabrica.'),
        c('🚪', 'Una bomba saca sodio de la célula', 'gasta', 'El transporte activo va contra la corriente.'),
        c('🏗️', 'Fabricar proteínas', 'gasta', 'Construir moléculas grandes cuesta energía.'),
        c('🍬', 'Romper la glucosa en el citoplasma', 'recarga', 'La glucólisis da un poco de ATP.'),
        c('☀️', 'La luz llega al cloroplasto', 'recarga', 'La fase luminosa fabrica ATP.'),
        c('🏊', 'El espermatozoide mueve su cola', 'gasta', 'Por eso tiene muchas mitocondrias.'),
        c('🔗', 'ADP + fosfato → ATP', 'recarga', 'Se vuelve a poner el fosfato.'),
        c('💥', 'El ATP suelta un fosfato', 'gasta', 'Al soltarlo libera la energía.'),
      ]}
      cierre="La glucosa recarga las pilas; moverse, bombear y fabricar las gastan."
    />
  )
}

export function SenalJuego() {
  return (
    <JuegoDecide
      titulo="Señal, receptor o respuesta"
      pregunta="¿Qué parte del mensaje es?"
      instrucciones="Un mensaje entre células tiene tres partes. Reconoce cada una."
      clave="cien:senal-mejor"
      opciones={[o('senal', 'Señal', '✉️'), o('receptor', 'Receptor', '🔑'), o('respuesta', 'Respuesta', '⚡')]}
      cartas={[
        c('💉', 'La insulina que viaja por la sangre', 'senal', 'Es el mensaje químico.'),
        c('😨', 'La adrenalina cuando te asustas', 'senal', 'Otra hormona que viaja a todo el cuerpo.'),
        c('🔑', 'Una proteína de la membrana que encaja con la hormona', 'receptor', 'Solo la célula que la tiene recibe el mensaje.'),
        c('🍬', 'La célula del músculo toma glucosa de la sangre', 'respuesta', 'Lo que hace tras recibir la insulina.'),
        c('💓', 'El corazón late más rápido', 'respuesta', 'Respuesta a la adrenalina.'),
        c('🧩', 'La «cerradura» donde encaja el mensaje', 'receptor', 'Señal y receptor encajan como llave y cerradura.'),
        c('🧠', 'Un neurotransmisor que sale de una neurona', 'senal', 'Un mensaje a una célula vecina.'),
        c('🫁', 'Los bronquios se abren para entrar más aire', 'respuesta', 'Otra respuesta a la adrenalina.'),
      ]}
      cierre="Una señal solo actúa en la célula que tiene su receptor, y esa célula responde."
    />
  )
}

export function UnionesJuego() {
  return (
    <JuegoDecide
      titulo="¿Qué unión es?"
      pregunta="¿Qué tipo de unión es?"
      instrucciones="Las uniones sellan, sujetan o comunican. Decide cuál es."
      clave="cien:uniones-mejor"
      opciones={[o('estrecha', 'Estrecha (sella)', '🔒'), o('anclaje', 'De anclaje (sujeta)', '📎'), o('comunicante', 'Comunicante (pasa)', '🚇')]}
      cartas={[
        c('🔒', 'Sella el intestino para que nada se cuele entre células', 'estrecha', 'Todo lo que entra debe pasar por las células.'),
        c('🖐️', 'Sujeta las células de la piel para que no se rompa al estirarse', 'anclaje', 'Como remaches entre vecinas.'),
        c('💓', 'Deja pasar iones entre las células del corazón', 'comunicante', 'Así se contraen todas juntas.'),
        c('🤐', 'Como un cierre hermético', 'estrecha', 'No deja pasar ni agua entre las células.'),
        c('📎', 'Como broches entre vecinas', 'anclaje', 'Resisten los tirones.'),
        c('🚇', 'Como túneles entre dos células', 'comunicante', 'Pasan moléculas pequeñas de una a otra.'),
        c('🌿', 'En las plantas: canales que atraviesan la pared', 'comunicante', 'Se llaman plasmodesmos y cumplen la misma función.'),
        c('🫁', 'Impide que se escape el contenido de la vejiga', 'estrecha', 'Sella el paso entre las células.'),
      ]}
      cierre="Estrechas sellan, las de anclaje sujetan y las comunicantes dejan pasar."
    />
  )
}

/* ── Tema 9 · De la célula al organismo ──────────────────── */

export function DiferenciacionJuego() {
  return (
    <JuegoDecide
      titulo="¿Cierto o falso? Diferenciación"
      pregunta="¿Es cierto?"
      instrucciones="Mismo ADN, células distintas. Decide si cada idea es cierta."
      clave="cien:diferenciacion-mejor"
      opciones={VF}
      cartas={[
        c('🧬', 'Una neurona y una célula de la piel tienen el mismo ADN', 'v', 'Vienen del mismo cigoto.'),
        c('🗑️', 'La célula muscular borró los genes que no usa', 'f', 'Los conserva; solo los mantiene apagados.'),
        c('💡', 'Cada tipo de célula enciende genes distintos', 'v', 'Eso la hace diferente.'),
        c('🐸', 'Gurdon clonó una rana con el núcleo de una célula del intestino', 'v', 'Prueba de que el núcleo diferenciado conserva todo el ADN.'),
        c('🔄', 'La diferenciación cambia las letras del ADN', 'f', 'Cambia qué genes se usan, no el ADN.'),
        c('🥚', 'Todas tus células vienen de un solo cigoto', 'v', 'Por divisiones y diferenciación.'),
        c('🔴', 'Un glóbulo rojo maduro humano no tiene núcleo', 'v', 'Lo pierde al especializarse, para tener más espacio.'),
        c('⚡', 'Las neuronas se dividen fácil para reemplazarse', 'f', 'Casi no se dividen: por eso cuesta reparar el cerebro.'),
      ]}
      cierre="Diferenciarse es encender unos genes y apagar otros, sin perder el ADN."
    />
  )
}

export function CelulasMadreJuego() {
  return (
    <JuegoDecide
      titulo="¿Cuántos destinos?"
      pregunta="¿Qué tan potente es esta célula?"
      instrucciones="Cuanto más temprana, más tipos de célula puede formar. Decide."
      clave="cien:celulas-madre-mejor"
      opciones={[o('toti', 'Totipotente', '🌟'), o('pluri', 'Pluripotente', '✨'), o('multi', 'Multipotente', '⭐'), o('esp', 'Ya especializada', '🔒')]}
      cartas={[
        c('🥚', 'El cigoto', 'toti', 'Puede formar todo el organismo y la placenta.'),
        c('2️⃣', 'Las dos primeras células tras dividirse el cigoto', 'toti', 'Si se separan, salen gemelos.'),
        c('🫐', 'Una célula del interior del embrión de pocos días', 'pluri', 'Forma cualquier tejido del cuerpo, pero no la placenta.'),
        c('🧪', 'Una célula de piel reprogramada, como hizo Yamanaka', 'pluri', 'Las llamó iPS: células pluripotentes inducidas.'),
        c('🦴', 'Una célula madre de la médula ósea', 'multi', 'Forma solo los distintos tipos de células de la sangre.'),
        c('🖐️', 'Una célula madre de la piel', 'multi', 'Renueva las células de la piel.'),
        c('⚡', 'Una neurona', 'esp', 'Ya tiene su oficio y casi no se divide.'),
        c('🔴', 'Un glóbulo rojo', 'esp', 'Ni siquiera tiene núcleo.'),
      ]}
      cierre="Totipotente, pluripotente, multipotente y especializada: cada paso cierra caminos."
    />
  )
}
