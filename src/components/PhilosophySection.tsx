import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const PHILOSOPHY_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4'

export default function PhilosophySection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="bg-black py-28 md:py-40 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.h2
          className="text-5xl md:text-7xl lg:text-8xl text-white tracking-tight mb-16 md:mb-24"
          style={{ fontFamily: "'Instrument Serif', serif" }}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          Innovación{' '}
          <em className="italic text-white/40">x</em>
          {' '}Visión
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left: video */}
          <motion.div
            className="rounded-3xl overflow-hidden aspect-[4/3]"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <video
              src={PHILOSOPHY_VIDEO}
              className="w-full h-full object-cover"
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
            />
          </motion.div>

          {/* Right: text blocks */}
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Block 1 */}
            <div className="mb-8">
              <p className="text-white/40 text-xs tracking-widest uppercase mb-4">
                Elige tu espacio
              </p>
              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                Todo avance significativo comienza en la intersección de una estrategia disciplinada y una visión creativa extraordinaria. Operamos en ese cruce, convirtiendo el pensamiento audaz en resultados tangibles que mueven a las personas y transforman las industrias.
              </p>
            </div>

            <div className="w-full h-px bg-white/10 mb-8" />

            {/* Block 2 */}
            <div>
              <p className="text-white/40 text-xs tracking-widest uppercase mb-4">
                Moldea el futuro
              </p>
              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                Creemos que el mejor trabajo surge cuando la curiosidad se encuentra con la convicción. Nuestro proceso está diseñado para descubrir oportunidades ocultas y transformarlas en experiencias que resuenan mucho más allá de la primera impresión.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
