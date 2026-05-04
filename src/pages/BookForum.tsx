import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import AppNav from '../components/AppNav'
import PostCard from '../components/PostCard'
import PostForm from '../components/PostForm'
import { api } from '../lib/api'
import type { Book, Post } from '../types'

export default function BookForum() {
  const { id } = useParams<{ id: string }>()
  const [book, setBook]   = useState<Book | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([
      api.get<Book>(`/books/${id}`),
      api.get<Post[]>(`/posts/book/${id}`),
    ]).then(([bookData, postsData]) => {
      setBook(bookData)
      setPosts(postsData)
    }).catch(() => setBook(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleNewPost    = (post: Post) => setPosts(prev => [post, ...prev])
  const handleDeletePost = (postId: string) => setPosts(prev => prev.filter(p => p._id !== postId))

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/40 text-sm">Libro no encontrado.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <AppNav />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors w-fit"
        >
          <ArrowLeft size={15} />
          Volver al inicio
        </Link>

        <div className="liquid-glass rounded-2xl p-6 mb-8 flex gap-5 items-start">
          {book.coverUrl && (
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-16 h-24 object-cover rounded-lg flex-shrink-0"
            />
          )}
          <div>
            <p className="text-white/40 text-xs tracking-widest uppercase mb-2">Foro de discusión</p>
            <h1
              className="text-white text-2xl leading-tight tracking-tight"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {book.title}
            </h1>
            <p className="text-white/50 text-sm mt-1">{book.author}</p>
          </div>
        </div>

        <PostForm bookId={book._id} onPost={handleNewPost} />

        <div className="mt-8 flex flex-col gap-4">
          {posts.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center gap-3">
              <MessageSquare size={32} className="text-white/10" />
              <p className="text-white/30 text-sm">
                Sé el primero en compartir tu opinión sobre este libro.
              </p>
            </div>
          ) : (
            posts.map(post => (
              <PostCard key={post._id} post={post} onDelete={handleDeletePost} />
            ))
          )}
        </div>
      </main>
    </div>
  )
}
