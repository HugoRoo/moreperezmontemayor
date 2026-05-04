import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Article } from '../types'

export default function BlogSection() {
  const [articles, setArticles] = useState<Article[]>([])
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    fetch('/api/articles')
      .then(r => r.json())
      .then((data: Article[]) => setArticles(data.slice(0, 3)))
      .catch(() => {})
  }, [])

  if (articles.length === 0) return null

  return (
    <section id="blog" ref={ref} className="bg-black py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.p
          className="text-white/40 text-sm tracking-widest uppercase mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Blog Gastronómico
        </motion.p>

        <div className="flex items-end justify-between mb-12">
          <motion.h2
            className="text-4xl md:text-6xl text-white leading-tight tracking-tight"
            style={{ fontFamily: "'Instrument Serif', serif" }}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Últimas <em className="italic text-white/60">entradas</em>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              to="/blog"
              className="hidden md:flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
            >
              Ver todas <ArrowUpRight size={14} />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <motion.div
              key={article._id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 * i }}
            >
              <Link to={`/blog/${article.slug}`} className="group block h-full">
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
                    <h3
                      className="text-white text-lg leading-snug tracking-tight mb-2 flex-1"
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-white/40 text-sm leading-relaxed line-clamp-2">{article.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                      <span className="text-white/25 text-xs">{article.authorName}</span>
                      <ArrowUpRight size={14} className="text-white/20 group-hover:text-white/60 transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-8 text-center md:hidden"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
          >
            Ver todas las entradas <ArrowUpRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
