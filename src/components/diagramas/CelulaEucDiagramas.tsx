import { useState } from 'react'
import PantallaCompleta from '../PantallaCompleta.tsx'
import VisorZoom from '../VisorZoom.tsx'
import { Lienzo, T, Flecha, TINTA } from '../ilustraciones/Dibujo.tsx'
import { CelulaAnimalCompleta, CelulaVegetalCompleta, PUNTOS_ANIMAL, PUNTOS_VEGETAL, Nucleo, Mito, Golgi, RetRugoso, Cloroplasto } from '../ilustraciones/CelulaEuc.tsx'
import { Clasifica, Pestanas, Nota } from './TiposCelulas.tsx'
import { useFlechas } from '../../lib/flechasDiagrama.ts'

// Diagramas del subtema 3 «Estructura y función de la célula eucariota». Texto en borrador.

/* ── 1. Explorador de la célula ───────────────────────────────────────────── */

interface Info {
  nombre: string
  funcion: string
  dato: string
}
const INFO: Record<string, Info> = {
  membrana: { nombre: 'Membrana plasmática', funcion: 'Rodea la célula y controla qué entra y qué sale.', dato: 'Está hecha de dos capas de lípidos con proteínas.' },
  citoplasma: { nombre: 'Citoplasma y citoesqueleto', funcion: 'El citoplasma es el gel donde flotan los orgánulos; el citoesqueleto le da forma y permite el movimiento.', dato: 'Los filamentos sirven como «rieles» para mover cargas.' },
  nucleo: { nombre: 'Núcleo', funcion: 'Guarda el ADN y dirige lo que hace la célula.', dato: 'Tiene doble membrana con poros y un nucleolo donde se arman los ribosomas.' },
  ret: { nombre: 'Retículo y ribosomas', funcion: 'Los ribosomas arman proteínas; el retículo rugoso las procesa y el liso fabrica lípidos.', dato: 'Se llama «rugoso» porque tiene ribosomas pegados.' },
  golgi: { nombre: 'Aparato de Golgi', funcion: 'Recibe lo fabricado, lo empaca en vesículas y lo reparte.', dato: 'Funciona como la oficina de correos de la célula.' },
  mito: { nombre: 'Mitocondria', funcion: 'Libera la energía de los alimentos en forma de ATP.', dato: 'Tiene doble membrana, ADN propio y la membrana interna forma pliegues.' },
  liso: { nombre: 'Lisosoma', funcion: 'Digiere restos y alimento con enzimas y recicla piezas.', dato: 'Se asocia sobre todo a las células animales.' },
  cloro: { nombre: 'Cloroplasto', funcion: 'Hace la fotosíntesis: con luz fabrica glucosa y libera oxígeno.', dato: 'Tiene clorofila, doble membrana y ADN propio.' },
  vacuola: { nombre: 'Vacuola central', funcion: 'Guarda agua y sustancias, y mantiene firme la célula.', dato: 'En la célula animal solo hay vacuolas pequeñas.' },
}
const llave = (id: string) => (id === 'mito2' ? 'mito' : id === 'cloro2' ? 'cloro' : id)

