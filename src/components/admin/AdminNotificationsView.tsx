/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useCommunityData } from '../../context/CommunityDataContext';
import { CommunityNotification, NotificationType } from '../../types';
import {
  Bell,
  CheckCircle,
  Clock,
  Download,
  Filter,
  Heart,
  Mail,
  Phone,
  PlayCircle,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  Volume2,
  VolumeX,
  ExternalLink,
  FileText,
  AlertCircle,
  Eye,
  X,
  Copy,
  Check,
  MapPin,
  Tag,
  ShieldCheck
} from 'lucide-react';

interface AdminNotificationsViewProps {
  onNavigateSubTab?: (subTab: string) => void;
}

export default function AdminNotificationsView({ onNavigateSubTab }: AdminNotificationsViewProps) {
  const {
    notifications,
    unreadNotificationsCount,
    notificationSoundEnabled,
    setNotificationSoundEnabled,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications,
    simulateTestNotification,
    playNotificationChime,
    followerCount
  } = useCommunityData();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<CommunityNotification | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2500);
    }
  };

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    return typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default';
  });

  const requestPushPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotificationPermission(perm);
      } catch (err) {
        console.warn('Failed to request notification permission:', err);
      }
    }
  };

  const handleSimulate = async (type: 'join' | 'follow' | 'notice') => {
    setIsSimulating(true);
    await simulateTestNotification(type);
    setIsSimulating(false);
  };

  const joinCount = useMemo(() => notifications.filter((n) => n.type === 'join').length, [notifications]);
  const followCount = useMemo(() => notifications.filter((n) => n.type === 'follow').length, [notifications]);
  const noticeCount = useMemo(
    () => notifications.filter((n) => n.type === 'notice' || n.type === 'update' || n.type === 'system').length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (unreadOnly && item.read) return false;
      if (filterType !== 'all') {
        if (filterType === 'join' && item.type !== 'join') return false;
        if (filterType === 'follow' && item.type !== 'follow') return false;
        if (filterType === 'notice' && item.type !== 'notice' && item.type !== 'update' && item.type !== 'system')
          return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = item.title?.toLowerCase().includes(q);
        const titleNeMatch = item.titleNepali?.toLowerCase().includes(q);
        const msgMatch = item.message?.toLowerCase().includes(q);
        const nameMatch = item.metadata?.name?.toLowerCase().includes(q);
        const emailMatch = item.metadata?.email?.toLowerCase().includes(q);
        const phoneMatch = item.metadata?.phone?.toLowerCase().includes(q);
        const idMatch = item.metadata?.membershipId?.toLowerCase().includes(q);
        const wardMatch = item.metadata?.ward?.toLowerCase().includes(q);
        return titleMatch || titleNeMatch || msgMatch || nameMatch || emailMatch || phoneMatch || idMatch || wardMatch;
      }
      return true;
    });
  }, [notifications, filterType, unreadOnly, searchQuery]);

  const exportAsCSV = () => {
    const headers = ['ID', 'Type', 'Title', 'Message', 'Timestamp', 'Read', 'Name', 'Email', 'Phone', 'Ward', 'MembershipID'];
    const rows = notifications.map((n) => [
      `"${n.id}"`,
      `"${n.type}"`,
      `"${(n.title || '').replace(/"/g, '""')}"`,
      `"${(n.message || '').replace(/"/g, '""')}"`,
      `"${n.timestamp}"`,
      `"${n.read ? 'Yes' : 'No'}"`,
      `"${(n.metadata?.name || '').replace(/"/g, '""')}"`,
      `"${(n.metadata?.email || '').replace(/"/g, '""')}"`,
      `"${(n.metadata?.phone || '').replace(/"/g, '""')}"`,
      `"${(n.metadata?.ward || '').replace(/"/g, '""')}"`,
      `"${(n.metadata?.membershipId || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BYCN_Notifications_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAsJSON = () => {
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(notifications, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonStr);
    link.setAttribute('download', `BYCN_Notifications_Export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTimestamp = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return iso;
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    try {
      const now = Date.now();
      const past = new Date(timestamp).getTime();
      const diffSec = Math.floor((now - past) / 1000);
      if (diffSec < 60) return 'Just now';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Real-Time Indicator */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight">Admin Activity &amp; Growth Notifications</h2>
                <p className="text-xs text-slate-300">
                  Real-time visibility when new members register or supporters follow the community
                </p>
              </div>
            </div>
          </div>

          {/* Status & Live Indicators */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 font-medium">Live Sync Active</span>
            </div>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => {
                setNotificationSoundEnabled(!notificationSoundEnabled);
                if (!notificationSoundEnabled) playNotificationChime();
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition border ${
                notificationSoundEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {notificationSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{notificationSoundEnabled ? 'Chime Sound On' : 'Chime Muted'}</span>
            </button>

            {/* Quick Test Alert Simulation Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                disabled={isSimulating}
                onClick={() => handleSimulate('join')}
                className="px-2.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                title="Simulate test member join"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+Test Join</span>
              </button>
              <button
                type="button"
                disabled={isSimulating}
                onClick={() => handleSimulate('follow')}
                className="px-2.5 py-1.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                title="Simulate test follower"
              >
                <Heart className="w-3.5 h-3.5" />
                <span>+Test Follow</span>
              </button>
              <button
                type="button"
                disabled={isSimulating}
                onClick={() => handleSimulate('notice')}
                className="px-2.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                title="Simulate test notice"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>+Test Notice</span>
              </button>
            </div>

            {/* Push Notifications permission */}
            {notificationPermission !== 'granted' && (
              <button
                type="button"
                onClick={requestPushPermission}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5"
                title="Enable browser desktop notifications for real-time alerts"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Enable Desktop Push</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Notifications */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Updates</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{notifications.length}</span>
            <span className="text-xs text-slate-500">logged events</span>
          </div>
          <p className="text-[11.5px] text-slate-400 mt-1">Both members, followers &amp; announcements</p>
        </div>

        {/* Member Joins */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Members Registered</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-950">{joinCount}</span>
            <span className="text-xs text-emerald-600 font-semibold">official joins</span>
          </div>
          {onNavigateSubTab && (
            <button
              type="button"
              onClick={() => onNavigateSubTab('members')}
              className="text-[11.5px] text-emerald-700 hover:text-emerald-900 font-bold mt-1 flex items-center gap-1 transition"
            >
              <span>View in Member Directory</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Community Followers */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Supporters Following</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-950">{followerCount}</span>
            <span className="text-xs text-rose-600 font-semibold">total followers</span>
          </div>
          <p className="text-[11.5px] text-slate-400 mt-1">{followCount} recent follow notification events</p>
        </div>

        {/* Unread Alerts */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Unread Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-900">{unreadNotificationsCount}</span>
            <span className="text-xs text-amber-700 font-semibold">require review</span>
          </div>
          {unreadNotificationsCount > 0 ? (
            <button
              type="button"
              onClick={() => markAllNotificationsAsRead()}
              className="text-[11.5px] text-amber-700 hover:text-amber-900 font-bold mt-1 flex items-center gap-1 transition"
            >
              <span>Mark all as read</span>
            </button>
          ) : (
            <p className="text-[11.5px] text-slate-400 mt-1">All notifications reviewed</p>
          )}
        </div>
      </div>

      {/* Action Toolbar: Test Simulation, Filters, Search & Exports */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, membership ID, ward, phone or email..."
              className="w-full pl-9.5 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
            />
          </div>

          {/* Live Stream Status Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Internet Notifications Active</span>
            </span>

            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

            {/* Export & Clear Options */}
            <button
              type="button"
              onClick={exportAsCSV}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition flex items-center gap-1"
              title="Export notifications as CSV file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>

            <button
              type="button"
              onClick={exportAsJSON}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition flex items-center gap-1"
              title="Export notifications as JSON file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition flex items-center gap-1"
                title="Clear all notification history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Filter:</span>
          </span>

          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition ${
              filterType === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Updates ({notifications.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterType('join')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
              filterType === 'join'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Members ({joinCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterType('follow')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
              filterType === 'follow'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Followers ({followCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterType('notice')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
              filterType === 'notice'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Notices ({noticeCount})</span>
          </button>

          <label className="ml-auto flex items-center gap-1.5 cursor-pointer select-none text-slate-600 hover:text-slate-900 font-semibold">
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={(e) => setUnreadOnly(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Unread Only ({unreadNotificationsCount})</span>
          </label>
        </div>
      </div>

      {/* Notifications Table / Feed */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400 mb-3">
              <Bell className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Notifications Match</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No notifications found matching "${searchQuery}". Try clearing your search.`
                : 'No notification records present in this view.'}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredNotifications.map((notif) => {
              const isJoin = notif.type === 'join';
              const isFollow = notif.type === 'follow';
              const isNotice = notif.type === 'notice' || notif.type === 'update';

              return (
                <div
                  key={notif.id}
                  className={`p-4 transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    notif.read ? 'bg-white hover:bg-slate-50/70' : 'bg-blue-50/40 hover:bg-blue-50/70'
                  }`}
                >
                  <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                    {/* Icon Badge */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        isJoin
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : isFollow
                          ? 'bg-rose-50 text-rose-600 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {isJoin ? (
                        <UserCheck className="w-5 h-5" />
                      ) : isFollow ? (
                        <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                      ) : (
                        <FileText className="w-5 h-5" />
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                            isJoin
                              ? 'bg-emerald-100/70 text-emerald-800 border-emerald-300'
                              : isFollow
                              ? 'bg-rose-100/70 text-rose-800 border-rose-300'
                              : 'bg-amber-100/70 text-amber-800 border-amber-300'
                          }`}
                        >
                          {isJoin ? 'New Member Registration' : isFollow ? 'Community Follower' : 'Notice / Circular'}
                        </span>

                        {!notif.read && (
                          <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            New
                          </span>
                        )}

                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatRelativeTime(notif.timestamp)}</span>
                          <span className="text-slate-300">({formatTimestamp(notif.timestamp)})</span>
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {notif.title}
                        {notif.titleNepali && (
                          <span className="font-normal text-slate-500 ml-1.5">({notif.titleNepali})</span>
                        )}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>

                      {/* Metadata Details Pill */}
                      {notif.metadata && (
                        <div className="pt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                          {notif.metadata.membershipId && (
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-mono font-bold text-[11px] border border-slate-200">
                              ID: {notif.metadata.membershipId}
                            </span>
                          )}

                          {notif.metadata.ward && (
                            <span className="bg-slate-50 px-2 py-0.5 rounded text-slate-700 text-[11px] border border-slate-200">
                              📍 {notif.metadata.ward}
                              {notif.metadata.municipality ? `, ${notif.metadata.municipality}` : ''}
                            </span>
                          )}

                          {notif.metadata.phone && (
                            <span className="flex items-center gap-1 text-[11px] text-slate-500">
                              <Phone className="w-3 h-3" />
                              <span>{notif.metadata.phone}</span>
                            </span>
                          )}

                          {notif.metadata.email && (
                            <span className="flex items-center gap-1 text-[11px] text-slate-500">
                              <Mail className="w-3 h-3" />
                              <span>{notif.metadata.email}</span>
                            </span>
                          )}

                          {notif.metadata.category && (
                            <span className="text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {notif.metadata.category}
                            </span>
                          )}

                          {notif.metadata.followerCount && (
                            <span className="text-rose-700 font-bold text-[11px] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              Total Followers: {notif.metadata.followerCount}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions on this notification */}
                  <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                    {/* Read Full Details */}
                    <button
                      type="button"
                      onClick={() => {
                        if (!notif.read) markNotificationAsRead(notif.id);
                        setSelectedNotification(notif);
                      }}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition flex items-center gap-1 cursor-pointer"
                      title="Read full details and parameters"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Read Details (पूरा विवरण)</span>
                    </button>

                    {/* View in member directory */}
                    {isJoin && onNavigateSubTab && (
                      <button
                        type="button"
                        onClick={() => onNavigateSubTab('members')}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition flex items-center gap-1"
                        title="Open Member Directory to verify or print membership"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Directory</span>
                      </button>
                    )}

                    {/* Toggle Read */}
                    <button
                      type="button"
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition ${
                        notif.read
                          ? 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                          : 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700'
                      }`}
                      title={notif.read ? 'Mark as read' : 'Mark as read'}
                    >
                      {notif.read ? 'Read' : 'Mark Read'}
                    </button>

                    {/* Delete single item */}
                    <button
                      type="button"
                      onClick={() => deleteNotification(notif.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition border border-transparent hover:border-red-200"
                      title="Delete this notification log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal to Clear All */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">Clear All Notification History?</h3>
              <p className="text-xs text-slate-500 mt-1">
                This will delete all {notifications.length} logged join and follow notification events from both server
                and Firestore. Member and follower records themselves remain safe.
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await clearAllNotifications();
                  setShowClearConfirm(false);
                }}
                className="flex-1 px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition shadow-sm"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Interactive Modal: Read Full Details for Notification */}
      {selectedNotification && (
        <div
          className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedNotification(null);
          }}
        >
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] text-left">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                    selectedNotification.type === 'join'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : selectedNotification.type === 'follow'
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  }`}
                >
                  {selectedNotification.type === 'join' ? (
                    <UserCheck className="w-5 h-5 text-emerald-400" />
                  ) : selectedNotification.type === 'follow' ? (
                    <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
                  ) : (
                    <FileText className="w-5 h-5 text-amber-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
                      {selectedNotification.type === 'join'
                        ? 'सदस्य दर्ता (New Member)'
                        : selectedNotification.type === 'follow'
                        ? 'सामुदायिक अनुयायी (Follower)'
                        : 'आधिकारिक सूचना (Notice)'}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified Event</span>
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                    Notification Full Details (सूचनाको पूर्ण विवरण)
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                title="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-800">
              {/* Title & Timestamp Card */}
              <div className="space-y-1.5">
                <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug font-poppins">
                  {selectedNotification.title}
                </h4>
                {selectedNotification.titleNepali && (
                  <p className="text-xs text-slate-500 font-nepali">
                    {selectedNotification.titleNepali}
                  </p>
                )}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono pt-0.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatRelativeTime(selectedNotification.timestamp)}</span>
                  <span>•</span>
                  <span>{formatTimestamp(selectedNotification.timestamp)}</span>
                </div>
              </div>

              {/* Complete Uncut Message Box */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-1.5 shadow-inner">
                <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Full Message Content (पूर्ण व्यहोरा):</span>
                </span>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                  {selectedNotification.message}
                </p>
              </div>

              {/* Structured Metadata Breakdown */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  <span>Recorded Event Parameters &amp; Identity (रेकर्ड विवरण):</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Membership ID if present */}
                  {selectedNotification.metadata?.membershipId && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Membership ID (सदस्यता नं.)
                      </span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-mono font-black text-sm text-slate-900">
                          {selectedNotification.metadata.membershipId}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedNotification.metadata!.membershipId!, 'id')}
                          className="text-[10px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          {copiedText === 'id' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedText === 'id' ? 'Copied' : 'Copy ID'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Registered Name / Supporter Name */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Name / पहिचान
                    </span>
                    <span className="font-bold text-xs text-slate-900 mt-1 block">
                      {selectedNotification.metadata?.name || selectedNotification.title}
                    </span>
                  </div>

                  {/* Ward / Location */}
                  {selectedNotification.metadata?.ward && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Ward &amp; Settlement (स्थान / वडा)
                      </span>
                      <span className="font-bold text-xs text-slate-900 mt-1 block flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span>
                          {selectedNotification.metadata.ward}
                          {selectedNotification.metadata.municipality ? `, ${selectedNotification.metadata.municipality}` : ''}
                          {selectedNotification.metadata.district ? `, ${selectedNotification.metadata.district}` : ''}
                        </span>
                      </span>
                    </div>
                  )}

                  {/* Category / Membership Type */}
                  {selectedNotification.metadata?.category && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Category / वर्ग
                      </span>
                      <span className="font-bold text-xs text-emerald-800 mt-1 block">
                        {selectedNotification.metadata.category}
                      </span>
                    </div>
                  )}

                  {/* Email address */}
                  {selectedNotification.metadata?.email && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 sm:col-span-2">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Contact Email (इमेल ठेगाना)
                      </span>
                      <div className="flex items-center justify-between mt-1">
                        <a
                          href={`mailto:${selectedNotification.metadata.email}`}
                          className="font-mono text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span>{selectedNotification.metadata.email}</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedNotification.metadata!.email!, 'email')}
                          className="text-[10px] text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          {copiedText === 'email' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedText === 'email' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Phone number */}
                  {selectedNotification.metadata?.phone && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Contact Hotline (फोन)
                      </span>
                      <a
                        href={`tel:${selectedNotification.metadata.phone}`}
                        className="font-mono font-bold text-xs text-emerald-700 hover:underline mt-1 flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{selectedNotification.metadata.phone}</span>
                      </a>
                    </div>
                  )}

                  {/* Total Follower count */}
                  {selectedNotification.metadata?.followerCount && (
                    <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200">
                      <span className="text-[10px] uppercase font-bold text-rose-800 block">
                        Total Followers Milestone
                      </span>
                      <span className="font-bold text-xs text-rose-900 mt-1 block">
                        {selectedNotification.metadata.followerCount.toLocaleString()} Community Supporters
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    deleteNotification(selectedNotification.id);
                    setSelectedNotification(null);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition flex items-center gap-1.5 cursor-pointer"
                  title="Delete this notification"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const fullText = `${selectedNotification.title}\n${selectedNotification.message}\nDate: ${formatTimestamp(selectedNotification.timestamp)}`;
                    handleCopy(fullText, 'full');
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedText === 'full' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText === 'full' ? 'Details Copied!' : 'Copy All'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {selectedNotification.type === 'join' && onNavigateSubTab && (
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateSubTab('members');
                      setSelectedNotification(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Open Member Directory</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedNotification(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
                >
                  Close (बन्द)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
