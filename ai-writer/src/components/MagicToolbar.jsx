// src/components/MagicToolbar.jsx
import React, { useState, useEffect } from 'react';
import { aiRewrite, getSynonyms } from '../aiEngine';

const MagicToolbar = ({ position, selectedText, onReplace, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('menu'); // 'menu' | 'rewrite' | 'synonyms'
  const [synonyms, setSynonyms] = useState([]);

  // Detect context on mount
  useEffect(() => {
      const wordCount = selectedText.trim().split(/\s+/).length;
      if (wordCount === 1) {
          const found = getSynonyms(selectedText);
          if (found.length > 0) {
              setSynonyms(found);
              setView('synonyms');
          }
      }
  }, [selectedText]);

  const handleRewrite = async (mode) => {
    setLoading(true);
    const newText = await aiRewrite(selectedText, mode);
    setLoading(false);
    onReplace(newText);
    onClose();
  };

  const handleSynonymClick = (word) => {
      onReplace(word);
      onClose();
  };

  // Prevent closing when clicking inside
  const handleMouseDown = (e) => e.preventDefault();

  if (!position) return null;

  return (
    <div 
      className="magic-toolbar"
      style={{ top: position.top, left: position.left }}
      onMouseDown={handleMouseDown}
    >
      {/* 1. LOADING STATE */}
      {loading && (
          <div className="magic-loading">
              <span className="spinner-small"></span> Thinking...
          </div>
      )}

      {/* 2. SYNONYM VIEW (Single Word) */}
      {!loading && view === 'synonyms' && (
          <div className="magic-options">
              <span className="label-tiny">Synonyms:</span>
              {synonyms.map(word => (
                  <button key={word} onClick={() => handleSynonymClick(word)}>{word}</button>
              ))}
              <div className="divider-vertical"></div>
              <button className="icon-btn" onClick={() => setView('menu')} title="More options">➡️</button>
          </div>
      )}

      {/* 3. REWRITE MENU (Multiple Words / Default) */}
      {!loading && view === 'menu' && (
          <div className="magic-options">
             <button className="magic-btn-main" onClick={() => setView('rewrite')}>
                <span style={{fontSize:'1.1rem'}}>✨</span> Rewrite
             </button>
             {/* If we skipped synonyms but they exist, show back button */}
             {synonyms.length > 0 && (
                 <button className="icon-btn" onClick={() => setView('synonyms')} title="Back to synonyms">⬅️</button>
             )}
          </div>
      )}

      {/* 4. REWRITE MODES */}
      {!loading && view === 'rewrite' && (
          <div className="magic-options">
              <button onClick={() => handleRewrite('formal')}>Formal</button>
              <button onClick={() => handleRewrite('casual')}>Casual</button>
              <button onClick={() => handleRewrite('concise')}>Concise</button>
              <div className="divider-vertical"></div>
              <button className="icon-btn" onClick={() => setView('menu')}>✕</button>
          </div>
      )}
    </div>
  );
};

export default MagicToolbar;