import { useState, useEffect } from 'react';
import { useCustomerPortal } from '../../context/CustomerPortalContext';
import { apiClient } from '../../api/client';
import { bookingsApi } from '../../api/bookings.api';
import { useAuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import type { TimeSlot } from '../../types/booking.types';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronRight, Check, Clock, Scissors, User, Calendar, Sparkles, ArrowRight } from 'lucide-react';

interface Service { id: string; name: string; description?: string; duration: number; price: number; color?: string; }
interface Employee { id: string; user: { id: string; firstName: string; lastName: string; }; bio?: string; specialties?: string[]; }

const STEPS = ['Service', 'Staff', 'Date & Time', 'Review'];

export function CustomerBookingPage() {
  const { company } = useCustomerPortal();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [notes, setNotes] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (company) {
      setServices(company.services.map((s) => ({ ...s, description: s.description || undefined })));
      setEmployees(company.employees.map((e) => ({ ...e, bio: e.bio || undefined, specialties: e.specialties || undefined })));
    }
  }, [company]);

  useEffect(() => {
    if (selectedEmployee && selectedDate && company) {
      setLoadingSlots(true);
      bookingsApi.getAvailability(company.id, selectedEmployee.id, selectedDate)
        .then(setSlots)
        .catch(() => toast.error('Failed to load availability'))
        .finally(() => setLoadingSlots(false));
      setSelectedTime('');
    }
  }, [selectedEmployee, selectedDate, company]);

  const canNext = () => {
    if (step === 0) return !!selectedService;
    if (step === 1) return !!selectedEmployee;
    if (step === 2) return !!selectedDate && !!selectedTime;
    return true;
  };

  const handleConfirm = async () => {
    if (!user) { toast.error('Please sign in to book'); return; }
    if (!company) return;
    setSubmitting(true);
    try {
      await bookingsApi.create({
        companyId: company.id,
        employeeId: selectedEmployee!.id,
        serviceId: selectedService!.id,
        date: selectedDate,
        startTime: selectedTime,
        notes,
        couponCode: couponCode || undefined,
      });
      toast.success('Booking confirmed!');
      setStep(4);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

  if (!company) return null;

  if (step === 4) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Booking Confirmed!</h2>
          <p className="text-gray-400 mb-2">{selectedService?.name} with {selectedEmployee?.user.firstName}</p>
          <p className="text-gray-500 mb-8">{selectedDate} at {selectedTime}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#c5a880] text-[#0a0c10] font-semibold hover:bg-[#d6ba93] transition-all">
              Back to Home <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Book an Appointment</h1>
          <p className="text-gray-400">Choose your service, pick a time, and we'll take care of the rest.</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i <= step ? 'bg-[#c5a880] text-[#0a0c10]' : 'bg-white/5 text-gray-500'
                }`}>
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className={`text-sm hidden sm:inline ${i <= step ? 'text-white' : 'text-gray-600'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 sm:w-12 h-px ${i < step ? 'bg-[#c5a880]/50' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-[#121620] border border-white/5 rounded-2xl p-6 sm:p-8">
          {/* Step 0: Service */}
          {step === 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Choose a Service</h2>
              <div className="space-y-3">
                {services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedService(s); setSelectedEmployee(null); setSelectedDate(''); setSelectedTime(''); }}
                    className={`w-full text-left p-4 sm:p-5 rounded-xl border transition-all cursor-pointer ${
                      selectedService?.id === s.id
                        ? 'border-[#c5a880] bg-[#c5a880]/5'
                        : 'border-white/5 hover:border-white/10 bg-[#1a202c]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${s.color || '#c5a880'}20` }}>
                          <Scissors className="h-5 w-5" style={{ color: s.color || '#c5a880' }} />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{s.name}</h3>
                          {s.description && <p className="text-sm text-gray-400 mt-0.5">{s.description}</p>}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-white font-semibold">${s.price}</p>
                        <p className="text-xs text-gray-500">{s.duration} min</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Staff */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Choose a Staff Member</h2>
              <div className="space-y-3">
                {employees.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No staff members available</p>
                ) : (
                  employees.filter((e) => e.id).map((emp) => (
                    <button
                      key={emp.id}
                      onClick={() => setSelectedEmployee(emp)}
                      className={`w-full text-left p-4 sm:p-5 rounded-xl border transition-all cursor-pointer ${
                        selectedEmployee?.id === emp.id
                          ? 'border-[#c5a880] bg-[#c5a880]/5'
                          : 'border-white/5 hover:border-white/10 bg-[#1a202c]/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#c5a880]/20 flex items-center justify-center text-[#c5a880] text-sm font-medium shrink-0">
                          {emp.user.firstName[0]}{emp.user.lastName[0]}
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{emp.user.firstName} {emp.user.lastName}</h3>
                          {emp.specialties && emp.specialties.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {emp.specialties.map((s, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-full bg-[#c5a880]/10 text-[#c5a880] text-[10px] font-medium">{s}</span>
                              ))}
                            </div>
                          )}
                          {emp.bio && <p className="text-gray-500 text-xs mt-1">{emp.bio}</p>}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Choose Date & Time</h2>
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  min={today}
                  max={nextWeek}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-xl border border-white/5 bg-[#1a202c]/50 py-3 px-4 text-white focus:outline-none focus:border-[#c5a880] transition-colors"
                />
              </div>
              {loadingSlots && (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c5a880] border-t-transparent" />
                </div>
              )}
              {!loadingSlots && selectedDate && (
                <div>
                  <p className="text-sm text-gray-400 mb-3">
                    Available times {selectedService ? `for ${selectedService.name}` : ''}:
                  </p>
                  {slots.filter((s) => {
                    const serviceSlots = s.availableServices?.filter((as) => as.id === selectedService?.id) || [];
                    return s.available && serviceSlots.length > 0;
                  }).length === 0 ? (
                    <div className="text-center py-12 bg-[#1a202c]/20 rounded-xl">
                      <Calendar className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-500">No available slots for this date</p>
                      <p className="text-gray-600 text-xs mt-1">Try another date or staff member</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {slots.filter((s) => {
                        const serviceSlots = s.availableServices?.filter((as) => as.id === selectedService?.id) || [];
                        return s.available && serviceSlots.length > 0;
                      }).map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`py-3 px-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                            selectedTime === slot.time
                              ? 'bg-[#c5a880] text-[#0a0c10]'
                              : 'bg-white/5 text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {!selectedDate && (
                <div className="text-center py-12 bg-[#1a202c]/20 rounded-xl">
                  <Calendar className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500">Pick a date to see available times</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Review Your Booking</h2>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#1a202c]/30">
                  <Scissors className="h-5 w-5 text-[#c5a880]" />
                  <div>
                    <p className="text-white text-sm font-medium">{selectedService?.name}</p>
                    <p className="text-xs text-gray-400">${selectedService?.price} &middot; {selectedService?.duration} min</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#1a202c]/30">
                  <User className="h-5 w-5 text-[#c5a880]" />
                  <div>
                    <p className="text-white text-sm font-medium">{selectedEmployee?.user.firstName} {selectedEmployee?.user.lastName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#1a202c]/30">
                  <Calendar className="h-5 w-5 text-[#c5a880]" />
                  <div>
                    <p className="text-white text-sm font-medium">{selectedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#1a202c]/30">
                  <Clock className="h-5 w-5 text-[#c5a880]" />
                  <div>
                    <p className="text-white text-sm font-medium">{selectedTime}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requests or information..."
                    rows={2}
                    className="w-full rounded-xl border border-white/5 bg-[#1a202c]/50 py-3 px-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c5a880] resize-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Coupon Code (optional)</label>
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="w-full rounded-xl border border-white/5 bg-[#1a202c]/50 py-3 px-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c5a880] transition-colors"
                  />
                </div>

                {!user && (
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                    <p className="text-amber-400 text-sm font-medium">You need to sign in to book</p>
                    <Link to="/login" className="text-amber-300 text-xs underline mt-1 inline-block">Sign in or create an account</Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-white/5">
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/5 text-gray-300 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
            ) : (
              <div />
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canNext()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#c5a880] text-[#0a0c10] font-semibold hover:bg-[#d6ba93] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleConfirm}
                disabled={submitting || !user}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? (
                  <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Booking...</>
                ) : (
                  <><Check className="h-4 w-4" /> Confirm Booking</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerBookingPage;
