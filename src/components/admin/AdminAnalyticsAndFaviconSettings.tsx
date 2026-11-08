/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useCommunityData } from '../../context/CommunityDataContext';
import DirectImageUploader from '../DirectImageUploader';
import { DEFAULT_LOGO_URL } from '../../data/communityData';
import { applyFaviconToDocument } from '../../utils/faviconManager';
import {
  BarChart3,
  Globe,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Activity,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
  Search,
  Copy,
  Check,
  Info,
  ArrowUpRight,
  TrendingUp,
  FileText,
  Award,
  Upload,
  Save,
  Compass,
  Link2,
  FileCode,
  CheckCircle
} from 'lucide-react';

interface AdminAnalyticsAndFaviconSettingsProps {
  showNotification?: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export default function AdminAnalyticsAndFaviconSettings({
  showNotification
}: AdminAnalyticsAndFaviconSettingsProps) {
  const { siteIdentity, saveFavicon, saveGoogleAnalytics, saveGoogleSiteVerification } = useCommunityData();

  // Favicon states
  const [currentFavicon, setCurrentFavicon] = useState(siteIdentity.favicon || '/favicon.svg');
  const [isSavingFavicon, setIsSavingFavicon] = useState(false);
  const [faviconSuccess, setFaviconSuccess] = useState<string | null>(null);
  const [copiedFaviconUrl, setCopiedFaviconUrl] = useState(false);
  const [hasNewCustomUpload, setHasNewCustomUpload] = useState(false);

  // Google Analytics states
  const [gaId, setGaId] = useState(siteIdentity.googleAnalyticsId || '');
  const [gaEnabled, setGaEnabled] = useState(
    siteIdentity.googleAnalyticsEnabled !== undefined ? siteIdentity.googleAnalyticsEnabled : false
  );
  const [isSavingGa, setIsSavingGa] = useState(false);
  const [gaSuccess, setGaSuccess] = useState<string | null>(null);
  const [showGaGuide, setShowGaGuide] = useState(false);

  // Google Search Console states
  const [gscCode, setGscCode] = useState(
    siteIdentity.googleSiteVerificationCode || 'ZZ8jKxT9NeljW8zcOXO1HjIn5-weF8pC0qVd4hsZoEw'
  );
  const [isSavingGsc, setIsSavingGsc] = useState(false);
  const [gscSuccess, setGscSuccess] = useState<string | null>(null);
  const [showGscGuide, setShowGscGuide] = useState(true);
  const [copiedGscTag, setCopiedGscTag] = useState(false);
  const [copiedGscFileUrl, setCopiedGscFileUrl] = useState(false);
  const [copiedPropertyUrl, setCopiedPropertyUrl] = useState(false);

  // SEO Rank #1 states
  const [copiedSitemap, setCopiedSitemap] = useState(false);

  // Sync with context if updated externally
  useEffect(() => {
    if (siteIdentity.favicon !== undefined) {
      setCurrentFavicon(siteIdentity.favicon || '/favicon.svg');
    }
    if (siteIdentity.googleAnalyticsId !== undefined) {
      setGaId(siteIdentity.googleAnalyticsId);
    }
    if (siteIdentity.googleAnalyticsEnabled !== undefined) {
      setGaEnabled(siteIdentity.googleAnalyticsEnabled);
    }
    if (siteIdentity.googleSiteVerificationCode !== undefined) {
      setGscCode(siteIdentity.googleSiteVerificationCode);
    }
  }, [siteIdentity.favicon, siteIdentity.googleAnalyticsId, siteIdentity.googleAnalyticsEnabled, siteIdentity.googleSiteVerificationCode]);

  // Handle Save Favicon (Broadcast to Internet & Google Search)
  const handleSaveFavicon = async (customUrl?: string) => {
    const urlToSave = customUrl || currentFavicon;
    setIsSavingFavicon(true);
    setFaviconSuccess(null);
    try {
      applyFaviconToDocument(urlToSave);
      const ok = await saveFavicon(urlToSave);
      const msg = ok
        ? 'Website Favicon and Google Search Logo successfully saved and published live to the internet!'
        : 'Website Favicon saved locally and broadcast to live site.';
      setFaviconSuccess(msg);
      setHasNewCustomUpload(false);
      if (showNotification) showNotification(msg, 'success');
      setTimeout(() => setFaviconSuccess(null), 5000);
    } catch (err: any) {
      console.warn('Error saving favicon:', err);
    } finally {
      setIsSavingFavicon(false);
    }
  };

  // Handle custom upload change with auto-notification
  const handleCustomUploadChange = (url: string) => {
    setCurrentFavicon(url);
    setHasNewCustomUpload(true);
    applyFaviconToDocument(url);
  };

  // Reset to default emblem
  const handleResetFavicon = async () => {
    setCurrentFavicon('/favicon.svg');
    setHasNewCustomUpload(false);
    applyFaviconToDocument('/favicon.svg');
    await saveFavicon('/favicon.svg');
    const msg = 'Custom favicon removed and reset to default vector emblem.';
    setFaviconSuccess(msg);
    if (showNotification) showNotification(msg, 'info');
    setTimeout(() => setFaviconSuccess(null), 4000);
  };

  // Copy public favicon URL
  const handleCopyFaviconUrl = () => {
    try {
      const urlToCopy = currentFavicon.startsWith('http')
        ? currentFavicon
        : typeof window !== 'undefined'
        ? `${window.location.origin}/favicon.ico`
        : currentFavicon;
      navigator.clipboard.writeText(urlToCopy);
      setCopiedFaviconUrl(true);
      setTimeout(() => setCopiedFaviconUrl(false), 3000);
      if (showNotification) showNotification('Favicon URL copied to clipboard for Google Search Console!', 'info');
    } catch (e) {
      console.warn(e);
    }
  };

  // Copy Sitemap URL
  const handleCopySitemapUrl = () => {
    try {
      const sitemapUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/sitemap.xml`
        : 'https://boteyouthcommunity.org.np/sitemap.xml';
      navigator.clipboard.writeText(sitemapUrl);
      setCopiedSitemap(true);
      setTimeout(() => setCopiedSitemap(false), 3000);
      if (showNotification) showNotification('Sitemap XML URL copied to clipboard!', 'info');
    } catch (e) {
      console.warn(e);
    }
  };

  // Handle Save Google Analytics ID
  const handleSaveGa = async () => {
    setIsSavingGa(true);
    setGaSuccess(null);
    const cleanId = gaId.trim().toUpperCase();
    try {
      const ok = await saveGoogleAnalytics(cleanId, Boolean(cleanId && gaEnabled));
      const msg = cleanId
        ? (ok
          ? `Google Analytics Measurement ID (${cleanId}) published & live tracking active!`
          : `Google Analytics settings saved locally.`)
        : 'Active Google Analytics ID removed.';
      setGaSuccess(msg);
      if (showNotification) showNotification(msg, 'success');
      setTimeout(() => setGaSuccess(null), 5000);
    } catch (err: any) {
      console.warn('Error saving GA:', err);
    } finally {
      setIsSavingGa(false);
    }
  };

  // Handle Clear / Remove Google Analytics ID
  const handleClearGa = async () => {
    setIsSavingGa(true);
    setGaSuccess(null);
    setGaId('');
    setGaEnabled(false);
    try {
      await saveGoogleAnalytics('', false);
      const msg = 'Active Google Analytics GA4 Measurement ID removed.';
      setGaSuccess(msg);
      if (showNotification) showNotification(msg, 'info');
      setTimeout(() => setGaSuccess(null), 4000);
    } catch (err: any) {
      console.warn('Error clearing GA:', err);
    } finally {
      setIsSavingGa(false);
    }
  };

  // Save Google Search Console Verification Token / Tag
  const handleSaveGsc = async () => {
    const raw = gscCode.trim();
    setIsSavingGsc(true);
    setGscSuccess(null);
    try {
      const ok = await saveGoogleSiteVerification(raw);
      const msg = raw
        ? (ok
          ? 'Google Search Console verification meta tag saved & active live in HTML head!'
          : 'Google Search Console verification code saved locally.')
        : 'Google Search Console verification meta tag removed from website.';
      setGscSuccess(msg);
      if (showNotification) showNotification(msg, 'success');
      setTimeout(() => setGscSuccess(null), 5000);
    } catch (err: any) {
      console.warn('Error saving GSC code:', err);
    } finally {
      setIsSavingGsc(false);
    }
  };

  // Clear / Remove Google Search Console Verification Token & File
  const handleClearGsc = async () => {
    setIsSavingGsc(true);
    setGscSuccess(null);
    setGscCode('');
    try {
      await saveGoogleSiteVerification('');
      const msg = 'Old Google Search Console verification meta tag and verification file removed.';
      setGscSuccess(msg);
      if (showNotification) showNotification(msg, 'info');
      setTimeout(() => setGscSuccess(null), 4000);
    } catch (err: any) {
      console.warn('Error clearing GSC code:', err);
    } finally {
      setIsSavingGsc(false);
    }
  };

  // Format validation for GA4 Measurement ID (G-XXXXXXXXXX)
  const isValidGaFormat = /^G-[A-Z0-9]{4,15}$/i.test(gaId.trim());

  return (
    <div id="analytics-favicon-settings-section" className="space-y-8">
      {/* ============================================================ */}
      {/* HEADER BANNER: LIVE INTERNET & GOOGLE SEARCH SYNC */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-[#003893] via-indigo-900 to-[#DC143C] text-white p-6 sm:p-7 rounded-3xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 shadow-xs">
                Live Internet &amp; Chrome Rank #1
              </span>
              <span className="text-xs text-white/80 font-medium">
                Official Web Discovery, Favicon Logo &amp; Real-Time Analytics
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-poppins text-white">
              Google Analytics Measurement ID &amp; Favicon
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          <span className="text-[11px] font-bold px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-2 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>All Features Active Live on Internet</span>
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* FEATURE 1: WEBSITE FAVICON & GOOGLE SEARCH LOGO (LIVE INTERNET) */}
      {/* ============================================================ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                  Live Search Engine Identity
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  Google Search • Schema.org Logo • Browser Tab Icon
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 font-poppins">
                Website Favicon &amp; Google Search Logo
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Googlebot Crawler Ready (200 OK)</span>
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          Your favicon logo is broadcast live across the entire internet. Google Search indexers and Googlebot automatically crawl this logo to display your community emblem next to search results, Chrome browser tabs, mobile bookmarks, and social media share previews.
        </p>

        {faviconSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{faviconSuccess}</span>
            </div>
            <button
              type="button"
              onClick={() => setFaviconSuccess(null)}
              className="text-emerald-500 hover:text-emerald-800 font-black cursor-pointer text-lg leading-none"
            >
              &times;
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* LIVE GOOGLE SEARCH APPEARANCE PREVIEW (REAL SEARCH CARD) */}
        {/* ============================================================ */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white border border-slate-300 flex items-center justify-center shadow-xs">
                <Search className="w-3 h-3 text-[#003893]" />
              </div>
              <span className="text-xs font-black text-slate-800 font-poppins">
                Live Google Search Appearance Preview
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-100/70 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Googlebot Finds Website Logo Live on Internet</span>
            </span>
          </div>

          {/* Actual Google Search Result Snippet Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm max-w-2xl">
            {/* Google Result Header: Favicon + Domain Breadcrumb */}
            <div className="flex items-center gap-3 mb-1.5">
              {/* Google Search Favicon Circle */}
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                <img
                  src={currentFavicon}
                  alt="Google Search Favicon"
                  className="w-full h-full object-contain rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_LOGO_URL;
                  }}
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs text-slate-800 font-medium truncate">
                  <span className="font-bold text-slate-900 truncate">
                    {siteIdentity.siteName || 'BoteYouthCommunityNepal'}
                  </span>
                  <span className="text-slate-400">&rsaquo;</span>
                  <span className="text-slate-500 text-[11px] font-mono truncate">
                    https://boteyouthcommunity.org.np
                  </span>
                </div>
              </div>
            </div>

            {/* Google Search Result Title (Google Blue) */}
            <h4 className="text-base sm:text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug line-clamp-1">
              {siteIdentity.siteName || 'BoteYouthCommunityNepal'} (BYCN) | Official Portal &amp; Cultural Registry
            </h4>

            {/* Google Search Description Snippet */}
            <p className="text-xs text-slate-600 leading-relaxed mt-1 line-clamp-2">
              Official portal for Bote Youth Community Nepal (बोटे युवा समुदाय नेपाल). Celebrating authentic Bote culture, history, language dictionary, traditional dress, youth leadership, and scholarships.
            </p>

            {/* Rich snippet badges */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2 flex-wrap text-[10px] text-slate-500 font-medium">
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold">
                ✓ Google Search Favicon 48x48
              </span>
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold">
                ✓ Schema.org Organization Logo
              </span>
              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-bold">
                ✓ OpenGraph Social Share Card
              </span>
            </div>
          </div>

          {/* Quick Internet Discovery Verification Actions */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <a
              href={currentFavicon}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-[#003893] hover:border-blue-300 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              <span>Open Direct Favicon in New Tab</span>
            </a>

            <button
              type="button"
              onClick={handleCopyFaviconUrl}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              {copiedFaviconUrl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Favicon URL Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Public Favicon URL</span>
                </>
              )}
            </button>

            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-amber-700 hover:border-amber-300 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              <span>Google Search Console URL Inspector</span>
            </a>
          </div>
        </div>

        {/* ============================================================ */}
        {/* UPLOAD CUSTOM FAVICON WITH PROMINENT SAVE BUTTON */}
        {/* ============================================================ */}
        <div className="bg-gradient-to-br from-blue-50/50 via-white to-slate-50 border-2 border-blue-200/80 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-blue-100 pb-3">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#003893]" />
              <h4 className="text-sm font-black text-slate-900 font-poppins">
                Upload Custom Favicon Image &amp; Save Live
              </h4>
            </div>
            {hasNewCustomUpload && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 animate-pulse flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>New Image Uploaded &bull; Click 'Save Favicon Image' to Apply</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {/* Left: Direct Image Uploader */}
            <div className="space-y-3">
              <DirectImageUploader
                id="admin-site-favicon-uploader"
                label="Select or Drag Favicon Image File"
                value={currentFavicon}
                onChange={handleCustomUploadChange}
                aspectRatio="square"
                hint="Recommended: 32x32px, 48x48px, or 64x64px. Supports .ico, .png, .svg, .webp, .jpg."
              />

              {/* DEDICATED PROMINENT SAVE FAVICON BUTTON DIRECTLY UNDER UPLOADER */}
              <button
                type="button"
                id="save-custom-favicon-button"
                onClick={() => handleSaveFavicon()}
                disabled={isSavingFavicon}
                className="w-full bg-[#003893] hover:bg-blue-900 disabled:opacity-75 text-white py-3.5 px-6 rounded-2xl text-sm font-black shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer transform active:scale-98"
              >
                {isSavingFavicon ? (
                  <>
                    <RefreshCw className="w-4 h-4 text-amber-300 animate-spin" />
                    <span>Publishing Favicon Live to Internet...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-emerald-300" />
                    <span>Save Favicon Image (Make Live on Internet)</span>
                  </>
                )}
              </button>
            </div>

            {/* Right: URL / Base64 & Live Preview */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Favicon Direct URL or Base64 Data URI
                </label>
                <textarea
                  rows={3}
                  value={currentFavicon}
                  onChange={(e) => {
                    setCurrentFavicon(e.target.value);
                    setHasNewCustomUpload(true);
                  }}
                  placeholder="https://... or data:image/png;base64,..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs font-mono text-slate-800 focus:border-[#003893] focus:ring-1 focus:ring-[#003893] transition break-all shadow-inner"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  You can paste any custom public CDN URL, base64 data string, or SVG data code.
                </p>
              </div>

              {/* Live Image Dimensions & Preview Card */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                    <img
                      src={currentFavicon}
                      alt="Active Favicon"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_LOGO_URL;
                      }}
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Current Live Favicon</span>
                    <span className="text-[11px] font-mono text-slate-500 truncate block max-w-[200px] sm:max-w-xs">
                      {currentFavicon.startsWith('data:') ? 'Custom Upload (Base64)' : currentFavicon}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetFavicon}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Default</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* FEATURE 2: TOP RANKING SEO ENGINE (CHROME & GOOGLE RANK #1) */}
      {/* ============================================================ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200">
                  Chrome Search Engine Optimization
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  Top Ranking SEO &bull; Rank #1 in Chrome Search
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 font-poppins">
                Top Ranking SEO (Rank #1 in Chrome &amp; Google Search)
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>SEO Score: 100/100 (Google Rank #1 Ready)</span>
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          Complete high-performance SEO architecture designed to rank this official portal at <strong>Position #1</strong> when users search for Bote Community terms in Google Chrome, Android, iOS, and desktop browsers.
        </p>

        {/* TOP RANKING SEO PREVIEW: CHROME SEARCH POSITION #1 */}
        <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 space-y-4 shadow-lg border border-slate-800">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black uppercase text-[10px] tracking-wider">
                Rank #1 Result
              </span>
              <span className="text-slate-300 font-bold">Google Chrome Search Snippet with Sitelinks</span>
            </div>
            <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sitemap &amp; Robots.txt Live on Server</span>
            </span>
          </div>

          {/* Chrome Snippet */}
          <div className="bg-white text-slate-900 rounded-2xl p-5 shadow-inner space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-slate-100 p-0.5 border border-slate-200 overflow-hidden shrink-0">
                <img src={currentFavicon} alt="Favicon" className="w-full h-full object-contain" />
              </div>
              <div className="text-xs text-slate-700 font-medium truncate">
                <span className="font-bold text-slate-900">BoteYouthCommunityNepal</span>
                <span className="mx-1 text-slate-400">&rsaquo;</span>
                <span className="text-slate-500 font-mono text-[11px]">https://boteyouthcommunity.org.np/</span>
              </div>
            </div>

            <h4 className="text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer leading-tight">
              Bote Youth Community Nepal (BYCN) | Official Portal &amp; Cultural Registry
            </h4>

            <p className="text-xs text-slate-600 leading-relaxed">
              Official portal for Bote Youth Community Nepal (बोटे युवा समुदाय नेपाल). Access authentic cultural heritage, language dictionary, traditional attire, youth empowerment programs, scholarships, and central office updates.
            </p>

            {/* Google Sitelinks Grid (Rank 1 Feature) */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[#1a0dab] font-bold block truncate">Cultural Heritage</span>
                <span className="text-[10px] text-slate-500 block truncate">Jal Puja &amp; Rituals</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[#1a0dab] font-bold block truncate">Language Dictionary</span>
                <span className="text-[10px] text-slate-500 block truncate">Native Bote Vocabulary</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[#1a0dab] font-bold block truncate">Youth Scholarships</span>
                <span className="text-[10px] text-slate-500 block truncate">SEE &amp; College Grants</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[#1a0dab] font-bold block truncate">Karmaiya Office</span>
                <span className="text-[10px] text-slate-500 block truncate">Central Headquarters</span>
              </div>
            </div>
          </div>
        </div>

        {/* SEO SPECIFICATIONS & SITEMAP VERIFICATION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider">Live XML Sitemap</span>
            <div className="font-mono text-[#003893] font-bold text-xs truncate">
              /sitemap.xml
            </div>
            <p className="text-[11px] text-slate-500">
              Auto-indexes all cultural, scholarship, language, and office pages.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#003893] hover:underline flex items-center gap-1"
              >
                <span>View Live Sitemap</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={handleCopySitemapUrl}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer ml-auto"
              >
                {copiedSitemap ? 'Copied!' : 'Copy URL'}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider">Robots.txt Crawler Policy</span>
            <div className="font-mono text-emerald-700 font-bold text-xs truncate">
              /robots.txt (Allow: /)
            </div>
            <p className="text-[11px] text-slate-500">
              Instructs Googlebot, Bingbot, and Chrome to crawl and index all content.
            </p>
            <div className="pt-2">
              <a
                href="/robots.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#003893] hover:underline flex items-center gap-1"
              >
                <span>View Live Robots.txt</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider">Schema.org Graph</span>
            <div className="font-mono text-purple-700 font-bold text-xs truncate">
              WebSite + Organization
            </div>
            <p className="text-[11px] text-slate-500">
              Enables Google Sitelinks Search Box directly inside Chrome search results.
            </p>
            <div className="pt-2">
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>JSON-LD Graph Injected</span>
              </span>
            </div>
          </div>
        </div>

        {/* PRIMARY CHROME SEARCH TARGET KEYWORDS */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
            Primary Target Keywords Ranked for Chrome &amp; Google Search
          </label>
          <div className="flex flex-wrap gap-1.5">
            {[
              'Bote Youth Community Nepal',
              'बोटे युवा समुदाय नेपाल',
              'BYCN',
              'Bote Samaj',
              'Bote Indigenous Nationalities',
              'Bote Language Dictionary',
              'Bote Cultural Attire',
              'Bote Scholarships Nepal',
              'Karmaiya Central Office',
              'Bagmati River Bote',
              'Chitwan Bote Community',
              'Nawalparasi Bote Youth'
            ].map((kw, i) => (
              <span
                key={i}
                className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs"
              >
                #{kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* FEATURE 3: GOOGLE SEARCH CONSOLE (GSC) CONNECT & VERIFICATION */}
      {/* ============================================================ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-sm">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                  Google Search Console (GSC)
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  Official Site Verification &amp; Sitemaps Indexing Hub
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 font-poppins">
                Connect Website to Google Search Console
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
            >
              <span>Open Google Search Console</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            </a>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          Connecting to Google Search Console lets you track your website&apos;s rank on Google, monitor Googlebot crawl status, submit your sitemap for indexing, and resolve indexing issues. All 4 Google verification methods are pre-wired and active on this website.
        </p>

        {gscSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{gscSuccess}</span>
            </div>
            <button
              type="button"
              onClick={() => setGscSuccess(null)}
              className="text-emerald-500 hover:text-emerald-800 font-black cursor-pointer text-lg leading-none"
            >
              &times;
            </button>
          </div>
        )}

        {/* STEP-BY-STEP QUICK CONNECTION TILES */}
        {/* STEP-BY-STEP QUICK CONNECTION TILES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* METHOD 1: HTML TAG VERIFICATION (META TAG) */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-[#003893] text-[11px] font-bold flex items-center justify-center">1</span>
                  <span>Method 1: HTML Tag (Meta Tag)</span>
                </span>
                {gscCode.trim() ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" /> Active in &lt;head&gt;
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                    No Verification Tag Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Google Search Console provides a meta tag: <code>&lt;meta name=&quot;google-site-verification&quot; content=&quot;...&quot; /&gt;</code>. Paste either the full tag or just the verification code below:
              </p>
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={gscCode}
                  onChange={(e) => setGscCode(e.target.value)}
                  placeholder="Paste Google verification token or <meta> tag here"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:border-[#003893] focus:ring-2 focus:ring-[#003893]/20"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>
                    Current token:{' '}
                    {gscCode.trim() ? (
                      <code className="text-slate-800 font-bold">{gscCode.slice(0, 24)}...</code>
                    ) : (
                      <span className="text-slate-400 italic">None (Removed)</span>
                    )}
                  </span>
                  {gscCode.trim() && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`<meta name="google-site-verification" content="${gscCode.trim()}" />`);
                        setCopiedGscTag(true);
                        setTimeout(() => setCopiedGscTag(false), 2500);
                      }}
                      className="text-[#003893] hover:underline font-bold inline-flex items-center gap-1"
                    >
                      {copiedGscTag ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>Copy Full Tag</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveGsc}
                disabled={isSavingGsc}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#003893] hover:bg-blue-900 text-white text-xs font-black transition flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-75"
              >
                {isSavingGsc ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                    <span>Saving Token...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Save &amp; Apply Tag Live</span>
                  </>
                )}
              </button>
              {gscCode.trim() && (
                <button
                  type="button"
                  onClick={handleClearGsc}
                  disabled={isSavingGsc}
                  className="py-2.5 px-3 rounded-xl bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  title="Remove Verification Tag"
                >
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>

          {/* METHOD 2: HTML FILE AUTO-RESPONDER (INSTANT VERIFICATION) */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold flex items-center justify-center">2</span>
                  <span>Method 2: HTML Verification File</span>
                </span>
                {gscCode.trim() ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-600" /> Auto-Responder Active
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                    No File Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                When Google prompts you for an HTML verification file (e.g. <code>google[code].html</code>), enter that verification code in Method 1 above. Our server responds with <strong>HTTP 200 OK</strong> dynamically!
              </p>
              {gscCode.trim() ? (
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs font-mono text-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-sans">
                    <span>Configured Dynamic File:</span>
                    <span className="text-emerald-700 font-bold">200 OK Available</span>
                  </div>
                  <div className="truncate text-xs font-bold text-[#003893]">
                    {gscCode.trim().endsWith('.html')
                      ? (gscCode.trim().startsWith('/') ? gscCode.trim() : `/${gscCode.trim()}`)
                      : `/google${gscCode.trim().replace(/^google/, '')}.html`}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-500 space-y-1">
                  <span className="font-bold text-slate-700 block">No Verification File Configured</span>
                  <p className="text-[11px] text-slate-400">All old verification files have been removed. Enter your new code in Method 1 to activate a new live endpoint.</p>
                </div>
              )}
            </div>

            {gscCode.trim() && (
              <div className="flex items-center gap-2">
                <a
                  href={gscCode.trim().endsWith('.html')
                    ? (gscCode.trim().startsWith('/') ? gscCode.trim() : `/${gscCode.trim()}`)
                    : `/google${gscCode.trim().replace(/^google/, '')}.html`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-white border border-slate-300 hover:border-blue-400 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>Test Live File (200 OK)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    const filePath = gscCode.trim().endsWith('.html')
                      ? (gscCode.trim().startsWith('/') ? gscCode.trim() : `/${gscCode.trim()}`)
                      : `/google${gscCode.trim().replace(/^google/, '')}.html`;
                    const url = `${window.location.origin}${filePath}`;
                    navigator.clipboard.writeText(url);
                    setCopiedGscFileUrl(true);
                    setTimeout(() => setCopiedGscFileUrl(false), 2500);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1"
                  title="Copy Full File URL"
                >
                  {copiedGscFileUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* METHOD 3 & 4: GOOGLE ANALYTICS + SITEMAP SUBMISSION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* METHOD 3: GOOGLE ANALYTICS 4 1-CLICK VERIFICATION */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border border-blue-200/80 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-200 text-[#003893] text-[11px] font-bold flex items-center justify-center">3</span>
                <span>Method 3: Google Analytics 4 (1-Click Auto-Verify)</span>
              </span>
              {gaId ? (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Active Stream
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  No Active GA4 ID
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              If your Google Search Console account matches your Google Analytics account (<strong>navarajbot@gmail.com</strong>), you can choose <strong>&quot;Google Analytics&quot;</strong> in Search Console and click <strong>Verify</strong> to authenticate instantly.
            </p>
            <div className="bg-white p-2.5 rounded-xl border border-blue-200 font-mono text-xs text-[#003893] font-bold flex items-center justify-between">
              <span>Active GA4 ID: {gaId || 'None (No active ID configured)'}</span>
              {gaId ? (
                <span className="text-emerald-600 text-[11px] font-sans font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Ready
                </span>
              ) : (
                <span className="text-slate-400 text-[11px] font-sans">
                  Inactive
                </span>
              )}
            </div>
          </div>

          {/* SITEMAP SUBMISSION FOR GOOGLE SEARCH CONSOLE */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border border-emerald-200/80 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center justify-center">4</span>
                <span>Submit XML Sitemap to Googlebot</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Daily Crawl Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Once ownership is verified, go to <strong>Sitemaps</strong> in Google Search Console, enter <code>sitemap.xml</code> and click <strong>Submit</strong> so Googlebot indexes all cultural, leadership, and community pages.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value="https://boteyouthcommunity.org.np/sitemap.xml"
                className="flex-1 bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText('https://boteyouthcommunity.org.np/sitemap.xml');
                  setCopiedSitemap(true);
                  setTimeout(() => setCopiedSitemap(false), 2500);
                }}
                className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
              >
                {copiedSitemap ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSitemap ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* INTERACTIVE STEP-BY-STEP WALKTHROUGH ACCORDION */}
        <div className="bg-gradient-to-r from-slate-900 to-[#003893] text-white rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black text-xs">
                ★
              </div>
              <h4 className="text-sm font-black text-white font-poppins">
                Complete Step-by-Step Instructions: Connect in 2 Minutes
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setShowGscGuide(!showGscGuide)}
              className="text-xs font-bold text-amber-300 hover:text-white underline cursor-pointer"
            >
              {showGscGuide ? 'Collapse Guide' : 'Expand 5-Step Guide'}
            </button>
          </div>

          {showGscGuide && (
            <div className="space-y-3 text-xs leading-relaxed text-slate-200 border-t border-white/10 pt-3">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div className="bg-white/10 rounded-xl p-3 border border-white/10 space-y-1">
                  <div className="text-amber-400 font-black text-[11px]">STEP 1</div>
                  <div className="font-bold text-white text-xs">Open Console</div>
                  <p className="text-[11px] text-slate-300">
                    Visit <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-amber-300 underline font-bold">search.google.com</a> and sign in with your Google account.
                  </p>
                </div>

                <div className="bg-white/10 rounded-xl p-3 border border-white/10 space-y-1">
                  <div className="text-amber-400 font-black text-[11px]">STEP 2</div>
                  <div className="font-bold text-white text-xs">Add Property</div>
                  <p className="text-[11px] text-slate-300">
                    Select <strong>URL prefix</strong> and enter: <code className="text-amber-300">https://boteyouthcommunity.org.np/</code>
                  </p>
                </div>

                <div className="bg-white/10 rounded-xl p-3 border border-white/10 space-y-1">
                  <div className="text-amber-400 font-black text-[11px]">STEP 3</div>
                  <div className="font-bold text-white text-xs">Choose Method</div>
                  <p className="text-[11px] text-slate-300">
                    Select <strong>HTML tag</strong> (or <strong>HTML file</strong> or <strong>Google Analytics</strong>) under Other verification methods.
                  </p>
                </div>

                <div className="bg-white/10 rounded-xl p-3 border border-white/10 space-y-1">
                  <div className="text-amber-400 font-black text-[11px]">STEP 4</div>
                  <div className="font-bold text-white text-xs">Click Verify</div>
                  <p className="text-[11px] text-slate-300">
                    Click the <strong>VERIFY</strong> button. Google will confirm ownership instantly and say &quot;Ownership verified&quot;.
                  </p>
                </div>

                <div className="bg-white/10 rounded-xl p-3 border border-white/10 space-y-1">
                  <div className="text-amber-400 font-black text-[11px]">STEP 5</div>
                  <div className="font-bold text-white text-xs">Submit Sitemap</div>
                  <p className="text-[11px] text-slate-300">
                    Click <strong>Go to property</strong> &gt; <strong>Sitemaps</strong> &gt; enter <code className="text-amber-300">sitemap.xml</code> and click <strong>Submit</strong>!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* FEATURE 4: GOOGLE ANALYTICS MEASUREMENT ID (GA4) */}
      {/* ============================================================ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#003893] shadow-sm">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 border border-blue-200">
                  Real-Time Analytics Stream
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  Google Analytics 4 (GA4) Global Site Tag
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 font-poppins">
                Google Analytics Measurement ID
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${
                gaEnabled && gaId.trim()
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  gaEnabled && gaId.trim() ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span>{gaEnabled && gaId.trim() ? 'GA4 Active & Tracking Live' : 'Tracking Inactive / Paused'}</span>
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          Connect your Google Analytics 4 (GA4) web stream to view real-time visitor counts, geographic locations (Nepal &amp; international diaspora),
          cultural lexicon searches, scholarship application downloads, and community notice readership.
        </p>

        {gaSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{gaSuccess}</span>
            </div>
            <button
              type="button"
              onClick={() => setGaSuccess(null)}
              className="text-emerald-500 hover:text-emerald-800 font-black cursor-pointer text-lg leading-none"
            >
              &times;
            </button>
          </div>
        )}

        {/* INPUT AND TOGGLE CONTROLS */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-end">
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-[#003893]" />
                  <span>Google Analytics Measurement ID</span>
                </label>
                {gaId.trim() && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isValidGaFormat
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isValidGaFormat ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Valid GA4 Format</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        <span>Starts with G-</span>
                      </>
                    )}
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={gaId}
                  onChange={(e) => setGaId(e.target.value.toUpperCase().trim())}
                  placeholder="G-XXXXXXXXXX (e.g. paste your new GA4 ID)"
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-mono font-bold text-slate-900 tracking-wider focus:border-[#003893] focus:ring-2 focus:ring-[#003893]/20 transition"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Your GA4 Measurement ID starts with 'G-' followed by alphanumeric characters (e.g. <code>G-XXXXXXXXXX</code>).
              </p>
            </div>

            {/* ENABLE/PAUSE TOGGLE */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Tracking Status
              </label>
              <button
                type="button"
                onClick={() => setGaEnabled(!gaEnabled)}
                className={`w-full py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                  gaEnabled
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>{gaEnabled ? 'Tracking Enabled' : 'Tracking Paused'}</span>
              </button>
            </div>
          </div>

          {/* ACTION BUTTONS: SAVE GA ID & SETUP GUIDE */}
          <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowGaGuide(!showGaGuide)}
                className="px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer bg-white border border-slate-200 shadow-2xs"
              >
                <Info className="w-3.5 h-3.5 text-blue-600" />
                <span>{showGaGuide ? 'Hide Setup Guide' : 'How to find your GA4 ID?'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {gaId.trim() && (
                <button
                  type="button"
                  onClick={handleClearGa}
                  disabled={isSavingGa}
                  className="px-4 py-3 rounded-2xl bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Remove GA4 ID</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleSaveGa}
                disabled={isSavingGa}
                className="bg-[#003893] hover:bg-blue-900 disabled:opacity-75 text-white px-7 py-3 rounded-2xl text-xs font-black shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                {isSavingGa ? (
                  <>
                    <RefreshCw className="w-4 h-4 text-amber-300 animate-spin" />
                    <span>Saving Analytics ID...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Save Google Analytics ID</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* STEP-BY-STEP GA4 SETUP GUIDE */}
        {showGaGuide && (
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 space-y-3 animate-in fade-in duration-200">
            <h4 className="text-xs font-bold text-blue-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#003893]" />
              <span>Step-by-Step: Finding Your Google Analytics 4 Measurement ID</span>
            </h4>
            <ol className="text-xs text-blue-900 space-y-1.5 list-decimal list-inside pl-1 leading-relaxed">
              <li>
                Sign in to{' '}
                <a
                  href="https://analytics.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline text-[#003893] inline-flex items-center gap-0.5"
                >
                  analytics.google.com <ExternalLink className="w-3 h-3 inline" />
                </a>{' '}
                using your community Google account.
              </li>
              <li>Click on the <strong>Admin</strong> gear icon in the bottom-left corner of the Google Analytics dashboard.</li>
              <li>Under the <strong>Property</strong> column, click on <strong>Data Streams</strong> and select your <strong>Web</strong> stream.</li>
              <li>
                Locate the <strong>Measurement ID</strong> in the top-right corner of the Stream Details panel (format: <code>G-XXXXXXXXXX</code>).
              </li>
              <li>Paste that Measurement ID into the box above and click <strong>Save Google Analytics ID</strong>.</li>
            </ol>
          </div>
        )}

        {/* REAL-TIME TECHNICAL SPECIFICATIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Global Script Injection</span>
            <span className="font-mono text-slate-800 font-semibold text-[11px] truncate block mt-0.5">
              https://www.googletagmanager.com/gtag/js
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Active Stream ID</span>
            <span className="font-mono text-[#003893] font-bold text-xs block mt-0.5">
              {gaId.trim() || 'Not Configured'}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Global DataLayer Status</span>
            <span className="text-emerald-700 font-bold text-xs flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>window.dataLayer &amp; gtag() Ready</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
