import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado' })
  }
  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET)
    const user = await User.findById(payload.id).select('-passwordHash')
    if (!user) return res.status(401).json({ message: 'No autorizado' })
    req.user = user
    next()
  } catch {
    res.status(401).json({ message: 'Token inválido o expirado' })
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado: se requiere rol admin' })
  }
  next()
}
