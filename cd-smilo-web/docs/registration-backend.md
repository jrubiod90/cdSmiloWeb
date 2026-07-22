# Formulario de inscripción → Google Drive

El formulario de `/inscripcion` recoge los datos del jugador/a y **tres fotos**
(foto tipo carné, DNI/pasaporte anverso y reverso). Como la web es estática
(GitHub Pages, sin servidor), el envío lo procesa un **Google Apps Script**
publicado como app web bajo la cuenta de Google del club.

Al enviar el formulario:

1. Se crea en el Drive del club **una subcarpeta por jugador/a**
   (`Apellidos, Nombre — deporte — fecha`) con las fotos dentro.
2. Se añade **una fila** con todos los datos a una hoja de cálculo.
3. (Opcional) Se envía un **email de aviso** a `cdsmilogranada@gmail.com`.

Cualquiera puede rellenarlo y subir fotos **sin necesidad de cuenta de Google**.

---

## Puesta en marcha (una sola vez, ~5 min)

Todo se hace con la cuenta de Google del club (`cdsmilogranada@gmail.com`).

### 1. Crear la carpeta de Drive

- En [drive.google.com](https://drive.google.com) crea una carpeta, p. ej.
  **`Inscripciones 25-26`**.
- Ábrela y copia su **ID** de la URL:
  `https://drive.google.com/drive/folders/`**`ESTE_ES_EL_ID`**

### 2. Crear la hoja de respuestas

- En [sheets.google.com](https://sheets.google.com) crea una hoja nueva, p. ej.
  **`Inscripciones CD Smilo 25-26`**.
- Copia su **ID** de la URL:
  `https://docs.google.com/spreadsheets/d/`**`ESTE_ES_EL_ID`**`/edit`

### 3. Crear el Apps Script

- Ve a [script.google.com](https://script.google.com) → **Nuevo proyecto**.
- Borra el contenido y pega el de [`apps-script/Code.gs`](apps-script/Code.gs).
- Arriba del archivo, rellena:
  - `ROOT_FOLDER_ID` → el ID de la carpeta del paso 1.
  - `SHEET_ID` → el ID de la hoja del paso 2.
  - `NOTIFY_EMAIL` → deja `cdsmilogranada@gmail.com` o pon `''` para no recibir avisos.
- Guarda (💾).

### 4. Publicar como app web

- Botón **Implementar → Nueva implementación**.
- Tipo (engranaje) → **Aplicación web**.
- Configura:
  - **Ejecutar como:** *Yo* (la cuenta del club).
  - **Quién tiene acceso:** **Cualquier usuario**.
- **Implementar** → autoriza los permisos (Drive, Hoja, Gmail) cuando lo pida.
- Copia la **URL de la app web**, termina en `/exec`:
  `https://script.google.com/macros/s/XXXXXXXX/exec`

> ⚠️ Cada vez que cambies el código, usa **Implementar → Gestionar implementaciones
> → editar (lápiz) → Versión: nueva** para que los cambios entren en la MISMA URL.

### 5. Conectar la web con esa URL

La URL se pasa a la web mediante la variable `NEXT_PUBLIC_REGISTRATION_ENDPOINT`.

**En producción (GitHub Pages):**

- En el repositorio de GitHub → **Settings → Secrets and variables → Actions →
  New repository secret**.
- Nombre: `REGISTRATION_ENDPOINT` — Valor: la URL `/exec` del paso 4.
- Vuelve a lanzar el despliegue (haz un commit o **Actions → Deploy → Run workflow**).

El workflow ([`.github/workflows/deploy.yml`](../../.github/workflows/deploy.yml))
ya lee ese secreto.

**En local (para probar el envío real antes de subir):**

Crea un archivo `cd-smilo-web/.env.local` con:

```
NEXT_PUBLIC_REGISTRATION_ENDPOINT=https://script.google.com/macros/s/XXXXXXXX/exec
```

y arranca con `npm run dev`.

---

## Modo demo

Si **no** hay `NEXT_PUBLIC_REGISTRATION_ENDPOINT` configurada, el formulario
valida los campos y muestra la pantalla de "enviado", pero **no envía nada**.
Sirve para previsualizar el diseño antes de tener el backend listo.

---

## Notas

- **Fotos:** se reducen y recomprimen a JPEG en el navegador antes de subirse,
  así que un DNI fotografiado con el móvil pasa de varios MB a unos cientos de KB.
  Límite por archivo: 8 MB.
- **Privacidad (datos de menores):** el formulario incluye una casilla de
  consentimiento. Las carpetas y la hoja quedan en el Drive del club y **no**
  se comparten con nadie por defecto. Revisa periódicamente con quién están
  compartidas y borra la documentación cuando ya no sea necesaria.
- **Detección de errores:** por cómo responden los Apps Script, la web no puede
  leer la respuesta del servidor; da el envío por bueno si no hay error de red.
  La confirmación fiable de que todo llegó es la fila en la hoja / el email.
