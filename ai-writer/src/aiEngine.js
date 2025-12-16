// src/aiEngine.js
import { pipeline } from '@xenova/transformers';

class AI {
  static toneModel = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';
  static rewriteModel = 'Xenova/flan-t5-small';
  
  static toneInstance = null;
  static rewriteInstance = null;

  static async getToneClassifier() {
    if (!this.toneInstance) {
      this.toneInstance = await pipeline('text-classification', this.toneModel);
    }
    return this.toneInstance;
  }

  static async getRewriter() {
    if (!this.rewriteInstance) {
      this.rewriteInstance = await pipeline('text2text-generation', this.rewriteModel);
    }
    return this.rewriteInstance;
  }
}

// --- 1. TONE ANALYSIS ---
export const analyzeTone = async (text) => {
  if (!text || text.length < 5) return { label: 'Neutral', score: 0 };

  const runFallback = () => {
    const vocab = {
        excited: ['amazing', 'awesome', 'love', 'fantastic', 'great', 'happy', 'excited', 'best', 'win', 'wow', '!!'],
        concerned: ['worry', 'afraid', 'urgent', 'error', 'fail', 'bad', 'sorry', 'hate', 'terrible', 'warning', 'risk'],
        friendly: ['hey', 'hello', 'thanks', 'cheers', 'help', 'welcome', 'friend', 'cool', 'nice', 'good'],
        serious: ['report', 'data', 'analysis', 'confirm', 'request', 'deadline', 'meeting', 'attached', 'ensure']
    };
    let scores = { excited: 0, concerned: 0, friendly: 0, serious: 0 };
    Object.keys(vocab).forEach(tone => vocab[tone].forEach(w => { if(text.toLowerCase().includes(w)) scores[tone]++; }));
    
    const winner = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    if (scores[winner] === 0) return { label: 'Neutral', score: 0 };
    return { label: winner.charAt(0).toUpperCase() + winner.slice(1), score: Math.min(60 + (scores[winner] * 10), 99) };
  };

  try {
    const classifier = await AI.getToneClassifier();
    const results = await classifier(text);
    const result = results[0];
    let displayLabel = 'Neutral';
    if (result.label === 'POSITIVE') displayLabel = text.includes('!') ? 'Excited' : 'Friendly';
    if (result.label === 'NEGATIVE') displayLabel = 'Concerned';
    return { label: displayLabel, score: Math.round(result.score * 100) };
  } catch (e) {
    return runFallback();
  }
};

// --- 2. AI REWRITE ---
export const aiRewrite = async (text, mode) => {
  const runFallback = () => {
      if (mode === 'formal') return text.replace(/can't/g, 'cannot').replace(/I'm/g, 'I am');
      if (mode === 'casual') return text.replace(/cannot/g, "can't").replace(/hello/g, 'hey');
      return text;
  };

  try {
    const rewriter = await AI.getRewriter();
    const prompt = `Rewrite to be ${mode}: ${text}`;
    const output = await rewriter(prompt, { max_new_tokens: 60, temperature: 0.9 });
    return output[0].generated_text;
  } catch (e) {
    return runFallback();
  }
};

// --- 3. AUTO-FORMAT (Enhanced Punctuation Fixer) ---
export const fixFormatting = async (text) => {
    // 1. ADVANCED RULE-BASED FIXER (Runs instantly)
    // This handles common punctuation errors without needing the heavy AI model
    const smartFix = (input) => {
        let res = input;
        
        // Capitalize first letter
        res = res.replace(/^\s*[a-z]/, c => c.toUpperCase());
        
        // Capitalize sentences after . ? !
        res = res.replace(/([.?!]\s+)([a-z])/g, (m, sep, char) => sep + char.toUpperCase());
        
        // Fix standalone 'i' -> 'I'
        res = res.replace(/\b(i)\b/g, 'I');
        // Fix 'im' -> "I'm"
        res = res.replace(/\b(im)\b/gi, "I'm");
        // Fix 'dont' -> "don't"
        res = res.replace(/\b(dont)\b/gi, "don't");
        // Fix 'cant' -> "can't"
        res = res.replace(/\b(cant)\b/gi, "can't");
        // Fix 'its' -> "it's" (context guessing: "its fun" -> "it's fun")
        res = res.replace(/\b(its)\s+(fun|cool|great|bad|hard|easy)\b/gi, "it's $2");

        // Add spaces after punctuation (word,word -> word, word)
        res = res.replace(/([,.;?!])([a-zA-Z])/g, '$1 $2');

        // Add comma before conjunctions (heuristic)
        // e.g. "fun but hard" -> "fun, but hard"
        res = res.replace(/([a-z])\s+(but|so|however|therefore)\s+([a-z])/g, '$1, $2 $3');

        // Add period at end if missing
        if (res.length > 5 && !/[.!?]$/.test(res.trim())) {
            res = res.trim() + '.';
        }
        
        return res;
    };

    // 2. Try AI First (if available)
    try {
        const rewriter = await AI.getRewriter();
        const snippet = text.slice(0, 512); 
        const output = await rewriter(`Fix punctuation: ${snippet}`, {
            max_new_tokens: 512,
            temperature: 0.5 
        });
        // If AI returns something drastically shorter (error), use fallback
        if (output[0].generated_text.length < text.length * 0.5) return smartFix(text);
        return output[0].generated_text;
    } catch (e) {
        console.warn("Auto-format AI offline, using smart rules.");
        return smartFix(text);
    }
};

// --- 4. SMART SYNONYMS ---
export const getSynonyms = (word) => {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    const thesaurus = {
        "good": ["excellent", "superb", "stellar", "admirable"],
        "bad": ["terrible", "atrocious", "unfavorable", "poor"],
        "happy": ["elated", "joyful", "content", "delighted"],
        "sad": ["despondent", "melancholy", "downcast", "sorrowful"],
        "big": ["massive", "colossal", "gigantic", "substantial"],
        "small": ["diminutive", "tiny", "petite", "minute"],
        "hard": ["difficult", "challenging", "arduous", "tough"]
    };
    return thesaurus[cleanWord] || [];
};