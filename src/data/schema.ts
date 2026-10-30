// ESQUEMA DE DATOS de 100cias
// Idea central: cada tema guarda TODO su contenido; cada curso o docente
// decide qué se activa mediante un perfil (casillas). Los grados son
// etiquetas en los perfiles, no carpetas.

export type Nivel = 'basico' | 'intermedio' | 'avanzado'

export interface Pregunta {
  id: string
  enunciado: string
  opciones: string[]
  /** índice de la opción correcta dentro de `opciones` */
  correcta: number
  /** por qué la correcta es correcta (y, si aplica, el error típico) */
  explicacion: string
}

/**
 * Resumen opcional «para el cuaderno»: frases cortas para dictar o decir en clase.
 * Los niveles se suman: Fácil muestra `facil`; Media, `facil` + `media`; Avanzada, las tres listas.
 */
export interface Cuaderno {
  /** lo más importante */
  facil: string[]
  /** detalles que se suman a lo fácil */
  media: string[]
  /** más detalles que se suman a lo anterior */
  avanzada: string[]
}

/** Sugerencias de clase para un bloque. Todo en borrador hasta que el docente lo revise. */
export interface Docente {
  /** pregunta para abrir la clase */
  abrir: string
  /** qué hacer con el diagrama o la actividad */
  actividad: string
  /** ideas equivocadas frecuentes */
  errores: string[]
  /** tiempo sugerido, en minutos */
  minutos: number
}

export interface Ficha {
  quien?: string
  cuando?: string
  /** la idea central en una o dos frases */
  idea: string
  evidencia?: string[]
  limites?: string
  /** datos de contexto breves (título + texto) que se muestran bajo la idea, en la pestaña Historia */
  contexto?: { titulo: string; texto: string }[]
  /** resumen por niveles de lectura (pestaña opcional «Para el cuaderno») */
  cuaderno?: Cuaderno
  /** sugerencias para quien da la clase (pestaña «Para el docente», solo en modo docente) */
  docente?: Docente
  /** comparación opcional (p. ej. la célula como una ciudad), que se muestra si se activan las analogías */
  analogia?: { titulo: string; texto: string }
}

export interface Autor {
  nombre: string
  vida?: string
  aporte: string
  /** ruta de una imagen libre de derechos (retrato o ilustración); si falta, se muestra una silueta ilustrada */
  imagen?: string
  /** línea corta, siempre visible, sobre la naturaleza de la imagen (p. ej. «Reconstrucción moderna») */
  pieImagen?: string
  /** autor y licencia de la imagen, p. ej. «Pintura anónima, dominio público (Wikimedia Commons)» */
  credito?: string
}

/** Imagen que acompaña a un hito: ilustración SVG propia o imagen de archivo. Se abre en un visor con zoom. */
export interface Ilustracion {
  id: string
  titulo: string
  /** texto que se muestra al abrirla */
  pie: string
  tipo: 'svg' | 'imagen'
  /** tipo svg: clave en components/ilustraciones; tipo imagen: ruta dentro de public/ */
  recurso: string
  alt?: string
  credito?: string
}

/** Unidad mínima de contenido que se puede activar o desactivar. */
export interface Bloque {
  id: string
  titulo: string
  resumen: string
  /** año usado para ordenar la línea de tiempo (en temas que no son históricos, el número de orden) */
  anio: number
  /** texto que se muestra en lugar del año (p. ej. «Nivel 3») */
  etiqueta?: string
  nivel: Nivel
  /** si es true, no se puede desactivar (lo esencial del tema) */
  nucleo?: boolean
  /** ids de bloques del mismo tema que deben estar activos para que éste tenga sentido */
  requiere?: string[]
  ficha: Ficha
  autores?: Autor[]
  ilustraciones?: Ilustracion[]
  /** id del diagrama interactivo que se muestra en la pestaña «Diagrama» (ver components/diagramas) */
  diagrama?: string
  /** las preguntas solo entran al quiz si el bloque está activo */
  preguntas: Pregunta[]
  /** false = borrador pendiente de verificación humana contra una fuente */
  revisado: boolean
}

export interface Tema {
  id: string
  materia: string
  area: string
  titulo: string
  subtema: string
  fuentes: string[]
  /** posición del subtema dentro de su área (para el selector) */
  orden?: number
  /** numeración corta que se muestra en el selector, p. ej. «1.1» */
  etiqueta?: string
  /** vistas permitidas (ids de components/linea/vistas); por defecto las de línea de tiempo */
  vistas?: string[]
  /** título de la sección que muestra los bloques; por defecto «Línea de tiempo» */
  tituloVista?: string
  /** cómo se llama cada bloque en el contador («Hito», «Nivel»); por defecto «Hito» */
  unidad?: string
  /** si es true, el subtema se puede ver también como diapositivas (se arman a partir de las fichas) */
  diapositivas?: boolean
  /** lo que el estudiante podrá hacer al terminar el subtema (se muestra en la guía, antes del contenido) */
  objetivos?: string[]
  bloques: Bloque[]
}

/** Parte de un dibujo SVG que se puede encender o apagar (p. ej. un orgánulo). */
export interface Capa {
  id: string
  nombre: string
  nivel: Nivel
  /** ids de capas que deben estar visibles si ésta lo está */
  requiere?: string[]
  /** ficha que se abre al tocar la capa; puede variar según el nivel activo */
  fichas: Partial<Record<Nivel, string>>
}

export interface Dibujo {
  id: string
  titulo: string
  capas: Capa[]
}

/** Configuración reutilizable: qué bloques y qué nivel de dibujo se muestran. */
export interface Perfil {
  id: string
  nombre: string
  /** texto general, por si un subtema no tiene el suyo */
  descripcion: string
  /** por subtema (id del tema): qué muestra este perfil ahí */
  descripciones?: Record<string, string>
  /** por tema: ids de bloques activos */
  bloques: Record<string, string[]>
  nivelDibujo: Nivel
}
