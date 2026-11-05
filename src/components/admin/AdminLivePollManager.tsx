/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useCommunityData } from '../../context/CommunityDataContext';
import { PollOption, PollVoterLog, CommunityPollConfig } from '../../types';
import {
  Vote,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Users,
  BarChart3,
  Search,
  Download,
  Flame,
  Shield,
  Clock,
  Sparkles,
  UserCheck,
  Save,
  X,
  TrendingUp,
  RefreshCw,
  Eye,
  Check
} from 'lucide-react';

interface AdminLivePollManagerProps {
  onNavigateToPublic?: () => void;
  showNotification?: (msg: string) => void;
}

export default function AdminLivePollManager({
  onNavigateToPublic,
  showNotification
}: AdminLivePollManagerProps) {
  const {
    communityPoll,
    updatePollConfig,
    resetPollVotes,
    syncStatus,
    lastSyncedTime
  } = useCommunityData();

  // Modals & form states
  const [isAddOptionOpen, setIsAddOptionOpen] = useState(false);
  const [isEditPollConfigOpen, setIsEditPollConfigOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<PollOption | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [searchLogQuery, setSearchLogQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'admin' | 'member'>('all');
  const [isSaving, setIsSaving] = useState(false);

  // New option form state
  const [newText, setNewText] = useState('');
  const [newTextNepali, setNewTextNepali] = useState('');
  const [newInitialVotes, setNewInitialVotes] = useState(0);

  // Edit poll config form state
  const [cfgTitle, setCfgTitle] = useState(communityPoll?.title || '');
  const [cfgTitleNepali, setCfgTitleNepali] = useState(communityPoll?.titleNepali || '');
  const [cfgSubtitle, setCfgSubtitle] = useState(communityPoll?.subtitle || '');
  const [cfgSubtitleNepali, setCfgSubtitleNepali] = useState(communityPoll?.subtitleNepali || '');
  const [cfgIsActive, setCfgIsActive] = useState(communityPoll?.isActive ?? true);
  const [cfgAllowMemberSuggestions, setCfgAllowMemberSuggestions] = useState(
    communityPoll?.allowMemberSuggestions ?? true
  );

  // Sync config form whenever communityPoll changes
  React.useEffect(() => {
    if (communityPoll) {
      setCfgTitle(communityPoll.title);
      setCfgTitleNepali(communityPoll.titleNepali || '');
      setCfgSubtitle(communityPoll.subtitle);
      setCfgSubtitleNepali(communityPoll.subtitleNepali || '');
      setCfgIsActive(communityPoll.isActive);
      setCfgAllowMemberSuggestions(communityPoll.allowMemberSuggestions);
    }
  }, [communityPoll]);

  // Derived metrics
  const totalVotes = communityPoll?.totalVotes || 0;
  const options = communityPoll?.options || [];
  const voterLogs = communityPoll?.voterLogs || [];

  // Ranked options (sorted by votes descending)
  const sortedOptions = useMemo(() => {
    return [...options].sort((a, b) => (b.votes || 0) - (a.votes || 0));
  }, [options]);

  const topOption = sortedOptions[0];

  const adminOptionsCount = options.filter((o) => o.addedBy !== 'member').length;
  const memberOptionsCount = options.filter((o) => o.addedBy === 'member').length;

  // Filtered options for management list
  const displayOptions = useMemo(() => {
    if (filterType === 'admin') return sortedOptions.filter((o) => o.addedBy !== 'member');
    if (filterType === 'member') return sortedOptions.filter((o) => o.addedBy === 'member');
    return sortedOptions;
  }, [sortedOptions, filterType]);

  // Filtered voter logs
  const filteredVoterLogs = useMemo(() => {
    if (!searchLogQuery.trim()) return voterLogs;
    const q = searchLogQuery.toLowerCase();
    return voterLogs.filter(
      (log) =>
        (log.voterName && log.voterName.toLowerCase().includes(q)) ||
        (log.membershipId && log.membershipId.toLowerCase().includes(q)) ||
        (log.optionText && log.optionText.toLowerCase().includes(q)) ||
        (log.voterEmail && log.voterEmail.toLowerCase().includes(q))
    );
  }, [voterLogs, searchLogQuery]);

  // Handle Admin Add New Option
  const handleAdminAddOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    setIsSaving(true);
    try {
      const newOption: PollOption = {
        id: 'opt-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        text: newText.trim(),
        textNepali: newTextNepali.trim() || undefined,
        votes: Math.max(0, Number(newInitialVotes) || 0),
        addedBy: 'admin',
        createdAt: new Date().toISOString()
      };

      const updatedOptions = [...options, newOption];
      const res = await updatePollConfig({ options: updatedOptions });
      if (res.success) {
        setNewText('');
        setNewTextNepali('');
        setNewInitialVotes(0);
        setIsAddOptionOpen(false);
        showNotification?.(res.message || 'New initiative option added successfully!');
      }
    } catch (err: any) {
      showNotification?.('Failed to add option: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Edit Option
  const handleSaveOptionEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOption || !editingOption.text.trim()) return;

    setIsSaving(true);
    try {
      const updatedOptions = options.map((opt) =>
        opt.id === editingOption.id
          ? {
              ...opt,
              text: editingOption.text.trim(),
              textNepali: editingOption.textNepali?.trim() || undefined,
              votes: Math.max(0, Number(editingOption.votes) || 0)
            }
          : opt
      );

      const res = await updatePollConfig({ options: updatedOptions });
      if (res.success) {
        setEditingOption(null);
        showNotification?.('Initiative option updated & synced!');
      }
    } catch (err: any) {
      showNotification?.('Failed to update option: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete Option
  const handleDeleteOption = async (id: string, text: string) => {
    if (!window.confirm(`Are you sure you want to remove initiative: "${text}"?`)) return;

    setIsSaving(true);
    try {
      const updatedOptions = options.filter((opt) => opt.id !== id);
      const res = await updatePollConfig({ options: updatedOptions });
      if (res.success) {
        showNotification?.('Initiative option removed.');
      }
    } catch (err: any) {
      showNotification?.('Failed to delete option: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Quick adjust vote for an option
  const handleAdjustVote = async (id: string, delta: number) => {
    const updatedOptions = options.map((opt) => {
      if (opt.id === id) {
        return { ...opt, votes: Math.max(0, (opt.votes || 0) + delta) };
      }
      return opt;
    });

    await updatePollConfig({ options: updatedOptions });
    showNotification?.('Vote count adjusted live.');
  };

  // Handle Save Full Poll Config
  const handleSavePollConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updatePollConfig({
        title: cfgTitle.trim(),
        titleNepali: cfgTitleNepali.trim() || undefined,
        subtitle: cfgSubtitle.trim(),
        subtitleNepali: cfgSubtitleNepali.trim() || undefined,
        isActive: cfgIsActive,
        allowMemberSuggestions: cfgAllowMemberSuggestions
      });

      if (res.success) {
        setIsEditPollConfigOpen(false);
        showNotification?.(res.message || 'Poll settings updated live!');
      }
    } catch (err: any) {
      showNotification?.('Failed to update poll config: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Reset All Votes
  const handleResetVotes = async () => {
    setIsSaving(true);
    try {
      const res = await resetPollVotes();
      if (res.success) {
        setIsResetConfirmOpen(false);
        showNotification?.('All poll votes have been reset.');
      }
    } catch (err: any) {
      showNotification?.('Failed to reset votes: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Export Voter Logs as CSV
  const handleExportCSV = () => {
    if (voterLogs.length === 0) {
      showNotification?.('No voter logs available to export yet.');
      return;
    }

    const headers = ['Timestamp', 'Voter Name', 'Membership ID', 'Email', 'Chosen Initiative'];
    const rows = voterLogs.map((log) => [
      `"${new Date(log.votedAt).toLocaleString()}"`,
      `"${(log.voterName || 'Anonymous').replace(/"/g, '""')}"`,
      `"${(log.membershipId || '-').replace(/"/g, '""')}"`,
      `"${(log.voterEmail || '-').replace(/"/g, '""')}"`,
      `"${(log.optionText || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bycn_poll_voter_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification?.('Voter logs exported to CSV successfully!');
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-red-950 via-[#003893] to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-bold text-amber-300">
              <Vote className="w-3.5 h-3.5" />
              <span>प्रत्यक्ष जनमत तथा योजना व्यवस्थापन (Live Community Voice)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-poppins text-white">
              Heritage Initiative Priorities &amp; Live Voting
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Every member vote from the public homepage is recorded in real time. Full admin control to add, edit, or adjust initiatives, manage member proposals, and monitor voter audit logs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onNavigateToPublic && (
              <button
                type="button"
                onClick={onNavigateToPublic}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 border border-white/20"
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span>View Public Poll</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsAddOptionOpen(true)}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-5 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Admin: Add Option (योजना थप्नुहोस्)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsEditPollConfigOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Title / Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Votes */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">कुल प्राप्त मत (Total Votes)</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-mono">{totalVotes}</h3>
            <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Live Synced</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <Vote className="w-6 h-6" />
          </div>
        </div>

        {/* Total Active Initiatives */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">सक्रिय विकल्पहरू (Total Options)</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-mono">{options.length}</h3>
            <p className="text-[10px] text-slate-500 font-bold mt-1">
              {adminOptionsCount} Admin + {memberOptionsCount} Member
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#003893] flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>

        {/* Leading Priority */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="truncate pr-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">अग्रणी योजना (Top Priority)</p>
            <h3 className="text-sm sm:text-base font-black text-slate-900 mt-1 truncate">
              {topOption ? topOption.text : 'None yet'}
            </h3>
            <p className="text-[10px] text-amber-600 font-bold mt-1">
              {topOption && totalVotes > 0
                ? `${Math.round((topOption.votes / totalVotes) * 100)}% (${topOption.votes} votes)`
                : '0 votes'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        {/* Poll Status & Member Mode */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">स्थिति (Voting Status)</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black ${
                  communityPoll?.isActive
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${communityPoll?.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                {communityPoll?.isActive ? 'Active (खुल्ला)' : 'Closed (बन्द)'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-semibold mt-1">
              {communityPoll?.allowMemberSuggestions ? '✓ Members can add self' : '✕ Member proposals disabled'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Initiatives List & Full Edit Details Admin Self */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-lg font-black text-slate-900 font-poppins flex items-center gap-2">
              <Vote className="w-5 h-5 text-red-600" />
              <span>Bote Heritage Initiatives &amp; Live Ranking ({sortedOptions.length})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Admin can edit initiative descriptions, adjust votes, remove options, or add new priorities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter buttons */}
            <div className="inline-flex p-1 bg-slate-100 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  filterType === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({options.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('admin')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  filterType === 'admin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin ({adminOptionsCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('member')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  filterType === 'member' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Member Suggested ({memberOptionsCount})
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(true)}
              className="bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 px-3.5 py-1.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Votes</span>
            </button>
          </div>
        </div>

        {/* Initiatives List */}
        <div className="space-y-4">
          {displayOptions.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No initiatives found matching current filter.
            </div>
          ) : (
            displayOptions.map((opt, rankIndex) => {
              const pct = totalVotes > 0 ? Math.round(((opt.votes || 0) / totalVotes) * 100) : 0;
              const isMemberAdded = opt.addedBy === 'member';

              return (
                <div
                  key={opt.id}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-mono font-black flex items-center justify-center">
                          #{rankIndex + 1}
                        </span>

                        {isMemberAdded ? (
                          <span className="bg-purple-100 text-purple-800 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>Member Proposed: {opt.suggestedByName || 'Community Member'}</span>
                          </span>
                        ) : (
                          <span className="bg-red-50 text-red-700 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            <span>Executive Committee Priority</span>
                          </span>
                        )}

                        {opt.createdAt && (
                          <span className="text-[10px] text-slate-400">
                            {new Date(opt.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {opt.text}
                      </h3>

                      {opt.textNepali && (
                        <p className="text-xs text-slate-600 font-medium font-nepali">
                          {opt.textNepali}
                        </p>
                      )}
                    </div>

                    {/* Votes Badge & Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <div className="text-right pr-2">
                        <p className="text-base sm:text-lg font-black text-slate-900 font-mono">
                          {opt.votes || 0} <span className="text-xs text-slate-500 font-normal">votes</span>
                        </p>
                        <p className="text-xs font-bold text-red-600 font-mono">{pct}%</p>
                      </div>

                      {/* Quick vote adjuster */}
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                        <button
                          type="button"
                          onClick={() => handleAdjustVote(opt.id, -1)}
                          disabled={opt.votes <= 0}
                          title="Decrease 1 vote"
                          className="px-2 py-1 hover:bg-slate-100 text-xs font-bold disabled:opacity-30"
                        >
                          -1
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdjustVote(opt.id, 1)}
                          title="Increase 1 vote"
                          className="px-2 py-1 hover:bg-slate-100 text-xs font-bold text-green-700"
                        >
                          +1
                        </button>
                      </div>

                      {/* Edit button */}
                      <button
                        type="button"
                        onClick={() => setEditingOption(opt)}
                        className="p-2 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl text-xs font-bold transition"
                        title="Edit initiative details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteOption(opt.id, opt.text)}
                        className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-xl text-xs font-bold transition"
                        title="Delete initiative"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-red-600 to-amber-500 h-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 4. Real-time Voter Audit Logs (All details in Admin panel) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-lg font-black text-slate-900 font-poppins flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <span>Real-Time Voter Audit Logs ({voterLogs.length} Records)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live audit record of every vote cast, timestamp, voter membership ID, and chosen initiative.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchLogQuery}
                onChange={(e) => setSearchLogQuery(e.target.value)}
                placeholder="Search voter, option, ID..."
                className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 w-48 sm:w-64"
              />
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto">
          {filteredVoterLogs.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No voter logs found. Votes will appear here in real-time as users cast their votes.
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-black tracking-wider bg-slate-50/70">
                  <th className="py-3 px-3">Voter Name</th>
                  <th className="py-3 px-3">Membership ID</th>
                  <th className="py-3 px-3">Initiative Chosen</th>
                  <th className="py-3 px-3">Date &amp; Time</th>
                  <th className="py-3 px-3">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVoterLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                        {(log.voterName || 'M')[0].toUpperCase()}
                      </div>
                      <span>{log.voterName || 'Community Member'}</span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-red-600">
                      {log.membershipId || (
                        <span className="text-slate-400 font-sans font-normal text-[11px]">Guest Voter</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800 max-w-xs truncate">
                      {log.optionText}
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                      {new Date(log.votedAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-slate-500 truncate max-w-[150px]">
                      {log.voterEmail || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: ADMIN ADD NEW OPTION */}
      {/* ======================================================== */}
      {isAddOptionOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 font-poppins">
                  Admin: Add New Heritage Initiative
                </h3>
                <p className="text-xs text-slate-500">
                  Adds a new option to the live community poll for all website visitors.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOptionOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdminAddOption} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Initiative Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="e.g. Establishing Bote Cultural Heritage Museum & Archives"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nepali Title / विवरण (वैकल्पिक / Optional)
                </label>
                <input
                  type="text"
                  value={newTextNepali}
                  onChange={(e) => setNewTextNepali(e.target.value)}
                  placeholder="e.g. कर्मैयामा बोटे सांस्कृतिक संग्रहालय तथा अनुसन्धान केन्द्र स्थापना"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-nepali"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Initial Seed Votes (प्रारम्भिक मत)
                </label>
                <input
                  type="number"
                  min="0"
                  value={newInitialVotes}
                  onChange={(e) => setNewInitialVotes(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddOptionOpen(false)}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !newText.trim()}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow"
                >
                  {isSaving ? 'Adding...' : 'Add to Live Poll'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: EDIT INITIATIVE OPTION */}
      {/* ======================================================== */}
      {editingOption && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 font-poppins">
                  Edit Heritage Initiative
                </h3>
                <p className="text-xs text-slate-500">
                  Update title or manually adjust recorded vote counts.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingOption(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOptionEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={editingOption.text}
                  onChange={(e) => setEditingOption({ ...editingOption, text: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Title (Nepali / विवरण)
                </label>
                <input
                  type="text"
                  value={editingOption.textNepali || ''}
                  onChange={(e) => setEditingOption({ ...editingOption, textNepali: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-nepali"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Vote Count (मत संख्या)
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingOption.votes || 0}
                  onChange={(e) =>
                    setEditingOption({
                      ...editingOption,
                      votes: Math.max(0, parseInt(e.target.value) || 0)
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingOption(null)}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: EDIT FULL POLL CONFIGURATION & TEXTS */}
      {/* ======================================================== */}
      {isEditPollConfigOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 font-poppins">
                  Poll Settings &amp; Questions (पूर्ण सम्पादन)
                </h3>
                <p className="text-xs text-slate-500">
                  Customize the question, subtitles, voting status, and member self-option permissions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditPollConfigOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePollConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Poll Question (English) *
                </label>
                <input
                  type="text"
                  required
                  value={cfgTitle}
                  onChange={(e) => setCfgTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Poll Question (Nepali / नेपाली प्रश्न)
                </label>
                <input
                  type="text"
                  value={cfgTitleNepali}
                  onChange={(e) => setCfgTitleNepali(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-nepali"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subtitle / Context (English)
                </label>
                <textarea
                  rows={2}
                  value={cfgSubtitle}
                  onChange={(e) => setCfgSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subtitle / Context (Nepali / नेपाली विवरण)
                </label>
                <textarea
                  rows={2}
                  value={cfgSubtitleNepali}
                  onChange={(e) => setCfgSubtitleNepali(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-nepali"
                />
              </div>

              {/* Toggles */}
              <div className="pt-2 space-y-3 border-t border-slate-100">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cfgIsActive}
                    onChange={(e) => setCfgIsActive(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800">
                      Voting Active &amp; Open (मतदान खुला रहने)
                    </span>
                    <p className="text-[11px] text-slate-500">
                      If unchecked, visitors will see the final poll results without being able to cast new votes.
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cfgAllowMemberSuggestions}
                    onChange={(e) => setCfgAllowMemberSuggestions(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800">
                      Allow Members to Propose &amp; Add Initiatives (सदस्यलाई आफ्नै योजना थप्न दिने)
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Enables the "+ Suggest / Add Your Initiative" option on the live public homepage.
                    </p>
                  </div>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditPollConfigOpen(false)}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow"
                >
                  {isSaving ? 'Updating...' : 'Update & Sync Live'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: RESET CONFIRMATION */}
      {/* ======================================================== */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900">
                Reset All Poll Votes?
              </h3>
              <p className="text-xs text-slate-500">
                This will set all initiative votes back to 0 and clear the voter audit logs. Initiative option titles will remain intact.
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetVotes}
                disabled={isSaving}
                className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-2xl text-xs font-bold transition shadow"
              >
                {isSaving ? 'Resetting...' : 'Yes, Reset All Votes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
