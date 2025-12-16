// src/services/grammarService.js

const API_URL = 'https://api.languagetool.org/v2/check';

export const checkGrammar = async (text) => {
  if (!text || text.trim().length === 0) return [];

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        text: text,
        language: 'en-US',
        enabledOnly: 'false'
      })
    });

    const data = await response.json();

    // Transform LanguageTool response to match our App's "Issue" format
    return data.matches.map(match => ({
      id: `err_${Math.random().toString(36).substr(2, 9)}`,
      start: match.offset,
      end: match.offset + match.length,
      original: text.slice(match.offset, match.offset + match.length),
      suggestion: match.replacements && match.replacements.length > 0 
        ? match.replacements[0].value 
        : null,
      type: mapRuleToType(match.rule.issueType),
      reason: match.message,
      ruleId: match.rule.id
    }));

  } catch (error) {
    console.error("Grammar Check Error:", error);
    return [];
  }
};

// Helper to map LanguageTool categories to our colors/types
const mapRuleToType = (ltType) => {
  switch (ltType) {
    case 'misspelling': return 'spelling';
    case 'style': return 'clarity';
    case 'typographical': return 'grammar';
    case 'uncategorized': return 'tone';
    default: return 'grammar';
  }
};