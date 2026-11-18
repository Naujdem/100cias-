import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del área 3 (Relaciones ecosistémicas), tema 1. Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function EcologiaQueJuego() {
  return (
    <JuegoDecide titulo="¿Con quién se relaciona?" pregunta="¿Es un ser vivo o parte del entorno sin vida?" instrucciones="La rana se relaciona con muchas cosas. Decide si cada una está viva o no." clave="cien:ecologia-que-mejor"
      opciones={[o('vivo', 'Ser vivo', '🌱'), o('no', 'Entorno sin vida', '💧')]}
      cartas={[
        c('🦟', 'Los insectos que se come', 'vivo', 'Es una relación con otro ser vivo.'),
        c('💧', 'El agua de la laguna', 'no', 'El agua no está viva, pero la rana la necesita.'),
        c('🪶', 'La garza que la caza', 'vivo', 'Relación entre depredador y presa.'),
        c('🌡️', 'La temperatura del páramo', 'no', 'Es un factor del ambiente.'),
        c('🌿', 'Las plantas donde se esconde', 'vivo', 'Le dan refugio.'),
        c('☀️', 'La luz del sol', 'no', 'Calienta y da energía a las plantas.'),
      ]}
      cierre="La ecología estudia todas esas relaciones: con lo vivo y con lo no vivo." />
  )
}

export function NivelesEcologicosJuego() {
  return (
    <JuegoDecide titulo="¿Qué nivel ecológico es?" pregunta="¿Qué nivel es?" instrucciones="Decide a qué nivel corresponde cada ejemplo." clave="cien:niveles-ecologicos-mejor"
      opciones={[o('ind', 'Individuo', '1️⃣'), o('pob', 'Población', '👥'), o('com', 'Comunidad', '🐻🌿'), o('eco', 'Ecosistema', '🏞️')]}
      cartas={[
        c('🌵', 'Un frailejón', 'ind', 'Un solo ser vivo.'),
        c('🐻', 'Todos los osos de anteojos de un páramo', 'pob', 'Una sola especie en un lugar.'),
        c('🦌', 'Venados, frailejones, colibríes y ranas de un páramo', 'com', 'Varias especies que viven juntas.'),
        c('🏞️', 'El páramo con sus seres vivos, su agua, su suelo y su clima', 'eco', 'Seres vivos más el entorno sin vida.'),
        c('🐸', 'Todas las ranas de una especie en una laguna', 'pob', 'Una población.'),
        c('🌿', 'Las plantas, hongos y animales de un bosque, sin contar el suelo ni el agua', 'com', 'Solo lo vivo: comunidad.'),
      ]}
      cierre="Individuo → población → comunidad → ecosistema → bioma → biosfera." />
  )
}

export function HabitatNichoJuego() {
  return (
    <JuegoDecide titulo="¿Hábitat o nicho?" pregunta="¿Es su hábitat o su nicho?" instrucciones="El hábitat es dónde vive; el nicho, qué hace en el ecosistema." clave="cien:habitat-nicho-mejor"
      opciones={[o('hab', 'Hábitat (dónde vive)', '🏠'), o('nic', 'Nicho (qué hace)', '🛠️')]}
      cartas={[
        c('🌲', 'El colibrí vive en el bosque andino', 'hab', 'Es el lugar donde vive.'),
        c('🌸', 'El colibrí toma néctar y poliniza flores', 'nic', 'Es su papel en el ecosistema.'),
        c('🐦', 'El carpintero come insectos de la corteza', 'nic', 'Así se alimenta.'),
        c('🏔️', 'El oso de anteojos vive en páramos y bosques de niebla', 'hab', 'Su lugar.'),
        c('🌱', 'El oso dispersa semillas al comer frutos', 'nic', 'Ayuda a que el bosque crezca.'),
        c('💧', 'La rana vive en lagunas', 'hab', 'Su lugar.'),
      ]}
      cierre="El hábitat es la dirección; el nicho, la profesión." />
  )
}

