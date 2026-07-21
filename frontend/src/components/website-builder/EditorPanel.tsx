import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { WebsiteSection } from '../../types/website.types';

interface EditorPanelProps {
  section: WebsiteSection;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<WebsiteSection>) => void;
}

type Tab = 'content' | 'style';

export function EditorPanel({ section, onClose, onUpdate }: EditorPanelProps) {
  const [tab, setTab] = useState<Tab>('content');
  const [content, setContent] = useState<Record<string, any>>(section.content);

  useEffect(() => {
    setContent(section.content);
  }, [section.id, section.content]);

  const update = (key: string, value: any) => {
    const next = { ...content, [key]: value };
    setContent(next);
    onUpdate(section.id, { content: next });
  };

  const setNested = (parent: string, key: string, value: any) => {
    const arr = [...(content[parent] || [])];
    arr[key] = { ...arr[key], [value.target || 'value']: value.value };
    update(parent, arr);
  };

  const addArrayItem = (key: string) => {
    const arr = [...(content[key] || [])];
    if (key === 'links') arr.push({ label: 'New Link', href: '/' });
    else if (key === 'services') arr.push({ name: 'New Service', description: '', price: 0, duration: 30 });
    else if (key === 'testimonials') arr.push({ text: 'New testimonial', author: 'Client', rating: 5 });
    else if (key === 'images') arr.push({ url: '', alt: 'Image' });
    else if (key === 'plans') arr.push({ name: 'Plan', price: 0, features: [], highlighted: false });
    else if (key === 'members') arr.push({ name: 'New Member', role: 'Role' });
    else if (key === 'items') arr.push({ question: 'New Question?', answer: 'Answer here.' });
    else arr.push({});
    update(key, arr);
  };

  const removeArrayItem = (key: string, idx: number) => {
    const arr = [...(content[key] || [])];
    arr.splice(idx, 1);
    update(key, arr);
  };

  const renderArrayEditor = (key: string, fields: { key: string; label: string; type?: string }[]) => {
    const items = content[key] || [];
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 uppercase tracking-wider">{key}</span>
          <button onClick={() => addArrayItem(key)} className="text-xs px-2 py-0.5 rounded bg-[#c5a880]/20 text-[#c5a880] hover:bg-[#c5a880]/30 transition-colors">+ Add</button>
        </div>
        {items.map((item: any, i: number) => (
          <div key={i} className="p-2 rounded-lg bg-white/5 border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500">#{i + 1}</span>
              <button onClick={() => removeArrayItem(key, i)} className="text-[10px] text-red-400 hover:text-red-300">Remove</button>
            </div>
            {fields.map((f) => (
              <div key={f.key}>
                <label className="text-[10px] text-gray-500 block mb-0.5">{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea value={item[f.key] || ''} onChange={(e) => { const arr = [...items]; arr[i] = { ...arr[i], [f.key]: e.target.value }; update(key, arr); }} className="w-full rounded border border-white/5 bg-[#0a0c10] px-2 py-1 text-xs text-white resize-none" rows={2} />
                ) : f.type === 'number' ? (
                  <input type="number" value={item[f.key] ?? ''} onChange={(e) => { const arr = [...items]; arr[i] = { ...arr[i], [f.key]: parseFloat(e.target.value) || 0 }; update(key, arr); }} className="w-full rounded border border-white/5 bg-[#0a0c10] px-2 py-1 text-xs text-white" />
                ) : (
                  <input value={item[f.key] || ''} onChange={(e) => { const arr = [...items]; arr[i] = { ...arr[i], [f.key]: e.target.value }; update(key, arr); }} className="w-full rounded border border-white/5 bg-[#0a0c10] px-2 py-1 text-xs text-white" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const textFields: Record<string, { key: string; label: string; type?: string }[]> = {
    hero: [
      { key: 'title', label: 'Title' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'buttonText', label: 'Button Text' },
      { key: 'buttonLink', label: 'Button Link' },
    ],
    services: [
      { key: 'title', label: 'Title' },
      { key: 'subtitle', label: 'Subtitle' },
    ],
    booking: [
      { key: 'title', label: 'Title' },
      { key: 'subtitle', label: 'Subtitle' },
      { key: 'buttonText', label: 'Button Text' },
    ],
    gallery: [
      { key: 'title', label: 'Title' },
      { key: 'subtitle', label: 'Subtitle' },
    ],
    testimonials: [
      { key: 'title', label: 'Title' },
      { key: 'subtitle', label: 'Subtitle' },
    ],
    contact: [
      { key: 'title', label: 'Title' },
      { key: 'subtitle', label: 'Subtitle' },
      { key: 'address', label: 'Address' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
    ],
    footer: [
      { key: 'description', label: 'Description' },
      { key: 'copyright', label: 'Copyright Text' },
    ],
    cta: [
      { key: 'title', label: 'Title' },
      { key: 'subtitle', label: 'Subtitle' },
      { key: 'buttonText', label: 'Button Text' },
      { key: 'buttonLink', label: 'Button Link' },
    ],
    pricing: [
      { key: 'title', label: 'Title' },
      { key: 'subtitle', label: 'Subtitle' },
    ],
    faq: [
      { key: 'title', label: 'Title' },
      { key: 'subtitle', label: 'Subtitle' },
    ],
    team: [
      { key: 'title', label: 'Title' },
      { key: 'subtitle', label: 'Subtitle' },
    ],
    navbar: [
      { key: 'logo', label: 'Business Name' },
      { key: 'logoImage', label: 'Logo Image URL' },
    ],
  };

  const arrayEditors: Record<string, { key: string; fields: { key: string; label: string; type?: string }[] }[]> = {
    navbar: [
      { key: 'links', fields: [{ key: 'label', label: 'Label' }, { key: 'href', label: 'Link' }] },
    ],
    services: [
      { key: 'services', fields: [{ key: 'name', label: 'Name' }, { key: 'description', label: 'Description' }, { key: 'price', label: 'Price', type: 'number' }, { key: 'duration', label: 'Duration (min)', type: 'number' }] },
    ],
    testimonials: [
      { key: 'testimonials', fields: [{ key: 'text', label: 'Text', type: 'textarea' }, { key: 'author', label: 'Author' }, { key: 'rating', label: 'Rating', type: 'number' }] },
    ],
    gallery: [
      { key: 'images', fields: [{ key: 'url', label: 'Image URL' }, { key: 'alt', label: 'Alt Text' }] },
    ],
    pricing: [
      { key: 'plans', fields: [{ key: 'name', label: 'Plan Name' }, { key: 'price', label: 'Price', type: 'number' }] },
    ],
    team: [
      { key: 'members', fields: [{ key: 'name', label: 'Name' }, { key: 'role', label: 'Role' }] },
    ],
    faq: [
      { key: 'items', fields: [{ key: 'question', label: 'Question' }, { key: 'answer', label: 'Answer', type: 'textarea' }] },
    ],
  };

  return (
    <div className="w-80 bg-[#0f1219] border-l border-white/5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <span className="text-sm text-white font-medium capitalize">{section.sectionType}</span>
        <button onClick={onClose} className="p-1 rounded-md hover:bg-white/5 text-gray-400 hover:text-white transition-colors"><X className="h-4 w-4" /></button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5">
        {(['content', 'style'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2.5 text-xs font-medium transition-colors cursor-pointer capitalize ${tab === t ? 'text-[#c5a880] border-b-2 border-[#c5a880]' : 'text-gray-500 hover:text-gray-300'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Content Tab */}
      {tab === 'content' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Text fields */}
          {(textFields[section.sectionType] || []).map((f) => (
            <div key={f.key}>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea value={content[f.key] || ''} onChange={(e) => update(f.key, e.target.value)} className="w-full rounded-lg border border-white/5 bg-[#0a0c10] px-3 py-2 text-xs text-white resize-none" rows={3} />
              ) : (
                <input value={content[f.key] || ''} onChange={(e) => update(f.key, e.target.value)} className="w-full rounded-lg border border-white/5 bg-[#0a0c10] px-3 py-2 text-xs text-white" />
              )}
            </div>
          ))}

          {/* Array editors */}
          {(arrayEditors[section.sectionType] || []).map((ae) => renderArrayEditor(ae.key, ae.fields))}

          {/* Image URL fields */}
          {['hero', 'gallery', 'navbar'].includes(section.sectionType) && (
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Background Image URL</label>
              <input value={content.backgroundImage || ''} onChange={(e) => update('backgroundImage', e.target.value)} placeholder="https://..." className="w-full rounded-lg border border-white/5 bg-[#0a0c10] px-3 py-2 text-xs text-white" />
            </div>
          )}

          {/* Toggle form field */}
          {section.sectionType === 'contact' && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Show Contact Form</span>
              <button onClick={() => update('showForm', !content.showForm)} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${content.showForm !== false ? 'bg-[#c5a880]/20 text-[#c5a880]' : 'bg-white/5 text-gray-500'}`}>
                {content.showForm !== false ? 'On' : 'Off'}
              </button>
            </div>
          )}

          {section.sectionType === 'footer' && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Show "Powered by"</span>
              <button onClick={() => update('showPoweredBy', !content.showPoweredBy)} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${content.showPoweredBy !== false ? 'bg-[#c5a880]/20 text-[#c5a880]' : 'bg-white/5 text-gray-500'}`}>
                {content.showPoweredBy !== false ? 'On' : 'Off'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Style Tab */}
      {tab === 'style' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <p className="text-xs text-gray-500 text-center py-8">Per-section style settings coming soon. Use the <strong>Theme</strong> panel for global styles.</p>
        </div>
      )}
    </div>
  );
}
