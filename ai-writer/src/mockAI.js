import { analyzeTone } from './aiEngine';
import { calculateReadability } from './utils/readability';

const MOCK_ISSUES = [
  { word: "verry", type: "spelling", suggestion: "very", reason: "Spelling error" },
  { word: "thier", type: "spelling", suggestion: "their", reason: "Spelling error" },
  { word: "recieve", type: "spelling", suggestion: "receive", reason: "Spelling error" },
  { word: "teh", type: "spelling", suggestion: "the", reason: "Spelling error" },
  { word: "adress", type: "spelling", suggestion: "address", reason: "Spelling error" },
  { word: "seperate", type: "spelling", suggestion: "separate", reason: "Spelling error" },
  { word: "occured", type: "spelling", suggestion: "occurred", reason: "Spelling error" },
  { word: "untill", type: "spelling", suggestion: "until", reason: "Spelling error" },
  { word: "alot", type: "spelling", suggestion: "a lot", reason: "Spelling error" },
  { word: "wich", type: "spelling", suggestion: "which", reason: "Spelling error" },
  { word: "cant", type: "grammar", suggestion: "can't", reason: "Missing apostrophe" },
  { word: "dont", type: "grammar", suggestion: "don't", reason: "Missing apostrophe" },
  { word: "wont", type: "grammar", suggestion: "won't", reason: "Missing apostrophe" },
  { word: "im", type: "grammar", suggestion: "I'm", reason: "Missing apostrophe" },
  { word: "doesnt", type: "grammar", suggestion: "doesn't", reason: "Missing apostrophe" },
  { word: "its a", type: "grammar", suggestion: "it's a", reason: "Missing apostrophe" },
  { word: "very good", type: "clarity", suggestion: "excellent", reason: "Weak vocabulary" },
  { word: "really bad", type: "clarity", suggestion: "terrible", reason: "Weak vocabulary" },
  { word: "happy", type: "vocabulary", suggestion: "elated", reason: "Enhance description" },
  { word: "sad", type: "vocabulary", suggestion: "despondent", reason: "Enhance description" },
  { word: "literally", type: "tone", suggestion: "virtually", reason: "Avoid overuse" },
  { word: "basically", type: "tone", suggestion: "essentially", reason: "Filler word" },
];

// --- NEW FUNCTION: MAGIC REWRITE ---
export const rewriteText = async (text, mode) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple heuristic simulation for the demo
      let result = text;
      
      if (mode === 'formal') {
        result = text.replace(/can't/g, 'cannot')
                     .replace(/I'm/g, 'I am')
                     .replace(/really/g, 'significantly')
                     .replace(/buy/g, 'purchase')
                     .replace(/bad/g, 'unfavorable');
      } else if (mode === 'casual') {
        result = text.replace(/cannot/g, "can't")
                     .replace(/excellent/g, 'awesome')
                     .replace(/hello/gi, 'hey')
                     .replace(/regards/gi, 'cheers');
      } else if (mode === 'concise') {
        result = text.replace(/very /g, '')
                     .replace(/really /g, '')
                     .replace(/literally /g, '')
                     .replace(/basically /g, '')
                     .replace(/in order to/g, 'to');
      }
      
      // If no regex matched, return a dummy variation to ensure UI feedback
      if (result === text) {
         if (mode === 'formal') result = `It is imperative that ${text}`;
         if (mode === 'casual') result = `Just wanted to say, ${text}`;
         if (mode === 'concise') result = text.split(' ').slice(0, Math.ceil(text.split(' ').length * 0.8)).join(' ');
      }

      resolve(result);
    }, 600); // Small delay for "thinking" feel
  });
};

export const analyzeText = async (text, userDictionary = []) => {
  const delay = Math.floor(Math.random() * 500) + 200;
  return new Promise(async (resolve) => {
    let toneData = { label: "Neutral", score: 0 };
    if (text.length > 15) {
       try {
         toneData = await analyzeTone(text);
       } catch (err) {
         console.warn("AI Engine not ready, defaulting to Neutral");
       }
    }

    setTimeout(() => {
      const issues = [];
      MOCK_ISSUES.forEach((rule) => {
        if (userDictionary.includes(rule.word.toLowerCase())) return;
        let regex = new RegExp(`\\b${rule.word}\\b`, 'gi');
        let match;
        while ((match = regex.exec(text)) !== null) {
          issues.push({
            id: Math.random().toString(36).substr(2, 9),
            start: match.index,
            end: match.index + rule.word.length,
            original: match[0],
            ...rule
          });
        }
      });

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
    }, delay);
  });
};