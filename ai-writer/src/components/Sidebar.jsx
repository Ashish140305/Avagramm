// src/components/Sidebar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import StatsModal from './StatsModal';
import './Sidebar.css';

// ... (KEEP ALL ICONS AND HELPER FUNCTIONS SAME AS BEFORE) ...
// --- ICONS ---
const Icons = {
  Wand: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2l3 3-3 3"></path><path d="M15 5l-8 8"></path><path d="M9 13l-6 6"></path></svg>,
  Face: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>,
  Book: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
  Eye: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
  Folder: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>,
  Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
  Edit: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
  Copy: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>,
  Stats: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10"></path><path d="M12 20V4"></path><path d="M6 20v-6"></path></svg>,
  Pen: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>,
  Star: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
  Warning: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
};

const timeAgo = (dateString) => {
    if (!dateString) return "New";
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    let interval = seconds / 31536000; if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000; if (interval > 1) return Math.floor(interval) + "mo";
    interval = seconds / 86400; if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600; if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60; if (interval > 1) return Math.floor(interval) + "m";
    return "Just now";
};

const getToneSpectrum = (tone) => {
    const t = (tone || 'neutral').toLowerCase();
    let formal = 50; 
    let positivity = 50; 
    if (t.includes('professional') || t.includes('serious') || t.includes('formal')) {
        formal = 85; positivity = 40;
    } else if (t.includes('casual') || t.includes('friendly')) {
        formal = 20; positivity = 70;
    } else if (t.includes('excited') || t.includes('joy')) {
        formal = 30; positivity = 90;
    } else if (t.includes('angry') || t.includes('concerned')) {
        formal = 60; positivity = 15;
    }
    return { formal, positivity };
};

