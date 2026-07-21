import { useCustomerPortal } from '../../context/CustomerPortalContext';
import { MapPin, Phone, Mail, Quote, Star } from 'lucide-react';

export function CustomerAboutPage() {
  const { company } = useCustomerPortal();
  if (!company) return null;

  const avgRating = company.reviews.length
    ? Math.round(company.reviews.reduce((a, r) => a + r.rating, 0) / company.reviews.length)
    : 0;

  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <section className="py-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">About Us</h1>
            <p className="text-lg text-gray-400">Learn more about {company.name} and our team.</p>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="flex items-center gap-4 mb-6">
                {company.logo ? (
                  <img src={company.logo} alt={company.name} className="h-16 w-16 rounded-2xl object-cover" />
                ) : (
                  <div className="h-16 w-16 rounded-2xl bg-[#c5a880] flex items-center justify-center text-[#0a0c10] text-2xl font-bold">
                    {company.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl text-white font-bold">{company.name}</h2>
                  {avgRating > 0 && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm text-gray-400">{avgRating}.0 ({company.reviews.length} reviews)</span>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed mb-8">
                {company.description || `Welcome to ${company.name}. We are dedicated to providing exceptional service to all our clients.`}
              </p>

              <div className="space-y-4">
                {company.address && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#c5a880]/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-[#c5a880]" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Address</p>
                      <p className="text-gray-400 text-sm">{company.address}</p>
                    </div>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#c5a880]/10 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-[#c5a880]" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Phone</p>
                      <a href={`tel:${company.phone}`} className="text-gray-400 text-sm hover:text-[#c5a880] transition-colors">{company.phone}</a>
                    </div>
                  </div>
                )}
                {company.email && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#c5a880]/10 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-[#c5a880]" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Email</p>
                      <a href={`mailto:${company.email}`} className="text-gray-400 text-sm hover:text-[#c5a880] transition-colors">{company.email}</a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Team */}
            <div>
              <h2 className="text-2xl text-white font-bold mb-6">Our Team</h2>
              {company.employees.length === 0 ? (
                <div className="text-center py-12 bg-[#121620] rounded-2xl border border-white/5">
                  <p className="text-gray-500">Team information coming soon.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {company.employees.map((emp) => (
                    <div key={emp.id} className="p-5 rounded-2xl border border-white/5 bg-[#121620]">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 rounded-full bg-[#c5a880]/20 flex items-center justify-center text-[#c5a880] font-semibold text-sm shrink-0">
                          {emp.user.firstName[0]}{emp.user.lastName[0]}
                        </div>
                        <div>
                          <h4 className="text-white font-medium text-sm">{emp.user.firstName} {emp.user.lastName}</h4>
                          {emp.specialties && emp.specialties.length > 0 && (
                            <p className="text-gray-500 text-xs">{emp.specialties.slice(0, 2).join(', ')}</p>
                          )}
                        </div>
                      </div>
                      {emp.bio && <p className="text-gray-400 text-xs leading-relaxed">{emp.bio}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      {company.reviews.length > 0 && (
        <section className="py-16 bg-[#0f1219]/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl text-white font-bold mb-8 text-center">What Our Clients Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {company.reviews.slice(0, 6).map((review) => (
                <div key={review.id} className="p-6 rounded-2xl border border-white/5 bg-[#121620]">
                  <Quote className="h-6 w-6 text-[#c5a880]/30 mb-3" />
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">&ldquo;{review.comment || 'Amazing service!'}&rdquo;</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
                      ))}
                    </div>
                    <span className="text-gray-500 text-xs">{review.booking.service.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default CustomerAboutPage;
