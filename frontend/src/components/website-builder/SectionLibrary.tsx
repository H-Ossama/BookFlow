import { X, Layout, ArrowRight } from 'lucide-react';
import { SECTION_LABELS, SECTION_VARIANTS, type SectionType } from '../../types/website.types';

interface SectionLibraryProps {
  onSelect: (type: SectionType, variant: string) => void;
  onClose: () => void;
}

const CATEGORIES: { label: string; types: SectionType[] }[] = [
  { label: 'Essentials', types: ['navbar', 'hero', 'services', 'booking'] },
  { label: 'Content', types: ['gallery', 'testimonials', 'faq', 'team'] },
  { label: 'Conversion', types: ['cta', 'pricing', 'contact'] },
  { label: 'Footer', types: ['footer'] },
];

export function SectionLibrary({ onSelect, onClose }: SectionLibraryProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f1219] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-white font-semibold">Add Section</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-60px)]">
          {CATEGORIES.map((cat) => (
            <div key={cat.label} className="mb-8 last:mb-0">
              <h3 className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-4">{cat.label}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {cat.types.map((type) => {
                  const variants = SECTION_VARIANTS[type] || ['default'];
                  return (
                    <div key={type} className="p-3 rounded-xl border border-white/5 bg-[#121620]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-sm font-medium">{SECTION_LABELS[type] || type}</span>
                        <Layout className="h-3.5 w-3.5 text-gray-500" />
                      </div>
                      <div className="space-y-1">
                        {variants.map((v) => (
                          <button
                            key={v}
                            onClick={() => onSelect(type, v)}
                            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            {v === 'default' ? 'Default' : v.charAt(0).toUpperCase() + v.slice(1)}
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
