/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCommunityData } from '../../context/CommunityDataContext';
import { CommunityMetric, RegisteredMember } from '../../types';
import MembershipIdCard from '../MembershipIdCard';
import {
  Users,
  CheckCircle2,
  Clock,
  ShieldCheck,
  IdCard,
  RefreshCw,
  Search,
  Download,
  Filter,
  Trash2,
  Edit3,
  Check,
  X,
  AlertCircle,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  HelpCircle,
  Volume2,
  VolumeX,
  Radio,
  Save,
  RotateCcw,
  BookOpen,
  Award,
  Globe,
  Database,
  ArrowRight
} from 'lucide-react';

export default function AdminSettingsMetricsAndMembers() {
  const {
    communityMetrics,
    updateCommunityMetric,
    saveCommunityMetrics,
    resetCommunityMetrics,
    autoResearchCommunityMetrics,
    autoReloadConfig,
    updateAutoReloadConfig,
    triggerManualReload,
    registeredMembers,
    loadRegisteredMembers,
    updateMemberStatus,
    deleteRegisteredMember,
    syncStatus,
    lastSyncedTime
  } = useCommunityData();

  // Metrics Editing State
  const [metricsState, setMetricsState] = useState<CommunityMetric[]>(communityMetrics);
  const [editingMetricId, setEditingMetricId] = useState<string | null>(null);
  const [isResearching, setIsResearching] = useState(false);
  const [metricsSuccessMsg, setMetricsSuccessMsg] = useState<string | null>(null);

  // Auto Reload Testing State
  const [isReloading, setIsReloading] = useState(false);
  const [showWhyExplain, setShowWhyExplain] = useState(true);

  // New Members Filtering & Search
  const [memberSearch, setMemberSearch] = useState('');
  const [memberStatusFilter, setMemberStatusFilter] = useState<'all' | 'pending' | 'verified' | 'active'>('all');
  const [selectedMemberForCard, setSelectedMemberForCard] = useState<RegisteredMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<RegisteredMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync internal metricsState when communityMetrics changes
  React.useEffect(() => {
    setMetricsState(communityMetrics);
  }, [communityMetrics]);

  // Member statistics
  const totalCount = registeredMembers.length;
  const verifiedCount = registeredMembers.filter((m) => m.status === 'verified').length;
  const activeCount = registeredMembers.filter((m) => m.status === 'active').length;
  const pendingCount = registeredMembers.filter((m) => m.status === 'pending').length;

  // Filtered members
  const filteredMembers = registeredMembers.filter((m) => {
    const q = memberSearch.toLowerCase();
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      (m.nameNepali && m.nameNepali.includes(q)) ||
      m.phone.includes(q) ||
      (m.email && m.email.toLowerCase().includes(q)) ||
      (m.ward && m.ward.toLowerCase().includes(q)) ||
      (m.municipality && m.municipality.toLowerCase().includes(q)) ||
      (m.membershipId && m.membershipId.toLowerCase().includes(q));

    const matchesStatus = memberStatusFilter === 'all' || m.status === memberStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle saving metric field
  const handleMetricChange = (id: string, field: keyof CommunityMetric, val: string) => {
    setMetricsState((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: val } : m))
    );
  };

  // Save all metrics
  const handleSaveAllMetrics = async () => {
    await saveCommunityMetrics(metricsState);
    setEditingMetricId(null);
    setMetricsSuccessMsg('Community metrics successfully saved and broadcast to live website!');
    setTimeout(() => setMetricsSuccessMsg(null), 4000);
  };

  // Auto Research Trigger
  const handleAutoResearch = async () => {
    setIsResearching(true);
    try {
      const researched = await autoResearchCommunityMetrics();
      setMetricsState(researched);
      setMetricsSuccessMsg('Auto-research complete! Official Census 2021 & Ward Council citations populated.');
      setTimeout(() => setMetricsSuccessMsg(null), 4500);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsResearching(false);
    }
  };

  // Reset to Census defaults
  const handleResetDefaults = () => {
    resetCommunityMetrics();
    setMetricsSuccessMsg('Reset to official census defaults.');
    setTimeout(() => setMetricsSuccessMsg(null), 3500);
  };

  // Trigger manual reload
  const handleTriggerReload = async () => {
    setIsReloading(true);
    await triggerManualReload();
    setTimeout(() => setIsReloading(false), 600);
  };

  // Export Members to CSV
  const handleExportCSV = () => {
    if (registeredMembers.length === 0) {
      setMetricsSuccessMsg('No member records to export.');
      setTimeout(() => setMetricsSuccessMsg(null), 3500);
      return;
    }
    const headers = [
      'Membership ID',
      'Name',
      'Nepali Name',
      'Status',
      'Category',
      'Phone',
      'Email',
      'Ward',
      'Municipality',
      'District',
      'Age',
      'Gender',
      'Education',
      'Interest',
      'Registered At'
    ];
    const rows = registeredMembers.map((m) => [
      `"${m.membershipId || m.id}"`,
      `"${m.name}"`,
      `"${m.nameNepali || ''}"`,
      `"${m.status}"`,
      `"${m.category || ''}"`,
      `"${m.phone}"`,
      `"${m.email || ''}"`,
      `"${m.ward}"`,
      `"${m.municipality || ''}"`,
      `"${m.district || ''}"`,
      `"${m.age}"`,
      `"${m.gender || ''}"`,
      `"${m.education || ''}"`,
      `"${m.interest || ''}"`,
      `"${m.registeredAt}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bycn_members_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete Member Confirm
  const confirmDeleteMember = async () => {
    if (!memberToDelete) return;
    setIsDeleting(true);
    await deleteRegisteredMember(memberToDelete.id);
    setIsDeleting(false);
    setMemberToDelete(null);
  };

  return (
    <div className="space-y-8" id="admin-settings-metrics-members">
      {/* ============================================================ */}
      {/* SECTION 1: COMMUNITY KEY METRICS (Population, Wards, Fund, Pride) */}
      {/* ============================================================ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                Live Community Data
              </span>
              <h3 className="text-xl font-black text-slate-900 font-poppins flex items-center gap-2">
                <Award className="w-5 h-5 text-red-600" />
                <span>Bote Population, Council Wards, Scholarship Fund &amp; Indigenous Pride</span>
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Manage the 4 foundational community metrics displayed across the Hero section, Bento Grid, and official portal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Auto Research Button */}
            <button
              type="button"
              onClick={handleAutoResearch}
              disabled={isResearching}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Auto research & pull official Census 2021 & Ward Council figures"
            >
              <Sparkles className={`w-4 h-4 text-indigo-600 ${isResearching ? 'animate-spin' : ''}`} />
              <span>{isResearching ? 'Auto-Researching...' : 'Auto-Research & Update Citations'}</span>
            </button>

            {/* Save All Metrics */}
            <button
              type="button"
              onClick={handleSaveAllMetrics}
              className="bg-[#003893] hover:bg-blue-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Metrics</span>
            </button>

            {/* Reset to Defaults */}
            <button
              type="button"
              onClick={handleResetDefaults}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              title="Reset to official census defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feedback Message */}
        {metricsSuccessMsg && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{metricsSuccessMsg}</span>
          </div>
        )}

        {/* Live Hero Preview Strip */}
        <div className="bg-gradient-to-r from-[#001f54] via-[#003893] to-[#DC143C] p-4 sm:p-5 rounded-2xl text-white">
          <div className="flex items-center justify-between text-[11px] font-bold text-white/80 uppercase tracking-wider mb-3">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Live Homepage Preview (Dynamic Hero Strip)
            </span>
            <span className="font-mono text-[10px] text-white/70">Updates in real time</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            {metricsState.slice(0, 4).map((m) => (
              <div key={m.id} className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                <div className={`text-2xl font-black font-poppins ${m.highlightColor || 'text-white'}`}>
                  {m.value}
                </div>
                <div className="text-[11px] text-white/90 font-bold uppercase tracking-wider mt-0.5">
                  {m.title}
                </div>
                {m.subtitle && (
                  <div className="text-[9px] text-white/60 truncate mt-0.5">
                    {m.subtitle}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Editable Table of Metrics */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Metric Title</th>
                <th className="py-3 px-4">Display Value</th>
                <th className="py-3 px-4">Unit / Scope</th>
                <th className="py-3 px-4">Subtitle / Context</th>
                <th className="py-3 px-4">Official Citation Source</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metricsState.map((metric) => {
                const isEditing = editingMetricId === metric.id;
                return (
                  <tr key={metric.id} className="hover:bg-slate-50/60 transition">
                    {/* Title */}
                    <td className="py-3.5 px-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={metric.title}
                          onChange={(e) => handleMetricChange(metric.id, 'title', e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
                        />
                      ) : (
                        <div>
                          <span className="font-extrabold text-slate-900 text-sm block">
                            {metric.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ID: {metric.id}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Value */}
                    <td className="py-3.5 px-4 font-mono">
                      {isEditing ? (
                        <input
                          type="text"
                          value={metric.value}
                          onChange={(e) => handleMetricChange(metric.id, 'value', e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-black text-slate-900"
                        />
                      ) : (
                        <span className="text-base font-black text-[#003893] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 inline-block">
                          {metric.value}
                        </span>
                      )}
                    </td>

                    {/* Unit */}
                    <td className="py-3.5 px-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={metric.unit || ''}
                          onChange={(e) => handleMetricChange(metric.id, 'unit', e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-700"
                        />
                      ) : (
                        <span className="text-slate-600 font-medium">
                          {metric.unit || '—'}
                        </span>
                      )}
                    </td>

                    {/* Subtitle */}
                    <td className="py-3.5 px-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={metric.subtitle || ''}
                          onChange={(e) => handleMetricChange(metric.id, 'subtitle', e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-700"
                        />
                      ) : (
                        <span className="text-slate-700 font-semibold">
                          {metric.subtitle || '—'}
                        </span>
                      )}
                    </td>

                    {/* Source Citation */}
                    <td className="py-3.5 px-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={metric.sourceCitation || ''}
                          onChange={(e) => handleMetricChange(metric.id, 'sourceCitation', e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-700"
                        />
                      ) : (
                        <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md inline-block max-w-[220px] truncate" title={metric.sourceCitation}>
                          {metric.sourceCitation || 'Community Archive'}
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      {isEditing ? (
                        <button
                          type="button"
                          onClick={handleSaveAllMetrics}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Done</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setEditingMetricId(metric.id)}
                          className="text-slate-500 hover:text-[#003893] p-1.5 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="Edit this metric"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: MEMBERS DASHBOARD & SUMMARY STATUS COUNTS */}
      {/* ============================================================ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                Membership Analytics
              </span>
              <h3 className="text-xl font-black text-slate-900 font-poppins flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Total Members, Verified, Active &amp; Pending Review</span>
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Live census summary of all registered community youth, verified members, active workers, and pending applications.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* 4 Core Summary Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Members */}
          <div
            onClick={() => setMemberStatusFilter('all')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              memberStatusFilter === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-400'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] uppercase font-extrabold tracking-wider ${memberStatusFilter === 'all' ? 'text-slate-300' : 'text-slate-500'}`}>
                Total Members
              </span>
              <Users className={`w-4 h-4 ${memberStatusFilter === 'all' ? 'text-slate-300' : 'text-slate-400'}`} />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black font-poppins">{totalCount}</span>
              <span className={`text-xs ${memberStatusFilter === 'all' ? 'text-slate-300' : 'text-slate-500'}`}>enrolled</span>
            </div>
          </div>

          {/* Verified Members */}
          <div
            onClick={() => setMemberStatusFilter('verified')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              memberStatusFilter === 'verified'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300'
                : 'bg-emerald-50 border-emerald-200 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] uppercase font-extrabold tracking-wider ${memberStatusFilter === 'verified' ? 'text-emerald-100' : 'text-emerald-700'}`}>
                Verified Members
              </span>
              <ShieldCheck className={`w-4 h-4 ${memberStatusFilter === 'verified' ? 'text-emerald-100' : 'text-emerald-600'}`} />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={`text-3xl font-black font-poppins ${memberStatusFilter === 'verified' ? 'text-white' : 'text-emerald-800'}`}>{verifiedCount}</span>
              <span className={`text-xs ${memberStatusFilter === 'verified' ? 'text-emerald-100' : 'text-emerald-600'}`}>approved</span>
            </div>
          </div>

          {/* Active Members */}
          <div
            onClick={() => setMemberStatusFilter('active')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              memberStatusFilter === 'active'
                ? 'bg-blue-700 text-white border-blue-700 shadow-md ring-2 ring-blue-300'
                : 'bg-blue-50 border-blue-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] uppercase font-extrabold tracking-wider ${memberStatusFilter === 'active' ? 'text-blue-100' : 'text-blue-700'}`}>
                Active Members
              </span>
              <CheckCircle2 className={`w-4 h-4 ${memberStatusFilter === 'active' ? 'text-blue-100' : 'text-blue-600'}`} />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={`text-3xl font-black font-poppins ${memberStatusFilter === 'active' ? 'text-white' : 'text-blue-800'}`}>{activeCount}</span>
              <span className={`text-xs ${memberStatusFilter === 'active' ? 'text-blue-100' : 'text-blue-600'}`}>participating</span>
            </div>
          </div>

          {/* Pending Review */}
          <div
            onClick={() => setMemberStatusFilter('pending')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
              memberStatusFilter === 'pending'
                ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-300'
                : 'bg-amber-50 border-amber-200 hover:border-amber-300'
            }`}
          >
            {pendingCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
            )}
            <div className="flex items-center justify-between">
              <span className={`text-[10px] uppercase font-extrabold tracking-wider ${memberStatusFilter === 'pending' ? 'text-amber-100' : 'text-amber-800'}`}>
                Pending Review
              </span>
              <Clock className={`w-4 h-4 ${memberStatusFilter === 'pending' ? 'text-amber-100' : 'text-amber-600'}`} />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={`text-3xl font-black font-poppins ${memberStatusFilter === 'pending' ? 'text-white' : 'text-amber-900'}`}>{pendingCount}</span>
              <span className={`text-xs ${memberStatusFilter === 'pending' ? 'text-amber-100' : 'text-amber-700'}`}>need review</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: AUTOMATE RELOAD ENGINE ("Why to Automate Reload") */}
      {/* ============================================================ */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <RefreshCw className={`w-5 h-5 text-emerald-400 ${isReloading ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                  Sync Engine
                </span>
                <h3 className="text-lg font-black font-poppins text-white">
                  Automate Reload &amp; Live Synchronization
                </h3>
              </div>
              <p className="text-xs text-white/70 mt-0.5">
                Keep the admin panel automatically up to date without manual page reloads.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Trigger Reload Button */}
            <button
              type="button"
              onClick={handleTriggerReload}
              disabled={isReloading}
              className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin' : ''}`} />
              <span>{isReloading ? 'Reloading...' : 'Reload Now'}</span>
            </button>

            {/* Toggle why explanation */}
            <button
              type="button"
              onClick={() => setShowWhyExplain(!showWhyExplain)}
              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showWhyExplain ? 'Hide Why' : 'Why Automate Reload?'}</span>
            </button>
          </div>
        </div>

        {/* Live Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
          {/* Toggle Auto-Reload */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-white block">Auto-Reload Engine</span>
              <span className="text-[11px] text-white/60">Polls server &amp; Firestore</span>
            </div>
            <button
              type="button"
              onClick={() => updateAutoReloadConfig({ enabled: !autoReloadConfig.enabled })}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                autoReloadConfig.enabled
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {autoReloadConfig.enabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Interval Selector */}
          <div className="flex items-center justify-between gap-3 sm:border-l sm:border-white/10 sm:pl-4">
            <div>
              <span className="text-xs font-bold text-white block">Refresh Frequency</span>
              <span className="text-[11px] text-white/60">Poll cadence</span>
            </div>
            <select
              value={autoReloadConfig.intervalSeconds}
              onChange={(e) => updateAutoReloadConfig({ intervalSeconds: Number(e.target.value) })}
              className="bg-slate-800 text-white text-xs font-bold rounded-xl px-2.5 py-1.5 border border-white/20 cursor-pointer focus:outline-none"
            >
              <option value="5">Every 5 seconds</option>
              <option value="10">Every 10 seconds</option>
              <option value="15">Every 15s (Recommended)</option>
              <option value="30">Every 30 seconds</option>
              <option value="60">Every 1 minute</option>
            </select>
          </div>

          {/* Sound Alert Toggle */}
          <div className="flex items-center justify-between gap-3 sm:border-l sm:border-white/10 sm:pl-4">
            <div>
              <span className="text-xs font-bold text-white block">New Join Audio Chime</span>
              <span className="text-[11px] text-white/60">Alert on new applications</span>
            </div>
            <button
              type="button"
              onClick={() => updateAutoReloadConfig({ soundAlert: !autoReloadConfig.soundAlert })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                autoReloadConfig.soundAlert
                  ? 'bg-blue-500 text-white hover:bg-blue-400'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {autoReloadConfig.soundAlert ? (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Chime On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Muted</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Informational Box: "Why to Automate Reload" */}
        {showWhyExplain && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xs uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>Why to Automate Reload? (Operational &amp; Architecture Rationale)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-1">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  1. Instant Application Intake
                </span>
                <p className="text-white/70 leading-relaxed">
                  When a Bote youth submits their membership application from Sarlahi, Chitwan, or a mobile phone, automated reloading delivers their details to the council screen immediately without requiring manual F5 refreshes.
                </p>
              </div>

              <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-1">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  2. Multi-Admin Conflict Prevention
                </span>
                <p className="text-white/70 leading-relaxed">
                  Multiple ward administrators operating simultaneously in different village councils stay synchronized. If one admin approves an applicant, other admins see the status update in real time.
                </p>
              </div>

              <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-1">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  3. Rural Terai Network Resilience
                </span>
                <p className="text-white/70 leading-relaxed">
                  Internet connectivity in remote river basin settlements can fluctuate. Automated background syncing automatically reconnects and synchronizes missing state as soon as 4G or Wi-Fi recovers.
                </p>
              </div>

              <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-1">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  4. Zero Stale Browser Cache
                </span>
                <p className="text-white/70 leading-relaxed">
                  Bypasses aggressive browser caching. When verified members are issued their official Digital ID Cards, their updated credentials appear instantaneously across both the Admin Panel and Member Directory.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/50 pt-2 border-t border-white/10 font-mono">
              <span>Status: {syncStatus.toUpperCase()} • Connected to Firestore</span>
              <span>Last Reloaded: {autoReloadConfig.lastReloadedAt || lastSyncedTime || 'Just now'}</span>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* SECTION 4: SHOW ALL NEW JOIN MEMBERS DETAILS */}
      {/* ============================================================ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                Member Registry
              </span>
              <h3 className="text-xl font-black text-slate-900 font-poppins flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-700" />
                <span>All New Join Members Details &amp; Application Review</span>
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Showing complete applicant profiles, contact information, ward representations, and quick-action status toggles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">
              Showing <strong className="text-slate-900">{filteredMembers.length}</strong> of {totalCount}
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              placeholder="Search by member name, phone, ward, or membership ID..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003893] focus:bg-white transition"
            />
            {memberSearch && (
              <button
                type="button"
                onClick={() => setMemberSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl self-start md:self-auto">
            <button
              type="button"
              onClick={() => setMemberStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                memberStatusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setMemberStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                memberStatusFilter === 'pending'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-700 hover:text-amber-900'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>Pending ({pendingCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setMemberStatusFilter('verified')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                memberStatusFilter === 'verified'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Verified ({verifiedCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setMemberStatusFilter('active')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                memberStatusFilter === 'active'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-blue-700 hover:text-blue-900'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Active ({activeCount})</span>
            </button>
          </div>
        </div>

        {/* Member Details Table */}
        {filteredMembers.length === 0 ? (
          <div className="py-16 text-center space-y-3 border border-dashed border-slate-200 rounded-3xl">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700 text-sm">No Members Match Search Filters</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search query or switching to the &apos;All&apos; filter tab.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider">
                  <th className="py-3.5 px-4">Member Info</th>
                  <th className="py-3.5 px-4">Membership ID</th>
                  <th className="py-3.5 px-4">Visual Status</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Address / Ward</th>
                  <th className="py-3.5 px-4">Demographics</th>
                  <th className="py-3.5 px-4">Registered At</th>
                  <th className="py-3.5 px-4 text-right">Review Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((member) => {
                  const memberIdCode = member.membershipId || member.id;
                  const photoSrc =
                    member.photoUrl && member.photoUrl.trim()
                      ? member.photoUrl.trim()
                      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';

                  return (
                    <tr key={member.id} className="hover:bg-blue-50/40 transition">
                      {/* Member Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-11 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-xs">
                            <img
                              src={photoSrc}
                              alt={member.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="font-extrabold text-slate-900 text-sm block truncate">
                              {member.name}
                            </span>
                            {member.nameNepali && (
                              <span className="text-[11px] text-[#DC143C] font-semibold block truncate">
                                {member.nameNepali}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 block truncate">
                              {member.category || 'Youth Member'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Membership ID */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-xl font-mono text-[11px] font-bold text-slate-700">
                          <IdCard className="w-3 h-3 text-slate-400" />
                          <span>{memberIdCode}</span>
                        </div>
                      </td>

                      {/* Visual Status Badges */}
                      <td className="py-3.5 px-4">
                        {member.status === 'verified' && (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full font-bold text-[11px] shadow-xs">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Verified</span>
                          </span>
                        )}
                        {member.status === 'active' && (
                          <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 border border-blue-300 px-2.5 py-1 rounded-full font-bold text-[11px] shadow-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                            <span>Active</span>
                          </span>
                        )}
                        {member.status === 'pending' && (
                          <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-full font-bold text-[11px] shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                            <span>Pending</span>
                          </span>
                        )}
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <a
                          href={`tel:${member.phone}`}
                          className="flex items-center gap-1 text-slate-800 hover:text-[#003893] font-bold"
                        >
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{member.phone}</span>
                        </a>
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="flex items-center gap-1 text-slate-500 hover:text-[#003893] text-[10px] truncate max-w-[150px] mt-0.5"
                          >
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{member.email}</span>
                          </a>
                        )}
                      </td>

                      {/* Address / Ward */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-1 text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <div className="leading-tight">
                            <span className="font-bold block">Ward {member.ward || '11'}</span>
                            <span className="text-[10px] text-slate-500 block">
                              {member.municipality || 'Bagmati Municipality'}, {member.district || 'Sarlahi'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Demographics */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="font-bold text-slate-800">{member.age || 20} yrs</span>
                        <span className="text-[10px] text-slate-400 block">{member.gender || 'Bote youth'}</span>
                        {member.interest && (
                          <span className="text-[10px] text-slate-500 block truncate max-w-[120px]">
                            {member.interest}
                          </span>
                        )}
                      </td>

                      {/* Registered Date */}
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[10px]">
                        {member.registeredAt ? new Date(member.registeredAt).toLocaleDateString() : 'Recent'}
                      </td>

                      {/* Review Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Quick Verify */}
                          {member.status !== 'verified' && (
                            <button
                              type="button"
                              onClick={() => updateMemberStatus(member.id, 'verified')}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold border border-emerald-200 transition cursor-pointer"
                              title="Approve and mark as Verified"
                            >
                              Verify
                            </button>
                          )}

                          {/* Quick Activate */}
                          {member.status !== 'active' && (
                            <button
                              type="button"
                              onClick={() => updateMemberStatus(member.id, 'active')}
                              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[10px] font-bold border border-blue-200 transition cursor-pointer"
                              title="Set as Active Member"
                            >
                              Activate
                            </button>
                          )}

                          {/* Set Pending */}
                          {member.status !== 'pending' && (
                            <button
                              type="button"
                              onClick={() => updateMemberStatus(member.id, 'pending')}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-[10px] font-bold border border-amber-200 transition cursor-pointer"
                              title="Set back to Pending Review"
                            >
                              Pending
                            </button>
                          )}

                          {/* Digital ID Card */}
                          <button
                            type="button"
                            onClick={() => setSelectedMemberForCard(member)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title="Generate Official Digital ID Card"
                          >
                            <IdCard className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Member */}
                          <button
                            type="button"
                            onClick={() => setMemberToDelete(member)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Delete member record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* DIGITAL ID CARD MODAL */}
      {/* ============================================================ */}
      {selectedMemberForCard && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <IdCard className="w-5 h-5 text-[#003893]" />
                <h3 className="font-black text-slate-900 text-base font-poppins">
                  Official Community Digital ID
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMemberForCard(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <MembershipIdCard member={selectedMemberForCard} />

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedMemberForCard(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ============================================================ */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">Delete Member Record?</h4>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to remove <strong className="text-slate-900">{memberToDelete.name}</strong> ({memberToDelete.membershipId || memberToDelete.id}) from the official Bote Youth Community database?
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteMember}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Deleting...' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
