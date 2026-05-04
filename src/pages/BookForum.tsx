import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MessageSquare, FileDown } from 'lucide-react'
import AppNav from '../components/AppNav'
import PostCard from '../components/PostCard'
import PostForm from '../components/PostForm'
import { api, mediaUrl } from '../lib/api'
import type { Book, Post } from '../types'

const MONTHS = [
  'enero','febrero','marzo','abril','mayo','junio',
  'julio','agosto','septiembre','octubre','noviembre','diciembre',
]

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`
}

function exportToPDF(book: Book, posts: Post[]) {
  const postsHTML = posts.length === 0
    ? '<p style="color:#888;font-style:italic;">No hay aportaciones registradas.</p>'
    : posts.map(post => `
        <div class="post">
          <div class="post-header">
            <span class="author">${post.author?.fullName || post.author?.username || 'Usuario'}</span>
            <span class="username">@${post.author?.username ?? ''}</span>
            <span class="date">${formatDate(post.createdAt)}</span>
          </div>
          <p class="content">${post.content.replace(/\n/g, '<br/>')}</p>
          ${post.imageUrl ? `<img src="${post.imageUrl}" class="post-image" />` : ''}
          ${post.linkUrl ? `<p class="link">🔗 <a href="${post.linkUrl}">${post.linkUrl}</a></p>` : ''}
        </div>
      `).join('')

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>${book.title} — Aportaciones</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Georgia', serif;
      color: #1a1a1a;
      background: #fff;
      padding: 48px 56px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      border-bottom: 2px solid #1a1a1a;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    .label {
      font-family: 'Helvetica Neue', sans-serif;
      font-size: 10px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #888;
      margin-bottom: 8px;
    }
    h1 {
      font-size: 32px;
      font-weight: normal;
      line-height: 1.2;
      margin-bottom: 6px;
    }
    .author-name {
      font-size: 16px;
      color: #555;
      margin-bottom: 4px;
    }
    .meta {
      font-family: 'Helvetica Neue', sans-serif;
      font-size: 12px;
      color: #999;
    }
    .stats {
      font-family: 'Helvetica Neue', sans-serif;
      font-size: 12px;
      color: #666;
      margin-bottom: 32px;
      padding: 12px 16px;
      background: #f5f5f5;
      border-radius: 6px;
    }
    .post {
      margin-bottom: 28px;
      padding-bottom: 28px;
      border-bottom: 1px solid #e8e8e8;
      page-break-inside: avoid;
    }
    .post:last-child { border-bottom: none; }
    .post-header {
      font-family: 'Helvetica Neue', sans-serif;
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 10px;
      flex-wrap: wrap;
    }
    .author {
      font-size: 13px;
      font-weight: 600;
      color: #1a1a1a;
    }
    .username {
      font-size: 11px;
      color: #aaa;
    }
    .date {
      font-size: 11px;
      color: #bbb;
      margin-left: auto;
    }
    .content {
      font-size: 14px;
      line-height: 1.75;
      color: #333;
      white-space: pre-wrap;
    }
    .post-image {
      margin-top: 12px;
      max-width: 100%;
      border-radius: 6px;
    }
    .link {
      margin-top: 10px;
      font-size: 12px;
      color: #666;
      font-family: 'Helvetica Neue', sans-serif;
    }
    .link a { color: #555; }
    .footer {
      margin-top: 48px;
      padding-top: 16px;
      border-top: 1px solid #e8e8e8;
      font-family: 'Helvetica Neue', sans-serif;
      font-size: 10px;
      color: #ccc;
      text-align: center;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="header">
    <p class="label">Club de Lectura — Aportaciones del foro</p>
    <h1>${book.title}</h1>
    <p class="author-name">${book.author}</p>
    <p class="meta">${MONTHS[(book.month ?? 1) - 1].charAt(0).toUpperCase() + MONTHS[(book.month ?? 1) - 1].slice(1)} ${book.year}</p>
  </div>
  <div class="stats">
    ${posts.length} aportación${posts.length !== 1 ? 'es' : ''} · Generado el ${formatDate(new Date().toISOString())}
  </div>
  ${postsHTML}
  <div class="footer">moreperezmontemayor · club de lectura</div>
  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`

  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(html)
  win.document.close()
}

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
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={15} />
            Volver al inicio
          </Link>

          {posts.length > 0 && (
            <button
              onClick={() => exportToPDF(book, posts)}
              className="flex items-center gap-2 liquid-glass rounded-full px-4 py-2 text-white/50 hover:text-white text-sm transition-colors"
            >
              <FileDown size={15} />
              Exportar PDF
            </button>
          )}
        </div>

        <div className="liquid-glass rounded-2xl p-6 mb-8 flex gap-5 items-start">
          {book.coverUrl && (
            <img
              src={mediaUrl(book.coverUrl)}
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
