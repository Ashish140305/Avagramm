// src/components/SuggestionCard.jsx
import React, { useRef, useLayoutEffect, useState } from 'react';
import './SuggestionCard.css'; // Make sure to import the CSS

const SuggestionCard = ({ issue, onAccept, onDismiss, onAddToDict, position }) => {
  const cardRef = useRef(null);
  const [adjustedStyle, setAdjustedStyle] = useState({ 
    top: position.top, 
    left: position.left,
    opacity: 0,
    zIndex: 1000 
  });

  useLayoutEffect(() => {
    if (cardRef.current && cardRef.current.offsetParent) {
        const card = cardRef.current;
        const parent = card.offsetParent; 
        const cardRect = card.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();
        
        let newLeft = position.left;
        let newTop = position.top;
        
        // Safety bounds
        if (newLeft + cardRect.width > parentRect.width) newLeft = parentRect.width - cardRect.width - 20;
        if (newLeft < 10) newLeft = 10;
        const fitsBelow = (newTop + cardRect.height) < parentRect.height;
        if (!fitsBelow) newTop = newTop - cardRect.height - 40; 

        setAdjustedStyle({ top: newTop, left: newLeft, opacity: 1, zIndex: 1000 });
    }
  }, [position]);

  return (
    <div 
      className="suggestion-card"
      ref={cardRef}
      style={{ top: adjustedStyle.top, left: adjustedStyle.left, opacity: adjustedStyle.opacity }}
    >
      {/* HEADER */}
      <div className="card-header">
        <span className="issue-type">{issue.type} ERROR</span>
        <button className="btn-close" onClick={onDismiss}>×</button>
      </div>
      
      {/* CONTENT */}
      <div className="original-text">{issue.original}</div>
      <div className="suggestion-fix" onClick={() => onAccept(issue.suggestion)}>
        {issue.suggestion}
      </div>

      {/* SYNONYMS */}
      {issue.type === 'vocabulary' && (
        <div className="synonym-row">
          <span className="synonym-label">TRY:</span>
          {['sublime', 'superb', 'stellar'].map(syn => (
             <button key={syn} className="synonym-chip" onClick={() => onAccept(syn)}>
               {syn}
             </button>
          ))}
        </div>
      )}

      {/* REASON */}
      <p style={{fontSize: '0.8rem', color: '#52525b', fontStyle:'italic', margin: '0'}}>
        Note: {issue.reason}
      </p>

      {/* ACTIONS */}
      <div className="card-actions">
        <button className="btn-accept-fix" onClick={() => onAccept(issue.suggestion)}>
            ✓ APPLY FIX
        </button>
        <button className="btn-dict" onClick={() => onAddToDict(issue.original)} title="Add to Dictionary">
            📖
        </button>
      </div>
    </div>
  );
};

export default SuggestionCard;