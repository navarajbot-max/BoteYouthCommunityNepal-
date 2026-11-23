/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TabType } from '../types';
import { useCommunityData } from '../context/CommunityDataContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Flame,
  Shield,
  Heart,
  Users,
  Compass,
  ArrowRight,
  CheckCircle,
  TreePine,
  Laptop,
  GraduationCap,
  IdCard
} from 'lucide-react';

interface EmpowerViewProps {
  setCurrentTab: (tab: TabType) => void;
}

export default function EmpowerView({ setCurrentTab }: EmpowerViewProps) {
  const { hasJoinedCommunity, isFollowingCommunity, followerCount } = useCommunityData();
  const { isNepali } = useLanguage();

  const initiatives = [
    {
      id: 'emp-1',
      title: isNepali ? 'बागमती नदी पर्यावरण गस्ती तथा अवैध उत्खनन नियन्त्रण' : 'Bagmati River Ecology Patrols & Anti-Mining Watch',
      tag: isNepali ? 'पर्यावरण तथा पवित्र जल' : 'Ecology & Sacred Waters',
      icon: TreePine,
      color: '#00695C',
      description: isNepali
        ? 'बोटे युवा स्वयंसेवकहरूले बागमती र नारायणी नदी किनारमा साप्ताहिक डुङ्गा गस्ती सञ्चालन गर्छन्। हामी अवैध बालुवा-गिट्टी उत्खननको अनुगमन गर्छौं, पवित्र संसारी पूजा घाटहरूको संरक्षण गर्छौं र हरेक शनिबार प्लास्टिक सफाइ अभियान चलाउँछौं।'
        : 'Bote youth volunteers conduct weekly boat patrols along the Bagmati and Narayani riverbanks. We document illegal mechanical sand extraction, monitor water siltation around sacred Sansari Puja ghats, and organize Saturday morning plastics cleanups.',
      achievements: isNepali ? [
        '२०२५ मा नदी किनारबाट ४.५ टनभन्दा बढी प्लास्टिक फोहोर संकलन र विसर्जन',
        'अवैध मेसिनरी उत्खनन रोक्न सर्लाहीका प्रमुख जिल्ला अधिकारीलाई संयुक्त ज्ञापनपत्र पेश',
        'विश्वविद्यालयका वातावरण अनुसन्धानकर्ताहरूसँग मिलेर जल स्वच्छता र माछा बासस्थान परीक्षण'
      ] : [
        'Over 4.5 tons of plastic debris removed from riverbanks in 2025',
        'Formal joint appeal submitted to Sarlahi Chief District Officer to halt mechanical gravel mining',
        'Water acidity and fish habitat testing with environmental university researchers'
      ]
    },
    {
      id: 'emp-2',
      title: isNepali ? 'जेष्ठ नागरिक मौखिक लोककथा तथा भाषा अभिलेखीकरण' : 'Elder Oral Folklore & Language Documentation Circles',
      tag: isNepali ? 'मातृभाषा पुनरुत्थान' : 'Linguistic Revitalization',
      icon: Heart,
      color: '#DC143C',
      description: isNepali
        ? 'प्रविधिमैत्री बोटे युवाहरूलाई गाउँका ६० वर्षभन्दा माथिका जेष्ठ नागरिकहरूसँग जोडेर परम्परागत माछा मार्ने मन्त्र, लोककथा, र नदीय वनस्पतिका मौलिक शब्दावलीहरूको अडियो-भिडियो संकलन गरिन्छ।'
        : 'Pairing tech-savvy Bote youth with village elders aged 60+ to audio-record traditional fishing chants, folk stories, and botanical river terminology that exist only in oral memory.',
      achievements: isNepali ? [
        '४५ घण्टाभन्दा बढी उच्च गुणस्तरका मौखिक पुर्ख्यौली अडियो रेकर्डिङ डिजिटलाइज',
        'प्राथमिक विद्यालयका बालबालिकाका लागि बोलचालको तराही बोटे शब्दकोश एप तयार',
        'कर्मैया सामुदायिक भवनमा साप्ताहिक गाउँस्तरीय मातृभाषा कक्षा सञ्चालन'
      ] : [
        'Over 45 hours of high-fidelity oral narrative tapes digitized',
        'Publishing the conversational Tarahi Bote Lexicon app for primary schoolers',
        'Weekend village language circles hosted at the Karmaiya Community Center'
      ]
    },
    {
      id: 'emp-3',
      title: isNepali ? 'महिला चोया-हस्तकला तथा इको-होमस्टे सहकारी' : 'Women’s Grass Weaving & Eco-Homestay Cooperatives',
      tag: isNepali ? 'आर्थिक स्वावलम्बन' : 'Economic Independence',
      icon: Users,
      color: '#003893',
      description: isNepali
        ? 'सामुदायिक उपाध्यक्ष सीता बोटेको नेतृत्वमा स्थानीय बाबियो र चोया बुनेर चकटी, ढकिया, टोकरी र झोला उत्पादन गरिन्छ। साथै यात्रुहरूका लागि परम्परागत माटोको घरमा मौलिक बोटे होमस्टे सञ्चालन गरिएको छ।'
        : 'Led by Community Vice President Sita Bote, transforming wild elephant grass (choya) weaving into modern homeware products (placemats, baskets, and bags) and operating authentic clay-walled Bote homestays for travelers.',
      achievements: isNepali ? [
        '४० भन्दा बढी बोटे महिलाहरू नियमित मासिक आय आर्जन गर्न सक्षम',
        'विद्यालय भर्ना तथा स्वास्थ्य आपतकालका लागि शून्य ब्याजदरको आपतकालीन बचत कोष',
        'होमस्टेको कुल आम्दानीको १०% युवा उच्च शिक्षा छात्रवृत्ति कोषमा जम्मा'
      ] : [
        '40+ Bote women generating steady independent monthly income',
        'Zero-interest emergency credit pool for school enrollment and health emergencies',
        '10% of homestay proceeds reinvested into the Youth Higher Education Scholarship Fund'
      ]
    },
    {
      id: 'emp-4',
      title: isNepali ? 'माध्यमिक तथा विश्वविद्यालय शैक्षिक परामर्श एवं मेन्टरसिप' : 'Higher Secondary & University Academic Mentorship',
      tag: isNepali ? 'शैक्षिक नेतृत्व' : 'Educational Leadership',
      icon: GraduationCap,
      color: '#D97706',
      description: isNepali
        ? 'कर्मैयाका बोटे बालबालिकाहरूका लागि विद्यालयपछिको अतिरिक्त ट्युसन, कक्षा ११ र १२ का विद्यार्थीहरूलाई कलेज छात्रवृत्ति मार्गदर्शन, र इन्जिनियरिङ तथा नर्सिङ अध्ययनरत विद्यार्थीहरूलाई सहयोग।'
        : 'Providing after-school tutoring for Bote children in Karmaiya, guiding Grade 11/12 students with college application essays, and sponsoring university engineering, nursing, and science students.',
      achievements: isNepali ? [
        'कर्मैयामा एसईई उत्तीर्ण दर ५% बाट बढेर ४५% पुग्यो',
        '२०२५-२०२६ शैक्षिक सत्रमा १८ जनालाई पूर्ण छात्रवृत्ति अनुदान प्रदान',
        'विश्वविद्यालय उत्तीर्ण पूर्वविद्यार्थीहरूमार्फत प्राथमिक तहका विद्यार्थीहरूलाई परामर्श'
      ] : [
        'SEE graduation rate in Karmaiya increased from 5% to 45%',
        '18 full-tuition scholarship grants awarded in 2025-2026 academic cycle',
        'Mentorship circles connecting university alumni with primary school children'
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#DC143C]">
          <Flame className="w-4 h-4 text-amber-500" />
          <span>{isNepali ? 'धरातलीय सक्रियता तथा सशक्तीकरण' : 'Action on the Ground'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-poppins text-slate-900 leading-tight">
          {isNepali ? 'युवा सशक्तीकरण तथा संस्कृति संरक्षण' : 'Youth Empower & Save Our Cultures'}
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
          {isNepali
            ? 'हाम्रो विश्वास छ कि सम्पदा संरक्षण केवल विगतको सम्झना होइन — यो सक्रिय सामुदायिक सशक्तीकरण हो। नदी पर्यावरण गस्ती, भाषा अभिलेख, महिला सहकारी र शैक्षिक छात्रवृत्ति मार्फत बोटे युवाहरू सर्लाही र समग्र देशमा सकारात्मक परिवर्तनको नेतृत्व गरिरहेका छन्।'
            : "We believe heritage preservation is not passive nostalgia — it is active community empowerment. Through river ecology patrols, language archives, women's cooperatives, and educational grants, Bote youth are leading real social transformation in Sarlahi and beyond."}
        </p>
      </div>

      {/* Initiatives Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {initiatives.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-lg transition-shadow border-t-4"
              style={{ borderTopColor: item.color }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md"
                    style={{ backgroundColor: item.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {item.tag}
                  </span>
                </div>

                <h3 className="font-poppins font-extrabold text-xl text-slate-900 leading-tight">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    {isNepali ? 'मुख्य उपलब्धि तथा कार्य विवरण:' : 'Key Outcomes & Action:'}
                  </span>
                  {item.achievements.map((ach, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setCurrentTab('join')}
                  className="text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                  style={{ color: item.color }}
                >
                  <span>{isNepali ? 'यस कार्यक्रममा स्वयंसेवा गर्नुहोस्' : 'Volunteer for this program'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to Action Banner - Conditionally renders based on join status */}
      {!hasJoinedCommunity ? (
        <div className="bg-gradient-to-r from-[#003893] to-[#DC143C] text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-black font-poppins text-white">
              {isNepali ? 'युवा नेतृत्व अभियानमा सहभागी हुनुहोस्' : 'Join the Youth Committee Movement'}
            </h3>
            <p className="text-xs text-white/90">
              {isNepali
                ? 'आफ्नो आधिकारिक नेपाल बोटे युवा समुदाय डिजिटल परिचयपत्र प्राप्त गर्न अनलाइन फारम भर्नुहोस्।'
                : 'Sign up online to receive your official Bote Youth Community Nepal membership ID.'}
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('join')}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-8 py-3.5 rounded-full text-xs uppercase tracking-wider shadow-lg shrink-0 transition-transform active:scale-95 cursor-pointer"
          >
            {isNepali ? 'फाराम भर्नुहोस् →' : 'Fill Joining Form →'}
          </button>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="bg-emerald-700 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm inline-flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{isNepali ? 'आधिकारिक युवा सदस्य' : 'Official Youth Member'}</span>
            </span>
            <h3 className="text-2xl font-black font-poppins text-white">
              {isNepali ? 'तपाईंको सामुदायिक सदस्यता सक्रिय छ' : 'Your Community Membership is Active'}
            </h3>
            <p className="text-xs text-emerald-100">
              {isNepali
                ? 'तपाईंको नाम समुदाय अभिलेखमा दर्ता भइसकेको छ। आफ्नो डिजिटल परिचयपत्र हेर्नुहोस् वा स्वयंसेवामा जोडिनुहोस्।'
                : 'You are enrolled in community records. Access program volunteering and your digital identity card.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentTab('join')}
              className="bg-white hover:bg-emerald-50 text-emerald-900 font-black px-7 py-3.5 rounded-full text-xs uppercase tracking-wider shadow-lg shrink-0 transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <IdCard className="w-4 h-4 text-emerald-700" />
              <span>{isNepali ? 'मेरो परिचयपत्र हेर्नुहोस्' : 'View Member ID Card'}</span>
            </button>
            <button
              onClick={() => setCurrentTab('follow')}
              className="bg-emerald-700/60 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-full text-xs uppercase tracking-wider border border-emerald-500 shadow-md shrink-0 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-red-300 fill-red-300" />
              <span>{isNepali ? `समुदाय अपडेट (${followerCount})` : `Follow Updates (${followerCount})`}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
