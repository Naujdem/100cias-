import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de «El átomo por dentro» (Química área 2, tema 2). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })
const VF = [o('v', 'Cierto', '✅'), o('f', 'Falso', '❌')]

export function ParticulasJuego() {
  return (
    <JuegoDecide titulo="Partículas del átomo" pregunta="¿Es cierto?" instrucciones="Decide si cada frase sobre las partículas del átomo es cierta o falsa." clave="cien:particulas-mejor" opciones={VF}
      cartas={[
        c('⚖️', 'Casi toda la masa del átomo está en el núcleo', 'v', 'Protones y neutrones pesan unas 1800 veces más que un electrón.'),
        c('🔵', 'Los electrones están dentro del núcleo', 'f', 'Están alrededor del núcleo.'),
        c('🟰', 'Un átomo neutro tiene tantos electrones como protones', 'v', 'Las cargas + y − se compensan.'),
        c('⚪', 'El neutrón tiene carga negativa', 'f', 'No tiene carga: es neutro.'),
        c('🔴', 'Protón y neutrón tienen casi la misma masa', 'v', 'Por eso cada uno cuenta 1 en el número de masa.'),
      ]}
      cierre="Núcleo pesado (protones y neutrones) y electrones livianos alrededor." />
  )
}

export function NumeroAtomicoJuego() {
  return (
    <JuegoDecide titulo="¿Qué elemento es?" pregunta="¿Qué elemento tiene estos datos?" instrucciones="Mira los protones (o calcúlalos) y decide qué elemento es. H: Z = 1 · C: Z = 6 · O: Z = 8." clave="cien:z-mejor"
      opciones={[o('h', 'Hidrógeno', 'H'), o('c', 'Carbono', 'C'), o('o', 'Oxígeno', 'O')]}
      cartas={[
        c('🔴', '6 protones y 8 neutrones', 'c', 'Z = 6 es carbono, tenga los neutrones que tenga.'),
        c('🔢', 'Z = 8', 'o', 'El número atómico 8 es el oxígeno.'),
        c('➗', 'A = 16 y tiene 8 neutrones', 'o', 'Protones = A − neutrones = 16 − 8 = 8.'),
        c('💧', '1 protón y ningún neutrón', 'h', 'El hidrógeno más común.'),
        c('➗', 'A = 12 y tiene 6 neutrones', 'c', 'Protones = 12 − 6 = 6.'),
        c('⚡', '8 protones y 10 electrones', 'o', 'Es un ion O²⁻, pero sigue siendo oxígeno.'),
      ]}
      cierre="El número de protones (Z) decide el elemento; los neutrones y los electrones pueden variar." />
  )
}

export function IonJuego() {
  return (
    <JuegoDecide titulo="¿Catión, anión o neutro?" pregunta="¿Qué es?" instrucciones="Compara protones y electrones y decide qué tipo de partícula es." clave="cien:ion-mejor"
      opciones={[o('cat', 'Catión (+)', '➕'), o('an', 'Anión (−)', '➖'), o('neu', 'Neutro', '⚪')]}
      cartas={[
        c('🧂', 'Sodio: 11 protones y 10 electrones', 'cat', 'Perdió un electrón: Na⁺.'),
        c('🧂', 'Cloro: 17 protones y 18 electrones', 'an', 'Ganó un electrón: Cl⁻.'),
        c('💨', 'Oxígeno: 8 protones y 8 electrones', 'neu', 'Las cargas se compensan.'),
        c('🦴', 'Calcio: 20 protones y 18 electrones', 'cat', 'Perdió dos electrones: Ca²⁺, el de los huesos.'),
        c('🪨', 'Azufre: 16 protones y 18 electrones', 'an', 'Ganó dos electrones: S²⁻.'),
        c('🔋', 'Litio: 3 protones y 2 electrones', 'cat', 'Li⁺, el de las baterías.'),
      ]}
      cierre="Más protones que electrones: catión (+). Más electrones: anión (−)." />
  )
}

export function IsotopoJuego() {
  return (
    <JuegoDecide titulo="¿Isótopos o no?" pregunta="¿Son isótopos del mismo elemento?" instrucciones="Dos átomos son isótopos si tienen los mismos protones y distintos neutrones." clave="cien:isotopo-mejor"
      opciones={[o('si', 'Son isótopos', '👯'), o('no', 'No lo son', '🙅')]}
      cartas={[
        c('🌿', 'Carbono-12 y carbono-14', 'si', 'Ambos tienen 6 protones; 6 y 8 neutrones.'),
        c('🔀', 'Un átomo con 6 protones y otro con 7 protones', 'no', 'Son elementos distintos: carbono y nitrógeno.'),
        c('💧', 'Hidrógeno-1 y hidrógeno-2 (deuterio)', 'si', '1 protón cada uno; 0 y 1 neutrón.'),
        c('🧲', 'Na y Na⁺', 'no', 'Mismo núcleo; solo cambian los electrones: es un ion.'),
        c('🧂', 'Cloro-35 y cloro-37', 'si', '17 protones; 18 y 20 neutrones.'),
        c('⚖️', 'Argón-40 y calcio-40', 'no', 'Misma masa, pero distinto número de protones (18 y 20).'),
      ]}
      cierre="Isótopos: mismo Z, distinto A. Iones: mismo núcleo, distintos electrones." />
  )
}
