import React, { useState, useMemo } from 'react';
import './StatsModal.css';

// --- LOGIC ---
const getLogicalDate = () => {
  const now = new Date();
  if (now.getHours() < 4) now.setDate(now.getDate() - 1);
  return now.toISOString().split('T')[0];
};

const StatsModal = ({ isOpen, onClose }) => {
  const RANKS = [
    { title: "NOVICE", limit: 0 },
    { title: "ROOKIE", limit: 500 },
    { title: "PRO", limit: 2500 },
    { title: "VETERAN", limit: 10000 },
    { title: "LEGEND", limit: 50000 }
  ];

  const metrics = useMemo(() => {
    if (!isOpen) return null;

    const savedDocs = JSON.parse(localStorage.getItem('avagram_docs') || '[]');
    const savedDict = JSON.parse(localStorage.getItem('avagram_dict') || '[]');
    const savedBestStreak = parseInt(localStorage.getItem('avagram_best_streak') || '0');
    
    let totalW = 0;
    const dailyVolumes = {};
    const uniqueDates = new Set();
    
    savedDocs.forEach(doc => {
      const words = doc.content ? doc.content.split(/\s+/).filter(w => w.length > 0).length : 0;
      totalW += words;
      if (doc.date) {
        const dKey = new Date(doc.date).toISOString().split('T')[0];
        uniqueDates.add(dKey);
        dailyVolumes[dKey] = (dailyVolumes[dKey] || 0) + words;
      }
    });

    const today = getLogicalDate();
    let checkDate = new Date(today);
    if (!uniqueDates.has(today)) checkDate.setDate(checkDate.getDate() - 1);
    
    let loopStreak = 0;
    while (true) {
      if (uniqueDates.has(checkDate.toISOString().split('T')[0])) {
        loopStreak++; checkDate.setDate(checkDate.getDate() - 1);
      } else break;
    }

    let bestStreak = Math.max(savedBestStreak, loopStreak);
    if (bestStreak > savedBestStreak) {
      localStorage.setItem('avagram_best_streak', bestStreak.toString());
    }
    
    let currentRankIndex = RANKS.findIndex(r => totalW < r.limit) - 1;
    if (currentRankIndex < 0) currentRankIndex = RANKS.length - 1; 
    const rankObj = RANKS[currentRankIndex] || RANKS[0];
    const nextRankObj = RANKS[currentRankIndex + 1];
    let progress = 100;
    if (nextRankObj) {
      progress = ((totalW - rankObj.limit) / (nextRankObj.limit - rankObj.limit)) * 100;
    }

    const avgWords = uniqueDates.size > 0 ? Math.round(totalW / uniqueDates.size) : 0;

    const history = [];
    let maxVolInPeriod = 1;
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today); d.setDate(d.getDate() - i);
        const dKey = d.toISOString().split('T')[0];
        const vol = dailyVolumes[dKey] || 0;
        if (vol > maxVolInPeriod) maxVolInPeriod = vol;
        history.push({ 
            label: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
            vol: vol,
            isToday: i === 0
        });
    }

    return {
      streak: loopStreak, bestStreak, totalWords: totalW, avgWords,
      vocab: savedDict, rank: rankObj.title, 
      progress: Math.min(Math.max(progress, 0), 100), 
      history, maxVolInPeriod
    };
  }, [isOpen]);

  if (!isOpen || !metrics) return null;

  const getGrade = (val, type) => {
    if (type === 'streak') return val >= 10 ? 'S' : val >= 5 ? 'A' : val >= 3 ? 'B' : 'C';
    if (type === 'volume') return val > 5000 ? 'S' : val > 1000 ? 'A' : val > 500 ? 'B' : 'C';
    return 'D';
  };

  const streakGrade = getGrade(metrics.streak, 'streak');
  const volGrade = getGrade(metrics.totalWords, 'volume');

  return (
    <div className="scrapbook-overlay" onClick={onClose}>
      <div className="scrapbook-page" onClick={e => e.stopPropagation()}>
        
        {/* Visual Chaos Elements */}
        <div className="paper-clip"></div>
        <div className="torn-tape"></div>
        
        <button className="comic-close" onClick={onClose}>✕</button>

        {/* HEADER: Wobbly Box */}
        <div className="hand-drawn-box header-box">
            <h1 className="comic-title">AGENT RECORD</h1>
            <div className="rank-tag">{metrics.rank}</div>
        </div>

        {/* MAIN CONTENT: Free Flowing */}
        <div className="scrapbook-body">
            
            {/* LEFT: Consistency Polaroid */}
            <div className="polaroid-card tilt-left">
                <div className="polaroid-image-area">
                    <span className="big-stat">{metrics.streak}</span>
                    <span className="stat-label">DAY STREAK</span>
                    {metrics.streak >= metrics.bestStreak && metrics.streak > 0 && 
                        <span className="sticker-badge">NEW RECORD!</span>
                    }
                </div>
                {/* Comic Burst for Grade */}
                <div className="comic-burst grade-pos-1">
                    <span className="burst-grade">{streakGrade}</span>
                </div>
                <div className="polaroid-caption">
                    Best: {metrics.bestStreak} Days
                </div>
            </div>

            {/* RIGHT: Output Sticky Note */}
            <div className="sticky-note tilt-right">
                <div className="pin"></div>
                <span className="note-title">TOTAL INTEL</span>
                <div className="note-content">
                    <span className="hand-stat">{(metrics.totalWords / 1000).toFixed(1)}k</span>
                    <span className="hand-unit">Words</span>
                </div>
                <div className="comic-burst grade-pos-2">
                    <span className="burst-grade">{volGrade}</span>
                </div>
                <div className="note-footer">
                    Avg: {metrics.avgWords} / day
                </div>
            </div>

        </div>

        {/* BOTTOM: Sketchy Histogram */}
        <div className="sketch-area">
            <span className="sketch-label">ACTIVITY LOG (7 DAYS)</span>
            <div className="sketch-bars">
                {metrics.history.map((day, i) => {
                    const heightPct = (day.vol / (metrics.maxVolInPeriod || 1)) * 100;
                    return (
                        <div key={i} className="sketch-col">
                            <div className="sketch-bar-track">
                                <div 
                                    className={`sketch-bar-fill ${day.isToday ? 'filled-black' : 'filled-hatch'}`} 
                                    style={{height: `${Math.max(heightPct, 10)}%`}}
                                ></div>
                            </div>
                            <span className="sketch-day">{day.label}</span>
                        </div>
                    )
                })}
            </div>
        </div>

        {/* FOOTER: Comments */}
        <div className="comments-bubble">
            <p>
                {metrics.vocab.length > 0 ? (
                    <>New Assets: {metrics.vocab.slice(0, 4).map((w,i) => <span key={i} className="highlight-word">{w}</span>)}</>
                ) : (
                    "No new assets found."
                )}
            </p>
        </div>

      </div>
    </div>
  );
};

export default StatsModal;