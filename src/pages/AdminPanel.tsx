import { useEffect, useState, useRef } from 'react'
import { BookOpen, Video, Users, Plus, Check, Trash2, ExternalLink, UserPlus, X, Newspaper } from 'lucide-react'
import AppNav from '../components/AppNav'
import { api } from '../lib/api'
import type { Book, MeetingLink, Profile, Article } from '../types'
import { useAuth } from '../context/AuthContext'

const MONTHS = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
]

type Tab = 'books' | 'meeting' | 'members' | 'blog'

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('books')

  const tabs = [
    { key: 'books'   as Tab, label: 'Libros',   icon: BookOpen  },
    { key: 'meeting' as Tab, label: 'Reunión',  icon: Video     },
    { key: 'members' as Tab, label: 'Miembros', icon: Users     },
    { key: 'blog'    as Tab, label: 'Blog',     icon: Newspaper },
  ]

  return (
    <div className="min-h-screen bg-black">
      <AppNav />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <p className="text-white/40 text-xs tracking-widest uppercase mb-2">Panel de administración</p>
          <h1 className="text-white text-3xl tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Gestión del club
          </h1>
        </div>

        <div className="liquid-glass rounded-full inline-flex p-1 mb-10 flex-wrap gap-y-1">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === key ? 'bg-white text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'books'   && <BooksTab />}
        {activeTab === 'meeting' && <MeetingTab />}
        {activeTab === 'members' && <MembersTab />}
        {activeTab === 'blog'    && <BlogTab />}
      </main>
    </div>
  )
}

