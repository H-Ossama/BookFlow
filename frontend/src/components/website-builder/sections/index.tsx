import { Link } from 'react-router-dom';
import { CalendarDays, ChevronRight, Star, Scissors, MapPin, Phone, Mail, ArrowRight, Check, Menu, X, Quote, Timer, Users, Shield, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { WebsiteTheme } from '../../../types/website.types';

interface SectionProps {
  content: Record<string, any>;
  theme: WebsiteTheme;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
      ))}
    </div>
  );
}

// ─── Shared Logo Component ───────────────────────────────
function LogoBlock({ content, size = 'sm' }: { content: Record<string, any>; size?: 'sm' | 'md' | 'lg' }) {
  const dims = size === 'lg' ? 'h-10 w-10' : size === 'md' ? 'h-8 w-8' : 'h-7 w-7';
  const textSize = size === 'lg' ? 'text-xl' : size === 'md' ? 'text-lg' : 'text-base';
  if (content.logoImage) {
    return <img src={content.logoImage} alt={content.logo || 'Logo'} className={`${dims} rounded-lg object-contain`} />;
  }
  if (content.logo) {
    return <span className={`text-white font-semibold ${textSize}`}>{content.logo}</span>;
  }
  return <span className={`text-white font-semibold ${textSize}`}>Business Name</span>;
}

// ─── Navbar ──────────────────────────────────────────────
function NavbarDefault({ content }: SectionProps) {
  const [open, setOpen] = useState(false);
  const links = content.links || [];
  return (
    <nav className="bg-[#0a0c10]/95 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <LogoBlock content={content} size="md" />
        </div>
        <div className="hidden md:flex items-center gap-1">
          {links.map((l: any, i: number) => (
            <Link key={i} to={l.href || '/'} className="px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5">{l.label}</Link>
          ))}
        </div>
        <button className="md:hidden p-2 text-gray-300" onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/5 px-4 py-4 space-y-2">
          {links.map((l: any, i: number) => (
            <Link key={i} to={l.href || '/'} className="block px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5">{l.label}</Link>
          ))}
        </div>
      )}
    </nav>
  );
}
function NavbarCentered({ content }: SectionProps) {
  const [open, setOpen] = useState(false);
  const links = content.links || [];
  return (
    <nav className="bg-[#0a0c10]/95 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-4xl mx-auto px-4 py-3 text-center">
        <div className="flex justify-center mb-2">
          <LogoBlock content={content} size="md" />
        </div>
        <div className="hidden md:flex justify-center gap-1">
          {links.map((l: any, i: number) => (
            <Link key={i} to={l.href || '/'} className="px-4 py-1.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5">{l.label}</Link>
          ))}
        </div>
        <button className="md:hidden text-gray-300" onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/5 px-4 py-4 space-y-2 text-center">
          {links.map((l: any, i: number) => (
            <Link key={i} to={l.href || '/'} className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5">{l.label}</Link>
          ))}
        </div>
      )}
    </nav>
  );
}
function NavbarMinimal({ content }: SectionProps) {
  return (
    <nav className="bg-[#0a0c10]/95 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center h-14 gap-2">
        <LogoBlock content={content} size="sm" />
      </div>
    </nav>
  );
}

