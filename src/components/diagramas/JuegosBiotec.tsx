import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del tema 8 del área 2 (Biotecnología). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function BiotecQueJuego() {
  return (
    <JuegoDecide titulo="¿Tradicional o moderna?" pregunta="¿Qué biotecnología es?" instrucciones="Decide si se usa un ser vivo tal como es (tradicional) o si se cambia su ADN (moderna)." clave="cien:biotec-que-mejor"
      opciones={[o('tra', 'Tradicional', '🍞'), o('mod', 'Moderna', '🧬')]}
      cartas={[
        c('🍞', 'Hacer pan con levadura', 'tra', 'La levadura fermenta sin que se cambie su ADN.'),
        c('🥛', 'Hacer yogur con bacterias', 'tra', 'Es fermentación.'),
        c('💉', 'Bacterias que fabrican insulina humana', 'mod', 'Se les puso un gen humano.'),
        c('🌽', 'Maíz con un gen de bacteria contra orugas', 'mod', 'Es un transgénico.'),
        c('🍺', 'Chicha de maíz fermentado', 'tra', 'Una bebida tradicional fermentada.'),
        c('✂️', 'Corregir un gen con CRISPR', 'mod', 'Es edición génica.'),
      ]}
      cierre="Tradicional: usar seres vivos. Moderna: cambiar su ADN a propósito." />
  )
}

export function InsulinaJuego() {
  return (
    <JuegoDecide titulo="Fabricar insulina" pregunta="¿Qué herramienta es?" instrucciones="Decide qué herramienta cumple cada tarea." clave="cien:insulina-mejor"
      opciones={[o('res', 'Enzima de restricción', '✂️'), o('lig', 'Ligasa', '🔗'), o('pla', 'Plásmido', '⭕'), o('bac', 'Bacteria', '🦠')]}
      cartas={[
        c('✂️', 'Corta el ADN en un sitio exacto', 'res', 'Reconoce una secuencia corta y corta ahí.'),
        c('🔗', 'Pega el gen dentro del plásmido', 'lig', 'Une los extremos del ADN.'),
        c('⭕', 'Pequeño ADN circular que lleva el gen', 'pla', 'Es el «vehículo» del gen.'),
        c('🏭', 'Se multiplica y fabrica la insulina', 'bac', 'Cada bacteria nueva lleva el gen.'),
      ]}
      cierre="Cortar, pegar en un plásmido, meter en una bacteria y dejarla trabajar." />
  )
}

export function PcrJuego() {
  return (
    <JuegoDecide titulo="La PCR" pregunta="¿En qué paso ocurre?" instrucciones="Cada ciclo de la PCR tiene tres pasos de temperatura." clave="cien:pcr-mejor"
      opciones={[o('sep', 'Calentar (≈ 95 °C)', '🔥'), o('ceb', 'Enfriar (≈ 55 °C)', '❄️'), o('cop', 'Entibiar (≈ 72 °C)', '🧱')]}
      cartas={[
        c('↕️', 'Las dos hebras del ADN se separan', 'sep', 'El calor rompe los puentes entre bases.'),
        c('🔴', 'Los cebadores se pegan a cada hebra', 'ceb', 'Marcan dónde empezar a copiar.'),
        c('🧱', 'La polimerasa fabrica las hebras nuevas', 'cop', 'Es una polimerasa que resiste el calor.'),
        c('✖️2', 'Al terminar, el ADN se ha duplicado', 'cop', 'Cada ciclo duplica las copias.'),
      ]}
      cierre="Calentar, enfriar y entibiar: cada ciclo duplica el ADN." />
  )
}