const Sidebar = ({ 
  documents, activeDocId, onNewDoc, onSwitchDoc, onDeleteDoc, onRenameDoc, onDuplicateDoc,
  analysis, onFixAll, onAutoFormat, dictionary, onRemoveFromDict, collapsed 
}) => {
  const [showDict, setShowDict] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [editingDocId, setEditingDocId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [docToDelete, setDocToDelete] = useState(null); // DELETE STATE
  const inputRef = useRef(null);

  const getToneColor = (tone) => {
      const t = (tone || 'neutral').toLowerCase();
      if (t.includes('excited') || t.includes('happy')) return 'var(--pop-yellow)';
      if (t.includes('professional') || t.includes('formal')) return 'var(--pop-violet)';
      if (t.includes('friendly') || t.includes('casual')) return 'var(--pop-mint)';
      if (t.includes('concerned') || t.includes('urgent')) return 'var(--pop-coral)';
      return 'var(--text-muted)';
  };
  
  const currentTone = analysis.tone || 'Neutral';
  const toneColor = getToneColor(currentTone);
  const spectrum = getToneSpectrum(currentTone);

  useEffect(() => {
    if (editingDocId && inputRef.current) { inputRef.current.focus(); }
  }, [editingDocId]);

  const startEditing = (doc, e) => { e.stopPropagation(); setEditingDocId(doc.id); setEditTitle(doc.title); };
  const saveTitle = () => { if (editingDocId) { onRenameDoc(editingDocId, editTitle); setEditingDocId(null); } };
  const handleKeyDown = (e) => { if (e.key === 'Enter') saveTitle(); if (e.key === 'Escape') setEditingDocId(null); };

  const getScoreColor = (score) => {
      if(score >= 90) return 'var(--pop-mint)'; 
      if(score >= 70) return 'var(--pop-yellow)'; 
      return 'var(--pop-coral)'; 
  };

  // --- DELETE LOGIC (FIXED) ---
  const requestDelete = (doc, e) => {
      e.stopPropagation();
      setDocToDelete(doc);
  };
  
  const confirmDelete = (e) => {
      if(e) e.stopPropagation();
      if (docToDelete) {
          // PASS A DUMMY EVENT to prevent crashes if parent expects 'e'
          onDeleteDoc(docToDelete.id, { stopPropagation: () => {} });
          setDocToDelete(null);
      }
  };

  const cancelDelete = (e) => {
      if(e) e.stopPropagation();
      setDocToDelete(null);
  };

  return (
    <aside className={`sidebar ${collapsed ? 'slim' : ''}`}>
      
      {/* 1. DOCUMENT MANAGER */}
      <div className="panel doc-panel" title="My Documents">
         <div className="sidebar-header">
             <h3>DOCUMENTS</h3>
         </div>
         <button className="fresh-sheet-btn" onClick={onNewDoc}>
            <Icons.Plus />
            <span>FRESH SHEET</span>
         </button>
         <div className="doc-list-wrapper">
             <div className="doc-list">
                 {documents.map(doc => (
                     <div key={doc.id} onClick={() => onSwitchDoc(doc.id)} className={`doc-item ${doc.id === activeDocId ? 'active' : ''}`}>
                         {editingDocId === doc.id ? (
                             <input ref={inputRef} value={editTitle} onChange={(e) => setEditTitle(e.target.value)} onBlur={saveTitle} onKeyDown={handleKeyDown} onClick={(e) => e.stopPropagation()} className="rename-input"/>
                         ) : (
                             <div className="doc-row">
                                 <div style={{display:'flex', flexDirection:'column', gap:'2px'}}>
                                     <span className="doc-title">{doc.title}</span>
                                     <span className="doc-meta">{timeAgo(doc.date)}</span>
                                 </div>
                                 <div className="doc-actions">
                                     <button className="action-icon edit" onClick={(e) => startEditing(doc, e)} title="Rename"><Icons.Edit /></button>
                                     <button className="action-icon copy" onClick={(e) => onDuplicateDoc(doc.id, e)} title="Duplicate"><Icons.Copy /></button>
                                     {/* DELETE TRIGGER */}
                                     <button className="action-icon trash" onClick={(e) => requestDelete(doc, e)} title="Delete"><Icons.Trash /></button>
                                 </div>
                             </div>
                         )}
                     </div>
                 ))}
             </div>
         </div>
         <div className="collapsed-icon" onClick={onNewDoc} style={{cursor:'pointer'}}><Icons.Folder /></div>
      </div>

      {/* 2. QUALITY SCORE */}
      <div className="panel score-panel" title={`Quality Score: ${analysis.score}`}>
        <h3>QUALITY</h3>
        <div className="score-stamp-container">
            <div 
                className="score-stamp"
                style={{ color: getScoreColor(analysis.score), borderColor: getScoreColor(analysis.score) }}
            >
                <div className="score-value">{analysis.score}</div>
                <div className="score-label">GRADE</div>
            </div>
        </div>
        <div className="collapsed-icon score-number" style={{color: getScoreColor(analysis.score)}}>
            {analysis.score}
        </div>
      </div>

      {/* 3. ACTIONS */}
      <div 
        className="panel action-panel" 
        title="Quick Actions"
        onClick={() => collapsed && onFixAll()}
      >
         <h3>ACTIONS</h3>
         <div className="action-content" style={{display:'flex', flexDirection:'column', gap:'12px'}}>
             {analysis.issues.length > 0 ? (
                 <button className="retro-btn primary" onClick={onFixAll}>
                    <Icons.Wand /> <span>FIX ISSUES ({analysis.issues.length})</span>
                 </button>
             ) : (
                 <div className="no-issues-retro">
                    <span>✓ NO ERRORS</span>
                 </div>
             )}
             <button className="retro-btn secondary" onClick={onAutoFormat}>
                <Icons.Pen /> <span>FORMAT TEXT</span>
             </button>
         </div>
         <div className="collapsed-icon" style={{color: 'var(--pop-violet)', cursor: 'pointer'}}>
             <Icons.Wand />
         </div>
      </div>

      {/* 4. TONE PANEL */}
      <div className="panel tone-panel" title={`Tone: ${analysis.tone}`}>
        <h3>TONE</h3>
        <div className="tone-content">
            <div className="tone-stamp" style={{ color: toneColor, borderColor: toneColor }}>
                {analysis.tone || 'Neutral'}
            </div>
            <div className="spectrum-row">
                <div className="spectrum-labels-retro">
                    <span>CASUAL</span>
                    <span>FORMAL</span>
                </div>
                <div className="spectrum-ruler">
                    <div className="spectrum-pin" style={{ left: `${spectrum.formal}%`, backgroundColor: toneColor }}></div>
                </div>
            </div>
            <div className="spectrum-row">
                <div className="spectrum-labels-retro">
                    <span>FACTS</span>
                    <span>FEELING</span>
                </div>
                <div className="spectrum-ruler">
                    <div className="spectrum-pin" style={{ left: `${spectrum.positivity}%`, backgroundColor: toneColor }}></div>
                </div>
            </div>
        </div>
        <div className="collapsed-icon" style={{color: toneColor}}>
            <Icons.Face />
        </div>
      </div>

      {/* 5. READABILITY */}
      <div className="panel read-panel" title={`Readability: Grade ${analysis.readability?.grade}`}>
        <h3>READABILITY</h3>
        <div className="readability-grid">
            <div className="ledger-box">
                <div className="ledger-label">GRADE</div>
                <div className="ledger-value">{analysis.readability?.grade || 0}</div>
            </div>
            <div className="ledger-box">
                <div className="ledger-label">MINUTES</div>
                <div className="ledger-value">{parseInt(analysis.readability?.readingTime) || "<1"}</div>
            </div>
        </div>
        <div className="collapsed-icon"><Icons.Eye /></div>
      </div>

      {/* 6. DICTIONARY */}
      <div 
        className="panel dict-panel" 
        title="Dictionary" 
        onClick={() => setShowDict(!showDict)} 
        style={{cursor:'pointer'}}
      >
         <div className="dict-header">
             <h3>DICTIONARY</h3>
             <span className="badge-retro">{dictionary.length}</span>
         </div>
         {showDict && (
             <div className="dict-content" onClick={(e) => e.stopPropagation()}> 
                 {dictionary.length === 0 ? <div style={{fontSize:'0.8rem', color:'#999', marginTop:'10px', fontFamily:'Courier New'}}>EMPTY</div> : (
                     <div className="dict-chips">
                         {dictionary.map(word => (
                             <span key={word} className="label-chip">
                                 {word} <button onClick={() => onRemoveFromDict(word)}>×</button>
                             </span>
                         ))}
                     </div>
                 )}
             </div>
         )}
         <div className="collapsed-icon"><Icons.Book /></div>
      </div>

      {/* 7. DASHBOARD LINK */}
      <div className="panel dash-link" title="View Report" onClick={() => setShowStats(true)}>
         <div className="dash-content">
             <Icons.Stats />
             <span>Stats</span>
         </div>
         <div className="collapsed-icon"><Icons.Stats /></div>
      </div>
      
      {/* --- CONFIRM DELETE ALERT (RETRO) --- */}
      {docToDelete && (
          <div className="delete-overlay" onClick={cancelDelete}>
              <div className="delete-modal-retro" onClick={(e) => e.stopPropagation()}>
                  <div className="delete-header">
                      <Icons.Warning />
                      <span>CONFIRM DELETION</span>
                  </div>
                  <p>Permanently shred "<strong>{docToDelete.title}</strong>"?</p>
                  <div className="delete-actions">
                      <button className="retro-btn secondary" onClick={cancelDelete}>CANCEL</button>
                      <button className="retro-btn primary delete-confirm-btn" onClick={confirmDelete}>SHRED IT</button>
                  </div>
              </div>
          </div>
      )}

      <StatsModal isOpen={showStats} onClose={() => setShowStats(false)} />

    </aside>
  );
};

export default Sidebar;