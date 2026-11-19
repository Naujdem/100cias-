import type { ReactNode } from 'react'
import { enlace } from '../../lib/ruta.ts'
import { Migas } from '../Biblioteca.tsx'
import GuiaLab from './GuiaLab.tsx'
import { GUIAS } from '../../data/guiasLab.ts'
import SolucionMolar from './practicas/solucionMolar.tsx'
import Seguridad from './practicas/Seguridad.tsx'
import Informe from './practicas/Informe.tsx'
import Material from './practicas/Material.tsx'
import Microscopio from './practicas/Microscopio.tsx'
import Montaje from './practicas/Montaje.tsx'
import Tinciones from './practicas/Tinciones.tsx'
import Osmosis from './practicas/Osmosis.tsx'
import Biomoleculas from './practicas/Biomoleculas.tsx'
import Enzimas from './practicas/Enzimas.tsx'
import Fotosintesis from './practicas/Fotosintesis.tsx'
import Fermentacion from './practicas/Fermentacion.tsx'
import ADN from './practicas/ADN.tsx'
import Microbiologia from './practicas/Microbiologia.tsx'
import Ambiente from './practicas/Ambiente.tsx'
import Medicion from './practicas/Medicion.tsx'
import Densidades from './practicas/Densidades.tsx'
import Mezclas from './practicas/Mezclas.tsx'
import ConservacionMasa from './practicas/ConservacionMasa.tsx'
import EnsayoLlama from './practicas/EnsayoLlama.tsx'
import TiposReaccion from './practicas/TiposReaccion.tsx'
import ReactivoLimite from './practicas/ReactivoLimite.tsx'
import Gases from './practicas/Gases.tsx'
import DilucionSolubilidad from './practicas/Dilucion.tsx'
import AcidosBases from './practicas/AcidosBases.tsx'
import Titulacion from './practicas/Titulacion.tsx'
import VelocidadReaccion from './practicas/VelocidadReaccion.tsx'
import Saponificacion from './practicas/Saponificacion.tsx'
import Combustion from './practicas/Combustion.tsx'
import PilaLimones from './practicas/PilaLimones.tsx'

// Laboratorios virtuales (PLAN-LABORATORIOS.md). Las prácticas listas van en PRACTICAS; las demás de la
// ruta salen como «próximamente».

// Cada práctica es un componente propio (mesa viva o minijuego).
interface Entrada {
  id: string
  titulo: string
  resumen: string
  grupo: string
  desdeGrado: number
  Juego: (p: { grado: number }) => ReactNode
}

