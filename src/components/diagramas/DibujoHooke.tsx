import { useState } from 'react'
import VisorZoom from '../VisorZoom.tsx'
import PantallaCompleta from '../PantallaCompleta.tsx'
import { useFlechas } from '../../lib/flechasDiagrama.ts'

// La lámina original de Micrographia (1665, dominio público), recortada por zonas con el viewBox.

type Zona = 'lamina' | 'a' | 'b'

const ZONAS: Record<Zona, { boton: string; vista: string; titulo: string; texto: string }> = {
  lamina: {
    boton: 'Lámina completa',
    vista: '0 0 850 1134',
    titulo: 'La lámina de Micrographia',
    texto: 'Arriba (Fig. 1) está el corcho en dos cortes distintos, A y B, dentro del círculo del microscopio. Abajo (Fig. 2) hay una planta sensitiva.',
  },
  a: {
    boton: 'Corte A',
    vista: '290 190 600 450',
    titulo: 'Corte A',
    texto: 'Las cavidades se ven redondeadas y apretadas, casi como un panal. Fíjate en que no son todas iguales: Hooke dibujó lo que veía, con sus irregularidades.',
  },
  b: {
    boton: 'Corte B',
    vista: '20 300 460 345',
    titulo: 'Corte B',
    texto: 'Aquí las cavidades son alargadas y están en filas ordenadas. Nuestra ilustración del corcho se parece a este corte.',
  },
}

export default function DibujoHooke() {
  const [zona, setZona] = useState<Zona>('lamina')
  const z = ZONAS[zona]
  // ← → pasan de la lámina completa al corte A y al corte B
  useFlechas((dir) => {
    const claves = Object.keys(ZONAS) as Zona[]
    setZona(claves[Math.max(0, Math.min(claves.length - 1, claves.indexOf(zona) + dir))])
    return true
  })
  return (
    <PantallaCompleta>
      <div className="mb-2 flex flex-wrap gap-2">
        {(Object.keys(ZONAS) as Zona[]).map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={zona === k}
            onClick={() => setZona(k)}
            className="min-h-10 rounded-lg border border-[var(--linea)] px-3 text-sm font-semibold aria-pressed:border-[var(--acento)] aria-pressed:bg-[var(--acento-suave)]/40"
          >
            {ZONAS[k].boton}
          </button>
        ))}
      </div>
      <VisorZoom etiqueta="Lámina de Micrographia" alto="aspect-[4/3]">
        <svg viewBox={z.vista} role="img" aria-label="Lámina de Micrographia con dos cortes de corcho (Fig. 1) y una planta sensitiva (Fig. 2)" className="h-full w-full bg-[#f3ead6]">
          <image href={`${import.meta.env.BASE_URL}imagenes/hooke-micrographia.jpg`} width="850" height="1134" />
        </svg>
      </VisorZoom>
      <div aria-live="polite" className="mt-2 rounded-xl bg-[var(--fondo)] p-3 text-sm">
        <p className="font-semibold">{z.titulo}</p>
        <p>{z.texto}</p>
      </div>
      <p className="mt-2 text-xs text-[var(--suave)]">Robert Hooke, Micrographia (1665). Obra de dominio público.</p>
    </PantallaCompleta>
  )
}
