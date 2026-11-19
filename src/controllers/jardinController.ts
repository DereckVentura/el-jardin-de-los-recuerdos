import { clave, type JardinDB } from '../db/database'
import { Modelo, type Recuerdo } from '../models/recuerdo'
import { Vista } from '../views/jardinView'

export function iniciar(conexion: JardinDB, vista: Vista) {
  const modelo = new Modelo(conexion)
  const sinFiltros = {buscar:'',emocion:'',mes:''}
  let seleccionado: Recuerdo | undefined
  let origen: HTMLElement | null = null
  let ocupado = false
  function dibujar(animar?:number) {
    vista.jardin(modelo.listar(sinFiltros), modelo.listar(vista.filtros()), animar)
  }
  function cerrar(id?:number) {
    vista.dialogo.close()
    const destino = id && vista.raiz.querySelector<HTMLElement>(`.ficha[data-id="${id}"]`)
    if (destino) destino.focus({preventScroll:true})
    else if (origen?.isConnected) origen.focus({preventScroll:true})
    else vista.raiz.querySelector<HTMLElement>('.plantar')?.focus({preventScroll:true})
  }
  const mensaje = (e:unknown) => e instanceof Error ? e.message : 'Hubo un problema. Intentá de nuevo.'
  async function escribir(accion:()=>Promise<void>) {
    if (ocupado) return
    ocupado=true
    try { await accion() } catch(e) { vista.error(mensaje(e)) } finally { ocupado=false }
  }
  vista.raiz.addEventListener('click', ev => {
    const boton = (ev.target as Element).closest<HTMLButtonElement>('button')
    if (!boton || ocupado) return
    if (boton.dataset.id) {
      origen=boton
      seleccionado=modelo.listar(sinFiltros).find(r => r.id===Number(boton.dataset.id))
      if (seleccionado) vista.detalle(seleccionado)
      return
    }
    switch(boton.dataset.accion) {
      case 'plantar': origen=boton; seleccionado=undefined; vista.formulario(); break
      case 'cerrar': cerrar(seleccionado?.id); break
      case 'editar': if (seleccionado) vista.formulario(seleccionado); break
      case 'confirmar': if (seleccionado) vista.confirmar(seleccionado); break
      case 'volver': if (seleccionado) vista.detalle(seleccionado); break
      case 'limpiar': vista.limpiar(); dibujar(); vista.raiz.querySelector<HTMLInputElement>('[name="buscar"]')?.focus(); break
      case 'arrancar': {
        const r = seleccionado
        if (r) void escribir(async () => { await modelo.arrancar(r); dibujar(); cerrar(); vista.aviso('Flor arrancada.') })
        break
      }
    }
  })
  vista.raiz.addEventListener('input',ev => {
    const el=ev.target as HTMLInputElement
    if (el.closest('.filtros')) dibujar()
    else if ('setCustomValidity' in el) el.setCustomValidity('')
  })
  vista.raiz.addEventListener('submit',ev => {
    ev.preventDefault()
    const form=ev.target as HTMLFormElement
    if (form.id!=='form-recuerdo') return
    for(const el of form.querySelectorAll<HTMLInputElement|HTMLTextAreaElement>('input,textarea')) {
      if (!el.value.trim()) { el.setCustomValidity('Completá este campo.'); el.reportValidity(); return }
    }
    void escribir(async () => {
      const d=vista.datos(form)
      const r=seleccionado
      const id=r ? await modelo.editar(r,d) : await modelo.plantar(d)
      vista.limpiar(); dibujar(id); cerrar(id); vista.aviso(r?'Cambios guardados.':'Recuerdo plantado.')
    })
  })
  vista.dialogo.addEventListener('cancel', ev => { ev.preventDefault(); if (!ocupado) cerrar(seleccionado?.id) })
  window.addEventListener('storage', e => {
    if(e.key===clave || e.key===null) {
      try { conexion.actualizar(); dibujar() } catch(error) { vista.aviso(mensaje(error)) }
    }
  })
  dibujar()
}
