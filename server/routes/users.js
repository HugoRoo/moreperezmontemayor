import { Router } from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: 1 })
    res.json(users)
  } catch {
    res.status(500).json({ message: 'Error al obtener miembros' })
  }
})

router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Usuario, correo y contraseña son requeridos' })
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      fullName: fullName?.trim() || '',
    })
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt,
    })
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0]
      const label = field === 'email' ? 'El correo' : 'El usuario'
      return res.status(400).json({ message: `${label} ya está registrado` })
    }
    res.status(500).json({ message: 'Error al crear miembro' })
  }
})

router.patch('/:id/password', authenticate, requireAdmin, async (req, res) => {
  try {
    const { password } = req.body
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' })
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.findByIdAndUpdate(req.params.id, { passwordHash }, { new: true }).select('-passwordHash')
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    res.json({ ok: true })
  } catch {
    res.status(500).json({ message: 'Error al cambiar contraseña' })
  }
})

router.patch('/:id/role', authenticate, requireAdmin, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'No puedes cambiar tu propio rol' })
    }
    const { role } = req.body
    if (!['admin', 'member'].includes(role)) {
      return res.status(400).json({ message: 'Rol inválido' })
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-passwordHash')
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    res.json(user)
  } catch {
    res.status(500).json({ message: 'Error al actualizar rol' })
  }
})

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'No puedes eliminarte a ti mismo' })
    }
    await User.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch {
    res.status(500).json({ message: 'Error al eliminar miembro' })
  }
})

export default router
