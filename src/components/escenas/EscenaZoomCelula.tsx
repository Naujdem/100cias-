// Escena de zoom: la célula completa queda quieta y una «cámara» se acerca al orgánulo de cada fase.
// La fase «celula» muestra la célula entera; las demás usan los ids de PUNTOS_ANIMAL / PUNTOS_VEGETAL.
import { CelulaAnimalCompleta, CelulaVegetalCompleta, PUNTOS_ANIMAL, PUNTOS_VEGETAL } from '../ilustraciones/CelulaEuc.tsx'

const MAX = 3.2

export default function EscenaZoomCelula({ fase, vegetal = false }: { fase: string; vegetal?: boolean }) {
  const p = (vegetal ? PUNTOS_VEGETAL : PUNTOS_ANIMAL).find((x) => x.id === fase)
  const k = p ? Math.min(MAX, 105 / p.r) : 1
  const camara = p ? `translate(200px, 150px) scale(${k}) translate(${-p.x}px, ${-p.y}px)` : 'none'
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={p ? `Célula: ${p.nombre}` : 'Célula completa'} className="h-full w-full">
      <rect x="-1500" y="-1500" width="3400" height="3300" fill="#f3e7ef" />
      <g style={{ transition: 'transform 1.1s cubic-bezier(.45,.05,.25,1)', transform: camara }}>
        {vegetal ? <CelulaVegetalCompleta resalta={p?.id} /> : <CelulaAnimalCompleta resalta={p?.id} />}
      </g>
    </svg>
  )
}
