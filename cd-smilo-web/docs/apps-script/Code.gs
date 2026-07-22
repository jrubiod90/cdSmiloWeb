/**
 * C.D SMILO — Backend de inscripciones (Google Apps Script)
 * ---------------------------------------------------------
 * Recibe el formulario de /inscripcion de la web, guarda las fotos en una
 * carpeta del Drive del club (una subcarpeta por jugador/a) y añade una fila
 * con todos los datos a una hoja de cálculo. Opcionalmente avisa por email.
 *
 * Cómo desplegarlo: ver docs/registration-backend.md
 */

// 1) ID de la carpeta de Drive donde se crearán las subcarpetas por jugador/a.
//    (lo copias de la URL de la carpeta: .../folders/ESTE_ID)
const ROOT_FOLDER_ID = 'REEMPLAZA_CON_EL_ID_DE_LA_CARPETA'

// 2) ID de la hoja de cálculo de respuestas.
//    (lo copias de la URL de la hoja: .../spreadsheets/d/ESTE_ID/edit)
const SHEET_ID = 'REEMPLAZA_CON_EL_ID_DE_LA_HOJA'

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

    // Subcarpeta por jugador/a: "Apellidos, Nombre — deporte — 2025-08-30 18:12"
    const root = DriveApp.getFolderById(ROOT_FOLDER_ID)
    const stamp = Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd HH:mm')
    const safeName = String(fields.fullName || 'Sin nombre').replace(/[\\/:*?"<>|]+/g, ' ').trim()
    const folder = root.createFolder(safeName + ' — ' + (fields.sport || '') + ' — ' + stamp)

    const links = []
    for (const file of files) {
      if (!file || !file.data) continue
      const bytes = Utilities.base64Decode(file.data)
      const filename = (file.field || 'documento') + '-' + (file.name || 'archivo')
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
