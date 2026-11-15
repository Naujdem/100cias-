import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del tema Herencia mendeliana (área 2). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string, pista?: string): CartaDecide => ({ icono, nombre, correcta, explica, pista })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function MetodoMendelJuego() {
  return (
    <JuegoDecide
      titulo="¿Cierto o falso? El método de Mendel"
      pregunta="¿Es cierto?"
      instrucciones="Mendel tuvo éxito por cómo trabajó. Decide si cada idea es cierta."
      clave="cien:metodo-mendel-mejor"
      opciones={[o('v', 'Cierto', '✅'), o('f', 'Falso', '❌')]}
      cartas={[
        c('🌱', 'Las arvejas crecen rápido y dan muchas semillas', 'v', 'Muchos datos en pocas temporadas.'),
        c('🖌️', 'Podía cruzarlas a mano con un pincel', 'v', 'Quitaba los estambres y llevaba el polen que él escogía.'),
        c('🎨', 'Estudió caracteres con dos formas fáciles de distinguir', 'v', 'Amarilla o verde, lisa o rugosa: sin puntos medios.'),
        c('🧬', 'Ya sabía que los genes están en el ADN', 'f', 'El ADN como material hereditario se conoció casi cien años después.'),
        c('🔢', 'Contó miles de plantas y semillas', 'v', 'Con números grandes aparecieron las proporciones.'),
        c('🎲', 'Mezcló al azar plantas de cualquier tipo', 'f', 'Empezó con líneas puras, que siempre daban lo mismo.'),
        c('🔬', 'Vio los genes con el microscopio', 'f', 'Los dedujo de los números: nunca los vio.'),
        c('📄', 'Su trabajo fue famoso desde que lo publicó', 'f', 'Lo publicó en 1866 y casi nadie lo entendió hasta 1900.'),
      ]}
      cierre="Líneas puras, cruces controlados y muchos números: así descubrió Mendel las reglas de la herencia."
    />
  )
}

export function DominanteJuego() {
  return (
    <JuegoDecide
      titulo="¿Dominante o recesivo?"
      pregunta="En las arvejas de Mendel, ¿esta forma es dominante o recesiva?"
      instrucciones="En la F1 solo aparece la forma dominante. Decide para cada una."
      clave="cien:dominante-mejor"
      opciones={[o('dom', 'Dominante', '💪'), o('rec', 'Recesivo', '🙈')]}
      cartas={[
        c('🟡', 'Semilla amarilla', 'dom', 'Amarilla × verde: toda la F1 sale amarilla.'),
        c('🟢', 'Semilla verde', 'rec', 'Desaparece en la F1 y vuelve en la F2.'),
        c('⚪', 'Semilla lisa', 'dom', 'Lisa domina sobre rugosa.'),
        c('🥜', 'Semilla rugosa', 'rec', 'Solo aparece si hay dos alelos recesivos.'),
        c('🟣', 'Flor púrpura', 'dom', 'Púrpura domina sobre blanca.'),
        c('🤍', 'Flor blanca', 'rec', 'Necesita los dos alelos recesivos.'),
        c('📏', 'Tallo alto', 'dom', 'Alto domina sobre enano.'),
        c('🌱', 'Tallo enano', 'rec', 'Reaparece en la cuarta parte de la F2.'),
        c('🫛', 'Vaina inflada', 'dom', 'Inflada domina sobre estrangulada.'),
      ]}
      cierre="El dominante se ve con un solo alelo; el recesivo solo se ve cuando están los dos."
    />
  )
}

export function GenotipoJuego() {
  return (
    <JuegoDecide
      titulo="¿Qué genotipo es?"
      pregunta="¿Homocigoto o heterocigoto?"
      instrucciones="A = amarilla (dominante), a = verde (recesivo). Clasifica cada caso."
      clave="cien:genotipo-mejor"
      opciones={[o('AA', 'Homocigoto dominante', '🟡🟡'), o('Aa', 'Heterocigoto', '🟡🟢'), o('aa', 'Homocigoto recesivo', '🟢🟢')]}
      cartas={[
        c('🔤', 'AA', 'AA', 'Dos alelos iguales y dominantes.'),
        c('🔤', 'Aa', 'Aa', 'Dos alelos distintos.'),
        c('🔤', 'aa', 'aa', 'Dos alelos iguales y recesivos.'),
        c('🟢', 'Una semilla verde', 'aa', 'Si se ve el recesivo, tiene que tener los dos.', 'El recesivo solo se ve si está doble.'),
        c('🌼', 'Una planta de la F1 de Mendel', 'Aa', 'Recibió A de la planta amarilla pura y a de la verde.'),
        c('🏆', 'Una línea pura amarilla', 'AA', 'Pura: siempre da hijos amarillos.'),
        c('🔍', 'Amarilla, pero tuvo hijos verdes', 'Aa', 'Escondía un alelo a.'),
        c('🟡', 'Sus dos alelos son de semilla amarilla', 'AA', 'Homo = igual.'),
      ]}
      cierre="Homocigoto: dos alelos iguales. Heterocigoto: dos alelos distintos."
    />
  )
}

