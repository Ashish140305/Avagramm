import React, { useState } from 'react';
import { copyToClipboard, downloadText, generateMarkdown } from '../utils/export';

// --- ICONS ---
const Icons = {
  Export: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
  ),
  Copy: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
  ),
  Download: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
  ),
  Sun: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
  ),
  Moon: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
  ),
  Logo: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
  ),
  File: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
  )
};

// --- COLOR CONSTANTS ---
// FIXED: Changed from yellow-ish #F0EAD6 to a very subtle Off-White
const WARM_WHITE = '#FAF9F6'; 

const Header = ({ isAnalyzing, text, isDarkMode, toggleTheme, activeDocTitle = "Untitled" }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [toast, setToast] = useState(null);

  const themeColor = isDarkMode ? WARM_WHITE : '#000'; 
  const themeBg = isDarkMode ? '#000' : WARM_WHITE;    
  
  const notebookBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: themeBg, 
    color: themeColor,
    border: `2px solid ${themeColor}`,     
    borderRadius: '8px',
    padding: '8px 16px',
    fontFamily: 'sans-serif',
    fontWeight: '700',
    fontSize: '0.95rem',
    cursor: 'pointer',
    outline: 'none',
    boxShadow: `4px 4px 0px ${themeColor}`, 
    transition: 'all 0.1s ease-in-out',
    position: 'relative',
    top: '0px',
    left: '0px'
  };

  const handleMouseDown = (e) => {
    e.currentTarget.style.boxShadow = `0px 0px 0px ${themeColor}`; 
    e.currentTarget.style.transform = 'translate(4px, 4px)'; 
  };

  const handleMouseUp = (e) => {
    e.currentTarget.style.boxShadow = `4px 4px 0px ${themeColor}`; 
    e.currentTarget.style.transform = 'translate(0, 0)';
  };

  const showNotification = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) showNotification("Copied!");
    setShowExportMenu(false);
  };

  const handleDownload = (format) => {
    if (format === 'md') {
      const content = generateMarkdown(activeDocTitle, text, new Date());
      downloadText(content, `${activeDocTitle.replace(/\s+/g, '_')}.md`);
      showNotification("Saved as .MD");
    } else if (format === 'txt') {
      downloadText(text, `${activeDocTitle.replace(/\s+/g, '_')}.txt`);
      showNotification("Saved as .TXT");
    } else if (format === 'html') {
      const content = `<html><body><pre>${text}</pre></body></html>`;
      const blob = new Blob([content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeDocTitle.replace(/\s+/g, '_')}.html`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification("Saved as .HTML");
    }
    setShowExportMenu(false);
  };

  return (
    <header className="app-header" style={{ 
      padding: '15px 20px', 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `2px solid ${themeColor}`, 
      backgroundColor: 'transparent'
    }}>
      
      {/* 1. LOGO SECTION */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: themeColor }}>
        <div style={{
           background: '#000', 
           color: WARM_WHITE, 
           padding: '6px', 
           borderRadius: '6px',
           display: 'flex',
           border: `2px solid ${themeColor}` 
        }}>
           <Icons.Logo />
        </div>
        <span style={{ fontWeight: '800', fontSize: '1.2rem', letterSpacing: '-0.5px', color: themeColor }}>
          AI Writer
        </span>
        {isAnalyzing && (
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: isDarkMode ? '#aaa' : '#666', marginLeft: '10px' }}>
            PROCESSING...
          </span>
        )}
      </div>

      {/* 2. ACTIONS SECTION */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme} 
          style={{
            ...notebookBtnStyle,
            borderRadius: '50%', 
            padding: '10px',
            width: '45px',
            height: '45px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          title="Toggle Theme"
        >
          {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
        </button>

        {/* COPY BUTTON */}
        <button 
          onClick={handleCopy}
          style={notebookBtnStyle}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <Icons.Copy />
          <span>Copy</span>
        </button>

        {/* EXPORT MENU */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={(e) => { e.stopPropagation(); setShowExportMenu(!showExportMenu); }}
            style={{...notebookBtnStyle, minWidth: '110px', justifyContent: 'center'}}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            <Icons.Export />
            <span>Export</span>
          </button>

          {/* DROPDOWN MENU */}
          {showExportMenu && (
            <div style={{
              position: 'absolute', 
              top: '125%', 
              right: 0,
              background: themeBg, 
              color: themeColor,
              border: `2px solid ${themeColor}`,
              borderRadius: '8px',
              boxShadow: `6px 6px 0px ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              minWidth: '160px',
              padding: '6px',
              overflow: 'hidden'
            }}>
              {['md', 'txt', 'html'].map((fmt) => (
                <button 
                  key={fmt}
                  onClick={() => handleDownload(fmt)}
                  style={{
                    padding: '10px 12px', 
                    textAlign: 'left',
                    border: 'none', 
                    background: 'transparent',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    color: themeColor,
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    borderRadius: '4px',
                    marginBottom: '2px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#333' : '#f0f0f0'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Icons.File /> 
                  .{fmt.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TOAST NOTIFICATION - FIXED POSITION AND COLOR */}
      {toast && (
        <div style={{
          position: 'fixed', 
          top: '80px', /* MOVED TO TOP to be respectable/visible */
          left: '50%', /* Center horizontally */
          transform: 'translateX(-50%)', /* Center alignment */
          background: isDarkMode ? WARM_WHITE : '#000',  
          color: isDarkMode ? '#000' : WARM_WHITE,
          padding: '12px 24px', 
          borderRadius: '8px',
          fontWeight: 'bold',
          border: `2px solid ${isDarkMode ? '#000' : WARM_WHITE}`,
          zIndex: 2000,
          boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
          animation: 'popIn 0.2s ease-out'
        }}>
          {toast}
        </div>
      )}
    </header>
  );
};

export default Header;