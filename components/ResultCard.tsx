import React from 'react';
import { DictionaryEntry } from '../types';
import { SpeakerIcon } from './Icons';

interface ResultCardProps {
  data: DictionaryEntry;
  imageUrl: string | null;
  thirdLangName: string;
}

const langMap: Record<string, string> = {
  'Arabic': 'ar-SA',
  'Hindi': 'hi-IN',
  'French': 'fr-FR',
  'Spanish': 'es-ES',
  'German': 'de-DE',
  'Japanese': 'ja-JP',
  'Bangla': 'bn-BD',
  'English': 'en-US'
};

const Section = ({ 
  title, 
  word,
  pronunciation,
  meaning, 
  synonyms, 
  antonyms, 
  example, 
  langCode
}: { 
  title: string; 
  word: string; 
  pronunciation: string;
  meaning: string; 
  synonyms: string[]; 
  antonyms: string[]; 
  example: string; 
  langCode: string;
}) => {
  
  const playAudio = () => {
    if (!word) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = langCode;
    utterance.rate = 0.9;
    
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const specificVoice = voices.find(v => v.lang === langCode) || voices.find(v => v.lang.startsWith(langCode.split('-')[0]));
      if (specificVoice) utterance.voice = specificVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-black to-gray-900 p-4 flex justify-between items-center relative overflow-hidden">
        {/* Decorative Red Blur */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-600 rounded-full blur-3xl opacity-30 -mr-8 -mt-8"></div>
        
        <div>
          <h3 className="text-white font-bold text-lg tracking-wide">{title}</h3>
          <p className="text-gray-400 text-sm font-medium">{word}</p>
        </div>
        <button 
          onClick={playAudio}
          className="relative z-10 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-600 hover:scale-110 transition-all duration-300 shadow-lg border border-white/10"
          title="Listen to pronunciation"
        >
          <SpeakerIcon className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-6 flex flex-col gap-6 flex-grow font-bangla">
         
         {/* Meaning - শব্দের অর্থ */}
         <div className="group">
            <h4 className="text-sm font-bold text-red-600 mb-2 flex items-center gap-2">
              <span className="w-1 h-4 bg-red-600 rounded-full"></span>
              শব্দের অর্থ
            </h4>
            <p className="text-gray-700 text-lg leading-relaxed font-medium pl-3">{meaning}</p>
         </div>

         {/* Synonyms - সমার্থক শব্দ */}
         {(synonyms?.length > 0) && (
          <div className="group">
            <h4 className="text-sm font-bold text-red-600 mb-2 flex items-center gap-2">
              <span className="w-1 h-4 bg-black rounded-full"></span>
              সমার্থক শব্দ
            </h4>
            <div className="flex flex-wrap gap-2 pl-3">
              {synonyms.slice(0, 5).map((s, i) => (
                <span key={i} className="px-3 py-1 bg-gray-50 text-gray-700 text-sm font-semibold border border-gray-200 rounded-full hover:bg-gray-100 transition-colors">
                  {s}
                </span>
              ))}
            </div>
          </div>
         )}

         {/* Antonyms - বিপরীত শব্দ */}
         {(antonyms?.length > 0) && (
          <div className="group">
            <h4 className="text-sm font-bold text-red-600 mb-2 flex items-center gap-2">
              <span className="w-1 h-4 bg-red-400 rounded-full"></span>
              বিপরীত শব্দ
            </h4>
            <div className="flex flex-wrap gap-2 pl-3">
              {antonyms.slice(0, 3).map((s, i) => (
                <span key={i} className="px-3 py-1 bg-red-50 text-red-700 text-sm font-semibold border border-red-100 rounded-full">
                  {s}
                </span>
              ))}
            </div>
          </div>
         )}

         {/* Pronunciation - উচ্চারণ */}
         <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
             <h4 className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">উচ্চারণ</h4>
             <p className="text-lg text-black font-bold tracking-wide">
               / {pronunciation} /
             </p>
         </div>

         {/* Example - উদাহরণ */}
         {example && (
           <div className="mt-auto pt-4 border-t border-dashed border-gray-200">
             <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">উদাহরণ</h4>
             <p className="text-gray-600 italic text-sm border-l-2 border-gray-300 pl-3">"{example}"</p>
           </div>
         )}
      </div>
    </div>
  );
};

const ResultCard: React.FC<ResultCardProps> = ({ data, imageUrl, thirdLangName }) => {
  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in pb-12">
      {/* Main Header Section */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12 border border-gray-100">
        <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8 items-start relative">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-100 to-transparent rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          
          {imageUrl && (
             <div className="w-full md:w-72 h-64 flex-shrink-0 bg-gray-50 rounded-2xl p-2 shadow-inner border border-gray-100 relative z-10">
               <img src={imageUrl} alt={data.headword} className="w-full h-full object-cover rounded-xl mix-blend-multiply" />
             </div>
           )}
           
           <div className="flex-1 w-full relative z-10">
              <div className="flex flex-wrap items-start justify-between w-full border-b border-gray-100 pb-6 mb-6 gap-4">
                 <div>
                    <h1 className="text-5xl md:text-7xl font-black text-black tracking-tighter mb-3 leading-none">
                      {data.headword}
                    </h1>
                    <div className="flex items-center gap-3">
                      <p className="text-2xl text-red-600 font-mono font-medium tracking-tight">/ {data.pronunciation} /</p>
                    </div>
                 </div>
                 
                 <span className="bg-gradient-to-r from-black to-gray-800 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg tracking-widest uppercase">
                   {data.partOfSpeech}
                 </span>
              </div>

              {/* Origin / Etymology - শব্দের উৎস */}
              {data.etymology && (
                <div className="mb-4 bg-red-50 rounded-xl p-5 border border-red-100 font-bangla">
                  <h4 className="flex items-center gap-2 font-bold text-red-700 text-sm mb-2 uppercase tracking-wider">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    শব্দের উৎস (Origin)
                  </h4>
                  <p className="text-gray-800 font-medium text-lg leading-relaxed">
                    {data.etymology}
                  </p>
                </div>
              )}
              
              {data.usageNote && (
                <p className="text-gray-500 text-sm mt-2 font-bangla">
                   <span className="font-bold text-gray-700">Note:</span> {data.usageNote}
                </p>
              )}
           </div>
        </div>
      </div>

      {/* The 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Section 
          title="Bangla / বাংলা"
          langCode="bn-BD"
          word={data.wordL1}
          pronunciation={data.pronunciationL1}
          meaning={data.meaningL1}
          synonyms={data.synonymsL1}
          antonyms={data.antonymsL1}
          example={data.exampleL1}
        />

        <Section 
          title="English"
          langCode="en-US"
          word={data.translationL2}
          pronunciation={data.pronunciationL2}
          meaning={data.meaningL2}
          synonyms={data.synonymsL2}
          antonyms={data.antonymsL2}
          example={data.exampleL2}
        />

        <Section 
          title={thirdLangName}
          langCode={langMap[thirdLangName] || 'en-US'}
          word={data.translationL3}
          pronunciation={data.pronunciationL3}
          meaning={data.meaningL3}
          synonyms={data.synonymsL3}
          antonyms={data.antonymsL3}
          example={data.exampleL3}
        />
      </div>
    </div>
  );
};

export default ResultCard;