export function TransgenicoJuego() {
  return (
    <JuegoDecide titulo="¿Es transgénico?" pregunta="¿Tiene un gen de otra especie?" instrucciones="Decide si el organismo es transgénico." clave="cien:transgenico-mejor"
      opciones={[o('si', 'Sí, transgénico', '🧬'), o('no', 'No', '🌱')]}
      cartas={[
        c('🌽', 'Maíz con el gen Bt de una bacteria', 'si', 'Tiene un gen de otra especie.'),
        c('🦠', 'Bacteria con el gen humano de la insulina', 'si', 'Lleva un gen humano.'),
        c('🌽', 'Maíz criollo seleccionado por campesinos durante siglos', 'no', 'Es selección tradicional, sin genes de otra especie.'),
        c('🐶', 'Una raza de perro obtenida por cruces', 'no', 'Los cruces no pasan genes de otra especie.'),
        c('🍚', 'Arroz con genes para fabricar provitamina A', 'si', 'El «arroz dorado».'),
      ]}
      cierre="Transgénico: tiene un gen de otra especie puesto en el laboratorio." />
  )
}

export function EdicionJuego() {
  return (
    <JuegoDecide titulo="Editar un gen" pregunta="¿Es cierto?" instrucciones="Decide si cada frase sobre CRISPR es cierta o falsa." clave="cien:edicion-mejor" opciones={[o('v', 'Cierto', '✅'), o('f', 'Falso', '❌')]}
      cartas={[
        c('🎯', 'Una guía de ARN lleva a Cas9 al gen elegido', 'v', 'La guía es complementaria al gen.'),
        c('✂️', 'Cas9 corta el ADN', 'v', 'Corta las dos hebras.'),
        c('🩹', 'Después, la célula repara el corte', 'v', 'Al reparar se puede cambiar o corregir el gen.'),
        c('🧪', 'Ya se aprobaron terapias con CRISPR para la anemia falciforme', 'v', 'Desde 2023, en algunos países.'),
        c('👶', 'Editar embriones humanos está aceptado en todo el mundo', 'f', 'Está prohibido o muy restringido en casi todos los países.'),
      ]}
      cierre="Guía, corte y reparación: así se edita un gen." />
  )
}

export function DebateJuego() {
  return (
    <JuegoDecide titulo="Beneficio o preocupación" pregunta="¿Qué es?" instrucciones="Decide si es un beneficio o una preocupación que se plantea sobre la biotecnología." clave="cien:debate-mejor"
      opciones={[o('ben', 'Beneficio', '⚖️✅'), o('pre', 'Preocupación', '⚖️❓')]}
      cartas={[
        c('💉', 'Producir insulina y vacunas en grandes cantidades', 'ben', 'Ha salvado millones de vidas.'),
        c('🌽', 'Que el polen de un transgénico llegue a maíces nativos', 'pre', 'Preocupa a comunidades que conservan semillas propias.'),
        c('🧪', 'Diagnosticar enfermedades con PCR', 'ben', 'Rápido y preciso.'),
        c('📜', 'Que pocas empresas tengan patentes sobre las semillas', 'pre', 'Puede volver dependientes a los agricultores.'),
        c('🐛', 'Usar menos insecticidas en algunos cultivos', 'ben', 'Es uno de los argumentos a favor del maíz Bt.'),
        c('👶', 'Editar embriones humanos', 'pre', 'Los cambios pasarían a las siguientes generaciones.'),
        c('🧬', 'Curar una enfermedad hereditaria con terapia génica', 'ben', 'Ya hay tratamientos aprobados.'),
        c('💰', 'Que una terapia génica cueste más de un millón de dólares', 'pre', 'Plantea quién puede acceder a ella (justicia).'),
        c('🐑', 'Clonar personas', 'pre', 'La clonación humana reproductiva está prohibida en casi todo el mundo.'),
      ]}
      cierre="Hay beneficios y preocupaciones: conviene decidir con evidencia y escuchando a todos." />
  )
}

