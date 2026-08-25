// Extracts plain text from a PDF File/Blob, entirely in the browser — no
// server involved, so this works the same on GitHub Pages as it does
// locally. pdfjs-dist is a large library, so it's only loaded the first
// time someone actually uploads a PDF, not on initial page load.
export async function extractPdfText(file) {
  const [pdfjsLib, workerUrl] = await Promise.all([
    import('pdfjs-dist'),
    import('pdfjs-dist/build/pdf.worker.mjs?url').then((m) => m.default),
  ])
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  const pages = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    pages.push(content.items.map((item) => item.str).join(' '))
  }

  const text = pages.join('\n\n').replace(/[ \t]+/g, ' ').trim()
  if (!text) {
    throw new Error('No text found in that PDF — it might be a scan/image rather than real text.')
  }
  return text
}
