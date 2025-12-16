// src/services/autocompleteService.js
import { pipeline } from '@xenova/transformers';

class TextGenModel {
  static task = 'text-generation';
  static model = 'Xenova/tiny-random-gpt2';
  static instance = null;

  static async getInstance() {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, this.model);
    }
    return this.instance;
  }
}

export const predictNextWords = async (text) => {
  // --- 1. SIMULATION MODE (Debug) ---
  // This bypasses the AI so you can see the UI working immediately.
  const lower = text.toLowerCase().trim();
  
  if (lower.endsWith("the weather today is")) return " sunny and bright.";
  if (lower.endsWith("i am writing a")) return " new story.";
  if (lower.endsWith("once upon a")) return " time in a land.";
  if (lower.endsWith("hello")) return " world.";

  // --- 2. REAL AI (With Fallback) ---
  try {
    const context = text.slice(-50);
    if (!context.trim()) return "";

    const generator = await TextGenModel.getInstance();
    const output = await generator(context, {
      max_new_tokens: 5,
      temperature: 0.7,
      do_sample: true,
      top_k: 5
    });

    const generatedText = output[0].generated_text;
    const newText = generatedText.substring(context.length);
    return newText.split('\n')[0]; 

  } catch (err) {
    // If the AI fails (firewall/network), we fail silently 
    // instead of crashing, but the Sim Mode above still works.
    console.warn("AI Auto-complete failed (using fallback):", err);
    return "";
  }
};