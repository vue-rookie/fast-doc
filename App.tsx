import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, useParams, useNavigate, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { DocContent } from './components/DocContent';
import { docsData, flattenDocs } from './data/docs';

// Wrapper to handle params logic
const DocWrapper = ({ 
  toggleMobile, 
  isMobileOpen 
}: { 
  toggleMobile: () => void, 
  isMobileOpen: boolean 
}) => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const flatDocs = flattenDocs(docsData);
  const currentDoc = docId ? flatDocs[docId] : flatDocs['intro'];

  // Scroll to top on doc change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [docId]);

  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      <Sidebar 
        items={docsData} 
        activeId={docId || 'intro'} 
        onNavigate={(id) => navigate(`/doc/${id}`)}
        isMobileOpen={isMobileOpen}
        closeMobile={() => toggleMobile()}
      />

      <main className="flex-1 w-0 min-w-0 bg-white lg:bg-white relative">
        {/* Mobile Header */}
        <div className="lg:hidden h-14 border-b border-gray-200 flex items-center px-4 sticky top-0 bg-white/90 backdrop-blur z-20">
            <button 
                onClick={() => toggleMobile()}
                className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
            >
                <i className="fas fa-bars"></i>
            </button>
            <span className="ml-3 font-semibold text-gray-700 truncate">
                {currentDoc?.title || 'API Docs'}
            </span>
        </div>

        {currentDoc ? (
            <DocContent doc={currentDoc} />
        ) : (
             <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <i className="fas fa-file-circle-xmark text-4xl mb-4"></i>
                <p>Document not found</p>
                <button 
                    onClick={() => navigate('/doc/intro')}
                    className="mt-4 text-blue-500 hover:underline"
                >
                    Return Home
                </button>
             </div>
        )}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/doc/intro" replace />} />
        <Route 
            path="/doc/:docId" 
            element={
                <DocWrapper 
                    toggleMobile={() => setIsMobileOpen(!isMobileOpen)} 
                    isMobileOpen={isMobileOpen}
                />
            } 
        />
      </Routes>
    </Router>
  );
};

export default App;
