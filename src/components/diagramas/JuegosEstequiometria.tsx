import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de la estequiometría (Química área 3, tema 8). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function MolMolJuego() {
  return (
    <JuegoDecide titulo="Lee la receta" pregunta="¿Cuántos moles?" instrucciones="Usa los coeficientes: lo que busco / lo que tengo." clave="cien:mol-mol-mejor" tiempo={15}
      opciones={[o('2', '2 mol', '2️⃣'), o('3', '3 mol', '3️⃣'), o('4', '4 mol', '4️⃣'), o('6', '6 mol', '6️⃣')]}
      cartas={[
        c('💧', '2 H₂ + O₂ → 2 H₂O. Agua con 4 mol de H₂', '4', '4 × 2/2.'),
        c('💧', '2 H₂ + O₂ → 2 H₂O. O₂ para 6 mol de H₂', '3', '6 × 1/2.'),
        c('🌱', 'N₂ + 3 H₂ → 2 NH₃. NH₃ con 3 mol de N₂', '6', '3 × 2/1.'),
        c('🌱', 'N₂ + 3 H₂ → 2 NH₃. H₂ para 1 mol de N₂', '3', '1 × 3/1.'),
        c('🔥', 'CH₄ + 2 O₂ → CO₂ + 2 H₂O. O₂ para 1 mol de CH₄', '2', '1 × 2/1.'),
        c('🔥', 'CH₄ + 2 O₂ → CO₂ + 2 H₂O. Agua con 3 mol de CH₄', '6', '3 × 2/1.'),
        c('🍳', 'C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O. CO₂ con 1 mol de propano', '3', '1 × 3/1.'),
        c('🍳', 'C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O. Agua con 1 mol de propano', '4', '1 × 4/1.'),
      ]}
      cierre="Relación molar: coeficiente de lo que buscas sobre el de lo que tienes." />
  )
}

export function MasaMasaJuego() {
  return (
    <JuegoDecide titulo="Gramos a gramos" pregunta="¿Cuántos gramos se forman?" instrucciones="g → mol → relación molar → mol → g. H₂ 2 · O₂ 32 · H₂O 18 · C 12 · CH₄ 16 · CO₂ 44." clave="cien:masa-masa-mejor" tiempo={18}
      opciones={[o('18', '18 g', '💧'), o('36', '36 g', '💧'), o('44', '44 g', '💨'), o('88', '88 g', '💨')]}
      cartas={[
        c('💧', 'Agua con 2 g de H₂ (2 H₂ + O₂ → 2 H₂O)', '18', '1 mol H₂ → 1 mol H₂O.'),
        c('💧', 'Agua con 4 g de H₂', '36', '2 mol → 2 mol → 36 g.'),
        c('💧', 'Agua con 16 g de O₂', '18', '0,5 mol O₂ → 1 mol H₂O.'),
        c('💧', 'Agua con 32 g de O₂', '36', '1 mol O₂ → 2 mol H₂O.'),
        c('💨', 'CO₂ con 12 g de carbón (C + O₂ → CO₂)', '44', '1 mol C → 1 mol CO₂.'),
        c('💨', 'CO₂ con 24 g de carbón', '88', '2 mol → 2 mol → 88 g.'),
        c('🔥', 'CO₂ con 16 g de metano (CH₄ + 2 O₂ → CO₂ + 2 H₂O)', '44', '1 mol → 1 mol.'),
        c('🔥', 'Agua con 16 g de metano', '36', '1 mol CH₄ → 2 mol H₂O.'),
      ]}
      cierre="Nunca pases de gramos a gramos directo: siempre por los moles." />
  )
}

export function LimiteJuego() {
  return (
    <JuegoDecide titulo="¿Quién se acaba primero?" pregunta="¿Cuál es el reactivo límite?" instrucciones="Para cada reactivo: cantidad ÷ coeficiente. El menor es el límite." clave="cien:limite-mejor" tiempo={15}
      opciones={[o('1', 'El primero', '1️⃣'), o('2', 'El segundo', '2️⃣'), o('0', 'Ninguno: exacto', '⚖️')]}
      cartas={[
        c('🥪', '2 pan + 1 queso: 10 panes y 3 quesos', '2', 'Pan 5 recetas, queso 3.'),
        c('🥪', '2 pan + 1 queso: 4 panes y 5 quesos', '1', 'Pan 2 recetas, queso 5.'),
        c('💧', '2 H₂ + O₂: 4 mol H₂ y 3 mol O₂', '1', 'H₂ 2 recetas, O₂ 3.'),
        c('💧', '2 H₂ + O₂: 6 mol H₂ y 2 mol O₂', '2', 'H₂ 3 recetas, O₂ 2.'),
        c('💧', '2 H₂ + O₂: 4 mol H₂ y 2 mol O₂', '0', 'Las dos dan 2 recetas.'),
        c('🌱', 'N₂ + 3 H₂: 2 mol N₂ y 3 mol H₂', '2', 'N₂ 2 recetas, H₂ 1.'),
        c('🌱', 'N₂ + 3 H₂: 1 mol N₂ y 6 mol H₂', '1', 'N₂ 1 receta, H₂ 2.'),
        c('🔩', 'Fe + S: 3 mol Fe y 3 mol S', '0', 'Proporción exacta.'),
      ]}
      cierre="No gana el que menos hay, sino el que alcanza para menos recetas." />
  )
}