/* ──────────── LIBROS ──────────── */
function BooksTab() {
  const [books, setBooks]       = useState<Book[]>([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle]       = useState('')
  const [author, setAuthor]     = useState('')
  const [description, setDescription] = useState('')
  const [month, setMonth]       = useState(new Date().getMonth() + 1)
  const [year, setYear]         = useState(new Date().getFullYear())
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { loadBooks() }, [])

  async function loadBooks() {
    const data = await api.get<Book[]>('/books').catch(() => [])
    setBooks(data)
    setLoading(false)
  }

  async function setCurrentBook(bookId: string) {
    await api.patch(`/books/${bookId}/current`)
    setBooks(prev => prev.map(b => ({ ...b, isCurrent: b._id === bookId })))
  }

  async function deleteBook(bookId: string) {
    if (!confirm('¿Eliminar este libro y todos sus mensajes del foro?')) return
    await api.delete(`/books/${bookId}`)
    setBooks(prev => prev.filter(b => b._id !== bookId))
  }

  async function handleAddBook(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !author.trim()) return
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('title', title.trim())
      formData.append('author', author.trim())
      formData.append('description', description.trim())
      formData.append('month', String(month))
      formData.append('year', String(year))
      if (coverFile) formData.append('cover', coverFile)

      const book = await api.upload<Book>('/books', formData)
      setBooks(prev => [book, ...prev])
      setTitle(''); setAuthor(''); setDescription('')
      setCoverFile(null)
      if (fileRef.current) fileRef.current.value = ''
      setShowForm(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-lg font-medium">Libros registrados</h2>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 bg-white text-black text-sm font-medium rounded-full px-5 py-2 hover:bg-white/90 transition-colors"
        >
          <Plus size={15} /> Agregar libro
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddBook} className="liquid-glass rounded-2xl p-6 mb-6 flex flex-col gap-4">
          <p className="text-white/40 text-xs tracking-widest uppercase">Nuevo libro</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Título *', value: title, set: setTitle, placeholder: '' },
              { label: 'Autor *', value: author, set: setAuthor, placeholder: '' },
            ].map(({ label, value, set, placeholder }) => (
              <div key={label}>
                <label className="text-white/50 text-xs block mb-1">{label}</label>
                <input
                  value={value} onChange={e => set(e.target.value)} required={label.includes('*')}
                  placeholder={placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors"
                />
              </div>
            ))}
            <div>
              <label className="text-white/50 text-xs block mb-1">Mes</label>
              <select
                value={month} onChange={e => setMonth(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors"
              >
                {MONTHS.map((m, i) => (
                  <option key={i} value={i + 1} className="bg-neutral-900">{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-white/50 text-xs block mb-1">Año</label>
              <input
                type="number" value={year} onChange={e => setYear(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="text-white/50 text-xs block mb-1">Descripción / sinopsis</label>
            <textarea
              value={description} onChange={e => setDescription(e.target.value)} rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors resize-none"
            />
          </div>
          <div>
            <label className="text-white/50 text-xs block mb-2">Imagen de portada</label>
            <input
              ref={fileRef} type="file" accept="image/*"
              onChange={e => setCoverFile(e.target.files?.[0] ?? null)}
              className="text-white/40 text-sm file:mr-3 file:bg-white/10 file:text-white file:text-xs file:rounded-full file:px-4 file:py-1.5 file:border-0 file:cursor-pointer hover:file:bg-white/20"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="text-white/50 text-sm px-5 py-2 rounded-full hover:text-white transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={submitting} className="bg-white text-black text-sm font-medium rounded-full px-6 py-2 hover:bg-white/90 transition-colors disabled:opacity-50">
              {submitting ? 'Guardando...' : 'Guardar libro'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen size={32} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">No hay libros registrados aún.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {books.map(book => (
            <div key={book._id} className="liquid-glass rounded-xl p-4 flex items-center gap-4">
              {book.coverUrl ? (
                <img src={book.coverUrl} alt={book.title} className="w-9 object-cover rounded-lg flex-shrink-0" style={{ height: '3.25rem' }} />
              ) : (
                <div className="w-9 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0" style={{ height: '3.25rem' }}>
                  <BookOpen size={14} className="text-white/20" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-white text-sm font-medium truncate">{book.title}</p>
                  {book.isCurrent && (
                    <span className="bg-white/10 text-white/60 text-xs px-2 py-0.5 rounded-full flex-shrink-0">Actual</span>
                  )}
                </div>
                <p className="text-white/40 text-xs mt-0.5">
                  {book.author} · {MONTHS[(book.month ?? 1) - 1]} {book.year}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {!book.isCurrent && (
                  <button onClick={() => setCurrentBook(book._id)} className="text-white/30 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors" title="Marcar como libro actual">
                    <Check size={16} />
                  </button>
                )}
                <button onClick={() => deleteBook(book._id)} className="text-white/30 hover:text-red-400 p-2 rounded-lg hover:bg-white/5 transition-colors" title="Eliminar">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ──────────── REUNIÓN ──────────── */
function MeetingTab() {
  const [meeting, setMeeting]   = useState<MeetingLink | null>(null)
  const [url, setUrl]           = useState('')
  const [label, setLabel]       = useState('')
  const [loading, setLoading]   = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved]       = useState(false)

  useEffect(() => {
    api.get<MeetingLink | null>('/meeting').then(data => {
      setMeeting(data)
      setUrl(data?.url ?? '')
      setLabel(data?.label ?? '')
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return
    setSubmitting(true)
    try {
      const data = await api.post<MeetingLink>('/meeting', {
        url: url.trim(),
        label: label.trim() || 'Sesión semanal',
      })
      setMeeting(data)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>

  return (
    <div className="max-w-xl">
      <h2 className="text-white text-lg font-medium mb-6">Link de la sesión semanal</h2>

      {meeting && (
        <div className="liquid-glass rounded-2xl p-5 mb-6">
          <p className="text-white/40 text-xs tracking-widest uppercase mb-3">Link actual</p>
          <a href={meeting.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors break-all">
            <ExternalLink size={13} className="flex-shrink-0" />
            {meeting.url}
          </a>
          {meeting.label && <p className="text-white/30 text-xs mt-2">{meeting.label}</p>}
        </div>
      )}

      <form onSubmit={handleSave} className="liquid-glass rounded-2xl p-6 flex flex-col gap-4">
        <p className="text-white/40 text-xs tracking-widest uppercase">
          {meeting ? 'Actualizar link de esta semana' : 'Publicar link de esta semana'}
        </p>
        <div>
          <label className="text-white/50 text-xs block mb-1.5">URL de la videollamada *</label>
          <input
            type="url" value={url} onChange={e => setUrl(e.target.value)} required
            placeholder="https://meet.google.com/... o https://zoom.us/..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 text-sm outline-none focus:border-white/30 transition-colors"
          />
        </div>
        <div>
          <label className="text-white/50 text-xs block mb-1.5">Etiqueta (opcional)</label>
          <input
            type="text" value={label} onChange={e => setLabel(e.target.value)}
            placeholder="Ej: Sesión de mayo — Capítulos 1 al 5"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 text-sm outline-none focus:border-white/30 transition-colors"
          />
        </div>
        <button type="submit" disabled={submitting || !url.trim()} className="bg-white text-black font-medium rounded-full py-3 hover:bg-white/90 transition-colors disabled:opacity-50">
          {saved ? '✓ Link actualizado' : submitting ? 'Guardando...' : 'Publicar link'}
        </button>
      </form>
      <p className="text-white/25 text-xs text-center mt-4 leading-relaxed">
        Funciona con Google Meet, Zoom, Teams o cualquier plataforma. Cada vez que publiques un nuevo link, todos los miembros verán el más reciente.
      </p>
    </div>
  )
}

/* ──────────── BLOG ──────────── */
function BlogTab() {
  const [articles, setArticles]     = useState<Article[]>([])
  const [loading, setLoading]       = useState(true)
  const [showForm, setShowForm]     = useState(false)
  const [title, setTitle]           = useState('')
  const [excerpt, setExcerpt]       = useState('')
  const [content, setContent]       = useState('')
  const [category, setCategory]     = useState('')
  const [authorName, setAuthorName] = useState('moreperezmontemayor')
  const [coverFile, setCoverFile]   = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { loadArticles() }, [])

  async function loadArticles() {
    const data = await api.get<Article[]>('/articles').catch(() => [])
    setArticles(data)
    setLoading(false)
  }

  async function handleAddArticle(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('title', title.trim())
      formData.append('excerpt', excerpt.trim())
      formData.append('content', content.trim())
      formData.append('category', category.trim())
      formData.append('authorName', authorName.trim() || 'moreperezmontemayor')
      if (coverFile) formData.append('cover', coverFile)

      const article = await api.upload<Article>('/articles', formData)
      setArticles(prev => [article, ...prev])
      setTitle(''); setExcerpt(''); setContent(''); setCategory(''); setAuthorName('moreperezmontemayor')
      setCoverFile(null)
      if (fileRef.current) fileRef.current.value = ''
      setShowForm(false)
    } finally {
      setSubmitting(false)
    }
  }

  async function deleteArticle(id: string) {
    if (!confirm('¿Eliminar este artículo?')) return
    await api.delete(`/articles/${id}`)
    setArticles(prev => prev.filter(a => a._id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-lg font-medium">Blog Gastronómico</h2>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 bg-white text-black text-sm font-medium rounded-full px-5 py-2 hover:bg-white/90 transition-colors"
        >
          <Plus size={15} /> Nuevo artículo
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddArticle} className="liquid-glass rounded-2xl p-6 mb-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-white/40 text-xs tracking-widest uppercase">Nuevo artículo</p>
            <button type="button" onClick={() => setShowForm(false)} className="text-white/30 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-white/50 text-xs block mb-1">Título *</label>
              <input
                value={title} onChange={e => setTitle(e.target.value)} required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs block mb-1">Categoría</label>
              <input
                value={category} onChange={e => setCategory(e.target.value)}
                placeholder="Ej: Recetas, Tendencias..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs block mb-1">Autor</label>
              <input
                value={authorName} onChange={e => setAuthorName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-white/50 text-xs block mb-1">Extracto / descripción corta</label>
            <textarea
              value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="text-white/50 text-xs block mb-1">Contenido del artículo</label>
            <textarea
              value={content} onChange={e => setContent(e.target.value)} rows={8}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="text-white/50 text-xs block mb-2">Imagen de portada</label>
            <input
              ref={fileRef} type="file" accept="image/*"
              onChange={e => setCoverFile(e.target.files?.[0] ?? null)}
              className="text-white/40 text-sm file:mr-3 file:bg-white/10 file:text-white file:text-xs file:rounded-full file:px-4 file:py-1.5 file:border-0 file:cursor-pointer hover:file:bg-white/20"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="text-white/50 text-sm px-5 py-2 rounded-full hover:text-white transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={submitting} className="bg-white text-black text-sm font-medium rounded-full px-6 py-2 hover:bg-white/90 transition-colors disabled:opacity-50">
              {submitting ? 'Publicando...' : 'Publicar artículo'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16">
          <Newspaper size={32} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">No hay artículos publicados aún.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {articles.map(article => (
            <div key={article._id} className="liquid-glass rounded-xl p-4 flex items-center gap-4">
              {article.coverUrl ? (
                <img src={article.coverUrl} alt={article.title} className="w-12 h-9 object-cover rounded-lg flex-shrink-0" />
              ) : (
                <div className="w-12 h-9 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Newspaper size={14} className="text-white/20" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{article.title}</p>
                <p className="text-white/30 text-xs mt-0.5">
                  {article.category ? `${article.category} · ` : ''}{article.authorName}
                </p>
              </div>
              <button
                onClick={() => deleteArticle(article._id)}
                className="text-white/30 hover:text-red-400 p-2 rounded-lg hover:bg-white/5 transition-colors flex-shrink-0"
                title="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ──────────── MIEMBROS ──────────── */
function PasswordForm({ memberId, onClose }: { memberId: string; onClose: () => void }) {
  const [newPassword, setNewPassword] = useState('')
  const [submitting, setSubmitting]   = useState(false)
  const [saved, setSaved]             = useState(false)
  const [error, setError]             = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await api.patch(`/users/${memberId}/password`, { password: newPassword })
      setSaved(true)
      setNewPassword('')
      setTimeout(() => { setSaved(false); onClose() }, 1500)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
          placeholder="Nueva contraseña (mín. 6 caracteres)" required minLength={6}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/25 text-sm outline-none focus:border-white/30 transition-colors"
        />
        <button type="submit" disabled={submitting} className="bg-white text-black text-xs font-medium rounded-xl px-4 py-2 hover:bg-white/90 transition-colors disabled:opacity-50 flex-shrink-0">
          {saved ? '✓ Guardado' : submitting ? '...' : 'Guardar'}
        </button>
        <button type="button" onClick={onClose} className="text-white/30 hover:text-white p-2 transition-colors flex-shrink-0">
          <X size={14} />
        </button>
      </div>
      {error && <p className="text-red-400/80 text-xs">{error}</p>}
    </form>
  )
}

function MembersTab() {
  const { profile: currentProfile } = useAuth()
  const [members, setMembers]         = useState<Profile[]>([])
  const [loading, setLoading]         = useState(true)
  const [showForm, setShowForm]       = useState(false)
  const [error, setError]             = useState('')
  const [changingPwdId, setChangingPwdId] = useState<string | null>(null)

  const [username, setUsername] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { loadMembers() }, [])

  async function loadMembers() {
    const data = await api.get<Profile[]>('/users').catch(() => [])
    setMembers(data)
    setLoading(false)
  }

  async function handleCreateMember(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const member = await api.post<Profile>('/users', { username, email, password, fullName })
      setMembers(prev => [...prev, member])
      setUsername(''); setEmail(''); setPassword(''); setFullName('')
      setShowForm(false)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  async function toggleRole(member: Profile) {
    const newRole = member.role === 'admin' ? 'member' : 'admin'
    const updated = await api.patch<Profile>(`/users/${member._id}/role`, { role: newRole })
    setMembers(prev => prev.map(m => m._id === member._id ? updated : m))
  }

  async function deleteMember(memberId: string) {
    if (!confirm('¿Eliminar este miembro del club?')) return
    await api.delete(`/users/${memberId}`)
    setMembers(prev => prev.filter(m => m._id !== memberId))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-lg font-medium">
          Miembros del club
          {members.length > 0 && <span className="text-white/30 font-normal ml-2 text-base">({members.length})</span>}
        </h2>
        <button
          onClick={() => { setShowForm(v => !v); setError('') }}
          className="flex items-center gap-2 bg-white text-black text-sm font-medium rounded-full px-5 py-2 hover:bg-white/90 transition-colors"
        >
          <UserPlus size={15} /> Crear miembro
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateMember} className="liquid-glass rounded-2xl p-6 mb-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-white/40 text-xs tracking-widest uppercase">Nuevo miembro</p>
            <button type="button" onClick={() => setShowForm(false)} className="text-white/30 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Nombre de usuario *', value: username, set: setUsername, type: 'text' },
              { label: 'Nombre completo',     value: fullName, set: setFullName, type: 'text' },
              { label: 'Correo electrónico *', value: email,   set: setEmail,    type: 'email' },
              { label: 'Contraseña inicial *', value: password, set: setPassword, type: 'password' },
            ].map(({ label, value, set, type }) => (
              <div key={label}>
                <label className="text-white/50 text-xs block mb-1">{label}</label>
                <input
                  type={type} value={value} onChange={e => set(e.target.value)}
                  required={label.includes('*')}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors"
                />
              </div>
            ))}
          </div>
          {error && <p className="text-red-400/80 text-sm">{error}</p>}
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="text-white/50 text-sm px-5 py-2 rounded-full hover:text-white transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={submitting} className="bg-white text-black text-sm font-medium rounded-full px-6 py-2 hover:bg-white/90 transition-colors disabled:opacity-50">
              {submitting ? 'Creando...' : 'Crear miembro'}
            </button>
          </div>
        </form>
      )}

      <div className="liquid-glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/30 text-sm">No hay miembros registrados.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {members.map(member => (
              <div key={member._id} className="px-5 py-4">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                    {member.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{member.username}</p>
                    <p className="text-white/30 text-xs">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full ${member.role === 'admin' ? 'bg-white/10 text-white/70' : 'bg-white/5 text-white/30'}`}>
                    {member.role === 'admin' ? 'Admin' : 'Miembro'}
                  </span>
                  <button
                    onClick={() => setChangingPwdId(changingPwdId === member._id ? null : member._id)}
                    className="text-white/30 hover:text-white text-xs px-3 py-1 rounded-full border border-white/10 hover:border-white/30 transition-colors hidden sm:block"
                  >
                    Contraseña
                  </button>
                  {member._id !== currentProfile?._id && (
                    <>
                      <button onClick={() => toggleRole(member)} className="text-white/30 hover:text-white text-xs px-3 py-1 rounded-full border border-white/10 hover:border-white/30 transition-colors hidden sm:block">
                        {member.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                      </button>
                      <button onClick={() => deleteMember(member._id)} className="text-white/20 hover:text-red-400 p-1.5 transition-colors" title="Eliminar miembro">
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
                </div>
                {changingPwdId === member._id && (
                  <PasswordForm memberId={member._id} onClose={() => setChangingPwdId(null)} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
