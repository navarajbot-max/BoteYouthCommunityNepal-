/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType } from '../types';
import { useCommunityData } from '../context/CommunityDataContext';
import { Anchor, Sparkles, Music, Volume2, VolumeX, ArrowRight } from 'lucide-react';
import { resolveAssetUrl } from '../services/storagePersistence';

interface CulturesViewProps {
  setCurrentTab: (tab: TabType) => void;
}

export default function CulturesView({ setCurrentTab }: CulturesViewProps) {
  const { culturalTraditions } = useCommunityData();

  const isBlockedImageHost = (imageUrl: string): boolean => {
    try {
      const hostname = new URL(imageUrl).hostname.toLowerCase();
      return hostname === 'images.unsplash.com';
    } catch {
      return false;
    }
  };
  const [playingChant, setPlayingChant] = useState(false);

  const toggleChant = () => {
    setPlayingChant(!playingChant);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#DC143C]">
          <Anchor className="w-4 h-4 text-[#003893]" />
          <span>Living Sacred Waters</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-poppins text-slate-900 leading-tight">
          Bote Culture, Rituals &amp; River Worship
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
          To be Bote is to belong to the sacred waters. For centuries, our spiritual existence has revolved around river deities, ancestral forest spirits, seasonal canoe races, and animist prayers across the Bagmati and Narayani rivers.
        </p>
      </div>

      {/* Interactive Sansari Devi Puja River Audio Simulation */}
      <div className="bg-gradient-to-r from-[#003893] via-[#8B0000] to-[#DC143C] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border-2 border-amber-400">
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-[10px] bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full uppercase font-black tracking-wider">
            Oral Heritage Soundscape
          </span>
          <h3 className="font-poppins font-black text-xl text-white">
            Sansari Devi Sacred River Chants &amp; Khainjadi Rhythm
          </h3>
          <p className="text-xs text-white/90 leading-relaxed max-w-xl">
            Listen to traditional rhythmic prayers recited by Bote elder women invoking river spirits before launching newly hollowed wooden boats onto the water.
          </p>
        </div>

        <button
          onClick={toggleChant}
          className="bg-white hover:bg-slate-100 text-[#003893] font-black px-6 py-3.5 rounded-full text-xs uppercase tracking-wider shadow-lg flex items-center space-x-2 shrink-0 transition-transform active:scale-95"
        >
          {playingChant ? (
            <>
              <VolumeX className="w-4 h-4 text-red-600 animate-pulse" />
              <span>Pause Soundscape</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-[#DC143C]" />
              <span>Play River Chant</span>
            </>
          )}
        </button>
      </div>

      {playingChant && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 text-xs text-slate-800 space-y-2 animate-in fade-in duration-300">
          <p className="font-bold text-[#DC143C] flex items-center gap-1.5">
            <Music className="w-4 h-4" />
            <span>Now Playing: Sansari Devi River Chant (Karmaiya Ghat Sacred Invocation)</span>
          </p>
          <p className="italic font-mono text-slate-600 text-[11px]">
            "हे संसारी माई, बागमतीका गहिरा दहमा डुङ्गा तार्दा हाम्रा युवाहरूको रक्षा गर, माछाका भुरा जोगियोस्, शीतल जल सधैं बगोस्..."
          </p>
        </div>
      )}

      {/* Cultural Traditions List */}
      <div className="space-y-8">
        {culturalTraditions.map((trad) => (
          <div
            key={trad.id}
            className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-start hover:shadow-md transition-shadow"
          >
            <div className="w-full md:w-56 h-48 rounded-2xl overflow-hidden shadow shrink-0 bg-slate-100 border border-slate-200">
              <img
                src={resolveAssetUrl(trad.image && trad.image.trim() && !isBlockedImageHost(trad.image.trim()) ? trad.image.trim() : '/favicon.svg')}
                alt={trad.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase text-[#DC143C] bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                  {trad.category}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {trad.season}
                </span>
              </div>

              <div>
                <h3 className="font-poppins font-black text-xl text-slate-900 leading-tight">
                  {trad.title}
                </h3>
                <p className="text-xs font-semibold text-[#003893] mt-0.5">
                  {trad.titleNepali}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {trad.description}
              </p>

              {/* Rituals list */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  Key Ritual Practices:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {trad.rituals.map((r, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#DC143C] mt-1.5 shrink-0"></span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation link to Language & Dress */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
        <button
          onClick={() => setCurrentTab('language')}
          className="bg-white hover:bg-slate-50 border-2 border-amber-300 rounded-3xl p-6 text-left shadow-sm flex items-center justify-between group transition-all"
        >
          <div>
            <span className="text-[10px] font-black uppercase text-amber-700">Next Exploration</span>
            <h4 className="text-lg font-bold text-slate-900 font-poppins mt-1">Bote Language (Tarahi Lexicon)</h4>
            <p className="text-xs text-slate-500 mt-0.5">Searchable 18+ word interactive vocabulary dictionary</p>
          </div>
          <ArrowRight className="w-5 h-5 text-amber-600 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => setCurrentTab('dress')}
          className="bg-white hover:bg-slate-50 border-2 border-[#DC143C] rounded-3xl p-6 text-left shadow-sm flex items-center justify-between group transition-all"
        >
          <div>
            <span className="text-[10px] font-black uppercase text-[#DC143C]">Attire &amp; Adornment</span>
            <h4 className="text-lg font-bold text-slate-900 font-poppins mt-1">Culture Dress &amp; Silver Jewelry</h4>
            <p className="text-xs text-slate-500 mt-0.5">Explore Gunya, Dhoti, Hansuli, Bulaki and Kalli ornaments</p>
          </div>
          <ArrowRight className="w-5 h-5 text-[#DC143C] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
