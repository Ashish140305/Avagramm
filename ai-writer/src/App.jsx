import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { analyzeText } from './mockAI';
import { downloadText, copyToClipboard } from './utils/export';

// Components
import Header from './components/Header';
import Editor from './components/Editor';
import Sidebar from './components/Sidebar';
import SuggestionCard from './components/SuggestionCard';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';

// --- ADDED: Dashboard Import ---
import Dashboard from './components/Dashboard';

// Icon for Toggle
const ChevronIcon = ({ collapsed }) => (
  <svg 
    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
  >
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

// --- The Document Editor Logic (Preserved) ---
const WriterApp = () => {
  // --- STATE ---
  
  // Dark Mode State (Persisted)
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('avagram_theme') === 'dark');

  // Documents State
  const [documents, setDocuments] = useState(() => {
    const savedDocs = localStorage.getItem('avagram_docs');
    const oldDraft = localStorage.getItem('avagram_draft');
    if (savedDocs) return JSON.parse(savedDocs);
    else if (oldDraft) return [{ id: 'doc_1', title: 'Recovered Draft', content: oldDraft, date: new Date().toISOString() }];
    else return [{ id: 'doc_1', title: 'Untitled Draft', content: "Start writing here...", date: new Date().toISOString() }];
  });

  const [activeDocId, setActiveDocId] = useState(() => {
    const savedDocs = localStorage.getItem('avagram_docs');
    if (savedDocs) { const docs = JSON.parse(savedDocs); return docs.length > 0 ? docs[0].id : null; }
    return 'doc_1'; 
  });

  const activeDoc = documents.find(d => d.id === activeDocId) || documents[0];
  const text = activeDoc ? activeDoc.content : "";

  // Analysis State
  const [dictionary, setDictionary] = useState(() => { const saved = localStorage.getItem('avagram_dict'); return saved ? JSON.parse(saved) : []; });
  const [analysis, setAnalysis] = useState({ issues: [], score: 100, tone: 'Neutral', toneScore: 0, wordCount: 0, readability: { grade: 0, readingTime: '0 min', level: 'N/A' } });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mode, setMode] = useState('write');
  const [activeIssue, setActiveIssue] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [toast, setToast] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // --- EFFECTS ---

  // Theme Effect
  useEffect(() => {
    if (isDarkMode) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
    localStorage.setItem('avagram_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Document Persistence
  useEffect(() => { localStorage.setItem('avagram_docs', JSON.stringify(documents)); }, [documents]);

  // Analysis Trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!text) return;
      setIsAnalyzing(true);
      // Safety check for mockAI
      if (typeof analyzeText === 'function') {
        analyzeText(text, dictionary).then(result => { setAnalysis(result); setIsAnalyzing(false); });
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [text, dictionary]);

  // --- ACTIONS ---

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleTextChange = (newText) => {
    setDocuments(prevDocs => prevDocs.map(doc => doc.id === activeDocId ? { ...doc, content: newText, date: new Date().toISOString() } : doc));
    setActiveIssue(null);
  };

  const createNewDoc = () => {
    const newId = `doc_${Date.now()}`;
    const newDoc = { id: newId, title: `Untitled ${documents.length + 1}`, content: "", date: new Date().toISOString() };
    setDocuments([newDoc, ...documents]); setActiveDocId(newId); setMode('write');
    showToast("New document created");
  };

  const duplicateDoc = (id, e) => {
    e.stopPropagation();
    const docToClone = documents.find(d => d.id === id);
    if (!docToClone) return;
    const newDoc = { ...docToClone, id: `doc_${Date.now()}`, title: `${docToClone.title} (Copy)`, date: new Date().toISOString() };
    const index = documents.findIndex(d => d.id === id);
    const newDocs = [...documents]; newDocs.splice(index + 1, 0, newDoc);
    setDocuments(newDocs); showToast("Document duplicated");
  };

  const deleteDoc = (id, e) => {
    e.stopPropagation();
    if (documents.length <= 1) { showToast("Cannot delete the last document"); return; }
    const newDocs = documents.filter(d => d.id !== id);
    setDocuments(newDocs);
    if (activeDocId === id) setActiveDocId(newDocs[0].id);
    showToast("Document deleted");
  };

  const renameDoc = (id, newTitle) => {
    if (!newTitle.trim()) return;
    setDocuments(prevDocs => prevDocs.map(doc => doc.id === id ? { ...doc, title: newTitle } : doc));
  };

  const switchDoc = (id) => { setActiveDocId(id); setMode('write'); setActiveIssue(null); };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const handleIssueClick = (iss, pos) => { setTooltipPos(pos); setActiveIssue(iss); };

  const acceptSuggestion = (newWord) => {
    const before = text.slice(0, activeIssue.start);
    const after = text.slice(activeIssue.end);
    handleTextChange(before + newWord + after);
    setAnalysis(prev => ({ ...prev, issues: prev.issues.filter(i => i.id !== activeIssue.id) }));
    setActiveIssue(null);
  };

  const addToDictionary = (word) => {
    const lowerWord = word.toLowerCase();
    if (dictionary.includes(lowerWord)) return;
    const newDict = [...dictionary, lowerWord];
    setDictionary(newDict); localStorage.setItem('avagram_dict', JSON.stringify(newDict));
    setAnalysis(prev => ({ ...prev, issues: prev.issues.filter(i => i.original.toLowerCase() !== lowerWord) }));
    setActiveIssue(null); showToast(`"${word}" added to dictionary`);
  };

  const removeFromDictionary = (word) => {
    const newDict = dictionary.filter(w => w !== word);
    setDictionary(newDict); localStorage.setItem('avagram_dict', JSON.stringify(newDict));
    showToast(`"${word}" removed`);
  };

  const handleFixAll = () => {
    if (!analysis.issues.length) return;
    const sortedIssues = [...analysis.issues].sort((a, b) => a.start - b.start);
    let newText = "", lastIndex = 0;
    sortedIssues.forEach(issue => {
        if (issue.start < lastIndex) return;
        newText += text.slice(lastIndex, issue.start) + issue.suggestion;
        lastIndex = issue.end;
    });
    newText += text.slice(lastIndex);
    handleTextChange(newText);
    setAnalysis(prev => ({ ...prev, issues: [] }));
    setActiveIssue(null);
    showToast("✨ Fixed all errors!");
  };

  return (
    <div className={`app-container ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="ambient-bg-layer"><div className="living-blob"></div></div>

      {/* Pass Theme Props to Header */}
      <Header isAnalyzing={isAnalyzing} text={text} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <Sidebar 
        documents={documents} activeDocId={activeDocId} onNewDoc={createNewDoc} onSwitchDoc={switchDoc} onDeleteDoc={deleteDoc} onRenameDoc={renameDoc} onDuplicateDoc={duplicateDoc}
        analysis={analysis} onFixAll={handleFixAll} dictionary={dictionary} onRemoveFromDict={removeFromDictionary} collapsed={isSidebarCollapsed}
      />

      <main style={{ height: '100%', position:'relative' }}>
        <Editor text={text} setText={handleTextChange} mode={mode} setMode={setMode} analysis={analysis} onIssueClick={handleIssueClick}>
          {activeIssue && mode === 'proofread' && (
            <SuggestionCard issue={activeIssue} position={tooltipPos} onAccept={acceptSuggestion} onDismiss={() => setActiveIssue(null)} onAddToDict={addToDictionary} />
          )}
        </Editor>
        <button className="sidebar-toggle" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} title={isSidebarCollapsed ? "Expand" : "Collapse"}>
           <ChevronIcon collapsed={isSidebarCollapsed} />
        </button>
      </main>

      {toast && <div className="toast-notification">{toast}</div>}
    </div>
  );
};

// --- Routing Configuration ---
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      
      {/* Route for the Document Editor */}
      <Route path="/app" element={<WriterApp />} />

      {/* ADDED: Route for the AI Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Catch-all redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;