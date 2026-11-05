/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useCommunityData } from '../context/CommunityDataContext';
import { TabType, LeaderProfile, CultureTradition, DictionaryWord, TraditionalDressItem, CommunityPost } from '../types';
import { SCHOLARSHIPS_DATA } from '../data/communityData';
import {
  Search,
  X,
  Sparkles,
  Users,
  Bell,
  BookOpen,
  Palette,
  History,
  GraduationCap,
  ArrowRight,
  CornerDownLeft,
  Calendar,
  FileText,
  Pin,
  MapPin,
  CheckCircle,
  Clock,
  Command,
  SlidersHorizontal
} from 'lucide-react';

export interface SearchResultItem {
  id: string;
  type: 'culture' | 'leader' | 'notice' | 'word' | 'dress' | 'history' | 'scholarship';
  categoryLabel: string;
  title: string;
  titleNepali?: string;
  subtitle?: string;
  description: string;
  targetTab: TabType;
  leaderData?: LeaderProfile;
  image?: string;
  badge?: string;
  date?: string;
}

interface GlobalSearchBarProps {
  setCurrentTab: (tab: TabType) => void;
  onSelectLeader?: (leader: LeaderProfile) => void;
  variant?: 'header' | 'mobile' | 'button-only';
  onCloseMobileMenu?: () => void;
}

