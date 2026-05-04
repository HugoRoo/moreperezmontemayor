import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
  bookId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  author:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content:  { type: String, required: true, trim: true },
  imageUrl: { type: String },
  linkUrl:  { type: String },
}, { timestamps: true })

export default mongoose.model('Post', postSchema)
