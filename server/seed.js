/**
 * Crea el primer usuario administrador.
 * Ejecutar UNA sola vez: npm run seed
 */
import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from './models/User.js'

const { MONGODB_URI } = process.env
if (!MONGODB_URI) {
  console.error('Falta MONGODB_URI en el archivo .env')
  process.exit(1)
}

await mongoose.connect(MONGODB_URI)

const existing = await User.findOne({ role: 'admin' })
if (existing) {
  console.log(`Ya existe un admin: ${existing.email}`)
  await mongoose.disconnect()
  process.exit(0)
}

const passwordHash = await bcrypt.hash('Admin123!', 10)
const admin = await User.create({
  username: 'admin',
  email: 'admin@moreperezmontemayor.com',
  passwordHash,
  fullName: 'Administrador',
  role: 'admin',
})

console.log('✓ Admin creado exitosamente:')
console.log(`  Email:      ${admin.email}`)
console.log(`  Contraseña: Admin123!`)
console.log('  ⚠️  Cambia la contraseña desde el panel de admin.')

await mongoose.disconnect()