export default function GlobalSearchBar({
  setCurrentTab,
  onSelectLeader,
  variant = 'header',
  onCloseMobileMenu
}: GlobalSearchBarProps) {
  const {
    leaders,
    culturalTraditions,
    timelineEvents,
    dictionaryWords,
    dressItems,
    costumes,
    posts
  } = useCommunityData();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Global keyboard shortcut to open search (⌘K or Ctrl+K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Index and build searchable item catalog
  const allSearchableItems: SearchResultItem[] = useMemo(() => {
    const items: SearchResultItem[] = [];

    // 1. Cultural Topics & Traditions
    if (culturalTraditions && culturalTraditions.length > 0) {
      culturalTraditions.forEach((c) => {
        items.push({
          id: `culture-${c.id}`,
          type: 'culture',
          categoryLabel: 'Culture & Rituals',
          title: c.title,
          titleNepali: c.titleNepali,
          subtitle: `${c.category} • ${c.season}`,
          description: c.description,
          targetTab: 'cultures',
          image: c.image,
          badge: 'Heritage'
        });
      });
    }

    // 2. Youth Leaders & Working Committee
    if (leaders && leaders.length > 0) {
      leaders.forEach((l) => {
        items.push({
          id: `leader-${l.id}`,
          type: 'leader',
          categoryLabel: 'Leaders & Committee',
          title: l.name,
          titleNepali: l.nameNepali,
          subtitle: `${l.role} (Ward ${l.ward || '11'})`,
          description: l.bio || `Contact: ${l.phone || l.email}`,
          targetTab: 'leaders',
          leaderData: l,
          image: l.image,
          badge: l.badge || 'Executive'
        });
      });
    }

    // 3. Official Notices, Meetings, Documents, & Posts
    if (posts && posts.length > 0) {
      posts.forEach((p) => {
        const typeLabel =
          p.type === 'meeting'
            ? 'Official Meeting'
            : p.type === 'document'
            ? 'Document / PDF File'
            : p.type === 'photo'
            ? 'Photo Gallery'
            : p.type === 'event'
            ? 'Community Event'
            : p.type === 'new_members' || p.type === 'new_member'
            ? 'New Members'
            : 'Official Notice';

        items.push({
          id: `post-${p.id}`,
          type: 'notice',
          categoryLabel: typeLabel,
          title: p.title,
          titleNepali: p.titleNepali,
          subtitle: `${typeLabel}${p.dispatchNumber ? ` • Dispatch: ${p.dispatchNumber}` : ''}${p.date ? ` • ${p.date}` : ''}`,
          description: p.summary || p.content,
          targetTab: 'notices',
          badge: p.pinned ? 'Pinned' : p.priority === 'urgent' ? 'Urgent' : undefined,
          date: p.date || p.createdAt
        });
      });
    }

    // 4. Bote Language / Tarahi Dialect Lexicon
    if (dictionaryWords && dictionaryWords.length > 0) {
      dictionaryWords.forEach((w) => {
        items.push({
          id: `word-${w.id}`,
          type: 'word',
          categoryLabel: 'Bote Language Lexicon',
          title: `${w.tarahi} (${w.devnagari})`,
          titleNepali: w.nepali,
          subtitle: `English: "${w.english}" • Category: ${w.category}`,
          description: w.exampleSentence
            ? `Example: ${w.exampleSentence}`
            : `Tarahi Bote vocabulary word. Meaning: ${w.english} (${w.nepali})`,
          targetTab: 'language',
          badge: 'Vocabulary'
        });
      });
    }

    // 5. Traditional Dress & Costumes
    if (dressItems && dressItems.length > 0) {
      dressItems.forEach((d) => {
        items.push({
          id: `dress-${d.id}`,
          type: 'dress',
          categoryLabel: 'Costumes & Dress',
          title: d.name,
          titleNepali: d.nameNepali,
          subtitle: `Materials: ${d.materials} • Gender: ${d.gender}`,
          description: d.description,
          targetTab: 'dress',
          image: d.image,
          badge: 'Attire'
        });
      });
    }

    // 6. History Timeline & River Milestones
    if (timelineEvents && timelineEvents.length > 0) {
      timelineEvents.forEach((h) => {
        items.push({
          id: `history-${h.id}`,
          type: 'history',
          categoryLabel: 'History & River Basin',
          title: `${h.year}: ${h.title}`,
          titleNepali: h.titleNepali,
          subtitle: `${h.periodLabel || 'Historical Milestone'} • ${h.categoryLabel || h.category}`,
          description: h.summary || h.culturalImpact,
          targetTab: 'history',
          badge: 'History'
        });
      });
    }

    // 7. Scholarships & Grants
    if (SCHOLARSHIPS_DATA && SCHOLARSHIPS_DATA.length > 0) {
      SCHOLARSHIPS_DATA.forEach((s) => {
        items.push({
          id: `sch-${s.id}`,
          type: 'scholarship',
          categoryLabel: 'Scholarships & Education',
          title: s.title,
          titleNepali: s.titleNepali,
          subtitle: `Award: ${s.awardAmount} • Level: ${s.targetLevel}`,
          description: s.description || s.eligibility,
          targetTab: 'scholarships',
          badge: s.status === 'open' ? 'Open Grant' : 'Closed'
        });
      });
    }

    return items;
  }, [culturalTraditions, leaders, posts, dictionaryWords, dressItems, timelineEvents]);

  // Filter items based on active search query
  const filteredResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    return allSearchableItems.filter((item) => {
      // Text search match across title, nepali title, subtitle, and description
      const titleMatch = item.title.toLowerCase().includes(q);
      const nepaliTitleMatch = item.titleNepali ? item.titleNepali.toLowerCase().includes(q) : false;
      const subtitleMatch = item.subtitle ? item.subtitle.toLowerCase().includes(q) : false;
      const descMatch = item.description ? item.description.toLowerCase().includes(q) : false;
      const catMatch = item.categoryLabel.toLowerCase().includes(q);

      return titleMatch || nepaliTitleMatch || subtitleMatch || descMatch || catMatch;
    });
  }, [allSearchableItems, query]);

  // Reset selected item when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults]);

  // Handle navigating to result
  const handleSelectResult = (item: SearchResultItem) => {
    setCurrentTab(item.targetTab);
    if (item.type === 'leader' && item.leaderData && onSelectLeader) {
      onSelectLeader(item.leaderData);
    }
    setIsOpen(false);
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard navigation inside results list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelectResult(filteredResults[selectedIndex]);
      }
    }
  };

  const getTypeIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'culture':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'leader':
        return <Users className="w-4 h-4 text-[#003893]" />;
      case 'notice':
        return <Bell className="w-4 h-4 text-red-600" />;
      case 'word':
        return <BookOpen className="w-4 h-4 text-purple-600" />;
      case 'dress':
        return <Palette className="w-4 h-4 text-emerald-600" />;
      case 'history':
        return <History className="w-4 h-4 text-orange-600" />;
      case 'scholarship':
        return <GraduationCap className="w-4 h-4 text-blue-600" />;
      default:
        return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTypeBadgeClass = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'culture':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'leader':
        return 'bg-blue-50 text-[#003893] border-blue-200';
      case 'notice':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'word':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'dress':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'history':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'scholarship':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Render for the header button / desktop bar
  return (
    <>
      {/* 1. Header Trigger Controls */}
      {variant === 'header' && (
        <div className="relative">
          {/* Desktop Search Bar Trigger (Input look) */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 text-slate-600 hover:text-slate-900 transition shadow-xs text-xs font-medium cursor-pointer w-48 xl:w-64 focus:outline-none focus:ring-2 focus:ring-red-500/30"
            title="Search cultural topics, leaders, notices (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 transition-colors shrink-0" />
            <span className="truncate text-slate-500 group-hover:text-slate-700 text-left flex-1">
              Search topics, leaders, notices...
            </span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-bold bg-white text-slate-500 rounded border border-slate-300 shadow-xs shrink-0">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </button>
        </div>
      )}

      {/* 2. Compact Icon-only Trigger (for mobile/tablet nav bars) */}
      {variant === 'button-only' && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="p-2 text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
          title="Search website content (⌘K)"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>
      )}

      {/* 3. Mobile Drawer Embedded Search Bar */}
      {variant === 'mobile' && (
        <div className="w-full">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-red-600" />
              <span>Search topics, leaders, notices...</span>
            </div>
            <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 font-bold text-slate-500">
              ⌘K
            </span>
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* GLOBAL SEARCH COMMAND-PALETTE MODAL OVERLAY */}
      {/* ============================================================== */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
          >
            {/* Modal Search Header Input */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3 bg-gradient-to-r from-slate-50 to-white">
              <Search className="w-5 h-5 text-red-600 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cultural rituals, youth leaders, notices, words, files..."
                className="w-full text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition shrink-0 cursor-pointer flex items-center justify-center"
                title="Close search"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results Body */}
            <div
              ref={resultsContainerRef}
              className="p-4 sm:p-5 overflow-y-auto flex-1 divide-y divide-slate-100 space-y-1"
            >
              {/* Direct-to-typing state: no popular or recommended sections */}
              {!query.trim() && (
                <div className="py-14 px-4 text-center select-none">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <Search className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-700">
                    Type to search
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Start typing to search notices, circulars, executive leaders, cultural traditions, or language words.
                  </p>
                </div>
              )}

              {/* Has query but no results */}
              {query.trim() && filteredResults.length === 0 && (
                <div className="text-center py-10 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      No results found for "{query}"
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Try searching with broader terms like <span className="font-semibold text-slate-700">Karmaiya</span>, <span className="font-semibold text-slate-700">Puja</span>, <span className="font-semibold text-slate-700">Notice</span>, <span className="font-semibold text-slate-700">Leader</span>, or <span className="font-semibold text-slate-700">Scholarship</span>.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setQuery('');
                      }}
                      className="text-xs text-red-600 hover:text-red-700 font-bold underline cursor-pointer"
                    >
                      Clear search filter
                    </button>
                  </div>
                </div>
              )}

              {/* Rendered matching search results */}
              {query.trim() && filteredResults.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1 pb-1">
                    <span>
                      Showing {filteredResults.length} match{filteredResults.length > 1 ? 'es' : ''} for "{query}"
                    </span>
                    <span className="hidden sm:inline">Use ↑ ↓ and Enter to select</span>
                  </div>

                  {filteredResults.map((item, index) => {
                    const isSelected = selectedIndex === index;

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectResult(item)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 group ${
                          isSelected
                            ? 'bg-red-50/60 border-red-300 shadow-xs'
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${getTypeBadgeClass(
                            item.type
                          )}`}
                        >
                          {getTypeIcon(item.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${getTypeBadgeClass(
                                item.type
                              )}`}
                            >
                              {item.categoryLabel}
                            </span>
                            {item.badge && (
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                                {item.badge}
                              </span>
                            )}
                            {item.date && (
                              <span className="text-[10px] text-slate-400 font-medium ml-auto">
                                {item.date}
                              </span>
                            )}
                          </div>

                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1.5 group-hover:text-red-600 transition-colors flex items-center gap-1.5">
                            <span>{item.title}</span>
                            {item.titleNepali && (
                              <span className="text-slate-500 font-normal text-xs truncate">
                                ({item.titleNepali})
                              </span>
                            )}
                          </h4>

                          {item.subtitle && (
                            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                              {item.subtitle}
                            </p>
                          )}

                          {item.description && (
                            <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>

                        <div className="shrink-0 self-center hidden sm:flex items-center text-slate-300 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-white border border-slate-300 rounded shadow-xs">
                    ↑
                  </kbd>
                  <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-white border border-slate-300 rounded shadow-xs">
                    ↓
                  </kbd>
                  <span>Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-white border border-slate-300 rounded shadow-xs">
                    ↵
                  </kbd>
                  <span>Select</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-white border border-slate-300 rounded shadow-xs">
                    esc
                  </kbd>
                  <span>Close</span>
                </span>
              </div>

              <span className="text-[10px] text-slate-400 font-bold">
                BoteYouthCommunity Nepal Directory
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
