# El jard�n de los recuerdos

Un herbario digital para guardar momentos de la vida cotidiana. Una tarde en el muelle se convierte en una flor azul de calma. Una foto familiar puede ser una rosa de amor. Al abrir el jard�n por primera vez aparecen diez recuerdos de ejemplo, entre ellos una visita a La Uni�n, un partido y una llamada antes de un parcial.

**Autor:** [DereckVentura](https://github.com/DereckVentura) � Laboratorio 3.

## Enlaces de la entrega

- [Repositorio p�blico](https://github.com/DereckVentura/el-jardin-de-los-recuerdos)
- [README](https://github.com/DereckVentura/el-jardin-de-los-recuerdos/blob/main/README.md)
- Sitio en Vercel pendiente de publicaci�n.

## Recorrido por la pantalla principal

En la portada hay un ramo interactivo y un bot�n **Plantar un recuerdo**. El ramo muestra una flor por cada emoci�n presente. Debajo, **Mi jard�n** muestra una ficha por recuerdo, con su flor, t�tulo, fecha y emoci�n. El buscador encuentra palabras del t�tulo, la frase y la categor�a, tambi�n cuando se escriben sin tildes. Se puede combinar con la emoci�n y el mes.

Al tocar una flor se abre su ficha. **Editar recuerdo** permite cambiar los cinco campos. **Arrancar flor** abre una segunda pantalla con el t�tulo del recuerdo y la opci�n de cancelar. La interfaz sigue el modo claro u oscuro del dispositivo y respeta la preferencia de movimiento reducido.

## Ejecutarlo en Windows

Desde la carpeta del proyecto, con Node.js 22 y npm:

```powershell
npm.cmd install
npm.cmd run dev
```

Abr� la direcci�n local que imprime Vite en la terminal. Para probar la compilaci�n que se entrega en Vercel:

```powershell
npm.cmd run build
npm.cmd run preview
```

En macOS, Linux o una terminal que acepta los lanzadores de npm, los comandos equivalentes son `npm install`, `npm run dev`, `npm run build` y `npm run preview`.

## Datos y decisiones

- **Vite y TypeScript** compilan una aplicaci�n web est�tica. La separaci�n MVC mantiene las consultas SQL en el modelo, el HTML y los SVG en la vista, y los eventos del usuario en el controlador.
- **sql.js** ejecuta SQLite en el navegador mediante WebAssembly. Vite publica el archivo WASM como un recurso del propio sitio. La aplicaci�n tambi�n incluye sus ilustraciones, estilos y favicon.
- La tabla `recuerdos` tiene los campos `id`, `titulo`, `texto`, `emocion`, `categoria`, `fecha` y `creado_en`. Las operaciones con datos del formulario usan par�metros SQL. La fecha del recuerdo se conserva tal como se eligi�.
- Despu�s de cada escritura, `db.export()` produce el archivo SQLite en memoria. Se codifica en base64 y se guarda en `localStorage` con la clave `jardin-recuerdos.sqlite.v1`. El sitio restaura esta copia en la pr�xima visita desde el mismo navegador, perfil y direcci�n.
- La semilla se instala �nicamente al crear una base nueva. Si se arranca la �ltima flor, el jard�n permanece vac�o al recargar. Si falla el guardado, el formulario conserva lo escrito y explica c�mo reintentar. Borrar los datos del navegador tambi�n borra los recuerdos de ese perfil.

## Rutas del proyecto

Las rutas parten de la ra�z del repositorio.

| Ruta | Contenido |
|---|---|
| `/index.html` | Documento de entrada en espa�ol |
| `/package.json` | Dependencias y comandos |
| `/vite.config.ts` | Configuraci�n de Vite con base `/` |
| `/tsconfig.json` | Comprobaci�n estricta de TypeScript |
| `/vercel.json` | Compilaci�n y directorio de publicaci�n |
| `/.gitignore` | Exclusiones de Git |
| `/public/favicon.ico` | �cono local |
| `/src/main.ts` | Inicio de la aplicaci�n y recuperaci�n ante errores |
| `/src/db/database.ts` | Esquema, conexi�n, exportaci�n y restauraci�n |
| `/src/db/semilla.ts` | Diez recuerdos iniciales |
| `/src/models/recuerdo.ts` | Modelo, operaciones CRUD y filtros |
| `/src/controllers/jardinController.ts` | Eventos, validaci�n y coordinaci�n |
| `/src/views/jardinView.ts` | Portada, colecci�n, fichas y formularios |
| `/src/views/floresSvg.ts` | Seis especies de flores e �conos |
| `/src/styles/styles.css` | Dise�o adaptable y temas claro y oscuro |
| `/playwright.config.ts` | Configuraci�n de navegador y tama�os de pantalla |
| `/tests/jardin.spec.ts` | Pruebas de interacci�n y persistencia |
| `/.github/workflows/verificar.yml` | Compilaci�n y pruebas al subir cambios |

## Despliegue

Importar este repositorio desde **Add New  Project** en Vercel. Seleccionar la rama `main`, la ra�z del repositorio, el preset **Vite**, el comando `npm run build` y la salida `dist`. El proyecto funciona sin variables de entorno ni servidor de base de datos. La integraci�n de Git despliega los nuevos commits de `main`.

## Comandos de Git por cambio

Estos comandos reproducen la agrupaci�n de los cambios en una copia de trabajo con los archivos correspondientes a cada etapa. El historial publicado se puede consultar con `git log --oneline`.

```sh
git add .gitignore index.html package.json tsconfig.json vercel.json vite.config.ts
git commit -m "Inicializo el proyecto con Vite y TypeScript y configuro Vercel"

git add src/db src/models
git commit -m "Agrego SQLite, diez recuerdos de ejemplo, persistencia y CRUD"

git add src/controllers src/views src/styles src/main.ts public/favicon.ico
git commit -m "Construyo el jard�n interactivo, sus flores y los formularios accesibles"

git add package.json .gitignore playwright.config.ts tests .github
git commit -m "Verifico compilaci�n y persistencia en escritorio y m�vil"

git add README.md
git commit -m "Documento el laboratorio y el recorrido de evaluaci�n"

git push origin main
```

## Verificaci�n en cinco minutos

| Paso | Resultado esperado |
|---|---|
| Abrir la URL p�blica en una ventana privada | Se ven el ramo y los diez recuerdos iniciales |
| Abrir la consola y recargar | La p�gina, el favicon y el WASM cargan sin errores ni 404 |
| Plantar un recuerdo | Aparece la flor y el contador pasa de 10 a 11 |
| Editar la emoci�n, la frase y la fecha | Cambian la ilustraci�n, el detalle y la fecha |
| Recargar | La flor conserva los cambios |
| Filtrar por emoci�n, mes y texto | Las fichas y el contador coinciden con la b�squeda |
| Arrancar la flor, confirmar y recargar | El contador vuelve a 10 y el recuerdo sigue eliminado |
| Abrir en m�vil y escritorio | La colecci�n se adapta y los botones son accesibles |
| Revisar GitHub y Vercel | Repositorio p�blico, historial de tres o m�s commits, README y compilaci�n de la misma rama |
| Preparar la entrega | Copiar los enlaces p�blicos al sitio, al repositorio y al README |

Para reproducir las pruebas autom�ticas en una instalaci�n local:

```powershell
npm.cmd run build
npx.cmd playwright install chromium
npm.cmd test
```

Cada prueba usa un contexto de navegador aislado. La suite comprueba el CRUD, la persistencia, los filtros combinados, la consola, la carga del favicon y el manejo de falta de espacio en escritorio y a 320 px.
