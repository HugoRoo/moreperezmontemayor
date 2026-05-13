import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Wifi } from 'lucide-react'
import { api } from '../lib/api'
import type { ClubEvent } from '../types'

const MONTHS_ES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
]

export default function EventsSection() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [events, setEvents] = useState<ClubEvent[]>([])

  useEffect(() => {
    api.get<ClubEvent[]>('/events')
      .then(data => setEvents(data.filter(ev => new Date(ev.date) >= new Date())))
      .catch(() => {})
  }, [])

  return (
    <section id="eventos" ref={ref} className="bg-black py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.p
          className="text-white/40 text-sm tracking-widest uppercase mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Próximos eventos
        </motion.p>

        <motion.h2
          className="text-4xl md:text-6xl text-white leading-tight tracking-tight mb-16"
          style={{ fontFamily: "'Instrument Serif', serif" }}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Únete a nuestras{' '}
          <em className="italic text-white/60">sesiones</em>
        </motion.h2>

        {events.length === 0 ? (
          <motion.div
            className="liquid-glass rounded-2xl p-10 flex flex-col items-center text-center gap-3"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            <p className="text-white/40 text-sm leading-relaxed max-w-sm">
              Las fechas de próximas sesiones y eventos especiales del club aparecerán aquí pronto.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((ev, i) => {
              const d     = new Date(ev.date)
              const day   = d.getDate()
              const month = MONTHS_ES[d.getMonth()]
              const year  = d.getFullYear()
              const time  = d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
              return (
                <motion.div
                  key={ev._id}
                  className="liquid-glass rounded-2xl p-6 flex gap-5"
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                >
                  <div className="flex-shrink-0 text-center min-w-[3rem]">
                    <p className="text-white text-3xl font-semibold leading-none">{day}</p>
                    <p className="text-white/40 text-xs uppercase mt-1">{month.slice(0, 3)}</p>
                    <p className="text-white/25 text-xs">{year}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium leading-snug">{ev.title}</p>
                    {ev.description && (
                      <p className="text-white/50 text-sm mt-1 leading-relaxed line-clamp-2">{ev.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      <span className="text-white/40 text-xs">{time} hrs</span>
                      {ev.location && (
                        <span className="flex items-center gap-1 text-white/40 text-xs">
                          {ev.type === 'virtual' ? <Wifi size={10} /> : <MapPin size={10} />}
                          <span className="truncate max-w-[160px]">{ev.location}</span>
                        </span>
                      )}
                      <span
                        className="text-xs px-2.5 py-0.5 rounded-full"
                        style={ev.type === 'presencial'
                          ? { background: 'rgba(228,11,138,0.15)', color: '#E40B8A' }
                          : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }
                        }
                      >
                        {ev.type === 'virtual' ? 'Virtual' : 'Presencial'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
