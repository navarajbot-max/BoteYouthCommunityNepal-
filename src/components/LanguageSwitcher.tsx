/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Check, Languages, ChevronDown, Sparkles } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'pill' | 'compact' | 'dropdown' | 'ribbon';
  className?: string;
  id?: string;
}

export default function LanguageSwitcher({
  variant = 'compact',
  className = '',
  id = 'single-language-translate-toggle'
}: LanguageSwitcherProps) {
  const { language, setLanguage, toggleLanguage, isNepali, t } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // Variant 1: Ribbon style (Designed specifically for the top blue ribbon)
  if (variant === 'ribbon') {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <div
          role="group"
          aria-label={t('switcher.label', 'Language')}
          className="inline-flex items-center bg-black/25 backdrop-blur-xs p-0.5 rounded-full border border-white/20 text-[10px] font-bold shadow-xs select-none"
        >
          <button
            type="button"
            onClick={() => setLanguage('ne')}
            aria-pressed={isNepali}
            className={`px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
              isNepali
                ? 'bg-red-600 text-white shadow-xs font-black'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
            title="१-क्लिकमा सम्पूर्ण वेबसाइट नेपालीमा अनुवाद गर्नुहोस् (1-Click Translate All to Nepali)"
          >
            <span>🇳🇵</span>
            <span>नेपाली</span>
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            aria-pressed={!isNepali}
            className={`px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
              !isNepali
                ? 'bg-blue-600 text-white shadow-xs font-black'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
            title="Translate Entire Website to English in 1 Click"
          >
            <span>🇬🇧</span>
            <span>English</span>
          </button>
        </div>
      </div>
    );
  }

  // Variant 2: Compact Button (Header Navigation Single-Click Toggle - Medium Size)
  if (variant === 'compact') {
    return (
      <div className={`relative inline-flex items-center text-left shrink-0 ${className}`}>
        <button
          type="button"
          id={id}
          onClick={toggleLanguage}
          aria-label={
            isNepali
              ? '१-क्लिकमा अंग्रेजीमा अनुवाद गर्नुहोस् (1-Click switch to English)'
              : '१-क्लिकमा नेपालीमा अनुवाद गर्नुहोस् (1-Click translate all words to Nepali)'
          }
          title={
            isNepali
              ? 'हाल नेपालीमा छ । १-क्लिकमा अंग्रेजी भाषामा जानुहोस् (1-Click Switch to English)'
              : 'हाल अंग्रेजीमा छ । १-क्लिकमा सम्पूर्ण वेबसाइटका सबै शब्द नेपालीमा अनुवाद गर्नुहोस् (1-Click Translate All Words to Nepali)'
          }
          className={`group relative inline-flex items-center justify-between w-[138px] sm:w-[168px] h-[30px] p-0.5 rounded-full text-[10.5px] sm:text-[11px] font-bold transition-all duration-200 border shadow-xs hover:shadow-sm cursor-pointer select-none active:scale-95 shrink-0 ${
            isNepali
              ? 'bg-red-50/70 border-red-300 hover:border-red-500 text-slate-900'
              : 'bg-blue-50/70 border-blue-300 hover:border-blue-500 text-slate-900'
          }`}
        >
          {/* Left Segment: Nepali Flag & Label */}
          <span
            className={`inline-flex items-center justify-center gap-1 px-1.5 sm:px-2 h-[22px] rounded-full text-[10.5px] sm:text-[11px] transition-all duration-200 whitespace-nowrap ${
              isNepali
                ? 'bg-[#DC143C] text-white shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-800 font-semibold'
            }`}
          >
            <span className="text-xs leading-none">🇳🇵</span>
            <span>नेपाली</span>
          </span>

          {/* Center Switch Icon */}
          <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-slate-400 group-hover:text-slate-600 transition-colors shrink-0">
            <Languages className="w-2.5 h-2.5 transition-transform duration-300 group-hover:rotate-180" />
          </div>

          {/* Right Segment: English Flag & Label */}
          <span
            className={`inline-flex items-center justify-center gap-1 px-1.5 sm:px-2 h-[22px] rounded-full text-[10.5px] sm:text-[11px] transition-all duration-200 whitespace-nowrap ${
              !isNepali
                ? 'bg-[#003893] text-white shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-800 font-semibold'
            }`}
          >
            <span className="text-xs leading-none">🇬🇧</span>
            <span>English</span>
          </span>
        </button>
      </div>
    );
  }

  // Variant 3: Segmented Pill Control (Ideal for mobile menu drawer, modal, and footer)
  if (variant === 'pill') {
    return (
      <div
        role="group"
        aria-label={t('switcher.label', 'Language')}
        className={`inline-flex items-center p-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-bold select-none ${className}`}
      >
        <button
          type="button"
          onClick={() => setLanguage('ne')}
          aria-pressed={isNepali}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer ${
            isNepali
              ? 'bg-red-600 text-white shadow-xs font-black scale-100'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <span className="text-sm">🇳🇵</span>
          <span>नेपाली</span>
          {isNepali && <Check className="w-3 h-3 text-white ml-0.5" />}
        </button>

        <button
          type="button"
          onClick={() => setLanguage('en')}
          aria-pressed={!isNepali}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer ${
            !isNepali
              ? 'bg-[#003893] text-white shadow-xs font-black scale-100'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <span className="text-sm">🇬🇧</span>
          <span>English</span>
          {!isNepali && <Check className="w-3 h-3 text-white ml-0.5" />}
        </button>
      </div>
    );
  }

  // Variant 4: Dropdown Menu
  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-xs transition cursor-pointer"
      >
        <Globe className="w-3.5 h-3.5 text-slate-500" />
        <span>{isNepali ? '🇳🇵 नेपाली' : '🇬🇧 English'}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-1.5 w-44 rounded-2xl bg-white border border-slate-200 shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-1 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
            {t('switcher.label', 'Select Language')}
          </div>
          <button
            type="button"
            onClick={() => {
              setLanguage('ne');
              setDropdownOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center justify-between transition ${
              isNepali ? 'bg-red-50 text-red-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="text-sm">🇳🇵</span>
              <span>नेपाली (Nepali)</span>
            </span>
            {isNepali && <Check className="w-3.5 h-3.5 text-red-600" />}
          </button>
          <button
            type="button"
            onClick={() => {
              setLanguage('en');
              setDropdownOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center justify-between transition ${
              !isNepali ? 'bg-blue-50 text-blue-900' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="text-sm">🇬🇧</span>
              <span>English</span>
            </span>
            {!isNepali && <Check className="w-3.5 h-3.5 text-[#003893]" />}
          </button>
        </div>
      )}
    </div>
  );
}