function Explorador() {
  const [tipo, setTipo] = useState<'animal' | 'vegetal'>('animal')
  const [sel, setSel] = useState<string | null>(null)
  const puntos = tipo === 'animal' ? PUNTOS_ANIMAL : PUNTOS_VEGETAL
  const info = sel ? INFO[llave(sel)] : null
  return (
    <PantallaCompleta>
      <Pestanas valor={tipo} onCambio={(t) => { setTipo(t); setSel(null) }} etiqueta="Tipo de célula" opciones={[['animal', 'Animal'], ['vegetal', 'Vegetal']]} />
      <VisorZoom etiqueta={`Célula ${tipo} con sus orgánulos`} alto="aspect-[4/3]">
        <Lienzo etiqueta={`Célula ${tipo}: toca un orgánulo para ver su función`}>
          {tipo === 'animal' ? <CelulaAnimalCompleta resalta={sel ?? undefined} /> : <CelulaVegetalCompleta resalta={sel ?? undefined} />}
          {puntos.filter((p) => p.id !== 'citoplasma').map((p) => (
            <circle
              key={p.id}
              cx={p.x}
              cy={p.y}
              r={p.r}
              fill="transparent"
              stroke={sel === p.id ? '#e8a33a' : 'transparent'}
              strokeWidth="3"
              tabIndex={0}
              role="button"
              aria-label={p.nombre}
              style={{ cursor: 'pointer', outlineOffset: 2 }}
              onClick={() => setSel(p.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(p.id) } }}
            />
          ))}
        </Lienzo>
      </VisorZoom>
      <div role="group" aria-label="Orgánulos" className="mt-3 flex flex-wrap gap-2">
        {puntos.filter((p, i, a) => a.findIndex((q) => llave(q.id) === llave(p.id)) === i && p.id !== 'citoplasma').map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={sel !== null && llave(sel) === llave(p.id)}
            onClick={() => setSel(p.id)}
            className="min-h-10 rounded-full border border-[var(--linea)] px-3 text-sm font-semibold aria-pressed:border-[var(--acento)] aria-pressed:bg-[var(--acento-suave)]/50"
          >
            {INFO[llave(p.id)].nombre}
          </button>
        ))}
      </div>
      <div aria-live="polite" className="mt-2 min-h-[5.5rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">
        {info ? (
          <>
            <p className="font-semibold">{info.nombre}</p>
            <p>{info.funcion}</p>
            <p className="mt-1 text-[var(--suave)]">{info.dato}</p>
          </>
        ) : (
          <p className="text-[var(--suave)]">Toca un orgánulo en el dibujo o en la lista. Cambia a «Vegetal» para ver qué se suma.</p>
        )}
      </div>
      <Nota>Esquemas simplificados: faltan orgánulos y los tamaños no son reales.</Nota>
    </PantallaCompleta>
  )
}

const ITEMS_FUN = [
  { texto: 'Guarda el ADN y dirige a la célula.', r: 'nucleo', explica: 'El núcleo contiene el ADN, el «manual» de la célula.' },
  { texto: 'Libera energía de los alimentos en forma de ATP.', r: 'mito', explica: 'La mitocondria es la «central eléctrica» de la célula.' },
  { texto: 'Hace la fotosíntesis.', r: 'cloro', explica: 'Solo las plantas y algas tienen cloroplastos.' },
  { texto: 'Controla qué entra y qué sale.', r: 'membrana', explica: 'La membrana es la frontera de la célula.' },
  { texto: 'Empaca las proteínas y las reparte.', r: 'golgi', explica: 'El aparato de Golgi funciona como correos.' },
  { texto: 'Digiere restos y recicla piezas.', r: 'lisosoma', explica: 'Los lisosomas tienen enzimas digestivas.' },
]
const OPC_ORG: [string, string][] = [['nucleo', 'Núcleo'], ['mito', 'Mitocondria'], ['cloro', 'Cloroplasto'], ['membrana', 'Membrana'], ['golgi', 'Golgi'], ['lisosoma', 'Lisosoma']]

export function ExploradorCelula({ modo = 'explora' }: { modo?: 'explora' | 'une' }) {
  const [m, setM] = useState(modo)
  return (
    <div>
      <Pestanas valor={m} onCambio={setM} etiqueta="Actividad" opciones={[['explora', 'Explora'], ['une', '¿Quién lo hace?']]} />
      {m === 'explora' ? <Explorador /> : <Clasifica intro="Une cada trabajo con el orgánulo que lo hace." pregunta="¿Qué orgánulo es?" items={ITEMS_FUN} opciones={OPC_ORG} pista="Piensa en el nombre y en la forma." />}
    </div>
  )
}

/* ── 2. Ruta de una proteína ──────────────────────────────────────────────── */

const PASOS = [
  { n: 'El ADN tiene la receta', t: 'En el núcleo, una copia de la receta (ARN mensajero) sale por un poro hacia el citoplasma.', x: 40 },
  { n: 'El ribosoma arma la cadena', t: 'Un ribosoma lee la receta y une aminoácidos uno a uno. Si la proteína es para exportar, el ribosoma se pega al retículo rugoso.', x: 120 },
  { n: 'El retículo la pliega', t: 'Dentro del retículo la cadena se pliega y recibe retoques. Después viaja en una vesícula.', x: 200 },
  { n: 'El Golgi la empaca', t: 'El aparato de Golgi termina de modificarla, la etiqueta y la empaca en una vesícula.', x: 280 },
  { n: 'Sale de la célula', t: 'La vesícula se fusiona con la membrana y libera la proteína afuera (como la insulina o una enzima digestiva).', x: 360 },
]

