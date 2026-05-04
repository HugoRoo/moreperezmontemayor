import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import Book from '../models/Book.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.join(__dirname, '..', 'uploads')

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`),
})
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })

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

    const coverUrl = req.file ? `/uploads/${req.file.filename}` : null
    const book = await Book.create({
      title: title.trim(),
      author: author.trim(),
      description: description?.trim() || null,
      month: Number(month),
      year: Number(year),
      coverUrl,
    })
    res.status(201).json(book)
  } catch (err) {
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

    if (book.coverUrl) {
      const filePath = path.join(uploadsDir, path.basename(book.coverUrl))
      fs.unlink(filePath, () => {})
    }
    await book.deleteOne()
    res.json({ ok: true })
  } catch {
    res.status(500).json({ message: 'Error al eliminar libro' })
  }
})

export default router
