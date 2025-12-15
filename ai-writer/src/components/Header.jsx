import React from 'react';

// Icons (Inline for portability)
const Icons = {
  Wand: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2l3 3-3 3"></path><path d="M15 5l-8 8"></path><path d="M9 13l-6 6"></path></svg>,
  Check: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
};

const Header = ({ isAnalyzing }) => {
  return (
    <header>
      <div className="logo">
        <Icons.Wand /> <span>AI Writer</span>
      </div>
      <div className="status">
        {isAnalyzing ? (
          <span style={{display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)'}}>
            Checking... 
            <div className="spinner" style={{width: 12, height: 12, border: '2px solid #ccc', borderTopColor: '#333', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
          </span>
        ) : (
          <span style={{color: 'var(--success)', display:'flex', alignItems:'center', gap:'5px'}}>
            <Icons.Check /> All checks passed
          </span>
        )}
      </div>
    </header>
  );
};

export default Header;