import { Component, type ReactNode } from 'react'

/** Si algo falla al dibujar una parte, se muestra un aviso en ese lugar y el resto de la app sigue. */
export default class Resguardo extends Component<{ children: ReactNode; titulo?: string }, { fallo: boolean }> {
  state = { fallo: false }
  static getDerivedStateFromError() {
    return { fallo: true }
  }
  componentDidCatch(e: unknown) {
    console.error('Resguardo:', e)
  }
  render() {
    if (!this.state.fallo) return this.props.children
    return (
      <div role="alert" className="rounded-xl border border-[var(--linea)] bg-[var(--tarjeta)] p-4 text-sm">
        <p className="font-semibold">{this.props.titulo ?? 'Algo falló al mostrar esto.'}</p>
        <p className="text-[var(--suave)]">El resto de la app sigue funcionando. Cierra y vuelve a abrir, o recarga la página.</p>
        <button type="button" onClick={() => this.setState({ fallo: false })} className="mt-2 min-h-10 rounded-full border border-[var(--acento)] px-3 font-semibold text-[var(--acento)]">
          Intentar de nuevo
        </button>
      </div>
    )
  }
}
