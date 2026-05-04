import { Router } from 'express'
import Book from '../models/Book.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'
import { upload, saveFile, deleteFile } from '../lib/cloudinary.js'

const router = Router()

router.get('/', authenticate, async (req, res) => {
  try {
    const books = await Book.find().sort({ year: -1, month: -1 })
    res.json(books)
  } catch {
    res.status(500).json({ message: 'Error al obtener libros' })
  }
})

router.get('/:id', authenticate, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book) return res.status(404).json({ message: 'Libro no encontrado' })
    res.json(book)
  } catch {
    res.status(500).json({ message: 'Error al obtener libro' })
  }
})

router.post('/', authenticate, requireAdmin, upload.single('cover'), async (req, res) => {
  try {
    const { title, author, description, month, year } = req.body
    if (!title || !author) return res.status(400).json({ message: 'Título y autor son requeridos' })

    const coverUrl = await saveFile(req.file)
    const book = await Book.create({
      title: title.trim(),
      author: author.trim(),
      description: description?.trim() || null,
      month: Number(month),
      year: Number(year),
      coverUrl,
    })
    res.status(201).json(book)
  } catch {
    res.status(500).json({ message: 'Error al crear libro' })
  }
})

router.patch('/:id/current', authenticate, requireAdmin, async (req, res) => {
  try {
    await Book.updateMany({}, { isCurrent: false })
    const book = await Book.findByIdAndUpdate(req.params.id, { isCurrent: true }, { new: true })
    if (!book) return res.status(404).json({ message: 'Libro no encontrado' })
    res.json(book)
  } catch {
    res.status(500).json({ message: 'Error al actualizar libro' })
  }
})

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book) return res.status(404).json({ message: 'Libro no encontrado' })
    await deleteFile(book.coverUrl)
    await book.deleteOne()
    res.json({ ok: true })
  } catch {
    res.status(500).json({ message: 'Error al eliminar libro' })
  }
})

export default router
