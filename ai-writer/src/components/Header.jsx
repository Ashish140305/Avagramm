import React, { useState } from 'react';
import { downloadText, triggerPrint, copyToClipboard } from '../utils/export';

const Icons = {
  Wand: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2l3 3-3 3"></path><path d="M15 5l-8 8"></path><path d="M9 13l-6 6"></path></svg>,
  Check: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  Download: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
  Copy: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>,
  Moon: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>,
  Sun: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
};

const Header = ({ isAnalyzing, text, isDarkMode, toggleTheme }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [copyStatus, setCopyStatus] = useState('idle');

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
        setCopyStatus('copied');
        setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  return (
    <header className="app-header">
      <div className="logo">
        <Icons.Wand /> <span>AI Writer</span>
      </div>

      <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
        <div className="status">
            {isAnalyzing ? (
            <span style={{display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize:'0.9rem'}}>
                Checking... 
                <div className="spinner" style={{width: 12, height: 12, border: '2px solid #ccc', borderTopColor: '#333', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
            </span>
            ) : (
            <span style={{color: 'var(--pop-mint)', display:'flex', alignItems:'center', gap:'5px', fontSize:'0.9rem', fontWeight:600}}>
                <Icons.Check /> All checks passed
            </span>
            )}
        </div>

        {/* Theme Toggle */}
        <button 
            onClick={toggleTheme}
            className="tool-btn"
            style={{background:'transparent', padding:'8px'}}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
        </button>

        <div style={{display:'flex', gap:'8px'}}>
            <button 
                onClick={handleCopy}
                className="tool-btn"
                style={{background: copyStatus === 'copied' ? 'var(--pop-mint)' : 'rgba(255,255,255,0.5)', color: copyStatus === 'copied' ? '#000' : 'inherit'}}
                title="Copy to Clipboard"
            >
                {copyStatus === 'copied' ? 'Copied!' : <Icons.Copy />}
            </button>

            <div style={{position:'relative'}}>
                <button 
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="tool-btn"
                    style={{background: 'var(--ink-black)', color: isDarkMode ? '#000' : 'white'}}
                >
                    <Icons.Download /> Export
                </button>

                {showExportMenu && (
                    <div style={{
                        position:'absolute', top:'110%', right:0, 
                        background: isDarkMode ? '#333' : 'white', 
                        border: '2px solid var(--ink-black)', 
                        borderRadius:'8px', overflow:'hidden', minWidth:'140px',
                        boxShadow:'4px 4px 0px rgba(0,0,0,0.1)', zIndex: 50
                    }}>
                        <div 
                            onClick={() => { downloadText(text); setShowExportMenu(false); }}
                            style={{padding:'10px 15px', cursor:'pointer', fontSize:'0.9rem', color: isDarkMode ? '#fff' : '#000'}}
                        >
                            Text File (.txt)
                        </div>
                        <div 
                            onClick={() => { triggerPrint(); setShowExportMenu(false); }}
                            style={{padding:'10px 15px', cursor:'pointer', fontSize:'0.9rem', borderTop:'1px solid #eee', color: isDarkMode ? '#fff' : '#000'}}
                        >
                            PDF (via Print)
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;