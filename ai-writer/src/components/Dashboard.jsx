import React, { useState, useEffect } from 'react';
import { Send, Loader2, Copy, History, Trash2, X } from 'lucide-react';

// --- 1. SMART MOCK (The "Fake Backend") ---
const generateSmartMock = (tool, topic, tone) => {
  return new Promise((resolve) => {
    const delay = Math.floor(Math.random() * 1000) + 1500; // 1.5s - 2.5s delay

    setTimeout(() => {
      let response = "";
      // content logic based on Tone
      const isFunny = tone === 'funny';
      const isCasual = tone === 'casual';

      switch (tool) {
        case "tweet":
          if (isFunny) {
            response = `Just spilled coffee on my keyboard while researching ${topic}. Is this a sign? ☕️😂 #TechLife #${topic.replace(/\s/g, '')}`;
          } else {
            response = `The impact of ${topic} cannot be overstated. It's changing how we approach productivity. 🚀 #Growth #Scale`;
          }
          break;
          
        case "blog-title":
          response = isFunny 
            ? `1. ${topic}: Why I'm Crying in the Club\n2. 5 Ways ${topic} Ruined My Sleep\n3. Don't Do ${topic} Without Reading This`
            : `1. The Ultimate Guide to ${topic}\n2. Why ${topic} is the Future of Industry\n3. 5 Strategic Benefits of ${topic}`;
          break;
          
        case "email":
          const salutation = isCasual ? "Hey everyone," : "Dear Team,";
          const signoff = isCasual ? "Cheers," : "Sincerely,";
          response = `Subject: Thoughts on ${topic}\n\n${salutation}\n\nI've been looking into ${topic} and wanted to share some quick thoughts. It looks promising, but we should discuss the details.\n\n${signoff}\n[Your Name]`;
          break;
          
        default:
          response = `Generated content for ${topic}.`;
      }
      resolve(response);
    }, delay);
  });
};

// --- 2. COMPONENT ---
const Dashboard = () => {
  const [inputText, setInputText] = useState("");
  const [activeTool, setActiveTool] = useState("tweet");
  const [activeTone, setActiveTone] = useState("professional"); // NEW STATE
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState([]);

  // Load History
  useEffect(() => {
    const savedHistory = localStorage.getItem("ai_writer_history");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // Save History Helper
  const saveToLocalStorage = (newHistory) => {
    setHistory(newHistory);
    localStorage.setItem("ai_writer_history", JSON.stringify(newHistory));
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setIsGenerating(true);
    setOutput(""); 

    try {
      // Pass the 'activeTone' to the mock function
      const result = await generateSmartMock(activeTool, inputText, activeTone);
      
      setOutput(result);

      const newItem = {
        id: Date.now(),
        tool: activeTool,
        topic: inputText,
        tone: activeTone, // Save tone to history
        result: result,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      saveToLocalStorage([newItem, ...history]);

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // NEW: Delete Single Item
  const handleDelete = (e, idToDelete) => {
    e.stopPropagation(); // Stop the click from triggering "loadFromHistory"
    const updatedHistory = history.filter(item => item.id !== idToDelete);
    saveToLocalStorage(updatedHistory);
  };

  const clearHistory = () => {
    saveToLocalStorage([]);
  };

  const loadFromHistory = (item) => {
    setInputText(item.topic);
    setActiveTool(item.tool);
    setActiveTone(item.tone || 'professional'); // Load tone if exists
    setOutput(item.result);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans flex flex-col lg:flex-row gap-8">
      
      {/* LEFT SIDE: Generator */}
      <div className="flex-1 max-w-2xl mx-auto w-full space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">AI Writer Prototype</h1>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          
          {/* Tool Selection */}
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">Topic</label>
            
            {/* NEW: Tone Selector */}
            <select 
              value={activeTone}
              onChange={(e) => setActiveTone(e.target.value)}
              className="text-xs border border-gray-300 rounded-md px-2 py-1 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="funny">Funny</option>
            </select>
          </div>

          <textarea
            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
            rows="3"
            placeholder="e.g. The benefits of waking up early..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
            <div className="flex gap-2 w-full sm:w-auto">
              {['tweet', 'blog-title', 'email'].map(tool => (
                <button
                  key={tool}
                  onClick={() => setActiveTool(tool)}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wide transition-colors
                    ${activeTool === tool ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                  {tool}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !inputText}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-medium text-white transition-all
                ${isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'}`}
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {isGenerating ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>

        {/* Output Area */}
        {output && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Result ({activeTone})</span>
              <button onClick={() => navigator.clipboard.writeText(output)} className="text-gray-400 hover:text-blue-600 transition-colors" title="Copy">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{output}</p>
          </div>
        )}
      </div>

      {/* RIGHT SIDE: History */}
      <div className="w-full lg:w-80">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[500px] lg:h-[calc(100vh-4rem)] sticky top-8 flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
            <div className="flex items-center gap-2 text-gray-700 font-semibold">
              <History className="w-4 h-4" />
              History
            </div>
            {history.length > 0 && (
              <button onClick={clearHistory} className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50">
                Clear All
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {history.length === 0 ? (
              <div className="text-center text-gray-400 text-sm mt-10">No history yet.</div>
            ) : (
              history.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => loadFromHistory(item)}
                  className="group relative p-3 rounded-lg hover:bg-blue-50 cursor-pointer border border-transparent hover:border-blue-100 transition-all bg-white shadow-sm"
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded text-white
                        ${item.tool === 'tweet' ? 'bg-sky-400' : item.tool === 'email' ? 'bg-indigo-400' : 'bg-emerald-400'}
                      `}>
                        {item.tool}
                      </span>
                      <span className="text-[10px] text-gray-400">{item.timestamp}</span>
                    </div>
                    
                    {/* NEW: Delete Button (Visible on Hover) */}
                    <button 
                      onClick={(e) => handleDelete(e, item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
                      title="Delete Item"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 mt-1 font-medium">{item.topic}</p>
                  <p className="text-[10px] text-gray-400 mt-1 capitalize">Tone: {item.tone || 'Professional'}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;