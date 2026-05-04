import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const FEATURED_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4'

export default function FeaturedVideoSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="bg-black pt-6 md:pt-10 pb-20 md:pb-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="rounded-3xl overflow-hidden aspect-video relative"
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
        >
          <video
            src={FEATURED_VIDEO}
            className="w-full h-full object-cover"
            muted
            autoPlay
            loop
            playsInline
            preload="auto"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Bottom overlay content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            {/* Left card */}
            <div className="liquid-glass rounded-2xl p-6 md:p-8 max-w-md">
              <p className="text-white/50 text-xs tracking-widest uppercase mb-3">
                Nuestro Enfoque
              </p>
              <p className="text-white text-sm md:text-base leading-relaxed">
                Creemos en el poder de la exploración impulsada por la curiosidad. Cada proyecto comienza con una pregunta, y cada respuesta abre una nueva puerta a la innovación.
              </p>
            </div>

            {/* Right button */}
            <motion.button
              className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium self-start md:self-auto flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explorar más
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
