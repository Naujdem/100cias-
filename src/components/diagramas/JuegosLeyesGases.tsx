import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de las leyes de los gases (Química área 4, tema 2). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })
const SUBE = [o('sube', 'Sube', '⬆️'), o('baja', 'Baja', '⬇️')]

export function BoyleJuego() {
  return (
    <JuegoDecide titulo="Aprieta o suelta" pregunta="¿Qué le pasa a la presión del gas?" instrucciones="A temperatura constante: menos volumen → más presión." clave="cien:boyle-mejor"
      opciones={SUBE}
      cartas={[
        c('💉', 'Empujo el émbolo de la jeringa tapada', 'sube', 'El aire queda en menos espacio.'),
        c('🎈', 'Aprieto un globo con las manos', 'sube', 'Por eso puede reventar.'),
        c('🤿', 'Una burbuja sube desde el fondo del río', 'baja', 'Arriba la empujan menos y se agranda.'),
        c('💉', 'Halo el émbolo de la jeringa tapada', 'baja', 'Más espacio, menos choques contra las paredes.'),
        c('🫁', 'Mis pulmones se expanden al inhalar', 'baja', 'Por eso entra el aire: adentro queda menos presión.'),
        c('🚲', 'Bajo el émbolo de la bomba de la bicicleta', 'sube', 'Por eso el aire entra a la llanta.'),
      ]}
      cierre="Boyle: P × V = constante. Si uno sube, el otro baja." />
  )
}

export function CharlesJuego() {
  return (
    <JuegoDecide titulo="Frío o calor" pregunta="¿Qué le pasa al volumen del gas?" instrucciones="A presión constante: más temperatura → más volumen." clave="cien:charles-mejor"
      opciones={[o('sube', 'Crece', '⬆️'), o('baja', 'Se encoge', '⬇️')]}
      cartas={[
        c('🎈', 'Meto un globo inflado en el congelador', 'baja', 'Las partículas van más despacio.'),
        c('☀️', 'Dejo el balón de fútbol al sol', 'sube', 'El aire se calienta y se expande.'),
        c('🎆', 'Encienden el mechero de un globo aerostático', 'sube', 'El aire caliente se expande y queda menos denso.'),
        c('🍞', 'El pan en el horno', 'sube', 'Las burbujas de gas de la masa se agrandan.'),
        c('🌙', 'Un globo que quedó afuera en la noche fría', 'baja', 'Amanece arrugado.'),
        c('🥤', 'Botella plástica vacía y tapada en agua con hielo', 'baja', 'Se arruga.'),
      ]}
      cierre="Charles: V / T = constante (en kelvin)." />
  )
}

export function GayLussacJuego() {
  return (
    <JuegoDecide titulo="Encerrado y caliente" pregunta="¿Qué le pasa a la presión?" instrucciones="A volumen constante: más temperatura → más presión." clave="cien:gay-lussac-mejor"
      opciones={SUBE}
      cartas={[
        c('🍲', 'La olla a presión en el fogón', 'sube', 'Por eso tiene válvula de seguridad.'),
        c('🧴', 'Un aerosol olvidado cerca del fuego', 'sube', 'Puede explotar: nunca se calienta un aerosol.'),
        c('🚗', 'La llanta en la mañana fría', 'baja', 'Por eso se mide la presión en frío.'),
        c('🫙', 'Un frasco de vidrio cerrado que se enfría', 'baja', 'Después cuesta abrirlo: afuera empuja más.'),
        c('🛢️', 'Un cilindro de gas al sol', 'sube', 'Los cilindros se guardan a la sombra.'),
        c('🌽', 'El maíz pira en la olla', 'sube', 'El vapor de adentro del grano aumenta su presión hasta que revienta.'),
      ]}
      cierre="Gay-Lussac: P / T = constante (en kelvin)." />
  )
}

