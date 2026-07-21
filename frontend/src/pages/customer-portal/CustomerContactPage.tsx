import { useState } from 'react';
import { useCustomerPortal } from '../../context/CustomerPortalContext';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export function CustomerContactPage() {
  const { company } = useCustomerPortal();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) { toast.error('Please fill in all fields'); return; }
    setSending(true);
    // Simulate sending - in production this would call the backend
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Message sent! We will get back to you soon.');
    setName('');
    setEmail('');
    setMessage('');
    setSending(false);
  };

  if (!company) return null;

  const workingHours = company.employees[0]?.workingHours || [];

  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <section className="py-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-lg text-gray-400">Have a question or want to get in touch? We'd love to hear from you.</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <div className="space-y-6">
                {company.address && (
                  <div className="flex items-start gap-4 p-5 rounded-2xl border border-white/5 bg-[#121620]">
                    <div className="w-12 h-12 rounded-xl bg-[#c5a880]/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-[#c5a880]" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Address</h3>
                      <p className="text-gray-400 text-sm">{company.address}</p>
                    </div>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-start gap-4 p-5 rounded-2xl border border-white/5 bg-[#121620]">
                    <div className="w-12 h-12 rounded-xl bg-[#c5a880]/10 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-[#c5a880]" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Phone</h3>
                      <a href={`tel:${company.phone}`} className="text-gray-400 text-sm hover:text-[#c5a880] transition-colors">{company.phone}</a>
                    </div>
                  </div>
                )}
                {company.email && (
                  <div className="flex items-start gap-4 p-5 rounded-2xl border border-white/5 bg-[#121620]">
                    <div className="w-12 h-12 rounded-xl bg-[#c5a880]/10 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-[#c5a880]" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Email</h3>
                      <a href={`mailto:${company.email}`} className="text-gray-400 text-sm hover:text-[#c5a880] transition-colors">{company.email}</a>
                    </div>
                  </div>
                )}
                {workingHours.length > 0 && (
                  <div className="flex items-start gap-4 p-5 rounded-2xl border border-white/5 bg-[#121620]">
                    <div className="w-12 h-12 rounded-xl bg-[#c5a880]/10 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-[#c5a880]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-2">Working Hours</h3>
                      <div className="space-y-1">
                        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, idx) => {
                          const hours = workingHours.find((wh) => wh.dayOfWeek === idx);
                          return (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-400">{day}</span>
                              <span className={hours ? 'text-gray-300' : 'text-gray-600'}>
                                {hours ? `${hours.startTime} - ${hours.endTime}` : 'Closed'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="p-8 rounded-2xl border border-white/5 bg-[#121620]">
                <h2 className="text-xl text-white font-bold mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Your Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-white/5 bg-[#1a202c]/50 py-3 px-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c5a880] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Your Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full rounded-xl border border-white/5 bg-[#1a202c]/50 py-3 px-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c5a880] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you?"
                      rows={5}
                      className="w-full rounded-xl border border-white/5 bg-[#1a202c]/50 py-3 px-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c5a880] resize-none transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#c5a880] text-[#0a0c10] font-semibold hover:bg-[#d6ba93] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {sending ? 'Sending...' : <><Send className="h-4 w-4" /> Send Message</>}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CustomerContactPage;
