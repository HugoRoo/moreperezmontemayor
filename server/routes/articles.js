import { Router } from 'express'
import Article from '../models/Article.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'
import { upload, saveFile, deleteFile } from '../lib/cloudinary.js'

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

    const coverUrl = await saveFile(req.file)
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
    await deleteFile(article.coverUrl)
    await article.deleteOne()
    res.json({ ok: true })
  } catch {
    res.status(500).json({ message: 'Error al eliminar artículo' })
  }
})

export default router
