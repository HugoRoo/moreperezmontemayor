import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Calendar } from 'lucide-react'

export default function EventsSection() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

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

        <motion.div
          className="liquid-glass rounded-2xl p-10 flex flex-col items-center text-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.25 }}
        >
          <Calendar size={32} className="text-white/20" />
          <p className="text-white/40 text-sm leading-relaxed max-w-sm">
            Las fechas de próximas sesiones y eventos especiales del club aparecerán aquí pronto.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
