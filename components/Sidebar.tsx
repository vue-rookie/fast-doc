import React, { useState, useEffect } from 'react';
import { DocItem, SidebarProps } from '../types';

const MethodBadge = ({ method }: { method?: string }) => {
  if (!method) return null;
  const colors: Record<string, string> = {
    GET: 'text-api-get bg-api-get/10',
    POST: 'text-api-post bg-api-post/10',
    PUT: 'text-api-put bg-api-put/10',
    DELETE: 'text-api-delete bg-api-delete/10',
  };
  
  // Just colored text, no background for sidebar to keep it clean
  const textColors: Record<string, string> = {
    GET: 'text-api-get',
    POST: 'text-api-post',
    PUT: 'text-api-put',
    DELETE: 'text-api-delete',
  };

  return (
    <span className={`text-[9px] font-bold ml-auto px-1.5 py-0.5 rounded opacity-90 ${colors[method] || 'text-gray-500'}`}>
      {method}
    </span>
  );
};

interface MenuItemProps {
  item: DocItem;
  level?: number;
  activeId: string;
  onNavigate: (id: string) => void;
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  item, 
  level = 0, 
  activeId, 
  onNavigate, 
  expandedIds, 
  toggleExpand 
}) => {
  const isActive = item.id === activeId;
  const isExpanded = expandedIds.has(item.id);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      toggleExpand(item.id);
    } else {
      onNavigate(item.id);
    }
  };

  return (
    <div className="select-none">
      <div
        className={`
          group flex items-center py-1.5 pr-3 cursor-pointer transition-all duration-200 text-[13.5px]
          ${isActive 
            ? 'bg-blue-50/80 text-primary font-medium border-r-[3px] border-primary' 
            : 'text-gray-600 hover:bg-sidebar-hover hover:text-gray-900 border-r-[3px] border-transparent'
          }
        `}
        style={{ paddingLeft: `${level * 14 + 20}px` }}
        onClick={handleClick}
      >
        {/* Icon logic: Folder for categories, Dot for docs */}
        <div className="w-4 flex justify-center mr-2">
            {hasChildren ? (
                 <i className={`fas fa-folder${isExpanded ? '-open' : ''} text-xs ${isActive ? 'text-blue-400' : 'text-gray-300 group-hover:text-gray-400'} transition-colors`}></i>
            ) : (
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-primary' : 'bg-gray-300 group-hover:bg-gray-400'}`}></div>
            )}
        </div>

        <span className="flex-1 truncate">{item.title}</span>
        
        {item.type === 'doc' && <MethodBadge method={item.method} />}
        
        {hasChildren && (
          <i className={`fas fa-chevron-right text-[10px] text-gray-400 transform transition-transform duration-200 ml-2 ${isExpanded ? 'rotate-90' : ''}`}></i>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div className="overflow-hidden">
          {item.children!.map((child) => (
            <MenuItem
              key={child.id}
              item={child}
              level={level + 1}
              activeId={activeId}
              onNavigate={onNavigate}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ items, activeId, onNavigate, isMobileOpen, closeMobile }) => {
  const [query, setQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Initial expansion
  useEffect(() => {
     // Optional: expand active path on load
  }, []);

  const matchesSearch = (item: DocItem): boolean => {
    if (!query) return true;
    const selfMatch = item.title.toLowerCase().includes(query.toLowerCase());
    const childrenMatch = item.children?.some(child => matchesSearch(child));
    return selfMatch || !!childrenMatch;
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    if (query) {
      const allIds = new Set<string>();
      const collectIds = (nodes: DocItem[]) => {
        nodes.forEach(node => {
          if (node.children) {
            allIds.add(node.id);
            collectIds(node.children);
          }
        });
      };
      collectIds(items);
      setExpandedIds(allIds);
    } else {
        // Reset or keep intelligent state
        setExpandedIds(new Set(['guide', 'chat-api', 'chatgpt-group'])); // Default open some
    }
  }, [query, items]);

  return (
    <>
        {/* Mobile Overlay */}
        {isMobileOpen && (
            <div 
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                onClick={closeMobile}
            />
        )}

        {/* Sidebar Container */}
        <div className={`
            fixed top-0 left-0 h-full w-72 bg-sidebar border-r border-sidebar-border z-50 transform transition-transform duration-300 ease-in-out shadow-lg lg:shadow-none
            lg:translate-x-0 lg:sticky lg:top-0
            ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-sidebar-border bg-sidebar/50 backdrop-blur">
                <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center text-white text-xs font-bold mr-2">
                    D
                </div>
                <span className="font-bold text-gray-800 text-lg tracking-tight">Docs Portal</span>
            </div>

            {/* Search Header */}
            <div className="p-4 sticky top-0 z-10">
                <div className="relative group">
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs group-focus-within:text-primary transition-colors"></i>
                    <input
                        type="text"
                        placeholder="Search documentation..."
                        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm placeholder-gray-400"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Menu List */}
            <div className="overflow-y-auto h-[calc(100vh-140px)] pb-10 custom-scrollbar px-0">
                <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-2">
                    Navigation
                </div>
                {items.map(item => (
                    matchesSearch(item) ? (
                        <MenuItem
                            key={item.id}
                            item={item}
                            activeId={activeId}
                            onNavigate={(id) => {
                                onNavigate(id);
                                if (window.innerWidth < 1024) closeMobile();
                            }}
                            expandedIds={expandedIds}
                            toggleExpand={toggleExpand}
                        />
                    ) : null
                ))}
            </div>
        </div>
    </>
  );
};