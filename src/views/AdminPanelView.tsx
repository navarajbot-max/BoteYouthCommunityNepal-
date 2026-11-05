/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType, LeaderProfile, TimelineEvent, CultureTradition, DictionaryWord, TraditionalDressItem, ThemeType } from '../types';
import { useCommunityData } from '../context/CommunityDataContext';
import { useTheme } from '../context/ThemeContext';
import { DEFAULT_LOGO_URL } from '../data/communityData';
import DirectImageUploader from '../components/DirectImageUploader';
import AdminCostumesManager from '../components/admin/AdminCostumesManager';
import AdminMembersManager from '../components/admin/AdminMembersManager';
import MemberDirectoryView from '../components/admin/MemberDirectoryView';
import AdminDomainsManager from '../components/admin/AdminDomainsManager';
import AdminSiteIdentityForm from '../components/admin/AdminSiteIdentityForm';
import AdminGmailAccessManager from '../components/admin/AdminGmailAccessManager';
import AdminGoogleDriveManager from '../components/admin/AdminGoogleDriveManager';
import AdminSettingsMetricsAndMembers from '../components/admin/AdminSettingsMetricsAndMembers';
import AdminMasterOneTimeSetup from '../components/admin/AdminMasterOneTimeSetup';
import AdminDirectPublicAndRepublicOptions from '../components/admin/AdminDirectPublicAndRepublicOptions';
import AdminNoticesManager from '../components/admin/AdminNoticesManager';
import AdminNotificationsView from '../components/admin/AdminNotificationsView';
import { AdminCentralOfficeEditor } from '../components/admin/AdminCentralOfficeEditor';
import AdminAnalyticsAndFaviconSettings from '../components/admin/AdminAnalyticsAndFaviconSettings';
import AdminLivePollManager from '../components/admin/AdminLivePollManager';
import {
  Bell,
  Vote,
  Shield,
  Building2,
  Lock,
  Unlock,
  Users,
  Clock,
  Sparkles,
  Megaphone,
  BookOpen,
  Award,
  Shirt,
  LayoutGrid,
  Columns,
  Key,
  Plus,
  Trash2,
  Edit3,
  Check,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  RotateCcw,
  Search,
  ArrowRight,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Save,
  Globe,
  Image as ImageIcon,
  Palette,
  Settings,
  Upload,
  RefreshCw,
  Loader2,
  HardDrive,
  ShieldCheck,
  BarChart3
} from 'lucide-react';

interface AdminPanelViewProps {
  setCurrentTab: (tab: TabType) => void;
}

type AdminSubTab =
  | 'notifications'
  | 'master-setup'
  | 'notices'
  | 'poll'
  | 'leaders'
  | 'history'
  | 'culture'
  | 'language'
  | 'dress'
  | 'costumes'
  | 'members'
  | 'gdrive'
  | 'bento'
  | 'pillars'
  | 'central-office'
  | 'analytics-favicon'
  | 'settings'
  | 'security';

