import { insertar, type JardinDB } from '../db/database'

export const emociones = {
  alegria: 'Alegría', nostalgia: 'Nostalgia', amor: 'Amor',
  calma: 'Calma', tristeza: 'Tristeza', gratitud: 'Gratitud',
} as const
export type Emocion = keyof typeof emociones
export interface Datos {
  titulo: string
  texto: string
  emocion: Emocion
  categoria: string
  fecha: string
}
export interface Recuerdo extends Datos { id: number }
export interface Filtros { buscar: string; emocion: string; mes: string }

function campos(d: Datos) {
  const valores = [d.titulo.trim(), d.texto.trim(), d.emocion, d.categoria.trim(), d.fecha]
  if (valores.some(v => !v) || !(d.emocion in emociones) || !/^\d{4}-\d{2}-\d{2}$/.test(d.fecha)) {
    throw new Error('Completá los cinco campos del recuerdo.')
  }
  return valores
}
export class Modelo {
  constructor(private conexion: JardinDB) {}
  listar(f: Filtros): Recuerdo[] {
    const consulta = this.conexion.leer().prepare(`SELECT id,titulo,texto,emocion,categoria,fecha FROM recuerdos
      WHERE (? = '' OR emocion = ?) AND (? = '' OR substr(fecha,1,7) = ?)
      ORDER BY fecha DESC, id DESC`)
    const registros: Recuerdo[] = []
    const normalizar = (s: string) => s.normalize('NFD').replace(/\p{M}/gu,'').toLocaleLowerCase('es')
    const buscar = normalizar(f.buscar.trim())
    try {
      consulta.bind([f.emocion,f.emocion,f.mes,f.mes])
      while (consulta.step()) {
        const r = consulta.getAsObject() as unknown as Recuerdo
        if (normalizar([r.titulo,r.texto,r.categoria].join(' ')).includes(buscar)) registros.push(r)
      }
    } finally { consulta.free() }
    return registros
  }
  plantar(d: Datos) {
    return this.conexion.escribir(db => {
      db.run(insertar, campos(d))
      return Number(db.exec('SELECT last_insert_rowid()')[0].values[0][0])
    })
  }
  editar(r: Recuerdo, d: Datos) {
    return this.conexion.escribir(db => {
      db.run(`UPDATE recuerdos SET titulo=?,texto=?,emocion=?,categoria=?,fecha=?
        WHERE id=? AND titulo=? AND texto=? AND emocion=? AND categoria=? AND fecha=?`, [...campos(d),r.id,...campos(r)])
      if (!db.getRowsModified()) throw new Error('Este recuerdo cambió en otra pestaña. Cerrá la ficha y abrila de nuevo.')
      return r.id
    })
  }
  arrancar(r: Recuerdo) {
    return this.conexion.escribir(db => {
      db.run('DELETE FROM recuerdos WHERE id=? AND titulo=? AND texto=? AND emocion=? AND categoria=? AND fecha=?',[r.id,...campos(r)])
      if (!db.getRowsModified()) throw new Error('El recuerdo cambió en otra pestaña. Revisá su ficha antes de arrancarlo.')
    })
  }
}