export function CualLeyGasJuego() {
  return (
    <JuegoDecide titulo="¿Qué ley es?" pregunta="¿Qué ley explica lo que pasa?" instrucciones="Mira qué se queda fijo: T fija → Boyle. P fija → Charles. V fijo → Gay-Lussac." clave="cien:cual-ley-gas-mejor" tiempo={12}
      opciones={[o('b', 'Boyle', '💉'), o('c', 'Charles', '🎈'), o('g', 'Gay-Lussac', '🍲')]}
      cartas={[
        c('💉', 'Aprieto una jeringa tapada', 'b', 'Cambian P y V; T no.'),
        c('🎈', 'Un globo se infla más al sol', 'c', 'Cambian V y T; P casi no.'),
        c('🍲', 'La olla a presión se calienta', 'g', 'El volumen no cambia.'),
        c('🤿', 'Las burbujas del buzo crecen al subir', 'b', 'Baja la presión y crece el volumen.'),
        c('🧴', 'Un aerosol calentado puede explotar', 'g', 'Lata rígida: V constante.'),
        c('🍞', 'La masa del pan crece en el horno', 'c', 'Las burbujas se expanden.'),
        c('🚲', 'Inflo la llanta con la bomba', 'b', 'Comprimo el aire.'),
        c('🚗', 'Las llantas tienen más presión al mediodía', 'g', 'El volumen de la llanta casi no cambia.'),
      ]}
      cierre="Las tres son casos de la ley combinada: P·V / T = constante." />
  )
}

export function AvogadroJuego() {
  return (
    <JuegoDecide titulo="Contar con globos" pregunta="¿Qué pasa con el volumen?" instrucciones="A P y T constantes, el volumen depende solo de cuántas partículas haya." clave="cien:avogadro-mejor"
      opciones={[o('mas', 'Más volumen', '⬆️'), o('menos', 'Menos volumen', '⬇️'), o('igual', 'El mismo', '⚖️')]}
      cartas={[
        c('🎈', 'Le soplo más aire al globo', 'mas', 'Más moles, más volumen.'),
        c('🎈', 'Dejo salir aire del globo', 'menos', 'Menos partículas.'),
        c('⚖️', '1 mol de helio comparado con 1 mol de oxígeno (misma P y T)', 'igual', 'No importa qué gas sea.'),
        c('🧪', '2 mol de CO₂ comparado con 1 mol de CO₂', 'mas', 'El doble de volumen.'),
        c('🎈', 'Un globo de hidrógeno y uno de aire, con el mismo número de moléculas', 'igual', 'Mismo número de partículas, mismo volumen.'),
        c('🫁', 'Exhalo todo el aire', 'menos', 'Salen moléculas de los pulmones.'),
      ]}
      cierre="Avogadro: volúmenes iguales de gases, a la misma P y T, tienen el mismo número de partículas." />
  )
}

export function GasIdealJuego() {
  return (
    <JuegoDecide titulo="Gas ideal, Dalton y Graham" pregunta="¿Qué se usa?" instrucciones="PV = nRT: calcular una variable. Dalton: mezclas de gases. Graham: qué gas se mueve más rápido." clave="cien:gas-ideal-mejor" tiempo={14}
      opciones={[o('pv', 'PV = nRT', '🧮'), o('d', 'Dalton', '➕'), o('g', 'Graham', '🏃')]}
      cartas={[
        c('🛢️', '¿Cuántos moles de propano hay en un tanque de 20 L a 3 atm y 300 K?', 'pv', 'n = PV / RT ≈ 2,4 mol.'),
        c('🏔️', '¿Cuánta presión hace el oxígeno del aire en el páramo?', 'd', 'Presión total × fracción de oxígeno.'),
        c('👃', '¿Se huele antes el amoníaco o el ácido clorhídrico?', 'g', 'El NH₃ es más liviano: llega antes.'),
        c('🤿', 'El tanque del buzo lleva oxígeno mezclado con helio', 'd', 'Cada gas aporta su presión parcial.'),
        c('🎈', '¿Por qué un globo de helio se desinfla más rápido que uno de aire?', 'g', 'El helio es muy liviano y escapa más rápido por los poros.'),
        c('🧪', '¿Qué volumen ocupan 2 mol de gas a 1 atm y 273 K?', 'pv', 'V = nRT / P ≈ 44,8 L.'),
      ]}
      cierre="R = 0,082 atm·L / (mol·K). La temperatura siempre en kelvin." />
  )
}