function RutaProteina() {
  const [i, setI] = useState(0)
  const p = PASOS[i]
  useFlechas((dir) => { setI((x) => Math.max(0, Math.min(PASOS.length - 1, x + dir))); return true })
  return (
    <PantallaCompleta>
      <VisorZoom etiqueta="La ruta de una proteína por la célula" alto="aspect-[4/3]">
        <Lienzo etiqueta="Ruta de una proteína: ADN, ribosoma, retículo, Golgi y salida">
          <T x={200} y={26} s={15} b>De la receta a la proteína</T>
          <circle cx={p.x} cy={120} r="30" fill="#fbe19a" opacity="0.7" />
          <g transform="translate(40 120) scale(0.5)"><Nucleo /></g>
          <g transform="translate(120 120)"><circle r="17" fill="#f2b84b" stroke={TINTA} strokeWidth="2" /><circle r="9" cx="-6" cy="-6" fill="#e8806f" stroke={TINTA} strokeWidth="1.4" /></g>
          <g transform="translate(200 120)"><RetRugoso k={0.8} /></g>
          <g transform="translate(280 120)"><Golgi k={0.8} /></g>
          <g transform="translate(360 120)"><path d="M -10 -30 v 60" stroke="#b05a5a" strokeWidth="7" strokeLinecap="round" /></g>
          {[60, 140, 220, 300].map((x) => <Flecha key={x} x1={x} y1={120} x2={x + 22} y2={120} c="#8a7a5a" w={2} />)}
          {PASOS.map((q, k) => (
            <g key={q.x}>
              <circle cx={q.x} cy={188} r="10" fill={k === i ? '#0f766e' : TINTA} />
              <T x={q.x} y={192} s={11} b c="#fff">{k + 1}</T>
            </g>
          ))}
          <circle cx={p.x + (i === 4 ? 22 : 0)} cy={i === 0 ? 150 : 90} r="6" fill="#e8806f" stroke={TINTA} strokeWidth="1.6" />
          <T x={200} y={236} s={13} b>{p.n}</T>
        </Lienzo>
      </VisorZoom>
      <div className="mt-3">
        <label htmlFor="paso-ruta" className="flex items-center justify-between text-sm font-semibold">
          <span>Paso {i + 1} de {PASOS.length}</span>
          <span className="font-normal text-[var(--suave)]">{p.n}</span>
        </label>
        <input id="paso-ruta" type="range" min="0" max={PASOS.length - 1} step="1" value={i} onChange={(e) => setI(Number(e.target.value))} onPointerUp={(e) => e.currentTarget.closest<HTMLElement>('[role=dialog]')?.focus()} className="mt-1 h-8 w-full accent-[var(--acento)]" />
      </div>
      <p aria-live="polite" className="mt-2 min-h-[4.5rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">{p.t}</p>
      <Nota>Versión simplificada: en la realidad intervienen más pasos y moléculas.</Nota>
    </PantallaCompleta>
  )
}

const ITEMS_RUTA = [
  { texto: 'Guarda la receta de la proteína.', r: '1', explica: 'El ADN está en el núcleo.' },
  { texto: 'Une aminoácidos para armar la cadena.', r: '2', explica: 'El ribosoma «lee» la receta.' },
  { texto: 'Pliega la cadena y le hace retoques.', r: '3', explica: 'Ocurre dentro del retículo.' },
  { texto: 'La etiqueta, la empaca y la reparte.', r: '4', explica: 'Es el trabajo del aparato de Golgi.' },
  { texto: 'La vesícula la libera fuera de la célula.', r: '5', explica: 'Al fusionarse con la membrana, la proteína sale.' },
]

export function RutaProteinaDiagrama({ modo = 'ruta' }: { modo?: 'ruta' | 'ordena' }) {
  const [m, setM] = useState(modo)
  return (
    <div>
      <Pestanas valor={m} onCambio={setM} etiqueta="Actividad" opciones={[['ruta', 'Sigue la ruta'], ['ordena', '¿En qué paso?']]} />
      {m === 'ruta' ? <RutaProteina /> : <Clasifica intro="Decide en qué paso de la ruta ocurre cada cosa." pregunta="¿Qué paso es?" items={ITEMS_RUTA} opciones={[['1', '1 ADN'], ['2', '2 Ribosoma'], ['3', '3 Retículo'], ['4', '4 Golgi'], ['5', '5 Salida']]} pista="Sigue el orden: receta, cadena, pliegue, empaque, salida." />}
    </div>
  )
}