export function FactoresJuego() {
  return (
    <JuegoDecide titulo="¿Biótico o abiótico?" pregunta="¿Es biótico o abiótico?" instrucciones="Biótico: un ser vivo o lo que produce. Abiótico: lo que no está vivo." clave="cien:factores-mejor"
      opciones={[o('bio', 'Biótico', '🌱'), o('abio', 'Abiótico', '🪨')]}
      cartas={[
        c('🍄', 'Los hongos del suelo', 'bio', 'Son seres vivos que descomponen.'),
        c('🌡️', 'La temperatura', 'abio', 'Un factor físico.'),
        c('🌧️', 'La lluvia', 'abio', 'El agua no está viva.'),
        c('🐝', 'Las abejas que polinizan', 'bio', 'Seres vivos.'),
        c('⛰️', 'La altitud', 'abio', 'Cambia la temperatura y el aire.'),
        c('🦠', 'Las bacterias del agua', 'bio', 'Aunque no se vean, están vivas.'),
        c('🧂', 'La sal del agua de mar', 'abio', 'Una sustancia química.'),
      ]}
      cierre="Bióticos y abióticos forman juntos el ecosistema." />
  )
}

export function PisosJuego() {
  return (
    <JuegoDecide titulo="¿En qué piso térmico?" pregunta="¿Qué piso es?" instrucciones="Decide el piso térmico de cada lugar o cultivo." clave="cien:pisos-mejor"
      opciones={[o('cal', 'Cálido', '🌴'), o('tem', 'Templado', '☕'), o('fri', 'Frío', '🥔'), o('par', 'Páramo', '🌵')]}
      cartas={[
        c('🍫', 'Cacao y plátano', 'cal', 'Se dan en tierra caliente, por debajo de 1000 m.'),
        c('☕', 'Café', 'tem', 'Entre unos 1000 y 2000 m.'),
        c('🥔', 'Papa', 'fri', 'Entre unos 2000 y 3000 m.'),
        c('🌵', 'Frailejones', 'par', 'Por encima de unos 3000 m.'),
        c('🏙️', 'Bogotá, a unos 2600 m', 'fri', 'Clima frío.'),
        c('🏜️', 'El desierto de la Tatacoa, a unos 400 m', 'cal', 'Muy caliente y seco.'),
      ]}
      cierre="A más altura, menos temperatura: cada piso tiene sus seres vivos y cultivos." />
  )
}

export function EcosistemasColombiaJuego() {
  return (
    <JuegoDecide titulo="¿Qué ecosistema es?" pregunta="¿Qué ecosistema describe?" instrucciones="Decide a qué ecosistema de Colombia corresponde cada pista." clave="cien:ecosistemas-co-mejor"
      opciones={[o('par', 'Páramo', '🌵'), o('sel', 'Selva húmeda', '🌳'), o('sab', 'Sabana', '🌾'), o('man', 'Manglar', '🌊')]}
      cartas={[
        c('🌫️', 'Frío, niebla y frailejones; de aquí nacen muchos ríos', 'par', 'Es la alta montaña.'),
        c('🌧️', 'Llueve casi todos los días y hay muchísimas especies', 'sel', 'Amazonía y Chocó.'),
        c('🐎', 'Llanura de pastos con época de lluvias y época seca', 'sab', 'La Orinoquía.'),
        c('🦀', 'Árboles con raíces dentro del agua salada de la costa', 'man', 'Pacífico y Caribe.'),
        c('🐒', 'Árboles muy altos, en varios pisos, y monos aulladores', 'sel', 'Selva húmeda.'),
        c('🐊', 'Esteros, chigüiros y garzas en los Llanos', 'sab', 'Sabana inundable.'),
      ]}
      cierre="Colombia tiene casi todos los tipos de ecosistemas del trópico." />
  )
}

export function ToleranciaJuego() {
  return (
    <JuegoDecide titulo="Rango de tolerancia" pregunta="¿Es cierto?" instrucciones="Decide si cada frase es cierta o falsa." clave="cien:tolerancia-mejor" opciones={[o('v', 'Cierto', '✅'), o('f', 'Falso', '❌')]}
      cartas={[
        c('🌡️', 'Cada especie vive bien solo en un rango de temperatura', 'v', 'Fuera de ese rango sufre o muere.'),
        c('🎯', 'En la zona óptima hay más individuos', 'v', 'Allí viven y se reproducen mejor.'),
        c('🌵', 'Un frailejón crecería igual de bien en tierra caliente', 'f', 'Está adaptado al frío del páramo.'),
        c('💧', 'El factor que más escasea limita a toda la población', 'v', 'Es el factor limitante.'),
        c('🐟', 'Todos los peces toleran la misma temperatura del agua', 'f', 'Cada especie tiene su propio rango.'),
      ]}
      cierre="El factor más alejado del óptimo limita a la población." />
  )
}
