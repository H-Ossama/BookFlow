import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../../api/client';
import { bookingsApi } from '../../api/bookings.api';
import { useAuthContext } from '../../context/AuthContext';
import type { TimeSlot } from '../../types/booking.types';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronRight, Check, Clock, Scissors, User, Calendar } from 'lucide-react';

interface Service { id: string; name: string; description?: string; duration: number; price: number; color?: string; }
interface Employee { id: string; user: { id: string; firstName: string; lastName: string; }; bio?: string; specialties?: string[]; }

const STEPS = ['Service', 'Employee', 'Date & Time', 'Confirm'];

export function BookingPage() {
  const { slug } = useParams();
  const { user } = useAuthContext();
  const [step, setStep] = useState(0);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState('');
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
    if (slug) {
      apiClient.get(`/company/slug/${slug}`).then((res) => {
        const c = res.data.data.company;
        setCompanyId(c.id);
        setCompanyName(c.name);
        return Promise.all([
          apiClient.get('/service', { params: { companyId: c.id, isActive: true } }),
          apiClient.get('/employee', { params: { companyId: c.id } }),
        ]);
      }).then(([sRes, eRes]) => {
        setServices(sRes.data.data.services);
        setEmployees(eRes.data.data.employees);
      }).catch(() => toast.error('Company not found'));
    }
  }, [slug]);

  useEffect(() => {
    if (selectedEmployee && selectedDate) {
      setLoadingSlots(true);
      bookingsApi.getAvailability(companyId!, selectedEmployee.id, selectedDate)
        .then(setSlots)
        .catch(() => toast.error('Failed to load availability'))
        .finally(() => setLoadingSlots(false));
      setSelectedTime('');
    }
  }, [selectedEmployee, selectedDate]);

  const canNext = () => {
    if (step === 0) return !!selectedService;
    if (step === 1) return !!selectedEmployee;
    if (step === 2) return !!selectedDate && !!selectedTime;
    return true;
  };

  const handleConfirm = async () => {
    if (!user) { toast.error('Please log in to book'); return; }
    setSubmitting(true);
    try {
      await bookingsApi.create({
        companyId: companyId!,
        employeeId: selectedEmployee!.id,
        serviceId: selectedService!.id,
        date: selectedDate,
        startTime: selectedTime,
        notes,
        couponCode: couponCode || undefined,
      });
      toast.success('Booking confirmed!');
      setStep(4); // success step
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

  if (!companyId) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c5a880] border-t-transparent" /></div>;
  }

  if (step === 4) {
    return (
      <div className="max-w-md mx-auto p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"><Check className="h-8 w-8 text-green-500" /></div>
        <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
        <p className="text-gray-400 mb-6">{selectedService?.name} with {selectedEmployee?.user.firstName} on {selectedDate} at {selectedTime}</p>
        <p className="text-sm text-gray-500">Check your email for details.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-1">{companyName}</h1>
      <p className="text-gray-400 mb-8">Book your appointment</p>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= step ? 'bg-[#c5a880] text-[#0a0c10]' : 'bg-white/5 text-gray-500'}`}>{i + 1}</div>
            <span className={`text-sm ${i <= step ? 'text-white' : 'text-gray-600'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="w-8 h-px bg-white/10" />}
          </div>
        ))}
      </div>

      <div className="bg-[#121620] border border-white/5 rounded-2xl p-6">
        {/* Step 0: Select Service */}
        {step === 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white mb-4">Choose a Service</h2>
            {services.map((s) => (
              <button key={s.id} onClick={() => { setSelectedService(s); setSelectedEmployee(null); setSelectedDate(''); setSelectedTime(''); }}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${selectedService?.id === s.id ? 'border-[#c5a880] bg-[#c5a880]/5' : 'border-white/5 hover:border-white/10 bg-[#1a202c]/30'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.color || '#c5a88020' }}>
                      <Scissors className="h-5 w-5" style={{ color: s.color || '#c5a880' }} />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{s.name}</h3>
                      {s.description && <p className="text-sm text-gray-400">{s.description}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">${s.price}</p>
                    <p className="text-xs text-gray-500">{s.duration} min</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 1: Select Employee */}
        {step === 1 && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white mb-4">Choose a Staff Member</h2>
            {employees.filter((e) => e.id).map((emp) => (
              <button key={emp.id} onClick={() => setSelectedEmployee(emp)}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${selectedEmployee?.id === emp.id ? 'border-[#c5a880] bg-[#c5a880]/5' : 'border-white/5 hover:border-white/10 bg-[#1a202c]/30'}`}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#c5a880]/20 flex items-center justify-center text-[#c5a880] text-sm font-medium">
                    {emp.user.firstName[0]}{emp.user.lastName[0]}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{emp.user.firstName} {emp.user.lastName}</h3>
                    {emp.specialties && emp.specialties.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {emp.specialties.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full bg-[#c5a880]/10 text-[#c5a880] text-[10px] font-medium">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Select Date & Time */}
        {step === 2 && (
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Choose Date & Time</h2>
            <input type="date" value={selectedDate} min={today} max={nextWeek} onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-xl border border-white/5 bg-[#1a202c]/50 py-3 px-4 text-white focus:outline-none focus:border-[#c5a880] mb-6" />
            {loadingSlots && <div className="flex justify-center py-8"><div className="h-6 w-6 animate-spin rounded-full border-4 border-[#c5a880] border-t-transparent" /></div>}
            {!loadingSlots && selectedDate && (
              <div>
                <p className="text-sm text-gray-400 mb-3">Available slots for {selectedService?.name}:</p>
                {slots.filter((s) => {
                  const serviceSlots = s.availableServices.filter((as) => as.id === selectedService?.id);
                  return s.available && serviceSlots.length > 0;
                }).length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No available slots for this date</p>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {slots.filter((s) => {
                      const serviceSlots = s.availableServices.filter((as) => as.id === selectedService?.id);
                      return s.available && serviceSlots.length > 0;
                    }).map((slot) => (
                      <button key={slot.time} onClick={() => setSelectedTime(slot.time)}
                        className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${selectedTime === slot.time ? 'bg-[#c5a880] text-[#0a0c10]' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}>
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Confirm Your Booking</h2>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1a202c]/30">
                <Scissors className="h-5 w-5 text-[#c5a880]" />
                <div><p className="text-white text-sm font-medium">{selectedService?.name}</p><p className="text-xs text-gray-400">${selectedService?.price} &middot; {selectedService?.duration} min</p></div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1a202c]/30">
                <User className="h-5 w-5 text-[#c5a880]" />
                <div><p className="text-white text-sm font-medium">{selectedEmployee?.user.firstName} {selectedEmployee?.user.lastName}</p></div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1a202c]/30">
                <Calendar className="h-5 w-5 text-[#c5a880]" />
                <div><p className="text-white text-sm font-medium">{selectedDate}</p></div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1a202c]/30">
                <Clock className="h-5 w-5 text-[#c5a880]" />
                <div><p className="text-white text-sm font-medium">{selectedTime}</p></div>
              </div>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (optional)" rows={2}
                className="w-full rounded-lg border border-white/5 bg-[#1a202c]/50 py-3 px-4 text-sm text-white focus:outline-none focus:border-[#c5a880] resize-none" />
              <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Coupon code (optional)"
                className="w-full rounded-lg border border-white/5 bg-[#1a202c]/50 py-3 px-4 text-sm text-white focus:outline-none focus:border-[#c5a880]" />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {step > 0 ? (
            <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/5 text-gray-300 hover:bg-white/5 transition-colors cursor-pointer">
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
          ) : <div />}
          {step < 3 ? (
            <button onClick={() => setStep(step + 1)} disabled={!canNext()} className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#c5a880] text-[#0a0c10] font-semibold hover:bg-[#d6ba93] transition-all disabled:opacity-50 cursor-pointer">
              Next <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={handleConfirm} disabled={submitting} className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-500 transition-all disabled:opacity-50 cursor-pointer">
              {submitting ? 'Booking...' : 'Confirm Booking'} <Check className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
