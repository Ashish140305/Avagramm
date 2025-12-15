import React from 'react';

const Sidebar = ({ analysis }) => {
  return (
    <aside className="sidebar">
      {/* Score Panel */}
      <div className="panel" style={{textAlign:'center'}}>
        <h3 style={{margin:'0 0 1rem 0'}}>Quality Score</h3>
        <div className="score-circle" style={{
          borderColor: analysis.score > 80 ? 'var(--success)' : 'var(--warning)',
          color: analysis.score > 80 ? 'var(--success)' : 'var(--warning)'
        }}>
          {analysis.score}
        </div>
        <p style={{color:'var(--text-muted)', fontSize:'0.9rem', marginTop:'1rem'}}>
          {analysis.score > 90 ? "Excellent!" : "Room for improvement"}
        </p>
      </div>

      {/* Tone Panel */}
      <div className="panel">
        <h3 style={{margin:'0 0 0.5rem 0'}}>Tone Detector</h3>
        <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap'}}>
          <span style={{
            background: 'var(--primary-light)', 
            color: 'var(--primary)',
            padding: '6px 12px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '600'
          }}>
            {analysis.tone}
          </span>
        </div>
      </div>

      {/* Premium Teaser */}
      <div className="panel" style={{position: 'relative', overflow: 'hidden'}}>
        <h3 style={{margin:'0 0 1rem 0'}}>Plagiarism</h3>
        <div style={{filter: 'blur(4px)', opacity: 0.5}}>
            <div style={{height:'10px', background:'#eee', width:'80%', marginBottom:'8px'}}></div>
            <div style={{height:'10px', background:'#eee', width:'60%', marginBottom:'8px'}}></div>
            <div style={{height:'10px', background:'#eee', width:'90%'}}></div>
        </div>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.4)'
        }}>
          <button className="btn-accept" style={{background: '#1f2937'}}>Unlock Premium</button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;