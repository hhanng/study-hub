// Auto-saves a copy of every uploaded notes file to a folder on her laptop.
//
// Chrome/Edge support the File System Access API, which lets her pick a
// folder once and have every future upload write straight into it (just a
// quick permission reconfirmation, not a new picker each time). Safari and
// Firefox don't support it, so there we fall back to a plain browser
// download — the file still lands in a real folder on her laptop
// (Downloads), it's just not a folder she gets to choose.

const DB_NAME = 'studyhub-files'
const STORE = 'handles'
const KEY = 'notesFolder'

export const supportsFolderSave = typeof window !== 'undefined' && 'showDirectoryPicker' in window

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function idbGet(key) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(key)
    req.onsuccess = () => resolve(req.result || null)
    req.onerror = () => reject(req.error)
  })
}

async function idbSet(key, value) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(value, key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

// Must be called directly from a click handler — the browser requires a
// fresh user gesture to show this picker.
export async function chooseNotesFolder() {
  const handle = await window.showDirectoryPicker({ id: 'studyhub-notes', mode: 'readwrite' })
  await idbSet(KEY, handle)
  return handle
}

export async function getSavedFolderHandle() {
  if (!supportsFolderSave) return null
  return idbGet(KEY)
}

export async function ensureFolderPermission(handle) {
  if ((await handle.queryPermission({ mode: 'readwrite' })) === 'granted') return true
  return (await handle.requestPermission({ mode: 'readwrite' })) === 'granted'
}

export async function saveFileToFolder(handle, filename, file) {
  const fileHandle = await handle.getFileHandle(filename, { create: true })
  const writable = await fileHandle.createWritable()
  await writable.write(file)
  await writable.close()
}

export function downloadFileCopy(filename, file) {
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
