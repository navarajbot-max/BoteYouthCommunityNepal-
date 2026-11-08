/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Layout,
  Table,
  Edit3,
  Check,
  Copy,
  Download,
  Plus,
  Trash2,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  Info,
  ChevronRight,
  Eye,
  RefreshCw,
  FileCode,
  Upload,
  Archive
} from 'lucide-react';
import { generateBloggerXmlTheme } from '../utils/themeGenerators';
import { useTheme } from '../context/ThemeContext';

interface LeaderItem {
  id: string;
  name: string;
  nepaliName: string;
  role: string;
  term: string;
  bio: string;
  photoUrl: string;
  colorRibbon: string;
}

const INITIAL_LEADERS: LeaderItem[] = [
  {
    id: 'leader-navaraj',
    name: 'Navaraj Bot',
    nepaliName: 'नवराज बोटे',
    role: 'Youth Leader Chairman',
    term: '2024 — 2027 (3-Year Term)',
    bio: 'Elected Youth Leader Chairman leading Tarahi cultural revitalization, indigenous river conservation, and youth education.',
    photoUrl: '/uploads/Leader_Profile_Photo_1789693773254_i4fzp.png',
    colorRibbon: '#DC143C'
  },
  {
    id: 'leader-santosh',
    name: 'Santosh Bote',
    nepaliName: 'सन्तोष बोटे',
    role: 'Vice-Chair: Santosh Bote — Vice-Chairman & River Patrol Lead',
    term: '2024 — 2027',
    bio: 'Youth Leader Vice-Chairman & River Patrol Lead coordinating Bagmati river conservation patrols, sports, and canoe racing tournaments.',
    photoUrl: '/assets/leader_avatar_placeholder.svg',
    colorRibbon: '#DC143C'
  },
  {
    id: 'leader-puja',
    name: 'Puja Bote',
    nepaliName: 'पूजा बोटे',
    role: 'General Sec: Puja Bote — General Secretary & Tarahi Documentation Officer',
    term: '2024 — 2027',
    bio: 'Youth General Secretary & Tarahi Documentation Officer responsible for executive records, Tarahi audio lexicon recording, and scholarship filing review.',
    photoUrl: '/assets/leader_avatar_placeholder.svg',
    colorRibbon: '#003893'
  },
  {
    id: 'leader-anita',
    name: 'Anita Bote',
    nepaliName: 'अनिता बोटे',
    role: 'Treasurer: Anita Bote — Central Treasurer & Women Cooperative Liaison',
    term: '2024 — 2027',
    bio: 'Youth Leader Central Treasurer & Women Cooperative Officer managing central treasury funds, student scholarships, and women cooperative micro-enterprises.',
    photoUrl: '/assets/leader_avatar_placeholder.svg',
    colorRibbon: '#F59E0B'
  },
  {
    id: 'leader-bikash',
    name: 'Bikash Bote',
    nepaliName: 'विकास बोटे',
    role: 'Youth Member & Conservation Lead',
    term: '2024 — 2027',
    bio: 'Executive Youth Member spearheading Saturday river cleanup patrols and language study circles in Karmaiya, Sarlahi.',
    photoUrl: '/assets/leader_avatar_placeholder.svg',
    colorRibbon: '#003893'
  },
  {
    id: 'leader-lalbahadur',
    name: 'Elder Lal Bahadur Bote',
    nepaliName: 'लाल बहादुर बोटे (अध्यक्ष)',
    role: 'Community Chairman',
    term: 'Standing Term',
    bio: 'Community elder and chairman of the Central Bote Committee, custodian of customary laws and canoe traditions.',
    photoUrl: '/assets/leader_avatar_placeholder.svg',
    colorRibbon: '#F59E0B'
  },
  {
    id: 'leader-sita',
    name: 'Sita Bote',
    nepaliName: 'सीता बोटे (उपाध्यक्ष)',
    role: 'Community Vice President',
    term: 'Standing Term',
    bio: 'Community Elder Vice President championing indigenous women rights, sacred herbal river knowledge, and folk folklore preservation.',
    photoUrl: '/assets/leader_avatar_placeholder.svg',
    colorRibbon: '#DC143C'
  },
  {
    id: 'leader-manbahadur',
    name: 'Man Bahadur Bote',
    nepaliName: 'मान बहादुर बोटे (सचिव)',
    role: 'Community Secretary',
    term: 'Standing Term',
    bio: 'Senior Community Secretary coordinating liaison with Bagmati Municipality, land tenure documentation, and inter-district council sessions.',
    photoUrl: '/assets/leader_avatar_placeholder.svg',
    colorRibbon: '#003893'
  },
  {
    id: 'leader-phoolmaya',
    name: 'Phool Maya Bote',
    nepaliName: 'फूलमाया बोटे',
    role: 'Women Welfare Lead',
    term: 'Standing Term',
    bio: 'Director of Women Welfare and Traditional Handicrafts, leading ancestral reed weaving and cultural dress embroidery workshops.',
    photoUrl: '/assets/leader_avatar_placeholder.svg',
    colorRibbon: '#DC143C'
  },
  {
    id: 'leader-ramkrishna',
    name: 'Ram Krishna Bote',
    nepaliName: 'रामकृष्ण बोटे',
    role: 'Culture & River Rituals Custodian',
    term: 'Standing Term',
    bio: 'Master Craftsman of single-log dugout canoes (Ek-Dunge Nau) and head priest for the sacred Jal Puja river ceremonies.',
    photoUrl: '/assets/leader_avatar_placeholder.svg',
    colorRibbon: '#003893'
  }
];