export function ProporcionJuego() {
  return (
    <JuegoDecide
      titulo="¿Qué proporción sale?"
      pregunta="En la descendencia, ¿qué proporción de fenotipos se espera?"
      instrucciones="A amarilla, a verde. Piensa en el cuadro de Punnett de cada cruce."
      clave="cien:proporcion-mejor"
      opciones={[o('todos', 'Todas amarillas', '🟡'), o('31', '3 : 1', '3️⃣'), o('11', '1 : 1', '⚖️'), o('verdes', 'Todas verdes', '🟢')]}
      cartas={[
        c('✖️', 'AA × aa', 'todos', 'Todos reciben un A: todos Aa, amarillos.'),
        c('✖️', 'Aa × Aa', '31', '1 AA : 2 Aa : 1 aa → 3 amarillas : 1 verde.'),
        c('✖️', 'Aa × aa', '11', 'Mitad Aa (amarillas), mitad aa (verdes).'),
        c('✖️', 'aa × aa', 'verdes', 'Solo pueden dar alelos a.'),
        c('✖️', 'AA × Aa', 'todos', 'Todos reciben al menos un A.'),
        c('✖️', 'AA × AA', 'todos', 'Todos AA.'),
        c('🌼', 'Dos plantas de la F1 de Mendel', '31', 'Son Aa × Aa: la famosa F2.'),
        c('🔍', 'Híbrida × verde (cruce de prueba)', '11', 'Aa × aa: mitad y mitad.'),
      ]}
      cierre="Aa × Aa da 3 : 1; Aa × aa da 1 : 1; si un padre es AA, todos salen con el dominante."
    />
  )
}

export function PuroHibridoJuego() {
  return (
    <JuegoDecide
      titulo="¿Pura o híbrida?"
      pregunta="Cruzaste una planta amarilla con una verde (aa). ¿La amarilla era pura o híbrida?"
      instrucciones="Mira los hijos y descubre el genotipo escondido de la planta amarilla."
      clave="cien:puro-hibrido-mejor"
      opciones={[o('AA', 'Pura (AA)', '🏆'), o('Aa', 'Híbrida (Aa)', '🔀')]}
      cartas={[
        c('🟡', '40 hijos, todos amarillos', 'AA', 'Si tuviera un a, alguno habría salido verde.'),
        c('⚖️', '21 amarillos y 19 verdes', 'Aa', 'Casi mitad y mitad: 1 : 1.'),
        c('🟢', '30 amarillos y 1 verde', 'Aa', 'Basta una verde: tuvo que recibir un a de la amarilla.', 'Una sola verde ya dice algo.'),
        c('🟡', '100 hijos, ninguno verde', 'AA', 'Con tantos hijos, un híbrido habría dado verdes.'),
        c('⚖️', 'La mitad de los hijos salió verde', 'Aa', 'Aa × aa → 1 Aa : 1 aa.'),
        c('🟢', 'El primer hijo salió verde', 'Aa', 'Para ser verde necesita aa: un a vino de la amarilla.'),
        c('🟡', 'Todos los hijos son Aa', 'AA', 'Todos recibieron A de la amarilla.'),
      ]}
      cierre="En el cruce de prueba, una sola semilla verde delata a la planta híbrida."
    />
  )
}

export function GametosJuego() {
  return (
    <JuegoDecide
      titulo="¿Cuántos gametos distintos?"
      pregunta="¿Cuántos tipos de gametos puede formar esta planta?"
      instrucciones="Cada gameto lleva un alelo de cada gen. Cuenta las combinaciones posibles."
      clave="cien:gametos-mejor"
      opciones={[o('1', '1 tipo', '1️⃣'), o('2', '2 tipos', '2️⃣'), o('4', '4 tipos', '4️⃣')]}
      cartas={[
        c('🔤', 'AABB', '1', 'Solo AB.'),
        c('🔤', 'aabb', '1', 'Solo ab.'),
        c('🔤', 'AaBB', '2', 'AB y aB.'),
        c('🔤', 'AABb', '2', 'AB y Ab.'),
        c('🔤', 'AaBb', '4', 'AB, Ab, aB y ab: los genes se reparten por separado.'),
        c('🔤', 'aaBb', '2', 'aB y ab.'),
        c('🔤', 'Aabb', '2', 'Ab y ab.'),
        c('🔤', 'AAbb', '1', 'Solo Ab.'),
      ]}
      cierre="Por cada gen heterocigoto se duplican los tipos de gametos: AaBb da 4."
    />
  )
}

export function ProbabilidadJuego() {
  return (
    <JuegoDecide
      titulo="¿Qué probabilidad?"
      pregunta="¿Cuál es la probabilidad?"
      instrucciones="Usa el cuadro de Punnett o multiplica probabilidades. A amarilla, a verde; B lisa, b rugosa."
      clave="cien:probabilidad-mejor"
      tiempo={15}
      opciones={[o('14', '1/4', '¼'), o('12', '1/2', '½'), o('34', '3/4', '¾'), o('116', '1/16', '🔢')]}
      cartas={[
        c('✖️', 'Aa × Aa: que un hijo sea aa', '14', 'Una casilla de cuatro.'),
        c('✖️', 'Aa × Aa: que un hijo sea amarillo', '34', 'AA, Aa y Aa: tres de cuatro.'),
        c('✖️', 'Aa × aa: que un hijo sea verde', '12', 'Dos casillas de cuatro.'),
        c('✖️', 'Aa × Aa: que un hijo sea Aa', '12', 'Dos casillas de cuatro.'),
        c('✖️', 'AaBb × AaBb: que un hijo sea aabb', '116', '1/4 × 1/4 = 1/16.'),
        c('🪙', 'Lanzar dos monedas y que salgan dos caras', '14', '1/2 × 1/2 = 1/4: la misma cuenta que dos gametos a.'),
        c('✖️', 'AaBb × AaBb: que un hijo sea verde', '14', 'Solo cuenta el color: Aa × Aa → 1/4 aa.'),
        c('✖️', 'Aa × aa: que un hijo sea Aa', '12', 'Mitad Aa, mitad aa.'),
      ]}
      cierre="Para dos genes independientes se multiplican las probabilidades: 1/4 × 1/4 = 1/16."
    />
  )
}
