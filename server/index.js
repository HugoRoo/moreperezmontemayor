import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'

import authRoutes    from './routes/auth.js'
import bookRoutes    from './routes/books.js'
import postRoutes    from './routes/posts.js'
import meetingRoutes from './routes/meeting.js'
import userRoutes    from './routes/users.js'
import articleRoutes from './routes/articles.js'
import eventRoutes   from './routes/events.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app  = express()
const PORT = process.env.PORT || 3001

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map(s => s.trim())
app.use(cors({ origin: allowedOrigins }))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth',    authRoutes)
app.use('/api/books',   bookRoutes)
app.use('/api/posts',   postRoutes)
app.use('/api/meeting', meetingRoutes)
app.use('/api/users',    userRoutes)
app.use('/api/articles', articleRoutes)
app.use('/api/events',   eventRoutes)

app.get('/api/health', (req, res) => res.json({ ok: true }))

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✓ MongoDB conectado')
    app.listen(PORT, () => console.log(`✓ Servidor en http://localhost:${PORT}`))
  })
  .catch(err => {
    console.error('✗ Error conectando a MongoDB:', err.message)
    process.exit(1)
  })
