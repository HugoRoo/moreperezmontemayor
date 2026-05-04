import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail } from 'lucide-react'

export default function ContactSection() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="contacto" ref={ref} className="bg-black py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.p
          className="text-white/40 text-sm tracking-widest uppercase mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Contacto
        </motion.p>

        <motion.h2
          className="text-4xl md:text-6xl text-white leading-tight tracking-tight mb-16"
          style={{ fontFamily: "'Instrument Serif', serif" }}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Hablemos sobre{' '}
          <em className="italic text-white/60">tu próxima lectura</em>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            className="liquid-glass rounded-2xl p-8 flex flex-col gap-4"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
              <Mail size={18} className="text-white/50" />
            </div>
            <div>
              <p className="text-white/40 text-xs tracking-widest uppercase mb-1">Correo electrónico</p>
              <a
                href="mailto:hola@moreperezmontemayor.com"
                className="text-white text-sm hover:text-white/70 transition-colors"
              >
                hola@moreperezmontemayor.com
              </a>
            </div>
          </motion.div>

          <motion.div
            className="liquid-glass rounded-2xl p-8 flex flex-col gap-5"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <p className="text-white/40 text-xs tracking-widest uppercase">Envíanos un mensaje</p>
            <input
              type="text"
              placeholder="Tu nombre"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 text-sm outline-none focus:border-white/30 transition-colors"
            />
            <textarea
              rows={3}
              placeholder="¿En qué podemos ayudarte?"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 text-sm outline-none focus:border-white/30 transition-colors resize-none"
            />
            <button className="bg-white text-black text-sm font-medium rounded-full py-3 hover:bg-white/90 transition-colors">
              Enviar mensaje
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
