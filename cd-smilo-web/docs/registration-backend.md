# Formulario de inscripción → Google Drive

El formulario de `/inscripcion` recoge los datos del jugador/a, la **foto tipo
carné** y el **documento de identidad** (DNI/pasaporte, uno o varios archivos).
Como la web es estática (GitHub Pages, sin servidor), el envío lo procesa un
**Google Apps Script** publicado como app web bajo tu cuenta de Google.

Al enviar el formulario:

1. Los archivos se guardan en tu Drive con esta estructura, creando los niveles
   que falten y reutilizando los que ya existan:
   `/Deporte/Equipo/Nombre y apellidos — DNI-Pasaporte/`.
   El "Equipo" es categoría + género (p. ej. `Senior Masculino`), deducido del año
   de nacimiento y el sexo; fútbol y edades fuera de rango van a `Por asignar`.
2. Se añade **una fila** con todos los datos a una hoja de cálculo (tu "Excel").

Cualquiera puede rellenarlo y subir fotos **sin necesidad de cuenta de Google**.

---

## Puesta en marcha (una sola vez, ~5 min)

> **Importante:** el Apps Script, la hoja de cálculo y la carpeta de Drive deben
> estar **en la misma cuenta de Google**, y debes desplegar el script iniciando
> sesión en esa cuenta.

### 1. Carpeta de Drive

No hace falta crearla a mano ni copiar su ID: el script crea/usa la ruta indicada
en `ROOT_FOLDER_PATH` dentro de tu "Mi unidad" (por defecto
`INSCRIPCIONES 26/27 › DOCUMENTOS INSCRIPCIONES 26/27`).

### 2. Hoja de respuestas

Ya está creada y su ID puesto en `SHEET_ID`. No toques sus columnas: se rellenan
solas con la primera inscripción.

### 3. Crear el Apps Script

- Ve a [script.google.com](https://script.google.com) → **Nuevo proyecto**.
- Borra el contenido y pega el de [`apps-script/Code.gs`](apps-script/Code.gs)
  (ya trae la hoja y la ruta de carpeta rellenadas).
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
  La confirmación fiable de que todo llegó es la fila en la hoja de cálculo.
