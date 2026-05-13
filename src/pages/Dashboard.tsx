import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Video, BookOpen, ArrowRight, ExternalLink, MapPin, Wifi } from 'lucide-react'
import AppNav from '../components/AppNav'
import { api, mediaUrl } from '../lib/api'
import type { Book, MeetingLink, ClubEvent } from '../types'

const MONTHS = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
]

function nextWednesdayLabel(): string {
  const now = new Date()
  const daysUntil = (3 - now.getDay() + 7) % 7 || 7
  const wed = new Date(now)
  wed.setDate(now.getDate() + daysUntil)
  return wed.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function Dashboard() {
  const [books, setBooks]           = useState<Book[]>([])
  const [currentBook, setCurrentBook] = useState<Book | null>(null)
  const [meeting, setMeeting]       = useState<MeetingLink | null>(null)
  const [events, setEvents]         = useState<ClubEvent[]>([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Book[]>('/books'),
      api.get<MeetingLink | null>('/meeting'),
      api.get<ClubEvent[]>('/events'),
    ]).then(([booksData, meetingData, eventsData]) => {
      setBooks(booksData)
      setCurrentBook(booksData.find(b => b.isCurrent) ?? null)
      setMeeting(meetingData)
      setEvents(eventsData.filter(ev => new Date(ev.date) >= new Date()))
    }).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  const archiveBooks = books.filter(b => !b.isCurrent)

  return (
    <div className="min-h-screen bg-black">
      <AppNav />
      <main className="max-w-6xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">

          {/* Libro del mes */}
          <div className="lg:col-span-2">
            <p className="text-white/40 text-xs tracking-widest uppercase mb-4">Libro del mes</p>
            {currentBook ? (
              <div className="liquid-glass rounded-2xl p-6 md:p-8 flex gap-6 h-full">
                {currentBook.coverUrl && (
                  <img
                    src={mediaUrl(currentBook.coverUrl)}
                    alt={currentBook.title}
                    className="w-24 md:w-32 h-36 md:h-48 object-cover rounded-xl flex-shrink-0"
                  />
                )}
                <div className="flex flex-col justify-between min-w-0">
                  <div>
                    <p className="text-white/40 text-xs mb-2">
                      {MONTHS[(currentBook.month ?? 1) - 1]} {currentBook.year}
                    </p>
                    <h2
                      className="text-white text-2xl md:text-3xl tracking-tight mb-1 leading-tight"
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                      {currentBook.title}
                    </h2>
                    <p className="text-white/50 text-sm mb-4">{currentBook.author}</p>
                    {currentBook.description && (
                      <p className="text-white/60 text-sm leading-relaxed line-clamp-4">
                        {currentBook.description}
                      </p>
                    )}
                  </div>
                  <Link
                    to={`/libro/${currentBook._id}`}
                    className="flex items-center gap-2 text-white text-sm font-medium mt-6 group hover:gap-3 transition-all w-fit"
                  >
                    Ir al foro de discusión
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="liquid-glass rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center gap-3">
                <BookOpen size={32} className="text-white/20" />
                <p className="text-white/40 text-sm">No hay libro activo este mes.</p>
                <p className="text-white/20 text-xs">El administrador asignará uno pronto.</p>
              </div>
            )}
          </div>

          {/* Sesión semanal */}
          <div>
            <p className="text-white/40 text-xs tracking-widest uppercase mb-4">Sesión semanal</p>
            <div className="liquid-glass rounded-2xl p-6 flex flex-col gap-5 h-full">
              <div className="flex items-center gap-3">
                <div className="liquid-glass rounded-full p-3 flex-shrink-0">
                  <Video size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Próximo miércoles</p>
                  <p className="text-white/40 text-xs capitalize mt-0.5">{nextWednesdayLabel()}</p>
                </div>
              </div>

              {meeting ? (
                <>
                  <a
                    href={meeting.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-white text-black font-medium rounded-full py-3 px-6 hover:bg-white/90 transition-colors text-sm"
                  >
                    Ir a la clase
                    <ExternalLink size={15} />
                  </a>
                  {meeting.label && meeting.label !== 'Sesión semanal' && (
                    <p className="text-white/30 text-xs text-center leading-relaxed">{meeting.label}</p>
                  )}
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-white/25 text-xs text-center leading-relaxed">
                    El administrador publicará el link de esta semana pronto.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Próximos eventos — solo visible para miembros */}
        {events.length > 0 && (
          <div className="mb-16">
            <p className="text-white/40 text-xs tracking-widest uppercase mb-6">Próximos eventos</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map(ev => {
                const d     = new Date(ev.date)
                const day   = d.getDate()
                const month = MONTHS[d.getMonth()]
                const time  = d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
                return (
                  <div key={ev._id} className="liquid-glass rounded-2xl p-5 flex gap-5">
                    <div className="flex-shrink-0 text-center min-w-[2.5rem]">
                      <p className="text-white text-2xl font-semibold leading-none">{day}</p>
                      <p className="text-white/40 text-xs uppercase mt-1">{month.slice(0, 3)}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{ev.title}</p>
                      {ev.description && (
                        <p className="text-white/50 text-xs mt-1 leading-relaxed line-clamp-2">{ev.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="text-white/40 text-xs">{time} hrs</span>
                        {ev.location && (
                          ev.type === 'virtual' ? (
                            <a
                              href={ev.location}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs px-3 py-1 rounded-full transition-colors"
                              style={{ background: 'rgba(228,11,138,0.15)', color: '#E40B8A' }}
                            >
                              <Wifi size={10} />
                              Unirse a la sesión
                              <ExternalLink size={9} />
                            </a>
                          ) : (
                            <span className="flex items-center gap-1 text-white/40 text-xs">
                              <MapPin size={10} />
                              {ev.location}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Archivo */}
        {archiveBooks.length > 0 && (
          <div>
            <p className="text-white/40 text-xs tracking-widest uppercase mb-6">Lecturas anteriores</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {archiveBooks.map(book => (
                <Link
                  key={book._id}
                  to={`/libro/${book._id}`}
                  className="liquid-glass rounded-xl overflow-hidden hover:bg-white/5 transition-colors group"
                >
                  {book.coverUrl ? (
                    <img
                      src={mediaUrl(book.coverUrl)}
                      alt={book.title}
                      className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full aspect-[3/4] bg-white/5 flex items-center justify-center">
                      <BookOpen size={28} className="text-white/20" />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-white text-xs font-medium line-clamp-2 leading-snug mb-1">
                      {book.title}
                    </p>
                    <p className="text-white/30 text-xs">
                      {MONTHS[(book.month ?? 1) - 1]} {book.year}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
