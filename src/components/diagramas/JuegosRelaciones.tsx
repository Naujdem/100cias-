import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del área 3, tema 4 (Relaciones entre seres vivos). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function IntraJuego() {
  return (
    <JuegoDecide titulo="¿Qué tipo de grupo?" pregunta="¿Qué relación es?" instrucciones="Relaciones entre individuos de la misma especie." clave="cien:intra-mejor"
      opciones={[o('man', 'Manada o bandada', '🦫'), o('col', 'Colonia', '🪸'), o('soc', 'Sociedad', '🐝'), o('com', 'Competencia', '⚡')]}
      cartas={[
        c('🦜', 'Loros que vuelan juntos para protegerse', 'man', 'Una bandada.'),
        c('🪸', 'Corales unidos que forman un arrecife', 'col', 'Los pólipos viven pegados.'),
        c('🐜', 'Hormigas arrieras con obreras, soldados y reina', 'soc', 'Se reparten el trabajo.'),
        c('🦌', 'Dos venados machos que pelean por el territorio', 'com', 'Compiten por un recurso.'),
        c('🐟', 'Un cardumen de peces que nada junto', 'man', 'Juntos confunden a los depredadores.'),
        c('🌳', 'Árboles de la misma especie que compiten por la luz', 'com', 'También las plantas compiten.'),
      ]}
      cierre="Juntarse protege y ayuda; competir también es una relación." />
  )
}

export function DepredacionJuego() {
  return (
    <JuegoDecide titulo="¿Depredación o competencia?" pregunta="¿Qué relación es?" instrucciones="Las dos son entre especies distintas." clave="cien:depredacion-mejor"
      opciones={[o('dep', 'Depredación (+/−)', '🐆'), o('com', 'Competencia (−/−)', '⚡')]}
      cartas={[
        c('🐆', 'Un jaguar caza un chigüiro', 'dep', 'Uno se come al otro.'),
        c('🦉', 'Una lechuza y un gavilán cazan los mismos ratones', 'com', 'Se quitan alimento.'),
        c('🐸', 'Una rana atrapa un insecto', 'dep', 'Depredación.'),
        c('🌿', 'Una maleza y el maíz se disputan el agua del suelo', 'com', 'Compiten por un recurso.'),
        c('🐍', 'Una boa se come una rata', 'dep', 'Depredación.'),
      ]}
      cierre="En la depredación uno gana y el otro pierde; en la competencia pierden los dos." />
  )
}

export function SimbiosisJuego() {
  return (
    <JuegoDecide titulo="¿Qué relación es?" pregunta="¿Qué tipo de relación es?" instrucciones="Piensa quién gana, quién pierde y a quién no le afecta." clave="cien:simbiosis-mejor"
      opciones={[o('mut', 'Mutualismo (+/+)', '🤝'), o('com', 'Comensalismo (+/0)', '😐'), o('par', 'Parasitismo (+/−)', '🪲')]}
      cartas={[
        c('🐦', 'El colibrí toma néctar y poliniza la flor', 'mut', 'Ganan los dos.'),
        c('🌸', 'Una orquídea crece sobre un árbol sin quitarle nada', 'com', 'Al árbol no le afecta.'),
        c('🪲', 'La garrapata chupa sangre al perro', 'par', 'Una gana y el otro pierde, pero no lo mata de inmediato.'),
        c('🐄', 'Las bacterias del estómago de la vaca digieren el pasto', 'mut', 'La vaca digiere y las bacterias tienen alimento.'),
        c('🕊️', 'La garza sigue al ganado para comer los insectos que espanta', 'com', 'Al ganado no le afecta.'),
        c('🪱', 'Una lombriz intestinal vive dentro de una persona', 'par', 'Le quita nutrientes.'),
        c('🍄', 'Un liquen: un hongo y un alga viven juntos', 'mut', 'El alga da alimento; el hongo, agua y protección.'),
      ]}
      cierre="Mutualismo +/+, comensalismo +/0 y parasitismo +/−." />
  )
}
