/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType, LeaderProfile } from '../types';
import { useCommunityData } from '../context/CommunityDataContext';
import LeaderProfileCard from '../components/LeaderProfileCard';
import {
  Users,
  Shield,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Search,
  Filter,
  CheckCircle,
  Sparkles,
  UserPlus,
  IdCard,
  Heart
} from 'lucide-react';

interface LeadersViewProps {
  setCurrentTab: (tab: TabType) => void;
  onSelectLeader: (leader: LeaderProfile) => void;
}

export default function LeadersView({ setCurrentTab, onSelectLeader }: LeadersViewProps) {
  const { leaders, hasJoinedCommunity, isFollowingCommunity, followerCount } = useCommunityData();
  const [filter, setFilter] = useState<'all' | 'youth' | 'community'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLeaders = leaders.filter((leader) => {
    const matchesCategory = filter === 'all' || leader.category === filter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      leader.name.toLowerCase().includes(query) ||
      leader.role.toLowerCase().includes(query) ||
      leader.ward.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Top Banner with Nepali Flag Style */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#003893]">
          <Shield className="w-4 h-4 text-[#DC143C]" />
          <span>Executive Representation</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-poppins text-slate-900 leading-tight">
          Bote Youths Leader &amp; Community Committee
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
          Meet the 10 dedicated executive officers guiding Bote Youth Community Nepal (BoteYouthCommunityNepal). Combining the vibrant dynamism of the Youth Leadership Committee with the customary wisdom of the Central Community Council.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Toggles */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`text-xs px-4 py-2 rounded-xl font-bold transition-all ${
              filter === 'all'
                ? 'bg-[#DC143C] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All 10 Leadership Profiles (सबै)
          </button>
          <button
            onClick={() => setFilter('youth')}
            className={`text-xs px-4 py-2 rounded-xl font-bold transition-all ${
              filter === 'youth'
                ? 'bg-[#DC143C] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Youth Leadership Committee (युवा समिति - ४)
          </button>
          <button
            onClick={() => setFilter('community')}
            className={`text-xs px-4 py-2 rounded-xl font-bold transition-all ${
              filter === 'community'
                ? 'bg-[#003893] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Central Community Council (मूल समिति - ६)
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, role or ward..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#003893] bg-slate-50"
          />
        </div>
      </div>

      {/* Interaction Hint */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-2">
        <span className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Interactive Cards: Hover or tap any leader card to reveal direct phone, email, and portfolios.</span>
        </span>
        <span className="text-slate-400 text-[11px] hidden sm:inline">
          Showing {filteredLeaders.length} of {leaders.length} leaders
        </span>
      </div>

      {/* 10 Dynamic Leader Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeaders.map((leader) => (
          <LeaderProfileCard
            key={leader.id}
            leader={leader}
            onSelectLeader={onSelectLeader}
          />
        ))}
      </div>

      {/* Action to Join or View Member Status */}
      {!hasJoinedCommunity ? (
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 text-center space-y-4">
          <h3 className="text-2xl font-black font-poppins text-slate-900">
            Want to Serve in the Bote Youth Leadership Committee?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Every registered youth member aged 15-35 can volunteer for portfolios in river cleanup, language transcription, and scholarship mentoring.
          </p>
          <button
            onClick={() => setCurrentTab('join')}
            className="bg-[#DC143C] hover:bg-[#b51031] text-white text-xs font-black uppercase tracking-wider px-8 py-3.5 rounded-full shadow-lg transition-all cursor-pointer"
          >
            Submit Community Joining Form
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-200 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Registered Community Member</span>
          </div>
          <h3 className="text-2xl font-black font-poppins text-emerald-950">
            Your Leadership Participation is Welcomed
          </h3>
          <p className="text-xs sm:text-sm text-emerald-800 max-w-xl mx-auto">
            Your official Bote Youth Community Nepal membership is verified. Reach out directly to committee portfolio leads or review your digital identity card.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <button
              onClick={() => setCurrentTab('join')}
              className="bg-[#003893] hover:bg-blue-900 text-white text-xs font-black uppercase tracking-wider px-7 py-3 rounded-full shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <IdCard className="w-4 h-4" />
              <span>View My Member ID</span>
            </button>
            <button
              onClick={() => setCurrentTab('follow')}
              className="bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>Follow Leaders ({followerCount})</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
