import React, { useRef, useLayoutEffect, useState } from 'react';

const SuggestionCard = ({ issue, onAccept, onDismiss, onAddToDict, position }) => {
  const cardRef = useRef(null);
  const [adjustedStyle, setAdjustedStyle] = useState({ 
    top: position.top, 
    left: position.left,
    opacity: 0 
  });

  useLayoutEffect(() => {
    if (cardRef.current && cardRef.current.offsetParent) {
        const card = cardRef.current;
        const parent = card.offsetParent; // The editor wrapper
        const cardRect = card.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();
        
        let newLeft = position.left;
        let newTop = position.top;
        
        // 1. Horizontal Safety (Prevent cutting off right side)
        if (newLeft + cardRect.width > parentRect.width) {
            newLeft = parentRect.width - cardRect.width - 20; // 20px padding from right
        }
        if (newLeft < 10) newLeft = 10;

        // 2. Vertical Safety (Prevent cutting off bottom)
        // Check if top position + card height > parent height
        // position.top is usually (rect.bottom - parentRect.top + 10)
        
        // We calculate if the card fits below the error
        const fitsBelow = (newTop + cardRect.height) < parentRect.height;
        
        if (!fitsBelow) {
            // Flip UP: Position it above the error line
            // We need to estimate the error height (approx 24px line height)
            // Move up by Card Height + Error Line Height + buffer
            newTop = newTop - cardRect.height - 40; 
        }

        setAdjustedStyle({ top: newTop, left: newLeft, opacity: 1 });
    }
  }, [position]);

  return (
    <div 
      className="suggestion-card"
      ref={cardRef}
      style={{ 
          top: adjustedStyle.top, 
          left: adjustedStyle.left,
          opacity: adjustedStyle.opacity,
          transition: 'opacity 0.1s ease, top 0.2s ease, left 0.2s ease'
      }}
    >
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}>
        <span style={{fontSize:'12px', fontWeight:'bold', color:'var(--text-muted)', textTransform:'uppercase'}}>{issue.type}</span>
        <button onClick={onDismiss} style={{border:'none', background:'none', cursor:'pointer', fontSize:'16px', color:'#999'}}>×</button>
      </div>
      
      <div style={{marginBottom:'4px', color: 'var(--pop-coral)', textDecoration: 'line-through'}}>{issue.original}</div>
      <div className="suggestion-fix" onClick={() => onAccept(issue.suggestion)}>{issue.suggestion}</div>

      {issue.type === 'vocabulary' && (
        <div style={{display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '8px'}}>
          <span style={{fontSize:'11px', color:'var(--text-muted)'}}>Or:</span>
          {['sublime', 'superb', 'stellar'].map(syn => (
             <span key={syn} onClick={() => onAccept(syn)} style={{fontSize:'11px', background:'#f3f4f6', padding:'2px 6px', borderRadius:'4px', cursor:'pointer'}}>{syn}</span>
          ))}
        </div>
      )}

      <p style={{fontSize: '13px', color: '#666', margin: '8px 0'}}>{issue.reason}</p>

      <div className="suggestion-actions" style={{display:'flex', gap:'8px'}}>
        <button className="btn-accept" onClick={() => onAccept(issue.suggestion)}>Accept Fix</button>
        <button 
            onClick={() => onAddToDict(issue.original)}
            title="Add to Dictionary"
            style={{background:'transparent', border:'2px solid #eee', borderRadius:'8px', cursor:'pointer', padding:'0 10px'}}
        >
            📖
        </button>
      </div>
    </div>
  );
};

export default SuggestionCard;