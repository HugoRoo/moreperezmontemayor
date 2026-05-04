import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import Post from '../models/Post.js'
import { authenticate } from '../middleware/auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.join(__dirname, '..', 'uploads')

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`),
})
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })

const router = Router()

router.get('/book/:bookId', authenticate, async (req, res) => {
  try {
    const posts = await Post.find({ bookId: req.params.bookId })
      .populate('author', 'username fullName')
      .sort({ createdAt: -1 })
    res.json(posts)
  } catch {
    res.status(500).json({ message: 'Error al obtener mensajes' })
  }
})

router.post('/book/:bookId', authenticate, upload.single('image'), async (req, res) => {
  try {
    const { content, linkUrl } = req.body
    if (!content?.trim()) return res.status(400).json({ message: 'El contenido es requerido' })

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null
    const post = await Post.create({
      bookId: req.params.bookId,
      author: req.user._id,
      content: content.trim(),
      imageUrl,
      linkUrl: linkUrl?.trim() || null,
    })
    await post.populate('author', 'username fullName')
    res.status(201).json(post)
  } catch {
    res.status(500).json({ message: 'Error al publicar mensaje' })
  }
})

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ message: 'Mensaje no encontrado' })

    const isOwner = post.author.toString() === req.user._id.toString()
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado' })
    }

    if (post.imageUrl) {
      const filePath = path.join(uploadsDir, path.basename(post.imageUrl))
      fs.unlink(filePath, () => {})
    }
    await post.deleteOne()
    res.json({ ok: true })
  } catch {
    res.status(500).json({ message: 'Error al eliminar mensaje' })
  }
})

export default router
