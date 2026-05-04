import { useState, useRef } from 'react'
import { ImageIcon, Link as LinkIcon, Send, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'
import type { Post } from '../types'

interface Props {
  bookId: string
  onPost: (post: Post) => void
}

export default function PostForm({ bookId, onPost }: Props) {
  const { profile } = useAuth()
  const [content, setContent]     = useState('')
  const [linkUrl, setLinkUrl]     = useState('')
  const [showLink, setShowLink]   = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('content', content.trim())
      if (linkUrl.trim()) formData.append('linkUrl', linkUrl.trim())
      if (imageFile) formData.append('image', imageFile)

      const post = await api.upload<Post>(`/posts/book/${bookId}`, formData)
      onPost(post)
      setContent('')
      setLinkUrl('')
      setShowLink(false)
      clearImage()
    } finally {
      setSubmitting(false)
    }
  }

  const initial = (profile?.username ?? '?')[0].toUpperCase()

  return (
    <form onSubmit={handleSubmit} className="liquid-glass rounded-2xl p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-medium flex-shrink-0 mt-0.5">
          {initial}
        </div>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Comparte tu opinión sobre el libro..."
          rows={3}
          className="flex-1 bg-transparent text-white placeholder:text-white/30 text-sm outline-none resize-none leading-relaxed"
        />
      </div>

      {imagePreview && (
        <div className="relative mb-4 ml-11">
          <img src={imagePreview} alt="vista previa" className="rounded-xl max-h-52 object-cover" />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 bg-black/70 rounded-full p-1 text-white hover:bg-black transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {showLink && (
        <div className="mb-4 ml-11">
          <input
            type="url"
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-white/30 text-sm outline-none focus:border-white/30 transition-colors"
          />
        </div>
      )}

      <div className="flex items-center justify-between ml-11">
        <div className="flex items-center gap-1">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-white/40 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
            title="Agregar imagen"
          >
            <ImageIcon size={18} />
          </button>
          <button
            type="button"
            onClick={() => setShowLink(v => !v)}
            className={`p-2 rounded-lg transition-colors ${
              showLink ? 'text-white bg-white/10' : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
            title="Agregar link"
          >
            <LinkIcon size={18} />
          </button>
        </div>

        <button
          type="submit"
          disabled={!content.trim() || submitting}
          className="flex items-center gap-2 bg-white text-black text-sm font-medium rounded-full px-5 py-2 hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={14} />
          {submitting ? 'Publicando...' : 'Publicar'}
        </button>
      </div>
    </form>
  )
}
