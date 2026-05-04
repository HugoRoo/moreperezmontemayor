import { Router } from 'express'
import Post from '../models/Post.js'
import { authenticate } from '../middleware/auth.js'
import { upload, saveFile, deleteFile } from '../lib/cloudinary.js'

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

    const imageUrl = await saveFile(req.file)
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

    await deleteFile(post.imageUrl)
    await post.deleteOne()
    res.json({ ok: true })
  } catch {
    res.status(500).json({ message: 'Error al eliminar mensaje' })
  }
})

export default router
