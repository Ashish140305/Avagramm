import { pipeline } from '@xenova/transformers';

class AIModel {
  static task = 'text-classification';
  static model = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, this.model, { progress_callback });
    }
    return this.instance;
  }
}

export const analyzeTone = async (text) => {
  try {
    const classifier = await AIModel.getInstance();
    const results = await classifier(text);
    
    // results example: [{ label: 'POSITIVE', score: 0.98 }]
    const result = results[0];
    const label = result.label;
    const score = Math.round(result.score * 100);

    let displayLabel = 'Neutral';
    if (label === 'POSITIVE') displayLabel = 'Excited';
    if (label === 'NEGATIVE') displayLabel = 'Serious';

    return { 
        label: displayLabel, 
        score: score 
    };
  } catch (e) {
    console.error("AI Engine Error:", e);
    return { label: 'Neutral', score: 0 };
  }
};