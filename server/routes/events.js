import { Router } from 'express'
import Event from '../models/Event.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const events = await Event.find({}).sort({ date: 1 })
    res.json(events)
  } catch {
    res.status(500).json({ message: 'Error al obtener eventos' })
  }
})

router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { title, description, date, location, type } = req.body
    if (!title || !date) return res.status(400).json({ message: 'Título y fecha son requeridos' })
    const event = await Event.create({ title, description, date, location, type })
    res.status(201).json(event)
  } catch {
    res.status(500).json({ message: 'Error al crear evento' })
  }
})

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id)
    if (!event) return res.status(404).json({ message: 'Evento no encontrado' })
    res.json({ ok: true })
  } catch {
    res.status(500).json({ message: 'Error al eliminar evento' })
  }
})

export default router
