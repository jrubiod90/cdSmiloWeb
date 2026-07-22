/**
 * Client-side helpers for the registration form.
 *
 * Files are downscaled and re-encoded to JPEG in the browser before upload so
 * the payload sent to the Apps Script stays small (a phone photo of a DNI is
 * often 3–6 MB; this brings it down to a few hundred KB) and the files in Drive
 * are tidy. The payload is a JSON string; the Apps Script decodes the base64.
 */

export type UploadedFile = {
  /** Which document this is, e.g. "photoId" | "dniFront" | "dniBack". */
  field: string
  name: string
  mimeType: string
  /** base64 WITHOUT the `data:...;base64,` prefix. */
  data: string
}

const MAX_DIMENSION = 1600
const JPEG_QUALITY = 0.82

export async function fileToUpload(field: string, file: File): Promise<UploadedFile> {
  if (file.type.startsWith('image/')) {
    try {
      return await compressImage(field, file)
    } catch {
      // Fall back to the raw file if canvas encoding fails for any reason.
    }
  }
  const data = await readAsBase64(file)
  return { field, name: file.name, mimeType: file.type || 'application/octet-stream', data }
}

function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error)
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '')
    reader.readAsDataURL(file)
  })
}

function compressImage(field: string, file: File): Promise<UploadedFile> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new window.Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height))
      const width = Math.max(1, Math.round(img.width * scale))
      const height = Math.max(1, Math.round(img.height * scale))
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas 2D context unavailable'))
        return
      }
      ctx.drawImage(img, 0, 0, width, height)
      const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY)
      const base = file.name.replace(/\.[^.]+$/, '') || field
      resolve({
        field,
        name: `${base}.jpg`,
        mimeType: 'image/jpeg',
        data: dataUrl.split(',')[1] ?? '',
      })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Image could not be decoded'))
    }
    img.src = url
  })
}

/**
 * POSTs the registration to the Apps Script web app.
 *
 * Uses `no-cors` + a `text/plain` body because Apps Script web apps don't return
 * CORS headers: the request is delivered but the response is opaque, so we treat
 * a resolved fetch as success and a rejected one (network failure) as an error.
 */
export async function submitRegistration(endpoint: string, payload: unknown): Promise<void> {
  await fetch(endpoint, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  })
}
