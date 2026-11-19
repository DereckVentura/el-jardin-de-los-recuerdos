import initSqlJs, { type Database, type SqlJsStatic } from 'sql.js'
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'
import { semilla } from './semilla'

export const clave = 'jardin-recuerdos.sqlite.v1'
const esquema = `CREATE TABLE recuerdos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL, texto TEXT NOT NULL,
  emocion TEXT NOT NULL CHECK (emocion IN ('alegria','nostalgia','amor','calma','tristeza','gratitud')),
  categoria TEXT NOT NULL, fecha TEXT NOT NULL,
  creado_en TEXT NOT NULL DEFAULT (datetime('now'))
)`
export const insertar = 'INSERT INTO recuerdos (titulo,texto,emocion,categoria,fecha) VALUES (?,?,?,?,?)'

function guardar(db: Database) {
  const bytes = db.export()
  const partes: string[] = []
  for (let i = 0; i < bytes.length; i += 8192) {
    partes.push(String.fromCharCode(...bytes.subarray(i, i + 8192)))
  }
  try {
    localStorage.setItem(clave, btoa(partes.join('')))
  } catch {
    throw new Error('No se pudo guardar. Permití el almacenamiento o liberá espacio en este navegador y volvé a intentar.')
  }
}

function abrir(SQL: SqlJsStatic): Database {
  let guardado: string | null
  try { guardado = localStorage.getItem(clave) }
  catch { throw new Error('El navegador bloqueó el almacenamiento. Permitilo para abrir tu jardín.') }
  if (guardado !== null) {
    try {
      const db = new SQL.Database(Uint8Array.from(atob(guardado), c => c.charCodeAt(0)))
      db.exec('SELECT id,titulo,texto,emocion,categoria,fecha FROM recuerdos LIMIT 1')
      return db
    } catch { throw new Error('No se pudo leer el jardín guardado. La copia original sigue en este navegador.') }
  }
  const db = new SQL.Database()
  db.run(esquema)
  semilla.forEach(fila => db.run(insertar, fila))
  guardar(db)
  return db
}

function exclusiva<T>(tarea: () => T): Promise<T> {
  return navigator.locks ? navigator.locks.request(clave, tarea) : Promise.resolve().then(tarea)
}

export async function conectar() {
  const SQL = await initSqlJs({ locateFile: () => wasmUrl })
  let actual = await exclusiva(() => abrir(SQL))
  function sustituir(nueva: Database) { actual.close(); actual = nueva }
  return {
    leer: () => actual,
    actualizar: () => sustituir(abrir(SQL)),
    escribir: <T>(operacion: (db: Database) => T) => exclusiva(() => {
      // Trabajar sobre la última copia evita perder cambios de otra pestaña.
      const candidata = abrir(SQL)
      try {
        const resultado = operacion(candidata)
        guardar(candidata)
        sustituir(candidata)
        return resultado
      } catch (error) { candidata.close(); throw error }
    }),
  }
}
export type JardinDB = Awaited<ReturnType<typeof conectar>>
