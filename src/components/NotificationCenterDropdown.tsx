/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useCommunityData } from '../context/CommunityDataContext';
import { TabType, CommunityNotification, NotificationType } from '../types';
import {
  Bell,
  CheckCheck,
  Trash2,
  UserCheck,
  Heart,
  FileText,
  Sparkles,
  Clock,
  Eye,
  EyeOff,
  X,
  Copy,
  Check,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Users,
  Calendar,
  Tag,
  Share2,
  ChevronDown,
  ChevronUp,
  Maximize2
} from 'lucide-react';

interface NotificationCenterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabType) => void;
}

export default function NotificationCenterDropdown({
  isOpen,
  onClose,
  onNavigateTab
}: NotificationCenterDropdownProps) {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    followerCount
  } = useCommunityData();

  const [activeFilter, setActiveFilter] = useState<'all' | 'join' | 'follow' | 'notice'>('all');
  const [selectedNotification, setSelectedNotification] = useState<CommunityNotification | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click (only if not viewing modal)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectedNotification) return; // keep open while viewing modal
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (target?.closest?.('#header-notification-bell') || target?.closest?.('#mobile-notification-bell')) {
          return;
        }
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, selectedNotification]);

  // Keyboard shortcut: Escape closes modal or dropdown
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (selectedNotification) {
          setSelectedNotification(null);
        } else if (isOpen) {
          onClose();
        }
      }
    }
    if (isOpen || selectedNotification) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, selectedNotification, onClose]);

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'join') return item.type === 'join';
    if (activeFilter === 'follow') return item.type === 'follow';
    if (activeFilter === 'notice') return item.type === 'notice' || item.type === 'update' || item.type === 'system';
    return true;
  });

  const joinsCount = notifications.filter((n) => n.type === 'join').length;
  const followsCount = notifications.filter((n) => n.type === 'follow').length;
  const noticesCount = notifications.filter((n) => n.type === 'notice' || n.type === 'update' || n.type === 'system').length;

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

  const formatFullTimestamp = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString('ne-NP', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return iso;
    }
  };

  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case 'join':
        return <UserCheck className="w-4 h-4 text-emerald-600" />;
      case 'follow':
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      case 'notice':
        return <FileText className="w-4 h-4 text-amber-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-blue-500" />;
    }
  };

  const getBadgeForType = (type: NotificationType) => {
    switch (type) {
      case 'join':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          label: 'New सदस्य (Join)'
        };
      case 'follow':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          label: 'Follower (अनुयायी)'
        };
      case 'notice':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          label: 'सूचना (Notice)'
        };
      default:
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          label: 'Update'
        };
    }
  };

  const toggleExpand = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        // Mark as read when reading full details
        const notif = notifications.find((n) => n.id === id);
        if (notif && !notif.read) {
          markNotificationAsRead(id);
        }
      }
      return next;
    });
  };

  const areAllFilteredExpanded =
    filteredNotifications.length > 0 &&
    filteredNotifications.every((item) => expandedIds.has(item.id));

  const toggleExpandAll = () => {
    if (areAllFilteredExpanded) {
      // Collapse all
      setExpandedIds(new Set());
    } else {
      // Expand all and mark all visible as read
      const next = new Set(expandedIds);
      filteredNotifications.forEach((item) => {
        next.add(item.id);
        if (!item.read) markNotificationAsRead(item.id);
      });
      setExpandedIds(next);
    }
  };

  const handleOpenModal = (notif: CommunityNotification, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!notif.read) {
      markNotificationAsRead(notif.id);
    }
    setSelectedNotification(notif);
  };

  const handleCopy = (text: string, label: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2500);
    }
  };

  return (
    <>
      <div
        ref={dropdownRef}
        id="notification-center-dropdown"
        className="absolute right-0 top-full mt-2 w-[360px] sm:w-[460px] max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 text-slate-900 animate-in fade-in slide-in-from-top-2 duration-150"
      >
        {/* Header bar matching exact user title: समुदाय Updates / सदस्य दर्ता तथा अनुयायी सूचनाहरू */}
        <div className="bg-slate-900 text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h3 className="text-sm font-bold tracking-tight">समुदाय Updates</h3>
                <span className="text-[10px] text-slate-400 font-medium">(Community Updates)</span>
                {unreadNotificationsCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                    {unreadNotificationsCount} new
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">सदस्य दर्ता तथा अनुयायी सूचनाहरू</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Close notification dropdown"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Tabs & Quick Action Bar */}
        <div className="flex flex-col border-b border-slate-200 bg-slate-50">
          {/* Tabs */}
          <div className="flex items-center px-3 pt-2 pb-1 overflow-x-auto gap-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('join')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap flex items-center gap-1 transition cursor-pointer ${
                activeFilter === 'join'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <UserCheck className="w-3 h-3" />
              <span>Joins ({joinsCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('follow')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap flex items-center gap-1 transition cursor-pointer ${
                activeFilter === 'follow'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Heart className="w-3 h-3" />
              <span>अनुयायीहरू ({followsCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('notice')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition cursor-pointer ${
                activeFilter === 'notice'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              सूचनाहरू ({noticesCount})
            </button>
          </div>

          {/* Controls: "Expand all details" & "Read all" */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100/70 border-t border-slate-200/60 text-[11px]">
            <button
              type="button"
              onClick={toggleExpandAll}
              className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 py-0.5 px-1.5 rounded hover:bg-blue-50 transition cursor-pointer"
              title={areAllFilteredExpanded ? 'सबै संकुचन गर्नुहोस् (Collapse all details)' : 'सबै पूरा विवरण हेर्नुहोस् (Expand all full details)'}
            >
              {areAllFilteredExpanded ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-blue-600" />
                  <span>Collapse all details (सबै संकुचन)</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span>Expand all details (सबै पूरा विवरण)</span>
                </>
              )}
            </button>

            {unreadNotificationsCount > 0 && (
              <button
                type="button"
                onClick={() => markAllNotificationsAsRead()}
                className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 py-0.5 px-1.5 rounded hover:bg-emerald-50 transition cursor-pointer"
                title="सबैलाई पढिएको चिन्ह लगाउनुहोस् (Mark all as read)"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Read all (सबै पढियो)</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications List Container */}
        <div className="max-h-[68vh] sm:max-h-[500px] overflow-y-auto divide-y divide-slate-100">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400 mb-2">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-slate-700">No updates in this filter</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                नयाँ सदस्यता दर्ता तथा अनुयायी सूचनाहरू यहाँ प्रत्यक्ष देखिनेछन्।
              </p>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const badge = getBadgeForType(item.type);
              const isExpanded = expandedIds.has(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => toggleExpand(item.id)}
                  className={`p-3.5 sm:p-4 text-left transition relative group cursor-pointer border-l-4 ${
                    !item.read
                      ? 'border-blue-500 bg-blue-50/40 hover:bg-blue-50/70'
                      : isExpanded
                      ? 'border-slate-400 bg-slate-50/80 hover:bg-slate-50'
                      : 'border-transparent bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {/* Icon */}
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 mt-0.5 border border-slate-200 shadow-2xs">
                      {getIconForType(item.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Top Header: Badge, Time, and Unread Dot */}
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${badge.bg}`}
                          >
                            {badge.label}
                          </span>
                          {!item.read && (
                            <span className="bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                              New
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-[10.5px] text-slate-400 space-x-1 shrink-0 font-mono">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{formatRelativeTime(item.timestamp)}</span>
                        </div>
                      </div>

                      {/* Title: Unclamped if expanded, 1-line clamp if collapsed */}
                      <h4
                        className={`text-xs sm:text-[13px] leading-snug font-poppins ${
                          isExpanded
                            ? 'text-slate-900 font-extrabold'
                            : item.read
                            ? 'text-slate-700 font-semibold line-clamp-1'
                            : 'text-slate-900 font-bold line-clamp-1'
                        }`}
                      >
                        {item.title}
                      </h4>
                      {item.titleNepali && (
                        <p
                          className={`text-[11px] text-slate-500 font-nepali ${
                            isExpanded ? 'block mt-0.5' : 'line-clamp-1'
                          }`}
                        >
                          {item.titleNepali}
                        </p>
                      )}

                      {/* Message: Full uncut when expanded, 2-line snippet when collapsed */}
                      {isExpanded ? (
                        <div className="mt-2 p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-1.5">
                          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                            <FileText className="w-3 h-3 text-blue-600" />
                            <span>Full Details &amp; Message (पूर्ण व्यहोरा):</span>
                          </div>
                          <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                            {item.message}
                          </p>
                        </div>
                      ) : (
                        <p className="text-[11.5px] text-slate-600 leading-relaxed line-clamp-2 mt-1 font-medium">
                          {item.message}
                        </p>
                      )}

                      {/* Metadata Details (Inline view) */}
                      {item.metadata && (
                        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                          {item.metadata.membershipId && (
                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-mono font-bold border border-slate-200">
                              <span>ID: {item.metadata.membershipId}</span>
                              <button
                                type="button"
                                onClick={(e) => handleCopy(item.metadata!.membershipId!, `id-${item.id}`, e)}
                                className="text-blue-600 hover:text-blue-800 p-0.5 ml-0.5 cursor-pointer"
                                title="Copy ID"
                              >
                                {copiedText === `id-${item.id}` ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </span>
                          )}

                          {item.metadata.ward && (
                            <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                              <MapPin className="w-3 h-3 text-red-500" />
                              <span>{item.metadata.ward}</span>
                              {item.metadata.municipality && (
                                <span>, {item.metadata.municipality}</span>
                              )}
                            </span>
                          )}

                          {item.metadata.category && (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-medium border border-emerald-200">
                              <Tag className="w-3 h-3 text-emerald-600" />
                              <span>{item.metadata.category}</span>
                            </span>
                          )}

                          {item.metadata.followerCount && (
                            <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md font-bold border border-rose-200">
                              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                              <span>Followers: {item.metadata.followerCount}</span>
                            </span>
                          )}
                        </div>
                      )}

                      {/* Extended parameters when expanded inline */}
                      {isExpanded && (
                        <div className="mt-2.5 pt-2.5 border-t border-slate-200 space-y-2 text-xs">
                          {/* Contact Email & Phone */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {item.metadata?.email && (
                              <div className="p-2 bg-blue-50/50 rounded-lg border border-blue-100 flex items-center justify-between gap-1">
                                <a
                                  href={`mailto:${item.metadata.email}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-blue-700 hover:underline flex items-center gap-1.5 font-mono text-[11px] truncate"
                                >
                                  <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                  <span className="truncate">{item.metadata.email}</span>
                                </a>
                                <button
                                  type="button"
                                  onClick={(e) => handleCopy(item.metadata!.email!, `email-${item.id}`, e)}
                                  className="text-[10px] text-blue-600 hover:text-blue-800 font-bold shrink-0 p-1 cursor-pointer"
                                  title="Copy Email"
                                >
                                  {copiedText === `email-${item.id}` ? 'Copied' : <Copy className="w-3 h-3" />}
                                </button>
                              </div>
                            )}

                            {item.metadata?.phone && (
                              <div className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-100 flex items-center justify-between gap-1">
                                <a
                                  href={`tel:${item.metadata.phone}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-emerald-700 hover:underline flex items-center gap-1.5 font-mono text-[11px] truncate font-bold"
                                >
                                  <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                  <span>{item.metadata.phone}</span>
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Full Exact Timestamp */}
                          <div className="text-[10.5px] text-slate-500 flex items-center gap-1.5 font-mono bg-slate-50 p-2 rounded-lg border border-slate-200/70">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span className="font-bold text-slate-700">दर्ता मिति / Time:</span>
                            <span>{formatFullTimestamp(item.timestamp)}</span>
                          </div>

                          {/* Action Buttons inside Expanded Item */}
                          <div className="pt-1 flex flex-wrap items-center gap-1.5">
                            {item.type === 'join' && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNavigateTab('admin');
                                  onClose();
                                }}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                              >
                                <Users className="w-3 h-3" />
                                <span>Open Member Directory</span>
                              </button>
                            )}

                            {item.type === 'follow' && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNavigateTab('follow');
                                  onClose();
                                }}
                                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                              >
                                <Heart className="w-3 h-3" />
                                <span>View Follow Page</span>
                              </button>
                            )}

                            {item.type === 'notice' && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNavigateTab('notices');
                                  onClose();
                                }}
                                className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                              >
                                <FileText className="w-3 h-3" />
                                <span>Open Notice Board</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={(e) => {
                                const full = `${item.title}\n${item.message}\nDate: ${formatFullTimestamp(item.timestamp)}`;
                                handleCopy(full, `full-${item.id}`, e);
                              }}
                              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                            >
                              {copiedText === `full-${item.id}` ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy All</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleOpenModal(item, e)}
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-semibold flex items-center gap-1 transition ml-auto cursor-pointer"
                              title="Open dedicated large popup dialog"
                            >
                              <Maximize2 className="w-3 h-3" />
                              <span>Popout (पपअप)</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Footer Control: "Read full details" / "Hide details" toggle */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={(e) => toggleExpand(item.id, e)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition shadow-2xs cursor-pointer ${
                            isExpanded
                              ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300'
                              : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                          }`}
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-3.5 h-3.5 text-slate-600" />
                              <span>Hide details (विवरण बन्द)</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5 text-blue-600" />
                              <span>Read full details (पूरा विवरण)</span>
                              <ChevronDown className="w-3 h-3 text-blue-500" />
                            </>
                          )}
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => handleOpenModal(item, e)}
                            className="text-[10.5px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-0.5 cursor-pointer"
                            title="Open in modal dialog"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Dialog</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(item.id);
                            }}
                            className="text-slate-400 hover:text-red-600 p-1 transition cursor-pointer"
                            title="Delete this notification"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

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
                  {getIconForType(selectedNotification.type)}
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
                  <span>{formatFullTimestamp(selectedNotification.timestamp)}</span>
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
                    const fullText = `${selectedNotification.title}\n${selectedNotification.message}\nDate: ${formatFullTimestamp(selectedNotification.timestamp)}`;
                    handleCopy(fullText, 'full');
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedText === 'full' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText === 'full' ? 'Details Copied!' : 'Copy All'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {selectedNotification.type === 'join' && (
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateTab('admin');
                      onClose();
                      setSelectedNotification(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Open Member Directory</span>
                  </button>
                )}

                {selectedNotification.type === 'notice' && (
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateTab('notices');
                      onClose();
                      setSelectedNotification(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View in Notice Board</span>
                  </button>
                )}

                {selectedNotification.type === 'follow' && (
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateTab('follow');
                      onClose();
                      setSelectedNotification(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>View Follow Page</span>
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
    </>
  );
}
