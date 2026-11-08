/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabType } from '../types';
import { useCommunityData } from '../context/CommunityDataContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Compass,
  Anchor,
  Shield,
  BookOpen,
  Users,
  MapPin,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { resolveAssetUrl } from '../services/storagePersistence';

export interface TimelineEvent {
  id: string;
  year: string;
  periodLabel: string;
  title: string;
  titleNepali: string;
  category: 'ancient' | 'governance' | 'craft' | 'modern' | 'youth';
  categoryLabel: string;
  summary: string;
  culturalImpact: string;
  riverLocation: string;
  tag: string;
  image: string;
  artifacts: string[];
}

export const HISTORICAL_EVENTS: TimelineEvent[] = [
  {
    id: 'era-1',
    year: '~1200 CE & Prior',
    periodLabel: 'Ancient Era',
    title: 'Sons of Himalayan Rivers & Sansari Devi Worship',
    titleNepali: 'संसारी देवी पूजा एवं प्राचीन जल संस्कार',
    category: 'ancient',
    categoryLabel: 'Spiritual Heritage',
    summary:
      'The earliest recorded presence of Bote settlements along the Bagmati, Narayani, and Kaligandaki riverbanks. Elders performed animist river worship to Sansari Devi, requesting safe waters, rich fish harvests, and immunity from monsoon floods.',
    culturalImpact:
      'Established the sacred relationship between the Bote people and Nepal’s river ecosystems, strictly forbidding the poisoning of waters.',
    riverLocation: 'Bagmati & Narayani River Basins',
    tag: 'Animist Roots',
    image: '/favicon.svg',
    artifacts: ['Clay vermillion pots', 'Choya reed cast-nets', 'Sacred water river offerings']
  },
  {
    id: 'era-2',
    year: '1650 – 1790 CE',
    periodLabel: 'Malla & Shah Era',
    title: 'Royal Tar Charters & Customary Ferry Monopolies',
    titleNepali: 'शाही सनद: तार अधिकार र माझी प्रथा',
    category: 'governance',
    categoryLabel: 'Customary Law',
    summary:
      'Royal decrees (Lal Mohar) formally granted the Bote community hereditary monopoly charters (Tar) to command ferry crossings across Nepal’s roaring Himalayan torrents, bridging trade between Kathmandu Valley and the southern plains.',
    culturalImpact:
      'Recognized Bote boatmen as indispensable state navigators, granting them tax exemptions and autonomous ghat governance.',
    riverLocation: 'Historic River Ghats (Bagmati, Trisuli, Narayani)',
    tag: 'Royal Charters',
    image: '/uploads/header_logo_1789693983380_aok4s.png',
    artifacts: ['Copper royal seals', 'Traditional ferry oars', 'Customary ghat toll registers']
  },
  {
    id: 'era-3',
    year: '1800 – 1950',
    periodLabel: 'Indigenous Technology',
    title: 'Architecture of Ek-Dunge Nau (Single-Log Canoe)',
    titleNepali: 'एक-ढुङ्गे नाउ: परम्परागत काठको डुङ्गा शिल्पी',
    category: 'craft',
    categoryLabel: 'Indigenous Engineering',
    summary:
      'Master boatbuilders perfected the creation of single-log canoes (Ek-Dunge Nau) sculpted from giant Simal and Sal trees. Using hand adzes (chari), artisans hollowed trunks with mathematical uniform buoyancy and fire-seasoned hulls against rot.',
    culturalImpact:
      'Created indigenous watercraft capable of safely navigating Class IV rapids carrying cargo, cattle, and dozens of passengers.',
    riverLocation: 'Karmaiya Old Ghat, Sarlahi',
    tag: 'Woodcraft Masterpiece',
    image: '/uploads/header_logo_1789693983380_aok4s.png',
    artifacts: ['Iron carving adze (Chari)', 'Simal heartwood', 'Controlled fire-charring tools']
  },
  {
    id: 'era-4',
    year: '1965 – 1985',
    periodLabel: 'Modern Disruption',
    title: 'East-West Highway Construction & Bridge Disruption',
    titleNepali: 'पूर्व-पश्चिम राजमार्ग र आधुनिक पुल निर्माण',
    category: 'modern',
    categoryLabel: 'Socio-Economic Shift',
    summary:
      'The construction of modern steel and concrete highway bridges over the Bagmati and Narayani rivers abruptly made the ancestral ferry trade obsolete. Bote families adapted by transitioning into riverbed gravel harvesting, cast-net fishing, and subsistence agriculture.',
    culturalImpact:
      'Spurred community introspection and the first grassroots meetings to protect indigenous linguistic identity and land claims.',
    riverLocation: 'Bagmati Highway Crossing, Sarlahi',
    tag: 'Highway Era',
    image: '/favicon.svg',
    artifacts: ['Bridge displacement petitions', 'Community savings ledgers', 'Cast nets']
  },
  {
    id: 'era-5',
    year: '2002 CE',
    periodLabel: 'State Recognition',
    title: 'Official Janajati Indigenous Nationality Classification',
    titleNepali: 'आदिवासी जनजाति उत्थान राष्ट्रिय प्रतिष्ठान सूचिकरण',
    category: 'governance',
    categoryLabel: 'Indigenous Rights',
    summary:
      'Under the National Foundation for Development of Indigenous Nationalities (NFDIN) Act 2058, the Government of Nepal officially classified the Bote as one of the 59 distinct indigenous nationalities (Adivasi Janajati) of Nepal in the endangered category.',
    culturalImpact:
      'Granted formal constitutional recognition and state provisions for the safeguarding of the Bote language, customs, and educational quotas.',
    riverLocation: 'National Schedule of Nepal',
    tag: 'Constitutional Status',
    image: '/uploads/header_logo_1789693983380_aok4s.png',
    artifacts: ['NFDIN Gazette', 'Endangered Janajati schedule', 'Tribal registration certs']
  },
  {
    id: 'era-6',
    year: '2011 – 2021',
    periodLabel: 'Linguistic Survey',
    title: 'National Census & Tarahi Bote Dialect Documentation',
    titleNepali: 'राष्ट्रिय जनगणना र तराही बोटे भाषा अनुसन्धान',
    category: 'craft',
    categoryLabel: 'Dialect Archiving',
    summary:
      'The National Population Census recorded 11,258 Bote community members, highlighting core concentrations in Sarlahi, Chitwan, and Nawalpur. Linguistic researchers and community elders initiated phonological studies on the endangered Tarahi Bote oral dialect.',
    culturalImpact:
      'Began the creation of the first community-driven Tarahi Bote lexicon and oral folklore audio archives.',
    riverLocation: 'Karmaiya (Sarlahi) & Chitwan Valleys',
    tag: 'Linguistic Heritage',
    image: '/favicon.svg',
    artifacts: ['Census records', 'Audio tape reels of elder folktales', 'Tarahi phonetic charts']
  },
  {
    id: 'era-7',
    year: '2024 – Present',
    periodLabel: 'Youth Renaissance',
    title: 'Founding of Bote Youth Community Nepal (BYCN)',
    titleNepali: 'बोटे युवा समुदाय नेपाल स्थापना र नयाँ नेतृत्व',
    category: 'youth',
    categoryLabel: 'Youth Leadership',
    summary:
      'Youth leaders in Karmaiya convened the national assembly to establish Bote Youth Community Nepal (BoteYouthCommunityNepal). Under Chairman Navaraj Bot and the Youth Council, initiatives encompass annual higher-education scholarships, Bagmati river ecology cleanups, and digital web preservation.',
    culturalImpact:
      'Uniting 10 executive leaders across youth and elder councils to bridge ancestral river reverence with modern professional opportunities.',
    riverLocation: 'Karmaiya, Sarlahi District, Madhesh Province',
    tag: 'Youth Movement',
    image: '/uploads/Leader_Profile_Photo_1789693773254_i4fzp.png',
    artifacts: ['Digital Member Cards', 'University Grant funds', 'River conservation badges']
  }
];

