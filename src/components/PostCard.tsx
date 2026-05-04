import { useState } from 'react'
import { Trash2, Link as LinkIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'
import type { Post } from '../types'

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'hace un momento'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `hace ${hours} h`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'ayer'
  return `hace ${days} días`
}

interface Props {
  post: Post
  onDelete: (id: string) => void
}

export default function PostCard({ post, onDelete }: Props) {
  const { profile } = useAuth()
  const [deleting, setDeleting] = useState(false)

  const canDelete = profile?._id === post.author?._id || profile?.role === 'admin'
  const initial = (post.author?.username ?? '?')[0].toUpperCase()

  const handleDelete = async () => {
    if (!confirm('¿Eliminar este mensaje?')) return
    setDeleting(true)
    try {
      await api.delete(`/posts/${post._id}`)
      onDelete(post._id)
    } catch {
      setDeleting(false)
    }
  }

  return (
    <div className="liquid-glass rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
            {initial}
          </div>
          <div>
            <p className="text-white text-sm font-medium leading-none mb-1">
              {post.author?.username ?? 'Usuario'}
            </p>
            <p className="text-white/30 text-xs">{timeAgo(post.createdAt)}</p>
          </div>
        </div>
        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-white/20 hover:text-red-400 transition-colors p-1 flex-shrink-0"
            title="Eliminar"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Imagen"
          className="mt-4 rounded-xl w-full max-h-80 object-cover"
        />
      )}

      {post.linkUrl && (
        <a
          href={post.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center gap-2 liquid-glass rounded-xl px-4 py-3 text-white/60 hover:text-white text-sm transition-colors"
        >
          <LinkIcon size={14} className="flex-shrink-0" />
          <span className="truncate">{post.linkUrl}</span>
        </a>
      )}
    </div>
  )
}
