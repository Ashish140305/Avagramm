// A simple dictionary-based AI simulation
const MOCK_ISSUES = [
  { word: "thier", type: "spelling", suggestion: "their", reason: "Spelling error" },
  { word: "recieve", type: "spelling", suggestion: "receive", reason: "Spelling error" },
  { word: "very good", type: "clarity", suggestion: "excellent", reason: "Weak vocabulary" },
  { word: "literally", type: "tone", suggestion: "virtually", reason: "Informal tone" },
  { word: "happy", type: "vocabulary", suggestion: "elated", reason: "Enhance description" },
  { word: "cant", type: "grammar", suggestion: "can't", reason: "Missing apostrophe" },
];

export const analyzeText = async (text) => {
  // Simulate API Network Latency (500ms - 1500ms)
  const delay = Math.floor(Math.random() * 1000) + 500;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const issues = [];
      const lowerText = text.toLowerCase();
      
      MOCK_ISSUES.forEach((rule) => {
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

      // Calculate mock scores
      const score = Math.max(100 - (issues.length * 5), 0);
      let tone = "Neutral";
      if (text.includes("!")) tone = "Excited";
      if (text.length > 50 && issues.length === 0) tone = "Professional";

      resolve({
        issues,
        score,
        tone,
        wordCount: text.split(/\s+/).filter(w => w.length > 0).length,
        charCount: text.length
      });
    }, delay);
  });
};