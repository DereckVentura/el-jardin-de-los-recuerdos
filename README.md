# El jardín de los recuerdos

Un herbario digital para guardar momentos de la vida cotidiana. Una tarde en el muelle se convierte en una flor azul de calma. Una foto familiar puede ser una rosa de amor. Al abrir el jardín por primera vez aparecen diez recuerdos de ejemplo, entre ellos una visita a La Unión, un partido y una llamada antes de un parcial.

**Autor:** [DereckVentura](https://github.com/DereckVentura) · Laboratorio 3.

## Enlaces de la entrega

- [Repositorio público](https://github.com/DereckVentura/el-jardin-de-los-recuerdos)
- [README](https://github.com/DereckVentura/el-jardin-de-los-recuerdos/blob/main/README.md)
- [Sitio público en Vercel](https://el-jardin-de-los-recuerdos-seven.vercel.app)

## Recorrido por la pantalla principal

En la portada hay un ramo interactivo y un botón **Plantar un recuerdo**. El ramo muestra una flor por cada emoción presente. Debajo, **Mi jardín** muestra una ficha por recuerdo, con su flor, título, fecha y emoción. El buscador encuentra palabras del título, la frase y la categoría, también cuando se escriben sin tildes. Se puede combinar con la emoción y el mes.

Al tocar una flor se abre su ficha. **Editar recuerdo** permite cambiar los cinco campos. **Arrancar flor** abre una segunda pantalla con el título del recuerdo y la opción de cancelar. La interfaz sigue el modo claro u oscuro del dispositivo y respeta la preferencia de movimiento reducido.

## Ejecutarlo en Windows

Desde la carpeta del proyecto, con Node.js 22 y npm:

```powershell
npm.cmd install
npm.cmd run dev
```

Abrí la dirección local que imprime Vite en la terminal. Para probar la compilación que se entrega en Vercel:

```powershell
npm.cmd run build
npm.cmd run preview
```

En macOS, Linux o una terminal que acepta los lanzadores de npm, los comandos equivalentes son `npm install`, `npm run dev`, `npm run build` y `npm run preview`.

## Datos y decisiones

- **Vite y TypeScript** compilan una aplicación web estática. La separación MVC mantiene las consultas SQL en el modelo, el HTML y los SVG en la vista, y los eventos del usuario en el controlador.
- **sql.js** ejecuta SQLite en el navegador mediante WebAssembly. Vite publica el archivo WASM como un recurso del propio sitio. La aplicación también incluye sus ilustraciones, estilos y favicon.
- La tabla `recuerdos` tiene los campos `id`, `titulo`, `texto`, `emocion`, `categoria`, `fecha` y `creado_en`. Las operaciones con datos del formulario usan parámetros SQL. La fecha del recuerdo se conserva tal como se eligió.
- Después de cada escritura, `db.export()` produce el archivo SQLite en memoria. Se codifica en base64 y se guarda en `localStorage` con la clave `jardin-recuerdos.sqlite.v1`. El sitio restaura esta copia en la próxima visita desde el mismo navegador, perfil y dirección.
- La semilla se instala únicamente al crear una base nueva. Si se arranca la última flor, el jardín permanece vacío al recargar. Si falla el guardado, el formulario conserva lo escrito y explica cómo reintentar. Borrar los datos del navegador también borra los recuerdos de ese perfil.

## Rutas del proyecto

Las rutas parten de la raíz del repositorio.

| Ruta | Contenido |
|---|---|
| `/index.html` | Documento de entrada en español |
| `/package.json` | Dependencias y comandos |
| `/vite.config.ts` | Configuración de Vite con base `/` |
| `/tsconfig.json` | Comprobación estricta de TypeScript |
| `/vercel.json` | Compilación y directorio de publicación |
| `/.gitignore` | Exclusiones de Git |
| `/public/favicon.ico` | Ícono local |
| `/src/main.ts` | Inicio de la aplicación y recuperación ante errores |
| `/src/db/database.ts` | Esquema, conexión, exportación y restauración |
| `/src/db/semilla.ts` | Diez recuerdos iniciales |
| `/src/models/recuerdo.ts` | Modelo, operaciones CRUD y filtros |
| `/src/controllers/jardinController.ts` | Eventos, validación y coordinación |
| `/src/views/jardinView.ts` | Portada, colección, fichas y formularios |
| `/src/views/floresSvg.ts` | Seis especies de flores e íconos |
| `/src/styles/styles.css` | Diseño adaptable y temas claro y oscuro |
| `/playwright.config.ts` | Configuración de navegador y tamaños de pantalla |
| `/tests/jardin.spec.ts` | Pruebas de interacción y persistencia |
| `/.github/workflows/verificar.yml` | Compilación y pruebas al subir cambios |

## Despliegue

Importar este repositorio desde **Add New → Project** en Vercel. Seleccionar la rama `main`, la raíz del repositorio, el preset **Vite**, el comando `npm run build` y la salida `dist`. El proyecto funciona sin variables de entorno ni servidor de base de datos. La integración de Git despliega los nuevos commits de `main`.

## Comandos de Git por cambio

Estos comandos reproducen la agrupación de los cambios en una copia de trabajo con los archivos correspondientes a cada etapa. El historial publicado se puede consultar con `git log --oneline`.

```sh
git add .gitignore index.html package.json tsconfig.json vercel.json vite.config.ts
git commit -m "Inicializo el proyecto con Vite y TypeScript y configuro Vercel"

git add src/db src/models
git commit -m "Agrego SQLite, diez recuerdos de ejemplo, persistencia y CRUD"

git add src/controllers src/views src/styles src/main.ts public/favicon.ico
git commit -m "Construyo el jardín interactivo, sus flores y los formularios accesibles"

git add package.json .gitignore playwright.config.ts tests .github
git commit -m "Verifico compilación y persistencia en escritorio y móvil"

git add src/views/jardinView.ts
git commit -m "Restauro los acentos y signos de la interfaz"

git add README.md
git commit -m "Documento el laboratorio y el recorrido de evaluación"

# Tras verificar la publicación
git add README.md
git commit -m "Agrego el enlace público de Vercel al README"

git push origin main
```

## Verificación en cinco minutos

| Paso | Resultado esperado |
|---|---|
| Abrir la URL pública en una ventana privada | Se ven el ramo y los diez recuerdos iniciales |
| Abrir la consola y recargar | La página, el favicon y el WASM cargan sin errores ni 404 |
| Plantar un recuerdo | Aparece la flor y el contador pasa de 10 a 11 |
| Editar la emoción, la frase y la fecha | Cambian la ilustración, el detalle y la fecha |
| Recargar | La flor conserva los cambios |
| Filtrar por emoción, mes y texto | Las fichas y el contador coinciden con la búsqueda |
| Arrancar la flor, confirmar y recargar | El contador vuelve a 10 y el recuerdo sigue eliminado |
| Abrir en móvil y escritorio | La colección se adapta y los botones son accesibles |
| Revisar GitHub y Vercel | Repositorio público, historial de tres o más commits, README y compilación de la misma rama |
| Preparar la entrega | Copiar los enlaces públicos al sitio, al repositorio y al README |

Para reproducir las pruebas automáticas en una instalación local:

```powershell
npm.cmd run build
npx.cmd playwright install chromium
npm.cmd test
```

Cada prueba usa un contexto de navegador aislado. La suite comprueba el CRUD, la persistencia, los filtros combinados, la consola, la carga del favicon y el manejo de falta de espacio en escritorio y a 320 px.