interface InteractiveHistoryTimelineProps {
  setCurrentTab: (tab: TabType) => void;
}

export default function InteractiveHistoryTimeline({
  setCurrentTab
}: InteractiveHistoryTimelineProps) {
  const { timelineEvents } = useCommunityData();
  const events = timelineEvents && timelineEvents.length > 0 ? timelineEvents : HISTORICAL_EVENTS;
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<'interactive' | 'trail'>('interactive');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const activeEvent = events[activeEventIndex] || events[0] || HISTORICAL_EVENTS[0];

  // Auto-tour timer
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveEventIndex((prev) => (prev + 1) % events.length);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, events.length]);

  const handleNext = () => {
    setActiveEventIndex((prev) => (prev + 1) % events.length);
  };

  const handlePrev = () => {
    setActiveEventIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const filteredEvents = events.filter((e) => {
    if (selectedCategory === 'all') return true;
    return e.category === selectedCategory;
  });

  return (
    <div className="space-y-8 w-full" id="interactive-bote-timeline">
      {/* Timeline Controls Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-900">
            <Clock className="w-4 h-4 text-red-600" />
            <span>Interactive Chronological Journey</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight mt-1 font-poppins">
            Bote Evolutionary Timeline
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Click any era on the rail or use the player to travel through centuries of river heritage.
          </p>
        </div>

        {/* View Mode & Auto Tour controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Auto Tour Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm ${
              isPlaying
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-blue-900 text-white hover:bg-blue-950'
            }`}
            title="Automatically tour through historical milestones"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause Tour' : 'Auto Tour'}</span>
          </button>

          {/* Toggle Display Mode */}
          <div className="bg-slate-100 p-1 rounded-full flex items-center text-xs font-bold">
            <button
              onClick={() => setViewMode('interactive')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                viewMode === 'interactive'
                  ? 'bg-white text-blue-900 shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Interactive Spotlight
            </button>
            <button
              onClick={() => setViewMode('trail')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                viewMode === 'trail'
                  ? 'bg-white text-red-600 shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Complete Trail (7)
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Interactive Spotlight Mode */}
      {viewMode === 'interactive' && (
        <div className="space-y-6">
          {/* 1. Horizontal Scrollable Milestone Rail */}
          <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 rounded-3xl p-4 sm:p-6 text-white shadow-lg border-2 border-blue-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-300" />
                <span>Select Era on Rail ({activeEventIndex + 1} of {events.length})</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrev}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                  title="Previous Milestone"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                  title="Next Milestone"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stepper Rail */}
            <div className="relative overflow-x-auto pb-3 pt-2 scrollbar-thin scrollbar-thumb-white/20">
              {/* Connecting Background Line */}
              <div className="absolute top-[26px] left-6 right-6 h-0.5 bg-blue-700/60 hidden sm:block" />

              <div className="flex items-center justify-between gap-4 min-w-[650px] px-2 relative z-10">
                {events.map((event, index) => {
                  const isActive = index === activeEventIndex;
                  return (
                    <button
                      key={event.id}
                      onClick={() => {
                        setActiveEventIndex(index);
                        setIsPlaying(false);
                      }}
                      className="flex flex-col items-center text-center group cursor-pointer focus:outline-none transition-all flex-1"
                    >
                      {/* Node circle */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-black transition-all duration-300 border-2 ${
                          isActive
                            ? 'bg-red-600 text-white border-white scale-110 shadow-lg shadow-red-600/40 ring-4 ring-red-600/20'
                            : 'bg-blue-950/80 text-slate-300 border-blue-600 hover:border-white hover:text-white'
                        }`}
                      >
                        {index + 1}
                      </div>

                      {/* Year & Period */}
                      <span
                        className={`text-[11px] font-bold mt-2 truncate max-w-[90px] ${
                          isActive ? 'text-amber-300 font-extrabold' : 'text-slate-300 group-hover:text-white'
                        }`}
                      >
                        {event.year}
                      </span>
                      <span className="text-[9px] text-slate-400 uppercase tracking-tight truncate max-w-[80px]">
                        {event.periodLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Progress bar during auto tour */}
            {isPlaying && (
              <div className="w-full bg-white/10 rounded-full h-1 mt-3 overflow-hidden">
                <motion.div
                  key={activeEventIndex}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                  className="bg-red-500 h-full"
                />
              </div>
            )}
          </div>

          {/* 2. Spotlight Event Detail Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeEvent.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl border-2 border-slate-200 shadow-md overflow-hidden"
            >
              {/* Top Accent Stripe */}
              <div className="h-2 w-full bg-gradient-to-r from-blue-900 via-red-600 to-amber-400" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-10">
                {/* Left Visual Column (5 cols) */}
                <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
                  <div className="relative rounded-2xl overflow-hidden h-64 sm:h-72 border border-slate-200 shadow-inner group">
                    <img
                      src={resolveAssetUrl(activeEvent.image && activeEvent.image.trim() && !activeEvent.image.includes('images.unsplash.com') ? activeEvent.image.trim() : '/favicon.svg')}
                      alt={activeEvent.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                      <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full w-fit shadow-xs mb-1">
                        {activeEvent.tag}
                      </span>
                      <p className="text-xs font-semibold flex items-center gap-1.5 text-slate-200">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{activeEvent.riverLocation}</span>
                      </p>
                    </div>
                  </div>

                  {/* Material Artifacts */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Archival Evidence &amp; Artifacts:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeEvent.artifacts.map((art, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-white border border-slate-200 text-slate-700 font-semibold px-2.5 py-1 rounded-full shadow-2xs"
                        >
                          {art}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Details Column (7 cols) */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="bg-blue-50 text-blue-900 border border-blue-200 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                        {activeEvent.categoryLabel} • {activeEvent.periodLabel}
                      </span>
                      <span className="text-xs font-mono font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                        {activeEvent.year}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase font-poppins leading-tight">
                        {activeEvent.title}
                      </h3>
                      {activeEvent.titleNepali && (
                        <p className="text-base font-semibold text-slate-500 mt-1">
                          {activeEvent.titleNepali}
                        </p>
                      )}
                    </div>

                    <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                      {activeEvent.summary}
                    </p>

                    {/* Historical Impact Callout */}
                    <div className="bg-gradient-to-r from-red-50 to-amber-50/50 p-4 rounded-2xl border border-red-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-red-700">
                        <Sparkles className="w-3.5 h-3.5 text-red-600" />
                        <span>Cultural Impact &amp; Preservation Significance</span>
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed font-medium">
                        {activeEvent.culturalImpact}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Navigation and Quick Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-150">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrev}
                        className="px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition flex items-center gap-1"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Previous Era</span>
                      </button>
                      <button
                        onClick={handleNext}
                        className="px-4 py-2 rounded-full bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm"
                      >
                        <span>Next Era</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentTab('cultures')}
                        className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 transition"
                      >
                        <span>Explore River Rites</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Mode 2: Complete Vertical Trail View */}
      {viewMode === 'trail' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center justify-between border-b border-slate-150 pb-4">
            <div>
              <h3 className="text-xl font-black uppercase text-slate-900 font-poppins">
                Chronological Trail (All 7 Epochs)
              </h3>
              <p className="text-xs text-slate-500">
                A continuous historical timeline from ancient river worship to modern youth empowerment.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-full">
              {events.length} Milestones
            </span>
          </div>

          <div className="relative border-l-4 border-red-600 pl-6 sm:pl-8 ml-3 sm:ml-6 space-y-10">
            {events.map((event, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={event.id}
                  onClick={() => {
                    setActiveEventIndex(idx);
                    setViewMode('interactive');
                  }}
                  className="relative group cursor-pointer"
                >
                  {/* Timeline Dot with red/blue styling */}
                  <span
                    className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-6 h-6 rounded-full border-4 border-white shadow-md transition-transform group-hover:scale-125 flex items-center justify-center text-[10px] font-bold text-white ${
                      isEven ? 'bg-red-600' : 'bg-blue-900'
                    }`}
                  >
                    {idx + 1}
                  </span>

                  {/* Card Container */}
                  <div className="bg-slate-50 hover:bg-white rounded-2xl p-5 border border-slate-200 hover:border-red-600 transition-all shadow-xs hover:shadow-md space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                          isEven
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-900'
                        }`}
                      >
                        {event.periodLabel} • {event.categoryLabel}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500">
                        {event.year}
                      </span>
                    </div>

                    <h4 className="text-lg font-black font-poppins text-slate-900 group-hover:text-red-600 transition-colors">
                      {event.title}
                    </h4>
                    {event.titleNepali && (
                      <p className="text-xs font-semibold text-slate-500">
                        {event.titleNepali}
                      </p>
                    )}

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {event.summary}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs font-bold text-blue-900">
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <MapPin className="w-3 h-3 text-amber-500" />
                        <span>{event.riverLocation}</span>
                      </span>
                      <span className="text-red-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        <span>Click to Spotlight</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