const PRACTICAS: Entrada[] = [
  { id: 'seguridad', titulo: 'Práctica cero: seguridad en el laboratorio', resumen: 'Vístete, reconoce los pictogramas, decide qué está bien y a dónde va cada residuo.', grupo: 'Para empezar', desdeGrado: 6, Juego: Seguridad },
  { id: 'informe', titulo: 'Cuaderno e informe de laboratorio', resumen: 'Arma un informe con sus partes en orden y encuentra los errores de uno mal hecho.', grupo: 'Para empezar', desdeGrado: 6, Juego: Informe },
  { id: 'material', titulo: 'Reconoce tu material', resumen: 'Cada instrumento con su uso, su cuidado y su versión casera; luego, ¿qué es? y ¿cuál uso?', grupo: 'Para empezar', desdeGrado: 6, Juego: Material },
  { id: 'microscopio', titulo: 'El microscopio', resumen: 'Sus partes, cómo enfocar sin romper la lámina y el reto de ver células a 400x.', grupo: 'Biología', desdeGrado: 6, Juego: Microscopio },
  { id: 'montaje', titulo: 'Montaje húmedo', resumen: 'Prepara una lámina de cebolla: limpia, extendida y sin burbujas. Al observarla se ven tus errores.', grupo: 'Biología', desdeGrado: 6, Juego: Montaje },
  { id: 'tinciones', titulo: 'Tinciones', resumen: 'Lugol y azul de metileno en cebolla, mejilla y papa; en 11°, la tinción de Gram.', grupo: 'Biología', desdeGrado: 6, Juego: Tinciones },
  { id: 'osmosis', titulo: 'Ósmosis', resumen: 'Plasmólisis en elodea y tiras de papa en agua con sal: tabla, gráfica y punto isotónico.', grupo: 'Biología', desdeGrado: 6, Juego: Osmosis },
  { id: 'biomoleculas', titulo: 'Biomoléculas en los alimentos', resumen: 'Lugol, Benedict, Biuret y la mancha en papel sobre once alimentos: interpreta cada tubo.', grupo: 'Biología', desdeGrado: 6, Juego: Biomoleculas },
  { id: 'enzimas', titulo: 'Enzimas', resumen: 'Catalasa con agua oxigenada (temperatura y pH) y amilasa digiriendo almidón, vista con lugol.', grupo: 'Biología', desdeGrado: 6, Juego: Enzimas },
  { id: 'fotosintesis', titulo: 'Fotosíntesis', resumen: 'Burbujas de oxígeno de la elodea según la luz y el CO₂, y cromatografía de los pigmentos de las hojas.', grupo: 'Biología', desdeGrado: 6, Juego: Fotosintesis },
  { id: 'fermentacion', titulo: 'Fermentación', resumen: 'Cuatro botellas con levadura y globo: azúcar, temperatura y un control. El gas, a prueba con agua de cal.', grupo: 'Biología', desdeGrado: 6, Juego: Fermentacion },
  { id: 'adn-fresa', titulo: 'Extracción de ADN de fresa', resumen: 'Machacar, jabón, sal, filtrar y alcohol frío: saca ADN visible con cosas de la cocina.', grupo: 'Biología', desdeGrado: 6, Juego: ADN },
  { id: 'microbiologia', titulo: 'Microbiología', resumen: 'Técnica aséptica, siembra con control, colonias día a día y conteo; discos y halos de inhibición.', grupo: 'Biología', desdeGrado: 6, Juego: Microbiologia },
  { id: 'agua-suelo', titulo: 'Calidad del agua y del suelo (opcional)', resumen: 'Muestras de la vereda: pH, turbidez, oxígeno, bioindicadores, textura, infiltración y lombrices. Para el PRAE.', grupo: 'Biología', desdeGrado: 6, Juego: Ambiente },
  { id: 'medicion', titulo: 'Medición: precisión y exactitud', resumen: 'Lee el menisco sin paralaje y mide 25 mL cinco veces con cuatro instrumentos: ¿cuál es exacto y cuál preciso?', grupo: 'Química', desdeGrado: 6, Juego: Medicion },
  { id: 'densidades', titulo: 'Densidades', resumen: 'Balanza, regla y probeta para hallar la densidad de seis objetos y reconocer su material; luego, la torre de cinco líquidos.', grupo: 'Química', desdeGrado: 6, Juego: Densidades },
  { id: 'mezclas', titulo: 'Mezclas y técnicas de separación', resumen: 'Separa hierro, piedras, arena y sal (el orden importa), agua y aceite, agua de mar y, desde 9°, agua y alcohol. Y cromatografía de tintas.', grupo: 'Química', desdeGrado: 6, Juego: Mezclas },
  { id: 'conservacion-masa', titulo: 'Conservación de la masa', resumen: 'Vinagre y bicarbonato sobre la balanza en vaso abierto, botella con globo o botella tapada: ¿se pierde masa?', grupo: 'Química', desdeGrado: 6, Juego: ConservacionMasa },
  { id: 'ensayo-llama', titulo: 'Ensayo a la llama', resumen: 'Limpia el asa, toma cada sal y mírala arder: cada metal da su color. Identifica la muestra desconocida.', grupo: 'Química', desdeGrado: 6, Juego: EnsayoLlama },
  { id: 'tipos-reaccion', titulo: 'Tipos de reacción', resumen: 'Metales en sulfato de cobre, precipitados de colores en los tubos y electrólisis del agua con gases que se prueban.', grupo: 'Química', desdeGrado: 6, Juego: TiposReaccion },
  { id: 'reactivo-limite', titulo: 'Reactivo límite con globos', resumen: 'Mismo vinagre y cada vez más bicarbonato: los globos crecen… hasta que dejan de crecer. ¿Quién se acabó primero?', grupo: 'Química', desdeGrado: 8, Juego: ReactivoLimite },
  { id: 'gases', titulo: 'Gases: Boyle y Charles', resumen: 'Pesas sobre una jeringa tapada y una botella con globo en agua fría y caliente: presión, volumen y temperatura.', grupo: 'Química', desdeGrado: 8, Juego: Gases },
  { id: 'dilucion-solubilidad', titulo: 'Dilución y solubilidad', resumen: 'Diluye la solución madre con pipetas y matraz; luego satura agua con salitre y sal a varias temperaturas y arma la curva.', grupo: 'Química', desdeGrado: 9, Juego: DilucionSolubilidad },
  { id: 'acidos-bases', titulo: 'Ácidos, bases y pH', resumen: 'Prepara el indicador de repollo morado y descubre qué sustancias de la casa son ácidas, neutras o básicas.', grupo: 'Química', desdeGrado: 6, Juego: AcidosBases },
  { id: 'titulacion', titulo: 'Titulación ácido-base', resumen: 'Bureta, pipeta y fenolftaleína: halla la concentración de un ácido desconocido y del vinagre. En 11°, la curva de pH.', grupo: 'Química', desdeGrado: 9, Juego: Titulacion },
  { id: 'velocidad-reaccion', titulo: 'Velocidad de reacción', resumen: 'Pastillas efervescentes en agua fría, al clima, caliente o con vinagre, enteras o trituradas: ¿qué la acelera?', grupo: 'Química', desdeGrado: 6, Juego: VelocidadReaccion },
  { id: 'saponificacion', titulo: 'Saponificación (solo simulación)', resumen: 'Aceite y soda cáustica en baño María, agitando hasta la traza: la proporción decide si el jabón sale grasoso, bueno o cáustico.', grupo: 'Química', desdeGrado: 9, Juego: Saponificacion },
  { id: 'combustion', titulo: 'Combustión completa e incompleta', resumen: 'Mechero con el aire cerrado o abierto: hollín, agua y CO₂ sobre la llama. Y una vela que se apaga bajo el frasco.', grupo: 'Química', desdeGrado: 6, Juego: Combustion },
  { id: 'pila-limones', titulo: 'Pila de limones', resumen: 'Clava zinc y cobre en limones, únelos en serie y mide con el voltímetro hasta encender un LED.', grupo: 'Química', desdeGrado: 6, Juego: PilaLimones },
  { id: 'solucion-molar', titulo: 'Prepara 100 mL de solución 0,5 M de sulfato de cobre', resumen: 'Pesa con la balanza, disuelve, pasa con el embudo, afora gota a gota e invierte el matraz. El color muestra la concentración.', grupo: 'Química', desdeGrado: 9, Juego: SolucionMolar },
]

