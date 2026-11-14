import { useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent, type Editor as TipTap } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { guardar, leer } from '../lib/almacen.ts'

const CLAVE_DOC = 'cien:editor-doc'
const CLAVE_TITULO = 'cien:editor-titulo'
const LADO_MAX = 1200 // px: las imágenes se reducen para que quepan en el almacenamiento del navegador

/** Reduce la imagen y la devuelve como data URL (JPEG, o PNG si tiene transparencia). */
function prepararImagen(archivo: File): Promise<string> {
  return new Promise((resolver, rechazar) => {
    const url = URL.createObjectURL(archivo)
    const img = new window.Image()
    img.onload = () => {
      const escala = Math.min(1, LADO_MAX / Math.max(img.width, img.height))
      const lienzo = document.createElement('canvas')
      lienzo.width = Math.round(img.width * escala)
      lienzo.height = Math.round(img.height * escala)
      lienzo.getContext('2d')!.drawImage(img, 0, 0, lienzo.width, lienzo.height)
      URL.revokeObjectURL(url)
      const png = archivo.type === 'image/png' || archivo.type === 'image/svg+xml'
      resolver(png ? lienzo.toDataURL('image/png') : lienzo.toDataURL('image/jpeg', 0.82))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      rechazar(new Error('No se pudo leer la imagen'))
    }
    img.src = url
  })
}

async function insertarImagenes(editor: TipTap, archivos: File[]) {
  for (const a of archivos.filter((f) => f.type.startsWith('image/'))) {
    const src = await prepararImagen(a)
    editor.chain().focus().setImage({ src, alt: a.name }).run()
  }
}

function Boton({ activo, onClick, titulo, children }: { activo?: boolean; onClick: () => void; titulo: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={titulo}
      aria-label={titulo}
      aria-pressed={activo}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="min-h-9 min-w-9 rounded-lg border border-[var(--linea)] bg-[var(--tarjeta)] px-2 text-sm font-semibold aria-pressed:border-[var(--acento)] aria-pressed:bg-[var(--acento-suave)]/50"
    >
      {children}
    </button>
  )
}

