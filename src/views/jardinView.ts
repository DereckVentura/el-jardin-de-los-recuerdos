import { emociones, type Emocion, type Filtros, type Recuerdo } from '../models/recuerdo'
import { flor, icono } from './floresSvg'

const opciones = Object.entries(emociones).map(([v,n]) => `<option value="${v}">${n}</option>`).join('')
export const escapar = (s: string) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!))
const fechaLarga = (s: string) => new Intl.DateTimeFormat('es-SV',{day:'numeric',month:'long',year:'numeric'}).format(new Date(s+'T12:00:00'))
const botonCerrar = `<button type="button" class="cerrar" data-accion="cerrar" aria-label="Cerrar">${icono('cerrar')}</button>`
export class Vista {
  readonly dialogo: HTMLDialogElement
  constructor(readonly raiz: HTMLElement) {
    raiz.innerHTML = `<header class="barra"><div class="ancho marca"><span class="sello">${icono('hoja')}</span>Mi herbario</div></header>
      <div class="ancho contenido">
        <section class="portada" aria-labelledby="principal"><div class="intro"><h1 id="principal">El jardín de los recuerdos</h1>
        <p>Cada recuerdo tiene una flor. Plantá los momentos que querés volver a visitar.</p>
        <button class="primario plantar" data-accion="plantar">${icono('mas')} Plantar un recuerdo</button></div>
        <div id="pradera" class="pradera" aria-label="Flores de tu jardín"></div></section>
        <section aria-labelledby="coleccion"><div class="cabecera"><h2 id="coleccion">Mi jardín</h2><span id="conteo" role="status"></span></div>
        <form class="filtros" role="search"><label class="busqueda">${icono('buscar')}<input name="buscar" type="search" aria-label="Buscar recuerdos" placeholder="Buscar recuerdos"></label>
        <label class="opcion"><span>Emoción</span><select name="emocion"><option value="">Todas</option>${opciones}</select></label>
        <label class="opcion"><span>Mes</span><input name="mes" aria-label="Mes" type="month"></label>
        <button type="button" class="limpiar" data-accion="limpiar" hidden>Limpiar filtros</button></form>
        <div id="flores" class="cuadricula"></div></section></div>
        <dialog class="hoja" aria-labelledby="titulo-hoja"></dialog><div class="aviso" role="status" aria-live="polite"></div>`
    this.dialogo = raiz.querySelector('dialog')!
  }
  filtros(): Filtros {
    const f = new FormData(this.raiz.querySelector<HTMLFormElement>('.filtros')!)
    return {buscar:String(f.get('buscar')),emocion:String(f.get('emocion')),mes:String(f.get('mes'))}
  }
  limpiar() { this.raiz.querySelector<HTMLFormElement>('.filtros')!.reset() }
  jardin(todos: Recuerdo[], lista: Recuerdo[], animar?: number) {
    const muestra = todos.filter((r,i) => todos.findIndex(x => x.emocion===r.emocion)===i)
    this.raiz.querySelector('#pradera')!.innerHTML = muestra.map((r,i) => `<button class="tallo t${i} ${animar===r.id?'crece':''}" data-id="${r.id}" aria-label="Abrir ${escapar(r.titulo)}, ${emociones[r.emocion]}" title="${escapar(r.titulo)} · ${emociones[r.emocion]}">${flor(r.emocion,true)}</button>`).join('')
    const filtrando = Object.values(this.filtros()).some(Boolean)
    this.raiz.querySelector<HTMLElement>('.limpiar')!.hidden = !filtrando
    this.raiz.querySelector('#conteo')!.textContent = filtrando ? `${lista.length} de ${todos.length} recuerdos` : `${lista.length} ${lista.length===1?'recuerdo':'recuerdos'}`
    this.raiz.querySelector('#flores')!.innerHTML = lista.map(r => `<button class="ficha ${animar===r.id?'crece':''}" data-id="${r.id}">
      <span class="lamina e-${r.emocion}">${flor(r.emocion,true)}<span class="abrir">${icono('flecha')}</span></span>
      <span class="pie"><span class="tipo">${emociones[r.emocion]}</span><strong>${escapar(r.titulo)}</strong>
      <span class="fecha">${fechaLarga(r.fecha)}</span></span></button>`).join('') || `<div class="vacio"><h3>${todos.length?'Ninguna flor coincide con tu búsqueda.':'Tu jardín está vacío.'}</h3><p>${todos.length?'Probá con otro mes, emoción o palabra.':'Planta tu primer recuerdo.'}</p></div>`
  }
  hoja(contenido:string) {
    this.dialogo.innerHTML = botonCerrar + contenido + '<p class="error" role="alert"></p>'
    if (!this.dialogo.open) this.dialogo.showModal()
    this.dialogo.querySelector<HTMLElement>('[data-inicio]')?.focus()
  }
  detalle(r: Recuerdo) {
    this.hoja(`<div class="muestra e-${r.emocion}">${flor(r.emocion)}</div><p class="tipo">${emociones[r.emocion]} · ${escapar(r.categoria)}</p>
      <h2 id="titulo-hoja" tabindex="-1" data-inicio>${escapar(r.titulo)}</h2><p class="fecha">${fechaLarga(r.fecha)}</p>
      <p class="relato">${escapar(r.texto)}</p><div class="acciones"><button data-accion="editar" class="primario">Editar recuerdo</button>
      <button data-accion="confirmar" class="secundario">Arrancar flor</button></div>`)
  }
  formulario(r?: Recuerdo) {
    const hoy = new Date()
    const fecha = r?.fecha ?? [hoy.getFullYear(),String(hoy.getMonth()+1).padStart(2,'0'),String(hoy.getDate()).padStart(2,'0')].join('-')
    this.hoja(`<h2 id="titulo-hoja">${r?'Editar recuerdo':'Plantar un recuerdo'}</h2>
      <form id="form-recuerdo"><label>Título<input data-inicio required maxlength="100" name="titulo" placeholder="¿Cómo llamarías a este momento?" value="${escapar(r?.titulo??'')}"></label>
      <label>Frase<textarea required maxlength="1600" name="texto" rows="3" placeholder="Lo que querés recordar…">${escapar(r?.texto??'')}</textarea></label>
      <div class="pareja"><label>Fecha<input required type="date" name="fecha" value="${escapar(fecha)}"></label>
      <label>Emoción<select required name="emocion"><option value="">Elegí una emoción</option>${opciones}</select></label></div>
      <label>Categoría<input required maxlength="60" name="categoria" placeholder="Por ejemplo, familia" value="${escapar(r?.categoria??'')}"></label>
      <div class="acciones"><button class="primario" type="submit">${r?'Guardar cambios':'Plantar recuerdo'}</button>
      <button class="secundario" type="button" data-accion="cerrar">Cancelar</button></div></form>`)
    this.dialogo.querySelector<HTMLSelectElement>('[name="emocion"]')!.value = r?.emocion ?? ''
  }
  confirmar(r: Recuerdo) {
    this.hoja(`<h2 id="titulo-hoja">¿Arrancar esta flor?</h2><p>Se eliminará «${escapar(r.titulo)}» de tu jardín. Esta acción es definitiva.</p>
      <div class="acciones"><button class="secundario" data-inicio data-accion="volver">Cancelar</button><button class="peligro" data-accion="arrancar">Arrancar esta flor</button></div>`)
  }
  datos(form: HTMLFormElement) {
    const f = new FormData(form)
    const valor = (n:string) => String(f.get(n)??'').trim()
    return {titulo:valor('titulo'),texto:valor('texto'),fecha:valor('fecha'),emocion:valor('emocion') as Emocion,categoria:valor('categoria')}
  }
  error(mensaje:string) { this.dialogo.querySelector('.error')!.textContent = mensaje }
  private reloj = 0
  aviso(mensaje:string) {
    const aviso = this.raiz.querySelector('.aviso')!
    aviso.textContent = mensaje
    window.clearTimeout(this.reloj)
    this.reloj = window.setTimeout(() => { aviso.textContent='' },4500)
  }
}
