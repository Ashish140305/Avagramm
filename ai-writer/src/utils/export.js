// src/utils/export.js

export const copyToClipboard = async (text) => {
  if (!text) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

export const downloadText = (text, filename = 'draft.txt') => {
  if (!text) return;
  
  const element = document.createElement('a');
  const file = new Blob([text], { type: 'text/plain' });
  
  element.href = URL.createObjectURL(file);
  element.download = filename;
  
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
  document.body.removeChild(element);
};

export const generateMarkdown = (title, text, date) => {
  return `# ${title}\n\n*Date: ${new Date(date).toLocaleDateString()}*\n\n---\n\n${text}`;
};