const PROXIMAS: { lab: string; items: string[] }[] = []

const TARJETA = 'flex h-full flex-col gap-1 rounded-2xl border border-[var(--linea)] bg-[var(--tarjeta)] p-5 text-[var(--tinta)] no-underline hover:border-[var(--acento)]'

export default function VistaLaboratorios({ practica, perfilId }: { practica?: string; perfilId: string }) {
  const grado = parseInt(perfilId.replace(/\D/g, ''), 10) || 9
  const P = PRACTICAS.find((p) => p.id === practica)
  if (P) return <VistaPractica P={P} grado={grado} />
  return (
    <div>
      <Migas pasos={[{ texto: 'Inicio', a: enlace.inicio }, { texto: 'Laboratorios' }]} />
      <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">Laboratorios</h1>
      <p className="mt-1 text-[var(--suave)]">Prácticas en una mesa virtual donde te puedes equivocar: el resultado se calcula con lo que hiciste.</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PRACTICAS.map((p) => (
          <li key={p.id}>
            <a href={enlace.lab(p.id)} className={TARJETA}>
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--acento)]">{p.grupo} · desde {p.desdeGrado}°</span>
              <span className="font-semibold">{p.titulo}</span>
              <span className="text-sm text-[var(--suave)]">{p.resumen}</span>
            </a>
          </li>
        ))}
      </ul>
      {PROXIMAS.map((g) => (
        <section key={g.lab} className="mt-7">
          <h2 className="text-xl font-semibold">{g.lab} <span className="text-sm font-normal text-[var(--suave)]">· próximamente</span></h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {g.items.map((t) => (
              <li key={t} className="rounded-full border border-dashed border-[var(--linea)] px-3 py-1 text-sm text-[var(--suave)]">{t}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function VistaPractica({ P, grado }: { P: Entrada; grado: number }) {
  return (
    <div>
      <Migas pasos={[{ texto: 'Inicio', a: enlace.inicio }, { texto: 'Laboratorios', a: enlace.lab() }, { texto: P.titulo }]} />
      <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold sm:text-3xl">{P.titulo}</h1>
        {GUIAS[P.id] && <GuiaLab titulo={P.titulo} guia={GUIAS[P.id]} />}
      </div>
      <div className="mt-4">
        <P.Juego grado={grado} />
      </div>
    </div>
  )
}
