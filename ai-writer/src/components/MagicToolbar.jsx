import React, { useState } from 'react';
import { rewriteText } from '../mockAI';

const MagicToolbar = ({ position, selectedText, onReplace, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);

  const handleRewrite = async (mode) => {
    setLoading(true);
    const newText = await rewriteText(selectedText, mode);
    setLoading(false);
    onReplace(newText);
    onClose();
  };

  if (!position) return null;

  return (
    <div 
      className="magic-toolbar"
      style={{ top: position.top, left: position.left }}
      onMouseDown={(e) => e.preventDefault()} // Prevent losing focus
    >
      {!optionsVisible ? (
        <button 
          className="magic-btn-main" 
          onClick={() => setOptionsVisible(true)}
        >
          <span style={{fontSize:'1.1rem'}}>✨</span> Rewrite
        </button>
      ) : (
        <div className="magic-options">
          {loading ? (
            <span className="magic-loading">Thinking...</span>
          ) : (
            <>
              <button onClick={() => handleRewrite('formal')}>Formal</button>
              <button onClick={() => handleRewrite('casual')}>Casual</button>
              <button onClick={() => handleRewrite('concise')}>Concise</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MagicToolbar;