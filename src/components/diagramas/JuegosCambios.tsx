import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» de Química, área 1, tema 4 (Cambios físicos y químicos). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function FisicoQuimicoJuego() {
  return (
    <JuegoDecide titulo="¿Físico o químico?" pregunta="¿Qué tipo de cambio es?" instrucciones="Pregúntate: ¿se formó una sustancia nueva?" clave="cien:fisico-quimico-mejor"
      opciones={[o('f', 'Cambio físico', '🔁'), o('q', 'Cambio químico', '⚗️')]}
      cartas={[
        c('🪵', 'La leña arde en el fogón', 'q', 'Se forman ceniza, humo y gases nuevos.'),
        c('🧊', 'El hielo se derrite', 'f', 'Sigue siendo agua.'),
        c('🍳', 'Un huevo se fríe', 'q', 'Sus proteínas cambian y no vuelven atrás.'),
        c('🧂', 'La sal se disuelve en agua', 'f', 'Si se evapora el agua, la sal vuelve a aparecer.'),
        c('🍌', 'Un banano se madura y se pone negro', 'q', 'Se forman sustancias nuevas.'),
        c('🪨', 'Una piedra se parte en dos', 'f', 'Sigue siendo la misma roca.'),
        c('🍞', 'La masa del pan sube con levadura', 'q', 'La levadura produce CO₂.'),
        c('🔩', 'Doblar un alambre', 'f', 'Cambia la forma, no la sustancia.'),
        c('🥛', 'La leche se vuelve kumis', 'q', 'Las bacterias transforman sus azúcares en ácido.'),
      ]}
      cierre="Si se forman sustancias nuevas, el cambio es químico; si solo cambia la forma o el estado, es físico." />
  )
}

export function SenalJuego() {
  return (
    <JuegoDecide titulo="¿Qué señal ves?" pregunta="¿Qué señal de cambio químico aparece?" instrucciones="Elige la señal principal de cada reacción." clave="cien:senal-mejor"
      opciones={[o('gas', 'Sale un gas', '🫧'), o('color', 'Cambia el color', '🎨'), o('calor', 'Luz o calor', '🔥'), o('solido', 'Aparece un sólido', '🧀')]}
      cartas={[
        c('💊', 'Una pastilla efervescente en agua', 'gas', 'Las burbujas son CO₂.'),
        c('🍎', 'Una manzana partida se pone café', 'color', 'Su pulpa reacciona con el oxígeno.'),
        c('🕯️', 'Una vela encendida', 'calor', 'La combustión da luz y calor.'),
        c('🍋', 'La leche se corta al echarle limón', 'solido', 'Las proteínas forman grumos.'),
        c('🧪', 'Bicarbonato con vinagre', 'gas', 'Hace espuma por el CO₂.'),
        c('🎆', 'Un volador explota', 'calor', 'Libera luz, calor y sonido.'),
        c('🚲', 'La cadena de la bicicleta se pone rojiza', 'color', 'Es óxido de hierro.'),
      ]}
      cierre="Gas, color, luz y calor o un sólido nuevo son señales; para estar seguros hay que ver si la sustancia cambió." />
  )
}

export function PropiedadFQJuego() {
  return (
    <JuegoDecide titulo="¿Propiedad física o química?" pregunta="¿Qué tipo de propiedad es?" instrucciones="Física: se observa sin cambiar la sustancia. Química: solo se ve cuando la sustancia se transforma." clave="cien:propiedad-fq-mejor"
      opciones={[o('f', 'Física', '📏'), o('q', 'Química', '⚗️')]}
      cartas={[
        c('⚖️', 'La densidad del hierro', 'f', 'Se mide sin transformarlo.'),
        c('🔥', 'La gasolina arde con facilidad', 'q', 'Es combustible: al arder se transforma.'),
        c('🔪', 'El hierro se oxida con la humedad', 'q', 'Forma óxido, una sustancia nueva.'),
        c('🧊', 'El agua hierve a 100 °C al nivel del mar', 'f', 'Al hervir sigue siendo agua.'),
        c('🟡', 'El oro no se oxida', 'q', 'Describe cómo reacciona (o no) con el oxígeno.'),
        c('🎨', 'El color rojo del ladrillo', 'f', 'Se observa sin cambiarlo.'),
        c('🧼', 'El blanqueador decolora la ropa', 'q', 'Reacciona con los colorantes.'),
      ]}
      cierre="Las propiedades químicas dicen cómo reacciona una sustancia: si arde, si se oxida, si reacciona con ácidos." />
  )
}
