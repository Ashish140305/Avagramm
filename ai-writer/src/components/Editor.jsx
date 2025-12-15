import React, { useRef } from 'react';

// Icons
const Icons = {
  Edit: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
  Eye: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
};

// Internal Highlight Helper
const HighlightedText = ({ text, issues, onIssueClick }) => {
  if (!issues || issues.length === 0) return <span>{text}</span>;
  const sortedIssues = [...issues].sort((a, b) => a.start - b.start);
  const chunks = [];
  let lastIndex = 0;

  sortedIssues.forEach((issue) => {
    if (issue.start > lastIndex) chunks.push(<span key={`${issue.id}-pre`}>{text.slice(lastIndex, issue.start)}</span>);
    chunks.push(
      <span 
        key={issue.id} 
        className={`highlight ${issue.type === 'spelling' ? 'error' : 'tone'}`}
        onClick={(e) => onIssueClick(issue, e)}
        style={{ cursor: 'pointer' }}
      >
        {text.slice(issue.start, issue.end)}
      </span>
    );
    lastIndex = issue.end;
  });

  if (lastIndex < text.length) chunks.push(<span key="tail">{text.slice(lastIndex)}</span>);
  return <>{chunks}</>;
};

const Editor = ({ text, setText, mode, setMode, analysis, onIssueClick, children }) => {
  const editorRef = useRef(null);

  return (
    <div className="editor-wrapper" ref={editorRef}>
      {/* Toolbar */}
      <div className="editor-toolbar">
        {/* NEW BUTTON STYLING */}
        <button 
          onClick={() => setMode('write')}
          className={`tool-btn ${mode === 'write' ? 'active' : 'inactive'}`}
        >
          <Icons.Edit /> Write
        </button>
        <button 
          onClick={() => setMode('proofread')}
          className={`tool-btn ${mode === 'proofread' ? 'active' : 'inactive'}`}
        >
          <Icons.Eye /> Proofread 
          {analysis.issues.length > 0 && (
             <span style={{background:'var(--danger)', color:'white', fontSize:'10px', padding:'2px 6px', borderRadius:'10px'}}>
               {analysis.issues.length}
             </span>
          )}
        </button>
        <span style={{marginLeft:'auto', alignSelf: 'center', fontSize:'0.9rem', color:'var(--text-muted)'}}>
           {analysis.wordCount} words
        </span>
      </div>

      {/* Editor Content */}
      <div className="editor-content">
        {mode === 'write' && (
          <textarea
            className="textarea-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck="false"
            placeholder="Start writing..."
            autoFocus
          />
        )}

        {mode === 'proofread' && (
          <div 
            className="textarea-backdrop" 
            style={{ pointerEvents: 'auto', zIndex: 10, color: 'var(--text-main)', whiteSpace: 'pre-wrap', overflowY: 'auto' }}
          >
            <HighlightedText 
              text={text} 
              issues={analysis.issues} 
              onIssueClick={(issue, e) => {
                  const rect = e.target.getBoundingClientRect();
                  const parentRect = editorRef.current.getBoundingClientRect();
                  const pos = {
                    top: rect.bottom - parentRect.top + 10,
                    left: rect.left - parentRect.left
                  };
                  onIssueClick(issue, pos);
              }} 
            />
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
};

export default Editor;