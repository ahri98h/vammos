import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  // disable this slow external-file serving in development to avoid
  // frequent watcher/compile churn from requests
  if (process.env.NODE_ENV === 'development') {
    res.status(404).end('disabled in development')
    return
  }

  const { name } = req.query
  if (!name) return res.status(400).end('missing image name')
  if (name.includes('..')) return res.status(400).end('invalid name')

  // image is stored at workspace root (one level above the frontend project)
  const filePath = path.join(process.cwd(), '..', name)

  try {
    const stat = await fs.promises.stat(filePath)
    if (!stat.isFile()) {
      res.status(404).end('not found')
      return
    }

    res.setHeader('Cache-Control', 'public, max-age=86400')
    if (name.toLowerCase().endsWith('.png')) res.setHeader('Content-Type', 'image/png')
    else if (name.toLowerCase().endsWith('.webp')) res.setHeader('Content-Type', 'image/webp')
    else res.setHeader('Content-Type', 'image/jpeg')

    const stream = fs.createReadStream(filePath)
    stream.on('error', () => {
      try { res.status(500).end('stream error') } catch (e) {}
    })
    stream.pipe(res)
  } catch (e) {
    res.status(404).end('not found')
  }
}
