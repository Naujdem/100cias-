import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de la nomenclatura de óxidos e hidróxidos (Química área 3, tema 2). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function FuncionesJuego() {
  return (
    <JuegoDecide titulo="¿Qué función es?" pregunta="¿Qué tipo de compuesto es?" instrucciones="Metal + O: óxido básico. No metal + O: óxido ácido. Metal + OH: hidróxido." clave="cien:funciones-mejor"
      opciones={[o('basico', 'Óxido básico', '🟤'), o('acido', 'Óxido ácido', '💨'), o('hidroxido', 'Hidróxido', '🧼')]}
      cartas={[
        c('🌾', 'CaO', 'basico', 'Calcio (metal) + oxígeno: cal viva.'),
        c('🔥', 'CO₂', 'acido', 'Carbono (no metal) + oxígeno.'),
        c('🧼', 'NaOH', 'hidroxido', 'Sodio con el grupo OH.'),
        c('🔩', 'Fe₂O₃', 'basico', 'Hierro (metal) + oxígeno.'),
        c('🌋', 'SO₃', 'acido', 'Azufre (no metal) + oxígeno.'),
        c('🥛', 'Mg(OH)₂', 'hidroxido', 'Magnesio con dos OH.'),
        c('🧂', 'Na₂O', 'basico', 'Sodio (metal) + oxígeno.'),
        c('🚗', 'N₂O₅', 'acido', 'Nitrógeno (no metal) + oxígeno.'),
      ]}
      cierre="Mira el primer elemento: ¿metal o no metal? Y busca el OH." />
  )
}

export function FormulaOxidosJuego() {
  return (
    <JuegoDecide titulo="¿Cuántos oxígenos?" pregunta="¿Qué subíndice lleva el oxígeno?" instrucciones="Cruza los estados y simplifica." clave="cien:formula-oxidos-mejor" tiempo={12}
      opciones={[o('1', '1 (O)', '1️⃣'), o('2', '2 (O₂)', '2️⃣'), o('3', '3 (O₃)', '3️⃣')]}
      cartas={[
        c('🌾', 'Óxido de calcio (Ca +2)', '1', 'Ca₂O₂ → CaO.'),
        c('🧂', 'Óxido de sodio (Na +1)', '1', 'Na₂O.'),
        c('🥫', 'Óxido de aluminio (Al +3)', '3', 'Al₂O₃.'),
        c('🔥', 'Dióxido de carbono (C +4)', '2', 'C₂O₄ → CO₂.'),
        c('🌋', 'Óxido de azufre (VI)', '3', 'S₂O₆ → SO₃.'),
        c('🔩', 'Óxido de hierro (III)', '3', 'Fe₂O₃.'),
        c('🟠', 'Óxido de cobre (I)', '1', 'Cu₂O.'),
        c('🔋', 'Óxido de plomo (IV)', '2', 'Pb₂O₄ → PbO₂.'),
      ]}
      cierre="Cruzar, simplificar y comprobar que las cargas sumen cero." />
  )
}

export function SistemaNombreJuego() {
  return (
    <JuegoDecide titulo="¿Qué sistema es?" pregunta="¿En qué sistema está este nombre?" instrucciones="Prefijos: sistemático. Romanos: stock. -oso/-ico: tradicional." clave="cien:sistema-nombre-mejor"
      opciones={[o('sis', 'Sistemático', '🔢'), o('stock', 'Stock', '🏛️'), o('trad', 'Tradicional', '📜')]}
      cartas={[
        c('🔩', 'Óxido férrico', 'trad', '-ico: el estado mayor del hierro.'),
        c('🔩', 'Trióxido de dihierro', 'sis', 'Prefijos tri y di.'),
        c('🟠', 'Óxido de cobre (II)', 'stock', 'Número romano.'),
        c('🔥', 'Dióxido de carbono', 'sis', 'Prefijo di.'),
        c('🌋', 'Anhídrido sulfuroso', 'trad', 'Anhídrido y -oso.'),
        c('🔋', 'Óxido de plomo (IV)', 'stock', 'Número romano.'),
        c('🟤', 'Hidróxido ferroso', 'trad', '-oso: hierro +2.'),
        c('🚗', 'Pentóxido de dinitrógeno', 'sis', 'Prefijos penta y di.'),
      ]}
      cierre="Un compuesto, tres nombres: prefijos, romanos o terminaciones." />
  )
}

export function HidroxidosJuego() {
  return (
    <JuegoDecide titulo="Cuenta los OH" pregunta="¿Cuántos grupos OH lleva?" instrucciones="Tantos OH como el estado de oxidación del metal." clave="cien:hidroxidos-mejor" tiempo={12}
      opciones={[o('1', 'Uno', '1️⃣'), o('2', 'Dos', '2️⃣'), o('3', 'Tres', '3️⃣')]}
      cartas={[
        c('🧼', 'Hidróxido de sodio (soda cáustica)', '1', 'Na⁺: NaOH.'),
        c('🌾', 'Hidróxido de calcio (cal apagada)', '2', 'Ca²⁺: Ca(OH)₂.'),
        c('💊', 'Hidróxido de aluminio (antiácido)', '3', 'Al³⁺: Al(OH)₃.'),
        c('🟤', 'Hidróxido férrico', '3', 'Fe³⁺: Fe(OH)₃.'),
        c('🥛', 'Hidróxido de magnesio', '2', 'Mg²⁺: Mg(OH)₂.'),
        c('🧪', 'Hidróxido de potasio', '1', 'K⁺: KOH.'),
        c('🟢', 'Hidróxido ferroso', '2', 'Fe²⁺: Fe(OH)₂.'),
        c('🟠', 'Hidróxido cuproso', '1', 'Cu⁺: CuOH.'),
      ]}
      cierre="Metal con carga n → n grupos OH." />
  )
}