/* ── 3. Energía: cloroplasto y mitocondria ────────────────────────────────── */

type Modo = 'cloro' | 'mito' | 'ambos'
const TEXTO: Record<Modo, string> = {
  cloro: 'El cloroplasto usa la luz para convertir CO₂ y agua en glucosa, y libera oxígeno. Solo lo tienen plantas y algas.',
  mito: 'La mitocondria usa la glucosa y el oxígeno para liberar energía en forma de ATP. Casi todas las eucariotas la tienen.',
  ambos: 'En una planta trabajan juntos: el cloroplasto fabrica glucosa y oxígeno, y la mitocondria los usa para obtener ATP. Las plantas también respiran.',
}

export function EnergiaCelular() {
  const [m, setM] = useState<Modo>('cloro')
  const cloro = m !== 'mito'
  const mito = m !== 'cloro'
  return (
    <PantallaCompleta>
      <Pestanas valor={m} onCambio={setM} etiqueta="Qué mirar" opciones={[['cloro', 'Cloroplasto'], ['mito', 'Mitocondria'], ['ambos', 'Los dos juntos']]} />
      <VisorZoom etiqueta="Cloroplasto y mitocondria: qué entra y qué sale" alto="aspect-[4/3]">
        <Lienzo etiqueta="Entradas y salidas del cloroplasto y la mitocondria">
          <g opacity={cloro ? 1 : 0.25}>
            <T x={100} y={44} s={14} b>Cloroplasto</T>
            <g transform="translate(100 130) scale(1.6)"><Cloroplasto /></g>
            <T x={100} y={72} s={11}>luz + CO₂ + agua</T>
            <Flecha x1={100} y1={78} x2={100} y2={102} c="#4a8a3a" w={2.4} />
            <Flecha x1={100} y1={160} x2={100} y2={184} c="#4a8a3a" w={2.4} />
            <T x={100} y={202} s={11}>glucosa + oxígeno</T>
          </g>
          <g opacity={mito ? 1 : 0.25}>
            <T x={300} y={44} s={14} b>Mitocondria</T>
            <g transform="translate(300 130) scale(1.6)"><Mito /></g>
            <T x={300} y={72} s={11}>glucosa + oxígeno</T>
            <Flecha x1={300} y1={78} x2={300} y2={102} c="#b3661f" w={2.4} />
            <Flecha x1={300} y1={160} x2={300} y2={184} c="#b3661f" w={2.4} />
            <T x={300} y={202} s={11}>energía (ATP) + CO₂ + agua</T>
          </g>
          {m === 'ambos' && (
            <g>
              <Flecha x1={150} y1={130} x2={248} y2={130} c="#8a7a5a" w={2.6} />
              <T x={200} y={120} s={10.5}>glucosa y O₂</T>
              <path d="M 300 220 Q 200 270 100 220" fill="none" stroke="#8a7a5a" strokeWidth="2.4" strokeDasharray="5 4" />
              <T x={200} y={266} s={10.5}>CO₂ y agua vuelven al cloroplasto</T>
            </g>
          )}
        </Lienzo>
      </VisorZoom>
      <p aria-live="polite" className="mt-2 min-h-[4.5rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">{TEXTO[m]}</p>
      <Nota>Resumen muy simplificado de la fotosíntesis y la respiración celular.</Nota>
    </PantallaCompleta>
  )
}

/* ── 4. Cómo cruzan la membrana ───────────────────────────────────────────── */

interface Mol {
  id: string
  nombre: string
  via: 'lipido' | 'canal' | 'transp' | 'vesicula'
  texto: string
}
const MOLS: Mol[] = [
  { id: 'o2', nombre: 'Oxígeno (O₂)', via: 'lipido', texto: 'Es pequeña y sin carga: pasa directo entre los lípidos, de donde hay más a donde hay menos (difusión simple).' },
  { id: 'agua', nombre: 'Agua', via: 'canal', texto: 'Pasa en parte entre los lípidos y en parte por canales especiales de agua, hacia donde hay más sales (ósmosis).' },
  { id: 'glu', nombre: 'Glucosa', via: 'transp', texto: 'Es grande y polar: necesita una proteína transportadora que la lleve a través (difusión facilitada).' },
  { id: 'na', nombre: 'Iones (Na⁺, K⁺)', via: 'canal', texto: 'Tienen carga y no atraviesan los lípidos: pasan por canales o bombas de proteína, a veces gastando energía.' },
  { id: 'gran', nombre: 'Partícula grande', via: 'vesicula', texto: 'Demasiado grande para cruzar: la célula la rodea con su membrana y la mete en una vesícula (endocitosis).' },
]
const LUG: Record<Mol['via'], number> = { lipido: 100, canal: 165, transp: 235, vesicula: 320 }

