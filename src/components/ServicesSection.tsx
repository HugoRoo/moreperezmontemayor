import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const CARD_1_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4'

const CARD_2_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4'

interface ServiceCardProps {
  videoUrl: string
  tag: string
  title: string
  description: string
  delay: number
  inView: boolean
}

function ServiceCard({ videoUrl, tag, title, description, delay, inView }: ServiceCardProps) {
  return (
    <motion.div
      className="liquid-glass rounded-3xl overflow-hidden group"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay }}
    >
      {/* Video area */}
      <div className="aspect-video relative overflow-hidden">
        <video
          src={videoUrl}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Card body */}
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-white/40 text-xs tracking-widest uppercase">{tag}</span>
          <div className="liquid-glass rounded-full p-2 flex-shrink-0">
            <ArrowUpRight size={16} className="text-white" />
          </div>
        </div>
        <h3
          className="text-white text-xl md:text-2xl mb-3 tracking-tight"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          {title}
        </h3>
        <p className="text-white/50 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

export default function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="bg-black py-28 md:py-40 px-6 overflow-hidden">
      <div className="bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)] max-w-6xl mx-auto" ref={ref}>
        {/* Header row */}
        <motion.div
          className="flex items-center justify-between mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2
            className="text-3xl md:text-5xl text-white tracking-tight"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Qué hacemos
          </h2>
          <span className="hidden md:block text-white/40 text-sm">Nuestros servicios</span>
        </motion.div>

        {/* Two-card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <ServiceCard
            videoUrl={CARD_1_VIDEO}
            tag="Estrategia"
            title="Investigación y Perspectiva"
            description="Profundizamos en datos, cultura y comportamiento humano para descubrir los conocimientos que impulsan cambios significativos y duraderos."
            delay={0}
            inView={inView}
          />
          <ServiceCard
            videoUrl={CARD_2_VIDEO}
            tag="Ejecución"
            title="Diseño y Desarrollo"
            description="Desde el concepto hasta el lanzamiento, nos obsesionamos con cada detalle para entregar experiencias que se sienten naturales y lucen extraordinarias."
            delay={0.15}
            inView={inView}
          />
        </div>
      </div>
    </section>
  )
}
