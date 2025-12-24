import { DocItem } from '../types';

export const docsData: DocItem[] = [
  {
    id: 'intro',
    title: '概览',
    type: 'doc',
    filePath: 'docs/intro.md'
  },
  {
    id: 'basics',
    title: '基础知识',
    type: 'category',
    children: [
      { id: 'auth', title: '鉴权指南', type: 'doc', filePath: 'docs/auth.md' },
      { id: 'errors', title: '错误代码', type: 'doc', content: '# 错误代码\n\n此处为直接编写的内容示例，未链接文件。' },
      { id: 'rate-limits', title: '频率限制', type: 'doc', content: '# 频率限制\n\n请勿超过每分钟 600 次请求...' }
    ]
  },
  {
    id: 'endpoints',
    title: '接口定义',
    type: 'category',
    children: [
      {
        id: 'chat',
        title: '对话 (Chat)',
        type: 'category',
        children: [
          { id: 'create-chat', title: '发起对话', type: 'doc', method: 'POST', filePath: 'docs/chat.md' },
          { id: 'get-chat', title: '查询历史', type: 'doc', method: 'GET', content: '# 查询历史\n\n暂未开放' }
        ]
      },
      {
        id: 'image',
        title: '图像 (Image)',
        type: 'category',
        children: [
           { id: 'gemini-vision', title: 'Gemini Vision', type: 'doc', method: 'POST', filePath: 'docs/gemini.md' },
           { id: 'dalle', title: 'DALL·E 3', type: 'doc', method: 'POST', content: '# DALL·E 3\n\nOpenAI 绘图接口...' }
        ]
      }
    ]
  },
  {
    id: 'sdks',
    title: 'SDK 下载',
    type: 'doc',
    content: '# SDK 下载\n\n官方提供 Python 和 Node.js SDK。'
  }
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