export function MembranaTransporte() {
  const [sel, setSel] = useState('o2')
  const mol = MOLS.find((x) => x.id === sel)!
  const xs = Array.from({ length: 15 }, (_, i) => 20 + i * 25)
  const x = LUG[mol.via]
  const hay = (v: Mol['via']) => (mol.via === v ? 1 : 0.35)
  return (
    <PantallaCompleta>
      <VisorZoom etiqueta="Moléculas cruzando la membrana por distintos caminos" alto="aspect-[4/3]">
        <Lienzo etiqueta={`Cómo cruza la membrana: ${mol.nombre}`}>
          <T x={20} y={36} s={12} b a="start">Fuera</T>
          <T x={20} y={276} s={12} b a="start">Dentro</T>
          {xs.map((cx) => (
            <g key={cx} opacity={mol.via === 'lipido' ? 1 : 0.8}>
              <circle cx={cx} cy={112} r="7.5" fill="#f2c77a" stroke="#b3861f" strokeWidth="1.8" />
              <path d={`M ${cx - 2.5} 119 v 24 M ${cx + 2.5} 119 v 24`} stroke="#b3861f" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx={cx} cy={188} r="7.5" fill="#f2c77a" stroke="#b3861f" strokeWidth="1.8" />
              <path d={`M ${cx - 2.5} 181 v -24 M ${cx + 2.5} 181 v -24`} stroke="#b3861f" strokeWidth="1.8" strokeLinecap="round" />
            </g>
          ))}
          <g opacity={hay('canal')}>
            <rect x="152" y="100" width="26" height="100" rx="10" fill="#9ec0e8" stroke="#5d84b8" strokeWidth="2.4" />
            <rect x="159" y="108" width="12" height="84" rx="6" fill="#f4efe4" />
            <T x={165} y={224} s={10.5} b>Canal</T>
          </g>
          <g opacity={hay('transp')}>
            <rect x="218" y="100" width="34" height="100" rx="12" fill="#b9d9a8" stroke="#3f7d37" strokeWidth="2.4" />
            <path d="M 224 150 q 11 -14 22 0" fill="none" stroke="#3f7d37" strokeWidth="2.4" />
            <T x={235} y={224} s={10.5} b>Transportadora</T>
          </g>
          <g opacity={hay('lipido')}><T x={100} y={224} s={10.5} b>Entre los lípidos</T></g>
          <g opacity={hay('vesicula')}>
            <path d="M 290 150 q 30 -34 60 0" fill="none" stroke="#b3861f" strokeWidth="5" strokeLinecap="round" />
            <T x={320} y={224} s={10.5} b>Vesícula</T>
          </g>
          <circle cx={x} cy={60} r={mol.via === 'vesicula' ? 14 : 8} fill="#e8806f" stroke={TINTA} strokeWidth="1.8" />
          <Flecha x1={x} y1={mol.via === 'vesicula' ? 78 : 72} x2={x} y2={mol.via === 'vesicula' ? 134 : 104} c={TINTA} w={2.4} />
          <T x={200} y={260} s={13} b>{mol.nombre}</T>
        </Lienzo>
      </VisorZoom>
      <div role="group" aria-label="Moléculas" className="mt-3 flex flex-wrap gap-2">
        {MOLS.map((q) => (
          <button key={q.id} type="button" aria-pressed={sel === q.id} onClick={() => setSel(q.id)} className="min-h-10 rounded-full border border-[var(--linea)] px-3 text-sm font-semibold aria-pressed:border-[var(--acento)] aria-pressed:bg-[var(--acento-suave)]/50">
            {q.nombre}
          </button>
        ))}
      </div>
      <p aria-live="polite" className="mt-2 min-h-[4.5rem] rounded-xl bg-[var(--fondo)] p-3 text-sm">{mol.texto}</p>
      <Nota>La membrana es selectivamente permeable: deja pasar unas cosas y otras no. Esquema simplificado.</Nota>
    </PantallaCompleta>
  )
}
