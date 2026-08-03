/**
 * C.D SMILO — Backend de inscripciones (Google Apps Script)
 * ---------------------------------------------------------
 * Recibe el formulario de /inscripcion de la web, guarda las fotos en una
 * carpeta del Drive del club (una subcarpeta por jugador/a) y añade una fila
 * con todos los datos a una hoja de cálculo. Opcionalmente avisa por email.
 *
 * Cómo desplegarlo: ver docs/registration-backend.md
 */

// 1) Carpeta de tu "Mi unidad" donde se guardará todo, indicada como ruta.
//    El script crea las carpetas que falten y reutiliza las que ya existan.
//    Dentro de ella se crean las subcarpetas /Deporte/Categoría/Jugador.
const ROOT_FOLDER_PATH = ['Inscripciones 26/27', 'DOCUMENTOS INSCRIPCIONES 26/27']

// 2) ID de la hoja de cálculo de respuestas.
//    (lo copias de la URL de la hoja: .../spreadsheets/d/ESTE_ID/edit)
const SHEET_ID = '1NJR5Dmx_6afpO2uOI1cd0lsRNrmSV2ylUx_qIgb1e_g'

// 3) Email al que avisar de cada inscripción nueva. Deja '' para no avisar.
const NOTIFY_EMAIL = 'cdsmilogranada@gmail.com'

const TIMEZONE = 'Europe/Madrid'

// Orden y etiquetas de las columnas de la hoja.
const COLUMNS = [
  ['submittedAt', 'Fecha de envío'],
  ['fullName', 'Nombre y apellidos'],
  ['dni', 'DNI / Pasaporte'],
  ['nationality', 'Nacionalidad'],
  ['birthDate', 'Fecha de nacimiento'],
  ['sex', 'Sexo'],
  ['guardianPhone', 'Teléfono (tutor)'],
  ['playerPhone', 'Teléfono jugador/a'],
  ['guardianEmail', 'Email (tutor)'],
  ['playerEmail', 'Email jugador/a'],
  ['address', 'Domicilio'],
  ['school', 'Centro de estudios'],
  ['sport', 'Deporte'],
  ['category', 'Categoría'],
  ['compete', '¿Compite?'],
  ['previousTeam', 'Equipo de procedencia'],
  ['otherInfo', 'Otros datos'],
  ['needsKit', '¿Necesita ropa?'],
  ['kitMode', 'Pack / prendas sueltas'],
  ['gameGarments', 'Prendas de juego'],
  ['extras', 'Otra ropa / accesorios'],
  ['size', 'Talla'],
  ['sizeDetails', 'Tallas diferentes'],
  ['stockDetails', 'Stock'],
  ['consent', 'Consentimiento'],
  ['documents', 'Documentos (Drive)'],
]

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonOutput({ ok: false, error: 'Sin datos' })
    }

    const body = JSON.parse(e.postData.contents)
    const fields = body.fields || {}
    const files = body.files || []

    // Estructura: <ruta base>/Deporte/Categoría/"Nombre y apellidos — DNI/Pasaporte".
    // Cada nivel se reutiliza si ya existe (no se duplican carpetas).
    const root = resolveRootFolder()
    const stamp = Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd HH:mm')
    const safeName = String(fields.fullName || 'Sin nombre').replace(/[\\/:*?"<>|]+/g, ' ').trim()
    const safeDni = String(fields.dni || 'sin-documento').replace(/[\\/:*?"<>|]+/g, ' ').trim()
    const sportFolder = getOrCreateFolder(root, cleanName(fields.sport, 'Sin deporte'))
    const categoryFolder = getOrCreateFolder(sportFolder, cleanName(fields.category, 'Por asignar'))
    const folder = getOrCreateFolder(categoryFolder, safeName + ' — ' + safeDni)

    const links = []
    for (const file of files) {
      if (!file || !file.data) continue
      const bytes = Utilities.base64Decode(file.data)
      // Prefijo con fecha para no pisar archivos de envíos anteriores del mismo jugador/a.
      const prefix = stamp.replace(/[: ]/g, '-')
      const filename = prefix + '_' + (file.field || 'documento') + '-' + (file.name || 'archivo')
      const blob = Utilities.newBlob(bytes, file.mimeType || 'application/octet-stream', filename)
      const created = folder.createFile(blob)
      links.push((file.field || 'documento') + ': ' + created.getUrl())
    }

    // Hoja de respuestas.
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0]
    ensureHeader(sheet)
    const row = COLUMNS.map(function (col) {
      const key = col[0]
      if (key === 'submittedAt') return stamp
      if (key === 'documents') return links.join('\n')
      return fields[key] || ''
    })
    sheet.appendRow(row)

    if (NOTIFY_EMAIL) {
      const subject = 'Nueva inscripción: ' + (fields.fullName || 'Sin nombre')
      const lines = COLUMNS.filter(function (col) {
        return col[0] !== 'documents'
      }).map(function (col) {
        const key = col[0]
        const value = key === 'submittedAt' ? stamp : fields[key] || ''
        return col[1] + ': ' + value
      })
      lines.push('', 'Carpeta en Drive: ' + folder.getUrl())
      MailApp.sendEmail(NOTIFY_EMAIL, subject, lines.join('\n'))
    }

    return jsonOutput({ ok: true })
  } catch (err) {
    return jsonOutput({ ok: false, error: String(err) })
  }
}

function doGet() {
  return jsonOutput({ ok: true, message: 'C.D SMILO registration endpoint activo.' })
}

function cleanName(value, fallback) {
  const s = String(value == null ? '' : value).replace(/[\\/:*?"<>|]+/g, ' ').trim()
  return s || fallback
}

function getOrCreateFolder(parent, name) {
  const existing = parent.getFoldersByName(name)
  return existing.hasNext() ? existing.next() : parent.createFolder(name)
}

// Resuelve ROOT_FOLDER_PATH desde "Mi unidad", creando lo que falte.
function resolveRootFolder() {
  let folder = DriveApp.getRootFolder()
  for (const name of ROOT_FOLDER_PATH) {
    folder = getOrCreateFolder(folder, name)
  }
  return folder
}

function ensureHeader(sheet) {
  if (sheet.getLastRow() > 0) return
  sheet.appendRow(
    COLUMNS.map(function (col) {
      return col[1]
    }),
  )
  sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold')
  sheet.setFrozenRows(1)
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}
