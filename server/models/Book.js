import mongoose from 'mongoose'

const bookSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  author:      { type: String, required: true },
  coverUrl:    { type: String },
  description: { type: String },
  month:       { type: Number, required: true, min: 1, max: 12 },
  year:        { type: Number, required: true },
  isCurrent:   { type: Boolean, default: false },
}, { timestamps: true })

export default mongoose.model('Book', bookSchema)
