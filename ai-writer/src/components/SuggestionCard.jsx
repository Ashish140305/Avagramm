import React from 'react';

const SuggestionCard = ({ issue, onAccept, onDismiss, position }) => {
  return (
    <div 
      className="suggestion-card"
      style={{ top: position.top, left: position.left }}
    >
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}>
        <span style={{fontSize:'12px', fontWeight:'bold', color:'var(--text-muted)', textTransform:'uppercase'}}>
          {issue.type}
        </span>
        <button onClick={onDismiss} style={{border:'none', background:'none', cursor:'pointer', fontSize:'16px', color:'#999'}}>×</button>
      </div>
      
      {/* Error / Weak Word */}
      <div style={{marginBottom:'4px', color: 'var(--danger)', textDecoration: 'line-through'}}>
          {issue.original}
      </div>

      {/* Primary Suggestion */}
      <div 
        className="suggestion-fix" 
        onClick={() => onAccept(issue.suggestion)}
      >
        {issue.suggestion}
      </div>

      {/* Synonyms (New Feature) */}
      {issue.type === 'vocabulary' && (
        <div style={{display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '8px'}}>
          <span style={{fontSize:'11px', color:'var(--text-muted)'}}>Or:</span>
          {['sublime', 'superb', 'stellar'].map(syn => (
             <span 
                key={syn}
                onClick={() => onAccept(syn)}
                style={{fontSize:'11px', background:'#f3f4f6', padding:'2px 6px', borderRadius:'4px', cursor:'pointer'}}
             >
               {syn}
             </span>
          ))}
        </div>
      )}

      <p style={{fontSize: '13px', color: 'var(--text-muted)', margin: '8px 0'}}>
          {issue.reason}
      </p>

      <div className="suggestion-actions">
        <button className="btn-accept" onClick={() => onAccept(issue.suggestion)}>
          Accept Fix
        </button>
      </div>
    </div>
  );
};

export default SuggestionCard;