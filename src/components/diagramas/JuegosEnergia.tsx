import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del área 3, tema 3 (Flujo de energía). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function ProductoresJuego() {
  return (
    <JuegoDecide titulo="¿Qué papel cumple?" pregunta="¿Qué es?" instrucciones="Decide el papel de cada ser vivo en el flujo de energía." clave="cien:productores-mejor"
      opciones={[o('pro', 'Productor', '🌿'), o('her', 'Herbívoro', '🦫'), o('car', 'Carnívoro', '🐆'), o('des', 'Descomponedor', '🍄')]}
      cartas={[
        c('🌳', 'Un árbol de guayaba', 'pro', 'Hace fotosíntesis.'),
        c('🦫', 'Un chigüiro que come pasto', 'her', 'Consumidor primario.'),
        c('🐆', 'Un jaguar', 'car', 'Caza a otros animales.'),
        c('🍄', 'Un hongo sobre un tronco caído', 'des', 'Descompone la materia muerta.'),
        c('🌊', 'Las algas del mar', 'pro', 'También hacen fotosíntesis.'),
        c('🐄', 'Una vaca', 'her', 'Come pasto.'),
        c('🦠', 'Bacterias del suelo que deshacen hojas muertas', 'des', 'Devuelven los nutrientes.'),
        c('🦉', 'Una lechuza que caza ratones', 'car', 'Consumidor secundario.'),
      ]}
      cierre="La energía entra por los productores y pasa a los consumidores; los descomponedores reciclan." />
  )
}

export function CadenaJuego() {
  return (
    <JuegoDecide titulo="¿Qué nivel trófico?" pregunta="¿En qué nivel está?" instrucciones="Cadena: hierba → saltamontes → rana → serpiente → águila." clave="cien:cadena-mejor"
      opciones={[o('p', 'Productor', '🌿'), o('c1', 'Consumidor 1.°', '1️⃣'), o('c2', 'Consumidor 2.°', '2️⃣'), o('c3', 'Consumidor 3.° o más', '3️⃣')]}
      cartas={[
        c('🌿', 'La hierba', 'p', 'Produce su alimento.'),
        c('🦗', 'El saltamontes', 'c1', 'Come plantas.'),
        c('🐸', 'La rana', 'c2', 'Come al herbívoro.'),
        c('🐍', 'La serpiente', 'c3', 'Come a la rana.'),
        c('🦅', 'El águila', 'c3', 'Está en la cima de esta cadena.'),
      ]}
      cierre="Cada eslabón es un nivel trófico; la flecha apunta a quien come." />
  )
}

export function RedJuego() {
  return (
    <JuegoDecide titulo="Si una especie desaparece…" pregunta="¿Qué pasaría?" instrucciones="Piensa en la red trófica del bosque." clave="cien:red-mejor"
      opciones={[o('mas', 'Habría más', '⬆️'), o('menos', 'Habría menos', '⬇️')]}
      cartas={[
        c('🦅', 'Si desaparecen las águilas, ¿qué pasa con las serpientes?', 'mas', 'Tienen menos depredadores.'),
        c('🐁', 'Si desaparecen los ratones, ¿qué pasa con los zorros?', 'menos', 'Pierden parte de su alimento.'),
        c('🐛', 'Si desaparecen los insectos, ¿qué pasa con las ranas?', 'menos', 'Se quedan sin comida.'),
        c('🐍', 'Si desaparecen las serpientes, ¿qué pasa con los ratones?', 'mas', 'Al principio aumentan.'),
        c('🌿', 'Si desaparecen las plantas, ¿qué pasa con todos los animales?', 'menos', 'Toda la red depende de los productores.'),
      ]}
      cierre="En una red, lo que le pasa a una especie afecta a muchas otras." />
  )
}

export function PiramideJuego() {
  return (
    <JuegoDecide titulo="La regla del 10 %" pregunta="¿Cuánta energía llega?" instrucciones="Al pasar de un nivel al siguiente llega cerca del 10 %." clave="cien:piramide-mejor"
      opciones={[o('1000', '1000', '🟧'), o('100', '100', '🟥'), o('10', '10', '🔴'), o('1', '1', '⚫')]}
      cartas={[
        c('🌿', 'Productores con 10 000 → herbívoros', '1000', 'El 10 % de 10 000.'),
        c('🦫', 'Herbívoros con 1000 → carnívoros', '100', 'El 10 % de 1000.'),
        c('🐆', 'Carnívoros con 100 → superdepredadores', '10', 'El 10 % de 100.'),
        c('🦅', 'Un nivel con 10 → el siguiente', '1', 'Casi nada: por eso las cadenas son cortas.'),
      ]}
      cierre="Cada nivel recibe cerca del 10 % del anterior." />
  )
}