// ─── Hero ────────────────────────────────────────────────
function Hero1({ content, theme }: SectionProps) {
  return (
    <section className="relative min-h-[70vh] sm:min-h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0c10] via-[#0f1219] to-[#141a24]" />
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(197,168,128,0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(197,168,128,0.1) 0%, transparent 50%)' }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 text-center">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6 max-w-4xl mx-auto">
          {content.title || 'Welcome to Your Business'}
        </h1>
        <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto mb-6 sm:mb-8 px-2 sm:px-0">
          {content.subtitle || 'We provide exceptional services tailored to your needs.'}
        </p>
        <Link to={content.buttonLink || '/book'} className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base text-[#0a0c10] font-semibold hover:opacity-90 transition-all" style={{ backgroundColor: theme.primaryColor }}>
          <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5" /> {content.buttonText || 'Book Now'} <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Link>
      </div>
    </section>
  );
}

function Hero2({ content, theme }: SectionProps) {
  return (
    <section className="relative min-h-[65vh] sm:min-h-[80vh] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0c10] via-[#0f1219] to-[#141a24]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6">
            {content.title || 'Welcome to Your Business'}
          </h1>
          <p className="text-sm sm:text-lg text-gray-400 mb-6 sm:mb-8">
            {content.subtitle || 'We provide exceptional services tailored to your needs.'}
          </p>
          <Link to={content.buttonLink || '/book'} className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base text-[#0a0c10] font-semibold hover:opacity-90 transition-all" style={{ backgroundColor: theme.primaryColor }}>
            <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5" /> {content.buttonText || 'Book Now'}
          </Link>
        </div>
        <div className="hidden lg:block">
          <div className="w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#c5a880]/20 to-[#c5a880]/5 border border-white/5 flex items-center justify-center">
            <span className="text-gray-600 text-lg">{content.imageLabel || 'Your Image'}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Hero3({ content, theme }: SectionProps) {
  return (
    <section className="relative min-h-[60vh] sm:min-h-[75vh] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0c10] via-[#0f1219] to-[#141a24]" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border text-[10px] sm:text-xs font-medium mb-4 sm:mb-6" style={{ borderColor: `${theme.primaryColor}40`, color: theme.primaryColor, backgroundColor: `${theme.primaryColor}10` }}>
          <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Premium Service
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6 px-2 sm:px-0" style={{ color: theme.textColor }}>
          {content.title || 'Welcome to Your Business'}
        </h1>
        <p className="text-sm sm:text-lg text-gray-400 max-w-2xl mx-auto mb-6 sm:mb-10 px-2 sm:px-0">
          {content.subtitle || 'We provide exceptional services tailored to your needs.'}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0">
          <Link to={content.buttonLink || '/book'} className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base text-[#0a0c10] font-semibold hover:opacity-90 transition-all" style={{ backgroundColor: theme.primaryColor }}>
            {content.buttonText || 'Book Now'}
          </Link>
          <Link to="/services" className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl border border-white/10 text-sm sm:text-base text-gray-300 hover:bg-white/5 transition-all">
            View Services <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Hero4({ content, theme }: SectionProps) {
  return (
    <section className="relative min-h-[75vh] sm:min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundColor: theme.secondaryColor }} />
      <div className="absolute inset-0" style={{ backgroundImage: content.backgroundImage ? `url(${content.backgroundImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3 }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-2xl">
          <p className="text-xs sm:text-sm font-medium mb-3 sm:mb-4" style={{ color: theme.primaryColor }}>WELCOME</p>
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-4 sm:mb-6">
            {content.title || 'Welcome to Your Business'}
          </h1>
          <p className="text-sm sm:text-lg text-gray-300 max-w-xl mb-6 sm:mb-8">
            {content.subtitle || 'We provide exceptional services tailored to your needs.'}
          </p>
          <Link to={content.buttonLink || '/book'} className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base text-[#0a0c10] font-semibold hover:opacity-90 transition-all" style={{ backgroundColor: theme.primaryColor }}>
            {content.buttonText || 'Book Now'} <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Services ────────────────────────────────────────────
function ServicesCards({ content }: SectionProps) {
  const services = content.services || [];
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#0f1219]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">{content.title || 'Our Services'}</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">{content.subtitle || 'Professional care tailored to you'}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length === 0 ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="p-4 sm:p-6 rounded-2xl border border-white/5 bg-[#121620]">
                <div className="w-12 h-12 rounded-xl bg-[#c5a880]/20 flex items-center justify-center mb-4"><Scissors className="h-6 w-6 text-[#c5a880]" /></div>
                <h3 className="text-white font-semibold mb-1">Service Name</h3>
                <p className="text-gray-400 text-sm mb-4">Service description goes here.</p>
                <div className="flex items-center justify-between"><span className="text-white font-bold">$0</span><span className="text-xs text-gray-500">0 min</span></div>
              </div>
            ))
          ) : services.map((s: any, i: number) => (
            <div key={i} className="p-4 sm:p-6 rounded-2xl border border-white/5 bg-[#121620]">
              <div className="w-12 h-12 rounded-xl bg-[#c5a880]/20 flex items-center justify-center mb-4"><Scissors className="h-6 w-6 text-[#c5a880]" /></div>
              <h3 className="text-white font-semibold mb-1">{s.name}</h3>
              {s.description && <p className="text-gray-400 text-sm mb-4">{s.description}</p>}
              <div className="flex items-center justify-between"><span className="text-white font-bold">${s.price || 0}</span><span className="text-xs text-gray-500">{s.duration || 0} min</span></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesList({ content }: SectionProps) {
  const services = content.services || [];
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">{content.title || 'Our Services'}</h2>
          <p className="text-gray-400">{content.subtitle || 'Professional care tailored to you'}</p>
        </div>
        <div className="space-y-3">
          {services.length === 0 ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-5 rounded-xl border border-white/5 bg-[#121620]">
                <div><h3 className="text-white font-medium">Service Name</h3><p className="text-gray-500 text-sm">Description</p></div>
                <span className="text-white font-semibold">$0</span>
              </div>
            ))
          ) : services.map((s: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-5 rounded-xl border border-white/5 bg-[#121620]">
              <div><h3 className="text-white font-medium">{s.name}</h3>{s.description && <p className="text-gray-500 text-sm">{s.description}</p>}</div>
              <span className="text-white font-semibold">${s.price || 0}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesMinimal({ content }: SectionProps) {
  return (
    <section className="py-20 bg-[#0f1219]/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">{content.title || 'Our Services'}</h2>
        <p className="text-gray-400 mb-8">{content.subtitle || 'Professional care tailored to you'}</p>
        <Link to="/services" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c5a880] text-[#0a0c10] font-semibold hover:bg-[#d6ba93] transition-all">
          View All Services <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

// ─── Booking ─────────────────────────────────────────────
function BookingDefault({ content, theme }: SectionProps) {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">{content.title || 'Book an Appointment'}</h2>
        <p className="text-gray-400 mb-8">{content.subtitle || 'Choose your service and pick a time that works for you.'}</p>
        <Link to="/book" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-[#0a0c10] font-semibold hover:opacity-90 transition-all" style={{ backgroundColor: theme.primaryColor }}>
          <CalendarDays className="h-5 w-5" /> {content.buttonText || 'Book Now'}
        </Link>
      </div>
    </section>
  );
}

function BookingSplit({ content, theme }: SectionProps) {
  return (
    <section className="py-20 bg-[#0f1219]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">{content.title || 'Book an Appointment'}</h2>
          <p className="text-gray-400 mb-6">{content.subtitle || 'Choose your service and pick a time that works for you.'}</p>
          <Link to="/book" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[#0a0c10] font-semibold hover:opacity-90 transition-all" style={{ backgroundColor: theme.primaryColor }}>
            {content.buttonText || 'Book Now'} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="p-8 rounded-2xl border border-white/5 bg-[#121620]">
          <div className="space-y-4">
            <div className="h-10 w-full rounded-lg bg-white/5 animate-pulse" />
            <div className="h-10 w-3/4 rounded-lg bg-white/5 animate-pulse" />
            <div className="h-10 w-full rounded-lg bg-white/5 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}

function BookingMinimal({ content, theme }: SectionProps) {
  return (
    <section className="py-10 sm:py-16 text-center">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-white mb-2">{content.title || 'Book Now'}</h2>
        <Link to="/book" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[#0a0c10] font-semibold hover:opacity-90 transition-all mt-4" style={{ backgroundColor: theme.primaryColor }}>
          {content.buttonText || 'Book an Appointment'}
        </Link>
      </div>
    </section>
  );
}

// ─── Gallery ─────────────────────────────────────────────
function GalleryGrid({ content }: SectionProps) {
  const images = content.images || [];
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">{content.title || 'Our Work'}</h2>
          <p className="text-gray-400">{content.subtitle || 'Take a look at what we do'}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.length === 0 ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square rounded-xl bg-[#121620] border border-white/5 flex items-center justify-center text-gray-600 text-sm">Image {i}</div>
            ))
          ) : images.map((img: any, i: number) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden border border-white/5">
              <img src={img.url || img} alt={img.alt || ''} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryCarousel({ content }: SectionProps) {
  return (
    <section className="py-20 bg-[#0f1219]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">{content.title || 'Our Work'}</h2>
          <p className="text-gray-400">{content.subtitle || 'Take a look at what we do'}</p>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="snap-center shrink-0 w-[300px] h-[200px] rounded-xl bg-[#121620] border border-white/5 flex items-center justify-center text-gray-600">Image {i}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryFull({ content }: SectionProps) {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">{content.title || 'Our Work'}</h2>
        </div>
        <div className="w-full aspect-[2/1] rounded-2xl bg-[#121620] border border-white/5 flex items-center justify-center text-gray-600">Gallery Grid</div>
      </div>
    </section>
  );
}

// ─── Testimonials ────────────────────────────────────────
function TestimonialsCards({ content }: SectionProps) {
  const testimonials = content.testimonials || [];
  return (
    <section className="py-20 bg-[#0f1219]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">{content.title || 'What Our Clients Say'}</h2>
          <p className="text-gray-400">{content.subtitle || 'Hear from our satisfied customers'}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.length === 0 ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="p-4 sm:p-6 rounded-2xl border border-white/5 bg-[#121620]">
                <StarRating rating={5} />
                <p className="text-gray-300 text-sm mt-3">&ldquo;Amazing service! Highly recommended.&rdquo;</p>
                <p className="text-gray-500 text-xs mt-3">- Happy Client</p>
              </div>
            ))
          ) : testimonials.map((t: any, i: number) => (
            <div key={i} className="p-4 sm:p-6 rounded-2xl border border-white/5 bg-[#121620]">
              <StarRating rating={t.rating || 5} />
              <p className="text-gray-300 text-sm mt-3">&ldquo;{t.text || 'Great service!'}&rdquo;</p>
              <p className="text-gray-500 text-xs mt-3">- {t.author || 'Client'}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsQuote({ content }: SectionProps) {
  const t = (content.testimonials || [])[0];
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <Quote className="h-10 w-10 text-[#c5a880]/30 mx-auto mb-6" />
        <p className="text-2xl text-gray-200 leading-relaxed mb-6">&ldquo;{t?.text || 'Amazing service! Highly recommended to everyone.'}&rdquo;</p>
        <StarRating rating={t?.rating || 5} />
        <p className="text-white font-medium mt-2">{t?.author || 'Happy Client'}</p>
      </div>
    </section>
  );
}

function TestimonialsGrid({ content }: SectionProps) {
  const testimonials = content.testimonials || [];
  return (
    <section className="py-20 bg-[#0f1219]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-12 text-center">{content.title || 'Testimonials'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.length === 0 ? (
            [1, 2].map((i) => (
              <div key={i} className="p-4 sm:p-6 rounded-2xl border border-white/5 bg-[#121620]">
                <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-full bg-[#c5a880]/20" /><div><p className="text-white text-sm font-medium">Client</p></div></div>
                <p className="text-gray-400 text-sm">&ldquo;Excellent service&rdquo;</p>
              </div>
            ))
          ) : testimonials.map((t: any, i: number) => (
            <div key={i} className="p-4 sm:p-6 rounded-2xl border border-white/5 bg-[#121620]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#c5a880]/20 flex items-center justify-center text-[#c5a880] text-sm font-medium">{t.author?.[0] || 'C'}</div>
                <div><p className="text-white text-sm font-medium">{t.author || 'Client'}</p><StarRating rating={t.rating || 5} /></div>
              </div>
              <p className="text-gray-400 text-sm">&ldquo;{t.text || 'Great service!'}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ─────────────────────────────────────────────
function ContactDefault({ content }: SectionProps) {
  const fields: { icon: any; label: string; value: string }[] = [];
  if (content.address) fields.push({ icon: MapPin, label: 'Address', value: content.address });
  if (content.phone) fields.push({ icon: Phone, label: 'Phone', value: content.phone });
  if (content.email) fields.push({ icon: Mail, label: 'Email', value: content.email });
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">{content.title || 'Get in Touch'}</h2>
          <p className="text-gray-400 mb-8">{content.subtitle || 'We would love to hear from you'}</p>
          {fields.length === 0 ? (
            <div className="space-y-4">
              {['Address', 'Phone', 'Email'].map((l) => (
                <div key={l} className="flex items-center gap-4 p-4 rounded-xl bg-[#121620] border border-white/5">
                  <div className="w-10 h-10 rounded-lg bg-[#c5a880]/10 flex items-center justify-center"><MapPin className="h-5 w-5 text-[#c5a880]" /></div>
                  <div><p className="text-white text-sm font-medium">{l}</p><p className="text-gray-400 text-sm">Your {l.toLowerCase()} here</p></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((f, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[#121620] border border-white/5">
                  <div className="w-10 h-10 rounded-lg bg-[#c5a880]/10 flex items-center justify-center"><f.icon className="h-5 w-5 text-[#c5a880]" /></div>
                  <div><p className="text-white text-sm font-medium">{f.label}</p><p className="text-gray-400 text-sm">{f.value}</p></div>
                </div>
              ))}
            </div>
          )}
        </div>
        {content.showForm !== false && (
          <div className="p-8 rounded-2xl border border-white/5 bg-[#121620]">
            <h3 className="text-white font-semibold mb-6">Send a Message</h3>
            <div className="space-y-4">
              <div className="h-10 w-full rounded-lg bg-white/5 animate-pulse" />
              <div className="h-10 w-full rounded-lg bg-white/5 animate-pulse" />
              <div className="h-24 w-full rounded-lg bg-white/5 animate-pulse" />
              <div className="h-10 w-32 rounded-lg bg-[#c5a880]/50 animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ContactSplit({ content }: SectionProps) {
  return (
    <section className="py-20 bg-[#0f1219]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">{content.title || 'Get in Touch'}</h2>
        <p className="text-gray-400 mb-6">{content.subtitle || 'We would love to hear from you'}</p>
        <div className="flex flex-wrap justify-center gap-6">
          {content.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#c5a880]" /><span className="text-gray-300 text-sm">{content.phone}</span></div>}
          {content.email && <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#c5a880]" /><span className="text-gray-300 text-sm">{content.email}</span></div>}
          {content.address && <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#c5a880]" /><span className="text-gray-300 text-sm">{content.address}</span></div>}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────
function FooterDefault({ content }: SectionProps) {
  return (
    <footer className="bg-[#0a0c10] border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-400 text-sm mb-2">{content.description || 'Your trusted partner for exceptional service.'}</p>
        <p className="text-gray-600 text-xs">&copy; {new Date().getFullYear()} {content.copyright || 'All rights reserved.'}</p>
        {content.showPoweredBy !== false && <p className="text-gray-700 text-xs mt-2">Powered by BookingHub</p>}
      </div>
    </footer>
  );
}

function FooterMinimal({ content }: SectionProps) {
  return (
    <footer className="bg-[#0a0c10] border-t border-white/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-xs">{content.description || 'Your trusted partner.'}</p>
        <p className="text-gray-600 text-xs">&copy; {new Date().getFullYear()} {content.copyright || 'All rights reserved.'}</p>
      </div>
    </footer>
  );
}

function FooterColumns({ content }: SectionProps) {
  return (
    <footer className="bg-[#0a0c10] border-t border-white/5 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div><p className="text-white font-semibold mb-3">About</p><p className="text-gray-400 text-sm">{content.description || 'Your trusted partner.'}</p></div>
        <div><p className="text-white font-semibold mb-3">Quick Links</p>
          <div className="space-y-2 text-sm text-gray-400">
            <p>Home</p><p>Services</p><p>Contact</p>
          </div>
        </div>
        <div><p className="text-white font-semibold mb-3">Contact</p>
          <div className="space-y-2 text-sm text-gray-400">
            {content.phone && <p>{content.phone}</p>}
            {content.email && <p>{content.email}</p>}
            {content.address && <p>{content.address}</p>}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-white/5 text-center">
        <p className="text-gray-600 text-xs">&copy; {new Date().getFullYear()} {content.copyright || 'All rights reserved.'}</p>
      </div>
    </footer>
  );
}

// ─── CTA ─────────────────────────────────────────────────
function CTADefault({ content, theme }: SectionProps) {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="p-6 sm:p-12 rounded-3xl border border-white/5 bg-gradient-to-br from-[#c5a880]/5 to-transparent">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">{content.title || 'Ready to Get Started?'}</h2>
          <p className="text-gray-400 mb-8">{content.subtitle || 'Book your appointment today.'}</p>
          <Link to={content.buttonLink || '/book'} className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-[#0a0c10] font-semibold hover:opacity-90 transition-all" style={{ backgroundColor: theme.primaryColor }}>
            {content.buttonText || 'Book Now'} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function CTACentered({ content, theme }: SectionProps) {
  return (
    <section className="py-20 bg-[#0f1219]/30">
      <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">{content.title || 'Ready to Get Started?'}</h2>
        <Link to={content.buttonLink || '/book'} className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-[#0a0c10] font-semibold hover:opacity-90 transition-all" style={{ backgroundColor: theme.primaryColor }}>
          {content.buttonText || 'Book Now'}
        </Link>
      </div>
    </section>
  );
}

// ─── Pricing ─────────────────────────────────────────────
function PricingCards({ content }: SectionProps) {
  const plans = content.plans || [];
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">{content.title || 'Pricing'}</h2>
          <p className="text-gray-400">{content.subtitle || 'Choose the plan that fits you'}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.length === 0 ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/5 bg-[#121620] text-center">
                <p className="text-gray-400 text-sm mb-2">Plan {i}</p>
                <p className="text-2xl sm:text-3xl text-white font-bold mb-4">$0</p>
                <div className="space-y-2 mb-6">
                  {[1, 2, 3].map((j) => <p key={j} className="text-gray-500 text-sm">Feature {j}</p>)}
                </div>
                <div className="py-2 px-4 rounded-lg bg-[#c5a880]/20 text-[#c5a880] text-sm font-medium">Choose</div>
              </div>
            ))
          ) : plans.map((p: any, i: number) => (
            <div key={i} className={`p-6 rounded-2xl border ${p.highlighted ? 'border-[#c5a880] bg-[#c5a880]/5' : 'border-white/5 bg-[#121620]'} text-center`}>
              <p className="text-gray-400 text-sm mb-2">{p.name}</p>
              <p className="text-2xl sm:text-3xl text-white font-bold mb-4">${p.price || 0}</p>
              <div className="space-y-2 mb-6">{(p.features || []).map((f: string, j: number) => <p key={j} className="text-gray-400 text-sm">{f}</p>)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Team ────────────────────────────────────────────────
function TeamGrid({ content }: SectionProps) {
  const members = content.members || [];
  return (
    <section className="py-20 bg-[#0f1219]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">{content.title || 'Our Team'}</h2>
          <p className="text-gray-400">{content.subtitle || 'Meet our talented team'}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.length === 0 ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/5 bg-[#121620] text-center">
                <div className="w-20 h-20 rounded-full bg-[#c5a880]/20 mx-auto mb-4 flex items-center justify-center text-[#c5a880] text-xl font-bold">T{i}</div>
                <h3 className="text-white font-medium">Team Member</h3>
                <p className="text-gray-500 text-sm">Role</p>
              </div>
            ))
          ) : members.map((m: any, i: number) => (
            <div key={i} className="p-6 rounded-2xl border border-white/5 bg-[#121620] text-center">
              <div className="w-20 h-20 rounded-full bg-[#c5a880]/20 mx-auto mb-4 flex items-center justify-center text-[#c5a880] text-xl font-bold">{m.name?.[0] || 'T'}</div>
              <h3 className="text-white font-medium">{m.name}</h3>
              <p className="text-gray-500 text-sm">{m.role || ''}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────
function FAQDefault({ content }: SectionProps) {
  const items = content.items || [];
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 text-center">{content.title || 'FAQ'}</h2>
        <p className="text-gray-400 text-center mb-10">{content.subtitle || 'Frequently asked questions'}</p>
        <div className="space-y-2">
          {items.length === 0 ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-xl border border-white/5 bg-[#121620]">
                <p className="text-white font-medium text-sm">Question {i}?</p>
                <p className="text-gray-400 text-sm mt-2">Answer {i}.</p>
              </div>
            ))
          ) : items.map((item: any, i: number) => (
            <div key={i} className="rounded-xl border border-white/5 bg-[#121620] overflow-hidden">
              <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="w-full p-4 text-left flex items-center justify-between cursor-pointer">
                <span className="text-white text-sm font-medium">{item.question}</span>
                <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${openIdx === i ? 'rotate-90' : ''}`} />
              </button>
              {openIdx === i && <div className="px-4 pb-4"><p className="text-gray-400 text-sm">{item.answer}</p></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section Renderer ────────────────────────────────────
const SECTION_MAP: Record<string, Record<string, React.ComponentType<SectionProps>>> = {
  navbar: { default: NavbarDefault, centered: NavbarCentered, minimal: NavbarMinimal },
  hero: { hero1: Hero1, hero2: Hero2, hero3: Hero3, hero4: Hero4 },
  services: { cards: ServicesCards, list: ServicesList, minimal: ServicesMinimal },
  booking: { default: BookingDefault, split: BookingSplit, minimal: BookingMinimal },
  gallery: { grid: GalleryGrid, carousel: GalleryCarousel, full: GalleryFull },
  testimonials: { cards: TestimonialsCards, quote: TestimonialsQuote, grid: TestimonialsGrid },
  contact: { default: ContactDefault, split: ContactSplit },
  footer: { default: FooterDefault, minimal: FooterMinimal, columns: FooterColumns },
  pricing: { cards: PricingCards },
  team: { grid: TeamGrid },
  faq: { default: FAQDefault },
  cta: { default: CTADefault, centered: CTACentered },
};

export function getSectionVariants(type: string): string[] {
  return Object.keys(SECTION_MAP[type] || { default: SectionNull });
}

export function SectionNull(_: SectionProps) {
  return <section className="py-20 text-center text-gray-500">Section placeholder</section>;
}

export function renderSection(type: string, variant: string, content: Record<string, any>, theme: WebsiteTheme) {
  const group = SECTION_MAP[type];
  if (!group) return <SectionNull content={content} theme={theme} />;
  const Comp = group[variant] || group[Object.keys(group)[0]] || SectionNull;
  return <Comp content={content} theme={theme} />;
}
