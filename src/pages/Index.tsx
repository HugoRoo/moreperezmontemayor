import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

const HERO_VIDEO = 'https://res.cloudinary.com/djozjtygj/video/upload/v1778111073/moreperezmontemayor/hero-video.mp4'

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  )
}

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
  const videoRef  = useRef<HTMLVideoElement>(null)
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
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ opacity: 0 }}
        muted
        autoPlay
        playsInline
        preload="auto"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55 z-[1]" />

      {/* Navbar */}
      <nav className="relative z-20 px-6 py-6">
        <div className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center">
          <BookOpen size={22} className="text-white flex-shrink-0" />
          <span className="text-white font-semibold text-lg ml-2 flex-shrink-0">moreperezmontemayor</span>
          <div className="hidden lg:flex items-center gap-7 ml-8">
            <a href="#nosotros" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Nosotros</a>
            <Link to="/blog"    className="text-white/80 hover:text-white text-sm font-medium transition-colors">Blog Gastronómico</Link>
            <a href="#eventos"  className="text-white/80 hover:text-white text-sm font-medium transition-colors">Próximos eventos</a>
            <a href="#contacto" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Contacto</a>
            <Link
              to="/login"
              className="rounded-full px-5 py-2 text-white text-sm font-medium transition-all hover:brightness-110 whitespace-nowrap"
              style={{
                background: 'rgba(228,11,138,0.55)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15)',
              }}
            >
              Ir al club de lectura
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero content + social icons — single flex column filling remaining height */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-between px-6 pb-10 pt-4 text-center">

        {/* Center block */}
        <div className="flex-1 flex flex-col items-center justify-center pb-36">

          {/* Title — three lines + botón alineado al tercer renglón */}
          <div className="mb-8 flex flex-col items-end gap-2">
            <p
              className="text-6xl md:text-7xl lg:text-8xl text-white tracking-widest leading-none uppercase self-start mt-px"
              style={{ fontFamily: "'Lato', sans-serif", fontWeight: 600 }}
            >
              Un libro
            </p>
            <p
              className="text-6xl md:text-7xl lg:text-8xl text-white tracking-widest leading-none uppercase"
              style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
            >
              Se disfruta
            </p>

            <p
              className="text-3xl md:text-4xl lg:text-5xl text-white tracking-tight leading-none"
              style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700 }}
            >
              en el sabor de sus <span style={{ color: '#E40B8A' }}>páginas.</span>
            </p>
            <p className="text-base md:text-lg text-white leading-relaxed text-right max-w-sm mt-4">
              Mantente cerca, reflexiona, aporta, comparte y vuelve de este club de lectura, un nuevo círculo donde se refuerza la amistad, la memoría y consume el sabor más delicioso del conocimiento gastronómico.
            </p>
          </div>

        </div>

        {/* Social icons + Próximos Eventos — pegados al fondo */}
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://www.facebook.com/more.funes.9?locale=es_LA"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
          >
            <FacebookIcon />
          </a>
          <a
            href="#eventos"
            className="rounded-full px-6 py-3 text-white text-sm font-medium transition-all hover:brightness-110"
            style={{
              background: 'rgba(228,11,138,0.55)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15)',
            }}
          >
            Próximos Eventos
          </a>
          <a
            href="https://www.instagram.com/circulogastronomico.conmore/"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
          >
            <InstagramIcon />
          </a>
        </div>
      </div>
    </div>
  )
}