export default function AdminPanelView({ setCurrentTab }: AdminPanelViewProps) {
  const {
    leaders,
    timelineEvents,
    culturalTraditions,
    dictionaryWords,
    dressItems,
    costumes,
    registeredMembers,
    posts,
    communityPoll,
    notifications,
    unreadNotificationsCount,
    syncStatus,
    lastSyncedTime,
    isInternetConnected,
    manualCloudSync,
    bentoConfig,
    pillarsConfig,
    siteIdentity,
    isAdminAuthenticated,
    adminLogin,
    adminLogout,
    changeAdminPasscode,
    addLeader,
    updateLeader,
    deleteLeader,
    addTimelineEvent,
    updateTimelineEvent,
    deleteTimelineEvent,
    addCulturalTradition,
    updateCulturalTradition,
    deleteCulturalTradition,
    addDictionaryWord,
    updateDictionaryWord,
    deleteDictionaryWord,
    addDressItem,
    updateDressItem,
    deleteDressItem,
    updateBentoConfig,
    updatePillarsConfig,
    updateSiteIdentity,
    saveSiteIdentity,
    saveHeaderLogo,
    saveFooterLogo,
    saveBothLogos,
    masterBroadcastEverything,
    resetAllToDefaults
  } = useCommunityData();

  const {
    theme,
    setTheme,
    headerLogo,
    setHeaderLogo,
    footerLogo,
    setFooterLogo,
    resetLogos,
    colors
  } = useTheme();

  // Login form state
  const [passcodeInput, setPasscodeInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Admin Active Sub-Tab
  const [activeTab, setActiveTab] = useState<AdminSubTab>('leaders');
  const [notification, setNotification] = useState<string | null>(null);

  // Logo save loading states
  const [isSavingHeaderLogo, setIsSavingHeaderLogo] = useState(false);
  const [isSavingFooterLogo, setIsSavingFooterLogo] = useState(false);
  const [isSavingBothLogos, setIsSavingBothLogos] = useState(false);

  // Search filter inside admin
  const [searchQuery, setSearchQuery] = useState('');

  // Modal / Form state for Leader
  const [editingLeader, setEditingLeader] = useState<LeaderProfile | null>(null);
  const [isAddingLeader, setIsAddingLeader] = useState(false);

  // Modal / Form state for History Event
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  // Modal / Form state for Culture Tradition
  const [editingTradition, setEditingTradition] = useState<CultureTradition | null>(null);
  const [isAddingTradition, setIsAddingTradition] = useState(false);

  // Modal / Form state for Dictionary Word
  const [editingWord, setEditingWord] = useState<DictionaryWord | null>(null);
  const [isAddingWord, setIsAddingWord] = useState(false);

  // Modal / Form state for Dress Item
  const [editingDress, setEditingDress] = useState<TraditionalDressItem | null>(null);
  const [isAddingDress, setIsAddingDress] = useState(false);

  // Passcode change state
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passMessage, setPassMessage] = useState<{ text: string; success: boolean } | null>(null);

  const showNotificationMsg = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = adminLogin(passcodeInput);
    if (success) {
      setPasscodeInput('');
      showNotificationMsg('Welcome Admin! Full control granted.');
    } else {
      setLoginError('Invalid Administrator Passcode. Access restricted.');
    }
  };

  // -------------------------------------------------------------
  // VIEW 1: RESTRICTED LOGIN GATE (If not authenticated)
  // -------------------------------------------------------------
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200 text-center space-y-6">
          <div className="w-16 h-16 bg-red-50 border-2 border-red-200 text-[#DC143C] rounded-2xl mx-auto flex items-center justify-center shadow-inner">
            <Shield className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#DC143C] bg-red-50 border border-red-200 px-3 py-1 rounded-full">
              RESTRICTED ACCESS
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-poppins pt-2">
              Bote Admin Full Control
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              This management portal is strictly restricted to authorized administrators of Bote Youth Community Nepal.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin Passcode or Authorized Gmail
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passcodeInput}
                  onChange={(e) => {
                    setPasscodeInput(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  placeholder="Enter admin passcode or authorized Gmail..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003893] focus:bg-white text-slate-900 pr-12 font-mono"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#003893] hover:bg-blue-900 text-white font-bold py-3.5 rounded-xl text-sm transition shadow flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4 text-amber-400" />
              <span>Verify &amp; Enter Admin Panel</span>
            </button>
          </form>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-[#003893]" />
              <span>Protected Administrator Authentication</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Authorized committee members and administrators may sign in using their private access credentials. Passcodes and tokens are strictly confidential.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setCurrentTab('home')}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold transition"
            >
              &larr; Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: AUTHENTICATED ADMIN PANEL FULL CONTROL
  // -------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Header Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase text-white bg-[#003893] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Shield className="w-3 h-3 text-amber-300" />
              <span>Full Control Admin</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${syncStatus === 'syncing' ? 'bg-amber-400 animate-spin' : 'bg-emerald-500 animate-pulse'}`} />
              <span>Real-Time Internet Synced ({lastSyncedTime || 'Live'})</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-poppins">
            Master Content Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Directly update Leaders, History, Rituals, Language, Costumes, Registered Members, Custom Domains, and Community Identity in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              manualCloudSync();
              showNotificationMsg('Syncing all changes live to internet cloud...');
            }}
            disabled={syncStatus === 'syncing'}
            className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-emerald-800 transition flex items-center gap-1.5 cursor-pointer"
            title="Push & Pull latest updates from the internet server"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin text-emerald-600' : ''}`} />
            <span>{syncStatus === 'syncing' ? 'Syncing Live...' : 'Sync to Internet'}</span>
          </button>
          <button
            onClick={() => setCurrentTab('home')}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5 text-[#003893]" />
            <span>View Public Website</span>
          </button>
          <button
            onClick={() => {
              adminLogout();
              showNotificationMsg('Logged out of Admin Panel.');
            }}
            className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-bold text-red-700 transition flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock &amp; Logout</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg flex items-center justify-between font-bold text-xs">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-200 hover:text-white font-black text-sm">
            &times;
          </button>
        </div>
      )}

      {/* Admin Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
        <button
          onClick={() => { setActiveTab('master-setup'); setSearchQuery(''); }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'master-setup'
              ? 'bg-gradient-to-r from-[#003893] to-slate-900 text-white shadow-md ring-2 ring-amber-400'
              : 'bg-amber-50 text-slate-900 hover:bg-amber-100 border border-amber-300'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>⚡ One-Time Set Everything</span>
        </button>

        <button
          onClick={() => { setActiveTab('notifications'); setSearchQuery(''); }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'notifications'
              ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md ring-2 ring-red-400'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Bell className="w-4 h-4 text-red-500" />
          <span>Notifications &amp; Follows ({notifications.length})</span>
          {unreadNotificationsCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full animate-pulse">
              {unreadNotificationsCount} new
            </span>
          )}
        </button>

        <button
          onClick={() => { setActiveTab('notices'); setSearchQuery(''); }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'notices'
              ? 'bg-[#DC143C] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Megaphone className="w-4 h-4 text-amber-400" />
          <span>Posts &amp; Notices ({posts.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('poll'); setSearchQuery(''); }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'poll'
              ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md ring-2 ring-amber-400'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Vote className="w-4 h-4 text-amber-400" />
          <span>Live Community Voice ({communityPoll?.options?.length || 0} Options / {communityPoll?.totalVotes || 0} Votes)</span>
        </button>

        <button
          onClick={() => { setActiveTab('leaders'); setSearchQuery(''); }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'leaders'
              ? 'bg-[#DC143C] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Youth Leaders ({leaders.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('history'); setSearchQuery(''); }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-[#DC143C] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>History &amp; Origins ({timelineEvents.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('culture'); setSearchQuery(''); }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'culture'
              ? 'bg-[#DC143C] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Culture &amp; Rituals ({culturalTraditions.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('language'); setSearchQuery(''); }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'language'
              ? 'bg-[#DC143C] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Bote Language ({dictionaryWords.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('dress'); setSearchQuery(''); }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'dress'
              ? 'bg-[#DC143C] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Dress &amp; Jewelry ({dressItems.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('costumes'); setSearchQuery(''); }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'costumes'
              ? 'bg-[#DC143C] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Shirt className="w-4 h-4" />
          <span>Costumes &amp; Regalia ({costumes.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('members'); setSearchQuery(''); }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'members'
              ? 'bg-[#003893] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-amber-400" />
          <span>Registered Members ({registeredMembers.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('gdrive'); setSearchQuery(''); }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'gdrive'
              ? 'bg-[#003893] text-white shadow-sm ring-2 ring-emerald-400'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <HardDrive className="w-4 h-4 text-emerald-500" />
          <span>Google Drive Cloud</span>
        </button>

        <button
          onClick={() => { setActiveTab('bento'); setSearchQuery(''); }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'bento'
              ? 'bg-[#003893] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Bento Grid</span>
        </button>

        <button
          onClick={() => { setActiveTab('pillars'); setSearchQuery(''); }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'pillars'
              ? 'bg-[#003893] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Columns className="w-4 h-4" />
          <span>Core Pillars</span>
        </button>

        <button
          onClick={() => { setActiveTab('central-office'); setSearchQuery(''); }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'central-office'
              ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-400'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4 text-emerald-500" />
          <span>Karmaiya Central Office</span>
        </button>

        <button
          onClick={() => { setActiveTab('analytics-favicon'); setSearchQuery(''); }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'analytics-favicon'
              ? 'bg-gradient-to-r from-[#003893] via-indigo-900 to-[#DC143C] text-white shadow-md ring-2 ring-amber-400'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-blue-500" />
          <span>Google Analytics &amp; Favicon</span>
          <span className="bg-amber-400 text-slate-900 text-[9.5px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
            Live Search
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('settings'); setSearchQuery(''); }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'settings' || activeTab === 'security'
              ? 'bg-slate-900 text-white shadow-sm ring-2 ring-amber-400'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Settings className="w-4 h-4 text-amber-400" />
          <span>Settings, Domains &amp; Identity</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* GOOGLE ANALYTICS MEASUREMENT ID & WEBSITE FAVICON (LIVE INTERNET & GOOGLE SEARCH) */}
      {/* ============================================================ */}
      {activeTab === 'analytics-favicon' && (
        <div className="space-y-6">
          <AdminAnalyticsAndFaviconSettings
            showNotification={showNotificationMsg}
          />
        </div>
      )}

      {/* ============================================================ */}
      {/* 9B. KARMAIYA CENTRAL OFFICE FULL DETAILS (OPTION 5) */}
      {/* ============================================================ */}
      {activeTab === 'central-office' && (
        <AdminCentralOfficeEditor
          onNavigateToPublic={() => setCurrentTab('home')}
          showNotification={showNotificationMsg}
        />
      )}
      {activeTab === 'master-setup' && (
        <AdminMasterOneTimeSetup onNavigateToPublic={() => setCurrentTab('home')} />
      )}

      {/* ============================================================ */}
      {/* 0A. NOTIFICATIONS, FOLLOWERS & MEMBER JOIN UPDATES */}
      {/* ============================================================ */}
      {activeTab === 'notifications' && (
        <AdminNotificationsView onNavigateSubTab={(tab) => setActiveTab(tab as AdminSubTab)} />
      )}

      {/* ============================================================ */}
      {/* 0B. POSTS & NOTICES MANAGEMENT (NOTICES, MEETINGS, FILES, PHOTOS, EVENTS, NEW MEMBERS) */}
      {/* ============================================================ */}
      {activeTab === 'notices' && <AdminNoticesManager />}

      {/* ============================================================ */}
      {/* 0C. LIVE COMMUNITY VOICE & HERITAGE INITIATIVES POLL */}
      {/* ============================================================ */}
      {activeTab === 'poll' && (
        <AdminLivePollManager
          onNavigateToPublic={() => setCurrentTab('home')}
          showNotification={showNotificationMsg}
        />
      )}

      {/* ============================================================ */}
      {/* 1. YOUTH LEADER DETAILS MANAGEMENT */}
      {/* ============================================================ */}
      {activeTab === 'leaders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200">
            <div>
              <h2 className="text-xl font-black text-slate-900 font-poppins">
                Youth &amp; Community Leadership Roster
              </h2>
              <p className="text-xs text-slate-500">
                Manage executive committee members, youth leaders, contact numbers, and bios.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingLeader({
                  id: '',
                  name: '',
                  nameNepali: '',
                  role: '',
                  category: 'youth',
                  image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
                  bio: '',
                  bioNepali: '',
                  responsibilities: ['Youth Empowerment', 'Cultural Preservation'],
                  phone: '+977-9800000000',
                  email: 'leader@boteyouth.org.np',
                  ward: 'Ward 11, Karmaiya',
                  term: '2024-2027',
                  badge: 'Youth Executive'
                });
                setIsAddingLeader(true);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Youth Leader</span>
            </button>
          </div>

          {/* Leaders List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leaders.map((lead) => (
              <div
                key={lead.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition space-y-4"
              >
                <div className="flex items-start gap-4">
                  {lead.image && lead.image.trim() ? (
                    <img
                      src={lead.image.trim()}
                      alt={lead.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center text-slate-500 font-bold text-xs">
                      {lead.name.slice(0, 2).toUpperCase() || 'BY'}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                      {lead.category === 'youth' ? 'Youth Leader' : 'Community Leader'}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm truncate mt-1">{lead.name}</h3>
                    <p className="text-xs text-slate-500 font-nepali truncate">{lead.nameNepali}</p>
                    <p className="text-xs text-[#003893] font-semibold truncate mt-0.5">{lead.role}</p>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 truncate">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{lead.ward}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 truncate">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>{lead.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 truncate">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span>{lead.email}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setEditingLeader(lead);
                      setIsAddingLeader(false);
                    }}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      deleteLeader(lead.id);
                      showNotificationMsg(`Removed leader ${lead.name}`);
                    }}
                    className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit / Add Leader Modal */}
          {editingLeader && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-black text-slate-900 font-poppins">
                    {isAddingLeader ? 'Add New Youth Leader' : `Edit Leader: ${editingLeader.name}`}
                  </h3>
                  <button
                    onClick={() => setEditingLeader(null)}
                    className="text-slate-400 hover:text-slate-700 text-xl font-bold"
                  >
                    &times;
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name (English)</label>
                    <input
                      type="text"
                      value={editingLeader.name}
                      onChange={(e) => setEditingLeader({ ...editingLeader, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Name (Nepali - देवनागरी)</label>
                    <input
                      type="text"
                      value={editingLeader.nameNepali}
                      onChange={(e) => setEditingLeader({ ...editingLeader, nameNepali: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Leadership Role / Designation</label>
                    <input
                      type="text"
                      value={editingLeader.role}
                      onChange={(e) => setEditingLeader({ ...editingLeader, role: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={editingLeader.category}
                      onChange={(e) => setEditingLeader({ ...editingLeader, category: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    >
                      <option value="youth">Youth Leader</option>
                      <option value="community">Community Elder / Leader</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={editingLeader.phone}
                      onChange={(e) => setEditingLeader({ ...editingLeader, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={editingLeader.email}
                      onChange={(e) => setEditingLeader({ ...editingLeader, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ward / Location</label>
                    <input
                      type="text"
                      value={editingLeader.ward}
                      onChange={(e) => setEditingLeader({ ...editingLeader, ward: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Term</label>
                    <input
                      type="text"
                      value={editingLeader.term}
                      onChange={(e) => setEditingLeader({ ...editingLeader, term: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <DirectImageUploader
                      id="leader-direct-photo-upload"
                      label="Leader Profile Photo"
                      value={editingLeader.image}
                      onChange={(img) => setEditingLeader({ ...editingLeader, image: img })}
                      aspectRatio="portrait"
                      hint="Upload portrait photo directly from your device. Supports JPG, PNG, WEBP, or SVG."
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Biography</label>
                    <textarea
                      rows={3}
                      value={editingLeader.bio}
                      onChange={(e) => setEditingLeader({ ...editingLeader, bio: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setEditingLeader(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!editingLeader.name.trim()) {
                        showNotificationMsg('Please enter leader name');
                        return;
                      }
                      if (isAddingLeader) {
                        const { id, ...rest } = editingLeader;
                        addLeader(rest);
                        showNotificationMsg(`Added new leader ${editingLeader.name}`);
                      } else {
                        updateLeader(editingLeader.id, editingLeader);
                        showNotificationMsg(`Updated leader ${editingLeader.name}`);
                      }
                      setEditingLeader(null);
                    }}
                    className="bg-[#003893] hover:bg-blue-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Leader Details</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. BOTE HISTORY & ORIGINS MANAGEMENT */}
      {/* ============================================================ */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200">
            <div>
              <h2 className="text-xl font-black text-slate-900 font-poppins">
                बोटे जातिको इतिहास
              </h2>
              <p className="text-xs text-slate-500">
                Edit ancient origin legends, river ferry eras, craftsmanship milestones, and modern youth empowerment epochs.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingEvent({
                  id: '',
                  year: '2026+',
                  periodLabel: 'Modern Era',
                  title: '',
                  titleNepali: '',
                  category: 'youth',
                  categoryLabel: 'Youth Empowerment',
                  summary: '',
                  culturalImpact: '',
                  riverLocation: 'Bagmati River Basin, Karmaiya',
                  tag: 'HERITAGE',
                  image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1000',
                  artifacts: ['Dugout Canoe', 'River Net']
                });
                setIsAddingEvent(true);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add History Milestone</span>
            </button>
          </div>

          {/* Timeline Milestones Cards */}
          <div className="space-y-4">
            {timelineEvents.map((event, idx) => (
              <div
                key={event.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start gap-6 hover:shadow-md transition"
              >
                {event.image && event.image.trim() ? (
                  <img
                    src={event.image.trim()}
                    alt={event.title}
                    className="w-full md:w-44 h-32 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                ) : (
                  <div className="w-full md:w-44 h-32 rounded-2xl bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center text-slate-400">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-white bg-[#003893] px-2.5 py-0.5 rounded-full">
                      {event.year} • {event.periodLabel}
                    </span>
                    <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                      {event.categoryLabel}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.riverLocation}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{event.title}</h3>
                  <p className="text-xs text-slate-500 font-nepali">{event.titleNepali}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{event.summary}</p>
                  <p className="text-[11px] text-[#003893] bg-blue-50 p-2.5 rounded-xl border border-blue-100">
                    <strong>Cultural Impact:</strong> {event.culturalImpact}
                  </p>
                </div>

                <div className="flex md:flex-col items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingEvent(event);
                      setIsAddingEvent(false);
                    }}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition border border-blue-200"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      deleteTimelineEvent(event.id);
                      showNotificationMsg(`Deleted milestone ${event.title}`);
                    }}
                    className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-50 transition border border-red-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Event Modal */}
          {editingEvent && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-black text-slate-900 font-poppins">
                    {isAddingEvent ? 'Add Historical Milestone' : `Edit Milestone: ${editingEvent.title}`}
                  </h3>
                  <button onClick={() => setEditingEvent(null)} className="text-slate-400 hover:text-slate-700 text-xl font-bold">
                    &times;
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Year / Epoch (e.g. 14th Century, 2026)</label>
                    <input
                      type="text"
                      value={editingEvent.year}
                      onChange={(e) => setEditingEvent({ ...editingEvent, year: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Period Label (e.g. Ancient Roots, Royal Decree)</label>
                    <input
                      type="text"
                      value={editingEvent.periodLabel}
                      onChange={(e) => setEditingEvent({ ...editingEvent, periodLabel: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Milestone Title (English)</label>
                    <input
                      type="text"
                      value={editingEvent.title}
                      onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Title (Nepali देवनागरी)</label>
                    <input
                      type="text"
                      value={editingEvent.titleNepali}
                      onChange={(e) => setEditingEvent({ ...editingEvent, titleNepali: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={editingEvent.category}
                      onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    >
                      <option value="ancient">Ancient Roots</option>
                      <option value="governance">Royal &amp; Ferry Rights</option>
                      <option value="craft">Water Craft &amp; Dugout Canoe</option>
                      <option value="modern">Modern Transition</option>
                      <option value="youth">Youth Leadership</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">River Location</label>
                    <input
                      type="text"
                      value={editingEvent.riverLocation}
                      onChange={(e) => setEditingEvent({ ...editingEvent, riverLocation: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <DirectImageUploader
                      id="event-direct-photo-upload"
                      label="Milestone Heritage Photo"
                      value={editingEvent.image}
                      onChange={(img) => setEditingEvent({ ...editingEvent, image: img })}
                      aspectRatio="video"
                      hint="Upload timeline photo directly from your device. Supports JPG, PNG, WEBP, or SVG."
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Summary Narrative</label>
                    <textarea
                      rows={3}
                      value={editingEvent.summary}
                      onChange={(e) => setEditingEvent({ ...editingEvent, summary: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Cultural &amp; Historical Impact</label>
                    <textarea
                      rows={2}
                      value={editingEvent.culturalImpact}
                      onChange={(e) => setEditingEvent({ ...editingEvent, culturalImpact: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button onClick={() => setEditingEvent(null)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!editingEvent.title.trim()) {
                        showNotificationMsg('Please enter milestone title');
                        return;
                      }
                      if (isAddingEvent) {
                        const { id, ...rest } = editingEvent;
                        addTimelineEvent(rest);
                        showNotificationMsg(`Added milestone ${editingEvent.title}`);
                      } else {
                        updateTimelineEvent(editingEvent.id, editingEvent);
                        showNotificationMsg(`Updated milestone ${editingEvent.title}`);
                      }
                      setEditingEvent(null);
                    }}
                    className="bg-[#003893] hover:bg-blue-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Milestone</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. CULTURE & RIVER RITUALS MANAGEMENT */}
      {/* ============================================================ */}
      {activeTab === 'culture' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200">
            <div>
              <h2 className="text-xl font-black text-slate-900 font-poppins">
                Culture, Rituals &amp; River Worship
              </h2>
              <p className="text-xs text-slate-500">
                Manage sacred ceremonies like Sansari Devi Puja, Jal Puja, seasonal boat festivals, and cultural rituals.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingTradition({
                  id: '',
                  title: '',
                  titleNepali: '',
                  season: 'Spring / Chaitra',
                  category: 'Sacred Water Ritual',
                  description: '',
                  significance: '',
                  image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1000',
                  rituals: ['Sanctification of water', 'River bank prayers']
                });
                setIsAddingTradition(true);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add River Ritual</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {culturalTraditions.map((trad) => (
              <div
                key={trad.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-full h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                    {trad.image && trad.image.trim() ? (
                      <img src={trad.image.trim()} alt={trad.title} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-10 h-10 text-slate-400 opacity-40" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                      {trad.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{trad.season}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">{trad.title}</h3>
                  <p className="text-xs text-slate-500 font-nepali">{trad.titleNepali}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{trad.description}</p>
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900">
                    <strong>Significance:</strong> {trad.significance}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setEditingTradition(trad);
                      setIsAddingTradition(false);
                    }}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Ritual</span>
                  </button>
                  <button
                    onClick={() => {
                      deleteCulturalTradition(trad.id);
                      showNotificationMsg(`Deleted ritual ${trad.title}`);
                    }}
                    className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Tradition Modal */}
          {editingTradition && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-black text-slate-900 font-poppins">
                    {isAddingTradition ? 'Add Cultural Ritual' : `Edit Ritual: ${editingTradition.title}`}
                  </h3>
                  <button onClick={() => setEditingTradition(null)} className="text-slate-400 hover:text-slate-700 text-xl font-bold">
                    &times;
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ritual Title (English)</label>
                    <input
                      type="text"
                      value={editingTradition.title}
                      onChange={(e) => setEditingTradition({ ...editingTradition, title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ritual Title (Nepali देवनागरी)</label>
                    <input
                      type="text"
                      value={editingTradition.titleNepali}
                      onChange={(e) => setEditingTradition({ ...editingTradition, titleNepali: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Season / Timing</label>
                    <input
                      type="text"
                      value={editingTradition.season}
                      onChange={(e) => setEditingTradition({ ...editingTradition, season: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={editingTradition.category}
                      onChange={(e) => setEditingTradition({ ...editingTradition, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <DirectImageUploader
                      id="ritual-direct-photo-upload"
                      label="Ritual & Festival Photo"
                      value={editingTradition.image}
                      onChange={(img) => setEditingTradition({ ...editingTradition, image: img })}
                      aspectRatio="video"
                      hint="Upload ceremony photo directly from your device. Supports JPG, PNG, WEBP, or SVG."
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editingTradition.description}
                      onChange={(e) => setEditingTradition({ ...editingTradition, description: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Spiritual Significance</label>
                    <textarea
                      rows={2}
                      value={editingTradition.significance}
                      onChange={(e) => setEditingTradition({ ...editingTradition, significance: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button onClick={() => setEditingTradition(null)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!editingTradition.title.trim()) {
                        showNotificationMsg('Please enter ritual title');
                        return;
                      }
                      if (isAddingTradition) {
                        const { id, ...rest } = editingTradition;
                        addCulturalTradition(rest);
                        showNotificationMsg(`Added ritual ${editingTradition.title}`);
                      } else {
                        updateCulturalTradition(editingTradition.id, editingTradition);
                        showNotificationMsg(`Updated ritual ${editingTradition.title}`);
                      }
                      setEditingTradition(null);
                    }}
                    className="bg-[#003893] hover:bg-blue-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Ritual Details</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. BOTE LANGUAGE (TARAHI) MANAGEMENT */}
      {/* ============================================================ */}
      {activeTab === 'language' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200">
            <div>
              <h2 className="text-xl font-black text-slate-900 font-poppins">
                Tarahi Bote Lexicon &amp; Dictionary
              </h2>
              <p className="text-xs text-slate-500">
                Preserve and expand the endangered Tarahi oral language vocabulary, phonetics, and Nepali/English translations.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingWord({
                  id: '',
                  tarahi: '',
                  devnagari: '',
                  nepali: '',
                  english: '',
                  phonetic: '',
                  category: 'River & Boating',
                  exampleSentence: ''
                });
                setIsAddingWord(true);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Word</span>
            </button>
          </div>

          {/* Search bar inside language management */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter words by Tarahi, Nepali, or English..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#003893] text-slate-900"
            />
          </div>

          {/* Words Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Tarahi Word</th>
                    <th className="px-5 py-3.5">Nepali (देवनागरी)</th>
                    <th className="px-5 py-3.5">English</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5">Phonetic</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {dictionaryWords
                    .filter((w) => {
                      const q = searchQuery.toLowerCase().trim();
                      if (!q) return true;
                      return (
                        w.tarahi.toLowerCase().includes(q) ||
                        w.devnagari.toLowerCase().includes(q) ||
                        w.nepali.toLowerCase().includes(q) ||
                        w.english.toLowerCase().includes(q)
                      );
                    })
                    .map((word) => (
                      <tr key={word.id} className="hover:bg-slate-50 transition">
                        <td className="px-5 py-3 font-bold text-slate-900">
                          <span>{word.tarahi}</span>
                          <span className="block text-[11px] text-red-600 font-nepali">{word.devnagari}</span>
                        </td>
                        <td className="px-5 py-3 font-nepali">{word.nepali}</td>
                        <td className="px-5 py-3 font-medium text-slate-800">{word.english}</td>
                        <td className="px-5 py-3">
                          <span className="text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full">
                            {word.category}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-mono text-slate-500 text-[11px]">/{word.phonetic}/</td>
                        <td className="px-5 py-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingWord(word);
                              setIsAddingWord(false);
                            }}
                            className="text-blue-700 hover:text-blue-900 font-bold hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              deleteDictionaryWord(word.id);
                              showNotificationMsg(`Deleted word ${word.tarahi}`);
                            }}
                            className="text-red-600 hover:text-red-800 font-bold hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit Word Modal */}
          {editingWord && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-black text-slate-900 font-poppins">
                    {isAddingWord ? 'Add Tarahi Lexicon Word' : `Edit Word: ${editingWord.tarahi}`}
                  </h3>
                  <button onClick={() => setEditingWord(null)} className="text-slate-400 hover:text-slate-700 text-xl font-bold">
                    &times;
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tarahi Word (Romanized)</label>
                    <input
                      type="text"
                      value={editingWord.tarahi}
                      onChange={(e) => setEditingWord({ ...editingWord, tarahi: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tarahi in Devanagari (देवनागरी)</label>
                    <input
                      type="text"
                      value={editingWord.devnagari}
                      onChange={(e) => setEditingWord({ ...editingWord, devnagari: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Standard Nepali Meaning</label>
                    <input
                      type="text"
                      value={editingWord.nepali}
                      onChange={(e) => setEditingWord({ ...editingWord, nepali: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">English Translation</label>
                    <input
                      type="text"
                      value={editingWord.english}
                      onChange={(e) => setEditingWord({ ...editingWord, english: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phonetic Pronunciation</label>
                    <input
                      type="text"
                      value={editingWord.phonetic}
                      onChange={(e) => setEditingWord({ ...editingWord, phonetic: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={editingWord.category}
                      onChange={(e) => setEditingWord({ ...editingWord, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    >
                      <option value="River & Boating">River &amp; Boating</option>
                      <option value="Nature & Sacred">Nature &amp; Sacred</option>
                      <option value="Tools & Craft">Tools &amp; Craft</option>
                      <option value="Family & People">Family &amp; People</option>
                      <option value="Daily Life">Daily Life</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Example Usage Sentence</label>
                    <input
                      type="text"
                      value={editingWord.exampleSentence || ''}
                      onChange={(e) => setEditingWord({ ...editingWord, exampleSentence: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button onClick={() => setEditingWord(null)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!editingWord.tarahi.trim()) {
                        showNotificationMsg('Please enter Tarahi word');
                        return;
                      }
                      if (isAddingWord) {
                        const { id, ...rest } = editingWord;
                        addDictionaryWord(rest);
                        showNotificationMsg(`Added word ${editingWord.tarahi}`);
                      } else {
                        updateDictionaryWord(editingWord.id, editingWord);
                        showNotificationMsg(`Updated word ${editingWord.tarahi}`);
                      }
                      setEditingWord(null);
                    }}
                    className="bg-[#003893] hover:bg-blue-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Word</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. CULTURE DRESS & JEWELRY MANAGEMENT */}
      {/* ============================================================ */}
      {activeTab === 'dress' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200">
            <div>
              <h2 className="text-xl font-black text-slate-900 font-poppins">
                Traditional Culture Dress &amp; Silver Jewelry
              </h2>
              <p className="text-xs text-slate-500">
                Update traditional Gunya-Cholo, Hansuli necklaces, silver ornaments, and cultural craftsmanship details.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingDress({
                  id: '',
                  name: '',
                  nameNepali: '',
                  gender: 'women',
                  materials: 'Cotton, Silver Coin',
                  description: '',
                  significance: '',
                  image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=800',
                  features: ['Hand-woven', 'Ancestral Design']
                });
                setIsAddingDress(true);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add Dress / Jewelry Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dressItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-full h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                    {item.image && item.image.trim() ? (
                      <img src={item.image.trim()} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-10 h-10 text-slate-400 opacity-40" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      {item.gender === 'women' ? 'Women Attire' : item.gender === 'men' ? 'Men Attire' : 'Unisex Heritage'}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{item.materials}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">{item.name}</h3>
                  <p className="text-xs text-slate-500 font-nepali">{item.nameNepali}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                  <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-xs text-red-900">
                    <strong>Cultural Significance:</strong> {item.significance}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setEditingDress(item);
                      setIsAddingDress(false);
                    }}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Attire</span>
                  </button>
                  <button
                    onClick={() => {
                      deleteDressItem(item.id);
                      showNotificationMsg(`Deleted item ${item.name}`);
                    }}
                    className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Dress Modal */}
          {editingDress && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-black text-slate-900 font-poppins">
                    {isAddingDress ? 'Add Dress / Jewelry Item' : `Edit Item: ${editingDress.name}`}
                  </h3>
                  <button onClick={() => setEditingDress(null)} className="text-slate-400 hover:text-slate-700 text-xl font-bold">
                    &times;
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Attire Name (English)</label>
                    <input
                      type="text"
                      value={editingDress.name}
                      onChange={(e) => setEditingDress({ ...editingDress, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Name (Nepali देवनागरी)</label>
                    <input
                      type="text"
                      value={editingDress.nameNepali}
                      onChange={(e) => setEditingDress({ ...editingDress, nameNepali: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Gender Wearing</label>
                    <select
                      value={editingDress.gender}
                      onChange={(e) => setEditingDress({ ...editingDress, gender: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    >
                      <option value="women">Women Traditional Wear</option>
                      <option value="men">Men Traditional Wear</option>
                      <option value="both">Both / Universal Cultural Wear</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Materials / Craft Composition</label>
                    <input
                      type="text"
                      value={editingDress.materials}
                      onChange={(e) => setEditingDress({ ...editingDress, materials: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <DirectImageUploader
                      id="dress-direct-photo-upload"
                      label="Traditional Attire & Jewelry Photo"
                      value={editingDress.image}
                      onChange={(img) => setEditingDress({ ...editingDress, image: img })}
                      aspectRatio="video"
                      hint="Upload cultural attire photo directly from your device. Supports JPG, PNG, WEBP, or SVG."
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editingDress.description}
                      onChange={(e) => setEditingDress({ ...editingDress, description: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Cultural Significance</label>
                    <textarea
                      rows={2}
                      value={editingDress.significance}
                      onChange={(e) => setEditingDress({ ...editingDress, significance: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button onClick={() => setEditingDress(null)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!editingDress.name.trim()) {
                        showNotificationMsg('Please enter attire name');
                        return;
                      }
                      if (isAddingDress) {
                        const { id, ...rest } = editingDress;
                        addDressItem(rest);
                        showNotificationMsg(`Added attire item ${editingDress.name}`);
                      } else {
                        updateDressItem(editingDress.id, editingDress);
                        showNotificationMsg(`Updated attire item ${editingDress.name}`);
                      }
                      setEditingDress(null);
                    }}
                    className="bg-[#003893] hover:bg-blue-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Attire Item</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 5B. BOTE TRADITIONAL COSTUMES & REGALIA */}
      {/* ============================================================ */}
      {activeTab === 'costumes' && <AdminCostumesManager />}

      {/* ============================================================ */}
      {/* 5C. REGISTERED COMMUNITY MEMBERS DIRECTORY */}
      {/* ============================================================ */}
      {activeTab === 'members' && <AdminMembersManager />}

      {/* ============================================================ */}
      {/* 5D. GOOGLE DRIVE COMMUNITY CLOUD STORAGE */}
      {/* ============================================================ */}
      {activeTab === 'gdrive' && <AdminGoogleDriveManager />}

      {/* ============================================================ */}
      {/* 6. BENTO GRID MATRIX CONFIGURATION */}
      {/* ============================================================ */}
      {activeTab === 'bento' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900 font-poppins">
              Bento Grid Matrix Configuration
            </h2>
            <p className="text-xs text-slate-500">
              Customize the titles, badges, and headline messages in the homepage Bento Grid layout.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Header Pill Text</label>
              <input
                type="text"
                value={bentoConfig.pillText}
                onChange={(e) => updateBentoConfig({ pillText: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Main Bento Title</label>
              <input
                type="text"
                value={bentoConfig.title}
                onChange={(e) => updateBentoConfig({ title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Bento Subtitle</label>
              <textarea
                rows={2}
                value={bentoConfig.subtitle}
                onChange={(e) => updateBentoConfig({ subtitle: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Hero Heritage Tag</label>
              <input
                type="text"
                value={bentoConfig.heritageTag}
                onChange={(e) => updateBentoConfig({ heritageTag: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Hero Heritage Title</label>
              <input
                type="text"
                value={bentoConfig.heritageTitle}
                onChange={(e) => updateBentoConfig({ heritageTitle: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Hero Heritage Description</label>
              <textarea
                rows={2}
                value={bentoConfig.heritageDesc}
                onChange={(e) => updateBentoConfig({ heritageDesc: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => showNotificationMsg('Bento Grid settings updated.')}
              className="bg-[#003893] hover:bg-blue-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Save Bento Changes</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. CORE PILLARS CONFIGURATION */}
      {/* ============================================================ */}
      {activeTab === 'pillars' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900 font-poppins">
              Core Pillars of Bote Community
            </h2>
            <p className="text-xs text-slate-500">
              Configure the 4 core pillar narratives that appear on the homepage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Section Tag</label>
              <input
                type="text"
                value={pillarsConfig.tag}
                onChange={(e) => updatePillarsConfig({ tag: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Main Title</label>
              <input
                type="text"
                value={pillarsConfig.title}
                onChange={(e) => updatePillarsConfig({ title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Pillars Overview Description</label>
              <textarea
                rows={2}
                value={pillarsConfig.desc}
                onChange={(e) => updatePillarsConfig({ desc: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
              />
            </div>

            {/* Pillar 1 */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-red-600 uppercase">Pillar 1: History &amp; Origins</span>
              <input
                type="text"
                value={pillarsConfig.p1Title}
                onChange={(e) => updatePillarsConfig({ p1Title: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900"
              />
              <textarea
                rows={2}
                value={pillarsConfig.p1Desc}
                onChange={(e) => updatePillarsConfig({ p1Desc: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900"
              />
            </div>

            {/* Pillar 2 */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-red-600 uppercase">Pillar 2: Culture &amp; River Rituals</span>
              <input
                type="text"
                value={pillarsConfig.p2Title}
                onChange={(e) => updatePillarsConfig({ p2Title: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900"
              />
              <textarea
                rows={2}
                value={pillarsConfig.p2Desc}
                onChange={(e) => updatePillarsConfig({ p2Desc: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900"
              />
            </div>

            {/* Pillar 3 */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-red-600 uppercase">Pillar 3: Bote Language (Tarahi)</span>
              <input
                type="text"
                value={pillarsConfig.p3Title}
                onChange={(e) => updatePillarsConfig({ p3Title: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900"
              />
              <textarea
                rows={2}
                value={pillarsConfig.p3Desc}
                onChange={(e) => updatePillarsConfig({ p3Desc: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900"
              />
            </div>

            {/* Pillar 4 */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-red-600 uppercase">Pillar 4: Culture Dress &amp; Jewelry</span>
              <input
                type="text"
                value={pillarsConfig.p4Title}
                onChange={(e) => updatePillarsConfig({ p4Title: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900"
              />
              <textarea
                rows={2}
                value={pillarsConfig.p4Desc}
                onChange={(e) => updatePillarsConfig({ p4Desc: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => showNotificationMsg('Core Pillars updated successfully.')}
              className="bg-[#003893] hover:bg-blue-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Save Core Pillars</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 8. SETTINGS: THEMES, LOGOS, PASSCODE & SITE IDENTITY */}
      {/* ============================================================ */}
      {(activeTab === 'settings' || activeTab === 'security') && (
        <div className="space-y-8">
          {/* Admin Notice Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-red-900 text-white p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h2 className="text-base font-extrabold font-poppins">
                  Admin Exclusive Settings &amp; Customization
                </h2>
                <p className="text-xs text-white/80">
                  Manage live census statistics (Bote population, council wards, scholarship fund, Indigenous pride), membership registry reviews, automate reload engine, and branding themes.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full font-bold">
              Admin Authenticated
            </span>
          </div>

          {/* ============================================================ */}
          {/* MASTER ONE-TIME SETUP & REAL-TIME BROADCAST WIDGET */}
          {/* ============================================================ */}
          <AdminMasterOneTimeSetup onNavigateToPublic={() => setCurrentTab('home')} />

          {/* ============================================================ */}
          {/* COMMUNITY KEY METRICS & AUTOMATE RELOAD & MEMBER DETAILS */}
          {/* ============================================================ */}
          <AdminSettingsMetricsAndMembers />

          {/* ============================================================ */}
          {/* OPTION 2: UPLOAD OWN LOGO (HEADER & FOOTER) */}
          {/* ============================================================ */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#003893] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                    Option 2
                  </span>
                  <h2 className="text-xl font-black text-slate-900 font-poppins flex items-center gap-2">
                    <Upload className="w-5 h-5 text-[#003893]" />
                    <span>Upload Own Logo (Header &amp; Footer)</span>
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Upload custom official emblem logos for the site Header and Footer. Only the admin can upload, edit, or reset these logos.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetLogos();
                  showNotificationMsg('Reset both Header and Footer logos to authentic default BYCN emblem.');
                }}
                className="text-xs font-bold text-slate-600 hover:text-red-600 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Both to Default Emblem</span>
              </button>
            </div>

            {/* 2-Column Responsive Logo Upload Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Box 1: Header Logo */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">
                        Header Official Logo
                      </h3>
                      <p className="text-xs text-slate-500">
                        Displayed in the top navigation bar across all website pages.
                      </p>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-red-100 text-[#DC143C] px-2.5 py-1 rounded-full">
                      Header Bar
                    </span>
                  </div>

                  {/* Header Bar Live Simulation Preview */}
                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between border-b-4 border-b-red-600">
                    <div className="flex items-center space-x-3">
                      <img
                        src={headerLogo && headerLogo.trim() ? headerLogo.trim() : DEFAULT_LOGO_URL}
                        alt="Header Logo Preview"
                        className="w-12 h-12 rounded-full object-cover border-2 border-red-600 shadow-sm bg-white"
                      />
                      <div>
                        <div className="text-xs font-black text-slate-900 leading-tight">
                          Bote Youth Community Nepal
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Karmaiya, Sarlahi District
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Live Preview
                    </span>
                  </div>

                  {/* Header Logo Direct Uploader */}
                  <DirectImageUploader
                    label="Choose / Upload Header Logo Image"
                    value={headerLogo}
                    onChange={async (newVal) => {
                      setHeaderLogo(newVal);
                    }}
                    aspectRatio="square"
                  />

                  {/* Manual URL Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Or Paste Direct Image / Emblem URL:</label>
                    <input
                      type="url"
                      value={headerLogo}
                      onChange={(e) => setHeaderLogo(e.target.value)}
                      placeholder="https://... or data:image/png..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#DC143C] bg-white font-mono"
                    />
                  </div>

                  {/* Dedicated Save Header Logo Button */}
                  <button
                    type="button"
                    disabled={isSavingHeaderLogo}
                    onClick={async () => {
                      try {
                        setIsSavingHeaderLogo(true);
                        await saveHeaderLogo(headerLogo);
                        showNotificationMsg('✅ Official Header Logo saved to cloud database and synced real-time!');
                      } catch {
                        showNotificationMsg('Header logo updated locally.');
                      } finally {
                        setIsSavingHeaderLogo(false);
                      }
                    }}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#DC143C] hover:bg-red-700 active:scale-[0.99] transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingHeaderLogo ? 'Saving Header Logo...' : '💾 Save Official Header Logo'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
                  <span className="text-slate-500">
                    Status: <strong className="text-slate-700">{headerLogo === DEFAULT_LOGO_URL ? 'Official Default' : 'Custom Uploaded'}</strong>
                  </span>
                  {headerLogo !== DEFAULT_LOGO_URL && (
                    <button
                      type="button"
                      onClick={async () => {
                        setHeaderLogo(DEFAULT_LOGO_URL);
                        await saveHeaderLogo(DEFAULT_LOGO_URL);
                        showNotificationMsg('Header logo reset to default emblem and synced across devices.');
                      }}
                      className="text-red-600 hover:text-red-800 font-bold text-xs flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Header to Default</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Box 2: Footer Logo */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">
                        Footer Official Logo
                      </h3>
                      <p className="text-xs text-slate-500">
                        Displayed in the bottom footer of every page above contact coordinates.
                      </p>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white px-2.5 py-1 rounded-full">
                      Footer Bar
                    </span>
                  </div>

                  {/* Footer Bar Live Simulation Preview */}
                  <div className="bg-[#0b1329] rounded-xl p-4 border border-slate-800 shadow-sm flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={footerLogo && footerLogo.trim() ? footerLogo.trim() : DEFAULT_LOGO_URL}
                        alt="Footer Logo Preview"
                        className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-sm bg-white"
                      />
                      <div>
                        <div className="text-xs font-black text-white leading-tight">
                          Bote Youth Community Nepal
                        </div>
                        <div className="text-[10px] text-slate-400">
                          River Heritage &amp; Youth Council
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                      Live Preview
                    </span>
                  </div>

                  {/* Footer Logo Direct Uploader */}
                  <DirectImageUploader
                    label="Choose / Upload Footer Logo Image"
                    value={footerLogo}
                    onChange={async (newVal) => {
                      setFooterLogo(newVal);
                    }}
                    aspectRatio="square"
                  />

                  {/* Manual URL Input & Copy Header */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-600">Or Paste Direct Image / Emblem URL:</label>
                      <button
                        type="button"
                        onClick={() => {
                          setFooterLogo(headerLogo);
                          showNotificationMsg('Copied Header logo to Footer!');
                        }}
                        className="text-[10px] font-bold text-[#003893] hover:underline"
                      >
                        Copy from Header Logo
                      </button>
                    </div>
                    <input
                      type="url"
                      value={footerLogo}
                      onChange={(e) => setFooterLogo(e.target.value)}
                      placeholder="https://... or data:image/png..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003893] bg-white font-mono"
                    />
                  </div>

                  {/* Dedicated Save Footer Logo Button */}
                  <button
                    type="button"
                    disabled={isSavingFooterLogo}
                    onClick={async () => {
                      try {
                        setIsSavingFooterLogo(true);
                        await saveFooterLogo(footerLogo);
                        showNotificationMsg('✅ Official Footer Logo saved to cloud database and synced real-time!');
                      } catch {
                        showNotificationMsg('Footer logo updated locally.');
                      } finally {
                        setIsSavingFooterLogo(false);
                      }
                    }}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#003893] hover:bg-blue-900 active:scale-[0.99] transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingFooterLogo ? 'Saving Footer Logo...' : '💾 Save Official Footer Logo'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
                  <span className="text-slate-500">
                    Status: <strong className="text-slate-700">{footerLogo === DEFAULT_LOGO_URL ? 'Official Default' : 'Custom Uploaded'}</strong>
                  </span>
                  {footerLogo !== DEFAULT_LOGO_URL && (
                    <button
                      type="button"
                      onClick={async () => {
                        setFooterLogo(DEFAULT_LOGO_URL);
                        await saveFooterLogo(DEFAULT_LOGO_URL);
                        showNotificationMsg('Footer logo reset to default emblem and synced across devices.');
                      }}
                      className="text-red-600 hover:text-red-800 font-bold text-xs flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Footer to Default</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Master Action: Save Both Logos at Once */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-[#003893] to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    One-Click Dual Logo Sync
                  </h4>
                  <p className="text-[11px] text-white/80">
                    Save both Header and Footer logos together and broadcast to all live clients simultaneously.
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={isSavingBothLogos}
                onClick={async () => {
                  try {
                    setIsSavingBothLogos(true);
                    await saveBothLogos(headerLogo, footerLogo);
                    showNotificationMsg('⚡ Both Header and Footer logos saved and broadcast across all devices!');
                  } catch {
                    showNotificationMsg('Logos saved locally.');
                  } finally {
                    setIsSavingBothLogos(false);
                  }
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingBothLogos ? 'Broadcasting...' : '💾 Save Both Header & Footer Logos Now'}</span>
              </button>
            </div>

            {/* Quick Live Preview Action */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-700">
                  Logo changes apply instantly to the Header &amp; Footer across all pages.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCurrentTab('home')}
                className="text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>View Changes on Live Site &rarr;</span>
              </button>
            </div>
          </div>

          {/* Option 3 & Option 4: Direct Public Live Update & Republic Options */}
          <AdminDirectPublicAndRepublicOptions
            onNavigateHome={() => setCurrentTab('home')}
            showNotification={showNotificationMsg}
          />

          {/* Option 5: Editable Table & Card Form - Karmaiya Central Office Full Details */}
          <AdminCentralOfficeEditor
            onNavigateToPublic={() => setCurrentTab('home')}
            showNotification={showNotificationMsg}
          />

          {/* Option 6 & Option 7: Website Favicon & Google Analytics Measurement ID */}
          <AdminAnalyticsAndFaviconSettings
            showNotification={showNotificationMsg}
          />

          {/* Change Passcode */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-900 font-poppins flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-500" />
                <span>Change Administrator Passcode</span>
              </h2>
              <p className="text-xs text-slate-500">
                Update the master administrative passcode to ensure only you and authorized leaders can access this management panel.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Passcode</label>
                <input
                  type="password"
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  placeholder="Enter current passcode..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Passcode (min 4 characters)</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Enter new passcode..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-mono"
                />
              </div>
            </div>

            {passMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-medium max-w-xl ${
                  passMessage.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {passMessage.text}
              </div>
            )}

            <div>
              <button
                onClick={() => {
                  const res = changeAdminPasscode(oldPass, newPass);
                  setPassMessage({ text: res.message, success: res.success });
                  if (res.success) {
                    setOldPass('');
                    setNewPass('');
                    showNotificationMsg('Master Admin Passcode updated!');
                  }
                }}
                className="bg-[#003893] hover:bg-blue-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
              >
                <Lock className="w-4 h-4 text-amber-300" />
                <span>Update Admin Passcode</span>
              </button>
            </div>
          </div>

          {/* Site Identity & Contacts - Real-Time Broadcast */}
          <AdminSiteIdentityForm />

          {/* Website Domains & DNS Management (.org, .com, .org.np) */}
          <AdminDomainsManager />

          {/* Authorized Google Accounts & Gmail Access */}
          <AdminGmailAccessManager />

          {/* Factory Reset */}
          <div className="bg-red-50 rounded-3xl p-6 border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-red-900">Reset Content to Factory Defaults</h3>
              <p className="text-xs text-red-700">
                Restore initial seed data for all leaders, traditions, dress items, and Tarahi dictionary.
              </p>
            </div>
            <button
              onClick={() => {
                resetAllToDefaults();
                showNotificationMsg('All content reset to original defaults.');
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All to Defaults</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
