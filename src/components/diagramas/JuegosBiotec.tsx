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
      ]}
      cierre="Hay beneficios y preocupaciones: conviene decidir con evidencia y escuchando a todos." />
  )
}
