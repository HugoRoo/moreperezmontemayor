import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import Article from '../models/Article.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const __dirname  = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.join(__dirname, '..', 'uploads')

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`),
})
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })

function toSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

const router = Router()

router.get('/', async (req, res) => {
  try {
    const articles = await Article.find({ published: true }).sort({ createdAt: -1 })
    res.json(articles)
  } catch {
    res.status(500).json({ message: 'Error al obtener artículos' })
  }
})

router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug, published: true })
    if (!article) return res.status(404).json({ message: 'Artículo no encontrado' })
    res.json(article)
  } catch {
    res.status(500).json({ message: 'Error al obtener artículo' })
  }
})

router.post('/', authenticate, requireAdmin, upload.single('cover'), async (req, res) => {
  try {
    const { title, excerpt, content, category, authorName, videoUrl } = req.body
    if (!title) return res.status(400).json({ message: 'El título es requerido' })

    let slug = toSlug(title)
    const existing = await Article.findOne({ slug })
    if (existing) slug = `${slug}-${Date.now()}`

    const coverUrl = req.file ? `/uploads/${req.file.filename}` : null
    const article = await Article.create({
      title: title.trim(),
      slug,
      excerpt: excerpt?.trim() || '',
      content: content?.trim() || '',
      coverUrl,
      category: category?.trim() || '',
      authorName: authorName?.trim() || 'moreperezmontemayor',
      videoUrl: videoUrl?.trim() || null,
    })
    res.status(201).json(article)
  } catch {
    res.status(500).json({ message: 'Error al crear artículo' })
  }
})

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
    if (!article) return res.status(404).json({ message: 'Artículo no encontrado' })

    if (article.coverUrl) {
      const filePath = path.join(uploadsDir, path.basename(article.coverUrl))
      fs.unlink(filePath, () => {})
    }
    await article.deleteOne()
    res.json({ ok: true })
  } catch {
    res.status(500).json({ message: 'Error al eliminar artículo' })
  }
})

export default router
