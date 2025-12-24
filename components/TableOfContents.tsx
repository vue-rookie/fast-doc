import React, { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const isScrollingRef = React.useRef<boolean>(false);

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const headings: TocItem[] = [];
    let match;
    const idCounts: Record<string, number> = {};

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      // Create a simple slug from the heading text
      // IMPORTANT: This must match the logic in DocContent.tsx createHeadingId function
      let id = text
        .toLowerCase()
        // Remove all punctuation and special chars except Chinese, alphanumeric, spaces, and hyphens
        .replace(/[^\u4e00-\u9fa5a-z0-9\s-]/g, '')
        // Replace multiple spaces with single hyphen
        .replace(/\s+/g, '-')
        // Replace multiple hyphens with single hyphen
        .replace(/-+/g, '-')
        .trim();

      // Ensure unique IDs by adding counter if duplicate
      if (idCounts[id] !== undefined) {
        idCounts[id]++;
        id = `${id}-${idCounts[id]}`;
      } else {
        idCounts[id] = 0;
      }

      headings.push({ id, text, level });
    }

    setToc(headings);
  }, [content]);

  useEffect(() => {
    // Update active heading based on scroll position
    const updateActiveHeading = () => {
      // Skip update if we're programmatically scrolling
      if (isScrollingRef.current) return;

      const headingElements = document.querySelectorAll('h1[id], h2[id], h3[id]');
      const scrollPosition = window.scrollY + 100; // Offset for header

      let currentId = '';

      // Find the heading that's currently visible (closest to top of viewport)
      headingElements.forEach((heading) => {
        const element = heading as HTMLElement;
        if (element.offsetTop <= scrollPosition) {
          currentId = element.id;
        }
      });

      if (currentId) {
        setActiveId(currentId);
      }
    };

    // Update on scroll
    window.addEventListener('scroll', updateActiveHeading);
    // Initial update
    updateActiveHeading();

    return () => window.removeEventListener('scroll', updateActiveHeading);
  }, [toc]);

  const scrollToHeading = (id: string) => {
    // Try to find the element, with retries in case it hasn't rendered yet
    const maxAttempts = 5;
    let attempts = 0;

    const tryScroll = () => {
      const element = document.getElementById(id);

      if (element) {
        // Set flag to indicate programmatic scrolling
        isScrollingRef.current = true;

        // Immediately set active state
        setActiveId(id);

        const offset = 80; // Account for fixed header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Re-enable scroll listener after animation completes
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 1000); // Smooth scroll typically takes ~500-800ms, using 1000ms to be safe
      } else {
        attempts++;
        if (attempts < maxAttempts) {
          // Element not ready yet, try again after a short delay
          setTimeout(tryScroll, 100);
        } else {
          console.error('Element not found with id after', maxAttempts, 'attempts:', id);
        }
      }
    };

    tryScroll();
  };

  if (toc.length === 0) return null;

  return (
    <div className="hidden xl:block w-64 shrink-0">
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar">
        <div className="pb-4">
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-700">
            <i className="fas fa-list-ul text-primary"></i>
            <span>本章目录</span>
          </div>
          <nav className="space-y-1">
            {toc.map((item, index) => (
              <button
                key={index}
                onClick={() => scrollToHeading(item.id)}
                className={`
                  block w-full text-left text-xs py-1.5 px-3 rounded transition-all
                  ${item.level === 1 ? 'font-semibold' : ''}
                  ${item.level === 2 ? 'pl-5' : ''}
                  ${item.level === 3 ? 'pl-8 text-[11px]' : ''}
                  ${
                    activeId === item.id
                      ? 'text-primary bg-blue-50 font-medium border-l-2 border-primary'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent'
                  }
                `}
              >
                {item.text}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};
