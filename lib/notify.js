import { cvNotifyEndpoint } from './data'

function send(payload) {
  if (!cvNotifyEndpoint) return
  fetch(cvNotifyEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {})
}

export function notifyCvDownload() {
  send({
    _subject: 'CV descargado',
    evento: 'descarga',
    fecha: new Date().toISOString(),
  })
}

export function notifyCvEmailOptIn(email) {
  send({
    _subject: 'Alguien dejó su email tras descargar el CV',
    evento: 'email-opt-in',
    email,
    fecha: new Date().toISOString(),
  })
}
