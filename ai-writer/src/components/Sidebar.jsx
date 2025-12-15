import React, { useState, useEffect, useRef } from 'react';

// Icons
const Icons = {
  Wand: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2l3 3-3 3"></path><path d="M15 5l-8 8"></path><path d="M9 13l-6 6"></path></svg>,
  Face: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>,
  Book: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
  Eye: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
  Folder: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>,
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
  Edit: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
  Copy: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
};

const timeAgo = (dateString) => {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "Just now";
};

const Sidebar = ({ 
  documents, activeDocId, onNewDoc, onSwitchDoc, onDeleteDoc, onRenameDoc, onDuplicateDoc,
  analysis, onFixAll, dictionary, onRemoveFromDict, collapsed 
}) => {
  const [showDict, setShowDict] = useState(false);
  const [editingDocId, setEditingDocId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingDocId && inputRef.current) {
        inputRef.current.focus();
    }
  }, [editingDocId]);

  const startEditing = (doc, e) => {
    e.stopPropagation();
    setEditingDocId(doc.id);
    setEditTitle(doc.title);
  };

  const saveTitle = () => {
    if (editingDocId) {
        onRenameDoc(editingDocId, editTitle);
        setEditingDocId(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') saveTitle();
    if (e.key === 'Escape') setEditingDocId(null);
  };

  return (
    <aside className={`sidebar ${collapsed ? 'slim' : ''}`}>
      
      {/* 1. DOCUMENT MANAGER */}
      <div className="panel" title="My Documents" style={{maxHeight: '350px', display:'flex', flexDirection:'column'}}>
         {!collapsed ? (
             <>
                <div className="sidebar-header">
                    <h3>Documents</h3>
                    <button onClick={onNewDoc} title="New Draft" className="icon-btn-round">
                        <Icons.Plus />
                    </button>
                </div>
                <div className="doc-list">
                    {documents.map(doc => (
                        <div 
                            key={doc.id}
                            onClick={() => onSwitchDoc(doc.id)}
                            className={`doc-item ${doc.id === activeDocId ? 'active' : ''}`}
                        >
                            {editingDocId === doc.id ? (
                                <input 
                                    ref={inputRef}
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    onBlur={saveTitle}
                                    onKeyDown={handleKeyDown}
                                    onClick={(e) => e.stopPropagation()}
                                    className="rename-input"
                                />
                            ) : (
                                <div className="doc-row">
                                    <span className="doc-title">{doc.title}</span>
                                    
                                    <div className="doc-actions">
                                        <button onClick={(e) => startEditing(doc, e)} title="Rename"><Icons.Edit /></button>
                                        <button onClick={(e) => onDuplicateDoc(doc.id, e)} title="Duplicate"><Icons.Copy /></button>
                                        <button onClick={(e) => onDeleteDoc(doc.id, e)} title="Delete" className="delete-btn"><Icons.Trash /></button>
                                    </div>
                                </div>
                            )}
                            
                            <div className="doc-meta">
                                <span>{timeAgo(doc.date)}</span>
                                <span>•</span>
                                <span>{doc.content ? doc.content.split(/\s+/).length : 0} words</span>
                            </div>
                        </div>
                    ))}
                </div>
             </>
         ) : (
             <div className="slim-icon"><Icons.Folder /></div>
         )}
      </div>

      {/* 2. Score Panel */}
      <div className="panel" title="Quality Score">
        {!collapsed && <h3 style={{margin:'0 0 1rem 0'}}>Quality Score</h3>}
        <div className="score-circle">
          {analysis.score}
        </div>
      </div>

      {/* 3. Quick Actions */}
      <div className="panel" onClick={collapsed ? onFixAll : undefined} style={{cursor: collapsed ? 'pointer' : 'default'}} title="Fix All">
         {!collapsed ? (
             <>
                <h3 style={{margin:'0 0 0.5rem 0'}}>Quick Actions</h3>
                {analysis.issues.length > 0 ? (
                    <button onClick={onFixAll} className="btn-blob fix-all-btn">
                        ✨ Fix {analysis.issues.length} Errors
                    </button>
                ) : (
                    <div className="no-issues">🎉 No issues!</div>
                )}
             </>
         ) : (
             <div className="slim-icon" style={{color: analysis.issues.length > 0 ? 'var(--pop-coral)' : 'var(--pop-mint)'}}>
                 <Icons.Wand />
             </div>
         )}
      </div>

      {/* 4. Tone Panel */}
      <div className="panel" title={`Tone: ${analysis.tone}`}>
        {!collapsed ? (
           <>
            <h3 style={{margin:'0 0 0.5rem 0'}}>Tone Analysis</h3>
            <div className="tone-header">
               <span className="tone-label">{analysis.tone}</span>
               <span className="tone-score">{analysis.toneScore}%</span>
            </div>
            <div className="progress-bar-bg">
               <div className="progress-bar-fill" style={{width: `${analysis.toneScore}%`}}></div>
            </div>
           </>
        ) : (
           <div className="slim-icon" style={{color: 'var(--pop-violet)'}}>
               <Icons.Face />
           </div>
        )}
      </div>

      {/* 5. Readability Panel */}
      <div className="panel" title={`Grade: ${analysis.readability?.grade}`}>
        {!collapsed ? (
            <>
                <h3 style={{margin:'0 0 1rem 0'}}>Readability</h3>
                <div className="readability-grid">
                    <div className="stat-box">
                        <div className="stat-value">{analysis.readability?.grade || 0}</div>
                        <div className="stat-label">Grade</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-value">{parseInt(analysis.readability?.readingTime) || "<1"}</div>
                        <div className="stat-label">Min</div>
                    </div>
                </div>
            </>
        ) : (
            <div className="slim-icon"><Icons.Eye /></div>
        )}
      </div>

      {/* 6. Dictionary Panel */}
      <div className="panel" title="Dictionary">
         {!collapsed ? (
             <>
                <div onClick={() => setShowDict(!showDict)} className="dict-header">
                    <h3>My Dictionary</h3>
                    <span className="badge">{dictionary.length}</span>
                </div>
                {showDict && (
                    <div className="dict-list">
                        <div style={{display:'flex', flexWrap:'wrap', gap:'5px'}}>
                            {dictionary.map(word => (
                                <span key={word} className="dict-pill">
                                    {word} 
                                    <button onClick={() => onRemoveFromDict(word)}>×</button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}
             </>
         ) : (
             <div className="slim-icon"><Icons.Book /></div>
         )}
      </div>

    </aside>
  );
};

export default Sidebar;