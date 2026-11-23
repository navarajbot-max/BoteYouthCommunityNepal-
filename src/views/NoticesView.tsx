/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCommunityData } from '../context/CommunityDataContext';
import { useLanguage } from '../context/LanguageContext';
import { TabType, CommunityPost, PostType } from '../types';
import {
  Megaphone,
  Calendar,
  FileText,
  Image as ImageIcon,
  Users,
  Search,
  Pin,
  Download,
  Clock,
  MapPin,
  Video,
  ExternalLink,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Tag,
  Share2,
  X,
  FileSpreadsheet,
  FileCheck,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Phone,
  ArrowRight
} from 'lucide-react';

interface NoticesViewProps {
  setCurrentTab: (tab: TabType) => void;
}

export default function NoticesView({ setCurrentTab }: NoticesViewProps) {
  const { posts, isAdminAuthenticated, centralOffice } = useCommunityData();
  const { isNepali } = useLanguage();
  const [filterType, setFilterType] = useState<PostType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Filter only published posts (or all if admin)
  const visiblePosts = posts.filter((p) => isAdminAuthenticated || p.isPublished !== false);

  const filteredPosts = visiblePosts.filter((post) => {
    if (filterType !== 'all' && post.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (post.title || '').toLowerCase().includes(q);
      const matchContent = (post.content || '').toLowerCase().includes(q);
      const matchSummary = (post.summary || '').toLowerCase().includes(q);
      const matchTags = Array.isArray(post.tags)
        ? post.tags.some((t) => (t || '').toLowerCase().includes(q))
        : false;
      if (!matchTitle && !matchContent && !matchSummary && !matchTags) return false;
    }
    return true;
  });

  const pinnedPosts = filteredPosts.filter((p) => p.pinned);
  const regularPosts = filteredPosts.filter((p) => !p.pinned);

  const handleShare = (post: CommunityPost) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.summary || post.title,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`${window.location.origin}/#notices - ${post.title}`);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 3000);
    }
  };

  const getPostTypeBadge = (type: PostType) => {
    switch (type) {
      case 'notice':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Megaphone className="w-3 h-3 text-amber-700" />
            <span>{isNepali ? 'सूचना' : 'Notice'}</span>
          </span>
        );
      case 'meeting':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">
            <Calendar className="w-3 h-3 text-blue-700" />
            <span>{isNepali ? 'बैठक' : 'Meeting'}</span>
          </span>
        );
      case 'document':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
            <FileText className="w-3 h-3 text-rose-700" />
            <span>{isNepali ? 'कागजात / पीडीएफ' : 'Documents / PDF'}</span>
          </span>
        );
      case 'photo':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <ImageIcon className="w-3 h-3 text-emerald-700" />
            <span>{isNepali ? 'तस्बिरहरू' : 'Photos'}</span>
          </span>
        );
      case 'event':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300">
            <Sparkles className="w-3 h-3 text-purple-700" />
            <span>{isNepali ? 'कार्यक्रम' : 'Event'}</span>
          </span>
        );
      case 'new_members':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-900 border border-teal-300">
            <Users className="w-3 h-3 text-teal-700" />
            <span>{isNepali ? 'नयाँ सदस्यहरू' : 'New Members'}</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Hero Banner */}
        <div className="bg-gradient-to-br from-[#003893] via-blue-950 to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-red-600/90 text-white text-xs font-black uppercase px-3 py-1 rounded-full shadow-xs">
              <Megaphone className="w-3.5 h-3.5" />
              <span>{isNepali ? 'आधिकारिक सामुदायिक सूचना डेस्क' : 'Official Community Desk'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-poppins tracking-tight">
              {isNepali ? 'सूचना, बैठक, कागजात तथा सामुदायिक अद्यावधिक' : 'Notices, Meetings, Files & Community Updates'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {isNepali
                ? 'नेपाल बोटे युवा समुदायका प्रमाणित सूचनाहरू, कार्यसमिति बैठकका निर्णयहरू, डाउनलोड गर्न मिल्ने आधिकारिक कागजात तथा पीडीएफ, फोटो ग्यालरी, कार्यक्रम तालिकाहरू र नयाँ सदस्य विवरण।'
                : 'Stay informed with verified announcements, upcoming council meetings, downloadable official documents and PDFs, photo galleries, event schedules, and newly welcomed members of Bote Youth Community Nepal.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{isNepali ? 'केन्द्रीय समितिबाट सिधै प्रमाणित' : 'Verified Direct from Central Committee'}</span>
              </div>
              {isAdminAuthenticated && (
                <button
                  onClick={() => setCurrentTab('admin')}
                  className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isNepali ? 'प्रशासक पोस्ट नियन्त्रण' : 'Admin Post Controls'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Share Copied Toast */}
        {copiedNotification && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isNepali ? 'लिङ्क क्लिपबोर्डमा प्रतिलिपि गरियो!' : 'Link copied to clipboard!'}</span>
          </div>
        )}

        {/* Central Office Public Notice Board Banner */}
        {centralOffice?.publicNoticeBoardNotice && centralOffice?.publicNoticeIsPublished !== false && (
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-1 shadow-md">
            <div className="bg-white rounded-[22px] p-5 sm:p-6 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs animate-pulse">
                    <Megaphone className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Radio className="w-2.5 h-2.5 text-amber-600 animate-ping" />
                        <span>{isNepali ? 'केन्द्रीय कार्यालय सार्वजनिक सूचना पाटी' : 'Central Office Public Notice Board'}</span>
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
                    <h3 className="font-poppins font-black text-sm sm:text-base text-slate-900 mt-1">
                      {centralOffice?.publicNoticeTitle || (isNepali ? 'केन्द्रीय कार्यालय सार्वजनिक सूचना' : 'Central Office Public Notice')}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => setCurrentTab('follow')}
                    className="px-3 py-1.5 rounded-xl border border-amber-300 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isNepali ? 'कार्यालय सम्पर्क' : 'Office Contact'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(
                          `${centralOffice?.publicNoticeTitle || 'केन्द्रीय कार्यालय सूचना'}\n${centralOffice?.publicNoticeBoardNotice}\n— बोटे युवा समुदाय केन्द्रीय कार्यालय, कर्मैया`
                        );
                        setCopiedNotification(true);
                        setTimeout(() => setCopiedNotification(false), 3000);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isNepali ? 'सेयर' : 'Share'}</span>
                  </button>
                </div>
              </div>

              <div className="bg-amber-50/70 rounded-xl p-3.5 sm:p-4 border border-amber-200/80 space-y-2">
                <p className="font-nepali text-slate-900 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
                  {centralOffice.publicNoticeBoardNotice}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-200/60 text-[10.5px] text-slate-600">
                  <span>
                    {isNepali ? 'जारी गर्ने:' : 'Issued by:'} <strong>{centralOffice.chiefExecutiveInCharge || (isNepali ? 'केन्द्रीय कार्यालय, कर्मैया, सर्लाही' : 'Central Office, Karmaiya, Sarlahi')}</strong>
                  </span>
                  <span className="font-mono">
                    {isNepali ? 'हटलाइन:' : 'Hotline:'} <strong>{centralOffice.hotline || centralOffice.primaryPhone || '+977-9806389212'}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Bar and Search */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isNepali ? `सबै सूचनाहरू (${visiblePosts.length})` : `All Updates (${visiblePosts.length})`}
            </button>
            <button
              onClick={() => setFilterType('notice')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                filterType === 'notice'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>{isNepali ? 'सूचना' : 'Notices'}</span>
            </button>
            <button
              onClick={() => setFilterType('meeting')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                filterType === 'meeting'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{isNepali ? 'बैठक' : 'Meetings'}</span>
            </button>
            <button
              onClick={() => setFilterType('document')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                filterType === 'document'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isNepali ? 'कागजात तथा पीडीएफ' : 'Files & PDF'}</span>
            </button>
            <button
              onClick={() => setFilterType('photo')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                filterType === 'photo'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{isNepali ? 'तस्बिरहरू' : 'Photos'}</span>
            </button>
            <button
              onClick={() => setFilterType('event')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                filterType === 'event'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isNepali ? 'कार्यक्रमहरू' : 'Events'}</span>
            </button>
            <button
              onClick={() => setFilterType('new_members')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                filterType === 'new_members'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{isNepali ? 'नयाँ सदस्यहरू' : 'New Members'}</span>
            </button>
          </div>

          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isNepali ? 'सूचना, बैठक, कागजात खोज्नुहोस्...' : 'Search notices, agendas, files...'}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003893] bg-slate-50"
            />
          </div>
        </div>

        {/* Pinned Announcements Section (If Any) */}
        {pinnedPosts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Pin className="w-4 h-4 text-amber-600 fill-amber-500" />
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">
                {isNepali ? 'विशेष तथा मुख्य सूचनाहरू' : 'Featured & Pinned Communications'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pinnedPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="bg-gradient-to-br from-amber-50/90 to-white rounded-3xl p-6 border-2 border-amber-300 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-4 relative group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getPostTypeBadge(post.type)}
                        <span className="text-[10.5px] font-black uppercase bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Pin className="w-3 h-3 fill-amber-700" />
                          <span>{isNepali ? 'पिन गरिएको' : 'Pinned'}</span>
                        </span>
                      </div>
                      {post.priority && post.priority !== 'normal' && (
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                          post.priority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {post.priority === 'urgent' ? (isNepali ? 'अत्यन्त जरुरी' : 'Urgent') : (isNepali ? 'महत्वपूर्ण' : 'Important')}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#003893] transition line-clamp-2">
                      {post.title}
                    </h3>

                    {post.summary && (
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {post.summary}
                      </p>
                    )}

                    {/* Specific details */}
                    {post.type === 'meeting' && (
                      <div className="p-3 bg-white rounded-2xl border border-blue-200 text-xs text-blue-900 space-y-1">
                        <div className="flex items-center gap-2 font-bold">
                          <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>{post.meetingDate} {post.meetingTime ? `(${post.meetingTime})` : ''}</span>
                        </div>
                        {post.meetingVenue && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>{post.meetingVenue}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {post.type === 'document' && post.files && (
                      <div className="p-3 bg-white rounded-2xl border border-rose-200 text-xs text-rose-900 flex items-center justify-between">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                          <span className="font-bold truncate">
                            {post.files.length} {isNepali ? 'कागजात फाइलहरू संलग्न' : 'Downloadable File(s) Attached'}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-blue-600 flex items-center gap-1 shrink-0">
                          <Download className="w-3 h-3" /> {isNepali ? 'डाउनलोड' : 'Download'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">
                      {post.authorName || (isNepali ? 'केन्द्रीय कार्यसमिति' : 'BYCN Central Committee')}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-[#003893] group-hover:translate-x-1 transition-transform">
                      <span>{isNepali ? 'पूर्ण विवरण हेर्नुहोस्' : 'View Full Details'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">
            {filterType === 'all'
              ? (isNepali ? 'सम्पूर्ण सामुदायिक सूचना तथा गतिविधि' : 'All Community Communications')
              : (isNepali ? `${filterType} अद्यावधिकहरू` : `${filterType.toUpperCase()} Updates`)}
          </h2>

          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                {isNepali ? 'यस विधामा कुनै सूचना फेला परेन' : 'No posts in this category'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {isNepali
                  ? 'तपाईंले छनोट गर्नुभएको विधामा हाल कुनै सामग्री छैन। कृपया "सबै सूचनाहरू" छान्नुहोस्।'
                  : 'No communications match your current filter. Please select "All Updates" or check back later.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="bg-white rounded-3xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition cursor-pointer overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Event Banner or First Photo */}
                    {post.eventBanner && (
                      <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
                        <img
                          src={post.eventBanner}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          {getPostTypeBadge(post.type)}
                        </div>
                      </div>
                    )}

                    {!post.eventBanner && post.photos && post.photos.length > 0 && (
                      <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
                        <img
                          src={post.photos[0]}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                          +{post.photos.length} {isNepali ? 'तस्बिरहरू' : 'Photos'}
                        </div>
                        <div className="absolute top-3 right-3">
                          {getPostTypeBadge(post.type)}
                        </div>
                      </div>
                    )}

                    <div className="p-6 space-y-3.5">
                      {!post.eventBanner && (!post.photos || post.photos.length === 0) && (
                        <div className="flex items-center justify-between">
                          {getPostTypeBadge(post.type)}
                          {post.pinned && (
                            <span className="text-[10.5px] font-black uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-200">
                              <Pin className="w-3 h-3 fill-amber-600" />
                              <span>{isNepali ? 'पिन गरिएको' : 'Pinned'}</span>
                            </span>
                          )}
                        </div>
                      )}

                      <h3 className="font-bold text-slate-900 text-base group-hover:text-[#003893] transition line-clamp-2 leading-snug">
                        {post.title}
                      </h3>

                      {post.summary && (
                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {post.summary}
                        </p>
                      )}

                      {/* Meeting specific chip */}
                      {post.type === 'meeting' && (
                        <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-100 text-xs text-blue-950 space-y-1">
                          <div className="flex items-center gap-2 font-bold">
                            <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>{post.meetingDate} {post.meetingTime ? `(${post.meetingTime})` : ''}</span>
                          </div>
                          {post.meetingVenue && (
                            <div className="flex items-center gap-2 text-slate-600 truncate text-[11px]">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{post.meetingVenue}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Documents specific chip */}
                      {post.type === 'document' && post.files && post.files.length > 0 && (
                        <div className="p-3 bg-rose-50/80 rounded-2xl border border-rose-100 text-xs text-rose-950 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold flex items-center gap-1.5 text-rose-800">
                              <FileText className="w-3.5 h-3.5" />
                              <span>{post.files.length} {isNepali ? 'कागजात संलग्न' : 'File(s) Attached'}</span>
                            </span>
                            <span className="text-[10px] font-black uppercase text-rose-600">PDF / Doc</span>
                          </div>
                        </div>
                      )}

                      {/* New members specific chip */}
                      {post.type === 'new_members' && post.newMembers && post.newMembers.length > 0 && (
                        <div className="p-3 bg-teal-50/80 rounded-2xl border border-teal-100 text-xs text-teal-950 space-y-1">
                          <span className="font-bold text-[11px] block text-teal-800">
                            {isNepali ? `स्वागत छ ${post.newMembers.length} नयाँ सदस्यहरूलाई:` : `Welcome ${post.newMembers.length} New Member(s):`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{post.publishedDate}</span>
                    </span>
                    <span className="text-blue-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>{isNepali ? 'विस्तृत' : 'Details'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DETAIL MODAL FOR SELECTED POST */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 sticky top-0 bg-white/95 backdrop-blur-xs z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {getPostTypeBadge(selectedPost.type)}
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{selectedPost.publishedDate}</span>
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-poppins text-slate-900 leading-tight">
                  {selectedPost.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Meeting Section */}
              {selectedPost.type === 'meeting' && (
                <div className="p-5 bg-blue-50 rounded-2xl border border-blue-200 space-y-3">
                  <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span>{isNepali ? 'बैठक तथा कार्यक्रम विवरण' : 'Meeting Details & Agenda'}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-blue-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">
                        {isNepali ? 'मिति र समय' : 'Date & Time'}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        {selectedPost.meetingDate} {selectedPost.meetingTime ? `(${selectedPost.meetingTime})` : ''}
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-blue-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">
                        {isNepali ? 'बैठक स्थान' : 'Physical Venue'}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        {selectedPost.meetingVenue || (isNepali ? 'सामुदायिक सभा भवन' : 'Community Assembly Hall')}
                      </span>
                    </div>
                  </div>

                  {selectedPost.meetingLink && (
                    <div className="pt-2">
                      <a
                        href={selectedPost.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                      >
                        <Video className="w-4 h-4" />
                        <span>{isNepali ? 'अनलाइन बैठकमा जोडिनुहोस् (Meet / Zoom)' : 'Join Online Meeting via Google Meet / Zoom'}</span>
                        <ExternalLink className="w-3.5 h-3.5 ml-1" />
                      </a>
                    </div>
                  )}

                  {selectedPost.meetingAgenda && selectedPost.meetingAgenda.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-blue-900 uppercase block">
                        {isNepali ? 'आधिकारिक कार्यसूची:' : 'Official Agendas (कार्यसूची):'}
                      </span>
                      <ol className="list-decimal list-inside space-y-1 text-xs text-slate-800 bg-white p-4 rounded-xl border border-blue-100 font-medium">
                        {selectedPost.meetingAgenda.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              )}

              {/* Attached Files & Documents */}
              {selectedPost.files && selectedPost.files.length > 0 && (
                <div className="p-5 bg-rose-50 rounded-2xl border border-rose-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                      <FileText className="w-5 h-5 text-rose-600" />
                      <span>{isNepali ? 'आधिकारिक कागजात तथा डाउनलोड योग्य फाइलहरू' : 'Official Documents & Downloadable Files'}</span>
                    </div>
                    <span className="text-xs text-rose-700 font-bold">
                      {selectedPost.files.length} {isNepali ? 'फाइलहरू' : 'File(s)'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {selectedPost.files.map((file, fIdx) => (
                      <div
                        key={file.id || `${selectedPost.id}-f-${fIdx}-${file.name}`}
                        className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-rose-200 text-xs shadow-xs"
                      >
                        <div className="flex items-center gap-3 truncate pr-4">
                          <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="truncate">
                            <span className="font-bold text-slate-900 block truncate text-sm">{file.name}</span>
                            <span className="text-[11px] text-slate-400">{file.size || 'Document file'}</span>
                          </div>
                        </div>

                        <a
                          href={file.url}
                          download={file.name}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition shadow-xs shrink-0 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{isNepali ? 'डाउनलोड' : 'Download PDF'}</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Photo Gallery in Post */}
              {selectedPost.photos && selectedPost.photos.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <ImageIcon className="w-5 h-5 text-emerald-600" />
                    <span>{isNepali ? `फोटो ग्यालरी (${selectedPost.photos.length} तस्बिरहरू)` : `Photo Album (${selectedPost.photos.length} Images)`}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedPost.photos.map((photo, pIdx) => (
                      <div
                        key={pIdx}
                        onClick={() => setSelectedPhoto(photo)}
                        className="rounded-2xl overflow-hidden aspect-video border border-slate-200 hover:border-emerald-500 cursor-pointer transition shadow-xs hover:shadow-md"
                      >
                        <img src={photo} alt={`Photo ${pIdx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Content Body */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  {isNepali ? 'पूर्ण सूचना तथा विवरण:' : 'Full Announcement & Information:'}
                </h4>
                <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  {selectedPost.content}
                </div>
              </div>

              {/* Tags */}
              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
                  {selectedPost.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleShare(selectedPost)}
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{isNepali ? 'सूचना सेयर गर्नुहोस्' : 'Share Communication'}</span>
              </button>

              <button
                onClick={() => setSelectedPost(null)}
                className="px-5 py-2 bg-[#003893] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                {isNepali ? 'बन्द गर्नुहोस्' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHOTO LIGHTBOX MODAL */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img src={selectedPhoto} alt="Zoomed preview" className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl" />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
