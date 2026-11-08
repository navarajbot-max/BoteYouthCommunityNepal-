/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType, TraditionalDressItem, CostumeItem } from '../types';
import { useCommunityData } from '../context/CommunityDataContext';
import { Award, ArrowRight, CheckCircle, Sparkles, Shirt, Gem, Tag } from 'lucide-react';
import { resolveAssetUrl } from '../services/storagePersistence';

interface CultureDressViewProps {
  setCurrentTab: (tab: TabType) => void;
}

export default function CultureDressView({ setCurrentTab }: CultureDressViewProps) {
  const { dressItems, costumes } = useCommunityData();
  const [activeSection, setActiveSection] = useState<'costumes' | 'ornaments'>('costumes');
  const [selectedWearer, setSelectedWearer] = useState<'all' | 'women' | 'men'>('all');

  const filteredCostumes = costumes.filter((c) => {
    if (selectedWearer === 'all') return true;
    return c.wearer === selectedWearer || c.wearer === 'both';
  });

  const filteredDressItems = dressItems.filter((item) => {
    if (selectedWearer === 'all') return true;
    return item.gender === selectedWearer || item.gender === 'both';
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#DC143C]">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Textile, Costume &amp; Ornament Heritage</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-poppins text-slate-900 leading-tight">
          Bote Traditional Costumes &amp; Cultural Dress
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
          The traditional attire, ceremonial costumes, and silver ornamentation of the Bote indigenous community reflect centuries of living alongside rivers. Woven from durable hand-spun cotton and dyed with indigenous earthen tones, every garment embodies craftsmanship, river navigation resilience, and cultural pride.
        </p>

        {/* Section Selector: Costumes vs Ornaments */}
        <div className="pt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveSection('costumes')}
            className={`px-6 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2 ${
              activeSection === 'costumes'
                ? 'bg-[#DC143C] text-white shadow-lg shadow-red-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>Complete Costumes &amp; Attire ({costumes.length})</span>
          </button>
          <button
            onClick={() => setActiveSection('ornaments')}
            className={`px-6 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2 ${
              activeSection === 'ornaments'
                ? 'bg-[#003893] text-white shadow-lg shadow-blue-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Gem className="w-4 h-4" />
            <span>Traditional Dress &amp; Silver Jewelry ({dressItems.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <button
          onClick={() => setSelectedWearer('all')}
          className={`text-xs px-5 py-2 rounded-full font-bold transition-all ${
            selectedWearer === 'all'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          All (महिला र पुरुष सबै)
        </button>
        <button
          onClick={() => setSelectedWearer('women')}
          className={`text-xs px-5 py-2 rounded-full font-bold transition-all ${
            selectedWearer === 'women'
              ? 'bg-[#DC143C] text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          Women's Costumes &amp; Ornaments (महिला)
        </button>
        <button
          onClick={() => setSelectedWearer('men')}
          className={`text-xs px-5 py-2 rounded-full font-bold transition-all ${
            selectedWearer === 'men'
              ? 'bg-[#003893] text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          Men's River Dress &amp; Uniforms (पुरुष)
        </button>
      </div>

      {/* SECTION 1: COSTUMES SHOWCASE */}
      {activeSection === 'costumes' && (
        <div className="space-y-8">
          {filteredCostumes.map((costume) => (
            <div
              key={costume.id}
              className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-start hover:shadow-md transition-shadow"
            >
              <div className="w-full md:w-72 h-64 rounded-2xl overflow-hidden shadow shrink-0 bg-slate-100 border border-slate-200 relative group">
                <img
                  src={resolveAssetUrl(costume.image && costume.image.trim() && !costume.image.includes('images.unsplash.com') ? costume.image.trim() : '/favicon.svg')}
                  alt={costume.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-amber-300 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg">
                  {costume.category.toUpperCase()}
                </span>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-[#003893] bg-blue-50 px-2.5 py-0.5 rounded-full">
                      Wearer: {costume.wearer === 'women' ? 'Women' : costume.wearer === 'men' ? 'Men' : 'Universal'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      Fabric: {costume.fabric}
                    </span>
                  </div>
                  <h3 className="font-poppins font-black text-2xl sm:text-3xl text-slate-900 mt-2 leading-tight">
                    {costume.name}
                  </h3>
                  <p className="text-xs font-bold text-[#DC143C] mt-0.5">
                    {costume.nameNepali}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {costume.description}
                </p>

                <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/60 text-xs text-amber-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-900">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Cultural Significance &amp; River Rites:</span>
                  </div>
                  <p className="text-amber-900/90 leading-relaxed">
                    {costume.culturalSignificance}
                  </p>
                </div>

                {costume.accessories && costume.accessories.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-black uppercase text-slate-400 mr-1 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      <span>Paired Accessories:</span>
                    </span>
                    {costume.accessories.map((acc, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-lg border border-slate-200"
                      >
                        {acc}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 2: INDIVIDUAL DRESS & ORNAMENTS SHOWCASE */}
      {activeSection === 'ornaments' && (
        <div className="space-y-8">
          {filteredDressItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-start hover:shadow-md transition-shadow"
            >
              <div className="w-full md:w-64 h-56 rounded-2xl overflow-hidden shadow shrink-0 bg-slate-100 border border-slate-200">
                <img
                  src={resolveAssetUrl(item.image && item.image.trim() && !item.image.includes('images.unsplash.com') ? item.image.trim() : '/favicon.svg')}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#003893] bg-blue-50 px-2.5 py-0.5 rounded-full">
                    Category: {item.gender === 'women' ? 'Women\'s Dress' : item.gender === 'men' ? 'Men\'s Dress' : 'Universal Adornment'}
                  </span>
                  <h3 className="font-poppins font-black text-2xl text-slate-900 mt-2 leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-xs font-bold text-[#DC143C] mt-0.5">
                    {item.nameNepali}
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 text-xs text-slate-700">
                  <strong>Crafting Materials:</strong> {item.materials}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>

                {/* Functional features */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    Distinctive Characteristics:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                        <CheckCircle className="w-3.5 h-3.5 text-[#003893] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation button */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => setCurrentTab('language')}
          className="text-xs text-slate-600 hover:text-slate-900 font-bold"
        >
          &larr; Back to Language
        </button>
        <button
          onClick={() => setCurrentTab('leaders')}
          className="bg-[#003893] hover:bg-[#002766] text-white text-xs font-bold px-6 py-3 rounded-full transition-all shadow flex items-center space-x-2 cursor-pointer"
        >
          <span>Meet the Youth &amp; Community Leaders</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