export default function BloggerAdminPanelManager() {
  const { colors, headerLogo } = useTheme();
  const [activeTab, setActiveTab] = useState<'bento' | 'pillars' | 'leaders' | 'guide'>('bento');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Bento Grid Editable State
  const [bentoState, setBentoState] = useState({
    pillText: 'BENTO GRID • COMMUNITY MATRIX',
    title: 'BOTE YOUTH GRID OVERVIEW',
    subtitle: 'Explore heritage, language, craftsmanship, council leaders, and digital identity through interconnected Bento modules.',
    heritageTag: 'INDIGENOUS HERITAGE • Karmaiya, Sarlahi • Bagmati River',
    heritageTitle: 'REVITALIZING ANCIENT WATER TRADITIONS & YOUTH LEADERSHIP',
    heritageDesc: 'The Bote indigenous community honors ancestral river navigation, single-log dugout canoes (Ek-Dunge Nau), and sacred water rites while educating the next generation of Nepali leaders.',
    traditionsTitle: 'Jal Puja & River Rites',
    traditionsDesc: 'Sacred offerings to river deities ensuring safe boat passage and rich fish harvests.',
    dialectTitle: 'Tarahi Bote Lexicon',
    dialectDesc: 'Preserve an endangered oral dialect with searchable words and phonetic pronunciation.'
  });

  // Core Pillars Editable State
  const [pillarsState, setPillarsState] = useState({
    tag: 'CORE PILLARS OF BOTE COMMUNITY',
    title: 'Heritage Preserved, Generation Empowered',
    desc: 'From the banks of the Bagmati River in Karmaiya, Sarlahi to settlements across inner-Terai Nepal, our community unites to protect our indigenous identity.',
    p1Title: 'Bote History & Origins',
    p1Desc: 'The legend of the tree trunk origin ("Bot"), river ferry kings, and the single-log dugout canoe (Ek-Dunge Nau).',
    p2Title: 'Cultures & River Rituals',
    p2Desc: 'Sacred river deities, Sansari Devi Puja, Jal Puja, Maghe Sankranti boat races, and ancient animist water worship.',
    p3Title: 'Bote Language (Tarahi)',
    p3Desc: 'Saving the endangered Tarahi Bote dialect with searchable community audio lexicon dictionary.',
    p4Title: 'Culture Dress & Jewelry',
    p4Desc: 'Traditional Gunya, Cholo, Dhoti, and solid silver Hansuli necklaces, Bulaki nose rings, and Kalli anklets.'
  });

  // Leadership Roster State
  const [leaders, setLeaders] = useState<LeaderItem[]>(INITIAL_LEADERS);

  const handleLeaderChange = (id: string, field: keyof LeaderItem, value: string) => {
    setLeaders((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const handleAddLeader = () => {
    const newId = `leader-custom-${Date.now()}`;
    const newLeader: LeaderItem = {
      id: newId,
      name: 'New Community Leader',
      nepaliName: 'नयाँ सदस्य',
      role: 'Executive Member',
      term: '2024 — 2027',
      bio: 'Edit this profile in Blogger Layout table to update role, term, bio, and photo.',
      photoUrl: '/assets/leader_avatar_placeholder.svg',
      colorRibbon: '#DC143C'
    };
    setLeaders([...leaders, newLeader]);
  };

  const handleDeleteLeader = (id: string) => {
    if (leaders.length <= 1) return;
    setLeaders(leaders.filter((l) => l.id !== id));
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  // Generate XML code with live customized values
  const generateCustomXml = () => {
    return generateBloggerXmlTheme({
      siteName: 'BoteYouthCommunityNepal',
      primaryColor: colors.primary,
      secondaryColor: colors.secondary,
      logoUrl: headerLogo,
      bentoConfig: bentoState,
      pillarsConfig: pillarsState,
      leaders: leaders.map((l) => ({
        id: l.id,
        name: l.name,
        nepaliName: l.nepaliName,
        role: l.role,
        term: l.term,
        bio: l.bio,
        photoUrl: l.photoUrl,
        colorRibbon: l.colorRibbon
      }))
    });
  };

  const handleDownloadXml = () => {
    const xml = generateCustomXml();
    const blob = new Blob([xml], { type: 'text/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Bote-Youth-Community-Nepal-Blogger-Theme-v3.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    try {
      const JSZipModule = (await import('jszip')).default;
      const zip = new JSZipModule();
      const xml = generateCustomXml();

      const readme = `================================================================================
BOTE YOUTH COMMUNITY NEPAL - BLOGGER THEME PACKAGE (v3.0.0)
================================================================================
Theme Name: Bote Youth Community Nepal - Official Portal & Community Matrix
Version: 3.0.0 (Blogger v3.xml)
Author: Bote Youth Community Nepal (BYCN)
Headquarters: Ward No. 11, Karmaiya, Bagmati Municipality, Sarlahi District, Nepal
Website: https://boteyouthcommunity.org.np/
================================================================================

PACKAGE CONTENTS:
1. Bote-Youth-Community-Nepal-Blogger-Theme-v3.xml
   - The primary Blogger Theme file with all working features:
     * Google Search Console Verification Meta Tag pre-installed in <head>
     * Executive Officers Leadership Roster (10 widgets: Chair, Vice-Chair, Gen Sec, Treasurer, etc.)
     * Online Membership Registration & Digital ID Card Generator
     * Educational Scholarship Desk Form
     * Live Community Voice Voting Poll
     * In-Browser Website Control Center (Settings button ⚙)
     * Responsive Bento Grid Heritage Matrix & Lexicon Showcase

2. HOW-TO-INSTALL-IN-BLOGGER.txt
   - Step-by-step restore and HTML installation guide for Blogger.com.

3. GOOGLE-SEARCH-CONSOLE-SETUP.txt
   - How to verify site ownership in Google Search Console.
================================================================================`;

      const installGuide = `HOW TO INSTALL THEME IN BLOGGER (DETAILED GUIDE)
--------------------------------------------------
Method A: One-Click Theme Restore (Recommended)
1. Extract this ZIP archive on your computer or phone.
2. Open your web browser and navigate to https://www.blogger.com
3. Select your Bote Community blog.
4. Click 'Theme' in the left menu.
5. Beside the 'Customize' button, click the downward arrow (▼).
6. Select 'Restore' and then click 'Upload'.
7. Select the file 'Bote-Youth-Community-Nepal-Blogger-Theme-v3.xml'.
8. Wait a few seconds until Blogger says 'Theme restored'.

Method B: Direct HTML Edit (Alternative)
1. Open 'Bote-Youth-Community-Nepal-Blogger-Theme-v3.xml' in Notepad or text editor.
2. Select all text (Ctrl+A) and copy it (Ctrl+C).
3. On Blogger.com -> Theme -> click the arrow beside Customize -> click 'Edit HTML'.
4. Delete all existing code in the editor.
5. Paste your copied code (Ctrl+V) and click the 'Save' diskette icon.`;

      const gscGuide = `GOOGLE SEARCH CONSOLE VERIFICATION GUIDE
----------------------------------------
Verification Code: ZZ8jKxT9NeljW8zcOXO1HjIn5-weF8pC0qVd4hsZoEw

1. HTML TAG VERIFICATION:
   The tag is already in this theme:
   <meta name="google-site-verification" content="ZZ8jKxT9NeljW8zcOXO1HjIn5-weF8pC0qVd4hsZoEw" />
   Simply upload the theme to Blogger, then go to Google Search Console and tap 'Verify'.

2. MERCANTILE .NP DOMAIN DNS TXT VERIFICATION (For boteyouthcommunity.org.np):
   If you registered boteyouthcommunity.org.np at register.com.np:
   - Add a DNS TXT Record:
     Host: @
     Value: google-site-verification=ZZ8jKxT9NeljW8zcOXO1HjIn5-weF8pC0qVd4hsZoEw`;

      zip.file('Bote-Youth-Community-Nepal-Blogger-Theme-v3.xml', xml);
      zip.file('README-HOW-TO-INSTALL.txt', readme);
      zip.file('HOW-TO-INSTALL-IN-BLOGGER.txt', installGuide);
      zip.file('GOOGLE-SEARCH-CONSOLE-SETUP.txt', gscGuide);

      const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Bote-Youth-Community-Nepal-Blogger-Theme-v3.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      window.location.href = '/Bote-Youth-Community-Nepal-Blogger-Theme-v3.zip';
    }
  };

  // HTML Snippets ready for Blogger Layout Gadgets
  const bentoGadgetSnippet = `<!-- Blogger Gadget: Bento Grid Overview & Modules -->
<div class="byc-bento-grid">
  <div class="byc-bento-card-hero">
    <div class="byc-bento-tag">${bentoState.heritageTag}</div>
    <h2 class="byc-hero-h2">${bentoState.heritageTitle}</h2>
    <p class="byc-hero-desc">${bentoState.heritageDesc}</p>
    <div class="byc-hero-actions">
      <a class="byc-btn-red" href="#core-pillars">Explore History &rarr;</a>
      <a class="byc-btn-outline" href="#leadership-roster">Youth Council</a>
    </div>
  </div>

  <div class="byc-bento-card">
    <span class="byc-card-badge">TRADITIONS</span>
    <h3 class="byc-card-title">${bentoState.traditionsTitle}</h3>
    <p class="byc-card-text">${bentoState.traditionsDesc}</p>
    <a class="byc-card-link" href="#core-pillars">Learn More &rarr;</a>
  </div>

  <div class="byc-bento-card">
    <span class="byc-card-badge byc-badge-red">DIALECT</span>
    <h3 class="byc-card-title">${bentoState.dialectTitle}</h3>
    <p class="byc-card-text">${bentoState.dialectDesc}</p>
    <a class="byc-card-link byc-link-red" href="#core-pillars">Open Lexicon &rarr;</a>
  </div>
</div>`;

  const pillarsGadgetSnippet = `<!-- Blogger Gadget: Core Pillars 4-Card Matrix -->
<div class="byc-pillars-grid">
  <div class="byc-pillar-card">
    <div class="byc-pillar-icon">◉</div>
    <h3 class="byc-pillar-title">${pillarsState.p1Title}</h3>
    <p class="byc-pillar-text">${pillarsState.p1Desc}</p>
    <a class="byc-pillar-link" href="#">Read History &rarr;</a>
  </div>

  <div class="byc-pillar-card">
    <div class="byc-pillar-icon">⚓</div>
    <h3 class="byc-pillar-title">${pillarsState.p2Title}</h3>
    <p class="byc-pillar-text">${pillarsState.p2Desc}</p>
    <a class="byc-pillar-link" href="#">Explore Rituals &rarr;</a>
  </div>

  <div class="byc-pillar-card">
    <div class="byc-pillar-icon">▣</div>
    <h3 class="byc-pillar-title">${pillarsState.p3Title}</h3>
    <p class="byc-pillar-text">${pillarsState.p3Desc}</p>
    <a class="byc-pillar-link" href="#">Open Lexicon &rarr;</a>
  </div>

  <div class="byc-pillar-card">
    <div class="byc-pillar-icon">♢</div>
    <h3 class="byc-pillar-title">${pillarsState.p4Title}</h3>
    <p class="byc-pillar-text">${pillarsState.p4Desc}</p>
    <a class="byc-pillar-link" href="#">View Culture &rarr;</a>
  </div>
</div>`;

  const leadersGadgetSnippet = `<!-- Blogger Gadget: Executive Leadership Roster -->
<div class="byc-leaders-grid">
${leaders
  .map(
    (l) => `  <div class="byc-leader-card">
    <div class="byc-leader-ribbon" style="background:${l.colorRibbon};"></div>
    <img alt="${l.name}" class="byc-leader-avatar" src="${l.photoUrl}"/>
    <div class="byc-leader-name">${l.name}</div>
    <div class="byc-leader-nepali">${l.nepaliName}</div>
    <div class="byc-leader-role">● ${l.role}</div>
    <p class="byc-leader-bio">${l.bio}</p>
    <div class="byc-leader-term">${l.term}</div>
    <a class="byc-leader-btn" href="#">Full Dossier &rarr;</a>
  </div>`
  )
  .join('\n')}
</div>`;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#DC143C]">
            <Layout className="w-4 h-4 text-[#003893]" />
            <span>Blogger Admin Panel &amp; Edit Tables</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-poppins text-slate-900 leading-tight">
            Connect &amp; Update Everything in Blogger Layout
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            In Blogger, you do not need code edits to change content. The XML theme provides native <code className="bg-slate-100 text-[#003893] px-1.5 py-0.5 rounded font-mono font-bold">&lt;b:section&gt;</code> admin zones in your <strong>Blogger.com &rarr; Layout</strong> panel to edit the <strong>Bento Grid</strong>, <strong>Core Pillars</strong>, and <strong>Leadership Roster</strong> directly from an edit table.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleDownloadZip}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-5 py-3 rounded-full transition-all shadow-md flex items-center space-x-2 cursor-pointer ring-2 ring-amber-300"
          >
            <Archive className="w-4 h-4 text-white" />
            <span>Download Theme (.ZIP)</span>
          </button>
          <a
            href="/Bote-Youth-Community-Nepal-Blogger-Theme-v3.zip"
            download="Bote-Youth-Community-Nepal-Blogger-Theme-v3.zip"
            className="bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold px-4 py-3 rounded-full transition-all shadow-xs flex items-center space-x-1.5"
          >
            <Archive className="w-4 h-4 text-amber-700" />
            <span>Direct .ZIP (22 KB)</span>
          </a>
          <button
            onClick={handleDownloadXml}
            className="bg-[#003893] hover:bg-[#002766] text-white text-xs font-black px-5 py-3 rounded-full transition-all shadow-md flex items-center space-x-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>Download .XML</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('bento')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'bento'
              ? 'bg-[#DC143C] text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. Bento Grid &amp; Community Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('pillars')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'pillars'
              ? 'bg-[#003893] text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>2. Core Pillars of Bote Community</span>
        </button>

        <button
          onClick={() => setActiveTab('leaders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'leaders'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>3. Executive Leadership Roster (Table)</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'guide'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Info className="w-4 h-4 text-amber-400" />
          <span>Blogger Admin Panel Tutorial</span>
        </button>
      </div>

      {/* TAB 1: BENTO GRID & COMMUNITY MATRIX */}
      {activeTab === 'bento' && (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="font-poppins font-extrabold text-slate-900 text-sm block">
                Bento Grid &amp; Community Matrix Admin Fields
              </span>
              <p className="text-xs text-slate-600">
                In Blogger.com &rarr; Layout &rarr; "BENTO GRID • COMMUNITY MATRIX", click the pencil (Edit) icon to customize these text values.
              </p>
            </div>
            <button
              onClick={() => handleCopyCode(bentoGadgetSnippet, 'bento')}
              className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm shrink-0"
            >
              {copiedSection === 'bento' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'bento' ? 'Copied HTML!' : 'Copy Blogger Gadget HTML'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Header & Overview Inputs */}
            <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white">
              <h4 className="font-poppins font-extrabold text-sm text-[#DC143C]">
                Header &amp; Tagline Settings
              </h4>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Pill Tag</label>
                <input
                  type="text"
                  value={bentoState.pillText}
                  onChange={(e) => setBentoState({ ...bentoState, pillText: e.target.value })}
                  className="w-full text-xs font-semibold px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Main Heading</label>
                <input
                  type="text"
                  value={bentoState.title}
                  onChange={(e) => setBentoState({ ...bentoState, title: e.target.value })}
                  className="w-full text-xs font-semibold px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Subheading Description</label>
                <textarea
                  rows={2}
                  value={bentoState.subtitle}
                  onChange={(e) => setBentoState({ ...bentoState, subtitle: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Heritage Banner Inputs */}
            <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white">
              <h4 className="font-poppins font-extrabold text-sm text-[#003893]">
                Indigenous Heritage Banner Module
              </h4>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Location / Tag</label>
                <input
                  type="text"
                  value={bentoState.heritageTag}
                  onChange={(e) => setBentoState({ ...bentoState, heritageTag: e.target.value })}
                  className="w-full text-xs font-semibold px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Heritage Headline</label>
                <input
                  type="text"
                  value={bentoState.heritageTitle}
                  onChange={(e) => setBentoState({ ...bentoState, heritageTitle: e.target.value })}
                  className="w-full text-xs font-semibold px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Canoe &amp; Community Narrative</label>
                <textarea
                  rows={2}
                  value={bentoState.heritageDesc}
                  onChange={(e) => setBentoState({ ...bentoState, heritageDesc: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Traditions Module */}
            <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white">
              <h4 className="font-poppins font-extrabold text-sm text-slate-900 flex items-center justify-between">
                <span>Traditions: Jal Puja Module</span>
                <span className="text-xs bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-full font-bold">Traditions</span>
              </h4>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Title</label>
                <input
                  type="text"
                  value={bentoState.traditionsTitle}
                  onChange={(e) => setBentoState({ ...bentoState, traditionsTitle: e.target.value })}
                  className="w-full text-xs font-semibold px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={bentoState.traditionsDesc}
                  onChange={(e) => setBentoState({ ...bentoState, traditionsDesc: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Dialect Module */}
            <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white">
              <h4 className="font-poppins font-extrabold text-sm text-slate-900 flex items-center justify-between">
                <span>Dialect: Tarahi Bote Lexicon</span>
                <span className="text-xs bg-red-50 text-red-600 px-2.5 py-0.5 rounded-full font-bold">Dialect</span>
              </h4>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Title</label>
                <input
                  type="text"
                  value={bentoState.dialectTitle}
                  onChange={(e) => setBentoState({ ...bentoState, dialectTitle: e.target.value })}
                  className="w-full text-xs font-semibold px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={bentoState.dialectDesc}
                  onChange={(e) => setBentoState({ ...bentoState, dialectDesc: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CORE PILLARS OF BOTE COMMUNITY */}
      {activeTab === 'pillars' && (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="font-poppins font-extrabold text-slate-900 text-sm block">
                Core Pillars 4-Card Matrix Admin Fields
              </span>
              <p className="text-xs text-slate-600">
                In Blogger Layout &rarr; "CORE PILLARS OF BOTE COMMUNITY", click Edit to modify any of the 4 pillar cards.
              </p>
            </div>
            <button
              onClick={() => handleCopyCode(pillarsGadgetSnippet, 'pillars')}
              className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm shrink-0"
            >
              {copiedSection === 'pillars' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'pillars' ? 'Copied HTML!' : 'Copy Gadget HTML'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pillar 1: History */}
            <div className="border border-slate-200 border-t-4 border-t-[#DC143C] rounded-2xl p-5 space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#DC143C] uppercase tracking-wider">Pillar 1: History</span>
                <span className="text-base font-bold">◉</span>
              </div>
              <input
                type="text"
                value={pillarsState.p1Title}
                onChange={(e) => setPillarsState({ ...pillarsState, p1Title: e.target.value })}
                className="w-full text-xs font-bold px-3 py-2 border border-slate-300 rounded-lg"
              />
              <textarea
                rows={2}
                value={pillarsState.p1Desc}
                onChange={(e) => setPillarsState({ ...pillarsState, p1Desc: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            {/* Pillar 2: Rituals */}
            <div className="border border-slate-200 border-t-4 border-t-[#003893] rounded-2xl p-5 space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#003893] uppercase tracking-wider">Pillar 2: Culture</span>
                <span className="text-base font-bold">⚓</span>
              </div>
              <input
                type="text"
                value={pillarsState.p2Title}
                onChange={(e) => setPillarsState({ ...pillarsState, p2Title: e.target.value })}
                className="w-full text-xs font-bold px-3 py-2 border border-slate-300 rounded-lg"
              />
              <textarea
                rows={2}
                value={pillarsState.p2Desc}
                onChange={(e) => setPillarsState({ ...pillarsState, p2Desc: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            {/* Pillar 3: Language */}
            <div className="border border-slate-200 border-t-4 border-t-amber-500 rounded-2xl p-5 space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-600 uppercase tracking-wider">Pillar 3: Language</span>
                <span className="text-base font-bold">▣</span>
              </div>
              <input
                type="text"
                value={pillarsState.p3Title}
                onChange={(e) => setPillarsState({ ...pillarsState, p3Title: e.target.value })}
                className="w-full text-xs font-bold px-3 py-2 border border-slate-300 rounded-lg"
              />
              <textarea
                rows={2}
                value={pillarsState.p3Desc}
                onChange={(e) => setPillarsState({ ...pillarsState, p3Desc: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            {/* Pillar 4: Dress & Jewelry */}
            <div className="border border-slate-200 border-t-4 border-t-[#DC143C] rounded-2xl p-5 space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#DC143C] uppercase tracking-wider">Pillar 4: Dress &amp; Jewelry</span>
                <span className="text-base font-bold">♢</span>
              </div>
              <input
                type="text"
                value={pillarsState.p4Title}
                onChange={(e) => setPillarsState({ ...pillarsState, p4Title: e.target.value })}
                className="w-full text-xs font-bold px-3 py-2 border border-slate-300 rounded-lg"
              />
              <textarea
                rows={2}
                value={pillarsState.p4Desc}
                onChange={(e) => setPillarsState({ ...pillarsState, p4Desc: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EXECUTIVE LEADERSHIP ROSTER (TABLE) */}
      {activeTab === 'leaders' && (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="font-poppins font-extrabold text-slate-900 text-sm block">
                Executive Leadership Roster Edit Table
              </span>
              <p className="text-xs text-slate-600">
                Manage all leaders (Navaraj Bot, Santosh Bote, Puja Bote, Elder Lal Bahadur Bote, and community council members).
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleAddLeader}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Leader</span>
              </button>
              <button
                onClick={() => handleCopyCode(leadersGadgetSnippet, 'leaders')}
                className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
              >
                {copiedSection === 'leaders' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Gadget HTML</span>
              </button>
            </div>
          </div>

          {/* Leaders Editable Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-3 w-16">Photo</th>
                  <th className="p-3 w-36">Name (English)</th>
                  <th className="p-3 w-32">Nepali Name</th>
                  <th className="p-3 w-40">Role</th>
                  <th className="p-3 w-28">Term</th>
                  <th className="p-3">Bio / Summary</th>
                  <th className="p-3 w-14 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {leaders.map((leader) => (
                  <tr key={leader.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <label className="cursor-pointer group relative block w-10 h-10 rounded-xl overflow-hidden border border-slate-300 shadow-sm" title="Click to upload leader photo from device">
                        <img
                          src={leader.photoUrl && leader.photoUrl.trim() && !leader.photoUrl.includes('images.unsplash.com') ? leader.photoUrl.trim() : '/assets/leader_avatar_placeholder.svg'}
                          alt={leader.name}
                          className="w-full h-full object-cover group-hover:opacity-70 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Upload className="w-3.5 h-3.5 text-white" />
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              const r = new FileReader();
                              r.onload = (ev) => {
                                handleLeaderChange(leader.id, 'photoUrl', ev.target?.result as string);
                              };
                              r.readAsDataURL(f);
                            }
                          }}
                        />
                      </label>
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={leader.name}
                        onChange={(e) => handleLeaderChange(leader.id, 'name', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={leader.nepaliName}
                        onChange={(e) => handleLeaderChange(leader.id, 'nepaliName', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={leader.role}
                        onChange={(e) => handleLeaderChange(leader.id, 'role', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-bold text-[#DC143C] focus:outline-none focus:ring-1 focus:ring-red-500 text-xs"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={leader.term}
                        onChange={(e) => handleLeaderChange(leader.id, 'term', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={leader.bio}
                        onChange={(e) => handleLeaderChange(leader.id, 'bio', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDeleteLeader(leader.id)}
                        className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Remove Leader"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BLOGGER ADMIN PANEL TUTORIAL */}
      {activeTab === 'guide' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 space-y-4">
            <h3 className="font-poppins font-black text-base text-[#003893] flex items-center gap-2">
              <Layout className="w-5 h-5 text-[#DC143C]" />
              <span>How to Use Blogger Layout as Your Admin Panel:</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-4 rounded-xl border border-blue-100 space-y-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">1</span>
                <p className="font-bold text-slate-900">Upload Blogger XML v3.0</p>
                <p className="text-slate-600">
                  Go to <strong>Blogger.com &rarr; Theme</strong> &rarr; Click the 3 dots next to Customize &rarr; <strong>Restore</strong> &rarr; Upload the downloaded XML.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-blue-100 space-y-2">
                <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center text-xs">2</span>
                <p className="font-bold text-slate-900">Open Blogger "Layout" (लेआउट)</p>
                <p className="text-slate-600">
                  Click <strong>Layout</strong> in the left Blogger menu. You will see 3 dedicated gadget sections ready for visual editing.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-blue-100 space-y-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">3</span>
                <p className="font-bold text-slate-900">Click ✏️ Edit &amp; Save</p>
                <p className="text-slate-600">
                  Click the pencil icon on any section or gadget. Update photo links, leader names, or text in the table, and hit <strong>Save</strong>!
                </p>
              </div>
            </div>

            {/* Visual Representation of Blogger Layout */}
            <div className="border border-blue-200 bg-white rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                  Blogger Dashboard Layout Structure (Preview)
                </span>
                <span className="text-[11px] font-mono text-slate-500">blogger.com/blog/layout</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {/* Section 1 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-red-600">&lt;b:section id='bento-grid-matrix'&gt;</span>
                    <span className="text-slate-500 ml-2">Bento Grid • Community Matrix</span>
                  </div>
                  <span className="bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md text-[11px] font-bold">
                    ✏️ Edit Gadget
                  </span>
                </div>

                {/* Section 2 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-blue-800">&lt;b:section id='core-pillars-section'&gt;</span>
                    <span className="text-slate-500 ml-2">Core Pillars of Bote Community (4 Foundations)</span>
                  </div>
                  <span className="bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md text-[11px] font-bold">
                    ✏️ Edit Gadget
                  </span>
                </div>

                {/* Section 3 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-amber-600">&lt;b:section id='leaders-roster-section'&gt;</span>
                    <span className="text-slate-500 ml-2">Executive Leadership Grid (Navaraj, Santosh, Puja, Lal Bahadur &amp; Council)</span>
                  </div>
                  <span className="bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md text-[11px] font-bold">
                    ✏️ Edit Gadget
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
