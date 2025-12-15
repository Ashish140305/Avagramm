import React, { useState, useEffect, useRef } from 'react';

import { Routes, Route, Link } from 'react-router-dom';

import { analyzeText } from './mockAI';



// Components

import Header from './components/Header';

import Editor from './components/Editor';

import Sidebar from './components/Sidebar';

import SuggestionCard from './components/SuggestionCard';

import LandingPage from './components/LandingPage';

import LoginPage from './components/LoginPage'; // New Import



// --- WRITER APP (THE DASHBOARD) ---

const WriterApp = () => {

  const [text, setText] = useState("This is a verry good draft that I literally cant wait to send. It is very good.");

  const [analysis, setAnalysis] = useState({ issues: [], score: 100, tone: 'Neutral', wordCount: 0 });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [mode, setMode] = useState('write');

  const [activeIssue, setActiveIssue] = useState(null);

  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });



  useEffect(() => {

    const timer = setTimeout(() => {

      setIsAnalyzing(true);

      analyzeText(text).then(result => {

        setAnalysis(result);

        setIsAnalyzing(false);

      });

    }, 1000);

    return () => clearTimeout(timer);

  }, [text]);



  const handleTextChange = (newText) => {

    setText(newText);

    setActiveIssue(null);

  };



  const handleIssueClick = (issue, position) => {

    setTooltipPos(position);

    setActiveIssue(issue);

  };



  const acceptSuggestion = (newWord) => {

    const before = text.slice(0, activeIssue.start);

    const after = text.slice(activeIssue.end);

    setText(before + newWord + after);

    setActiveIssue(null);

    setMode('write');

  };



  return (

    <div className="app-container">

      {/* Header with Back Button */}

      <div className="app-header">

        <Link to="/" style={{textDecoration:'none', display:'flex', alignItems:'center', gap:'10px'}}>

           <span style={{fontSize:'1.2rem', background:'white', width:'32px', height:'32px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 5px rgba(0,0,0,0.1)'}}>←</span>

           <span className="logo">AI Writer</span>

        </Link>

       

        <div style={{background:'white', padding:'6px 12px', borderRadius:'20px', fontSize:'0.85rem', fontWeight:'600', boxShadow:'0 2px 5px rgba(0,0,0,0.05)'}}>

            {isAnalyzing ? (

               <span style={{color: '#9ca3af'}}>Analyzing...</span>

            ) : (

               <span style={{color: 'var(--success)'}}>✓ Up to date</span>

            )}

        </div>

      </div>



      {/* Main Editor */}

      <main style={{ height: '100%' }}>

        <Editor

          text={text}

          setText={handleTextChange}

          mode={mode}

          setMode={setMode}

          analysis={analysis}

          onIssueClick={handleIssueClick}

        >

          {activeIssue && mode === 'proofread' && (

            <SuggestionCard

              issue={activeIssue}

              position={tooltipPos}

              onAccept={acceptSuggestion}

              onDismiss={() => setActiveIssue(null)}

            />

          )}

        </Editor>

      </main>



      {/* Sidebar */}

      <Sidebar analysis={analysis} />

    </div>

  );

};



// --- MAIN ROUTER ---

function App() {

  return (

    <Routes>

      {/* Route 1: The Marketing Page */}

      <Route path="/" element={<LandingPage />} />

     

      {/* Route 2: The New Login Flow */}

      <Route path="/login" element={<LoginPage />} />

     

      {/* Route 3: The Actual App */}

      <Route path="/app" element={<WriterApp />} />

    </Routes>

  );

}



export default App;