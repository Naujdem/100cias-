import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de «Los electrones en el átomo» (Química área 2, tema 3). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })
const BM = [o('b', 'Bien', '✅'), o('m', 'Mal', '❌')]

export function CapasElectronesJuego() {
  return (
    <JuegoDecide titulo="¿Bien repartidos?" pregunta="¿Está bien la distribución por niveles?" instrucciones="Recuerda: nivel 1 hasta 2, nivel 2 hasta 8, nivel 3 hasta 8 (en los primeros 20 elementos)." clave="cien:capas-e-mejor" opciones={BM}
      cartas={[
        c('🧂', 'Sodio (11): 2 · 8 · 1', 'b', 'Dos, luego ocho, y el que sobra en el tercer nivel.'),
        c('💨', 'Oxígeno (8): 2 · 6', 'b', 'El segundo nivel tiene 6 de 8 posibles.'),
        c('🔥', 'Carbono (6): 3 · 3', 'm', 'El primer nivel solo admite 2: 2 · 4.'),
        c('🧪', 'Cloro (17): 2 · 8 · 7', 'b', '7 en la última capa.'),
        c('🎈', 'Helio (2): 1 · 1', 'm', 'Los dos caben en el primer nivel: 2.'),
        c('🦴', 'Calcio (20): 2 · 8 · 10', 'm', 'Es 2 · 8 · 8 · 2: el cuarto nivel empieza antes de que el tercero pase de 8.'),
      ]}
      cierre="Los niveles se llenan de adentro hacia afuera, respetando el cupo de cada uno." />
  )
}

export function MoellerJuego() {
  return (
    <JuegoDecide titulo="¿Cuál se llena primero?" pregunta="¿Qué subnivel se llena antes?" instrucciones="Usa el diagrama de Moeller: sigue las flechas diagonales." clave="cien:moeller-mejor"
      opciones={[o('a', 'El de la izquierda', '⬅️'), o('b', 'El de la derecha', '➡️')]}
      cartas={[
        c('🔢', '4s  o  3d', 'a', 'El 4s va antes que el 3d.'),
        c('🔢', '2p  o  2s', 'b', 'Dentro de un nivel: s antes que p.'),
        c('🔢', '3p  o  4s', 'a', '3p, luego 4s.'),
        c('🔢', '5s  o  4d', 'a', 'Igual que 4s antes que 3d.'),
        c('🔢', '4p  o  3d', 'b', 'Orden: 4s, 3d, 4p.'),
        c('🔢', '4f  o  6s', 'b', 'El 6s se llena antes que el 4f.'),
      ]}
      cierre="Orden: 1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f…" />
  )
}

export function HundJuego() {
  return (
    <JuegoDecide titulo="¿Cumple las reglas?" pregunta="¿Está bien llenado el subnivel?" instrucciones="↑↓ = dos electrones en una caja. [ ] = caja vacía. Revisa Pauli y Hund." clave="cien:hund-mejor" opciones={BM}
      cartas={[
        c('📦', 'Nitrógeno 2p³: [↑] [↑] [↑]', 'b', 'Uno en cada caja, mismo giro: Hund.'),
        c('📦', 'Nitrógeno 2p³: [↑↓] [↑] [ ]', 'm', 'Se apareó antes de llenar todas las cajas.'),
        c('📦', 'Helio 1s²: [↑↓]', 'b', 'Dos electrones con giros opuestos: Pauli.'),
        c('📦', 'Helio 1s²: [↑↑]', 'm', 'En un orbital los giros deben ser opuestos.'),
        c('📦', 'Oxígeno 2p⁴: [↑↓] [↑] [↑]', 'b', 'Tres solos y luego se aparea el cuarto.'),
        c('📦', 'Carbono 2p²: [↑] [↓] [ ]', 'm', 'Los desapareados van con el mismo giro: [↑] [↑] [ ].'),
      ]}
      cierre="Pauli: máximo dos por caja, con giros opuestos. Hund: primero uno en cada caja." />
  )
}

export function CuanticosJuego() {
  return (
    <JuegoDecide titulo="¿Es posible?" pregunta="¿Existe esta combinación?" instrucciones="ℓ va de 0 a n − 1; mℓ va de −ℓ a +ℓ; s es +½ o −½." clave="cien:cuanticos-mejor"
      opciones={[o('si', 'Es posible', '✅'), o('no', 'Imposible', '🚫')]}
      cartas={[
        c('🔢', 'n = 1, ℓ = 0, mℓ = 0, s = +½', 'si', 'El electrón del hidrógeno (1s).'),
        c('🔢', 'n = 1, ℓ = 1', 'no', 'Con n = 1, ℓ solo puede ser 0: no hay 1p.'),
        c('🔢', 'n = 3, ℓ = 2, mℓ = −2', 'si', 'Un orbital 3d.'),
        c('🔢', 'n = 2, ℓ = 1, mℓ = 2', 'no', 'Con ℓ = 1, mℓ solo va de −1 a +1.'),
        c('🔢', 'n = 2, ℓ = 0, s = 0', 'no', 'El espín solo puede ser +½ o −½.'),
        c('🔢', 'n = 4, ℓ = 3, mℓ = 0', 'si', 'Un orbital 4f.'),
      ]}
      cierre="Cada electrón tiene su propia «dirección»: no hay dos con los mismos cuatro números (Pauli)." />
  )
}
