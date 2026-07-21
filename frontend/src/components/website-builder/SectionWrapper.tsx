import { type ReactNode, useState } from 'react';
import { Edit3, Copy, Trash2, ChevronUp, ChevronDown, Layout, Eye, EyeOff } from 'lucide-react';

interface SectionWrapperProps {
  children: ReactNode;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onChangeLayout: () => void;
  onToggleVisibility: () => void;
  isVisible: boolean;
  sectionType: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function SectionWrapper({
  children, isSelected, onSelect, onEdit, onDuplicate, onDelete,
  onMoveUp, onMoveDown, onChangeLayout, onToggleVisibility,
  isVisible, sectionType, canMoveUp, canMoveDown,
}: SectionWrapperProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`group/section relative transition-all duration-200 ${
        isSelected ? 'ring-2 ring-[#c5a880] ring-inset' : ''
      } ${!isVisible ? 'opacity-40' : ''}`}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}

      {/* Floating actions bar */}
      {(hovered || isSelected) && (
        <div className="absolute top-2 right-2 z-30 flex items-center gap-1 bg-[#1a1f2e] border border-white/10 rounded-lg p-1 shadow-xl opacity-0 group-hover/section:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-1.5 rounded-md hover:bg-white/10 text-gray-300 hover:text-white transition-colors" title="Edit"><Edit3 className="h-3.5 w-3.5" /></button>
          <button onClick={(e) => { e.stopPropagation(); onChangeLayout(); }} className="p-1.5 rounded-md hover:bg-white/10 text-gray-300 hover:text-white transition-colors" title="Change Layout"><Layout className="h-3.5 w-3.5" /></button>
          <button onClick={(e) => { e.stopPropagation(); onDuplicate(); }} className="p-1.5 rounded-md hover:bg-white/10 text-gray-300 hover:text-white transition-colors" title="Duplicate"><Copy className="h-3.5 w-3.5" /></button>
          {canMoveUp && <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} className="p-1.5 rounded-md hover:bg-white/10 text-gray-300 hover:text-white transition-colors" title="Move Up"><ChevronUp className="h-3.5 w-3.5" /></button>}
          {canMoveDown && <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} className="p-1.5 rounded-md hover:bg-white/10 text-gray-300 hover:text-white transition-colors" title="Move Down"><ChevronDown className="h-3.5 w-3.5" /></button>}
          <button onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }} className="p-1.5 rounded-md hover:bg-white/10 text-gray-300 hover:text-white transition-colors" title={isVisible ? 'Hide' : 'Show'}>{isVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}</button>
          <div className="w-px h-4 bg-white/10 mx-0.5" />
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 rounded-md hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition-colors" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      )}

      {/* Section type label */}
      {(hovered || isSelected) && (
        <div className="absolute top-2 left-2 z-30 px-2 py-0.5 rounded-md bg-[#1a1f2e] border border-white/10 text-[10px] text-gray-400 font-medium uppercase tracking-wider opacity-0 group-hover/section:opacity-100 transition-opacity">
          {sectionType}
        </div>
      )}
    </div>
  );
}