export function ClonacionJuego() {
  return (
    <JuegoDecide titulo="¿Reproductiva o terapéutica?" pregunta="¿Qué clonación es?" instrucciones="Decide si el objetivo es obtener un individuo completo (reproductiva) o células y tejidos para curar (terapéutica)." clave="cien:clonacion-mejor"
      opciones={[o('rep', 'Reproductiva', '🐑'), o('ter', 'Terapéutica', '🧫')]}
      cartas={[
        c('🐑', 'Dolly, la oveja nacida en 1996', 'rep', 'Un individuo completo con el ADN de la donante.'),
        c('❤️', 'Fabricar células de músculo cardíaco para reparar un corazón', 'ter', 'Se buscan tejidos, no un individuo.'),
        c('🐒', 'Dos monos clonados en China en 2018', 'rep', 'Primeros primates clonados como Dolly.'),
        c('🧠', 'Obtener neuronas para estudiar el Parkinson', 'ter', 'Células para investigar o curar.'),
        c('🐕', 'Clonar la mascota de una familia', 'rep', 'Sale un animal con el mismo ADN, no con los mismos recuerdos.'),
        c('🩹', 'Producir piel para un paciente quemado con sus propias células', 'ter', 'Evitaría el rechazo.'),
      ]}
      cierre="La reproductiva da un individuo con el mismo ADN; la terapéutica busca células para curar." />
  )
}

export function FivJuego() {
  return (
    <JuegoDecide titulo="¿En qué etapa va?" pregunta="¿Dónde ocurre?" instrucciones="Decide si este paso de la fecundación in vitro ocurre en el cuerpo o en el laboratorio." clave="cien:fiv-mejor"
      opciones={[o('cue', 'En el cuerpo', '🧍'), o('lab', 'En el laboratorio', '🧪')]}
      cartas={[
        c('💉', 'Las hormonas hacen madurar varios óvulos', 'cue', 'Se estimulan los ovarios.'),
        c('🧫', 'El óvulo y el espermatozoide se unen en una placa', 'lab', '«In vitro» significa «en vidrio».'),
        c('🌡️', 'El embrión se divide durante 3 a 5 días en la incubadora', 'lab', 'Se vigila cómo crece.'),
        c('🤰', 'El embrión se implanta en el útero', 'cue', 'Si se implanta, hay embarazo.'),
        c('❄️', 'Se congelan los embriones que no se transfieren', 'lab', 'Es una de las preguntas éticas de la técnica.'),
        c('🔬', 'Inyectar un espermatozoide dentro del óvulo (ICSI)', 'lab', 'Se usa cuando hay pocos espermatozoides.'),
      ]}
      cierre="La FIV une el óvulo y el espermatozoide fuera del cuerpo y luego devuelve el embrión al útero." />
  )
}

export function TerapiaGenicaJuego() {
  return (
    <JuegoDecide titulo="¿Terapia génica o no?" pregunta="¿Es terapia génica?" instrucciones="Decide si el tratamiento cambia los genes de las células del paciente o si es otro tipo de tratamiento." clave="cien:terapia-genica-mejor"
      opciones={[o('si', 'Sí, cambia genes', '🧬'), o('no', 'No', '💊')]}
      cartas={[
        c('🦠', 'Un virus inofensivo lleva un gen sano a las neuronas de un bebé con atrofia muscular espinal', 'si', 'Aprobada en 2019: el gen sano le permite fabricar la proteína.'),
        c('💊', 'Tomar insulina todos los días', 'no', 'Reemplaza la proteína, pero no cambia los genes.'),
        c('👁️', 'Llevar una copia sana de un gen a la retina para una ceguera hereditaria', 'si', 'Aprobada en 2017.'),
        c('🩸', 'Editar con CRISPR células de la médula y devolverlas al paciente', 'si', 'Terapia génica «ex vivo» para la anemia falciforme.'),
        c('💉', 'Vacunarse contra el sarampión', 'no', 'Entrena las defensas; no cambia los genes del paciente.'),
        c('🩺', 'Un trasplante de riñón', 'no', 'Reemplaza el órgano entero.'),
      ]}
      cierre="La terapia génica lleva una copia sana del gen o corrige el gen dañado en las células del paciente." />
  )
}
