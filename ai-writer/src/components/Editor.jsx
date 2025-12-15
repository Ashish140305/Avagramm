import React, { useRef, useState } from 'react';
import MagicToolbar from './MagicToolbar';

const Editor = ({ text, setText, mode, setMode, analysis, onIssueClick, children }) => {
  const textareaRef = useRef(null);
  const [selection, setSelection] = useState(null); // { start, end, text, position }

  // Handle Text Selection
  const handleSelect = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);

    if (selectedText.trim().length > 0) {
      // Calculate approximate pixel position for the toolbar
      // This is a simplified calculation relative to the textarea container
      // For a true WYSIWYG, we'd use getBoundingClientRect of a range, 
      // but for a textarea, we approximate or place near mouse.
      
      // Strategy: Place it centrally above the text area or use mouse coordinates if available.
      // To keep it clean, let's fix it near the top of the selection visually via a simple offset
      // or simply use the mouseup event coordinates.
    } else {
      setSelection(null);
    }
  };

  const handleMouseUp = (e) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);

    if (selectedText.trim().length > 0) {
      // Get positions relative to the editor wrapper
      const rect = textarea.getBoundingClientRect();
      // Use relative coordinates
      const left = e.clientX - rect.left; 
      const top = e.clientY - rect.top - 50; // 50px above cursor

      setSelection({
        start,
        end,
        text: selectedText,
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

  // --- Rendering Highlights (Same as before) ---
  const renderHighlights = () => {
    let lastIndex = 0;
    const elements = [];
    
    // Sort issues by start position
    const sortedIssues = [...analysis.issues].sort((a, b) => a.start - b.start);

    sortedIssues.forEach((issue) => {
      // Skip overlapping issues or issues out of bounds
      if (issue.start < lastIndex) return;

      // 1. Text before the issue
      if (issue.start > lastIndex) {
        elements.push(text.slice(lastIndex, issue.start));
      }

      // 2. The Issue itself
      elements.push(
        <span 
          key={issue.id}
          className={`highlight ${issue.type === 'tone' ? 'tone' : 'error'}`}
          onClick={(e) => {
             const rect = e.target.getBoundingClientRect();
             const parentRect = e.target.closest('.editor-wrapper').getBoundingClientRect();
             onIssueClick(issue, { 
                 top: rect.bottom - parentRect.top + 10, 
                 left: rect.left - parentRect.left 
             });
          }}
        >
          {text.slice(issue.start, issue.end)}
        </span>
      );

      lastIndex = issue.end;
    });

    // 3. Remaining text
    if (lastIndex < text.length) {
      elements.push(text.slice(lastIndex));
    }

    return elements;
  };

  return (
    <div className="editor-wrapper">
      {/* 1. Toolbar */}
      <div className="editor-toolbar">
        <div style={{display:'flex', gap:'10px'}}>
            <button 
                className={`tool-btn ${mode === 'write' ? 'active' : ''}`}
                onClick={() => setMode('write')}
            >
                ✏️ Write
            </button>
            <button 
                className={`tool-btn ${mode === 'proofread' ? 'active' : ''}`}
                onClick={() => setMode('proofread')}
            >
                👁️ Proofread
            </button>
        </div>
        <div style={{fontSize:'0.85rem', color:'var(--text-muted)', fontWeight:600}}>
            {text.split(/\s+/).filter(w => w.length > 0).length} words
        </div>
      </div>

      {/* 2. Text Area & Highlights */}
      <div className="editor-content">
        {/* Backdrop Layer (Highlights) */}
        <div className="textarea-backdrop">
           {renderHighlights()}
        </div>

        {/* Input Layer */}
        <textarea
          ref={textareaRef}
          className="textarea-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start writing..."
          spellCheck="false"
          onScroll={(e) => {
              // Sync scroll for backdrop
              e.target.previousSibling.scrollTop = e.target.scrollTop;
          }}
          onMouseUp={handleMouseUp}
        />
        
        {/* 3. Popups (Suggestion Card & Magic Toolbar) */}
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