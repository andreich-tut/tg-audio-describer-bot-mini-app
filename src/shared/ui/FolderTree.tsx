import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, Loader2 } from 'lucide-react';

export interface FolderItem {
  id: string;
  name: string;
  path: string;
  selected?: boolean;
  children?: FolderItem[];
  isLoading?: boolean;
}

interface FolderTreeProps {
  items: FolderItem[];
  depth?: number;
  onFolderClick?: (path: string) => void;
  onFolderExpand?: (path: string) => void;
  isLoadingChildren?: (path: string) => boolean;
}

export function FolderTree({
  items,
  depth = 0,
  onFolderClick,
  onFolderExpand,
  isLoadingChildren
}: FolderTreeProps) {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({ 'root': true });

  const toggle = (id: string, path: string, hasChildren: boolean) => {
    const newExpanded = { ...expanded, [id]: !expanded[id] };
    setExpanded(newExpanded);

    // If expanding and has children, notify parent to load children
    if (!expanded[id] && hasChildren && onFolderExpand) {
      onFolderExpand(path);
    }
  };

  return (
    <div className="mt-2 ml-1">
      {items.map((item) => {
        // Has children if children array exists (even if empty, means loaded)
        const hasChildren = item.children !== undefined;
        const isExpanded = expanded[item.id];
        const isLoading = isLoadingChildren?.(item.path) ?? false;
        const showChevron = hasChildren || isLoading;

        return (
          <div key={item.id} className="relative">
            {depth > 0 && <div className="absolute left-[-14px] top-0 bottom-0 w-[2px] bg-[#1e1b4b]" />}
            <div
              className={`flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer hover:bg-[#1e1b4b]/50 transition-colors group ${
                item.selected ? 'bg-[#8b5cf6]/10 text-[#a78bfa]' : 'text-slate-300'
              }`}
              onClick={() => {
                if (showChevron) {
                  toggle(item.id, item.path, hasChildren);
                } else if (onFolderClick) {
                  onFolderClick(item.path);
                }
              }}
            >
              {/* Chevron or spacer */}
              {showChevron ? (
                <span className="text-slate-500 flex-shrink-0">
                  {isLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : isExpanded ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </span>
              ) : (
                <span className="w-[14px] flex-shrink-0" />
              )}
              
              {/* Folder icon - always shown for folders */}
              <Folder 
                size={16} 
                className={`flex-shrink-0 ${
                  item.selected ? 'text-[#a78bfa]' : 'text-[#64748b] group-hover:text-[#94a3b8]'
                }`} 
                fill={item.selected ? 'currentColor' : 'none'}
              />
              
              {/* Folder name */}
              <span className={`text-xs truncate ${item.selected ? 'font-black' : 'font-semibold'}`}>
                {item.name}
              </span>
            </div>
            
            {/* Render children if expanded and has children */}
            {hasChildren && isExpanded && item.children && item.children.length > 0 && (
              <div className="ml-5">
                <FolderTree
                  items={item.children}
                  depth={depth + 1}
                  onFolderClick={onFolderClick}
                  onFolderExpand={onFolderExpand}
                  isLoadingChildren={isLoadingChildren}
                />
              </div>
            )}
            
            {/* Show "empty" message if expanded but no children */}
            {hasChildren && isExpanded && (!item.children || item.children.length === 0) && !isLoading && (
              <div className="ml-5 py-2 px-3 text-[10px] text-slate-600 italic">
                Empty folder
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
