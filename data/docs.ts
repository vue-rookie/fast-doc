import { DocItem } from '../types';

export const docsData: DocItem[] = [
  {
    id: 'intro',
    title: '概览',
    type: 'doc',
    filePath: 'docs/intro.md'
  },
  {
    id: 'start',
    title: '快速开始',
    type: 'doc',
    filePath: 'docs/start.md'
  },
  {
    id: 'plugins',
    title: '各种插件配置',
    type: 'category',
    children: [
      {
        id: 'claudeCode',
        title: 'claudeCode配置',
        type: 'doc',
        filePath: 'docs/plugin/claudecode.md'
      },
      {
        id: 'codeX',
        title: 'codeX配置',
        type: 'doc',
        filePath: 'docs/plugin/codex.md'
      },
      {
        id: 'cursor',
        title: 'Cursor配置',
        type: 'doc',
        filePath: 'docs/plugin/cursor.md'
      },
      {
        id: 'n8n',
        title: 'n8n配置',
        type: 'doc',
        filePath: 'docs/plugin/n8n.md'
      },
      {
        id: 'geminicli',
        title: 'gemini Cli配置',
        type: 'doc',
        filePath: 'docs/plugin/geminicli.md'
      },
    ]
  },
  {
    id: 'question',
    title: '常见问题',
    type: 'doc',
    filePath: 'docs/question.md'
  },
];

// Helper functions
export const flattenDocs = (items: DocItem[]): Record<string, DocItem> => {
  let flat: Record<string, DocItem> = {};
  items.forEach(item => {
    if (item.type === 'doc') {
      flat[item.id] = item;
    }
    if (item.children) {
      flat = { ...flat, ...flattenDocs(item.children) };
    }
  });
  return flat;
};

export const findPathToDoc = (items: DocItem[], targetId: string, currentPath: string[] = []): string[] | null => {
    for (const item of items) {
        if (item.id === targetId) return [...currentPath, item.id];
        if (item.children) {
            const childPath = findPathToDoc(item.children, targetId, [...currentPath, item.id]);
            if (childPath) return childPath;
        }
    }
    return null;
};

// Find any item (doc or category) by id
export const findItemById = (items: DocItem[], targetId: string): DocItem | null => {
  for (const item of items) {
    if (item.id === targetId) return item;
    if (item.children) {
      const found = findItemById(item.children, targetId);
      if (found) return found;
    }
  }
  return null;
};