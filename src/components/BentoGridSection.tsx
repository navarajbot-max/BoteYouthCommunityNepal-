/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType, LeaderProfile } from '../types';
import { useCommunityData } from '../context/CommunityDataContext';
import {
  Sailboat,
  Waves,
  Volume2,
  Users,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Download,
  UserCheck,
  Award,
  Sparkles,
  ExternalLink,
  BookOpen,
  IdCard,
  Heart
} from 'lucide-react';

interface BentoGridSectionProps {
  setCurrentTab: (tab: TabType) => void;
  openCustomizer: () => void;
  onSelectLeader: (leader: LeaderProfile) => void;
}

export default function BentoGridSection({
  setCurrentTab,
  openCustomizer,
  onSelectLeader
}: BentoGridSectionProps) {
  const {
    leaders,
    bentoConfig,
    hasJoinedCommunity,
    isFollowingCommunity,
    followerCount,
    followCommunity
  } = useCommunityData();

  // Audio state preview for Tarahi Bote
  const [playingAudio, setPlayingAudio] = useState(false);

  const playDemoAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance('Kaha jahu? Ham Bote chhi.');
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      setPlayingAudio(true);
      utterance.onend = () => setPlayingAudio(false);
      utterance.onerror = () => setPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setPlayingAudio(true);
      setTimeout(() => setPlayingAudio(false), 2000);
    }
  };

  const leadersSample = leaders.slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="bento-grid-showcase">
      {/* Bento Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-red-600">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            <span>{bentoConfig?.pillText || 'Bento Grid • Community Matrix'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight mt-1">
            {bentoConfig?.title || 'Bote Youth Grid Overview'}
          </h2>
        </div>
        <p className="text-xs text-slate-500 max-w-md">
          {bentoConfig?.subtitle || 'Explore heritage, language, craftsmanship, council leaders, and digital identity through interconnected Bento modules.'}
        </p>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[250px] w-full">
        {/* 1. Hero Bento (2 cols, 2 rows) */}
        <section className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-blue-900 to-blue-950 rounded-3xl p-8 text-white flex flex-col justify-between relative overflow-hidden shadow-lg border-2 border-blue-800 group">
          {/* Subtle Watermark Icon */}
          <div className="absolute -right-8 -bottom-8 opacity-10 text-white pointer-events-none group-hover:scale-105 transition-transform duration-700">
            <Sailboat className="w-64 h-64" />
          </div>

          <div className="flex items-center gap-2 z-10">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
              Indigenous Heritage
            </span>
            <span className="text-xs text-slate-300 font-medium">
              Karmaiya, Sarlahi • Bagmati River
            </span>
          </div>

          <div className="z-10 space-y-2 max-w-xl my-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight uppercase text-white font-poppins">
              Revitalizing Ancient Water Traditions &amp; Youth Leadership
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
              The Bote indigenous community honors ancestral river navigation, single-log dugout canoes (Ek-Dunge Nau), and sacred water rites while educating and uniting the next generation of Nepali leaders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 z-10 pt-2">
            <button
              onClick={() => setCurrentTab('history')}
              className="bg-red-600 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition shadow-md flex items-center gap-1.5"
            >
              <span>Explore History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentTab('leaders')}
              className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition border border-white/20 flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-amber-300" />
              <span>Youth Council</span>
            </button>
          </div>
        </section>

        {/* 2. Culture Bento (1 col, 1 row) */}
        <section
          onClick={() => setCurrentTab('cultures')}
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Traditions
            </span>
            <Waves className="w-5 h-5 text-blue-800 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 leading-snug group-hover:text-blue-800 transition-colors">
              Jal Puja &amp; River Rites
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              Sacred offerings to river deities ensuring safe boat passage and rich fish harvests.
            </p>
          </div>
          <div className="text-xs font-bold text-blue-800 flex items-center gap-1 group-hover:text-red-600 transition-colors">
            <span>Learn More</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </section>

        {/* 3. Language Bento (1 col, 1 row) */}
        <section
          onClick={() => setCurrentTab('language')}
          className="bg-red-50 rounded-3xl p-6 border border-red-100 shadow-sm flex flex-col justify-between cursor-pointer group hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Dialect
            </span>
            <button
              onClick={playDemoAudio}
              className={`p-1.5 rounded-full transition-all ${
                playingAudio ? 'bg-red-600 text-white animate-bounce' : 'bg-red-200/60 text-red-700 hover:bg-red-600 hover:text-white'
              }`}
              title="Click to hear phrase: 'Kaha jahu? Ham Bote chhi'"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-red-950 leading-snug group-hover:text-red-600 transition-colors">
              Tarahi Bote Lexicon
            </h3>
            <p className="text-xs text-red-700/80 mt-1 line-clamp-2 leading-relaxed">
              Preserving an endangered oral dialect through active audio archiving and community dictionaries.
            </p>
          </div>
          <div className="text-xs font-bold text-red-600 flex items-center gap-1 group-hover:underline">
            <span>Hear Audio &amp; Dictionary</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </section>

        {/* 4. Craftsmanship / Canoe Bento (1 col, 2 rows) */}
        <section className="md:col-span-1 md:row-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Craftsmanship
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
          </div>

          <div className="h-36 bg-slate-100 rounded-2xl overflow-hidden relative group my-2">
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600"
              alt="Dugout Canoe"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex items-end p-3">
              <p className="text-white text-xs font-bold leading-tight">
                Dugout Canoes (Ek-Dunge Nau)
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-slate-900">Carved Simal Wood</h4>
            <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">
              Crafted from hollowed single trees, these historic vessels have navigated Nepal's fastest river rapids for centuries.
            </p>
          </div>

          <button
            onClick={() => setCurrentTab('cultures')}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm"
          >
            View Gallery &amp; Craft
          </button>
        </section>

        {/* 5. Stat 1 Bento (1 col, 1 row) */}
        <section
          onClick={() => setCurrentTab('about')}
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition cursor-pointer group"
        >
          <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 group-hover:scale-105 transition-transform">
            11k
          </div>
          <div>
            <h4 className="text-2xl font-black text-slate-900 tracking-tight">11,258</h4>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Census Population
            </p>
          </div>
        </section>

        {/* 6. Stat 2 Bento (1 col, 1 row) */}
        <section
          onClick={() => setCurrentTab('leaders')}
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition cursor-pointer group"
        >
          <div className="w-14 h-14 bg-blue-100 text-blue-800 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 group-hover:scale-105 transition-transform">
            10
          </div>
          <div>
            <h4 className="text-2xl font-black text-slate-900 tracking-tight">Council Wards</h4>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Youth Committees
            </p>
          </div>
        </section>

        {/* 7. Youth Leadership List (2 cols, 1 row) */}
        <section className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold uppercase text-slate-900 tracking-wider">
                Active Youth Council
              </h3>
              <p className="text-xs text-slate-500">
                Grassroots leadership in Karmaiya, Sarlahi
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('leaders')}
              className="text-xs font-bold text-blue-800 hover:text-red-600 flex items-center gap-1 transition-colors"
            >
              <span>All {leaders.length} Leaders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3 py-1">
            {leadersSample.map((leader) => (
              <div
                key={leader.id}
                onClick={() => onSelectLeader(leader)}
                className="flex flex-col items-center text-center cursor-pointer group/leader"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200 group-hover/leader:border-red-600 transition-colors shadow-sm mb-1 bg-slate-100">
                  <img
                    src={leader.image && leader.image.trim() ? leader.image.trim() : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'}
                    alt={leader.name}
                    className="w-full h-full object-cover group-hover/leader:scale-110 transition-transform"
                  />
                </div>
                <p className="text-[11px] font-bold text-slate-900 truncate max-w-full leading-tight">
                  {leader.name.split(' ')[0]}
                </p>
                <p className="text-[9px] text-red-600 font-semibold truncate max-w-full">
                  {leader.role.split(' ')[0]}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Action Card Bento (1 col, 1 row) - Conditionally reflects join/member state */}
        {!hasJoinedCommunity ? (
          <section className="bg-red-600 rounded-3xl p-6 text-white flex flex-col justify-between shadow-lg hover:shadow-xl transition">
            <div>
              <span className="bg-red-700/80 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Join Community
              </span>
              <h3 className="text-lg font-black mt-2 leading-tight uppercase">
                Become a Member
              </h3>
            </div>
            <p className="text-xs text-white/90 leading-relaxed">
              Generate your verified digital member ID card and access scholarship funds.
            </p>
            <button
              onClick={() => setCurrentTab('join')}
              className="bg-white text-red-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition shadow-sm flex items-center justify-center gap-1 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Apply Now</span>
            </button>
          </section>
        ) : (
          <section className="bg-gradient-to-br from-emerald-700 to-teal-800 rounded-3xl p-6 text-white flex flex-col justify-between shadow-lg hover:shadow-xl transition">
            <div>
              <span className="bg-emerald-800/80 text-emerald-100 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
                <CheckCircle className="w-3 h-3 text-emerald-300" />
                <span>Verified Member</span>
              </span>
              <h3 className="text-lg font-black mt-2 leading-tight uppercase">
                Membership Active
              </h3>
            </div>
            <p className="text-xs text-emerald-50/90 leading-relaxed">
              You are a registered community member with official records on file.
            </p>
            <button
              onClick={() => setCurrentTab('join')}
              className="bg-white text-emerald-800 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-emerald-50 transition shadow-sm flex items-center justify-center gap-1 cursor-pointer"
            >
              <IdCard className="w-3.5 h-3.5" />
              <span>View ID Card</span>
            </button>
          </section>
        )}
      </div>
    </section>
  );
}
