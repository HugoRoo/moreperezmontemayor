import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Globe } from 'lucide-react'
import type { Article } from '../types'

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/articles/${slug}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then((data: Article) => { setArticle(data); setLoading(false) })
      .catch(() => { setArticle(null); setLoading(false) })
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/40 text-sm">Artículo no encontrado.</p>
      </div>
    )
  }

  const publishedDate = new Date(article.createdAt).toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-black">
      <nav className="px-6 py-6">
        <div className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Globe size={20} className="text-white" />
            <span className="text-white font-semibold">moreperezmontemayor</span>
          </Link>
          <Link to="/login" className="liquid-glass rounded-full px-5 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors">
            Iniciar sesión
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <Link
          to="/blog"
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-10 transition-colors w-fit"
        >
          <ArrowLeft size={15} />
          Blog Gastronómico
        </Link>

        {article.category && (
          <p className="text-white/30 text-xs tracking-widest uppercase mb-4">{article.category}</p>
        )}

        <h1
          className="text-4xl md:text-6xl text-white leading-tight tracking-tight mb-6"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          {article.title}
        </h1>

        <div className="flex items-center gap-3 mb-10 text-white/30 text-sm">
          <span>{article.authorName}</span>
          <span>·</span>
          <span>{publishedDate}</span>
        </div>

        {article.coverUrl && (
          <div className="rounded-2xl overflow-hidden mb-10 aspect-[16/9]">
            <img src={article.coverUrl} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        {article.excerpt && (
          <p className="text-white/60 text-lg leading-relaxed mb-8 border-l border-white/10 pl-5 italic">
            {article.excerpt}
          </p>
        )}

        {article.content && (
          <div className="text-white/70 text-base leading-relaxed whitespace-pre-wrap">
            {article.content}
          </div>
        )}
      </main>
    </div>
  )
}
