import { Link } from 'react-router-dom';
import { useCustomerPortal } from '../../context/CustomerPortalContext';
import { ArrowRight, CalendarDays, Clock, Star, ChevronRight, Scissors, Sparkles, Shield, Timer } from 'lucide-react';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
      ))}
    </div>
  );
}

export function CustomerHomePage() {
  const { company } = useCustomerPortal();
  if (!company) return null;

  const featured = company.services.slice(0, 6);
  const avgRating = company.reviews.length
    ? Math.round(company.reviews.reduce((a, r) => a + r.rating, 0) / company.reviews.length)
    : 0;

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0c10] via-[#0f1219] to-[#141a24]" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(197,168,128,0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(197,168,128,0.1) 0%, transparent 50%)'
        }} />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c5a880]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#c5a880]/3 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c5a880]/10 border border-[#c5a880]/20 text-[#c5a880] text-xs font-medium mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Premium booking platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c5a880] to-[#e8d5b8]">
                {company.name}
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 leading-relaxed mb-8 max-w-2xl">
              {company.description || 'Book your appointment online in seconds. Choose from our range of professional services and find the perfect time for you.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/book"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#c5a880] text-[#0a0c10] font-semibold text-base hover:bg-[#d6ba93] transition-all"
              >
                <CalendarDays className="h-5 w-5" />
                Book an Appointment
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-white/10 text-gray-300 font-medium text-base hover:bg-white/5 hover:text-white transition-all"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="relative -mt-16 mb-16 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden bg-white/5">
            {[
              { icon: Scissors, label: 'Services', value: company.services.length },
              { icon: Clock, label: 'Years Experience', value: '5+' },
              { icon: Star, label: 'Rating', value: avgRating > 0 ? `${avgRating}.0` : 'New' },
              { icon: CalendarDays, label: 'Bookings', value: company._count.reviews > 50 ? '500+' : '50+' },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#0f1219]/90 backdrop-blur-sm p-6 text-center">
                <stat.icon className="h-5 w-5 text-[#c5a880] mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Our Services</h2>
              <p className="text-gray-400 max-w-xl">Professional care tailored to your needs. Browse our selection of premium services.</p>
            </div>
            <Link to="/services" className="hidden sm:flex items-center gap-1 text-[#c5a880] text-sm font-medium hover:text-[#d6ba93] transition-colors">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((service) => (
              <Link
                key={service.id}
                to="/book"
                className="group relative p-6 rounded-2xl border border-white/5 bg-[#121620] hover:border-[#c5a880]/30 hover:bg-[#161b28] transition-all"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${service.color || '#c5a880'}20` }}>
                  <Scissors className="h-5 w-5" style={{ color: service.color || '#c5a880' }} />
                </div>
                <h3 className="text-white font-semibold mb-1 group-hover:text-[#c5a880] transition-colors">{service.name}</h3>
                {service.description && <p className="text-gray-400 text-sm mb-4 line-clamp-2">{service.description}</p>}
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">${service.price}</span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Timer className="h-3 w-3" /> {service.duration} min
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {company.services.length > 6 && (
            <div className="mt-8 text-center sm:hidden">
              <Link to="/services" className="inline-flex items-center gap-1 text-[#c5a880] text-sm font-medium">
                View all services <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-[#0f1219]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Why Choose Us</h2>
            <p className="text-gray-400 max-w-xl mx-auto">We're committed to providing the best experience for every client.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Professional Team', desc: 'Experienced and certified professionals dedicated to your satisfaction.' },
              { icon: Timer, title: 'Easy Booking', desc: 'Book online in seconds. No phone calls, no waiting.' },
              { icon: Sparkles, title: 'Premium Quality', desc: 'We use only the best products and techniques for exceptional results.' },
            ].map((item) => (
              <div key={item.title} className="text-center p-8 rounded-2xl border border-white/5 bg-[#121620]/50">
                <div className="w-14 h-14 rounded-xl bg-[#c5a880]/10 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="h-6 w-6 text-[#c5a880]" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      {company.reviews.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">What Our Clients Say</h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <StarRating rating={avgRating} />
                <span className="text-gray-400 text-sm">{avgRating}.0 average from {company.reviews.length} reviews</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {company.reviews.slice(0, 6).map((review) => (
                <div key={review.id} className="p-6 rounded-2xl border border-white/5 bg-[#121620]">
                  <StarRating rating={review.rating} />
                  <p className="text-gray-300 text-sm mt-3 leading-relaxed">
                    &ldquo;{review.comment || 'Great service!'}&rdquo;
                  </p>
                  <p className="text-gray-500 text-xs mt-4">{review.booking.service.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="p-12 rounded-3xl border border-[#c5a880]/10 bg-gradient-to-br from-[#c5a880]/5 to-transparent">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Book?</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">Take the first step toward looking and feeling your best. Book your appointment in just a few clicks.</p>
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#c5a880] text-[#0a0c10] font-semibold hover:bg-[#d6ba93] transition-all"
            >
              <CalendarDays className="h-5 w-5" />
              Book an Appointment
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CustomerHomePage;
