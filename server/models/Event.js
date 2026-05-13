import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  date:        { type: Date, required: true },
  location:    { type: String, default: '', trim: true },
  type:        { type: String, enum: ['virtual', 'presencial'], default: 'virtual' },
}, { timestamps: true })

export default mongoose.model('Event', eventSchema)
