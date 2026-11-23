/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TabType } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Compass, Users, TreePine, Anchor, MapPin, ArrowRight, Shield } from 'lucide-react';

interface AboutViewProps {
  setCurrentTab: (tab: TabType) => void;
}

export default function AboutView({ setCurrentTab }: AboutViewProps) {
  const { isNepali } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#DC143C]">
          <span className="w-6 h-1 bg-[#DC143C]"></span>
          <span>{isNepali ? 'आदिवासी पहिचान तथा पुर्ख्यौली सम्पदा' : 'Indigenous Identity & Heritage'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-poppins text-slate-900 leading-tight">
          {isNepali ? 'नेपालको बोटे समुदायको परिचय' : 'About the Bote Community of Nepal'}
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
          {isNepali
            ? 'बोटे जाति नेपालको प्राचीन, जल सभ्यतामा आश्रित आदिवासी जनजाति (अति सीमान्तकृत समूह) मध्ये एक हुन्। शताब्दीयौँदेखि उनीहरूको जीवन भित्री मधेश तथा तराईका प्रमुख नदीहरूसँग जोडिएको छ। आफ्नै हातले सिमलको मुढाबाट कुँदिएका एक-ढुङ्गे काठका डुङ्गाहरू (नाउ) मार्फत यात्रुहरूलाई उर्लँदो नदी पार गराउने, परम्परागत जालद्वारा माछा मार्ने, र बालुवाबाट सुन छान्ने उनीहरूको मौलिक पेशा रहिआएको छ।'
            : "The Bote are one of Nepal's most ancient, water-dependent indigenous nationalities (Adivasi Janajati). For centuries, their lives have been inextricably intertwined with the rivers of the inner-Terai, ferrying travelers in hand-carved single-log canoes, fishing with customary woven nets, and panning gold along riverbanks."}
        </p>
      </div>

      {/* Quick Demographic Infobox */}
      <div className="bg-gradient-to-br from-red-50 via-white to-blue-50 border-2 border-red-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="font-poppins font-extrabold text-lg text-slate-900 mb-4 border-b border-red-200/60 pb-3 flex items-center justify-between">
          <span>{isNepali ? 'एक नजरमा: बोटे जनसांख्यिकी र पहिचान' : 'At A Glance: Bote Demographics & Identity'}</span>
          <span className="text-xs bg-[#DC143C] text-white px-3 py-1 rounded-full font-bold">
            {isNepali ? 'राष्ट्रिय जनगणना २०२१' : 'Official Census Data'}
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-800">
          <div className="space-y-2.5">
            <p>
              <strong>{isNepali ? 'आधिकारिक वर्गीकरण:' : 'Official Classification:'}</strong>{' '}
              {isNepali ? 'अति सीमान्तकृत आदिवासी जनजाति (नेफिफिन सूचीकृत)' : 'Highly Marginalized Indigenous Nationality (NFDIN Category)'}
            </p>
            <p>
              <strong>{isNepali ? 'कुल राष्ट्रिय जनसंख्या:' : 'Total National Population:'}</strong>{' '}
              {isNepali ? '११,२५८ जना (नेपाल राष्ट्रिय जनगणना २०२१)' : '11,258 individuals (Nepal Census 2021)'}
            </p>
            <p>
              <strong>{isNepali ? 'पुर्ख्यौली मातृभाषा:' : 'Ancestral Mother Tongue:'}</strong>{' '}
              {isNepali ? 'बोटे भाषा (सर्लाहीमा तराही बोटे लवज)' : 'Bote Language (Tarahi Dialect in Sarlahi)'}
            </p>
            <p>
              <strong>{isNepali ? 'मुख्य बसोबास क्षेत्रहरू:' : 'Primary Settlements:'}</strong>{' '}
              {isNepali ? 'कर्मैया (सर्लाही जिल्ला), चितवन, नवलपुर, तनहुँ, मकवानपुर' : 'Karmaiya (Sarlahi District), Chitwan, Nawalparasi, Tanahun, Makwanpur'}
            </p>
          </div>
          <div className="space-y-2.5">
            <p>
              <strong>{isNepali ? 'परम्परागत पेशा:' : 'Historical Occupations:'}</strong>{' '}
              {isNepali ? 'काठको डुङ्गा सञ्चालन (तरन), जाल बुनेर माछा मार्ने, बालुवाबाट सुन छान्ने' : 'Dugout canoe ferrying (Taran), river fishing (Jal), gold panning, reed weaving'}
            </p>
            <p>
              <strong>{isNepali ? 'धार्मिक तथा सांस्कृतिक परम्परा:' : 'Religious Practice:'}</strong>{' '}
              {isNepali ? 'प्रकृति तथा नदी पूजा (संसारी माई, जल पूजा, कुल देवता आराधना)' : 'Nature & River Worship (Animism/Prakriti), Sansari Devi Puja, ancestor veneration'}
            </p>
            <p>
              <strong>{isNepali ? 'सह-अस्तित्व रहेका अन्य समुदाय:' : 'Allied Janajati Groups:'}</strong>{' '}
              {isNepali ? 'माझी (जलका राजा), दनुवार, दराई, थारू, कुमाल' : 'Majhi (Kings of Water), Danuwar, Darai, Tharu, Kumal'}
            </p>
          </div>
        </div>
      </div>

      {/* Origin Theories Section */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 text-[#003893]">
          <TreePine className="w-6 h-6 text-[#DC143C]" />
          <h2 className="text-2xl font-black font-poppins text-slate-900">
            {isNepali ? 'नामकरण र उत्पत्तिका धारणाहरू: किन "बोटे"?' : 'Theories of Origin: Why "Bote"?'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
            <span className="text-[10px] font-black uppercase text-[#DC143C] bg-red-100 px-2.5 py-0.5 rounded-full">
              {isNepali ? 'अवधारणा १' : 'Theory 1'}
            </span>
            <h4 className="font-poppins font-bold text-base text-slate-900">
              {isNepali ? 'रुखको मुढा (बोट) बाट पुल बनाउने शिल्पी' : 'Bridge Builders from Trees ("Bot")'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isNepali
                ? "नेपाली भाषामा 'बोट' भन्नाले रुख वा रुखको काठलाई बुझाउँछ। ऐतिहासिक कालमा जब फलामे वा पक्की पुलहरू बनेका थिएनन्, बोटे समुदायका शिल्पीहरूले वर्षायाममा ठूल्ठूला रुखका काठहरू नदी वारपार तेर्स्याएर काठे साँघु (पुल) बनाउने गर्दथे। नदी तार्ने यी कुशल जल-शिल्पीहरूलाई सबैले 'बोटे' भनेर सम्बोधन गर्न थाले।"
                : "In the Nepali language, 'Bot' means a tree or tree trunk. Historically, before permanent steel bridges existed, Bote community artisans were famous across the country for felling massive tree trunks across swollen monsoon rivers to engineer temporary seasonal crossings. Travelers came to know these riparian engineers as 'Bote'."}
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
            <span className="text-[10px] font-black uppercase text-[#003893] bg-blue-100 px-2.5 py-0.5 rounded-full">
              {isNepali ? 'अवधारणा २' : 'Theory 2'}
            </span>
            <h4 className="font-poppins font-bold text-base text-slate-900">
              {isNepali ? 'नदी किनारका रुखमुनि बस्ने जलपुत्र' : 'Shelter under Riverside Trees'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isNepali
                ? 'अर्को मानवशास्त्रीय दृष्टिकोण अनुसार, पुर्खा बोटेहरूको स्थायी जग्गाजमिन वा घर नभई उनीहरू नदी किनारका बालुवा तथा ठूल्ठूला रुख (बोट) मुनि छाप्रो बनाएर बस्थे। आफ्नो सम्पूर्ण जीवन, आध्यात्मिक सुरक्षा र जीविकोपार्जन रुख र नदीको प्रवाहसँग बाँधेका कारण उनीहरूलाई बोटे भनिएको हो।'
                : 'A second ethnographic perspective highlights that because ancestral Bote did not hold formal land deeds or permanent masonry houses, they lived directly on the waterfront sands under massive trees for shade, tying their whole existence, spiritual safety, and shelter to the trees and river currents.'}
            </p>
          </div>
        </div>
      </div>

      {/* Social Classifications: Pakha Bote vs Pani Bote */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-3">
          <Anchor className="w-6 h-6 text-[#003893]" />
          <h2 className="text-2xl font-black font-poppins text-slate-900">
            {isNepali ? 'सामाजिक वर्गीकरण: पाखा बोटे र पानी बोटे' : 'Social Classifications: Pakha Bote & Pani Bote'}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {isNepali
            ? 'भौगोलिक र वातावरणीय अनुकूलनका आधारमा बोटे समुदायलाई दुई मुख्य सामाजिक विभाजनमा चिनिन्छ, यद्यपि दुवैको मौलिक रीतिरिवाज र संस्कार एउटै छ:'
            : 'Environmental adaptation divided the Bote into two recognized social divisions, both maintaining uniform customary laws:'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="border-l-4 border-[#003893] bg-blue-50/50 p-5 rounded-r-2xl space-y-2">
            <h4 className="font-poppins font-bold text-sm text-[#003893]">
              {isNepali ? 'पानी बोटे (नदी किनारमा बस्ने जलपुत्र)' : 'Pani Bote (The Water Dwellers)'}
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              {isNepali
                ? 'नदीका घाट र किनारमा बसोबास गर्ने समूह। उनीहरूको सम्पूर्ण जीविका काठको डुङ्गा तार्ने, हातले बुनेको जालबाट माछा मार्ने, र बालुवा पखालेर सुनका कण खोज्ने काममा निर्भर हुन्थ्यो। सर्लाहीको कर्मैयाको पुरानो बस्ती यही पानी बोटे परम्पराको मुख्य केन्द्र हो।'
                : "Resided exclusively on high-water lines along river ghats. Their entire livelihood was focused on canoe ferrying (Taran), artisanal casting-net fishing, and seasonal panning for alluvial gold particles. Karmaiya's old settlement reflects deep Pani Bote roots."}
            </p>
          </div>

          <div className="border-l-4 border-[#DC143C] bg-red-50/50 p-5 rounded-r-2xl space-y-2">
            <h4 className="font-poppins font-bold text-sm text-[#DC143C]">
              {isNepali ? 'पाखा बोटे (भित्री डाँडा र कान्लामा खेती गर्ने)' : 'Pakha Bote (The Inland Cultivators)'}
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              {isNepali
                ? 'नदीभन्दा अलि माथिल्लो भेगका कान्ला वा डाँडामा बसोबास गर्ने समूह। उनीहरूले मकै, कोदो र तरकारी खेती गर्नुका साथै वर्षायाममा नदीमा माछा मार्ने गर्छन्। उनीहरूको भाषा, कुलदेवता र मौलिक संस्कार पानी बोटे सरह नै रहिआएको छ।'
                : 'Resided in inner hills and cultivated small arable plots of maize, millet, and vegetables while fishing during monsoon months. Culturally linked with neighboring Magar and Gurung groups while maintaining their distinct mother tongue.'}
            </p>
          </div>
        </div>
      </div>

      {/* The Settlement of Karmaiya, Sarlahi */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-3 text-[#DC143C]">
          <MapPin className="w-6 h-6" />
          <h2 className="text-2xl font-black font-poppins text-slate-900">
            {isNepali ? 'सर्लाही जिल्लाको कर्मैया बोटे बस्ती' : 'The Karmaiya Settlement in Sarlahi District'}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {isNepali
            ? 'सर्लाही जिल्लाको बागमती नगरपालिका वडा नं. ११ मा अवस्थित कर्मैया पूर्वी नेपालको सबैभन्दा ठूलो र संगठित बोटे बस्ती हो। ऐतिहासिक बागमती नदीको डुङ्गा घाट नजिकै रहेको कर्मैया पछिल्लो दुई दशकमा तीव्र गतिमा रूपान्तरण भएको छ। स्थानीय बोटे युवाहरूको अग्रसरतामा शैक्षिक साक्षरता बढेको छ, महिला सहकारीहरू सक्रिय छन्, र लोपोन्मुख तराही बोटे भाषा संरक्षणले संघीय स्तरमा पहिचान पाएको छ।'
            : "Karmaiya (located in Ward No. 11 of Bagmati Municipality, Sarlahi District, Madhesh Province) represents one of the largest and most cohesive Bote settlements in eastern Nepal. Situated near the historic Bagmati River ferry crossings, Karmaiya has transformed over the last two decades. Through the rise of local Bote youth organizations, literacy has jumped, women’s savings cooperatives have expanded, and language preservation has gained federal recognition."}
        </p>
        <div className="pt-2 flex gap-4">
          <button
            onClick={() => setCurrentTab('history')}
            className="bg-[#DC143C] hover:bg-[#b51031] text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-sm flex items-center space-x-2 cursor-pointer"
          >
            <span>{isNepali ? 'बोटे इतिहास र डुङ्गा कला पढ्नुहोस्' : 'Read Bote History & Canoe Craft'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
