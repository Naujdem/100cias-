import JuegoDecide, { type CartaDecide, type OpcionDecide } from './JuegoDecide.tsx'

// Minijuegos «decide rápido» del área 6, tema 4 (Excreción). Solo datos.

const c = (icono: string, nombre: string, correcta: string, explica: string): CartaDecide => ({ icono, nombre, correcta, explica })
const o = (id: string, nombre: string, icono: string): OpcionDecide => ({ id, nombre, icono })

export function ExcOrganosJuego() {
  return (
    <JuegoDecide titulo="¿Quién lo saca?" pregunta="¿Qué órgano elimina este desecho?" instrucciones="Elige el órgano que se encarga de cada desecho." clave="cien:exc-organos-mejor"
      opciones={[o('pulmones', 'Pulmones', '🫁'), o('rinones', 'Riñones', '🫘'), o('piel', 'Piel', '💦'), o('ninguno', 'No es excreción', '🚫')]}
      cartas={[
        c('⚫', 'El CO₂ de la respiración celular', 'pulmones', 'Sale al espirar.'),
        c('🟡', 'La urea de la sangre', 'rinones', 'Sale en la orina.'),
        c('🧂', 'Agua y sales en un día de calor', 'piel', 'Con el sudor.'),
        c('💩', 'Los restos de comida que no se digirieron', 'ninguno', 'Es egestión: nunca entraron a las células.'),
        c('💧', 'El agua de más después de tomar mucho jugo', 'rinones', 'Orina abundante y clara.'),
      ]}
      cierre="Excretar es sacar los desechos que hicieron las células." />
  )
}

export function UrinarioJuego() {
  return (
    <JuegoDecide titulo="El camino de la orina" pregunta="¿Qué órgano es?" instrucciones="Elige el órgano del sistema urinario que describe cada tarjeta." clave="cien:urinario-mejor"
      opciones={[o('rinon', 'Riñón', '🫘'), o('ureter', 'Uréter', '〰️'), o('vejiga', 'Vejiga', '🎈'), o('uretra', 'Uretra', '⬇️')]}
      cartas={[
        c('🧪', 'Filtra la sangre y forma la orina', 'rinon', 'Tiene un millón de nefronas.'),
        c('🎈', 'Guarda la orina hasta que vamos al baño', 'vejiga', 'Se estira como una bomba.'),
        c('〰️', 'Tubo que baja del riñón a la vejiga', 'ureter', 'Hay uno por cada riñón.'),
        c('🚪', 'Tubo por donde sale la orina del cuerpo', 'uretra', 'Es el último tramo.'),
        c('🫘', 'Tiene forma de fríjol y está a los lados de la columna', 'rinon', 'Hay dos, bajo las costillas.'),
      ]}
      cierre="Riñones → uréteres → vejiga → uretra." />
  )
}

export function NefronaJuego() {
  return (
    <JuegoDecide titulo="Filtrar, recuperar o soltar" pregunta="¿Qué paso de la nefrona es?" instrucciones="Decide en qué paso de la formación de la orina ocurre cada cosa." clave="cien:nefrona-mejor"
      opciones={[o('fil', 'Filtración', '🧽'), o('rea', 'Reabsorción', '↩️'), o('sec', 'Secreción', '➡️')]}
      cartas={[
        c('🩸', 'El agua y la urea salen de la sangre en el glomérulo', 'fil', 'Pasa todo lo pequeño.'),
        c('🍬', 'La glucosa vuelve toda a la sangre', 'rea', 'Por eso en una persona sana no hay azúcar en la orina.'),
        c('💊', 'La sangre suelta restos de un medicamento al túbulo', 'sec', 'Así se eliminan más rápido.'),
        c('💧', 'Casi toda el agua filtrada regresa a la sangre', 'rea', 'Más del 99 %.'),
        c('🔴', 'Los glóbulos rojos se quedan en la sangre', 'fil', 'Son demasiado grandes para pasar el filtro.'),
      ]}
      cierre="Filtrar todo lo pequeño, recuperar lo que sirve y soltar lo que sobra." />
  )
}

export function OrinaJuego() {
  return (
    <JuegoDecide titulo="¿Cómo saldrá la orina?" pregunta="¿Poca y oscura, o mucha y clara?" instrucciones="Decide cómo será la orina en cada situación." clave="cien:orina-mejor"
      opciones={[o('oscura', 'Poca y oscura', '🟧'), o('clara', 'Mucha y clara', '🟨')]}
      cartas={[
        c('⚽', 'Después de un partido al sol sin tomar agua', 'oscura', 'El riñón ahorra agua.'),
        c('🍉', 'Después de comer media patilla', 'clara', 'Sobra agua.'),
        c('🌅', 'Al levantarse en la mañana', 'oscura', 'Toda la noche sin beber.'),
        c('🥤', 'Tras tomar tres vasos de agua', 'clara', 'El riñón deja ir el agua de más.'),
        c('🤒', 'Con fiebre y mucho sudor', 'oscura', 'Se pierde agua por la piel.'),
      ]}
      cierre="El color de la orina es una pista de la hidratación." />
  )
}

export function PecesAguaJuego() {
  return (
    <JuegoDecide titulo="¿Río o mar?" pregunta="¿Es un pez de río o de mar?" instrucciones="Decide si cada estrategia es de un pez de agua dulce o de agua salada." clave="cien:peces-agua-mejor"
      opciones={[o('rio', 'Pez de río', '🏞️'), o('mar', 'Pez de mar', '🌊')]}
      cartas={[
        c('🥤', 'Toma agua todo el tiempo', 'mar', 'Pierde agua hacia el mar salado.'),
        c('🚽', 'Orina muchísimo y muy diluido', 'rio', 'Le entra agua sin parar.'),
        c('🧂', 'Saca la sal de más por las branquias', 'mar', 'Células especiales la bombean afuera.'),
        c('🫧', 'Toma sales del agua por las branquias', 'rio', 'Porque las pierde en la orina.'),
        c('🐟', 'Un bocachico del Magdalena', 'rio', 'Vive en agua dulce.'),
        c('🐠', 'Un pargo del Caribe', 'mar', 'Vive en agua salada.'),
      ]}
      cierre="El de río lucha contra el agua que le entra; el de mar, contra el agua que pierde." />
  )
}
