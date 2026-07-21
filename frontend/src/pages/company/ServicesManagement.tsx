import { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { servicesApi } from '../../api/services.api';
import type { Service } from '../../types/service.types';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Search, Clock, DollarSign, Circle, CheckCircle2, XCircle, Scissors } from 'lucide-react';

interface ServiceForm {
  name: string;
  description: string;
  duration: number;
  price: number;
  color: string;
}

const emptyForm: ServiceForm = { name: '', description: '', duration: 30, price: 0, color: '#86d6c8' };

export function ServicesManagement() {
  const { user } = useAuthContext();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const companyId = user?.companyId;

  const fetchServices = async () => {
    if (!companyId) return;
    try {
      const result = await servicesApi.getAll(companyId, { limit: 100 });
      setServices(Array.isArray(result) ? result : result.services || []);
    } catch {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, [companyId]);

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.description || '').toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = services.filter((s) => s.isActive).length;
  const avgPrice = services.length > 0 ? services.reduce((a, s) => a + s.price, 0) / services.length : 0;

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (service: Service) => {
    setEditingId(service.id);
    setForm({
      name: service.name,
      description: service.description || '',
      duration: service.duration,
      price: service.price,
      color: service.color || '#86d6c8',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!companyId) return;
    setSaving(true);
    try {
      if (editingId) {
        const updated = await servicesApi.update(editingId, { ...form, companyId });
        setServices((prev) => prev.map((s) => (s.id === editingId ? updated : s)));
        toast.success('Service updated');
      } else {
        const created = await servicesApi.create({ ...form, companyId });
        setServices((prev) => [...prev, created]);
        toast.success('Service created');
      }
      setShowModal(false);
    } catch {
      toast.error('Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!companyId) return;
    if (!confirm('Delete this service?')) return;
    try {
      await servicesApi.delete(id, companyId);
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast.success('Service deleted');
    } catch {
      toast.error('Failed to delete service');
    }
  };

  const toggleActive = async (service: Service) => {
    try {
      const updated = await servicesApi.update(service.id, { isActive: !service.isActive, companyId: companyId! });
      setServices((prev) => prev.map((s) => (s.id === service.id ? updated : s)));
    } catch {
      toast.error('Failed to update service');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#86d6c8] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-serif tracking-tight">Services</h1>
          <p className="text-[#aaa9a5] mt-1 text-sm">Manage your service catalog</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-[#86d6c8] py-2.5 px-5 text-sm font-semibold text-[#050505] hover:bg-[#9ee0d4] transition-all cursor-pointer">
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="glass-card rounded-xl p-4">
          <p className="text-2xl font-bold text-white">{services.length}</p>
          <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mt-1">Total Services</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-2xl font-bold text-white">{activeCount}</p>
          <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mt-1">Active</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-2xl font-bold text-white">{services.length - activeCount}</p>
          <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5] mt-1">Inactive</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-2xl font-bold text-white">${avgPrice.toFixed(0)}</p>
          <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#efc493] mt-1">Avg Price</p>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-2.5 glass-card rounded-lg">
        <Search className="h-4 w-4 text-[#aaa9a5]" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services by name or description..."
          className="flex-1 bg-transparent border-0 outline-0 text-white text-sm placeholder-[#aaa9a5]" />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center glass-card rounded-xl">
          <Scissors className="h-10 w-10 text-[#aaa9a5] mb-4" />
          <p className="text-white text-sm font-medium">{search ? 'No services match your search' : 'No services yet'}</p>
          <p className="text-[#aaa9a5] text-xs mt-1">{search ? 'Try a different search term' : 'Create your first service to get started'}</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((service) => (
            <div key={service.id} className="glass-card rounded-xl p-5 hover:border-white/[.14] transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${service.color || '#86d6c8'}18` }}>
                    <Scissors className="h-5 w-5" style={{ color: service.color || '#86d6c8' }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-white font-medium text-sm">{service.name}</h3>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[.08em] px-2 py-0.5 rounded-full ${
                        service.isActive ? 'text-[#86d6c8] bg-[#86d6c8]/10' : 'text-[#aaa9a5] bg-white/[.06]'
                      }`}>
                        {service.isActive ? <CheckCircle2 className="h-2.5 w-2.5" /> : <XCircle className="h-2.5 w-2.5" />}
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#aaa9a5] mt-1">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {service.duration} min</span>
                      <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> ${service.price.toFixed(2)}</span>
                      {service.description && <span className="text-[#aaa9a5]/60 truncate max-w-[300px]">· {service.description}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleActive(service)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold font-mono uppercase tracking-[.08em] transition-all cursor-pointer ${
                      service.isActive ? 'text-[#86d6c8] bg-[#86d6c8]/10 hover:bg-[#86d6c8]/20' : 'text-[#aaa9a5] bg-white/[.06] hover:bg-white/[.1]'
                    }`}>
                    {service.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => openEdit(service)} className="p-2 rounded-lg text-[#aaa9a5] hover:text-white hover:bg-white/[.06] transition-all cursor-pointer">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(service.id)} className="p-2 rounded-lg text-[#aaa9a5] hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md glass-card rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white font-serif tracking-tight">{editingId ? 'Edit Service' : 'New Service'}</h2>
              <button onClick={() => setShowModal(false)} className="text-[#aaa9a5] hover:text-white transition-colors cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1.5">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="block w-full rounded-lg border border-white/[.08] bg-white/[.06] py-2.5 px-3.5 text-sm text-white placeholder-[#aaa9a5] focus:outline-none focus:border-[#86d6c8] transition-colors"
                  placeholder="e.g. Haircut, Massage, Consultation" />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="block w-full rounded-lg border border-white/[.08] bg-white/[.06] py-2.5 px-3.5 text-sm text-white placeholder-[#aaa9a5] focus:outline-none focus:border-[#86d6c8] transition-colors resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1.5">Duration (min)</label>
                  <input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} min={5}
                    className="block w-full rounded-lg border border-white/[.08] bg-white/[.06] py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#86d6c8] transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1.5">Price ($)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} min={0} step={0.01}
                    className="block w-full rounded-lg border border-white/[.08] bg-white/[.06] py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#86d6c8] transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1.5">Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="h-9 w-9 rounded-lg border border-white/[.08] bg-transparent cursor-pointer" />
                  <span className="text-xs text-[#aaa9a5]">Used to identify this service in the calendar</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 rounded-lg border border-white/[.08] py-2.5 text-sm text-[#aaa9a5] hover:bg-white/[.06] transition-all cursor-pointer">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name}
                className="flex-1 rounded-lg bg-[#86d6c8] py-2.5 text-sm font-semibold text-[#050505] hover:bg-[#9ee0d4] transition-all disabled:opacity-50 cursor-pointer">
                {saving ? 'Saving...' : editingId ? 'Update Service' : 'Create Service'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServicesManagement;
