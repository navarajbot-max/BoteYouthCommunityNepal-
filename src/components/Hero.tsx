/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCommunityData } from '../context/CommunityDataContext';
import { TabType } from '../types';
import { motion } from 'motion/react';
import InteractiveFollowModal from './InteractiveFollowModal';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Palette,
  Users,
  Award,
  BookOpen,
  Anchor,
  UserCheck,
  Heart,
  CheckCircle,
  IdCard
} from 'lucide-react';

interface HeroProps {
  setCurrentTab: (tab: TabType) => void;
  openCustomizer: () => void;
}

export default function Hero({ setCurrentTab, openCustomizer }: HeroProps) {
  const { colors, theme } = useTheme();
  const {
    communityMetrics,
    hasJoinedCommunity,
    hideJoinOption,
    isFollowingCommunity,
    followerCount,
    followerEmail,
    followCommunity
  } = useCommunityData();

  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);

  const handleHeroFollow = () => {
    if (isFollowingCommunity) return;
    setIsFollowModalOpen(true);
  };

  return (
    <section className="relative overflow-hidden text-white pt-16 pb-24 sm:pt-20 sm:pb-32" id="hero">
      {/* Dynamic Animated Gradient Background - Nepali Flag Palette */}
      <motion.div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          background: 'linear-gradient(135deg, #001f54 0%, #003893 30%, #7b0015 65%, #DC143C 100%)'
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Decorative Nepali Flag Triangular Geometry & River Waves */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1000 600">
          <polygon points="0,0 450,250 0,500" fill="#ffffff" opacity="0.15" />
          <polygon points="0,200 400,420 0,600" fill="#f59e0b" opacity="0.1" />
          <path d="M0,450 Q250,400 500,460 T1000,430 L1000,600 L0,600 Z" fill="#003893" opacity="0.4" />
        </svg>
      </div>

      {/* Hero Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-md border border-white/30 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase text-amber-300 shadow-md"
        >
          <span className="text-sm">🇳🇵</span>
          <span>BoteYouthCommunityNepal | Prime Nepali Flag Theme</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black font-poppins tracking-tight max-w-5xl mx-auto leading-[1.12]"
        >
          Preserving Our River Heritage,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-white to-red-200">
            Empowering Bote Youth
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed"
        >
          Official portal of the Bote Community of Karmaiya, Sarlahi District, Nepal. Safeguarding our ancient single-log canoe craft, revitalizing the endangered Tarahi Bote language, and funding education for the next generation.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          {/* Conditional Join: If registered or followed with Gmail, hide Join option */}
          {!hideJoinOption ? (
            <button
              onClick={() => setCurrentTab('join')}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold px-7 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-white" />
              <span>Join Us &amp; Get Digital ID</span>
            </button>
          ) : hasJoinedCommunity ? (
            <button
              onClick={() => setCurrentTab('join')}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer"
            >
              <IdCard className="w-4 h-4 text-white" />
              <span>View My Member ID Card</span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentTab('follow')}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Shield className="w-4 h-4 text-white" />
              <span>Verified Follower Active</span>
            </button>
          )}

          {/* One-Time Following Button */}
          <button
            onClick={handleHeroFollow}
            disabled={isFollowingCommunity}
            className={`w-full sm:w-auto font-bold px-7 py-3.5 rounded-full shadow-md transition-all text-xs uppercase tracking-wider flex items-center justify-center space-x-2 ${
              isFollowingCommunity
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 cursor-default'
                : 'bg-white/20 hover:bg-white/30 text-white border border-white/40 cursor-pointer backdrop-blur-sm hover:scale-105 active:scale-95'
            }`}
            title={
              isFollowingCommunity
                ? `Following active with ${followerEmail || 'verified Gmail'}`
                : 'Click for one-time follow with Gmail'
            }
          >
            {isFollowingCommunity ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Following ({followerCount})</span>
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                <span>Follow Community ({followerCount})</span>
              </>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('leaders')}
            className="w-full sm:w-auto bg-white hover:bg-slate-100 text-blue-900 font-bold px-7 py-3.5 rounded-full shadow-md transition-all text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Users className="w-4 h-4 text-red-600" />
            <span>Meet Youth Leaders</span>
          </button>
        </motion.div>

        {/* Quick Stats Bento Strip - Dynamically Managed from Admin Settings */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto border-t border-white/20 mt-12 text-center"
        >
          {communityMetrics && communityMetrics.length > 0 ? (
            communityMetrics.slice(0, 4).map((metric) => (
              <div
                key={metric.id}
                id={`hero-metric-${metric.id}`}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition group cursor-default"
                title={`${metric.title}: ${metric.subtitle || ''}${metric.sourceCitation ? ` (${metric.sourceCitation})` : ''}`}
              >
                <div className={`text-3xl font-black font-poppins ${metric.highlightColor || 'text-white'} group-hover:scale-105 transition-transform duration-200`}>
                  {metric.value}
                </div>
                <div className="text-xs text-white/85 font-bold uppercase tracking-wider mt-1">
                  {metric.title}
                </div>
                {metric.subtitle && (
                  <div className="text-[10px] text-white/60 font-medium truncate mt-0.5">
                    {metric.subtitle}
                  </div>
                )}
              </div>
            ))
          ) : (
            <>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition">
                <div className="text-3xl font-black font-poppins text-white">11,258+</div>
                <div className="text-xs text-white/80 font-bold uppercase tracking-wider mt-1">
                  Bote Population
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition">
                <div className="text-3xl font-black font-poppins text-white">10</div>
                <div className="text-xs text-white/80 font-bold uppercase tracking-wider mt-1">
                  Council Wards
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition">
                <div className="text-3xl font-black font-poppins text-white">NPR 50k</div>
                <div className="text-xs text-white/80 font-bold uppercase tracking-wider mt-1">
                  Scholarship Fund
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition">
                <div className="text-3xl font-black font-poppins text-amber-300">100%</div>
                <div className="text-xs text-white/80 font-bold uppercase tracking-wider mt-1">
                  Indigenous Pride
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Interactive Follow Modal */}
      <InteractiveFollowModal
        isOpen={isFollowModalOpen}
        onClose={() => setIsFollowModalOpen(false)}
      />
    </section>
  );
}
