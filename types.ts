export interface DocItem {
  id: string;
  title: string;
  type: 'doc' | 'category';
  filePath?: string; // Path to the .md file (e.g., 'docs/intro.md')
  content?: string; // Fallback inline content
  children?: DocItem[]; // Nested items for categories
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; // Optional API method badge
}

export interface SidebarProps {
  items: DocItem[];
  activeId: string;
  onNavigate: (id: string) => void;
  isMobileOpen: boolean;
  closeMobile: () => void;
}

export interface SearchProps {
  onSearch: (query: string) => void;
}