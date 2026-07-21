import { Link } from 'react-router-dom';
import { useCustomerPortal } from '../../context/CustomerPortalContext';
import { Scissors, Timer, CalendarDays, ArrowRight } from 'lucide-react';

export function CustomerServicesPage() {
  const { company } = useCustomerPortal();
  if (!company) return null;

  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <section className="py-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Our Services</h1>
            <p className="text-lg text-gray-400">Explore everything we offer. Every service is delivered with professional care and attention to detail.</p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {company.services.length === 0 ? (
            <div className="text-center py-20">
              <Scissors className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl text-gray-300 font-medium">No services available yet</h3>
              <p className="text-gray-500 mt-2">Check back soon for our full list of services.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {company.services.map((service) => (
                <div
                  key={service.id}
                  className="group p-6 rounded-2xl border border-white/5 bg-[#121620] hover:border-[#c5a880]/30 hover:bg-[#161b28] transition-all"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: `${service.color || '#c5a880'}20` }}>
                    <Scissors className="h-6 w-6" style={{ color: service.color || '#c5a880' }} />
                  </div>
                  <h3 className="text-xl text-white font-semibold mb-2 group-hover:text-[#c5a880] transition-colors">{service.name}</h3>
                  {service.description && <p className="text-gray-400 text-sm mb-5 leading-relaxed">{service.description}</p>}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl text-white font-bold">${service.price}</span>
                    <span className="flex items-center gap-1.5 text-sm text-gray-400">
                      <Timer className="h-4 w-4" /> {service.duration} min
                    </span>
                  </div>
                  <Link
                    to="/book"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/10 text-gray-300 text-sm font-medium hover:bg-[#c5a880] hover:text-[#0a0c10] hover:border-[#c5a880] transition-all"
                  >
                    <CalendarDays className="h-4 w-4" />
                    Book Now
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default CustomerServicesPage;
