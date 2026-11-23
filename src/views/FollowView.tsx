/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType } from '../types';
import { useCommunityData } from '../context/CommunityDataContext';
import { useLanguage } from '../context/LanguageContext';
import InteractiveFollowModal from '../components/InteractiveFollowModal';
import {
  formatCentralOfficeAddress,
  getCentralOfficeMapsUrl,
  formatTelLink
} from '../utils/addressFormatter';
import {
  Facebook,
  Youtube,
  Instagram,
  Twitter,
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle,
  ExternalLink,
  MessageCircle,
  Share2,
  Heart,
  Users,
  Shield,
  Sparkles,
  IdCard,
  UserCheck,
  Megaphone,
  Radio,
  Bell,
  AlertCircle,
  ArrowRight,
  Pin,
  Clock,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';

interface FollowViewProps {
  setCurrentTab: (tab: TabType) => void;
}

export default function FollowView({ setCurrentTab }: FollowViewProps) {
  const {
    followerCount,
    isFollowingCommunity,
    followerEmail,
    hideJoinOption,
    hasJoinedCommunity,
    centralOffice
  } = useCommunityData();
  const { isNepali } = useLanguage();

  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderSubject, setSenderSubject] = useState('');
  const [senderMessage, setSenderMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);
  const [copiedNoticeShare, setCopiedNoticeShare] = useState(false);
  const [copiedFollowKey, setCopiedFollowKey] = useState<string | null>(null);

  const handleCopyText = (text: string, key: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedFollowKey(key);
      setTimeout(() => setCopiedFollowKey(null), 2500);
    } catch {
      // fallback
    }
  };

  const formattedAddress = formatCentralOfficeAddress(centralOffice);
  const mapsUrl = getCentralOfficeMapsUrl(centralOffice);
  const primaryPhoneNum = centralOffice?.primaryPhone || '+977-9806389212';
  const hotlineNum = centralOffice?.hotline || centralOffice?.primaryPhone || '+977-9806389212';
  const helplineNum = centralOffice?.emergencyRiverHelpline;
  const officialEmailAddr = centralOffice?.officialEmail || 'boteyouthcommunitynepal@gmail.com';
  const secondaryEmailAddr = centralOffice?.secondaryEmail || 'scholarshipsboteyouthcommunitynepal@gmail.com';

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderMessage.trim()) return;
    setSentSuccess(true);
    setTimeout(() => {
      setSenderName('');
      setSenderEmail('');
      setSenderSubject('');
      setSenderMessage('');
      setSentSuccess(false);
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#DC143C]">
          <Share2 className="w-4 h-4 text-[#003893]" />
          <span>{isNepali ? 'एक्यबद्धता तथा सम्पर्क सञ्जाल' : 'Connected In Solidarity'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-poppins text-slate-900 leading-tight">
          {isNepali ? 'समुदाय फलो गर्नुहोस् र सम्पर्कमा रहनुहोस्' : 'Follow Our Community & Connect'}
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
          {isNepali
            ? 'नेपाल बोटे युवा समुदाय (BoteYouthCommunityNepal) सँग निरन्तर सम्पर्कमा रहनुहोस्। हाम्रा दैनिक वृत्तचित्र भिडियोहरू, नदी संरक्षणका सूचनाहरू, भाषा सिकाइ कक्षाहरू र सांस्कृतिक चाडपर्वका जानकारीहरू प्राप्त गर्नुहोस्।'
            : 'Stay connected with Bote Youth Community Nepal (BoteYouthCommunityNepal). Follow our daily video documentaries, river conservation alerts, language practice circles, and cultural festival updates.'}
        </p>
      </div>

      {/* Interactive Official Community Follower Hub */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-800 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Heart className="w-64 h-64 text-red-500 fill-red-500" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-300 border border-red-500/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>{isNepali ? 'आधिकारिक सामुदायिक समर्थक' : 'Official Community Supporters'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-poppins">
              {isNepali ? 'एक-पटक जिमेल (Gmail) मार्फत फलो' : 'One-Time Gmail Community Follow'}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {isNepali
                ? 'हाम्रो प्रमाणित आदिवासी युवा अभियानमा जोडिनुहोस्। आफ्नो जिमेल खाताबाट एक पटक फलो गरेपछि तपाईंको स्थिति प्रमाणित रूपमा सुरक्षित हुन्छ र दोहोरो दर्ता रोकिन्छ।'
                : 'Join our network of verified indigenous youth advocates. Once you follow with your Gmail account, your verified follower status is registered, preventing duplicate entries and keeping you directly connected.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white">
                  {isNepali ? `कुल ${followerCount} अनुयायीहरू` : `${followerCount} Total Followers`}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>{isNepali ? 'दोहोरो दर्ता नियन्त्रण प्रणाली' : 'Anti-Duplicate Gmail Check'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 w-full md:w-auto shrink-0">
            {isFollowingCommunity ? (
              <div className="bg-emerald-950/80 border-2 border-emerald-500/60 rounded-2xl p-6 text-center w-full sm:w-72 shadow-lg backdrop-blur-sm">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="font-bold text-emerald-200 text-sm">
                  {isNepali ? 'फलो गरिएको सक्रिय' : 'Following Active'}
                </h3>
                <p className="text-[11px] text-emerald-400/80 mt-1 truncate max-w-[220px] mx-auto">
                  {followerEmail || (isNepali ? 'प्रमाणित जिमेल अनुयायी' : 'Verified Gmail Follower')}
                </p>
                <div className="mt-3 text-[10px] uppercase font-bold tracking-wider text-emerald-300 bg-emerald-900/50 py-1 px-3 rounded-full border border-emerald-700/50">
                  ✓ {isNepali ? 'प्रमाणित समर्थक' : 'Verified Supporter'}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsFollowModalOpen(true)}
                className="w-full sm:w-72 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
              >
                <Heart className="w-5 h-5 fill-white text-white" />
                <span className="text-sm font-extrabold uppercase tracking-wide">
                  {isNepali ? `जिमेलबाट फलो गर्नुहोस् (${followerCount})` : `Follow With Gmail (${followerCount})`}
                </span>
              </button>
            )}

            {/* If user hasn't joined or followed, allow quick join navigation */}
            {!hideJoinOption ? (
              <button
                type="button"
                onClick={() => setCurrentTab('join')}
                className="text-xs text-slate-400 hover:text-white underline underline-offset-4 flex items-center gap-1 transition cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{isNepali ? 'पूर्ण सदस्यता फारम भर्न यहाँ थिच्नुहोस्' : 'Looking to fill full membership form? Click here'}</span>
              </button>
            ) : (
              hasJoinedCommunity && (
                <button
                  type="button"
                  onClick={() => setCurrentTab('join')}
                  className="text-xs text-amber-300 hover:text-amber-200 underline underline-offset-4 flex items-center gap-1 transition cursor-pointer"
                >
                  <IdCard className="w-3.5 h-3.5" />
                  <span>{isNepali ? 'मेरो आधिकारिक डिजिटल परिचयपत्र हेर्नुहोस्' : 'View My Official Digital ID Card'}</span>
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Social Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noreferrer"
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col items-center text-center space-y-3 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Facebook className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-poppins font-bold text-sm text-slate-900">
              {isNepali ? 'फेसबुक पेज' : 'Facebook Page'}
            </h4>
            <p className="text-xs text-slate-500 mt-1">@BoteYouthCommunityNepal</p>
          </div>
          <span className="text-[11px] font-bold text-blue-600 flex items-center gap-1">
            {isNepali ? 'पेज फलो गर्नुहोस्' : 'Follow Page'} <ExternalLink className="w-3 h-3" />
          </span>
        </a>

        <a
          href="https://youtube.com"
          target="_blank"
          rel="noreferrer"
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col items-center text-center space-y-3 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-red-100 text-[#DC143C] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Youtube className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-poppins font-bold text-sm text-slate-900">
              {isNepali ? 'युट्युब च्यानल' : 'YouTube Channel'}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              {isNepali ? 'सांस्कृतिक वृत्तचित्र तथा गीत' : 'Cultural Documentaries & Songs'}
            </p>
          </div>
          <span className="text-[11px] font-bold text-[#DC143C] flex items-center gap-1">
            {isNepali ? 'सब्सक्राइब गर्नुहोस्' : 'Subscribe'} <ExternalLink className="w-3 h-3" />
          </span>
        </a>

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col items-center text-center space-y-3 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Instagram className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-poppins font-bold text-sm text-slate-900">
              {isNepali ? 'इन्स्टाग्राम' : 'Instagram Visuals'}
            </h4>
            <p className="text-xs text-slate-500 mt-1">@BoteYouthNepal</p>
          </div>
          <span className="text-[11px] font-bold text-pink-600 flex items-center gap-1">
            {isNepali ? 'तस्बिरहरू हेर्नुहोस्' : 'Follow Photos'} <ExternalLink className="w-3 h-3" />
          </span>
        </a>

        <a
          href="https://wa.me/9779806389212"
          target="_blank"
          rel="noreferrer"
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col items-center text-center space-y-3 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageCircle className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-poppins font-bold text-sm text-slate-900">
              {isNepali ? 'ह्वाट्सएप हटलाइन' : 'WhatsApp Hotline'}
            </h4>
            <p className="text-xs text-slate-500 mt-1">+977-9806389212</p>
          </div>
          <span className="text-[11px] font-bold text-green-600 flex items-center gap-1">
            {isNepali ? 'ह्वाट्सएपमा च्याट' : 'Chat on WhatsApp'} <ExternalLink className="w-3 h-3" />
          </span>
        </a>
      </div>

      {/* Central Office Public Notice Board Notice Widget */}
      {centralOffice?.publicNoticeBoardNotice && centralOffice?.publicNoticeIsPublished !== false && (
        <div id="central-office-public-notice-board" className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-1 shadow-md">
          <div className="bg-white rounded-[22px] p-6 sm:p-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                  <Megaphone className="w-5 h-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Radio className="w-2.5 h-2.5 text-amber-600 animate-ping" />
                      <span>{isNepali ? 'सार्वजनिक सूचना पाटी' : 'Public Notice Board'}</span>
                    </span>
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{isNepali ? 'प्रकाशित गरिएको छ' : 'Verified Notice'}</span>
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      centralOffice?.publicNoticePriority === 'urgent'
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : centralOffice?.publicNoticePriority === 'high'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-blue-100 text-blue-900 border border-blue-300'
                    }`}>
                      {centralOffice?.publicNoticePriority === 'urgent'
                        ? (isNepali ? '🔴 अत्यन्त जरूरी' : '🔴 Urgent Notice')
                        : centralOffice?.publicNoticePriority === 'high'
                        ? (isNepali ? '🟡 महत्वपूर्ण सूचना' : '🟡 High Priority')
                        : (isNepali ? '🔵 सामान्य सूचना' : '🔵 Standard Notice')}
                    </span>
                  </div>
                  <h3 className="font-poppins font-black text-base sm:text-lg text-slate-900 mt-1">
                    {centralOffice?.publicNoticeTitle || (isNepali ? 'केन्द्रीय कार्यालय सार्वजनिक सूचना' : 'Central Office Public Notice')}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => setCurrentTab('notices')}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <span>{isNepali ? 'सबै सूचना हेर्नुहोस्' : 'View All Notices'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(
                        `${centralOffice?.publicNoticeTitle || 'केन्द्रीय कार्यालय सूचना'}\n${centralOffice?.publicNoticeBoardNotice}\n— बोटे युवा समुदाय केन्द्रीय कार्यालय, कर्मैया, सर्लाही`
                      );
                      setCopiedNoticeShare(true);
                      setTimeout(() => setCopiedNoticeShare(false), 3000);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  title="सूचना कपी गर्नुहोस्"
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>{copiedNoticeShare ? (isNepali ? 'कपी भयो!' : 'Copied!') : (isNepali ? 'सेयर' : 'Share')}</span>
                </button>
              </div>
            </div>

            <div className="bg-amber-50/70 rounded-2xl p-4 sm:p-5 border border-amber-200/90 space-y-3">
              <p className="font-nepali text-slate-900 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
                {centralOffice.publicNoticeBoardNotice}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-200/60 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">
                    {isNepali ? 'कार्यालय:' : 'Office:'} {centralOffice.officeNameNepali || (isNepali ? 'बोटे युवा समुदाय केन्द्रीय कार्यालय, कर्मैया-११, सर्लाही' : 'Karmaiya Central Office')}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10.5px]">
                    {isNepali ? 'हटलाइन:' : 'Hotline:'} <strong>{centralOffice.hotline || centralOffice.primaryPhone || '+977-9806389212'}</strong>
                  </span>
                  {centralOffice.publicNoticePostedAt && (
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{new Date(centralOffice.publicNoticePostedAt).toLocaleDateString()}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Office Coordinates & Direct Message Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Office Coordinates */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-poppins font-black text-lg text-slate-900 hover:text-emerald-700 transition flex items-center gap-1.5 group"
              title="Open Karmaiya Central Office on Google Maps"
            >
              <span>{isNepali ? (centralOffice?.officeNameNepali || 'कर्मैया केन्द्रीय कार्यालय') : (centralOffice?.officeName || 'Karmaiya Central Office')}</span>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
            </a>
            {centralOffice?.officeNameNepali && !isNepali && (
              <span className="text-xs font-nepali text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
                {centralOffice.officeNameNepali}
              </span>
            )}
          </div>

          <div className="space-y-4 text-xs text-slate-700">
            {/* Headquarters Location */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <MapPin className="w-5 h-5 text-[#DC143C] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="block text-slate-900 uppercase tracking-wider text-[11px]">
                      {isNepali ? 'केन्द्रीय कार्यालय ठेगाना' : 'Headquarters Location'}
                    </strong>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {formattedAddress}
                    </p>
                    {centralOffice?.landmark && (
                      <p className="text-[11px] text-slate-500 italic">
                        {isNepali ? `ल्याण्डमार्क: ${centralOffice.landmark}` : `Landmark: ${centralOffice.landmark}`}
                      </p>
                    )}
                    {centralOffice?.gpsCoordinates && (
                      <p className="text-[10px] font-mono text-slate-500">
                        GPS: {centralOffice.gpsCoordinates}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition flex items-center gap-1 shadow-2xs"
                  title="Open location in Google Maps directions"
                >
                  <MapPin className="w-3 h-3" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <button
                  type="button"
                  onClick={() => handleCopyText(formattedAddress, 'address')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-medium transition flex items-center gap-1 cursor-pointer"
                >
                  {copiedFollowKey === 'address' ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> {isNepali ? 'ठेगाना कपी भयो' : 'Copied Address'}
                    </span>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>{isNepali ? 'ठेगाना कपी गर्नुहोस्' : 'Copy Address'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Direct Hotlines & River Patrol */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#003893] shrink-0" />
                <strong className="block text-slate-900 uppercase tracking-wider text-[11px]">
                  {isNepali ? 'प्रत्यक्ष हटलाइन तथा नदी गस्ती सम्पर्क' : 'Direct Hotlines & River Patrol'}
                </strong>
              </div>

              <div className="space-y-2">
                {/* 24/7 Hotline */}
                <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="block text-[10px] font-bold text-amber-900 uppercase">
                      {isNepali ? '२४/७ केन्द्रीय नदी हटलाइन' : '24/7 Central River Hotline'}
                    </span>
                    <a
                      href={`tel:${formatTelLink(hotlineNum)}`}
                      className="text-xs font-mono font-bold text-amber-950 hover:underline hover:text-amber-800"
                    >
                      {hotlineNum}
                    </a>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={`tel:${formatTelLink(hotlineNum)}`}
                      className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition shadow-2xs"
                    >
                      {isNepali ? 'फोन' : 'Call'}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopyText(hotlineNum, 'hotline')}
                      className="p-1 rounded-lg bg-white border border-amber-200 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                    >
                      {copiedFollowKey === 'hotline' ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Executive Desk */}
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="block text-[10px] font-medium text-slate-500 uppercase">
                      {isNepali ? 'कार्यकारी फोन नम्बर' : 'Executive Desk Phone'}
                    </span>
                    <a
                      href={`tel:${formatTelLink(primaryPhoneNum)}`}
                      className="text-xs font-mono font-bold text-slate-800 hover:underline hover:text-blue-700"
                    >
                      {primaryPhoneNum}
                    </a>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={`tel:${formatTelLink(primaryPhoneNum)}`}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-[11px] transition"
                    >
                      {isNepali ? 'फोन' : 'Call'}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopyText(primaryPhoneNum, 'phone')}
                      className="p-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                    >
                      {copiedFollowKey === 'phone' ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Emergency River Helpline if present */}
                {helplineNum && (
                  <div className="bg-red-50/80 p-2.5 rounded-xl border border-red-200 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold text-red-900 uppercase">
                        {isNepali ? 'आपतकालीन नदी उद्धार' : 'Emergency River Rescue'}
                      </span>
                      <a
                        href={`tel:${formatTelLink(helplineNum)}`}
                        className="text-xs font-mono font-bold text-red-950 hover:underline hover:text-red-700"
                      >
                        {helplineNum}
                      </a>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={`tel:${formatTelLink(helplineNum)}`}
                        className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] transition"
                      >
                        {isNepali ? 'फोन' : 'Call'}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopyText(helplineNum, 'helpline')}
                        className="p-1 rounded-lg bg-white border border-red-200 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                      >
                        {copiedFollowKey === 'helpline' ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Official Email Dispatch */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                <strong className="block text-slate-900 uppercase tracking-wider text-[11px]">
                  {isNepali ? 'आधिकारिक इमेल सम्पर्क' : 'Official Email Dispatch'}
                </strong>
              </div>

              <div className="space-y-2">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="block text-[10px] font-medium text-slate-500 uppercase">
                      {isNepali ? 'मुख्य डिजिटल इनबक्स' : 'Primary Digital Inbox'}
                    </span>
                    <a
                      href={`mailto:${officialEmailAddr}`}
                      className="text-xs font-mono font-bold text-slate-800 hover:underline hover:text-blue-700 truncate block"
                    >
                      {officialEmailAddr}
                    </a>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={`mailto:${officialEmailAddr}`}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition shadow-2xs"
                    >
                      {isNepali ? 'इमेल' : 'Email'}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopyText(officialEmailAddr, 'email')}
                      className="p-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                    >
                      {copiedFollowKey === 'email' ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                {secondaryEmailAddr && (
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="block text-[10px] font-medium text-slate-500 uppercase">
                        {isNepali ? 'छात्रवृत्ति तथा सम्पर्क समन्वय' : 'Executive Liaison'}
                      </span>
                      <a
                        href={`mailto:${secondaryEmailAddr}`}
                        className="text-xs font-mono font-bold text-slate-800 hover:underline hover:text-blue-700 truncate block"
                      >
                        {secondaryEmailAddr}
                      </a>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={`mailto:${secondaryEmailAddr}`}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-[11px] transition"
                      >
                        {isNepali ? 'इमेल' : 'Email'}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopyText(secondaryEmailAddr, 'secEmail')}
                        className="p-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                      >
                        {copiedFollowKey === 'secEmail' ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Official Registration & Timings */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span className="font-bold text-slate-800">{isNepali ? 'कार्यालय समय:' : 'Working Hours:'}</span>
                <span>{centralOffice?.officeHours || (isNepali ? 'आइतबार – शुक्रबार: बिहान १०:०० – साँझ ५:००' : 'Sun – Fri: 10:00 AM – 5:00 PM')}</span>
              </div>
              {centralOffice?.daoRegistrationNo && (
                <div className="flex items-center justify-between text-[11px] text-slate-600 border-t border-slate-200/60 pt-1.5 font-mono">
                  <span>DAO Reg / SWC:</span>
                  <span>{centralOffice.daoRegistrationNo} / {centralOffice.swcAffiliationNo}</span>
                </div>
              )}
              {centralOffice?.chiefExecutiveInCharge && (
                <div className="flex items-center justify-between text-[11px] text-slate-600 border-t border-slate-200/60 pt-1.5">
                  <span className="font-bold text-slate-800">{isNepali ? 'कार्यालय प्रमुख:' : 'In-Charge:'}</span>
                  <span>{centralOffice.chiefExecutiveInCharge}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-poppins font-black text-lg text-slate-900 border-b border-slate-100 pb-3">
            {isNepali ? 'सामुदायिक सोधपुछ वा सन्देश पठाउनुहोस्' : 'Send a Community Inquiry / Message'}
          </h3>

          {sentSuccess ? (
            <div className="bg-green-50 border border-green-200 text-green-700 text-xs p-5 rounded-2xl font-bold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
              <span>
                {isNepali
                  ? 'धन्यवाद! तपाईंको सन्देश सुरक्षित रूपमा दर्ता भयो र हाम्रो सर्लाही कार्यालय संयोजकहरूलाई पठाइयो।'
                  : 'Thank you! Your message has been logged securely and sent to our Sarlahi office coordinators.'}
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmitMessage} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    {isNepali ? 'तपाईंको नाम *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isNepali ? 'उदा. माया बोटे' : 'e.g. Maya Bote'}
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#DC143C]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    {isNepali ? 'इमेल वा मोबाइल नम्बर *' : 'Email / Mobile *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isNepali ? 'email@example.com वा ९८...' : 'email@example.com or +977...'}
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#DC143C]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  {isNepali ? 'विषय *' : 'Subject Topic *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    isNepali
                      ? 'उदा. भाषा संकलन तथा स्थलगत सर्भे सम्बन्धी सोधपुछ'
                      : 'e.g. Inquiry regarding language documentation field surveys'
                  }
                  value={senderSubject}
                  onChange={(e) => setSenderSubject(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#DC143C]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  {isNepali ? 'सन्देश विवरण *' : 'Message *'}
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={
                    isNepali
                      ? 'तपाईंको सन्देश, सुझाव वा ऐक्यबद्धताका शब्दहरू यहाँ लेख्नुहोस्...'
                      : 'Type your message, suggestions, or solidarity greetings...'
                  }
                  value={senderMessage}
                  onChange={(e) => setSenderMessage(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#DC143C]"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-[#DC143C] hover:bg-[#b51031] text-white text-xs font-bold px-6 py-3 rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isNepali ? 'सिधै सन्देश पठाउनुहोस्' : 'Send Direct Message'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Interactive Follow Modal */}
      <InteractiveFollowModal
        isOpen={isFollowModalOpen}
        onClose={() => setIsFollowModalOpen(false)}
      />
    </div>
  );
}
