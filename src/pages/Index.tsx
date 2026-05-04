import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Globe, ArrowRight, Camera, X as XIcon, BookOpen } from 'lucide-react'

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4'

function animateOpacity(
  el: HTMLVideoElement,
  from: number,
  to: number,
  duration: number,
  onDone?: () => void,
) {
  const start = performance.now()
  const tick = (now: number) => {
    const t = Math.min((now - start) / duration, 1)
    el.style.opacity = String(from + (to - from) * t)
    if (t < 1) {
      requestAnimationFrame(tick)
    } else {
      onDone?.()
    }
  }
  requestAnimationFrame(tick)
}

export default function Index() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const fadingOut = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => {
      video.play().catch(() => {})
      animateOpacity(video, 0, 1, 500)
    }

    const handleTimeUpdate = () => {
      if (!video.duration) return
      const remaining = video.duration - video.currentTime
      if (remaining <= 0.55 && !fadingOut.current) {
        fadingOut.current = true
        animateOpacity(video, 1, 0, 500)
      }
    }

    const handleEnded = () => {
      video.style.opacity = '0'
      fadingOut.current = false
      setTimeout(() => {
        video.currentTime = 0
        video.play().catch(() => {})
        animateOpacity(video, 0, 1, 500)
      }, 100)
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  return (
    <div className="min-h-screen overflow-hidden relative flex flex-col bg-black">
      {/* Background video */}
      <video
        ref={videoRef}
        src={HERO_VIDEO}
        className="absolute inset-0 w-full h-full object-cover object-bottom"
        style={{ opacity: 0 }}
        muted
        autoPlay
        playsInline
        preload="auto"
      />

      {/* Navbar */}
      <nav className="relative z-20 px-6 py-6">
        <div className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center">
            <BookOpen size={22} className="text-white" />
            <span className="text-white font-semibold text-lg ml-2">moreperezmontemayor</span>
            <div className="hidden lg:flex items-center gap-7 ml-8">
              <Link to="/dashboard" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Club de Lectura</Link>
              <a href="#nosotros"   className="text-white/80 hover:text-white text-sm font-medium transition-colors">Nosotros</a>
              <Link to="/blog"      className="text-white/80 hover:text-white text-sm font-medium transition-colors">Blog Gastronómico</Link>
              <a href="#eventos"    className="text-white/80 hover:text-white text-sm font-medium transition-colors">Próximos eventos</a>
              <a href="#contacto"   className="text-white/80 hover:text-white text-sm font-medium transition-colors">Contacto</a>
            </div>
          </div>
          {/* Right */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">
        <h1
          className="text-7xl md:text-8xl lg:text-9xl text-white tracking-tight whitespace-nowrap mb-8"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Conócelo todo <em className="italic">ahora</em>.
        </h1>

        {/* Email input */}
        <div className="max-w-xl w-full mb-6">
          <div className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3">
            <input
              type="email"
              placeholder="Ingresa tu correo electrónico"
              className="flex-1 bg-transparent text-white placeholder:text-white/40 text-sm outline-none"
            />
            <button className="bg-white rounded-full p-3 text-black flex items-center justify-center hover:bg-white/90 transition-colors flex-shrink-0">
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-white text-sm leading-relaxed px-4 max-w-md mb-8">
          Mantente al día con las últimas noticias y perspectivas. Suscríbete a nuestro boletín hoy y nunca te pierdas actualizaciones importantes.
        </p>

        {/* Manifesto button */}
        <button className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors">
          Lee nuestro manifiesto
        </button>
      </div>

      {/* Social icons footer */}
      <div className="relative z-10 flex justify-center gap-4 pb-12">
        <button className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
          <Camera size={20} />
        </button>
        <button className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
          <XIcon size={20} />
        </button>
        <button className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
          <Globe size={20} />
        </button>
      </div>
    </div>
  )
}
