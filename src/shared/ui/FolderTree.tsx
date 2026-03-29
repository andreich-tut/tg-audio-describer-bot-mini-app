import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FileText } from 'lucide-react';

export interface FolderItem {
  id: string;
  name: string;
  selected?: boolean;
  children?: FolderItem[];
}

interface FolderTreeProps {
  items: FolderItem[];
  depth?: number;
}

export function FolderTree({ items, depth = 0 }: FolderTreeProps) {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({ 'root': true, 'notes': true });

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="mt-2 ml-1">
      {items.map((item) => (
        <div key={item.id} className="relative">
          {depth > 0 && <div className="absolute left-[-14px] top-0 bottom-0 w-[2px] bg-[#1e1b4b]" />}
          <div
            className={`flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer hover:bg-[#1e1b4b]/50 transition-colors group ${
              item.selected ? 'bg-[#8b5cf6]/10 text-[#a78bfa]' : 'text-[#94a3b8]'
            }`}
            onClick={() => item.children ? toggle(item.id) : null}
          >
            {item.children ? (
              <span className="text-[#475569]">
                {expanded[item.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </span>
            ) : (
              <span className="w-[14px]" />
            )}
            {item.children ? <Folder size={16} /> : <FileText size={16} />}
            <span className={`text-xs ${item.selected ? 'font-black' : 'font-semibold'}`}>{item.name}</span>
          </div>
          {item.children && expanded[item.id] && (
            <div className="ml-5">
              <FolderTree items={item.children} depth={depth + 1} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
