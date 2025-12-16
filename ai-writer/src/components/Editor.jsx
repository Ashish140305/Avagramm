// src/components/Editor.jsx
import React, { useRef, useState, useEffect } from 'react';
import MagicToolbar from './MagicToolbar';
import { predictNextWords } from '../services/autocompleteService';

const Editor = ({ text, setText, mode, setMode, analysis, onIssueClick, children }) => {
  const textareaRef = useRef(null);
  const [selection, setSelection] = useState(null);
  const [ghostText, setGhostText] = useState(""); 
  const typingTimeoutRef = useRef(null);

  // --- AUTOCOMPLETE LOGIC ---
  useEffect(() => {
    if (mode !== 'write' || !text) {
        setGhostText("");
        return;
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(async () => {
      if (textareaRef.current && textareaRef.current.selectionEnd === text.length) {
          const suggestion = await predictNextWords(text);
          setGhostText(suggestion);
      }
    }, 1000);

    return () => clearTimeout(typingTimeoutRef.current);
  }, [text, mode]);

  const handleKeyDown = (e) => {
    if (e.key === 'Tab' && ghostText) {
      e.preventDefault();
      setText(text + ghostText);
      setGhostText("");
    }
  };

  // --- SELECTION LOGIC ---
  const handleMouseUp = (e) => {
    // Disable text selection toolbar in proofread mode
    if (mode === 'proofread') return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);

    if (selectedText.trim().length > 0) {
      const rect = textarea.getBoundingClientRect();
      const left = e.clientX - rect.left; 
      const top = e.clientY - rect.top - 50; 
      setSelection({
        start, end, text: selectedText,
        position: { top: Math.max(0, top), left: Math.max(0, left) }
      });
    } else {
      setSelection(null);
    }
  };

  const handleReplacement = (newSnippet) => {
    if (!selection) return;
    const before = text.substring(0, selection.start);
    const after = text.substring(selection.end);
    setText(before + newSnippet + after);
    setSelection(null);
  };

  // --- CLICK HANDLER FOR ISSUES ---
  const handleIssueInteraction = (e, issue) => {
      const rect = e.target.getBoundingClientRect();
      const parentRect = e.target.closest('.editor-wrapper').getBoundingClientRect();
      
      onIssueClick(issue, { 
          top: rect.bottom - parentRect.top + 5, 
          left: rect.left - parentRect.left 
      });
  };

  const renderHighlights = () => {
    let lastIndex = 0;
    const elements = [];
    const sortedIssues = [...analysis.issues].sort((a, b) => a.start - b.start);

    sortedIssues.forEach((issue) => {
      if (issue.start < lastIndex) return;
      if (issue.start > lastIndex) elements.push(text.slice(lastIndex, issue.start));
      
      elements.push(
        <span 
          key={issue.id}
          className={`highlight ${issue.type === 'tone' ? 'tone' : 'error'}`}
          onClick={(e) => handleIssueInteraction(e, issue)}
          // Also trigger on hover if desired, but click is better for the card
          onMouseEnter={(e) => { /* Optional: Add hover logic here if you strictly want hover */ }}
        >
          {text.slice(issue.start, issue.end)}
        </span>
      );
      lastIndex = issue.end;
    });

    if (lastIndex < text.length) elements.push(text.slice(lastIndex));

    if (ghostText) {
        elements.push(
            <span key="ghost" className="ghost-text-anim" style={{ opacity: 0.6, color: 'var(--pop-violet)', pointerEvents: 'none', fontStyle: 'italic' }}>
                {ghostText} 
                <span style={{ fontSize:'0.6em', marginLeft: '8px', border:'1px solid var(--pop-violet)', borderRadius:'4px', padding:'1px 4px', verticalAlign: 'middle', opacity: 0.8 }}>TAB</span>
            </span>
        );
    }

    return elements;
  };

  return (
    // ADDED: "proofread-mode" class based on state
    <div className={`editor-wrapper ${mode === 'proofread' ? 'proofread-mode' : ''}`}>
      <div className="editor-toolbar">
        <div style={{display:'flex', gap:'10px'}}>
            <button className={`tool-btn ${mode === 'write' ? 'active' : ''}`} onClick={() => setMode('write')}>✏️ Write</button>
            <button className={`tool-btn ${mode === 'proofread' ? 'active' : ''}`} onClick={() => setMode('proofread')}>👁️ Proofread</button>
        </div>
        <div style={{fontSize:'0.85rem', color:'var(--text-muted)', fontWeight:600}}>
            {text.split(/\s+/).filter(w => w.length > 0).length} words
        </div>
      </div>

      <div className="editor-content">
        <div className="textarea-backdrop">
           {renderHighlights()}
        </div>

        <textarea
          ref={textareaRef}
          className="textarea-input"
          value={text}
          onChange={(e) => { setText(e.target.value); setGhostText(""); }}
          onKeyDown={handleKeyDown}
          placeholder="Start writing..."
          spellCheck="false"
          onScroll={(e) => { e.target.previousSibling.scrollTop = e.target.scrollTop; }}
          onMouseUp={handleMouseUp}
        />
        
        {children}
        
        {selection && (
          <MagicToolbar 
            position={selection.position} 
            selectedText={selection.text}
            onReplace={handleReplacement}
            onClose={() => setSelection(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Editor;