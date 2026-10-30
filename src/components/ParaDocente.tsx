import type { Docente } from '../data/schema.ts'

/** Pestaña «Para el docente»: sugerencias para dar la clase. Solo aparece en modo docente. */
export default function ParaDocente({ docente: d, revisado }: { docente: Docente; revisado: boolean }) {
  return (
    <div className="space-y-3">
      {!revisado && <p className="text-xs text-[var(--suave)]">Sugerencias en borrador: revísalas y adáptalas a tu grupo.</p>}
      <p>
        <span className="font-semibold">Tiempo sugerido:</span> {d.minutos} min
      </p>
      <div>
        <p className="font-semibold">Para abrir la clase</p>
        <p>{d.abrir}</p>
      </div>
      <div>
        <p className="font-semibold">Actividad</p>
        <p>{d.actividad}</p>
      </div>
      <div>
        <p className="font-semibold">Errores frecuentes</p>
        <ul className="ml-5 list-disc">
          {d.errores.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
