// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, BookOpen, Zap, Trophy, Calendar, ArrowLeft, Crown } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ streak: 0, totalWords: 0, totalDocs: 0, topTone: 'Neutral' });
  const [vocab, setVocab] = useState([]);
  const [recentDocs, setRecentDocs] = useState([]);

  useEffect(() => {
    const savedDocs = JSON.parse(localStorage.getItem('avagram_docs') || '[]');
    const savedDict = JSON.parse(localStorage.getItem('avagram_dict') || '[]');
    setVocab(savedDict);
    setRecentDocs(savedDocs.slice(0, 3));

    let totalW = 0;
    const dates = new Set();
    savedDocs.forEach(doc => {
        const words = doc.content.split(/\s+/).filter(w => w.length > 0).length;
        totalW += words;
        if (doc.date) dates.add(new Date(doc.date).toISOString().split('T')[0]);
    });

    // Simple Streak Logic
    const today = new Date().toISOString().split('T')[0];
    const streak = dates.has(today) ? 1 : 0; // Simplified for now

    setStats({ streak, totalWords: totalW, totalDocs: savedDocs.length, topTone: 'Neutral' });
  }, []);

  const styles = {
    page: { padding: '2rem', maxWidth: '1200px', margin: '0 auto', animation: 'fadeIn 0.5s ease' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' },
    
    // FORCED COLORS FOR DARK MODE COMPATIBILITY
    card: {
      background: 'white',
      borderRadius: '24px',
      border: '3px solid #1a1a1a', // Hardcoded black border
      padding: '2rem',
      boxShadow: '8px 8px 0px rgba(0,0,0,0.1)',
      position: 'relative',
      overflow: 'hidden',
      color: '#1a1a1a' // Hardcoded black text
    },
    
    statBig: { fontSize: '4rem', fontWeight: '900', lineHeight: 1, color: '#1a1a1a' },
    statLabel: { fontSize: '1rem', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' },
    
    vocabGrid: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '1rem' },
    vocabChip: {
      background: '#c4b5fd', // Lavender
      color: '#000',
      padding: '8px 16px',
      borderRadius: '50px',
      fontWeight: '600',
      border: '2px solid #1a1a1a',
      fontSize: '0.9rem'
    },
    emptyState: { fontStyle: 'italic', color: '#999' }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
           <Link to="/app" style={{display:'flex', alignItems:'center', gap:'10px', textDecoration:'none', color:'inherit', fontWeight:'bold', marginBottom:'10px'}}>
             <ArrowLeft size={20}/> Back to Writer
           </Link>
           <h1 style={{fontSize:'3rem', margin:0}}>Your Stats</h1>
           <p style={{opacity: 0.7}}>Track your progress and growing vocabulary.</p>
        </div>
        <div style={{
            background: '#ff6b6b', color:'white', padding:'15px 30px', 
            borderRadius:'20px', border:'3px solid #1a1a1a',
            display:'flex', alignItems:'center', gap:'15px', boxShadow:'6px 6px 0px #1a1a1a'
        }}>
           <Zap size={32} fill="white" />
           <div>
              <div style={{fontWeight:'900', fontSize:'1.5rem'}}>{stats.streak} Day Streak</div>
              <div style={{fontSize:'0.8rem', opacity:0.9}}>Keep the flow going!</div>
           </div>
        </div>
      </header>

      <div style={styles.grid}>
         {/* CARD 1 */}
         <div style={styles.card}>
            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'2rem'}}>
                <Trophy size={32} color="#4ade80" />
                <h3>Lifetime Stats</h3>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem'}}>
                <div>
                    <div style={styles.statBig}>{stats.totalWords}</div>
                    <div style={styles.statLabel}>Words Written</div>
                </div>
                <div>
                    <div style={styles.statBig}>{stats.totalDocs}</div>
                    <div style={styles.statLabel}>Documents</div>
                </div>
            </div>
         </div>

         {/* CARD 2 */}
         <div style={styles.card}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <BookOpen size={32} color="#8b5cf6" />
                    <h3>Vocabulary Vault</h3>
                </div>
                <span style={{fontWeight:'bold', background:'#eee', padding:'4px 10px', borderRadius:'10px', color:'#000'}}>{vocab.length} Collected</span>
            </div>
            <div style={styles.vocabGrid}>
                {vocab.length > 0 ? vocab.map((word, i) => (
                    <span key={i} style={styles.vocabChip}>{word}</span>
                )) : (
                    <div style={styles.emptyState}>No words collected yet. Click "📖" on suggestions to add them here!</div>
                )}
            </div>
         </div>

         {/* CARD 3 */}
         <div style={styles.card}>
            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'1.5rem'}}>
                <Calendar size={32} color="orange" />
                <h3>Recent Drafts</h3>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                {recentDocs.map(doc => (
                    <Link to="/app" key={doc.id} style={{
                        textDecoration:'none', color:'#1a1a1a',
                        padding:'15px', border:'2px solid #eee', borderRadius:'12px',
                        display:'flex', justifyContent:'space-between', alignItems:'center',
                        transition:'all 0.2s'
                    }}>
                       <span style={{fontWeight:'600'}}>{doc.title}</span>
                       <span style={{fontSize:'0.8rem', color:'#999'}}>{new Date(doc.date).toLocaleDateString()}</span>
                    </Link>
                ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;