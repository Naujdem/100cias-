import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de geometría molecular y fuerzas intermoleculares (Química área 2, tema 7).

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function IntraInterJuego() {
  return (
    <JuegoDecide titulo="¿Qué se rompe?" pregunta="¿Se rompen enlaces o fuerzas entre moléculas?" instrucciones="Cambios de estado: fuerzas intermoleculares. Reacciones químicas: enlaces." clave="cien:intra-inter-mejor"
      opciones={[o('inter', 'Fuerzas entre moléculas', '↔️'), o('intra', 'Enlaces (reacción)', '💥')]}
      cartas={[
        c('♨️', 'El agua hierve en la olla', 'inter', 'El vapor sigue siendo H₂O.'),
        c('🔥', 'La leña se quema', 'intra', 'Se forman CO₂ y agua: es una reacción.'),
        c('🧊', 'El hielo se derrite', 'inter', 'Solo se separan un poco las moléculas.'),
        c('⚡', 'La electrólisis separa el agua en H₂ y O₂', 'intra', 'Se rompen los enlaces O–H.'),
        c('🧴', 'El alcohol se evapora de la mano', 'inter', 'Cambio de estado.'),
        c('🍳', 'Un huevo se cocina', 'intra', 'Las proteínas cambian químicamente.'),
      ]}
      cierre="Los enlaces son mucho más fuertes que las fuerzas intermoleculares." />
  )
}

export function GeometriaJuego() {
  return (
    <JuegoDecide titulo="¿Qué forma tiene?" pregunta="¿Cuál es su geometría?" instrucciones="Cuenta los átomos unidos al central y sus pares libres." clave="cien:geometria-mejor"
      opciones={[o('lin', 'Lineal', '➖'), o('ang', 'Angular', '📐'), o('pir', 'Piramidal', '🔺'), o('tet', 'Tetraédrica', '🔷')]}
      cartas={[
        c('💧', 'H₂O: 2 enlaces y 2 pares libres', 'ang', 'Los pares libres la doblan: ≈ 104,5°.'),
        c('🫁', 'CO₂: 2 dobles enlaces y ningún par libre', 'lin', 'Los dos O a 180°.'),
        c('🔥', 'CH₄: 4 enlaces', 'tet', '109,5° entre cada par de enlaces.'),
        c('🌱', 'NH₃: 3 enlaces y 1 par libre', 'pir', 'El par libre queda arriba.'),
        c('🧪', 'CCl₄: 4 enlaces', 'tet', 'Como el metano.'),
        c('🌋', 'SO₂: 2 enlaces y 1 par libre', 'ang', 'Angular, cerca de 119°.'),
      ]}
      cierre="Los pares de electrones se repelen y se alejan lo más posible." />
  )
}

export function MoleculaPolarJuego() {
  return (
    <JuegoDecide titulo="¿Molécula polar?" pregunta="¿La molécula completa es polar o apolar?" instrucciones="Mira los enlaces y la forma: si es simétrica, las polaridades se anulan." clave="cien:molecula-polar-mejor"
      opciones={[o('p', 'Polar', '🧲'), o('a', 'Apolar', '⚖️')]}
      cartas={[
        c('💧', 'H₂O (angular)', 'p', 'Las polaridades se suman hacia el oxígeno.'),
        c('🫁', 'CO₂ (lineal)', 'a', 'Se anulan por simetría.'),
        c('🔥', 'CH₄ (tetraédrica)', 'a', 'Simétrica y con enlaces casi apolares.'),
        c('🌱', 'NH₃ (piramidal)', 'p', 'El par libre la hace asimétrica.'),
        c('🧪', 'HCl', 'p', 'Un solo enlace polar.'),
        c('🌬️', 'O₂', 'a', 'Dos átomos iguales.'),
      ]}
      cierre="Polaridad de la molécula = enlaces polares + forma no simétrica." />
  )
}

export function FuerzaJuego() {
  return (
    <JuegoDecide titulo="¿Qué fuerza domina?" pregunta="¿Cuál es la fuerza más importante entre sus moléculas?" instrucciones="Apolar: London. Polar: dipolo-dipolo. H unido a O, N o F: puentes de hidrógeno." clave="cien:fuerza-mejor"
      opciones={[o('l', 'London', '☁️'), o('d', 'Dipolo-dipolo', '🧲'), o('h', 'Puentes de H', '🌉')]}
      cartas={[
        c('💧', 'Agua (H₂O)', 'h', 'H unido a O.'),
        c('⛽', 'Gasolina (hidrocarburos)', 'l', 'Moléculas apolares.'),
        c('🧪', 'Cloruro de hidrógeno (HCl)', 'd', 'Polar, pero el H está unido a Cl, no a O, N o F.'),
        c('🌱', 'Amoníaco (NH₃)', 'h', 'H unido a N.'),
        c('🔥', 'Metano (CH₄)', 'l', 'Apolar.'),
        c('🍷', 'Alcohol etílico', 'h', 'Tiene un grupo O–H.'),
      ]}
      cierre="Puentes de H > dipolo-dipolo > London (para moléculas de tamaño parecido)." />
  )
}

export function DisuelveJuego() {
  return (
    <JuegoDecide titulo="¿Se disuelve en agua?" pregunta="¿Se disuelve bien en agua?" instrucciones="Semejante disuelve a semejante: el agua es polar." clave="cien:disuelve-mejor"
      opciones={[o('si', 'Sí se disuelve', '✅'), o('no', 'No se disuelve', '❌')]}
      cartas={[
        c('🧂', 'Sal de cocina', 'si', 'Iónica: el agua rodea a los iones.'),
        c('🫒', 'Aceite de cocina', 'no', 'Apolar: forma una capa aparte.'),
        c('🍬', 'Azúcar', 'si', 'Tiene muchos grupos O–H que forman puentes de H.'),
        c('⛽', 'Gasolina', 'no', 'Apolar.'),
        c('🍷', 'Alcohol', 'si', 'Polar, con O–H.'),
        c('🕯️', 'Parafina de vela', 'no', 'Apolar: por eso se quita con aceite, no con agua.'),
      ]}
      cierre="Lo polar disuelve lo polar (y lo iónico); lo apolar disuelve lo apolar." />
  )
}
