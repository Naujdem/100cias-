import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/fraunces/wght.css'
import './index.css'
import App from './App.tsx'
import Resguardo from './components/Resguardo.tsx'

// Tras publicar una versión nueva, una pestaña abierta con la versión vieja pide archivos
// (p. ej. las diapositivas) que ya no existen. En ese caso se recarga una vez para traer la nueva.
window.addEventListener('vite:preloadError', (e) => {
  const clave = 'cien:recarga-version'
  const ultima = Number(sessionStorage.getItem(clave) ?? 0)
  if (Date.now() - ultima < 10_000) return // evita recargar en bucle si de verdad no hay red
  e.preventDefault()
  sessionStorage.setItem(clave, String(Date.now()))
  window.location.reload()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Resguardo titulo="La app tuvo un problema." recargar>
      <App />
    </Resguardo>
  </StrictMode>,
)
