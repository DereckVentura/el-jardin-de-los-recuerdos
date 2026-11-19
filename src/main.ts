import './styles/styles.css'
import { conectar } from './db/database'
import { iniciar } from './controllers/jardinController'
import { Vista } from './views/jardinView'

const raiz = document.getElementById('app')!
async function abrirJardin() {
  try {
    const db = await conectar()
    iniciar(db,new Vista(raiz))
  } catch(error) {
    raiz.innerHTML = '<section class="ancho fallo"><h1>El jardín de los recuerdos</h1><p role="alert"></p><button class="primario">Volver a intentar</button></section>'
    raiz.querySelector('p')!.textContent = error instanceof Error && /jardín|navegador/.test(error.message)
      ? error.message : 'No se pudo abrir el jardín. Revisá la conexión y volvé a intentar.'
    raiz.querySelector('button')!.onclick = abrirJardin
  }
}
void abrirJardin()
