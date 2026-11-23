/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCommunityData } from '../context/CommunityDataContext';
import { useLanguage } from '../context/LanguageContext';
import { TabType } from '../types';
import { DEFAULT_LOGO_URL } from '../data/communityData';
import InteractiveFollowModal from './InteractiveFollowModal';
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
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Lock,
  Heart,
  IdCard,
  Shield,
  Copy,
  Check
} from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: TabType) => void;
  openCustomizer?: () => void;
}

export default function Footer({ setCurrentTab }: FooterProps) {
  const { footerLogo, colors } = useTheme();
  const { t, isNepali } = useLanguage();
  const {
    hasJoinedCommunity,
    hideJoinOption,
    isFollowingCommunity,
    followerCount,
    followerEmail,
    centralOffice
  } = useCommunityData();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopyText = (text: string, key: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      // fallback
    }
  };

  const formattedAddress = formatCentralOfficeAddress(centralOffice);
  const mapsUrl = getCentralOfficeMapsUrl(centralOffice);
  const hotlineNum = centralOffice?.hotline || centralOffice?.primaryPhone || '+977-9806389212';
  const emailAddr = centralOffice?.officialEmail || 'boteyouthcommunitynepal@gmail.com';

  const handleTabClick = (tab: TabType) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setSubscribed(false);
    }, 3000);
  };

  return (
    <footer className="bg-[#0b1329] text-slate-300 font-inter border-t-4 border-[#DC143C] relative overflow-hidden" id="main-footer">
      {/* Subtle Nepali Flag geometric background motif */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Col 1: Brand & Logo with Upload Option */}
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={footerLogo && footerLogo.trim() ? footerLogo.trim() : DEFAULT_LOGO_URL}
                  alt="Footer Logo"
                  className="w-13 h-13 rounded-full object-cover border-2 border-amber-400 bg-white shadow-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== DEFAULT_LOGO_URL) {
                      target.src = DEFAULT_LOGO_URL;
                    }
                  }}
                />
              </div>
              <div>
                <h3 className="text-base font-extrabold font-poppins text-white leading-tight">
                  BoteYouthCommunityNepal
                </h3>
                <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                  सर्लाही, नेपाल (Karmaiya, Sarlahi)
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {isNepali
                ? 'नेपालको सर्लाही जिल्ला, कर्मैयास्थित तराही बोटे समुदायको आधिकारिक डिजिटल पोर्टल। प्राचीन नदी जलयात्रा संस्कृतिको संरक्षण, बोटे भाषाको जगेर्ना, र आदिवासी युवाहरूको सशक्तीकरण।'
                : 'Official platform of the Tarahi Bote community of Karmaiya, Sarlahi District, Nepal. Preserving ancient river navigation culture, safeguarding the Bote language, and empowering indigenous youth.'}
            </p>

            {/* Social media icons */}
            <div className="flex space-x-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#DC143C] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
                title={isNepali ? 'फेसबुकमा फलो गर्नुहोस्' : 'Follow on Facebook'}
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#DC143C] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
                title={isNepali ? 'युट्युबमा हेर्नुहोस्' : 'Watch on YouTube'}
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#DC143C] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
                title={isNepali ? 'इन्स्टाग्राममा जोडिनुहोस्' : 'Follow on Instagram'}
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#003893] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
                title={isNepali ? 'ट्विटरमा फलो गर्नुहोस्' : 'Follow on Twitter/X'}
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>

            <div>
              <button
                onClick={() => handleTabClick('admin')}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 transition-colors font-medium"
              >
                <Lock className="w-3 h-3 text-slate-400" />
                <span>{isNepali ? 'व्यवस्थापक सचिवालय पोर्टल' : 'Admin Secretariat Portal'}</span>
              </button>
            </div>
          </div>

          {/* Col 2: Culture & Heritage Links */}
          <div className="space-y-4">
            <h4 className="font-poppins font-bold text-white text-sm uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>{isNepali ? 'सम्पदा तथा पहिचान' : 'Heritage & Identity'}</span>
              <span className="w-2 h-2 rounded-full bg-[#DC143C]"></span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => handleTabClick('about')}
                  className="hover:text-white text-slate-400 flex items-center transition-all hover:translate-x-1"
                >
                  <ArrowRight className="w-3 h-3 mr-2 text-[#DC143C]" />
                  {isNepali ? 'बोटे समुदाय र उत्पत्ति परिचय' : 'About Bote Community & Origins'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('history')}
                  className="hover:text-white text-slate-400 flex items-center transition-all hover:translate-x-1"
                >
                  <ArrowRight className="w-3 h-3 mr-2 text-[#DC143C]" />
                  {isNepali ? 'बोटे इतिहास र डुङ्गा निर्माण कला' : 'Bote History & Canoe Carving'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('cultures')}
                  className="hover:text-white text-slate-400 flex items-center transition-all hover:translate-x-1"
                >
                  <ArrowRight className="w-3 h-3 mr-2 text-[#DC143C]" />
                  {isNepali ? 'संस्कृति र संसारी देवी जल पूजा' : 'Cultures & Sansari Devi Puja'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('language')}
                  className="hover:text-white text-slate-400 flex items-center transition-all hover:translate-x-1"
                >
                  <ArrowRight className="w-3 h-3 mr-2 text-[#DC143C]" />
                  {isNepali ? 'तराही बोटे भाषा शब्दकोश' : 'Tarahi Bote Dialect Lexicon'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('dress')}
                  className="hover:text-white text-slate-400 flex items-center transition-all hover:translate-x-1"
                >
                  <ArrowRight className="w-3 h-3 mr-2 text-[#DC143C]" />
                  {isNepali ? 'परम्परागत पोशाक र चाँदीका गहना' : 'Traditional Culture Dress & Silver Ornaments'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Leadership & Youth Programs */}
          <div className="space-y-4">
            <h4 className="font-poppins font-bold text-white text-sm uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>{isNepali ? 'युवा नेतृत्व तथा अनुदान' : 'Youth Leadership & Grants'}</span>
              <span className="w-2 h-2 rounded-full bg-[#003893]"></span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => handleTabClick('leaders')}
                  className="hover:text-white text-slate-400 flex items-center transition-all hover:translate-x-1"
                >
                  <ArrowRight className="w-3 h-3 mr-2 text-amber-400" />
                  {isNepali ? 'युवा नेतृत्व र समिति परिचय' : 'Youth Leaders & Committee Profiles'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('empower')}
                  className="hover:text-white text-slate-400 flex items-center transition-all hover:translate-x-1"
                >
                  <ArrowRight className="w-3 h-3 mr-2 text-amber-400" />
                  {isNepali ? 'युवा सशक्तीकरण र संस्कृति संरक्षण' : 'Youth Empower & Save Our Cultures'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('scholarships')}
                  className="hover:text-white text-slate-400 flex items-center transition-all hover:translate-x-1"
                >
                  <ArrowRight className="w-3 h-3 mr-2 text-amber-400" />
                  {isNepali ? 'शैक्षिक छात्रवृत्ति २०८२/२०२६' : 'Educational Scholarships 2026'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('notices')}
                  className="hover:text-white text-slate-400 flex items-center transition-all hover:translate-x-1"
                >
                  <ArrowRight className="w-3 h-3 mr-2 text-amber-400" />
                  {isNepali ? 'आधिकारिक सूचना, बैठक र कागजात' : 'Official Notices, Meetings & Files'}
                </button>
              </li>
              <li>
                {hideJoinOption ? (
                  hasJoinedCommunity ? (
                    <button
                      onClick={() => handleTabClick('join')}
                      className="hover:text-emerald-400 text-slate-300 flex items-center transition-all hover:translate-x-1"
                    >
                      <IdCard className="w-3 h-3 mr-2 text-emerald-400" />
                      <span>{isNepali ? 'मेरो डिजिटल सदस्यता परिचयपत्र (सक्रिय)' : 'My Digital Membership Card (Active)'}</span>
                    </button>
                  ) : (
                    <div className="text-emerald-400 flex items-center text-xs py-1">
                      <CheckCircle className="w-3 h-3 mr-2 text-emerald-400 shrink-0" />
                      <span>{isNepali ? '✓ प्रमाणित समुदाय समर्थक अभिलेख' : '✓ Verified Supporter Community Record'}</span>
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => handleTabClick('join')}
                    className="hover:text-white text-slate-400 flex items-center transition-all hover:translate-x-1"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 text-amber-400" />
                    <span>{isNepali ? 'समुदाय सदस्यता फारम (डिजिटल परिचयपत्र)' : 'Community Joining Form (Get Digital ID)'}</span>
                  </button>
                )}
              </li>
              <li>
                <button
                  onClick={() => {
                    if (isFollowingCommunity) {
                      handleTabClick('follow');
                    } else {
                      setIsFollowModalOpen(true);
                    }
                  }}
                  className={`flex items-center transition-all hover:translate-x-1 ${
                    isFollowingCommunity ? 'text-emerald-400 hover:text-emerald-300' : 'hover:text-white text-slate-400'
                  }`}
                  title={
                    isFollowingCommunity
                      ? (isNepali ? `फलो गरिएको: ${followerEmail || 'प्रमाणित जिमेल'}` : `Following with ${followerEmail || 'verified Gmail'}`)
                      : (isNepali ? 'एक पटक जिमेलबाट फलो गर्नुहोस्' : 'One-time follow with Gmail')
                  }
                >
                  {isFollowingCommunity ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-2 text-emerald-400 shrink-0" />
                      <span>{isNepali ? `समुदाय फलो गरिएको (${followerCount}) • प्रमाणित` : `Following Community (${followerCount}) • Verified`}</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-3 h-3 mr-2 text-red-400 fill-red-400 shrink-0" />
                      <span>{isNepali ? `हाम्रो समुदाय फलो गर्नुहोस् (${followerCount})` : `Follow Our Community (${followerCount})`}</span>
                    </>
                  )}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Coordinates & Newsletter */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-poppins font-bold text-white text-sm uppercase tracking-wider hover:text-red-400 transition flex items-center gap-1.5 group"
                title={isNepali ? 'गुगल म्यापमा कर्मैया केन्द्रीय कार्यालय हेर्नुहोस्' : 'View Karmaiya Central Office on Google Maps'}
              >
                <span>{isNepali ? (centralOffice?.officeNameNepali || 'कर्मैया केन्द्रीय कार्यालय') : (centralOffice?.officeName || 'Karmaiya Central Office')}</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
              </a>
              {centralOffice?.officeNameNepali && (
                <span className="text-[10px] font-nepali text-red-300 bg-red-950/60 px-2 py-0.5 rounded-full border border-red-800/60">
                  {isNepali ? 'केन्द्रीय कार्यालय' : 'Central Office'}
                </span>
              )}
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              {/* Address - Fully Clickable to Google Maps */}
              <div className="flex items-start justify-between group bg-slate-900/60 hover:bg-slate-900 p-2 rounded-xl border border-slate-800/80 transition">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start flex-1 min-w-0 pr-1.5 hover:text-white transition"
                  title={isNepali ? 'गुगल म्यापमा ठेगाना हेर्नुहोस्' : 'Click to view Karmaiya Central Office location in Google Maps'}
                >
                  <MapPin className="w-4 h-4 mr-2 text-[#DC143C] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="leading-relaxed text-slate-300 group-hover:text-white transition-colors">
                    {formattedAddress}
                  </span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopyText(formattedAddress, 'address')}
                  className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 shrink-0 transition"
                  title={isNepali ? 'ठेगाना कपी गर्नुहोस्' : 'Copy full address'}
                >
                  {copiedKey === 'address' ? (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> {isNepali ? 'कपी गरियो' : 'Copied'}
                    </span>
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>

              {/* Hotline - Fully Clickable tel: */}
              <div className="flex items-center justify-between group bg-slate-900/60 hover:bg-slate-900 p-2 rounded-xl border border-slate-800/80 transition">
                <a
                  href={`tel:${formatTelLink(hotlineNum)}`}
                  className="flex items-center flex-1 min-w-0 hover:text-amber-300 transition"
                  title={isNepali ? 'सिधै फोन गर्नुहोस्' : 'Click to call Hotline directly'}
                >
                  <Phone className="w-4 h-4 mr-2 text-amber-400 shrink-0 group-hover:rotate-12 transition-transform" />
                  <span className="truncate">
                    <span className="text-slate-400">{isNepali ? 'हटलाइन:' : 'Hotline:'}</span>{' '}
                    <strong className="text-amber-300 font-mono tracking-tight">{hotlineNum}</strong>
                  </span>
                </a>
                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href={`tel:${formatTelLink(hotlineNum)}`}
                    className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-md hover:bg-amber-500 hover:text-slate-950 transition"
                    title={isNepali ? 'तत्काल कल गर्नुहोस्' : 'Call immediately'}
                  >
                    {isNepali ? 'कल' : 'Call'}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopyText(hotlineNum, 'phone')}
                    className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition"
                    title={isNepali ? 'फोन नम्बर कपी गर्नुहोस्' : 'Copy hotline number'}
                  >
                    {copiedKey === 'phone' ? (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Email - Fully Clickable mailto: */}
              <div className="flex items-center justify-between group bg-slate-900/60 hover:bg-slate-900 p-2 rounded-xl border border-slate-800/80 transition">
                <a
                  href={`mailto:${emailAddr}`}
                  className="flex items-center flex-1 min-w-0 hover:text-blue-300 transition"
                  title={isNepali ? 'इमेल पठाउनुहोस्' : 'Click to compose email'}
                >
                  <Mail className="w-4 h-4 mr-2 text-blue-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="truncate text-slate-300 hover:text-white font-mono text-[11px]">
                    {emailAddr}
                  </span>
                </a>
                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href={`mailto:${emailAddr}`}
                    className="text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-md hover:bg-blue-500 hover:text-slate-950 transition"
                    title={isNepali ? 'इमेल पठाउनुहोस्' : 'Send email'}
                  >
                    {isNepali ? 'इमेल' : 'Email'}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopyText(emailAddr, 'email')}
                    className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition"
                    title={isNepali ? 'इमेल कपी गर्नुहोस्' : 'Copy official email'}
                  >
                    {copiedKey === 'email' ? (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              {centralOffice?.daoRegistrationNo && (
                <p className="text-[11px] text-slate-400 font-mono px-1">
                  {isNepali ? 'प्रशासन दर्ता:' : 'DAO Reg:'} {centralOffice.daoRegistrationNo} | SWC: {centralOffice.swcAffiliationNo}
                </p>
              )}
            </div>

            {/* Newsletter form */}
            <form onSubmit={handleSubscribe} className="space-y-2 pt-2">
              <p className="text-[11px] font-bold text-white">
                {isNepali ? 'सांस्कृतिक समाचार सदस्यता लिनुहोस्' : 'Join Cultural Newsletter'}
              </p>
              {subscribed ? (
                <div className="bg-green-900/50 border border-green-600 text-green-200 text-xs p-2 rounded-xl flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{isNepali ? 'सदस्यता लिनुभएकोमा धन्यवाद!' : 'Thank you for subscribing!'}</span>
                </div>
              ) : (
                <div className="flex">
                  <input
                    type="email"
                    required
                    placeholder={isNepali ? 'इमेल प्रविष्ट गर्नुहोस्...' : 'Enter email...'}
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="bg-slate-900 text-white text-xs px-3 py-2 rounded-l-xl border border-slate-700 focus:outline-none focus:border-[#DC143C] flex-1"
                  />
                  <button
                    type="submit"
                    className="bg-[#DC143C] hover:bg-[#b51031] text-white text-xs font-bold px-3 py-2 rounded-r-xl transition-colors cursor-pointer"
                  >
                    {isNepali ? 'दर्ता' : 'Join'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar: Bento Grid Motto & Copyright */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center space-x-2">
            <span>🇳🇵</span>
            <span>&copy; 2026 {t('brand.org_full')}. {t('footer.rights')}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button onClick={() => handleTabClick('follow')} className="hover:text-white transition-colors cursor-pointer">
              {t('nav.community')}
            </button>
            <button
              onClick={() => handleTabClick('admin')}
              className="text-slate-500 hover:text-slate-300 text-[11px] flex items-center gap-1 transition-colors ml-2 cursor-pointer"
              title={isNepali ? 'आधिकारिक प्रशासनिक पोर्टल' : 'Authorized Administrative Portal'}
            >
              <Lock className="w-3 h-3" />
              <span>{isNepali ? 'व्यवस्थापक' : 'Admin'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Follow Modal with One-Time Gmail Logic */}
      <InteractiveFollowModal
        isOpen={isFollowModalOpen}
        onClose={() => setIsFollowModalOpen(false)}
      />
    </footer>
  );
}
