import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son requeridos' })
    }
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' })

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return res.status(401).json({ message: 'Credenciales inválidas' })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    })
  } catch (err) {
    res.status(500).json({ message: 'Error del servidor' })
  }
})

router.get('/me', authenticate, (req, res) => {
  res.json(req.user)
})

export default router
