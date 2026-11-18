import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del área 3, tema 7 (Biodiversidad). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function BiodiversidadNivelesJuego() {
  return (
    <JuegoDecide titulo="¿Qué nivel de biodiversidad?" pregunta="¿Qué tipo de diversidad es?" instrucciones="Genes, especies o ecosistemas." clave="cien:biodiv-niveles-mejor"
      opciones={[o('gen', 'Genética', '🧬'), o('esp', 'De especies', '🦜'), o('eco', 'De ecosistemas', '🏞️')]}
      cartas={[
        c('🥔', 'Cientos de variedades de papa en los Andes', 'gen', 'Una sola especie, muchas variedades.'),
        c('🐦', 'Más de 1900 especies de aves', 'esp', 'Muchas especies distintas.'),
        c('🗺️', 'Páramos, selvas, manglares y desiertos en un país', 'eco', 'Muchos tipos de lugares.'),
        c('🐕', 'Perros de colores y tamaños distintos', 'gen', 'Todos son de la misma especie.'),
        c('🦋', 'Mariposas de cientos de especies en un bosque', 'esp', 'Riqueza de especies.'),
      ]}
      cierre="La biodiversidad se mide en genes, especies y ecosistemas." />
  )
}

export function MegadiversaJuego() {
  return (
    <JuegoDecide titulo="Colombia megadiversa" pregunta="¿Es cierto?" instrucciones="Decide si cada frase es cierta o falsa." clave="cien:megadiversa-mejor" opciones={[o('v', 'Cierto', '✅'), o('f', 'Falso', '❌')]}
      cartas={[
        c('🐦', 'Colombia es el país con más especies de aves', 'v', 'Más de 1900.'),
        c('🌸', 'Colombia está entre los primeros en orquídeas', 'v', 'Más de 4000 especies.'),
        c('❄️', 'La biodiversidad de Colombia se debe a sus cuatro estaciones', 'f', 'Se debe al trópico, las cordilleras y los dos océanos.'),
        c('🐸', 'Una especie endémica vive en muchos países', 'f', 'Solo vive en un lugar.'),
        c('⛰️', 'Las cordilleras crean muchos ambientes distintos', 'v', 'Por los pisos térmicos.'),
      ]}
      cierre="Trópico, montañas y dos mares: por eso Colombia es megadiversa." />
  )
}

export function AmenazasJuego() {
  return (
    <JuegoDecide titulo="¿Qué amenaza es?" pregunta="¿Qué amenaza muestra?" instrucciones="Decide a qué amenaza corresponde cada caso." clave="cien:amenazas-mejor"
      opciones={[o('hab', 'Pérdida de hábitat', '🪓'), o('inv', 'Especie invasora', '🐟'), o('tra', 'Sobreexplotación o tráfico', '🦜'), o('cli', 'Contaminación o clima', '🌡️')]}
      cartas={[
        c('🪓', 'Talar un bosque para hacer potreros', 'hab', 'La principal causa de pérdida de biodiversidad.'),
        c('🐟', 'El pez león se come a los peces nativos del Caribe', 'inv', 'Llegó de otro océano y no tiene depredadores aquí.'),
        c('🦜', 'Vender loros sacados del monte', 'tra', 'El tráfico de fauna es un delito.'),
        c('🧊', 'Los glaciares de los nevados se derriten', 'cli', 'Por el calentamiento global.'),
        c('🧪', 'Mercurio de la minería en los ríos', 'cli', 'Contaminación.'),
        c('🐌', 'El caracol africano se come cultivos y plantas nativas', 'inv', 'Especie invasora.'),
      ]}
      cierre="Hábitat, invasoras, tráfico y contaminación o clima: las grandes amenazas." />
  )
}

export function ConservarJuego() {
  return (
    <JuegoDecide titulo="¿Ayuda o perjudica?" pregunta="¿Ayuda a conservar?" instrucciones="Decide si cada acción ayuda o perjudica a la biodiversidad." clave="cien:conservar-mejor"
      opciones={[o('ayu', 'Ayuda', '💚'), o('per', 'Perjudica', '💔')]}
      cartas={[
        c('🌱', 'Sembrar árboles nativos en la orilla de la quebrada', 'ayu', 'Protege el agua y da hogar a la fauna.'),
        c('🐒', 'Comprar un mono como mascota', 'per', 'Alimenta el tráfico de fauna.'),
        c('🌽', 'Guardar e intercambiar semillas criollas', 'ayu', 'Conserva la diversidad genética.'),
        c('🔥', 'Quemar el rastrojo para limpiar', 'per', 'Destruye el suelo y puede causar incendios.'),
        c('🏞️', 'Crear corredores de bosque entre fincas', 'ayu', 'Los animales pueden moverse.'),
      ]}
      cierre="Conservar también se hace desde la finca, la vereda y el colegio." />
  )
}
