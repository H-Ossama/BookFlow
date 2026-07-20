import { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { servicesApi } from '../../api/services.api';
import type { Service } from '../../types/service.types';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

interface ServiceForm {
  name: string;
  description: string;
  duration: number;
  price: number;
  color: string;
}

const emptyForm: ServiceForm = { name: '', description: '', duration: 30, price: 0, color: '#c5a880' };

export function ServicesManagement() {
  const { user } = useAuthContext();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const companyId = user?.companyId;

  const fetchServices = async () => {
    if (!companyId) return;
    try {
      const result = await servicesApi.getAll(companyId, { limit: 100 });
      setServices(result.services);
    } catch {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, [companyId]);

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
      color: service.color || '#c5a880',
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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c5a880] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Services</h1>
          <p className="text-gray-400 mt-1">Manage your service catalog</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-[#c5a880] py-2.5 px-5 text-sm font-semibold text-[#0a0c10] hover:bg-[#d6ba93] transition-all cursor-pointer">
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-16 bg-[#121620] border border-white/5 rounded-xl">
          <p className="text-gray-500">No services yet. Create your first service.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {services.map((service) => (
            <div key={service.id} className="bg-[#121620] border border-white/5 rounded-xl p-5 flex items-center justify-between hover:border-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-1 h-10 rounded-full" style={{ backgroundColor: service.color || '#c5a880' }} />
                <div>
                  <h3 className="text-white font-medium">{service.name}</h3>
                  <p className="text-sm text-gray-400">{service.duration} min · ${service.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleActive(service)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    service.isActive ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
                  }`}
                >
                  {service.isActive ? 'Active' : 'Inactive'}
                </button>
                <button onClick={() => openEdit(service)} className="p-2 text-gray-400 hover:text-[#c5a880] transition-colors cursor-pointer">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(service.id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors cursor-pointer">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-[#121620] border border-white/5 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">{editingId ? 'Edit Service' : 'New Service'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="block w-full rounded-lg border border-white/5 bg-[#1a202c]/50 py-3 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880] transition-colors"
                  placeholder="Haircut"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="block w-full rounded-lg border border-white/5 bg-[#1a202c]/50 py-3 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880] transition-colors resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">Duration (min)</label>
                  <input
                    type="number"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                    min={5}
                    className="block w-full rounded-lg border border-white/5 bg-[#1a202c]/50 py-3 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">Price ($)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    min={0}
                    step={0.01}
                    className="block w-full rounded-lg border border-white/5 bg-[#1a202c]/50 py-3 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">Color</label>
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="h-10 w-full rounded-lg border border-white/5 bg-[#1a202c]/50 cursor-pointer"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 rounded-lg border border-white/5 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name} className="flex-1 rounded-lg bg-[#c5a880] py-2.5 text-sm font-semibold text-[#0a0c10] hover:bg-[#d6ba93] transition-all disabled:opacity-50 cursor-pointer">
                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServicesManagement;
