/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TabType } from '../types';
import { Compass, Users, TreePine, Anchor, MapPin, ArrowRight, Shield } from 'lucide-react';

interface AboutViewProps {
  setCurrentTab: (tab: TabType) => void;
}

export default function AboutView({ setCurrentTab }: AboutViewProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#DC143C]">
          <span className="w-6 h-1 bg-[#DC143C]"></span>
          <span>Indigenous Identity &amp; Heritage</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-poppins text-slate-900 leading-tight">
          About the Bote Community of Nepal
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
          The Bote are one of Nepal's most ancient, water-dependent indigenous nationalities (Adivasi Janajati). For centuries, their lives have been inextricably intertwined with the rivers of the inner-Terai, ferrying travelers in hand-carved single-log canoes, fishing with customary woven nets, and panning gold along riverbanks.
        </p>
      </div>

      {/* Quick Demographic Infobox */}
      <div className="bg-gradient-to-br from-red-50 via-white to-blue-50 border-2 border-red-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="font-poppins font-extrabold text-lg text-slate-900 mb-4 border-b border-red-200/60 pb-3 flex items-center justify-between">
          <span>At A Glance: Bote Demographics &amp; Identity</span>
          <span className="text-xs bg-[#DC143C] text-white px-3 py-1 rounded-full font-bold">Official Census Data</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-800">
          <div className="space-y-2.5">
            <p><strong>Official Classification:</strong> Highly Marginalized Indigenous Nationality (NFDIN Category)</p>
            <p><strong>Total National Population:</strong> 11,258 individuals (Nepal Census)</p>
            <p><strong>Ancestral Mother Tongue:</strong> Bote Language (Tarahi Dialect in Sarlahi)</p>
            <p><strong>Primary Settlements:</strong> Karmaiya (Sarlahi District), Chitwan, Nawalparasi, Tanahun, Makwanpur</p>
          </div>
          <div className="space-y-2.5">
            <p><strong>Historical Occupations:</strong> Dugout canoe ferrying (*Taran*), river fishing (*Jal*), gold panning, reed weaving</p>
            <p><strong>Religious Practice:</strong> Nature &amp; River Worship (Animism/Prakriti), Sansari Devi Puja, ancestor veneration</p>
            <p><strong>Allied Janajati Groups:</strong> Majhi (*Kings of Water*), Danuwar, Darai, Tharu, Kumal</p>
          </div>
        </div>
      </div>

      {/* Origin Theories Section */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 text-[#003893]">
          <TreePine className="w-6 h-6 text-[#DC143C]" />
          <h2 className="text-2xl font-black font-poppins text-slate-900">
            Theories of Origin: Why "Bote"?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
            <span className="text-[10px] font-black uppercase text-[#DC143C] bg-red-100 px-2.5 py-0.5 rounded-full">Theory 1</span>
            <h4 className="font-poppins font-bold text-base text-slate-900">Bridge Builders from Trees ("Bot")</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              In the Nepali language, <em>'Bot'</em> means a tree or tree trunk. Historically, before permanent steel bridges existed, Bote community artisans were famous across the country for felling massive tree trunks across swollen monsoon rivers to engineer temporary seasonal crossings. Travelers came to know these riparian engineers as 'Bote'.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
            <span className="text-[10px] font-black uppercase text-[#003893] bg-blue-100 px-2.5 py-0.5 rounded-full">Theory 2</span>
            <h4 className="font-poppins font-bold text-base text-slate-900">Shelter under Riverside Trees</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              A second ethnographic perspective highlights that because ancestral Bote did not hold formal land deeds or permanent masonry houses, they lived directly on the waterfront sands under massive trees for shade, tying their whole existence, spiritual safety, and shelter to the trees and river currents.
            </p>
          </div>
        </div>
      </div>

      {/* Social Classifications: Pakha Bote vs Pani Bote */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-3">
          <Anchor className="w-6 h-6 text-[#003893]" />
          <h2 className="text-2xl font-black font-poppins text-slate-900">
            Social Classifications: Pakha Bote &amp; Pani Bote
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Environmental adaptation divided the Bote into two recognized social divisions, both maintaining uniform customary laws:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="border-l-4 border-[#003893] bg-blue-50/50 p-5 rounded-r-2xl space-y-2">
            <h4 className="font-poppins font-bold text-sm text-[#003893]">Pani Bote (The Water Dwellers)</h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              Resided exclusively on high-water lines along river ghats. Their entire livelihood was focused on canoe ferrying (*Taran*), artisanal casting-net fishing, and seasonal panning for alluvial gold particles. Karmaiya's old settlement reflects deep Pani Bote roots.
            </p>
          </div>

          <div className="border-l-4 border-[#DC143C] bg-red-50/50 p-5 rounded-r-2xl space-y-2">
            <h4 className="font-poppins font-bold text-sm text-[#DC143C]">Pakha Bote (The Inland Cultivators)</h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              Resided in inner hills and cultivated small arable plots of maize, millet, and vegetables while fishing during monsoon months. Culturally linked with neighboring Magar and Gurung groups while maintaining their distinct mother tongue.
            </p>
          </div>
        </div>
      </div>

      {/* The Settlement of Karmaiya, Sarlahi */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-3 text-[#DC143C]">
          <MapPin className="w-6 h-6" />
          <h2 className="text-2xl font-black font-poppins text-slate-900">
            The Karmaiya Settlement in Sarlahi District
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Karmaiya (located in Ward No. 11 of Bagmati Municipality, Sarlahi District, Madhesh Province) represents one of the largest and most cohesive Bote settlements in eastern Nepal. Situated near the historic Bagmati River ferry crossings, Karmaiya has transformed over the last two decades. Through the rise of local Bote youth organizations, literacy has jumped, women’s savings cooperatives have expanded, and language preservation has gained federal recognition.
        </p>
        <div className="pt-2 flex gap-4">
          <button
            onClick={() => setCurrentTab('history')}
            className="bg-[#DC143C] hover:bg-[#b51031] text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-sm flex items-center space-x-2"
          >
            <span>Read Bote History &amp; Canoe Craft</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
