import { X } from 'lucide-react';
import type { WebsiteTheme } from '../../types/website.types';

interface ThemePanelProps {
  theme: WebsiteTheme;
  onUpdate: (data: Partial<WebsiteTheme>) => void;
  onClose: () => void;
}

const COLOR_PRESETS = [
  ['#c5a880', '#0a0c10', '#e8d5b8'],
  ['#3b82f6', '#0a0c10', '#93c5fd'],
  ['#10b981', '#0a0c10', '#6ee7b7'],
  ['#f59e0b', '#0a0c10', '#fcd34d'],
  ['#ef4444', '#0a0c10', '#fca5a5'],
  ['#8b5cf6', '#0a0c10', '#c4b5fd'],
  ['#ec4899', '#0a0c10', '#f9a8d4'],
  ['#06b6d4', '#0a0c10', '#67e8f9'],
];

export function ThemePanel({ theme, onUpdate, onClose }: ThemePanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f1219] border border-white/10 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-white font-semibold">Theme Settings</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-60px)] space-y-6">
          {/* Color Presets */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-3">Color Presets</label>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_PRESETS.map(([primary, bg, accent], i) => (
                <button
                  key={i}
                  onClick={() => onUpdate({ primaryColor: primary, backgroundColor: bg, accentColor: accent })}
                  className="p-2 rounded-xl border border-white/5 hover:border-white/20 transition-colors cursor-pointer"
                >
                  <div className="flex gap-1 mb-1">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: primary }} />
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: bg }} />
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: accent }} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-3">
            <label className="text-xs text-gray-500 uppercase tracking-wider block">Custom Colors</label>
            {[
              { key: 'primaryColor', label: 'Primary' },
              { key: 'accentColor', label: 'Accent' },
              { key: 'backgroundColor', label: 'Background' },
              { key: 'textColor', label: 'Text' },
            ].map((c) => (
              <div key={c.key} className="flex items-center gap-3">
                <label className="text-xs text-gray-400 w-20">{c.label}</label>
                <input
                  type="color"
                  value={(theme as any)[c.key] || '#c5a880'}
                  onChange={(e) => onUpdate({ [c.key]: e.target.value })}
                  className="w-8 h-8 rounded-lg border border-white/5 bg-transparent cursor-pointer"
                />
                <input
                  value={(theme as any)[c.key] || ''}
                  onChange={(e) => onUpdate({ [c.key]: e.target.value })}
                  className="flex-1 rounded-lg border border-white/5 bg-[#0a0c10] px-3 py-1.5 text-xs text-white"
                />
              </div>
            ))}
          </div>

          {/* Font */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2">Font</label>
            <select
              value={theme.fontFamily}
              onChange={(e) => onUpdate({ fontFamily: e.target.value })}
              className="w-full rounded-lg border border-white/5 bg-[#0a0c10] px-3 py-2 text-xs text-white"
            >
              {['Inter', 'System UI', 'Georgia', 'Helvetica', 'Arial', 'Roboto', 'Poppins', 'Playfair Display'].map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Border Radius */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2">Border Radius</label>
            <select
              value={theme.borderRadius}
              onChange={(e) => onUpdate({ borderRadius: e.target.value })}
              className="w-full rounded-lg border border-white/5 bg-[#0a0c10] px-3 py-2 text-xs text-white"
            >
              {['4px', '8px', '12px', '16px', '24px', '999px'].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Button Style */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2">Button Style</label>
            <div className="flex gap-2">
              {['solid', 'outline', 'ghost'].map((s) => (
                <button
                  key={s}
                  onClick={() => onUpdate({ buttonStyle: s })}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer capitalize ${
                    theme.buttonStyle === s ? 'bg-[#c5a880]/20 text-[#c5a880] border border-[#c5a880]/30' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Animation */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2">Animation</label>
            <select
              value={theme.animationStyle}
              onChange={(e) => onUpdate({ animationStyle: e.target.value })}
              className="w-full rounded-lg border border-white/5 bg-[#0a0c10] px-3 py-2 text-xs text-white"
            >
              {['none', 'fade', 'slide', 'scale'].map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
