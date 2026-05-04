import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Globe } from 'lucide-react'
import type { Article } from '../types'

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetch('/api/articles')
      .then(r => r.json())
      .then((data: Article[]) => { setArticles(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-black">
      {/* Minimal navbar */}
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

      <main className="max-w-6xl mx-auto px-6 py-12">
        <Link
          to="/"
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-10 transition-colors w-fit"
        >
          <ArrowLeft size={15} />
          Volver al inicio
        </Link>

        <div className="mb-12">
          <p className="text-white/40 text-xs tracking-widest uppercase mb-4">Blog</p>
          <h1
            className="text-5xl md:text-7xl text-white tracking-tight"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Blog <em className="italic text-white/60">Gastronómico</em>
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-white/30 text-sm">Aún no hay artículos publicados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <Link key={article._id} to={`/blog/${article.slug}`} className="group block">
                <div className="liquid-glass rounded-2xl overflow-hidden h-full flex flex-col">
                  {article.coverUrl ? (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={article.coverUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-white/3 flex items-center justify-center">
                      <span className="text-white/10 text-4xl" style={{ fontFamily: "'Instrument Serif', serif" }}>A</span>
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    {article.category && (
                      <span className="text-white/30 text-xs tracking-widest uppercase mb-2">{article.category}</span>
                    )}
                    <h2
                      className="text-white text-lg leading-snug tracking-tight mb-2 flex-1"
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                      {article.title}
                    </h2>
                    {article.excerpt && (
                      <p className="text-white/40 text-sm leading-relaxed line-clamp-2 mb-4">{article.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-white/25 text-xs">{article.authorName}</span>
                      <ArrowUpRight size={14} className="text-white/20 group-hover:text-white/60 transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
