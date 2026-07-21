import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { websiteApi } from '../../api/website.api';
import type { WebsiteSection, WebsiteTheme, SectionType } from '../../types/website.types';
import { SECTION_VARIANTS } from '../../types/website.types';
import { BuilderCanvas } from '../../components/website-builder/BuilderCanvas';
import { EditorPanel } from '../../components/website-builder/EditorPanel';
import { SectionLibrary } from '../../components/website-builder/SectionLibrary';
import { ThemePanel } from '../../components/website-builder/ThemePanel';
import { Layout, Palette, Eye, Smartphone, Tablet, Monitor, Undo2, Redo2, Sparkles } from 'lucide-react';
import { PreviewFrame } from '../../components/website-builder/PreviewFrame';
import toast from 'react-hot-toast';

export function WebsiteBuilder() {
  const { user, company } = useAuthContext();
  const companyId = user?.companyId || company?.id || '';

  const [sections, setSections] = useState<WebsiteSection[]>([]);
  const [theme, setTheme] = useState<WebsiteTheme>({} as WebsiteTheme);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingSection, setEditingSection] = useState<WebsiteSection | null>(null);
  const [layoutPickerFor, setLayoutPickerFor] = useState<string | null>(null);
  const [addAtIndex, setAddAtIndex] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const selectedSection = sections.find((s) => s.id === selectedId) || null;

  const load = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const [s, t] = await Promise.all([
        websiteApi.getSections(companyId),
        websiteApi.getTheme(companyId),
      ]);
      setSections(s);
      setTheme(t);
    } catch (err) {
      toast.error('Failed to load website');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => { load(); }, [load]);

  const updateSection = useCallback(async (id: string, data: Partial<WebsiteSection>) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
    try {
      await websiteApi.updateSection(id, data);
    } catch { toast.error('Failed to update section'); }
  }, []);

  const updateTheme = useCallback(async (data: Partial<WebsiteTheme>) => {
    setTheme((prev) => ({ ...prev, ...data }));
    try {
      await websiteApi.updateTheme(data);
    } catch { toast.error('Failed to update theme'); }
  }, []);

  const handleDuplicate = useCallback(async (section: WebsiteSection) => {
    try {
      const created = await websiteApi.createSection(companyId, {
        sectionType: section.sectionType,
        layoutVariant: section.layoutVariant,
        content: section.content,
      });
      const idx = sections.findIndex((s) => s.id === section.id);
      setSections((prev) => {
        const next = [...prev];
        next.splice(idx + 1, 0, created);
        return next;
      });
      toast.success('Section duplicated');
    } catch { toast.error('Failed to duplicate'); }
  }, [companyId, sections]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await websiteApi.deleteSection(id);
      setSections((prev) => prev.filter((s) => s.id !== id));
      if (selectedId === id) { setSelectedId(null); setShowEditor(false); }
      toast.success('Section deleted');
    } catch { toast.error('Failed to delete'); }
  }, [selectedId]);

  const handleMoveUp = useCallback((idx: number) => {
    if (idx <= 0) return;
    const next = [...sections];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    setSections(next);
    websiteApi.reorderSections(next.map((s, i) => ({ id: s.id, sortOrder: i }))).catch(() => toast.error('Failed to reorder'));
  }, [sections]);

  const handleMoveDown = useCallback((idx: number) => {
    if (idx >= sections.length - 1) return;
    const next = [...sections];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    setSections(next);
    websiteApi.reorderSections(next.map((s, i) => ({ id: s.id, sortOrder: i }))).catch(() => toast.error('Failed to reorder'));
  }, [sections]);

  const handleToggleVisibility = useCallback(async (id: string) => {
    const section = sections.find((s) => s.id === id);
    if (!section) return;
    await updateSection(id, { isVisible: !section.isVisible });
  }, [sections, updateSection]);

  const handleChangeLayout = useCallback((section: WebsiteSection) => {
    setLayoutPickerFor(section.id);
  }, []);

  const handleAddSection = useCallback((index: number) => {
    setAddAtIndex(index);
    setShowLibrary(true);
  }, []);

  const handleLibrarySelect = useCallback(async (type: SectionType, variant: string) => {
    try {
      const idx = addAtIndex ?? sections.length;
      const section = await websiteApi.createSection(companyId, { sectionType: type, layoutVariant: variant });
      setSections((prev) => {
        const next = [...prev];
        next.splice(idx, 0, section);
        return next;
      });
      setShowLibrary(false);
      setAddAtIndex(null);
      toast.success('Section added');
    } catch { toast.error('Failed to add section'); }
  }, [companyId, sections, addAtIndex]);

  const handleLayoutSelect = useCallback(async (variant: string) => {
    if (!layoutPickerFor) return;
    await updateSection(layoutPickerFor, { layoutVariant: variant });
    setLayoutPickerFor(null);
  }, [layoutPickerFor, updateSection]);

  if (!companyId) {
    return <div className="flex items-center justify-center h-96 text-gray-400">No company found</div>;
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c5a880] border-t-transparent" /></div>;
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-[#0a0c10]">
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#0f1219] shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-white font-semibold text-sm">Website Builder</h1>
          <div className="w-px h-4 bg-white/10 mx-2" />
          <button
            onClick={() => { setShowTheme(true); setShowEditor(false); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Palette className="h-3.5 w-3.5" /> Theme
          </button>
          <button
            onClick={() => { setShowLibrary(true); setShowEditor(false); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Layout className="h-3.5 w-3.5" /> Sections
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Device preview */}
          <div className="flex items-center gap-1 bg-[#0a0c10] rounded-lg p-0.5 border border-white/5">
            {(['desktop', 'tablet', 'mobile'] as const).map((d) => (
              <button key={d} onClick={() => setPreviewMode(d)} className={`p-1.5 rounded-md transition-colors ${previewMode === d ? 'bg-[#c5a880]/20 text-[#c5a880]' : 'text-gray-500 hover:text-gray-300'}`}>
                {d === 'desktop' ? <Monitor className="h-4 w-4" /> : d === 'tablet' ? <Tablet className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
              </button>
            ))}
          </div>

          <div className="w-px h-4 bg-white/10 mx-1" />

          {/* AI placeholder */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors" title="AI features coming soon">
            <Sparkles className="h-3.5 w-3.5" /> AI
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas */}
        <div className={`flex-1 overflow-y-auto ${showEditor ? 'mr-80' : ''} transition-all`}>
          {previewMode === 'desktop' ? (
            <BuilderCanvas
              sections={sections}
              theme={theme}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onEdit={(s) => { setEditingSection(s); setShowEditor(true); }}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onChangeLayout={handleChangeLayout}
              onToggleVisibility={handleToggleVisibility}
              onAddSection={handleAddSection}
            />
          ) : (
            <PreviewFrame
              sections={sections}
              theme={theme}
              deviceWidth={previewMode === 'mobile' ? 375 : 768}
            />
          )}
        </div>

        {/* Right sidebar editor */}
        {showEditor && editingSection && (
          <EditorPanel
            key={editingSection.id}
            section={editingSection}
            onClose={() => { setShowEditor(false); setEditingSection(null); }}
            onUpdate={updateSection}
          />
        )}
      </div>

      {/* Section Library Modal */}
      {showLibrary && (
        <SectionLibrary
          onSelect={handleLibrarySelect}
          onClose={() => { setShowLibrary(false); setAddAtIndex(null); }}
        />
      )}

      {/* Theme Modal */}
      {showTheme && (
        <ThemePanel
          theme={theme}
          onUpdate={updateTheme}
          onClose={() => setShowTheme(false)}
        />
      )}

      {/* Layout Picker */}
      {layoutPickerFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setLayoutPickerFor(null)}>
          <div className="bg-[#0f1219] border border-white/10 rounded-2xl p-6 w-80 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-white font-semibold mb-4">Choose Layout</h3>
            <div className="space-y-2">
              {(() => {
                const section = sections.find((s) => s.id === layoutPickerFor);
                if (!section) return null;
                const variants = SECTION_VARIANTS[section.sectionType as SectionType] || ['default'];
                return variants.map((v) => (
                  <button
                    key={v}
                    onClick={() => handleLayoutSelect(v)}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm text-left transition-all cursor-pointer ${
                      section.layoutVariant === v ? 'bg-[#c5a880]/10 text-[#c5a880] border border-[#c5a880]/20' : 'text-gray-300 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {v === 'default' ? 'Default' : v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ));
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WebsiteBuilder;
