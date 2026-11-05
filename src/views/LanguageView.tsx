/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType } from '../types';
import { useCommunityData } from '../context/CommunityDataContext';
import {
  BookOpen,
  Search,
  Volume2,
  Filter,
  CheckCircle,
  PlusCircle,
  Sparkles,
  ArrowRight,
  Send
} from 'lucide-react';

interface LanguageViewProps {
  setCurrentTab: (tab: TabType) => void;
}

export default function LanguageView({ setCurrentTab }: LanguageViewProps) {
  const { dictionaryWords } = useCommunityData();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [playingWordId, setPlayingWordId] = useState<string | null>(null);
  const [suggestWord, setSuggestWord] = useState('');
  const [suggestMeaning, setSuggestMeaning] = useState('');
  const [submittedSuggest, setSubmittedSuggest] = useState(false);

  const categories = ['All', 'River & Boating', 'Nature & Sacred', 'Tools & Craft', 'Family & People', 'Daily Life'];

  const filteredWords = dictionaryWords.filter((w) => {
    const matchesCategory = selectedCategory === 'All' || w.category === selectedCategory;
    const query = search.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      w.tarahi.toLowerCase().includes(query) ||
      w.devnagari.toLowerCase().includes(query) ||
      w.nepali.toLowerCase().includes(query) ||
      w.english.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const handlePlayPronunciation = (id: string) => {
    setPlayingWordId(id);
    setTimeout(() => {
      setPlayingWordId(null);
    }, 1200);
  };

  const handleSuggestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestWord.trim()) return;
    setSubmittedSuggest(true);
    setTimeout(() => {
      setSuggestWord('');
      setSuggestMeaning('');
      setSubmittedSuggest(false);
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#DC143C]">
          <BookOpen className="w-4 h-4 text-[#003893]" />
          <span>Linguistic Documentation Project</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-poppins text-slate-900 leading-tight">
          Bote Language &amp; Tarahi Lexicon
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
          The Bote language (specifically the Tarahi dialect spoken in Sarlahi, Nepal) is critically endangered. With native fluency concentrated mostly among elders, the Bote Youth Community Nepal is actively collecting conversational vocabulary, idioms, and fish-catching songs to publish the first bilingual Tarahi-Nepali-English dictionary.
        </p>
      </div>

      {/* Interactive Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search Bote vocabulary by Tarahi phrase, Devanagari, Nepali, or English..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#DC143C] bg-slate-50"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#DC143C] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dictionary Cards Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <span className="text-xs font-bold text-slate-500 uppercase">
            Showing {filteredWords.length} Documented Words
          </span>
          <span className="text-xs text-[#003893] font-bold">
            Tarahi Bote Lexicography v2.5
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWords.map((word) => {
            const isPlaying = playingWordId === word.id;
            return (
              <div
                key={word.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black uppercase text-[#003893] bg-blue-50 px-2 py-0.5 rounded-md">
                      {word.category}
                    </span>
                    <button
                      onClick={() => handlePlayPronunciation(word.id)}
                      className={`p-1.5 rounded-full transition-all ${
                        isPlaying ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-[#DC143C]'
                      }`}
                      title="Simulate Audio Pronunciation"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <h3 className="font-poppins font-black text-xl text-slate-900 leading-tight">
                      {word.tarahi}
                    </h3>
                    <p className="text-sm font-bold text-[#DC143C] mt-0.5">
                      {word.devnagari}
                    </p>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 pt-1 border-t border-slate-100">
                    <p>
                      <strong>Nepali:</strong> {word.nepali}
                    </p>
                    <p>
                      <strong>English:</strong> {word.english}
                    </p>
                    <p className="font-mono text-[11px] text-slate-400">
                      Phonetic: /{word.phonetic}/
                    </p>
                  </div>
                </div>

                {word.exampleSentence && (
                  <div className="bg-slate-50 p-2 rounded-xl text-[11px] text-slate-600 italic">
                    "{word.exampleSentence}"
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Suggest New Word to Youth Committee */}
      <div className="bg-white rounded-3xl p-8 border-2 border-dashed border-[#003893] shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-[#003893]">
          <PlusCircle className="w-5 h-5" />
          <h3 className="font-poppins font-extrabold text-lg text-slate-900">
            Contribute a Tarahi Word to the Lexicon
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Know an ancestral word, phrase, or river chant spoken by your grandparents in Karmaiya or other Bote villages? Submit it for verification by our Elder Council.
        </p>

        {submittedSuggest ? (
          <div className="bg-green-50 border border-green-200 text-green-700 text-xs p-4 rounded-xl font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Word submitted successfully! Our linguists will verify and add it to the database.</span>
          </div>
        ) : (
          <form onSubmit={handleSuggestSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Tarahi Word / Phrase *</label>
              <input
                type="text"
                required
                placeholder="e.g. Simal Nau"
                value={suggestWord}
                onChange={(e) => setSuggestWord(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003893]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Nepali &amp; English Meaning *</label>
              <input
                type="text"
                required
                placeholder="e.g. सिमलको डुङ्गा - Silk-cotton boat"
                value={suggestMeaning}
                onChange={(e) => setSuggestMeaning(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003893]"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-[#003893] hover:bg-[#002766] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Word for Verification</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Next link */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => setCurrentTab('cultures')}
          className="text-xs text-slate-600 hover:text-slate-900 font-bold"
        >
          &larr; Back to Cultures
        </button>
        <button
          onClick={() => setCurrentTab('dress')}
          className="bg-[#DC143C] hover:bg-[#b51031] text-white text-xs font-bold px-6 py-3 rounded-full transition-all shadow flex items-center space-x-2"
        >
          <span>Explore Culture Dress &amp; Silver Ornaments</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
