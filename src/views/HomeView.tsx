/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import Hero from '../components/Hero';
import BentoGridSection from '../components/BentoGridSection';
import LeaderProfileCard from '../components/LeaderProfileCard';
import { TabType, LeaderProfile } from '../types';
import { CULTURAL_TRADITIONS, SCHOLARSHIPS_DATA } from '../data/communityData';
import { useCommunityData } from '../context/CommunityDataContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Shield,
  Award,
  BookOpen,
  Vote,
  CheckCircle,
  Users,
  Compass,
  Anchor,
  UserCheck,
  Palette,
  Heart,
  Download,
  Flame,
  Phone,
  Mail,
  Layout,
  IdCard,
  Megaphone,
  Calendar,
  FileText,
  Pin,
  Plus,
  Sparkles,
  X,
  RotateCcw,
  TrendingUp
} from 'lucide-react';

interface HomeViewProps {
  setCurrentTab: (tab: TabType) => void;
  openCustomizer: () => void;
  onSelectLeader: (leader: LeaderProfile) => void;
}

export default function HomeView({ setCurrentTab, openCustomizer, onSelectLeader }: HomeViewProps) {
  const { colors, theme } = useTheme();
  const {
    leaders,
    pillarsConfig,
    hasJoinedCommunity,
    joinedMemberData,
    isFollowingCommunity,
    followerCount,
    followCommunity,
    posts,
    communityPoll,
    votePoll,
    addPollOption
  } = useCommunityData();

  // Active Poll Config
  const pollConfig = communityPoll || {
    id: 'bote-heritage-priorities-2026',
    title: 'Which Bote heritage initiative should youth prioritize next?',
    titleNepali: 'युवाले अब कुन बोटे सांस्कृतिक तथा सामुदायिक योजनालाई प्राथमिकता दिनुपर्छ?',
    subtitle: 'Every vote helps our Executive Committee allocate sponsorship grants and volunteer hours for Sarlahi district projects.',
    subtitleNepali: 'प्रत्येक मतले हाम्रो कार्यसमितिलाई सर्लाही जिल्ला तथा बागमती क्षेत्रका परियोजनाहरूको लागि बजेट तथा स्वयंसेवक परिचालन गर्न मद्दत गर्दछ।',
    isActive: true,
    allowMemberSuggestions: true,
    options: [],
    voterLogs: [],
    totalVotes: 0
  };

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(() => {
    try {
      const pid = communityPoll?.id || 'bote-heritage-priorities-2026';
      return !!localStorage.getItem('bycn_member_voted_poll_' + pid);
    } catch {
      return false;
    }
  });
  const [votedOptionId, setVotedOptionId] = useState<string | null>(() => {
    try {
      const pid = communityPoll?.id || 'bote-heritage-priorities-2026';
      return localStorage.getItem('bycn_member_voted_poll_' + pid);
    } catch {
      return null;
    }
  });

  const [isVoting, setIsVoting] = useState(false);
  const [voteMessage, setVoteMessage] = useState<string | null>(null);
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [filterOptionType, setFilterOptionType] = useState<'all' | 'official' | 'member'>('all');

  // Proposal modal fields
  const [suggestText, setSuggestText] = useState('');
  const [suggestTextNepali, setSuggestTextNepali] = useState('');
  const [suggestProposerName, setSuggestProposerName] = useState('');
  const [suggestWard, setSuggestWard] = useState('11');
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);

  // Sync default proposer name from registered member data if available
  useEffect(() => {
    if (joinedMemberData?.fullName && !suggestProposerName) {
      setSuggestProposerName(joinedMemberData.fullName);
    }
    if (joinedMemberData?.ward) {
      setSuggestWard(joinedMemberData.ward);
    }
  }, [joinedMemberData]);

  // Sync vote status if poll ID changes
  useEffect(() => {
    try {
      const pid = communityPoll?.id || 'bote-heritage-priorities-2026';
      const stored = localStorage.getItem('bycn_member_voted_poll_' + pid);
      if (stored) {
        setVotedOptionId(stored);
        setHasVoted(true);
      }
    } catch {}
  }, [communityPoll?.id]);

  const handleCastVote = async () => {
    if (!selectedOptionId || isVoting) return;
    setIsVoting(true);
    setVoteMessage(null);
    try {
      const res = await votePoll(selectedOptionId, {
        name: joinedMemberData?.fullName || 'Community Youth Member',
        email: joinedMemberData?.email || '',
        membershipId: joinedMemberData?.membershipId || ''
      });
      if (res.success) {
        setHasVoted(true);
        setVotedOptionId(selectedOptionId);
        setVoteMessage(res.message);
      } else {
        setVoteMessage(res.message);
      }
    } catch (err: any) {
      setVoteMessage(err?.message || 'Voting failed');
    } finally {
      setIsVoting(false);
    }
  };

  const handleProposeNewOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestText.trim() || isSubmittingProposal) return;
    setIsSubmittingProposal(true);
    setVoteMessage(null);
    try {
      const author = suggestProposerName.trim()
        ? suggestProposerName.trim() + (suggestWard ? ` (वडा ${suggestWard})` : '')
        : (joinedMemberData?.fullName || 'Community Member');

      const res = await addPollOption(
        suggestText.trim(),
        suggestTextNepali.trim() || undefined,
        author,
        {
          email: joinedMemberData?.email,
          membershipId: joinedMemberData?.membershipId
        }
      );

      if (res.success) {
        setHasVoted(true);
        if (res.newOption) {
          setVotedOptionId(res.newOption.id);
          setSelectedOptionId(res.newOption.id);
        }
        setSuggestText('');
        setSuggestTextNepali('');
        setIsSuggestModalOpen(false);
        setVoteMessage(res.message);
      } else {
        setVoteMessage(res.message);
      }
    } catch (err: any) {
      setVoteMessage(err?.message || 'Failed to submit proposal');
    } finally {
      setIsSubmittingProposal(false);
    }
  };

  // 4 Featured Leaders for homepage preview - always reads live from dynamic community data
  const featuredLeaders = leaders.slice(0, 4);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <Hero setCurrentTab={setCurrentTab} openCustomizer={openCustomizer} />

      {/* 2. Flagship Bento Grid Showcase */}
      <BentoGridSection
        setCurrentTab={setCurrentTab}
        openCustomizer={openCustomizer}
        onSelectLeader={onSelectLeader}
      />

      {/* 3. Four Core Pillars: Heritage, Language, Dress & Youth Leadership */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[#DC143C] text-xs font-black uppercase tracking-widest">
            {pillarsConfig?.tag || 'Core Pillars of Bote Community'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-poppins text-slate-900 leading-tight">
            {pillarsConfig?.title || 'Heritage Preserved, Generation Empowered'}
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            {pillarsConfig?.desc || 'From the banks of the Bagmati River in Karmaiya, Sarlahi to settlements across inner-Terai Nepal, our community unites to protect our indigenous identity.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Bote History */}
          <div
            onClick={() => setCurrentTab('history')}
            className="group cursor-pointer bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border-t-4 border-t-[#DC143C]"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#DC143C] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-poppins font-extrabold text-lg text-slate-900 group-hover:text-[#DC143C] transition-colors">
                {pillarsConfig?.p1Title || 'Bote History & Origins'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {pillarsConfig?.p1Desc || 'The legend of the tree trunk origin ("Bot"), river ferry kings (Kings of Water), and the single-log dugout canoe (Ek-Dunge Nau).'}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-[#DC143C]">
              <span>Read History</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Culture & River Rituals */}
          <div
            onClick={() => setCurrentTab('cultures')}
            className="group cursor-pointer bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border-t-4 border-t-[#003893]"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#003893] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Anchor className="w-6 h-6" />
              </div>
              <h3 className="font-poppins font-extrabold text-lg text-slate-900 group-hover:text-[#003893] transition-colors">
                {pillarsConfig?.p2Title || 'Cultures & River Rituals'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {pillarsConfig?.p2Desc || 'Sacred river deities, Sansari Devi Puja, Jal Puja, Maghe Sankranti boat races, and ancient animist water worship.'}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-[#003893]">
              <span>Explore Rituals</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Language & Tarahi Lexicon */}
          <div
            onClick={() => setCurrentTab('language')}
            className="group cursor-pointer bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border-t-4 border-t-amber-500"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-poppins font-extrabold text-lg text-slate-900 group-hover:text-amber-600 transition-colors">
                {pillarsConfig?.p3Title || 'Bote Language (Tarahi)'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {pillarsConfig?.p3Desc || 'Saving the endangered Tarahi Bote dialect. Searchable 18+ word lexicon dictionary with phonetic pronunciations.'}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-amber-600">
              <span>Study Dialect</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Culture Dress & Jewelry */}
          <div
            onClick={() => setCurrentTab('dress')}
            className="group cursor-pointer bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border-t-4 border-t-[#DC143C]"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#DC143C] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-poppins font-extrabold text-lg text-slate-900 group-hover:text-[#DC143C] transition-colors">
                {pillarsConfig?.p4Title || 'Culture Dress & Jewelry'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {pillarsConfig?.p4Desc || 'The traditional Gunya, Cholo, Dhoti, and solid silver Hansuli necklaces, Bulaki nose rings, and Kalli anklets.'}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-[#DC143C]">
              <span>View Dress</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Leadership Showcase (Youth Leader Chairman, VP, Secretary & Community Chairman) */}
      <section className="bg-slate-100 py-16 border-y border-slate-200" id="featured-leaders">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider text-[#003893]">
                <Shield className="w-4 h-4 text-[#DC143C]" />
                <span>Executive Leadership Roster</span>
              </div>
              <h2 className="text-3xl font-black font-poppins text-slate-900 leading-tight">
                Youth Leaders &amp; Community Council
              </h2>
              <p className="text-xs text-slate-500 max-w-xl">
                Dedicated representatives steering cultural preservation, legal recognition, and educational scholarships across Karmaiya, Sarlahi.
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('leaders')}
              className="bg-[#003893] hover:bg-[#002766] text-white text-xs font-bold px-6 py-3 rounded-full transition-all shadow-md flex items-center space-x-2 shrink-0"
            >
              <span>View All {leaders.length} Leader Profiles</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredLeaders.map((leader) => (
              <LeaderProfileCard
                key={leader.id}
                leader={leader}
                onSelectLeader={onSelectLeader}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Community Joining Form Quick CTA & Digital ID Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-3xl p-8 sm:p-12 text-white shadow-lg relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 border-2 border-blue-800 bg-gradient-to-br from-blue-900 to-blue-950"
        >
          <div className="space-y-4 max-w-2xl text-center lg:text-left z-10">
            {!hasJoinedCommunity ? (
              <>
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm inline-block">
                  Community Membership
                </span>
                <h3 className="text-3xl sm:text-4xl font-black font-poppins leading-tight uppercase tracking-tight">
                  Get Your Official Bote Youth Community Digital Identity Card
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Register online in less than 2 minutes. Upload your photo to generate an instant printable member card with custom Member ID (e.g. <code>BYCN-2026-XXXX</code>) and verified council stamp.
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <button
                    onClick={() => setCurrentTab('join')}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-7 py-3.5 rounded-full shadow-md transition-all text-xs uppercase tracking-wider flex items-center space-x-2 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Fill Joining Form</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('scholarships')}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-full border border-white/20 transition-all text-xs uppercase tracking-wider"
                  >
                    Apply for Scholarships &rarr;
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm inline-flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Official Member Active</span>
                </span>
                <h3 className="text-3xl sm:text-4xl font-black font-poppins leading-tight uppercase tracking-tight text-emerald-300">
                  Your Digital Identity Card is Active &amp; Verified
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  You are registered in the Bote Youth Community Nepal records. You can view, download, or print your verified Member ID card anytime, or stay updated on community activities.
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <button
                    onClick={() => setCurrentTab('join')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3.5 rounded-full shadow-md transition-all text-xs uppercase tracking-wider flex items-center space-x-2 cursor-pointer"
                  >
                    <IdCard className="w-4 h-4" />
                    <span>View My Official ID Card</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('follow')}
                    className="bg-white/15 hover:bg-white/25 text-white font-bold px-6 py-3.5 rounded-full border border-white/30 transition-all text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                    <span>Follow Community Updates ({followerCount})</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Miniature Card Visual */}
          <div className="w-72 bg-white text-slate-900 rounded-2xl p-4 shadow-2xl border-2 border-white/40 transform rotate-2 hover:rotate-0 transition-transform">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
              <span className="text-[10px] font-black text-[#DC143C] uppercase">BOTE YOUTH NEPAL</span>
              <span className="text-[9px] font-mono font-bold bg-blue-100 text-[#003893] px-1.5 py-0.5 rounded">ID CARD</span>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-14 h-16 rounded-lg bg-slate-200 overflow-hidden border border-slate-300 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400"
                  alt="Member"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-0.5 text-[11px]">
                <p className="font-extrabold text-slate-900 leading-tight">Navaraj Bote</p>
                <p className="text-[9px] text-[#DC143C] font-bold uppercase">Youth Chairman</p>
                <p className="text-[9px] text-slate-500 font-mono">BYCN-2026-1042</p>
                <p className="text-[9px] text-slate-600">Karmaiya, Sarlahi</p>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-500">
              <span>🇳🇵 Verified Member</span>
              <span className="text-green-600 font-bold">Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5B. Official Notices, Meetings & Community Communications */}
      {posts && posts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-[#003893] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                  <Megaphone className="w-3 h-3" />
                  <span>Official Communications</span>
                </div>
                <h3 className="text-2xl font-black font-poppins text-white">
                  Latest Notices, Meetings &amp; Announcements
                </h3>
              </div>

              <button
                onClick={() => setCurrentTab('notices')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#003893] hover:bg-slate-100 rounded-xl text-xs font-bold transition shadow-sm shrink-0 cursor-pointer"
              >
                <span>View All Updates ({posts.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {posts.slice(0, 3).map((post) => (
                <div
                  key={post.id}
                  onClick={() => setCurrentTab('notices')}
                  className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/15 transition cursor-pointer flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-bold text-amber-300 uppercase tracking-wider">
                        {post.type}
                      </span>
                      {post.pinned && (
                        <span className="text-[10px] font-black text-amber-400 flex items-center gap-1">
                          <Pin className="w-3 h-3 fill-amber-400" /> Pinned
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-white text-sm group-hover:text-amber-300 transition line-clamp-2">
                      {post.title}
                    </h4>
                    {post.summary && (
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {post.summary}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recent'}</span>
                    <span className="text-amber-300 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      Details &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Live Community Voice & Heritage Initiative Poll */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Poll Info & Actions */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-black uppercase text-amber-700 tracking-wider">
              <Vote className="w-4 h-4 text-amber-600" />
              <span>Live Community Voice</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black font-poppins text-slate-900 leading-tight">
              {pollConfig.title || 'Which Bote heritage initiative should youth prioritize next?'}
            </h3>

            {pollConfig.titleNepali && (
              <p className="text-sm font-bold text-slate-700 font-nepali">
                {pollConfig.titleNepali}
              </p>
            )}

            <p className="text-xs text-slate-500 leading-relaxed">
              {pollConfig.subtitle ||
                'Every vote helps our Executive Committee allocate sponsorship grants and volunteer hours for Sarlahi district projects.'}
            </p>

            {pollConfig.subtitleNepali && (
              <p className="text-xs text-slate-500 leading-relaxed font-nepali">
                {pollConfig.subtitleNepali}
              </p>
            )}

            {/* Live Stats Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <Users className="w-4 h-4 text-red-600" />
                  <span>Total Votes Cast:</span>
                </span>
                <span className="font-mono text-sm font-black text-slate-900">
                  {pollConfig.totalVotes || 0} मत
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Active Options:</span>
                <span className="font-bold text-slate-800">
                  {pollConfig.options?.length || 0} initiatives
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                <span className="text-[11px] text-slate-500">Status:</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {pollConfig.isActive ? 'Voting Open (खुल्ला)' : 'Poll Closed'}
                </span>
              </div>
            </div>

            {/* Add More Options Self Button */}
            {pollConfig.allowMemberSuggestions && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsSuggestModalOpen(true)}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs uppercase tracking-wider py-3 px-4 rounded-2xl transition shadow-sm flex items-center justify-center gap-2 group"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                  <span>+ Suggest / Add Your Initiative (आफ्नो नयाँ योजना थप्नुहोस्)</span>
                </button>
                <p className="text-[10.5px] text-slate-500 text-center mt-1.5">
                  Members can propose their own heritage priority to live voting.
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Initiatives List & Interactive Voting */}
          <div className="lg:col-span-7 space-y-4">
            {/* Filter Pills */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="inline-flex p-1 bg-slate-100 rounded-2xl text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setFilterOptionType('all')}
                  className={`px-3 py-1 rounded-xl transition ${
                    filterOptionType === 'all'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({pollConfig.options?.length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterOptionType('official')}
                  className={`px-3 py-1 rounded-xl transition ${
                    filterOptionType === 'official'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Official
                </button>
                <button
                  type="button"
                  onClick={() => setFilterOptionType('member')}
                  className={`px-3 py-1 rounded-xl transition ${
                    filterOptionType === 'member'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Member Suggested
                </button>
              </div>

              {hasVoted && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>You Have Voted</span>
                </span>
              )}
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {(pollConfig.options || [])
                .filter((opt) => {
                  if (filterOptionType === 'official') return opt.addedBy !== 'member';
                  if (filterOptionType === 'member') return opt.addedBy === 'member';
                  return true;
                })
                .map((opt, i) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isMyVote = votedOptionId === opt.id;
                  const total = pollConfig.totalVotes || 0;
                  const pct = total > 0 ? Math.round(((opt.votes || 0) / total) * 100) : 0;
                  const isMemberAdded = opt.addedBy === 'member';

                  return (
                    <div
                      key={opt.id}
                      onClick={() => {
                        if (!hasVoted || pollConfig.isActive) {
                          setSelectedOptionId(opt.id);
                        }
                      }}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#DC143C] bg-red-50/70 shadow-sm'
                          : isMyVote
                          ? 'border-emerald-500 bg-emerald-50/40'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 text-xs font-bold text-slate-800 mb-1.5">
                        <div className="flex items-start gap-2.5 flex-1">
                          <span
                            className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center transition ${
                              isSelected
                                ? 'bg-[#DC143C] border-[#DC143C] text-white'
                                : isMyVote
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-slate-300'
                            }`}
                          >
                            {(isSelected || isMyVote) && (
                              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                            )}
                          </span>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-slate-900 leading-snug">{opt.text}</span>
                              {isMyVote && (
                                <span className="bg-emerald-600 text-white text-[9.5px] font-black px-2 py-0.2 rounded-full">
                                  ✓ Your Vote
                                </span>
                              )}
                              {isMemberAdded && (
                                <span className="bg-purple-100 text-purple-800 text-[9.5px] font-black px-1.5 py-0.2 rounded-full">
                                  👤 {opt.suggestedByName || 'Member Suggested'}
                                </span>
                              )}
                            </div>

                            {opt.textNepali && (
                              <p className="text-[11px] text-slate-600 font-normal font-nepali">
                                {opt.textNepali}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Percent badge */}
                        {(hasVoted || total > 0) && (
                          <div className="text-right shrink-0">
                            <span className="text-red-700 font-mono font-bold text-xs">
                              {pct}%
                            </span>
                            <p className="text-[10px] text-slate-400 font-mono">
                              ({opt.votes || 0} votes)
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Percentage Bar */}
                      {(hasVoted || total > 0) && (
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                          <div
                            className={`h-full transition-all duration-500 ${
                              isMyVote
                                ? 'bg-emerald-600'
                                : isSelected
                                ? 'bg-[#DC143C]'
                                : 'bg-red-500/80'
                            }`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            {/* Voting Actions Bar */}
            <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {hasVoted ? (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Your vote is recorded in live community records. Thank you!</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Want to vote for another initiative? Select it above and click Update Vote.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Select your priority initiative above to cast your official vote.
                </p>
              )}

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={handleCastVote}
                  disabled={!selectedOptionId || isVoting}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full transition-all shadow-sm flex items-center gap-1.5"
                >
                  {isVoting ? (
                    <span>Recording Vote...</span>
                  ) : hasVoted ? (
                    <span>Update Your Vote</span>
                  ) : (
                    <span>Cast Your Vote</span>
                  )}
                </button>
              </div>
            </div>

            {voteMessage && (
              <p className="text-xs font-bold text-slate-700 bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                {voteMessage}
              </p>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* MODAL: MEMBER PROPOSE / ADD OWN HERITAGE INITIATIVE */}
        {/* ======================================================== */}
        {isSuggestModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Member Initiative Proposal</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 font-poppins">
                    Suggest / Add Your Own Initiative
                  </h3>
                  <p className="text-xs text-slate-500">
                    आफ्नो नयाँ योजना थप्नुहोस् — Your proposed option will be immediately added to the live poll and your vote recorded!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSuggestModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleProposeNewOption} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Initiative Title (English or Romanized) *
                  </label>
                  <input
                    type="text"
                    required
                    value={suggestText}
                    onChange={(e) => setSuggestText(e.target.value)}
                    placeholder="e.g. Establishing Bote Traditional Handicraft & Net-Weaving Center"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nepali Title / विवरण (वैकल्पिक / Optional)
                  </label>
                  <input
                    type="text"
                    value={suggestTextNepali}
                    onChange={(e) => setSuggestTextNepali(e.target.value)}
                    placeholder="e.g. बोटे परम्परागत हस्तकला तथा जाल बुनाई सीप विकास केन्द्र स्थापना"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-nepali"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Name / प्रस्तावकको नाम
                    </label>
                    <input
                      type="text"
                      value={suggestProposerName}
                      onChange={(e) => setSuggestProposerName(e.target.value)}
                      placeholder="e.g. सुमित बोटे"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ward / वडा नं.
                    </label>
                    <input
                      type="text"
                      value={suggestWard}
                      onChange={(e) => setSuggestWard(e.target.value)}
                      placeholder="11 (Karmaiya)"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                {hasJoinedCommunity && (
                  <p className="text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      Voting as verified registered member ({joinedMemberData?.membershipId || 'Active Member'}).
                    </span>
                  </p>
                )}

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsSuggestModalOpen(false)}
                    className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingProposal || !suggestText.trim()}
                    className="bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 disabled:opacity-50 text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow"
                  >
                    {isSubmittingProposal ? 'Adding...' : 'Add Initiative & Cast Vote'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
