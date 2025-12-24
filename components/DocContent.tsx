import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { DocItem } from '../types';

interface DocContentProps {
  doc: DocItem;
}

// Helper for copy button
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100"
      title="Copy code"
    >
      {copied ? <i className="fas fa-check text-green-400 text-xs"></i> : <i className="far fa-copy text-xs"></i>}
    </button>
  );
};

// Custom styling components
const components: any = {
  h1: ({node, ...props}: any) => <h1 className="text-3xl font-extrabold text-gray-900 mb-8 pb-4 border-b border-gray-200 tracking-tight" {...props} />,
  h2: ({node, ...props}: any) => <h2 className="text-2xl font-bold text-gray-800 mt-12 mb-6 tracking-tight" {...props} />,
  h3: ({node, ...props}: any) => <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4 tracking-tight" {...props} />,
  h4: ({node, ...props}: any) => <h4 className="text-lg font-semibold text-gray-700 mt-6 mb-3" {...props} />,
  p: ({node, ...props}: any) => <p className="text-[15px] text-gray-600 leading-7 mb-5" {...props} />,
  
  ul: ({node, ...props}: any) => <ul className="list-disc list-outside ml-5 space-y-2 mb-6 text-gray-600 leading-7" {...props} />,
  ol: ({node, ...props}: any) => <ol className="list-decimal list-outside ml-5 space-y-2 mb-6 text-gray-600 leading-7" {...props} />,
  
  a: ({node, ...props}: any) => <a className="text-primary font-medium hover:underline decoration-primary/30 underline-offset-2 transition-all" target="_blank" rel="noopener noreferrer" {...props} />,
  
  blockquote: ({node, ...props}: any) => (
    <div className="bg-blue-50/50 border-l-4 border-blue-500 py-3 px-4 mb-6 rounded-r-lg text-gray-700 text-sm leading-6">
      {props.children}
    </div>
  ),

  // Syntax Highlighting for Code Blocks
  code({node, inline, className, children, ...props}: any) {
    const match = /language-(\w+)/.exec(className || '');
    
    // Safely extract text from children
    const getText = (child: any): string => {
        if (typeof child === 'string') return child;
        if (typeof child === 'number') return String(child);
        if (Array.isArray(child)) return child.map(getText).join('');
        // Fallback: if we somehow get an object (like a nested React element), try to ignore it or return empty
        return '';
    };

    const codeString = getText(children).replace(/\n$/, '');

    if (!inline && match) {
      return (
        <div className="relative group mb-6 mt-4 rounded-lg overflow-hidden border border-gray-200/50 shadow-sm">
          <div className="absolute top-0 right-0 p-2 z-10">
              <CopyButton text={codeString} />
          </div>
          <SyntaxHighlighter
            {...props}
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            customStyle={{
              margin: 0,
              padding: '1.25rem',
              fontSize: '0.875rem',
              lineHeight: '1.6',
              borderRadius: '0',
              backgroundColor: '#1e1e1e', // Match VS Code Dark
            }}
            codeTagProps={{
              style: { fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace" }
            }}
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      );
    }
    
    return (
      <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-[13px] font-mono border border-gray-200" {...props}>
        {children}
      </code>
    );
  },

  // Tables
  table: ({node, ...props}: any) => (
    <div className="overflow-x-auto mb-8 border border-gray-200 rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-gray-200" {...props} />
    </div>
  ),
  thead: ({node, ...props}: any) => <thead className="bg-gray-50/80" {...props} />,
  th: ({node, ...props}: any) => <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider" {...props} />,
  tbody: ({node, ...props}: any) => <tbody className="bg-white divide-y divide-gray-200" {...props} />,
  tr: ({node, ...props}: any) => <tr className="hover:bg-gray-50/50 transition-colors" {...props} />,
  td: ({node, ...props}: any) => <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600" {...props} />,
  
  // Custom API Components via HTML comments/divs
  div: ({node, className, ...props}: any) => {
    if (className === 'api-endpoint') {
        return (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3 pl-4 mb-8 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                {props.children}
            </div>
        );
    }
    return <div className={className} {...props} />;
  },
  span: ({node, className, ...props}: any) => {
      if (className?.includes('badge')) {
          let colorClass = 'bg-gray-200 text-gray-700';
          if (className.includes('post')) colorClass = 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-600/20';
          if (className.includes('get')) colorClass = 'bg-green-100 text-green-700 ring-1 ring-green-600/20';
          if (className.includes('put')) colorClass = 'bg-blue-100 text-blue-700 ring-1 ring-blue-600/20';
          if (className.includes('delete')) colorClass = 'bg-red-100 text-red-700 ring-1 ring-red-600/20';
          
          return <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase ${colorClass} shrink-0`} {...props} />
      }
      if (className === 'url') {
          return <span className="text-gray-600 font-mono text-[13px] break-all" {...props} />
      }
      return <span className={className} {...props} />;
  }
};

export const DocContent: React.FC<DocContentProps> = ({ doc }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Effect to load content when doc changes
  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (doc.filePath) {
          const response = await fetch(doc.filePath);
          if (!response.ok) {
             throw new Error(`Failed to load ${doc.filePath}`);
          }
          const text = await response.text();
          setContent(text);
        } else if (doc.content) {
          setContent(doc.content);
        } else {
          setContent('# No Content Available\n\nThis document has no content.');
        }
      } catch (err) {
        console.error("Error loading markdown:", err);
        setError('Failed to load document content.');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [doc]);

  if (!doc) return <div className="p-10 text-center text-gray-400">Select a document to view</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 lg:px-12 lg:py-14 animate-fade-in min-h-[50vh]">
        {/* Header Metadata */}
        <div className="flex items-center space-x-2 text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            <span>Docs</span>
            <i className="fas fa-chevron-right text-[10px]"></i>
            <span className={doc.type === 'category' ? 'text-primary' : ''}>
                {doc.type === 'doc' ? 'API Reference' : 'Category'}
            </span>
        </div>

        {/* Loading State */}
        {loading ? (
            <div className="py-20 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        ) : error ? (
            <div className="py-20 text-center text-red-500">
                <i className="fas fa-exclamation-triangle mb-2 text-2xl"></i>
                <p>{error}</p>
            </div>
        ) : (
             /* Content */
            <div className="api-doc-content">
              <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={components}
              >
                  {content}
              </ReactMarkdown>
            </div>
        )}
        
        {/* Simple Footer */}
        {!loading && !error && (
            <div className="mt-24 mb-10 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400 gap-4">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span>System Operational</span>
            </div>
            <span className="text-gray-300">Powered by Your Brand</span>
            </div>
        )}
    </div>
  );
};