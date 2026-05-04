import { Router } from 'express'
import Meeting from '../models/Meeting.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/', authenticate, async (req, res) => {
  try {
    const meeting = await Meeting.findOne().sort({ createdAt: -1 })
    res.json(meeting)
  } catch {
    res.status(500).json({ message: 'Error al obtener link de reunión' })
  }
})

router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { url, label } = req.body
    if (!url?.trim()) return res.status(400).json({ message: 'La URL es requerida' })

    const meeting = await Meeting.create({
      url: url.trim(),
      label: label?.trim() || 'Sesión semanal',
      createdBy: req.user._id,
    })
    res.status(201).json(meeting)
  } catch {
    res.status(500).json({ message: 'Error al guardar link de reunión' })
  }
})

export default router
