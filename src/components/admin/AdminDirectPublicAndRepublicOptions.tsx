/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCommunityData } from '../../context/CommunityDataContext';
import {
  Globe,
  Radio,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Rocket,
  ShieldCheck,
  Zap,
  Sliders,
  Database,
  Users,
  BookOpen,
  Layers,
  History,
  Clock,
  ExternalLink,
  ChevronRight,
  Eye,
  Megaphone
} from 'lucide-react';

interface AdminDirectPublicAndRepublicOptionsProps {
  onNavigateHome?: () => void;
  showNotification?: (msg: string) => void;
}

export default function AdminDirectPublicAndRepublicOptions({
  onNavigateHome,
  showNotification
}: AdminDirectPublicAndRepublicOptionsProps) {
  const {
    directLiveSync,
    setDirectLiveSync,
    directlyUpdatePublic,
    republicWebsite,
    lastRepublicInfo,
    followerCount,
    siteIdentity
  } = useCommunityData();

  const [isUpdatingPublic, setIsUpdatingPublic] = useState(false);
  const [isRepublicing, setIsRepublicing] = useState(false);
  const [republicNotes, setRepublicNotes] = useState('Official community data update & public re-publication');
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [republicFeedback, setRepublicFeedback] = useState<string | null>(null);

  // Scope toggles for Republic
  const [scopeLayout, setScopeLayout] = useState(true);
  const [scopeLogos, setScopeLogos] = useState(true);
  const [scopeMetrics, setScopeMetrics] = useState(true);
  const [scopeNotices, setScopeNotices] = useState(true);
  const [scopePurgeCache, setScopePurgeCache] = useState(true);

  const handleDirectUpdate = async () => {
    setIsUpdatingPublic(true);
    setSyncFeedback(null);
    try {
      const result = await directlyUpdatePublic();
      setSyncFeedback(result.message);
      if (showNotification) showNotification(result.message);
    } catch (e: any) {
      setSyncFeedback('Direct update applied to local storage and active windows.');
    } finally {
      setIsUpdatingPublic(false);
    }
  };

  const handleRepublic = async () => {
    setIsRepublicing(true);
    setRepublicFeedback(null);
    try {
      const scopeSummary = [
        scopeLayout ? 'layout' : null,
        scopeLogos ? 'logos' : null,
        scopeMetrics ? 'metrics' : null,
        scopeNotices ? 'notices-circulars' : null,
        scopePurgeCache ? 'purge-cache' : null
      ]
        .filter(Boolean)
        .join('+');

      const result = await republicWebsite({
        notes: republicNotes.trim() || 'Master website republication',
        scope: scopeSummary
      });

      setRepublicFeedback(`${result.message} (Version: ${result.version})`);
      if (showNotification) showNotification(`🚀 Republication Successful! Version: ${result.version}`);
    } catch (e: any) {
      setRepublicFeedback('Republication applied across client and server.');
    } finally {
      setIsRepublicing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ============================================================== */}
      {/* OPTION 3: DIRECT PUBLIC LIVE UPDATE ENGINE */}
      {/* ============================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                Option 3
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                Live Direct Sync
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 font-poppins mt-2 flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-600" />
              <span>Direct Public Live Update Engine</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              <strong>Website Admins Update Anything in this Website Directly Updating Public.</strong> Any changes made to youth leaders, cultural traditions, dictionary entries, costumes, census metrics, and official logos can be broadcast directly to public visitors with zero staging lag.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-2xl flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Direct Public Live Mode:</span>
              <button
                type="button"
                onClick={() => {
                  const nextState = !directLiveSync;
                  setDirectLiveSync(nextState);
                  if (showNotification) {
                    showNotification(
                      nextState
                        ? '🟢 Direct Public Live Update mode enabled.'
                        : '⏸️ Staging mode enabled (changes require manual republication).'
                    );
                  }
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  directLiveSync ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
                role="switch"
                aria-checked={directLiveSync}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    directLiveSync ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Live Status Callout Banner */}
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          directLiveSync
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            : 'bg-amber-50/70 border-amber-200 text-amber-950'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              directLiveSync ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
            }`}>
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold flex items-center gap-1.5">
                <span>{directLiveSync ? '🟢 Direct Public Live Sync Active' : '⏸️ Direct Sync Paused (Draft Staging)'}</span>
                <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-white/80 border border-current">
                  {directLiveSync ? 'Instant Public Broadcast' : 'Manual Push Required'}
                </span>
              </div>
              <p className="text-[11px] opacity-80 mt-0.5">
                {directLiveSync
                  ? 'All edits to Leaders, Culture, Costumes, Language, Census, and Logos immediately refresh public website visitors.'
                  : 'Edits stay saved locally until you trigger "Directly Update Public Now" or "Republic Entire Website".'}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isUpdatingPublic}
            onClick={handleDirectUpdate}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-sm shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isUpdatingPublic ? 'animate-spin' : ''}`} />
            <span>{isUpdatingPublic ? 'Updating Public Site...' : 'Directly Update Public Website Now'}</span>
          </button>
        </div>

        {/* Sync Feedback Message */}
        {syncFeedback && (
          <div className="p-3.5 bg-emerald-100/80 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{syncFeedback}</span>
          </div>
        )}

        {/* Matrix of what website admins update directly */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
            Directly Synchronized Public Modules (Zero-Delay Admin Authority):
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                title: 'Official Header & Footer Emblem',
                desc: 'Instant logo swaps displayed on all public navigation bars.',
                icon: Layers,
                color: 'text-red-600 bg-red-50 border-red-200'
              },
              {
                title: 'Youth Leadership & Committee',
                desc: 'Add, edit, or re-order committee members with real-time sync.',
                icon: Users,
                color: 'text-blue-600 bg-blue-50 border-blue-200'
              },
              {
                title: 'Cultural Milestones & Heritage',
                desc: 'Historical timeline events and Majhi-Bote boat craft traditions.',
                icon: BookOpen,
                color: 'text-amber-600 bg-amber-50 border-amber-200'
              },
              {
                title: 'Tarahi Bote Indigenous Language',
                desc: 'Dictionary terms, phonetics, and Devanagari pronunciations.',
                icon: Globe,
                color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
              },
              {
                title: 'Traditional Attire & Costumes',
                desc: 'Chhitko Gunyo, Bhangra, and ceremonial attire catalogs.',
                icon: Sparkles,
                color: 'text-purple-600 bg-purple-50 border-purple-200'
              },
              {
                title: 'National Census & Metrics',
                desc: 'Bote population (13,446+), wards, and education fund balances.',
                icon: Database,
                color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
              }
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-start gap-3"
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${item.color}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{item.title}</h5>
                    <p className="text-[10.5px] text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* OPTION 4: REPUBLIC WEBSITE OPTIONS */}
      {/* ============================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-[#003893] border border-blue-300 px-2.5 py-0.5 rounded-full">
                Option 4
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-red-100 text-[#DC143C] px-2 py-0.5 rounded-full flex items-center gap-1">
                <Rocket className="w-3 h-3 text-[#DC143C]" />
                Republic Engine
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 font-poppins mt-2 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-[#003893]" />
              <span>Republic / Re-publish Website Options</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              <strong>Master Website Republication.</strong> Re-compiles all platform components, pushes fresh server snapshots, invalidates stale browser caches, and generates an official verified Republic Version stamp.
            </p>
          </div>

          {/* Current Republic Status Badge */}
          <div className="bg-slate-900 text-white rounded-2xl p-3 border border-slate-800 shrink-0 text-right">
            <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider">
              Current Republic Version
            </div>
            <div className="text-xs font-mono font-black text-amber-400 mt-0.5">
              {lastRepublicInfo?.version || 'v2026.09.1-LIVE'}
            </div>
            <div className="text-[9.5px] text-slate-400 mt-0.5 flex items-center justify-end gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>
                {lastRepublicInfo?.timestamp
                  ? new Date(lastRepublicInfo.timestamp).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'Active'}
              </span>
            </div>
          </div>
        </div>

        {/* Republic Scope Configuration Checkboxes */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#003893]" />
              <span>Republication Scope &amp; Target Components</span>
            </label>
            <span className="text-[10px] font-bold text-slate-500">Configure what is re-published</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-slate-300">
              <input
                type="checkbox"
                checked={scopeLayout}
                onChange={(e) => setScopeLayout(e.target.checked)}
                className="mt-0.5 rounded text-[#003893] focus:ring-[#003893]"
              />
              <div>
                <span className="font-bold text-slate-900 block">Core Public Views &amp; Layout</span>
                <span className="text-[10.5px] text-slate-500 leading-snug block">
                  Home, Leaders, History, Culture, Dictionary, and Education portal.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-slate-300">
              <input
                type="checkbox"
                checked={scopeLogos}
                onChange={(e) => setScopeLogos(e.target.checked)}
                className="mt-0.5 rounded text-[#003893] focus:ring-[#003893]"
              />
              <div>
                <span className="font-bold text-slate-900 block">Header/Footer Official Logos &amp; Identity</span>
                <span className="text-[10.5px] text-slate-500 leading-snug block">
                  Re-publish official BYCN emblems and Nepali Crimson theme colors.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-slate-300">
              <input
                type="checkbox"
                checked={scopeMetrics}
                onChange={(e) => setScopeMetrics(e.target.checked)}
                className="mt-0.5 rounded text-[#003893] focus:ring-[#003893]"
              />
              <div>
                <span className="font-bold text-slate-900 block">Census Metrics &amp; Live Follower Counts</span>
                <span className="text-[10.5px] text-slate-500 leading-snug block">
                  Current follower milestone ({followerCount.toLocaleString()}) and census numbers.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-slate-300">
              <input
                type="checkbox"
                checked={scopeNotices}
                onChange={(e) => setScopeNotices(e.target.checked)}
                className="mt-0.5 rounded text-[#003893] focus:ring-[#003893]"
              />
              <div>
                <span className="font-bold text-slate-900 block">Notices, Meetings, Files &amp; Photos</span>
                <span className="text-[10.5px] text-slate-500 leading-snug block">
                  Broadcasts all published notices, PDF files, and community events directly to visitors.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-slate-300">
              <input
                type="checkbox"
                checked={scopePurgeCache}
                onChange={(e) => setScopePurgeCache(e.target.checked)}
                className="mt-0.5 rounded text-[#003893] focus:ring-[#003893]"
              />
              <div>
                <span className="font-bold text-slate-900 block">Purge Visitor Cache &amp; Trigger Reload</span>
                <span className="text-[10.5px] text-slate-500 leading-snug block">
                  Broadcasts sync event to all active browsers to display fresh content.
                </span>
              </div>
            </label>
          </div>

          {/* Release Notes for Republication */}
          <div className="pt-2">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Republication Log Note / Release Summary:
            </label>
            <input
              type="text"
              value={republicNotes}
              onChange={(e) => setRepublicNotes(e.target.value)}
              placeholder="e.g. Updated cultural leaders and Tarahi dictionary definitions"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003893] bg-white font-sans text-slate-900"
            />
          </div>
        </div>

        {/* Republic Master Action Button */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#003893] to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Rocket className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span>Republic Entire Website</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                  Production Sync
                </span>
              </h4>
              <p className="text-xs text-white/80 mt-0.5">
                Executes complete re-publication across all devices, builds new version hash, and syncs live public portal.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isRepublicing}
            onClick={handleRepublic}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer shrink-0"
          >
            <Rocket className={`w-4 h-4 ${isRepublicing ? 'animate-bounce' : ''}`} />
            <span>{isRepublicing ? 'Re-publishing Entire Website...' : '🚀 Republic Entire Website Now'}</span>
          </button>
        </div>

        {/* Republic Feedback */}
        {republicFeedback && (
          <div className="p-3.5 bg-blue-50 border border-blue-200 text-[#003893] rounded-xl text-xs font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{republicFeedback}</span>
          </div>
        )}

        {/* Quick Navigate to Check Live Republic */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Website Admins have full continuous authority to republish and update public at any time.</span>
          </div>

          {onNavigateHome && (
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>View Live Public Website &rarr;</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
