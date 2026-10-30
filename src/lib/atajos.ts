import { createContext, useContext } from 'react'

/** Permite a una lámina llevar a otro tema o ficha. Lo provee App, que conoce todos los temas. */
export interface Atajos {
  existe: (temaId: string) => boolean
  ir: (temaId: string, bloqueId?: string) => void
}

export const ContextoAtajos = createContext<Atajos | null>(null)
export const useAtajos = () => useContext(ContextoAtajos)
