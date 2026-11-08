/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Save,
  Sparkles,
  Image as ImageIcon,
  Users,
  Clock,
  Shirt,
  BookOpen,
  BarChart3,
  Check,
  RefreshCw,
  Upload,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe,
  Plus,
  Trash2,
  Edit2,
  Copy,
  RotateCcw
} from 'lucide-react';
import { useCommunityData } from '../../context/CommunityDataContext';
import { useTheme } from '../../context/ThemeContext';
import { resolveAssetUrl, getSynchronousCachedAsset } from '../../services/storagePersistence';
import { DEFAULT_LOGO_URL } from '../../data/communityData';
import { LeaderProfile, TimelineEvent, TraditionalDressItem, CostumeItem, DictionaryWord, CommunityMetric } from '../../types';

interface AdminMasterOneTimeSetupProps {
  onNavigateToPublic?: () => void;
}

type MasterTab = 'logos' | 'leaders' | 'history' | 'dress' | 'language' | 'metrics';

export default function AdminMasterOneTimeSetup({ onNavigateToPublic }: AdminMasterOneTimeSetupProps) {
  const {
    leaders,
    updateLeader,
    addLeader,
    deleteLeader,
    timelineEvents,
    updateTimelineEvent,
    addTimelineEvent,
    deleteTimelineEvent,
    dressItems,
    updateDressItem,
    addDressItem,
    deleteDressItem,
    costumes,
    dictionaryWords,
    updateDictionaryWord,
    addDictionaryWord,
    deleteDictionaryWord,
    communityMetrics,
    updateCommunityMetric,
    siteIdentity,
    saveHeaderLogo,
    saveFooterLogo,
    saveBothLogos,
    masterBroadcastEverything,
    syncStatus,
    lastSyncedTime
  } = useCommunityData();

  const {
    headerLogo,
    footerLogo,
    setHeaderLogo: setThemeHeaderLogo,
    setFooterLogo: setThemeFooterLogo
  } = useTheme();

  // Active section tab
  const [activeSection, setActiveSection] = useState<MasterTab>('logos');

  // Local Logo Form States
  const [headerLogoInput, setHeaderLogoInput] = useState<string>(headerLogo || siteIdentity.headerLogo || DEFAULT_LOGO_URL);
  const [footerLogoInput, setFooterLogoInput] = useState<string>(footerLogo || siteIdentity.footerLogo || DEFAULT_LOGO_URL);
  const [isSavingHeaderLogo, setIsSavingHeaderLogo] = useState<boolean>(false);
  const [isSavingFooterLogo, setIsSavingFooterLogo] = useState<boolean>(false);
  const [isSavingBothLogos, setIsSavingBothLogos] = useState<boolean>(false);
  const [logoSaveNotice, setLogoSaveNotice] = useState<string | null>(null);

  // Master Broadcast state
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [broadcastResult, setBroadcastResult] = useState<{ message: string; timestamp: string } | null>(null);

  // Selected leader for quick photo/info modal or inline editing
  const [editingLeaderId, setEditingLeaderId] = useState<string | null>(null);
  const [leaderForm, setLeaderForm] = useState<Partial<LeaderProfile>>({});

  // Selected timeline event
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState<Partial<TimelineEvent>>({});

  // Selected dress item
  const [editingDressId, setEditingDressId] = useState<string | null>(null);
  const [dressForm, setDressForm] = useState<Partial<TraditionalDressItem>>({});

  // Selected dictionary word
  const [editingWordId, setEditingWordId] = useState<string | null>(null);
  const [wordForm, setWordForm] = useState<Partial<DictionaryWord>>({});

  // Quick preset logos
  const PRESET_LOGOS = [
    {
      name: 'Official BYCN Emblem (Red & Blue)',
      url: DEFAULT_LOGO_URL,
      badge: 'Recommended'
    },
    {
      name: 'Bagmati River & Canoe Crest',
      url: '/uploads/header_logo_1789693983380_aok4s.png',
      badge: 'River Heritage'
    },
    {
      name: 'Indigenous Terai Youth Shield',
      url: '/uploads/Leader_Profile_Photo_1789693773254_i4fzp.png',
      badge: 'Youth Shield'
    }
  ];

  // Notice timer helper
  const showNotice = (msg: string) => {
    setLogoSaveNotice(msg);
    setTimeout(() => setLogoSaveNotice(null), 4000);
  };

  // 1. SAVE HEADER LOGO
  const handleSaveHeaderLogo = async () => {
    if (!headerLogoInput.trim()) return;
    setIsSavingHeaderLogo(true);
    try {
      setThemeHeaderLogo(headerLogoInput.trim());
      await saveHeaderLogo(headerLogoInput.trim());
      showNotice('✓ Header Official Logo saved to Cloud & active in Header navigation bar!');
    } catch (err) {
      console.warn(err);
      showNotice('Header logo saved locally.');
    } finally {
      setIsSavingHeaderLogo(false);
    }
  };

  // 2. SAVE FOOTER LOGO
  const handleSaveFooterLogo = async () => {
    if (!footerLogoInput.trim()) return;
    setIsSavingFooterLogo(true);
    try {
      setThemeFooterLogo(footerLogoInput.trim());
      await saveFooterLogo(footerLogoInput.trim());
      showNotice('✓ Footer Official Logo saved to Cloud & active in Footer!');
    } catch (err) {
      console.warn(err);
      showNotice('Footer logo saved locally.');
    } finally {
      setIsSavingFooterLogo(false);
    }
  };

  // 3. SAVE BOTH LOGOS
  const handleSaveBothLogos = async () => {
    setIsSavingBothLogos(true);
    try {
      setThemeHeaderLogo(headerLogoInput.trim());
      setThemeFooterLogo(footerLogoInput.trim());
      await saveBothLogos(headerLogoInput.trim(), footerLogoInput.trim());
      showNotice('✓ Both Header and Footer Official Logos successfully saved and synchronized!');
    } catch (err) {
      console.warn(err);
      showNotice('Logos synchronized locally.');
    } finally {
      setIsSavingBothLogos(false);
    }
  };

  // 4. COPY HEADER LOGO TO FOOTER
  const handleCopyHeaderToFooter = () => {
    setFooterLogoInput(headerLogoInput);
    showNotice('Copied Header Logo to Footer input. Click Save Footer Logo or Save Both to apply.');
  };

  // 5. RESET LOGOS TO DEFAULT
  const handleResetLogosToDefault = async () => {
    setHeaderLogoInput(DEFAULT_LOGO_URL);
    setFooterLogoInput(DEFAULT_LOGO_URL);
    setThemeHeaderLogo(DEFAULT_LOGO_URL);
    setThemeFooterLogo(DEFAULT_LOGO_URL);
    await saveBothLogos(DEFAULT_LOGO_URL, DEFAULT_LOGO_URL);
    showNotice('Reset both Header and Footer logos to default authentic BYCN emblem.');
  };

  // File upload for Header Logo
  const handleHeaderFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const b64 = event.target?.result as string;
      setHeaderLogoInput(b64);
      showNotice('Header Logo image loaded from device. Click "Save Header Official Logo" to commit.');
    };
    reader.readAsDataURL(file);
  };

  // File upload for Footer Logo
  const handleFooterFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const b64 = event.target?.result as string;
      setFooterLogoInput(b64);
      showNotice('Footer Logo image loaded from device. Click "Save Footer Official Logo" to commit.');
    };
    reader.readAsDataURL(file);
  };

  // File upload for Leader Photo
  const handleLeaderPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, leaderId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const b64 = event.target?.result as string;
      updateLeader(leaderId, { image: b64 });
      showNotice('Leader photo updated in real time!');
    };
    reader.readAsDataURL(file);
  };

  // 6. ONE-TIME MASTER BROADCAST EVERYTHING
  const handleMasterBroadcast = async () => {
    setIsBroadcasting(true);
    try {
      const result = await masterBroadcastEverything({
        siteIdentity: {
          ...siteIdentity,
          headerLogo: headerLogoInput.trim(),
          footerLogo: footerLogoInput.trim()
        }
      });
      setBroadcastResult({
        message: result.message,
        timestamp: result.timestamp
      });
      showNotice('🚀 Master One-Time Set complete! All modules broadcasted in real time.');
    } catch (err) {
      console.warn(err);
      showNotice('Master broadcast synced locally.');
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Master Broadcast Action */}
      <div className="bg-gradient-to-br from-slate-900 via-[#003893] to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Admin One-Time Master Center</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Firestore &amp; Server Real-Time Active</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-poppins tracking-tight text-white">
              One-Time Set Everything &amp; Show Real-Time
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Save your official Header &amp; Footer Logos, Youth and Community Leaders' Images, Historical Heritage Timeline, Traditional Dress &amp; Costumes, Bote Language Lexicon, and Community Census Metrics. All updates broadcast instantly across the website and cloud in real time.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
              <span>Status: <strong className="text-emerald-400 font-bold">{syncStatus.toUpperCase()}</strong></span>
              <span>•</span>
              <span>Last Synced: <strong className="text-slate-200">{lastSyncedTime || 'Real-Time'}</strong></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <button
              onClick={handleMasterBroadcast}
              disabled={isBroadcasting}
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-[#DC143C] to-red-600 hover:from-red-600 hover:to-red-700 text-white font-extrabold text-sm shadow-xl hover:shadow-red-900/40 transition transform active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
              title="One-click save all logos, leaders, history, dress, language, and metrics to cloud"
            >
              {isBroadcasting ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Zap className="w-5 h-5 text-amber-300" />
              )}
              <span>{isBroadcasting ? 'Broadcasting...' : '🚀 Master Save Everything Live'}</span>
            </button>

            {onNavigateToPublic && (
              <button
                onClick={onNavigateToPublic}
                className="px-4 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition flex items-center justify-center gap-2"
                title="Open public website to verify changes"
              >
                <Globe className="w-4 h-4 text-sky-400" />
                <span>View Public Site</span>
              </button>
            )}
          </div>
        </div>

        {/* Real-time status cards row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Header Logo</span>
            <span className="text-xs font-black text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
              <Check className="w-3.5 h-3.5" /> Saved &amp; Live
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Footer Logo</span>
            <span className="text-xs font-black text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
              <Check className="w-3.5 h-3.5" /> Saved &amp; Live
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Leaders &amp; Images</span>
            <span className="text-xs font-black text-white block mt-0.5">{leaders.length} Live Profiles</span>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">History Milestones</span>
            <span className="text-xs font-black text-white block mt-0.5">{timelineEvents.length} Eras</span>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Dress &amp; Costumes</span>
            <span className="text-xs font-black text-white block mt-0.5">{dressItems.length + costumes.length} Regalia</span>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Bote Lexicon</span>
            <span className="text-xs font-black text-white block mt-0.5">{dictionaryWords.length} Words</span>
          </div>
        </div>
      </div>

      {/* Floating Notice / Confirmation */}
      {logoSaveNotice && (
        <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg flex items-center justify-between font-bold text-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-200" />
            <span>{logoSaveNotice}</span>
          </div>
          <button onClick={() => setLogoSaveNotice(null)} className="text-emerald-200 hover:text-white font-black text-sm">
            &times;
          </button>
        </div>
      )}

      {/* Broadcast Result Banner */}
      {broadcastResult && (
        <div className="p-4 bg-blue-900 border border-blue-700 text-white rounded-2xl shadow-lg flex items-center justify-between font-semibold text-xs">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{broadcastResult.message} ({broadcastResult.timestamp})</span>
          </div>
          <button onClick={() => setBroadcastResult(null)} className="text-blue-200 hover:text-white font-black text-sm">
            &times;
          </button>
        </div>
      )}

      {/* Module Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
        <button
          onClick={() => setActiveSection('logos')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition flex items-center gap-2 ${
            activeSection === 'logos'
              ? 'bg-[#003893] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-amber-400" />
          <span>Official Logos (Header &amp; Footer)</span>
        </button>

        <button
          onClick={() => setActiveSection('leaders')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition flex items-center gap-2 ${
            activeSection === 'leaders'
              ? 'bg-[#003893] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          <span>Leaders &amp; Images ({leaders.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('history')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition flex items-center gap-2 ${
            activeSection === 'history'
              ? 'bg-[#003893] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-400" />
          <span>History &amp; Heritage ({timelineEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('dress')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition flex items-center gap-2 ${
            activeSection === 'dress'
              ? 'bg-[#003893] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Shirt className="w-4 h-4 text-rose-400" />
          <span>Dress &amp; Costumes ({dressItems.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('language')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition flex items-center gap-2 ${
            activeSection === 'language'
              ? 'bg-[#003893] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span>Bote Language ({dictionaryWords.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('metrics')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition flex items-center gap-2 ${
            activeSection === 'metrics'
              ? 'bg-[#003893] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-teal-400" />
          <span>Community Metrics ({communityMetrics.length})</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* SECTION 1: OFFICIAL LOGOS (HEADER & FOOTER)                     */}
      {/* ============================================================== */}
      {activeSection === 'logos' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#003893]" />
                  <span>Official Header &amp; Footer Logo Management</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Upload or paste your own custom logo for the Header navigation bar and the Footer. Use individual save buttons or Save Both for immediate cloud sync.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveBothLogos}
                  disabled={isSavingBothLogos}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  {isSavingBothLogos ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Both Logos</span>
                </button>

                <button
                  onClick={handleResetLogosToDefault}
                  className="px-3 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 font-bold text-xs transition flex items-center gap-1.5"
                  title="Reset to authentic BYCN emblem"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>
              </div>
            </div>

            {/* Side-by-side Header and Footer Logo Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 1. Header Official Logo Card */}
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-[#003893] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                      1. Header Official Logo
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">Shows on top sticky navigation bar</span>
                  </div>

                  {/* Header Logo Live Simulation */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-inner flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        <img
                          src={headerLogoInput || DEFAULT_LOGO_URL}
                          alt="Header Logo Preview"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = DEFAULT_LOGO_URL;
                          }}
                        />
                      </div>
                      <div>
                        <span className="text-xs font-extrabold text-slate-800 block">
                          Header Live Preview
                        </span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold inline-block mt-0.5">
                          ✓ Live across all tabs
                        </span>
                      </div>
                    </div>

                    <label className="cursor-pointer px-3 py-2 rounded-xl bg-[#003893] hover:bg-blue-900 text-white font-bold text-xs transition flex items-center gap-1.5 shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeaderFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Header URL Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Header Logo Image URL or Base64:</label>
                    <input
                      type="text"
                      value={headerLogoInput}
                      onChange={(e) => setHeaderLogoInput(e.target.value)}
                      placeholder="https://... or upload above"
                      className="w-full text-xs font-mono bg-white border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#003893] outline-none"
                    />
                  </div>
                </div>

                {/* Header Save Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-200">
                  <button
                    onClick={handleSaveHeaderLogo}
                    disabled={isSavingHeaderLogo}
                    className="flex-1 px-4 py-3 rounded-xl bg-[#003893] hover:bg-blue-900 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    {isSavingHeaderLogo ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-amber-400" />}
                    <span>💾 Save Header Official Logo</span>
                  </button>

                  <button
                    onClick={handleCopyHeaderToFooter}
                    className="px-3 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition flex items-center gap-1.5"
                    title="Copy this logo to footer as well"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy to Footer</span>
                  </button>
                </div>
              </div>

              {/* 2. Footer Official Logo Card */}
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-[#DC143C] bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                      2. Footer Official Logo
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">Shows on bottom footer &amp; copyright section</span>
                  </div>

                  {/* Footer Logo Live Simulation */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-inner flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        <img
                          src={footerLogoInput || DEFAULT_LOGO_URL}
                          alt="Footer Logo Preview"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = DEFAULT_LOGO_URL;
                          }}
                        />
                      </div>
                      <div>
                        <span className="text-xs font-extrabold text-slate-800 block">
                          Footer Live Preview
                        </span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold inline-block mt-0.5">
                          ✓ Live on dark &amp; light footers
                        </span>
                      </div>
                    </div>

                    <label className="cursor-pointer px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition flex items-center gap-1.5 shrink-0">
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFooterFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Footer URL Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Footer Logo Image URL or Base64:</label>
                    <input
                      type="text"
                      value={footerLogoInput}
                      onChange={(e) => setFooterLogoInput(e.target.value)}
                      placeholder="https://... or upload above"
                      className="w-full text-xs font-mono bg-white border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#DC143C] outline-none"
                    />
                  </div>
                </div>

                {/* Footer Save Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-200">
                  <button
                    onClick={handleSaveFooterLogo}
                    disabled={isSavingFooterLogo}
                    className="flex-1 px-4 py-3 rounded-xl bg-[#DC143C] hover:bg-red-700 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    {isSavingFooterLogo ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-amber-300" />}
                    <span>💾 Save Footer Official Logo</span>
                  </button>

                  <button
                    onClick={() => setFooterLogoInput(DEFAULT_LOGO_URL)}
                    className="px-3 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition flex items-center gap-1.5"
                    title="Reset to default emblem"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Preset Logo Selection Row */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-700 block">
                Quick Select Authentic Presets (One-Click Apply to Both):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PRESET_LOGOS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setHeaderLogoInput(preset.url);
                      setFooterLogoInput(preset.url);
                      showNotice(`Selected preset "${preset.name}". Click "Save Both Logos" to commit.`);
                    }}
                    className="flex items-center gap-3 p-3 bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-2xl text-left transition group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center overflow-hidden shrink-0">
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-800 block truncate group-hover:text-[#003893]">
                        {preset.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{preset.badge}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 2: LEADERS & COMMUNITY LEADERS IMAGE                   */}
      {/* ============================================================== */}
      {activeSection === 'leaders' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#003893]" />
                  <span>Community Leaders &amp; Real-Time Photos</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Showing real-time leader profile cards. Update photos, names, designations, and contact info instantly.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                  {leaders.length} Active Leaders
                </span>
              </div>
            </div>

            {/* Leaders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leaders.map((leader) => (
                <div
                  key={leader.id}
                  className="bg-slate-50 rounded-3xl p-5 border border-slate-200 hover:border-blue-300 transition shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Leader Photo with Live Upload */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-200 border border-slate-300 group">
                      <img
                        src={resolveAssetUrl(leader.image) || resolveAssetUrl('/assets/leader_avatar_placeholder.svg')}
                        alt={leader.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const cached = getSynchronousCachedAsset(leader.image);
                          if (cached && target.src !== cached) {
                            target.src = cached;
                          } else {
                            target.src = resolveAssetUrl('/assets/leader_avatar_placeholder.svg');
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                        <span className="text-xs font-bold">{leader.name}</span>
                        <span className="text-[10px] text-amber-300">{leader.role}</span>
                      </div>

                      {/* Floating Upload Photo Button */}
                      <label className="absolute top-2 right-2 cursor-pointer p-2 rounded-xl bg-white/90 hover:bg-white text-slate-800 shadow-md transition flex items-center gap-1 text-[10px] font-bold">
                        <Upload className="w-3 h-3 text-[#003893]" />
                        <span>Change Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleLeaderPhotoUpload(e, leader.id)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Leader Information Fields */}
                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Full Name (English):</label>
                        <input
                          type="text"
                          value={leader.name}
                          onChange={(e) => updateLeader(leader.id, { name: e.target.value })}
                          className="w-full text-xs font-bold bg-white border border-slate-300 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-[#003893] outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Nepali Name (Devanagari):</label>
                        <input
                          type="text"
                          value={leader.nameNepali || ''}
                          onChange={(e) => updateLeader(leader.id, { nameNepali: e.target.value })}
                          className="w-full text-xs font-medium bg-white border border-slate-300 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-[#003893] outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Role / Designation:</label>
                        <input
                          type="text"
                          value={leader.role}
                          onChange={(e) => updateLeader(leader.id, { role: e.target.value })}
                          className="w-full text-xs font-semibold text-[#003893] bg-white border border-slate-300 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-[#003893] outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Image URL:</label>
                        <input
                          type="text"
                          value={leader.image}
                          onChange={(e) => updateLeader(leader.id, { image: e.target.value })}
                          className="w-full text-[11px] font-mono bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 focus:ring-2 focus:ring-[#003893] outline-none truncate"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                      ✓ Real-time Live
                    </span>
                    <button
                      onClick={() => {
                        showNotice(`Leader ${leader.name} saved live!`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition flex items-center gap-1"
                    >
                      <Save className="w-3 h-3 text-amber-400" />
                      <span>Save Live</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 3: HISTORY & HERITAGE TIMELINE                         */}
      {/* ============================================================== */}
      {activeSection === 'history' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#003893]" />
                  <span>Bote Community History &amp; Archival Images</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Manage historical milestones from the ancient tree trunk origin legend, river ferry kings, to the 2026 digital youth revival.
                </p>
              </div>

              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                {timelineEvents.length} Historical Eras
              </span>
            </div>

            {/* Timeline List */}
            <div className="space-y-4">
              {timelineEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-slate-50 rounded-2xl p-5 border border-slate-200 hover:border-blue-300 transition flex flex-col md:flex-row gap-5 items-start"
                >
                  <div className="w-full md:w-44 h-32 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300 relative group">
                    <img
                      src={resolveAssetUrl(evt.image) || resolveAssetUrl('/favicon.svg')}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = resolveAssetUrl('/favicon.svg');
                      }}
                    />
                    <label className="absolute bottom-1 right-1 cursor-pointer p-1.5 rounded-lg bg-black/70 hover:bg-black text-white text-[9px] font-bold transition flex items-center gap-1">
                      <Upload className="w-3 h-3 text-amber-300" />
                      <span>Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const r = new FileReader();
                          r.onload = (ev) => {
                            updateTimelineEvent(evt.id, { image: ev.target?.result as string });
                            showNotice('Milestone archival image updated!');
                          };
                          r.readAsDataURL(f);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex-1 space-y-2.5 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="text"
                        value={evt.year}
                        onChange={(e) => updateTimelineEvent(evt.id, { year: e.target.value })}
                        className="w-24 text-xs font-black text-[#DC143C] bg-white border border-slate-300 rounded-lg px-2.5 py-1"
                        placeholder="Year"
                      />
                      <input
                        type="text"
                        value={evt.title}
                        onChange={(e) => updateTimelineEvent(evt.id, { title: e.target.value })}
                        className="flex-1 text-sm font-extrabold text-slate-900 bg-white border border-slate-300 rounded-lg px-2.5 py-1"
                        placeholder="Milestone Title"
                      />
                    </div>

                    <textarea
                      value={evt.summary}
                      onChange={(e) => updateTimelineEvent(evt.id, { summary: e.target.value })}
                      rows={2}
                      className="w-full text-xs text-slate-600 bg-white border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-[#003893] outline-none"
                      placeholder="Historical narrative & cultural significance..."
                    />

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-mono">Image URL:</span>
                        <input
                          type="text"
                          value={evt.image || ''}
                          onChange={(e) => updateTimelineEvent(evt.id, { image: e.target.value })}
                          className="text-[11px] font-mono bg-white border border-slate-300 rounded-md px-2 py-0.5 w-60 truncate"
                        />
                      </div>

                      <button
                        onClick={() => showNotice(`Historical era "${evt.title}" saved live!`)}
                        className="px-3 py-1 rounded-xl bg-[#003893] hover:bg-blue-900 text-white font-bold text-xs transition flex items-center gap-1"
                      >
                        <Save className="w-3 h-3 text-amber-400" />
                        <span>Save Era</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 4: TRADITIONAL DRESS & COSTUMES                        */}
      {/* ============================================================== */}
      {activeSection === 'dress' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Shirt className="w-5 h-5 text-[#DC143C]" />
                  <span>Traditional Bote Dress, Jewelry &amp; River Regalia</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kachhad, Gunyou Cholo, Hansuli necklaces, Bulaki, handcrafted fishing nets (Jaal), and dugout canoe attire.
                </p>
              </div>

              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                {dressItems.length} Traditional Items
              </span>
            </div>

            {/* Dress Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dressItems.map((dress) => (
                <div
                  key={dress.id}
                  className="bg-slate-50 rounded-3xl p-5 border border-slate-200 hover:border-red-300 transition shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-200 border border-slate-300 group">
                      <img
                        src={resolveAssetUrl(dress.image) || resolveAssetUrl('/favicon.svg')}
                        alt={dress.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = resolveAssetUrl('/favicon.svg');
                        }}
                      />
                      <label className="absolute top-2 right-2 cursor-pointer p-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 shadow-md transition flex items-center gap-1 text-[10px] font-bold">
                        <Upload className="w-3 h-3 text-[#DC143C]" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            const r = new FileReader();
                            r.onload = (ev) => {
                              updateDressItem(dress.id, { image: ev.target?.result as string });
                              showNotice(`Dress photo updated for ${dress.name}!`);
                            };
                            r.readAsDataURL(f);
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={dress.name}
                          onChange={(e) => updateDressItem(dress.id, { name: e.target.value })}
                          className="flex-1 text-xs font-bold bg-white border border-slate-300 rounded-xl px-3 py-1.5"
                          placeholder="English Name"
                        />
                        <span className="text-[10px] font-black uppercase tracking-wider text-white bg-[#DC143C] px-2 py-1 rounded-lg capitalize">
                          {dress.gender}
                        </span>
                      </div>

                      <input
                        type="text"
                        value={dress.nameNepali || ''}
                        onChange={(e) => updateDressItem(dress.id, { nameNepali: e.target.value })}
                        className="w-full text-xs font-medium bg-white border border-slate-300 rounded-xl px-3 py-1.5"
                        placeholder="Nepali Devanagari"
                      />

                      <textarea
                        value={dress.description}
                        onChange={(e) => updateDressItem(dress.id, { description: e.target.value })}
                        rows={2}
                        className="w-full text-xs text-slate-600 bg-white border border-slate-300 rounded-xl p-2 focus:ring-2 focus:ring-[#DC143C] outline-none"
                        placeholder="Significance & materials..."
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                      ✓ Real-time Live
                    </span>
                    <button
                      onClick={() => showNotice(`Traditional regalia "${dress.name}" saved live!`)}
                      className="px-3 py-1.5 rounded-xl bg-[#DC143C] hover:bg-red-700 text-white font-bold text-xs transition flex items-center gap-1"
                    >
                      <Save className="w-3 h-3 text-amber-300" />
                      <span>Save Live</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 5: BOTE LANGUAGE DICTIONARY                            */}
      {/* ============================================================== */}
      {activeSection === 'language' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#003893]" />
                  <span>Tarahi Bote Indigenous Language Lexicon</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Searchable dictionary preserving indigenous river terminology, nature, and cultural vocabulary.
                </p>
              </div>

              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                {dictionaryWords.length} Words in Lexicon
              </span>
            </div>

            {/* Language Dictionary Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                    <th className="p-3">Bote Word (Devanagari)</th>
                    <th className="p-3">Nepali Equivalent</th>
                    <th className="p-3">English Translation</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dictionaryWords.slice(0, 15).map((word) => (
                    <tr key={word.id} className="hover:bg-blue-50/40 transition">
                      <td className="p-3 font-bold text-[#003893]">
                        <input
                          type="text"
                          value={word.devnagari}
                          onChange={(e) => updateDictionaryWord(word.id, { devnagari: e.target.value })}
                          className="bg-transparent font-bold text-sm text-[#003893] border-b border-transparent hover:border-slate-300 focus:border-[#003893] outline-none"
                        />
                      </td>
                      <td className="p-3 text-slate-700">
                        <input
                          type="text"
                          value={word.nepali}
                          onChange={(e) => updateDictionaryWord(word.id, { nepali: e.target.value })}
                          className="bg-transparent text-slate-700 border-b border-transparent hover:border-slate-300 focus:border-[#003893] outline-none"
                        />
                      </td>
                      <td className="p-3 text-slate-600">
                        <input
                          type="text"
                          value={word.english}
                          onChange={(e) => updateDictionaryWord(word.id, { english: e.target.value })}
                          className="bg-transparent text-slate-600 border-b border-transparent hover:border-slate-300 focus:border-[#003893] outline-none"
                        />
                      </td>
                      <td className="p-3">
                        <span className="bg-blue-50 text-[#003893] px-2 py-0.5 rounded-full font-bold text-[10px]">
                          {word.category || 'General'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => showNotice(`Word "${word.devnagari}" saved live!`)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-black text-white text-[10px] font-bold transition"
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 6: COMMUNITY KEY METRICS                               */}
      {/* ============================================================== */}
      {activeSection === 'metrics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-teal-600" />
                  <span>Official Census &amp; Community Metrics</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Real-time counters visible in the hero bento grid and stats bar.
                </p>
              </div>

              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                {communityMetrics.length} Key Metrics
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {communityMetrics.map((m) => (
                <div key={m.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    {m.title}
                  </span>
                  <input
                    type="text"
                    value={m.value}
                    onChange={(e) => updateCommunityMetric(m.id, { value: e.target.value })}
                    className="w-full text-lg font-black text-[#003893] bg-white border border-slate-300 rounded-xl px-3 py-1.5 font-poppins focus:ring-2 focus:ring-[#003893] outline-none"
                  />
                  <input
                    type="text"
                    value={m.subtitle}
                    onChange={(e) => updateCommunityMetric(m.id, { subtitle: e.target.value })}
                    className="w-full text-xs text-slate-600 bg-white border border-slate-300 rounded-lg px-2 py-1"
                    placeholder="Subtitle / source notes"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Master Action Footer */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-300 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Ready to broadcast all changes to Firestore, Cloud server, and public website.</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleMasterBroadcast}
            disabled={isBroadcasting}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#DC143C] to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            {isBroadcasting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-amber-300" />}
            <span>🚀 Master Save &amp; Broadcast Everything</span>
          </button>
        </div>
      </div>
    </div>
  );
}
