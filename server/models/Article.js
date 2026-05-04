import mongoose from 'mongoose'

const articleSchema = new mongoose.Schema(
  {
    title:      { type: String, required: true, trim: true },
    slug:       { type: String, required: true, unique: true, trim: true },
    excerpt:    { type: String, trim: true, default: '' },
    content:    { type: String, default: '' },
    coverUrl:   { type: String, default: null },
    category:   { type: String, trim: true, default: '' },
    authorName: { type: String, trim: true, default: 'moreperezmontemayor' },
    videoUrl:   { type: String, default: null },
    published:  { type: Boolean, default: true },
  },
  { timestamps: true },
)

export default mongoose.model('Article', articleSchema)
