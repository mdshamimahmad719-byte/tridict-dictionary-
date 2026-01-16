import React, { useState, useCallback } from 'react';
import { DictionaryEntry, ThirdLanguage } from './types';
import { lookupWord, generateWordImage } from './services/geminiService';
import ResultCard from './components/ResultCard';
import { SearchIcon, TranslationLogoIcon } from './components/Icons';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLang, setSelectedLang] = useState<string>(ThirdLanguage.ARABIC);
  const [result, setResult] = useState<DictionaryEntry | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const commonWords = ["Water", "Love", "Peace", "War", "Friend", "Enemy", "Light", "Darkness", "জল", "ভালোবাসা", "যুদ্ধ", "শান্তি"];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length > 1) {
      const filtered = commonWords.filter(w => w.toLowerCase().includes(value.toLowerCase()));
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = useCallback(async (term: string) => {
    if (!term.trim()) return;
    
    setSuggestions([]);
    setSearchTerm(term);
    setLoading(true);
    setError(null);
    setResult(null);
    setImageUrl(null);

    // Start image generation in the background (don't await it yet)
    const imagePromise = generateWordImage(term)
      .catch(err => {
        console.error("Image generation failed silently:", err);
        return null;
      });

    try {
      // Await text data first so UI updates quickly
      const data = await lookupWord(term, selectedLang);
      setResult(data);
      setLoading(false); // Stop loading spinner immediately after text is ready

      // Now wait for the image to finish and update the UI again
      const img = await imagePromise;
      setImageUrl(img);
    } catch (err) {
      setError("Could not find the word. Please check your internet connection or try a different word.");
      setLoading(false);
    }
  }, [selectedLang]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm);
    }
  };

  const resetHome = () => {
    setSearchTerm('');
    setResult(null);
    setImageUrl(null);
    setError(null);
    setSuggestions([]);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900 selection:bg-red-100 selection:text-red-900">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-gradient-to-b from-red-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-[10%] -left-[10%] w-[500px] h-[500px] bg-gradient-to-r from-black/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Navbar */}
      <header className="relative z-10 w-full px-6 py-6 flex justify-between items-center border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-all" 
          onClick={resetHome}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-black to-red-700 rounded-lg shadow-lg flex items-center justify-center text-white">
            <TranslationLogoIcon className="w-6 h-6" />
          </div>
          <span className="font-black text-xl tracking-tighter text-black">TRIDICT</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow px-4 py-12 flex flex-col items-center w-full max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-black mb-6 tracking-tighter leading-tight font-bangla">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-black">
              ত্রিভাষিক অভিধান
            </span>
            <span className="text-black mx-2">-</span>
            Trilingual Dictionary
          </h1>
          <div className="inline-flex items-center bg-gray-100 rounded-full px-4 py-2 text-sm font-bold text-gray-600 border border-gray-200">
            Bangla <span className="mx-2 text-red-500">•</span> English <span className="mx-2 text-red-500">•</span> 
            <select 
              className="bg-transparent outline-none text-black font-black cursor-pointer"
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
            >
              {Object.values(ThirdLanguage).map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Box */}
        <div className="w-full max-w-2xl relative group z-20">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-black rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
          <div className="relative bg-white rounded-2xl flex items-center p-2 shadow-2xl">
            <div className="pl-4 text-gray-400">
              <SearchIcon className="w-6 h-6" />
            </div>
            <input 
              type="text" 
              className="w-full p-4 text-lg bg-transparent outline-none text-black placeholder:text-gray-400 font-bangla font-medium"
              placeholder="Search word... / শব্দ খুঁজুন..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
            <button 
              onClick={() => handleSearch(searchTerm)}
              disabled={loading}
              className="bg-black text-white px-8 py-3 rounded-xl font-bold tracking-wide hover:bg-red-600 transition-all duration-300 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "SEARCH"
              )}
            </button>
          </div>

          {/* Autosuggest */}
          {suggestions.length > 0 && (
             <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
               {suggestions.map((s, idx) => (
                 <div 
                   key={idx} 
                   className="px-6 py-3 hover:bg-red-50 hover:text-red-600 cursor-pointer text-gray-700 font-medium transition-colors border-b border-gray-50 last:border-0"
                   onClick={() => handleSearch(s)}
                 >
                   {s}
                 </div>
               ))}
             </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="mt-8 bg-red-50 text-red-600 px-8 py-4 rounded-xl border border-red-200 font-medium shadow-sm animate-fade-in">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <ResultCard 
            data={result} 
            imageUrl={imageUrl} 
            thirdLangName={selectedLang}
          />
        )}

        {/* Empty State */}
        {!result && !loading && !error && (
          <div className="mt-20 text-center opacity-40">
            <p className="text-gray-900 font-bangla text-xl font-medium">
              অর্থ, সমার্থক এবং বিপরীত শব্দ খুঁজতে একটি শব্দ লিখুন
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center bg-black text-white mt-auto">
        <p className="text-gray-400 text-sm font-medium tracking-widest lowercase opacity-80 hover:opacity-100 transition-opacity">
           developed by: shamim ahmad
        </p>
      </footer>

      <style>{`
        .font-bangla { font-family: 'Hind Siliguri', sans-serif; }
        .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;