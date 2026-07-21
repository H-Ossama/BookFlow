import type { WebsiteSection, WebsiteTheme } from '../../types/website.types';
import { SectionWrapper } from './SectionWrapper';
import { renderSection } from './sections';
import { Plus } from 'lucide-react';

interface BuilderCanvasProps {
  sections: WebsiteSection[];
  theme: WebsiteTheme;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onEdit: (section: WebsiteSection) => void;
  onDuplicate: (section: WebsiteSection) => void;
  onDelete: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onChangeLayout: (section: WebsiteSection) => void;
  onToggleVisibility: (id: string) => void;
  onAddSection: (index: number) => void;
}

export function BuilderCanvas({
  sections, theme, selectedId, onSelect, onEdit, onDuplicate, onDelete,
  onMoveUp, onMoveDown, onChangeLayout, onToggleVisibility, onAddSection,
}: BuilderCanvasProps) {
  const visible = sections.filter((s) => s.isVisible !== false);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="min-h-full">
        {visible.map((section, idx) => (
          <div key={section.id}>
            {/* Add section button before each section */}
            <div className="relative group/add">
              <button
                onClick={() => onAddSection(idx)}
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#1a1f2e] border border-white/10 flex items-center justify-center opacity-0 group-hover/add:opacity-100 hover:bg-[#c5a880] hover:text-[#0a0c10] transition-all text-gray-400"
              >
                <Plus className="h-4 w-4" />
              </button>
              <div className="h-2" />
            </div>

            <SectionWrapper
              isSelected={selectedId === section.id}
              onSelect={() => onSelect(section.id)}
              onEdit={() => onEdit(section)}
              onDuplicate={() => onDuplicate(section)}
              onDelete={() => onDelete(section.id)}
              onMoveUp={() => onMoveUp(idx)}
              onMoveDown={() => onMoveDown(idx)}
              onChangeLayout={() => onChangeLayout(section)}
              onToggleVisibility={() => onToggleVisibility(section.id)}
              isVisible={section.isVisible !== false}
              sectionType={section.sectionType}
              canMoveUp={idx > 0}
              canMoveDown={idx < visible.length - 1}
            >
              {renderSection(section.sectionType, section.layoutVariant, section.content, theme)}
            </SectionWrapper>
          </div>
        ))}

        {/* Add section at the bottom */}
        <div className="relative group/add">
          <button
            onClick={() => onAddSection(visible.length)}
            className="w-full py-8 flex items-center justify-center gap-2 text-gray-500 hover:text-[#c5a880] hover:bg-white/[0.01] transition-all border-2 border-dashed border-white/5 hover:border-[#c5a880]/30 rounded-none"
          >
            <Plus className="h-5 w-5" /> Add Section
          </button>
        </div>
      </div>
    </div>
  );
}
