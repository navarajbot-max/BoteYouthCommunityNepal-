/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TabType } from '../types';
import { Compass, Flame, Shield, ArrowRight, Anchor, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import InteractiveHistoryTimeline from '../components/InteractiveHistoryTimeline';

interface HistoryViewProps {
  setCurrentTab: (tab: TabType) => void;
}

export default function HistoryView({ setCurrentTab }: HistoryViewProps) {
  const { isNepali } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#003893]">
          <Clock className="w-4 h-4 text-[#DC143C]" />
          <span>{isNepali ? 'शताब्दीयौँ पुरानो जलयात्रा तथा शिल्पकला' : 'Centuries of Riparian Craft'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-poppins text-slate-900 leading-tight">
          {isNepali ? 'बोटे इतिहास तथा नदी यात्रा परम्परा' : 'Bote History & River Navigation'}
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
          {isNepali
            ? 'नेपालको सर्लाहीस्थित बोटे जातिको प्राचीन ऐतिहासिक विकासक्रम — हातले कुँदिएका एक-ढुङ्गे काठका डुङ्गामार्फत उर्लँदो नदी पार गर्नेदेखि आधुनिक युवा नेतृत्व अभियानसम्मको यात्रा।'
            : 'Trace the ancient evolutionary timeline of the Bote people of Sarlahi, Nepal — from navigating rapid river rapids in handcrafted single-log dugouts to organizing modern youth leadership initiatives.'}
        </p>
      </div>

      {/* Feature Section: The Architecture of Ek-Dunge Nau */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 text-[#DC143C]">
          <Anchor className="w-6 h-6" />
          <h2 className="text-2xl font-black font-poppins text-slate-900">
            {isNepali
              ? 'एक-ढुङ्गे नाउ: बोटे परम्परागत काठको डुङ्गा शिल्पकला'
              : 'Ek-Dunge Nau: The Architecture of Bote Single-Log Canoes'}
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {isNepali ? (
            <>
              <strong>एक-ढुङ्गे नाउ</strong> (काठको डुङ्गा) आदिवासी इन्जिनियरिङको उत्कृष्ट नमुना हो। बिना किल्ला वा जोड, एउटै विशाल रुखको मुढाबाट कुँदिएका यी डुङ्गाहरूले वर्षायामको उर्लँदो बाढीमा पनि दर्जनौँ यात्रुहरूलाई बागमती, नारायणी र कालीगण्डकी नदी सुरक्षित रूपमा पार गराउँछन्।
            </>
          ) : (
            <>
              The <em>Ek-Dunge Nau</em> (single-log canoe) is an indigenous engineering masterpiece. Carved out of a single massive tree trunk without nails or joints, these boats can navigate treacherous monsoon currents and carry dozens of passengers safely across the Bagmati, Narayani, and Kaligandaki rivers.
            </>
          )}
        </p>

        {/* 3 Step Crafting Process */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2.5">
            <span className="w-7 h-7 rounded-full bg-red-100 text-[#DC143C] font-black text-xs flex items-center justify-center">1</span>
            <h4 className="font-poppins font-bold text-sm text-slate-900">
              {isNepali ? 'रुख छनोट तथा वन पूजा संस्कार' : 'Tree Selection & Forest Rite'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isNepali
                ? 'जेष्ठ सदस्यहरूले विशाल सिमल वा सालको रुख छनोट गर्छन्। रुख ढाल्नुअघि वन देवी-देवताको आध्यात्मिक अनुमति माग्न रातो सिन्दूर र अक्षतासहित पूजा-अर्चना गरिन्छ।'
                : 'Elders select giant Simal (silk-cotton) or Sal trees. Prayers are offered to forest spirits with red vermillion and rice to seek spiritual permission before felling.'}
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2.5">
            <span className="w-7 h-7 rounded-full bg-blue-100 text-[#003893] font-black text-xs flex items-center justify-center">2</span>
            <h4 className="font-poppins font-bold text-sm text-slate-900">
              {isNepali ? 'बाँसुल (चारी) द्वारा भित्री भाग खोप्ने' : 'Adze Core Hollowing'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isNepali
                ? 'कलाकारहरूले परम्परागत बाँसुल (चारी) प्रयोग गरी रुखको भित्री काठ खोप्छन्, र नदीको तीव्र छालमा सन्तुलन कायम राख्न डुङ्गाको बाहिरी र भित्री मोटाइ सटिक रूपमा मिलाउँछन्।'
                : 'Artisans use customary adzes (*chari*) to chip away the heartwood, meticulously calibrating the hull thickness to ensure uniform buoyancy and balance in white-water rapids.'}
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2.5">
            <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center">3</span>
            <h4 className="font-poppins font-bold text-sm text-slate-900">
              {isNepali ? 'आगोको धुवाँद्वारा काठको उपचार (सिजनिङ)' : 'Fire-Seasoning the Hull'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isNepali
                ? 'खोपेको डुङ्गाभित्र नियन्त्रित मन्द आगो बालेर काठको सतहलाई डढाइन्छ। यो परम्परागत प्रविधिले काठका छिद्रहरू बन्द गरी पानीका कीरा र सडनबाट सुरक्षित राख्छ।'
                : 'Controlled smoldering fires are burned inside the hollow to char the wood surface. This indigenous heat treatment seals the pores against water beetles and rot.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive History Timeline Section */}
      <InteractiveHistoryTimeline setCurrentTab={setCurrentTab} />

      {/* Action Strip */}
      <div className="bg-gradient-to-r from-[#003893] to-[#DC143C] text-white rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <h3 className="text-xl font-bold font-poppins">
            {isNepali ? 'बोटे सांस्कृतिक परम्परा तथा नदी पूजाविधि अन्वेषण गर्नुहोस्' : 'Explore Bote Cultural Traditions & Rituals'}
          </h3>
          <p className="text-xs text-white/80 mt-1">
            {isNepali
              ? 'संसारी देवी नदी पूजा, माघे सङ्क्रान्ति डुङ्गा दौड र प्रकृति आराधनाको अवलोकन गर्नुहोस्।'
              : 'Discover Sansari Devi River Puja, Maghe Sankranti races, and animist prayers.'}
          </p>
        </div>
        <button
          onClick={() => setCurrentTab('cultures')}
          className="bg-white hover:bg-slate-100 text-[#003893] font-black px-6 py-3 rounded-full text-xs shadow-md transition-all shrink-0 uppercase tracking-wider cursor-pointer"
        >
          {isNepali ? 'संस्कृति अवलोकन गर्नुहोस् →' : 'View Cultures →'}
        </button>
      </div>
    </div>
  );
}