/** Editor tipo Word: el documento se guarda solo en este navegador y se descarga como PDF al imprimir. */
export default function Editor({ onCerrar }: { onCerrar: () => void }) {
  const [titulo, setTitulo] = useState(() => leer(CLAVE_TITULO, 'Guía de clase'))
  const [aviso, setAviso] = useState('')
  const entrada = useRef<HTMLInputElement>(null)
  const temporizador = useRef<ReturnType<typeof setTimeout>>(undefined)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Image.configure({ allowBase64: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: leer<string>(CLAVE_DOC, '<h1>Título</h1><p>Empieza a escribir aquí…</p>'),
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: { class: 'hoja-contenido focus:outline-none', spellcheck: 'true', lang: 'es' },
      handlePaste: (_vista, e) => {
        const archivos = Array.from(e.clipboardData?.files ?? [])
        if (!archivos.some((f) => f.type.startsWith('image/')) || !editorRef.current) return false
        insertarImagenes(editorRef.current, archivos)
        return true
      },
      handleDrop: (_vista, e) => {
        const archivos = Array.from((e as DragEvent).dataTransfer?.files ?? [])
        if (!archivos.some((f) => f.type.startsWith('image/')) || !editorRef.current) return false
        e.preventDefault()
        insertarImagenes(editorRef.current, archivos)
        return true
      },
    },
    onUpdate: ({ editor }) => {
      clearTimeout(temporizador.current)
      temporizador.current = setTimeout(() => {
        guardar(CLAVE_DOC, editor.getHTML())
        // si el navegador no tiene espacio (muchas imágenes), guardar() falla en silencio: avisamos
        setAviso(leer<string>(CLAVE_DOC, '') === editor.getHTML() ? '' : 'No se pudo guardar: el documento es muy grande. Descárgalo en PDF para no perderlo.')
      }, 600)
    },
  })
  const editorRef = useRef<TipTap | null>(null)
  editorRef.current = editor

  useEffect(() => guardar(CLAVE_TITULO, titulo), [titulo])

  const descargarPdf = () => {
    const anterior = document.title
    document.title = titulo.trim() || 'documento' // el navegador lo usa como nombre del PDF
    window.print()
    document.title = anterior
  }

  const nuevo = () => {
    if (!editor || !confirm('¿Borrar todo y empezar un documento nuevo?')) return
    editor.commands.setContent('<p></p>')
    guardar(CLAVE_DOC, '<p></p>')
  }

  if (!editor) return null
  const e = editor
  const c = () => e.chain().focus()

  return (
    <div>
      <div className="no-imprimir mb-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={onCerrar} className="min-h-11 rounded-xl border border-[var(--linea)] bg-[var(--tarjeta)] px-4 text-sm font-semibold">
          ← Volver
        </button>
        <input
          value={titulo}
          onChange={(ev) => setTitulo(ev.target.value)}
          aria-label="Nombre del archivo"
          className="min-h-11 flex-1 rounded-xl border border-[var(--linea)] bg-[var(--tarjeta)] px-3 text-sm"
        />
        <button type="button" onClick={descargarPdf} className="min-h-11 rounded-xl bg-[var(--acento)] px-4 text-sm font-semibold text-[var(--sobre-acento)]">
          Descargar PDF
        </button>
      </div>

      <div className="no-imprimir sticky top-0 z-10 mb-3 flex flex-wrap gap-1 rounded-xl border border-[var(--linea)] bg-[var(--fondo,#f6f7f4)] p-2">
        <Boton titulo="Deshacer" onClick={() => c().undo().run()}>↶</Boton>
        <Boton titulo="Rehacer" onClick={() => c().redo().run()}>↷</Boton>
        <span className="mx-1 w-px bg-[var(--linea)]" />
        <Boton titulo="Título" activo={e.isActive('heading', { level: 1 })} onClick={() => c().toggleHeading({ level: 1 }).run()}>T1</Boton>
        <Boton titulo="Subtítulo" activo={e.isActive('heading', { level: 2 })} onClick={() => c().toggleHeading({ level: 2 }).run()}>T2</Boton>
        <Boton titulo="Apartado" activo={e.isActive('heading', { level: 3 })} onClick={() => c().toggleHeading({ level: 3 }).run()}>T3</Boton>
        <span className="mx-1 w-px bg-[var(--linea)]" />
        <Boton titulo="Negrita" activo={e.isActive('bold')} onClick={() => c().toggleBold().run()}><b>N</b></Boton>
        <Boton titulo="Cursiva" activo={e.isActive('italic')} onClick={() => c().toggleItalic().run()}><i>K</i></Boton>
        <Boton titulo="Subrayado" activo={e.isActive('underline')} onClick={() => c().toggleUnderline().run()}><u>S</u></Boton>
        <Boton titulo="Tachado" activo={e.isActive('strike')} onClick={() => c().toggleStrike().run()}><s>ab</s></Boton>
        <span className="mx-1 w-px bg-[var(--linea)]" />
        <Boton titulo="Lista con viñetas" activo={e.isActive('bulletList')} onClick={() => c().toggleBulletList().run()}>• —</Boton>
        <Boton titulo="Lista numerada" activo={e.isActive('orderedList')} onClick={() => c().toggleOrderedList().run()}>1.</Boton>
        <Boton titulo="Cita" activo={e.isActive('blockquote')} onClick={() => c().toggleBlockquote().run()}>❝</Boton>
        <span className="mx-1 w-px bg-[var(--linea)]" />
        <Boton titulo="Alinear a la izquierda" activo={e.isActive({ textAlign: 'left' })} onClick={() => c().setTextAlign('left').run()}>⇤</Boton>
        <Boton titulo="Centrar" activo={e.isActive({ textAlign: 'center' })} onClick={() => c().setTextAlign('center').run()}>↔</Boton>
        <Boton titulo="Alinear a la derecha" activo={e.isActive({ textAlign: 'right' })} onClick={() => c().setTextAlign('right').run()}>⇥</Boton>
        <Boton titulo="Justificar" activo={e.isActive({ textAlign: 'justify' })} onClick={() => c().setTextAlign('justify').run()}>☰</Boton>
        <span className="mx-1 w-px bg-[var(--linea)]" />
        <Boton titulo="Insertar imagen" onClick={() => entrada.current?.click()}>🖼 Imagen</Boton>
        <Boton titulo="Línea divisoria" onClick={() => c().setHorizontalRule().run()}>―</Boton>
        <Boton titulo="Documento nuevo" onClick={nuevo}>Nuevo</Boton>
        <input
          ref={entrada}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(ev) => {
            insertarImagenes(e, Array.from(ev.target.files ?? []))
            ev.target.value = ''
          }}
        />
      </div>

      {aviso && <p role="alert" className="no-imprimir mb-3 rounded-lg bg-amber-100 p-2 text-sm text-amber-900">{aviso}</p>}

      <div className="hoja mx-auto rounded-xl border border-[var(--linea)] bg-white p-8 shadow-sm sm:p-12">
        <EditorContent editor={e} />
      </div>
      <p className="no-imprimir mt-3 text-center text-xs opacity-70">
        Se guarda solo en este navegador. Puedes pegar o arrastrar imágenes. En «Descargar PDF», elige «Guardar como PDF».
      </p>
    </div>
  )
}
