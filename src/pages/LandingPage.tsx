import Index          from './Index'
import AboutSection   from '../components/AboutSection'
import FeaturedVideoSection from '../components/FeaturedVideoSection'
import PhilosophySection    from '../components/PhilosophySection'
import ServicesSection      from '../components/ServicesSection'
import BlogSection          from '../components/BlogSection'
import EventsSection        from '../components/EventsSection'
import ContactSection       from '../components/ContactSection'

export default function LandingPage() {
  return (
    <div className="bg-black">
      <Index />
      <AboutSection />
      <FeaturedVideoSection />
      <PhilosophySection />
      <ServicesSection />
      <BlogSection />
      <EventsSection />
      <ContactSection />
    </div>
  )
}
