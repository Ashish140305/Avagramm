export const calculateReadability = (text) => {
  const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1;
  const syllables = text.split(/[aeiouy]{1,2}/i).length;

  if (words === 0) return { grade: 0, readingTime: "0 min", level: "N/A" };

  // Flesch-Kincaid Grade Level
  const grade = 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;
  const finalGrade = Math.max(0, Math.round(grade));
  
  // Reading time (200 wpm)
  const readingTime = Math.ceil(words / 200);

  // Contextual Level Label
  let level = "Plain English";
  if (finalGrade >= 12) level = "Academic / Complex";
  else if (finalGrade >= 9) level = "Professional";
  else if (finalGrade >= 6) level = "Easy to Read";
  else level = "Very Simple";

  return {
    grade: finalGrade,
    readingTime: `${readingTime} min read`,
    level: level
  };
};