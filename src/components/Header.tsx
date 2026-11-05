/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCommunityData } from '../context/CommunityDataContext';
import { useLanguage } from '../context/LanguageContext';
import { TabType, LeaderProfile } from '../types';
import { DEFAULT_LOGO_URL } from '../data/communityData';
import InteractiveFollowModal from './InteractiveFollowModal';
import GlobalSearchBar from './GlobalSearchBar';
import NotificationCenterDropdown from './NotificationCenterDropdown';
import LanguageSwitcher from './LanguageSwitcher';
import {
  Menu,
  X,
  ChevronDown,
  UserCheck,
  Shield,
  Heart,
  CheckCircle,
  IdCard,
  Bell,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  openCustomizer?: () => void;
  onSelectLeader?: (leader: LeaderProfile) => void;
}

export default function Header({ currentTab, setCurrentTab, openCustomizer, onSelectLeader }: HeaderProps) {
  const { headerLogo } = useTheme();
  const { t, isNepali } = useLanguage();
  const {
    hasJoinedCommunity,
    hideJoinOption,
    isFollowingCommunity,
    followerCount,
    followerEmail,
    followCommunity,
    notifications,
    unreadNotificationsCount
  } = useCommunityData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cultureDropdownOpen, setCultureDropdownOpen] = useState(false);
  const [followAlert, setFollowAlert] = useState<string | null>(null);
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleFollowClick = () => {
    if (isFollowingCommunity) {
      setFollowAlert(`You are already officially following Bote Youth Community Nepal${followerEmail ? ` (${followerEmail})` : ''}. Duplicate follows are prevented.`);
      setTimeout(() => setFollowAlert(null), 3500);
      return;
    }
    setIsFollowModalOpen(true);
  };

  const handleTabClick = (tab: TabType) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    setCultureDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b-4 border-red-600 shadow-sm font-sans">
      {/* 🇳🇵 Top Ribbon - Authentic Nepali Flag Red & Blue Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-red-600 text-white text-[11px] font-semibold py-1.5 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2 shadow-inner">
        <div className="flex items-center space-x-2">
          <span className="inline-block animate-pulse">🇳🇵</span>
          <span className="font-bold tracking-wide">{t('brand.org_full')}</span>
          <span className="hidden md:inline text-amber-300 font-normal">| {t('brand.location')}</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="hidden sm:inline text-white/90 text-[10.5px]">
            {t('brand.ribbon_heritage')}
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Brand Logo & Name */}
          <div
            onClick={() => handleTabClick('home')}
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer select-none group shrink-0 min-w-0 max-w-[50%] sm:max-w-none"
            id="header-brand-logo"
          >
            <div className="relative shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-blue-800 flex items-center justify-center rounded-full text-white font-bold text-xs shadow-sm overflow-hidden border-2 border-white ring-2 ring-blue-800/20">
                {headerLogo && headerLogo.trim() ? (
                  <img
                    src={headerLogo.trim()}
                    alt="Bote Youth Logo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== DEFAULT_LOGO_URL) {
                        target.src = DEFAULT_LOGO_URL;
                      }
                    }}
                  />
                ) : (
                  <span>BYS</span>
                )}
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-xs sm:text-base lg:text-lg xl:text-xl font-black tracking-tight text-blue-900 uppercase truncate leading-tight">
                  {t('brand.title')}
                </h1>
              </div>
              <p className="hidden md:block text-[11px] lg:text-xs font-semibold text-slate-500 truncate">
                {t('brand.tagline')}
              </p>
            </div>
          </div>

          {/* Desktop Nav Items (xl: >=1280px) */}
          <nav className="hidden xl:flex items-center gap-3.5 2xl:gap-5 text-xs font-bold uppercase tracking-wider text-slate-600">
            <button
              onClick={() => handleTabClick('home')}
              className={`transition-colors py-1 ${
                currentTab === 'home'
                  ? 'text-red-600 border-b-2 border-red-600 pb-1 font-extrabold'
                  : 'hover:text-red-600'
              }`}
            >
              {t('nav.home')}
            </button>

            <button
              onClick={() => handleTabClick('about')}
              className={`transition-colors py-1 ${
                currentTab === 'about'
                  ? 'text-red-600 border-b-2 border-red-600 pb-1 font-extrabold'
                  : 'hover:text-red-600'
              }`}
            >
              {t('nav.about')}
            </button>

            <button
              onClick={() => handleTabClick('history')}
              className={`transition-colors py-1 ${
                currentTab === 'history'
                  ? 'text-red-600 border-b-2 border-red-600 pb-1 font-extrabold'
                  : 'hover:text-red-600'
              }`}
            >
              {t('nav.history')}
            </button>

            {/* Cultures & Traditions Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCultureDropdownOpen(!cultureDropdownOpen)}
                className={`flex items-center gap-1 transition-colors py-1 ${
                  ['cultures', 'language', 'dress'].includes(currentTab)
                    ? 'text-red-600 border-b-2 border-red-600 pb-1 font-extrabold'
                    : 'hover:text-red-600'
                }`}
              >
                <span>{t('nav.traditions')}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {cultureDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 normal-case tracking-normal">
                  <button
                    onClick={() => handleTabClick('cultures')}
                    className="w-full text-left px-4 py-2.5 hover:bg-red-50 hover:text-red-600 text-xs font-bold text-slate-800 transition-colors"
                  >
                    {t('nav.cultures')}
                  </button>
                  <button
                    onClick={() => handleTabClick('language')}
                    className="w-full text-left px-4 py-2.5 hover:bg-red-50 hover:text-red-600 text-xs font-bold text-slate-800 transition-colors"
                  >
                    {t('nav.language')}
                  </button>
                  <button
                    onClick={() => handleTabClick('dress')}
                    className="w-full text-left px-4 py-2.5 hover:bg-red-50 hover:text-red-600 text-xs font-bold text-slate-800 transition-colors"
                  >
                    {t('nav.dress')}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleTabClick('leaders')}
              className={`transition-colors py-1 ${
                currentTab === 'leaders'
                  ? 'text-red-600 border-b-2 border-red-600 pb-1 font-extrabold'
                  : 'hover:text-red-600'
              }`}
            >
              {t('nav.leaders')}
            </button>

            <button
              onClick={() => handleTabClick('empower')}
              className={`transition-colors py-1 ${
                currentTab === 'empower'
                  ? 'text-red-600 border-b-2 border-red-600 pb-1 font-extrabold'
                  : 'hover:text-red-600'
              }`}
            >
              {t('nav.programs')}
            </button>

            <button
              onClick={() => handleTabClick('scholarships')}
              className={`transition-colors py-1 ${
                currentTab === 'scholarships'
                  ? 'text-red-600 border-b-2 border-red-600 pb-1 font-extrabold'
                  : 'hover:text-red-600'
              }`}
            >
              {t('nav.scholarships')}
            </button>

            <button
              onClick={() => handleTabClick('notices')}
              className={`transition-colors py-1 flex items-center gap-1 ${
                currentTab === 'notices'
                  ? 'text-red-600 border-b-2 border-red-600 pb-1 font-extrabold'
                  : 'hover:text-red-600'
              }`}
            >
              <Bell className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('nav.notices')}</span>
            </button>

            <button
              onClick={() => handleTabClick('follow')}
              className={`transition-colors py-1 ${
                currentTab === 'follow'
                  ? 'text-red-600 border-b-2 border-red-600 pb-1 font-extrabold'
                  : 'hover:text-red-600'
              }`}
            >
              {t('nav.community')}
            </button>
          </nav>

          {/* Desktop Quick Action Buttons (lg: >=1024px) */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 shrink-0">
            {/* Dedicated Language Switcher Component (Desktop) */}
            <LanguageSwitcher variant="compact" />

            {/* Global Search Bar (Desktop) */}
            <GlobalSearchBar
              setCurrentTab={handleTabClick}
              onSelectLeader={onSelectLeader}
              variant="header"
            />

            {/* Notification Center Dropdown (Desktop) */}
            <div className="relative">
              <button
                type="button"
                id="header-notification-bell"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className={`relative p-2.5 rounded-full transition flex items-center justify-center cursor-pointer ${
                  isNotificationOpen
                    ? 'bg-red-50 text-red-600 ring-2 ring-red-500/30'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                title="Community updates & notifications (follows, new members, notices)"
              >
                <Bell className="w-4 h-4 text-slate-800" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white font-black text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </span>
                )}
              </button>

              <NotificationCenterDropdown
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                onNavigateTab={(tab) => handleTabClick(tab)}
              />
            </div>

            {/* One-Time Following Option */}
            <button
              type="button"
              onClick={handleFollowClick}
              disabled={isFollowingCommunity}
              className={`px-3 xl:px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition shadow-xs flex items-center gap-1.5 ${
                isFollowingCommunity
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-default'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 cursor-pointer hover:scale-105 active:scale-95'
              }`}
              title={
                isFollowingCommunity
                  ? `Following active with ${followerEmail || 'verified Gmail'}`
                  : 'Click for one-time follow with Gmail to receive community alerts'
              }
            >
              {isFollowingCommunity ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{t('action.following')} ({followerCount})</span>
                </>
              ) : (
                <>
                  <Heart className="w-3.5 h-3.5 text-red-600 fill-red-500 shrink-0" />
                  <span>{t('action.follow')} ({followerCount})</span>
                </>
              )}
            </button>

            {/* Conditional Join Option: If registered or followed with Gmail, hide Join option */}
            {hideJoinOption ? (
              hasJoinedCommunity ? (
                <button
                  onClick={() => handleTabClick('join')}
                  className="bg-blue-50 hover:bg-blue-100 text-[#003893] border border-blue-200 px-3.5 xl:px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                  title="Your membership is active. Click to view or print your digital ID card."
                >
                  <IdCard className="w-3.5 h-3.5 text-[#003893]" />
                  <span>{t('action.my_id')}</span>
                </button>
              ) : (
                <button
                  onClick={() => handleTabClick('follow')}
                  className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 xl:px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                  title="One-time follow active with Gmail. Registered community supporter."
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('action.verified_member')}</span>
                </button>
              )
            ) : (
              <button
                onClick={() => handleTabClick('join')}
                className="bg-red-600 text-white px-4 xl:px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{t('action.join')}</span>
              </button>
            )}

            {/* In-between Breakpoint (lg to xl): Hamburger Menu to access navigation tabs */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden text-slate-700 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition focus:outline-none ml-1"
              title="Navigation Menu"
              aria-label="Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile & Tablet Top Bar Controls (< 1024px) */}
          <div className="flex lg:hidden items-center space-x-1 sm:space-x-2 shrink-0">
            {/* Quick Language Switcher (Header) */}
            <LanguageSwitcher variant="compact" id="mobile-single-language-translate-toggle" />

            {/* Quick Search Button */}
            <GlobalSearchBar
              setCurrentTab={handleTabClick}
              onSelectLeader={onSelectLeader}
              variant="button-only"
            />

            {/* Mobile Notification Bell */}
            <div className="relative">
              <button
                type="button"
                id="mobile-notification-bell"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className={`relative p-2 rounded-full flex items-center justify-center transition cursor-pointer ${
                  isNotificationOpen
                    ? 'bg-red-50 text-red-600 ring-2 ring-red-400'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse ring-2 ring-white">
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </span>
                )}
              </button>

              <NotificationCenterDropdown
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                onNavigateTab={(tab) => handleTabClick(tab)}
              />
            </div>

            {/* Three-line Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-700 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 sm:w-7 sm:h-7" /> : <Menu className="w-6 h-6 sm:w-7 sm:h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Quick Action Strip (< 1024px) - Clean, accessible Following and Join buttons */}
      <div className="lg:hidden border-t border-slate-200/80 bg-slate-50/95 px-3 py-1.5 flex items-center justify-between gap-2 shadow-2xs">
        {/* Quick One-Time Following Button */}
        <button
          type="button"
          onClick={handleFollowClick}
          disabled={isFollowingCommunity}
          className={`flex-1 min-w-0 py-1.5 px-3 rounded-full text-[11px] font-bold uppercase tracking-wider transition shadow-2xs flex items-center justify-center gap-1.5 truncate cursor-pointer ${
            isFollowingCommunity
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 active:scale-98'
          }`}
          title={
            isFollowingCommunity
              ? `Following active with ${followerEmail || 'verified Gmail'}`
              : 'Click for one-time follow with Gmail to receive community alerts'
          }
        >
          {isFollowingCommunity ? (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{t('action.following')} ({followerCount})</span>
            </>
          ) : (
            <>
              <Heart className="w-3.5 h-3.5 text-red-600 fill-red-500 shrink-0" />
              <span className="truncate">{t('action.follow')} ({followerCount})</span>
            </>
          )}
        </button>

        {/* Quick Join Us / My ID Button */}
        {hideJoinOption ? (
          hasJoinedCommunity ? (
            <button
              onClick={() => handleTabClick('join')}
              className="flex-1 min-w-0 py-1.5 px-3 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 hover:bg-blue-100 text-[#003893] border border-blue-200 flex items-center justify-center gap-1.5 truncate cursor-pointer shadow-2xs"
            >
              <IdCard className="w-3.5 h-3.5 text-[#003893] shrink-0" />
              <span className="truncate">{t('action.my_id')}</span>
            </button>
          ) : (
            <button
              onClick={() => handleTabClick('follow')}
              className="flex-1 min-w-0 py-1.5 px-3 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center justify-center gap-1.5 truncate cursor-pointer shadow-2xs"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{t('action.verified_member')}</span>
            </button>
          )
        ) : (
          <button
            onClick={() => handleTabClick('join')}
            className="flex-1 min-w-0 py-1.5 px-3 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#DC143C] hover:bg-red-700 text-white shadow-xs flex items-center justify-center gap-1.5 active:scale-98 truncate cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{t('action.join')}</span>
          </button>
        )}
      </div>

      {/* Follow Feedback Toast Banner */}
      {followAlert && (
        <div className="bg-emerald-600 text-white text-xs py-2 px-4 text-center font-bold flex items-center justify-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 text-white shrink-0" />
          <span>{followAlert}</span>
        </div>
      )}

      {/* Interactive Follow Modal with One-Time Gmail Logic */}
      <InteractiveFollowModal
        isOpen={isFollowModalOpen}
        onClose={() => setIsFollowModalOpen(false)}
      />

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          {/* Mobile Drawer Embedded Global Search */}
          <div className="pb-1.5 pt-1">
            <GlobalSearchBar
              setCurrentTab={handleTabClick}
              onSelectLeader={onSelectLeader}
              variant="mobile"
              onCloseMobileMenu={() => setMobileMenuOpen(false)}
            />
          </div>

          <button
            onClick={() => handleTabClick('home')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100"
          >
            {t('nav.home')}
          </button>
          <button
            onClick={() => handleTabClick('about')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100"
          >
            {t('nav.about')}
          </button>
          <button
            onClick={() => handleTabClick('history')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100"
          >
            {t('nav.history')}
          </button>
          <button
            onClick={() => handleTabClick('cultures')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100"
          >
            {t('nav.cultures')}
          </button>
          <button
            onClick={() => handleTabClick('language')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100"
          >
            {t('nav.language')}
          </button>
          <button
            onClick={() => handleTabClick('dress')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100"
          >
            {t('nav.dress')}
          </button>
          <button
            onClick={() => handleTabClick('leaders')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100"
          >
            {t('nav.leaders')}
          </button>
          <button
            onClick={() => handleTabClick('empower')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100"
          >
            {t('nav.programs')}
          </button>
          <button
            onClick={() => handleTabClick('scholarships')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100"
          >
            {t('nav.scholarships')}
          </button>
          <button
            onClick={() => handleTabClick('notices')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between"
          >
            <span>{t('nav.notices')}</span>
            <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-black">Updates</span>
          </button>
          <button
            onClick={() => handleTabClick('follow')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100"
          >
            {t('nav.community')}
          </button>
          <button
            onClick={() => {
              setIsNotificationOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-red-500" />
              <span>{t('action.notifications')}</span>
            </div>
            {unreadNotificationsCount > 0 ? (
              <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                {unreadNotificationsCount} new
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-semibold">{notifications.length}</span>
            )}
          </button>

          <div className="pt-2">
            {hideJoinOption ? (
              hasJoinedCommunity ? (
                <button
                  onClick={() => handleTabClick('join')}
                  className="w-full bg-blue-50 border border-blue-200 text-[#003893] py-3 rounded-xl text-xs font-bold shadow text-center flex items-center justify-center gap-2"
                >
                  <IdCard className="w-4 h-4 text-[#003893]" />
                  <span>{t('action.view_id')}</span>
                </button>
              ) : (
                <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-800 py-3 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>✓ {t('action.verified_follower')}</span>
                </div>
              )
            ) : (
              <button
                onClick={() => handleTabClick('join')}
                className="w-full bg-[#DC143C] text-white py-3 rounded-xl text-xs font-bold shadow text-center block"
              >
                {t('action.join_get_id')}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
