// La biblioteca: materias, unidades de cada materia y temas que todavía no existen.
// Los temas reales salen de los JSON de data/materias (campos `materia` y `area`).

export interface Materia {
  id: string
  nombre: string
  texto: string
}
export const MATERIAS: Materia[] = [
  { id: 'biologia', nombre: 'Biología', texto: 'La vida, de la célula al ecosistema.' },
  { id: 'quimica', nombre: 'Química', texto: 'La materia y sus cambios.' },
  { id: 'fisica', nombre: 'Física', texto: 'Movimiento, energía y ondas.' },
]

export interface Unidad {
  id: string
  nombre: string
  texto: string
}
/** Unidades por materia. Una unidad sin temas en los JSON se muestra como «próximamente». */
export const UNIDADES: Record<string, Unidad[]> = {
  biologia: [
    { id: 'celular', nombre: 'Biología celular', texto: 'De la teoría celular a los orgánulos y sus funciones.' },
    { id: 'genetica', nombre: 'Genética y biotecnología', texto: 'Herencia, ADN y sus aplicaciones.' },
    { id: 'ecosistemas', nombre: 'Relaciones ecosistémicas', texto: 'Cómo se relacionan los seres vivos entre sí y con su entorno.' },
    { id: 'evolucion', nombre: 'Evolución biológica', texto: 'Cómo cambian las especies con el tiempo.' },
    { id: 'ambiente', nombre: 'Dinámicas ambientales', texto: 'Ciclos, recursos y cuidado del ambiente.' },
  ],
}

/** Temas anunciados que aún no tienen contenido, por unidad. */
export const PROXIMOS: Record<string, { etiqueta: string; nombre: string }[]> = {
  celular: [
    { etiqueta: '4', nombre: 'Procesos celulares' },
    { etiqueta: '5', nombre: 'De la célula al organismo' },
    { etiqueta: '6', nombre: 'Técnicas de estudio' },
  ],
}
