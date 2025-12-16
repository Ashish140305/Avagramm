// src/mockAI.js
import { analyzeTone } from './aiEngine';
import { calculateReadability } from './utils/readability';
import { checkGrammar } from './services/grammarService'; 

// --- REWRITE SIMULATION (Same as before) ---
export const rewriteText = async (text, mode) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = text;
      // Simple heuristic simulation
      if (mode === 'formal') {
        result = text.replace(/can't/g, 'cannot').replace(/I'm/g, 'I am').replace(/really/g, 'significantly');
      } else if (mode === 'casual') {
        result = text.replace(/cannot/g, "can't").replace(/excellent/g, 'awesome');
      } else if (mode === 'concise') {
        result = text.replace(/very /g, '').replace(/really /g, '');
      }
      // Dummy variation if no match
      if (result === text) {
         if (mode === 'formal') result = `It is imperative that ${text}`;
         if (mode === 'casual') result = `Just wanted to say, ${text}`;
         if (mode === 'concise') result = text.split(' ').slice(0, Math.ceil(text.split(' ').length * 0.8)).join(' ');
      }
      resolve(result);
    }, 600);
  });
};

// --- MAIN ANALYSIS FUNCTION ---
export const analyzeText = async (text, userDictionary = []) => {
  return new Promise(async (resolve) => {
    
    // 1. Run Tone Analysis (Real or Simulation)
    let toneData = { label: "Neutral", score: 0 };
    
    // Only analyze if we have enough text
    if (text && text.length > 5) {
       try {
         toneData = await analyzeTone(text);
       } catch (err) {
         console.warn("Tone analysis failed:", err);
       }
    }

    // 2. Run Grammar Check
    let issues = [];
    try {
      issues = await checkGrammar(text);
      if (userDictionary.length > 0) {
        issues = issues.filter(issue => !userDictionary.includes(issue.original.toLowerCase()));
      }
    } catch (e) {
      console.warn("Grammar check failed.");
    }

    // 3. Run Readability
    let readability = { grade: 0, readingTime: "0 min", level: "N/A" };
    try {
      readability = calculateReadability(text);
    } catch (e) { /* ignore */ }
    
    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    const score = Math.max(100 - (issues.length * 5), 0);

    resolve({
      issues,
      score,
      tone: toneData.label,
      toneScore: toneData.score,
      wordCount,
      readability,
      charCount: text.length
    });
  });
};