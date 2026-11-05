/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { TabType } from '../types';
import { generateBloggerXmlTheme, generateWordPressThemeZip } from '../utils/themeGenerators';
import BloggerAdminPanelManager from '../components/BloggerAdminPanelManager';
import JSZip from 'jszip';
import {
  Palette,
  Download,
  Copy,
  Check,
  Code,
  FileCode,
  Layers,
  Upload,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Shield,
  Laptop,
  Smartphone,
  Archive,
  Package
} from 'lucide-react';

interface ThemeStudioViewProps {
  setCurrentTab: (tab: TabType) => void;
  openCustomizer: () => void;
}

export default function ThemeStudioView({ setCurrentTab, openCustomizer }: ThemeStudioViewProps) {
  const { theme, setTheme, headerLogo, colors } = useTheme();
  const [selectedEngine, setSelectedEngine] = useState<'blogger' | 'wordpress'>('blogger');
  const [copied, setCopied] = useState(false);
  const [downloadedXml, setDownloadedXml] = useState(false);
  const [downloadedZip, setDownloadedZip] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<'style.css' | 'index.php' | 'header.php' | 'footer.php' | 'functions.php'>('style.css');
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('desktop');

  const bloggerCode = generateBloggerXmlTheme({
    siteName: 'BoteYouthCommunityNepal',
    primaryColor: colors.primary,
    secondaryColor: colors.secondary,
    logoUrl: headerLogo
  });

  const wpFiles = generateWordPressThemeZip({
    siteName: 'BoteYouthCommunityNepal',
    primaryColor: colors.primary,
    secondaryColor: colors.secondary,
    logoUrl: headerLogo
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadBlogger = () => {
    const blob = new Blob([bloggerCode], { type: 'text/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Bote-Youth-Community-Nepal-Blogger-Theme-v3.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadedXml(true);
    setTimeout(() => setDownloadedXml(false), 4000);
  };

  const handleDownloadBloggerZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

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

      zip.file('Bote-Youth-Community-Nepal-Blogger-Theme-v3.xml', bloggerCode);
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
      setDownloadedZip(true);
      setTimeout(() => setDownloadedZip(false), 4000);
    } catch (err) {
      console.warn('Zip generation fallback to static file:', err);
      window.location.href = '/Bote-Youth-Community-Nepal-Blogger-Theme-v3.zip';
    } finally {
      setIsZipping(false);
    }
  };

  const handleDownloadWordPress = () => {
    const combined = `/* ====================================================
   WordPress Theme Package: BoteYouthCommunityNepal
   ==================================================== */

=== FILE: style.css ===
${wpFiles['style.css']}

=== FILE: index.php ===
${wpFiles['index.php']}

=== FILE: header.php ===
${wpFiles['header.php']}

=== FILE: footer.php ===
${wpFiles['footer.php']}

=== FILE: functions.php ===
${wpFiles['functions.php']}
`;
    const blob = new Blob([combined], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'BoteYouthCommunityNepal-WordPress-Theme.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#DC143C]">
          <Palette className="w-4 h-4 text-[#003893]" />
          <span>Full Working Website Theme Studio</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-poppins text-slate-900 leading-tight">
          Blogger XML &amp; WordPress Theme Studio
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
          Build and download complete, production-ready website themes for <strong>Blogger</strong> or <strong>WordPress</strong> with fully animated, user-friendly UI/UX design, custom logo upload, and authentic Nepali Flag Red, White &amp; Blue colors.
        </p>

        {/* XML Download Success Alert */}
        {downloadedXml && (
          <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-emerald-900 animate-fade-in shadow-sm">
            <div className="flex items-center gap-2.5">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong className="block font-poppins text-sm font-bold text-emerald-800">
                  Full XML File Downloaded Successfully!
                </strong>
                <span>File saved as <code>Bote-Youth-Community-Nepal-Blogger-Theme-v3.xml</code>. Ready to upload to your Blogger.com dashboard.</span>
              </div>
            </div>
            <button
              onClick={() => setDownloadedXml(false)}
              className="text-emerald-700 hover:text-emerald-900 font-bold text-xs cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ZIP Download Success Alert */}
        {downloadedZip && (
          <div className="bg-amber-50 border-2 border-amber-500 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-amber-950 animate-fade-in shadow-sm">
            <div className="flex items-center gap-2.5">
              <Check className="w-5 h-5 text-amber-700 shrink-0" />
              <div>
                <strong className="block font-poppins text-sm font-bold text-amber-900">
                  Full ZIP Package Downloaded Successfully!
                </strong>
                <span>Archive saved as <code>Bote-Youth-Community-Nepal-Blogger-Theme-v3.zip</code> containing the v3 XML theme, Blogger installation manual, and Google Search Console setup guide.</span>
              </div>
            </div>
            <button
              onClick={() => setDownloadedZip(false)}
              className="text-amber-800 hover:text-amber-950 font-bold text-xs cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleDownloadBloggerZip}
            disabled={isZipping}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-6 py-3 rounded-full transition-all shadow-md flex items-center space-x-2 cursor-pointer ring-2 ring-amber-300"
          >
            <Archive className="w-4 h-4 text-white" />
            <span>{isZipping ? 'Generating Package...' : 'Download Blogger Theme (.ZIP)'}</span>
          </button>
          <a
            href="/Bote-Youth-Community-Nepal-Blogger-Theme-v3.zip"
            download="Bote-Youth-Community-Nepal-Blogger-Theme-v3.zip"
            className="bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs font-black px-5 py-3 rounded-full transition-all shadow-sm flex items-center space-x-2"
          >
            <Archive className="w-4 h-4 text-amber-800" />
            <span>Direct .ZIP Link (22 KB)</span>
          </a>
          <button
            onClick={handleDownloadBlogger}
            className="bg-[#003893] hover:bg-[#002766] text-white text-xs font-black px-6 py-3 rounded-full transition-all shadow-md flex items-center space-x-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>Download Blogger XML (.xml)</span>
          </button>
          <a
            href="/Bote-Youth-Community-Nepal-Blogger-Theme-v3.xml"
            download="Bote-Youth-Community-Nepal-Blogger-Theme-v3.xml"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-5 py-3 rounded-full transition-all shadow-md flex items-center space-x-2 cursor-pointer"
          >
            <FileCode className="w-4 h-4 text-emerald-100" />
            <span>Direct .XML Link</span>
          </a>
          <button
            onClick={() => setCurrentTab('admin')}
            className="bg-[#DC143C] hover:bg-[#b51031] text-white text-xs font-black px-6 py-3 rounded-full transition-all shadow-md flex items-center space-x-2 cursor-pointer"
            title="Only administrators can customize themes and upload logos"
          >
            <Shield className="w-4 h-4 text-amber-300" />
            <span>Admin Settings &rarr;</span>
          </button>
          <button
            onClick={handleDownloadWordPress}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-3 rounded-full transition-all shadow-sm flex items-center space-x-2"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>WordPress Theme</span>
          </button>
        </div>
      </div>

      {/* Interactive Blogger Admin Panel & Edit Tables */}
      <BloggerAdminPanelManager />

      {/* Theme Engine Selector (Blogger vs WordPress) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedEngine('blogger')}
              className={`text-sm font-extrabold px-5 py-2.5 rounded-2xl transition-all ${
                selectedEngine === 'blogger'
                  ? 'bg-[#DC143C] text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              1. Blogger XML Theme v3 (.xml)
            </button>
            <button
              onClick={() => setSelectedEngine('wordpress')}
              className={`text-sm font-extrabold px-5 py-2.5 rounded-2xl transition-all ${
                selectedEngine === 'wordpress'
                  ? 'bg-[#003893] text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              2. WordPress Theme Files (.php &amp; .css)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(selectedEngine === 'blogger' ? bloggerCode : wpFiles[selectedFile])}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Code!' : 'Copy Current Code'}</span>
            </button>
          </div>
        </div>

        {/* Blogger Engine View */}
        {selectedEngine === 'blogger' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="block font-bold text-slate-900 text-sm">Bote-Youth-Community-Nepal-Blogger-Theme-v3.xml</span>
                <span className="text-slate-500 text-xs">Full working XML with Google Search Console verification, executive officers roster, interactive joining form &amp; digital ID, and native Blogger blog/sidebar widgets.</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopy(bloggerCode)}
                  className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  title="Copy complete XML to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-600" />
                      <span>Copy Full Code</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownloadBloggerZip}
                  disabled={isZipping}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  title="Download complete ZIP package with XML, README and Google verification guide"
                >
                  <Archive className="w-3.5 h-3.5 text-white" />
                  <span>{isZipping ? 'Zipping...' : 'Download .ZIP'}</span>
                </button>
                <a
                  href="/Bote-Youth-Community-Nepal-Blogger-Theme-v3.zip"
                  download="Bote-Youth-Community-Nepal-Blogger-Theme-v3.zip"
                  className="bg-amber-50 border border-amber-300 hover:bg-amber-100 text-amber-900 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  title="Direct download of pre-built ZIP package"
                >
                  <Archive className="w-3.5 h-3.5 text-amber-700" />
                  <span>Save .ZIP (22 KB)</span>
                </a>
                <button
                  onClick={handleDownloadBlogger}
                  className="bg-[#003893] hover:bg-[#002766] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-300" />
                  <span>Download .XML</span>
                </button>
                <a
                  href="/Bote-Youth-Community-Nepal-Blogger-Theme-v3.xml"
                  download="Bote-Youth-Community-Nepal-Blogger-Theme-v3.xml"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <FileCode className="w-3.5 h-3.5 text-white" />
                  <span>Save .XML</span>
                </a>
              </div>
            </div>

            <pre className="bg-slate-950 text-slate-200 p-5 rounded-2xl text-xs font-mono overflow-x-auto max-h-96 border border-slate-800 leading-relaxed">
              <code>{bloggerCode}</code>
            </pre>

            {/* Blogger Installation Steps */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-xs text-slate-800 space-y-3">
              <h4 className="font-poppins font-black text-sm text-[#DC143C]">
                How to Install this Blogger XML Theme:
              </h4>
              <ol className="list-decimal pl-5 space-y-1.5 leading-relaxed">
                <li>Click <strong>"Download .XML"</strong> or <strong>"Copy Full Code"</strong> above.</li>
                <li>Go to your <strong>Blogger.com</strong> dashboard &rarr; Navigate to <strong>Theme</strong> in the left menu.</li>
                <li>Next to the <em>Customize</em> button, click the <strong>downward arrow</strong> &rarr; Select <strong>Restore</strong> (and upload the file), or click <strong>Edit HTML</strong> (and paste the code).</li>
                <li>Click <strong>Save</strong>.</li>
                <li>Your Blogger website is now active with all working features: Google site verification, executive leaders, digital ID generator, and authentic Nepali Flag design!</li>
              </ol>
            </div>
          </div>
        )}

        {/* WordPress Engine View */}
        {selectedEngine === 'wordpress' && (
          <div className="space-y-4">
            {/* File Switcher Tabs */}
            <div className="flex flex-wrap gap-2">
              {(['style.css', 'index.php', 'header.php', 'footer.php', 'functions.php'] as const).map((fname) => (
                <button
                  key={fname}
                  onClick={() => setSelectedFile(fname)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-mono font-bold transition-all ${
                    selectedFile === fname
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {fname}
                </button>
              ))}
            </div>

            <pre className="bg-slate-950 text-slate-200 p-5 rounded-2xl text-xs font-mono overflow-x-auto max-h-96 border border-slate-800 leading-relaxed">
              <code>{wpFiles[selectedFile]}</code>
            </pre>

            {/* WordPress Installation Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-xs text-slate-800 space-y-3">
              <h4 className="font-poppins font-black text-sm text-[#003893]">
                How to Install in WordPress:
              </h4>
              <ol className="list-decimal pl-5 space-y-1.5 leading-relaxed">
                <li>Click <strong>"Download WordPress Theme"</strong> above.</li>
                <li>In your WordPress folder, place these files inside <code className="bg-white px-1.5 py-0.5 rounded border border-blue-300">wp-content/themes/bote-youth-nepal/</code>.</li>
                <li>Go to <strong>WP Admin &rarr; Appearance &rarr; Themes</strong> &rarr; Activate <em>BoteYouthCommunityNepal</em>.</li>
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* Visual Mockup & Feature Checklist */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-poppins font-black text-xl text-slate-900">
          What’s Included in the Theme Package
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs text-slate-700">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="font-bold text-slate-900">✅ Pure Blogger XML + HTML/CSS/JS</p>
            <p className="text-slate-500">100% compliant with Blogger Theme Engine</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="font-bold text-slate-900">✅ Nepali Flag Color Theme</p>
            <p className="text-slate-500">Crimson Red (#DC143C), Royal Blue (#003893) &amp; White</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="font-bold text-slate-900">✅ Upload Own Logo Option</p>
            <p className="text-slate-500">Header &amp; Footer customizable logo branding</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="font-bold text-slate-900">✅ 10 Leadership Profiles</p>
            <p className="text-slate-500">Youth Chairman, VP, Secretary, Council Members</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="font-bold text-slate-900">✅ Interactive Joining Form</p>
            <p className="text-slate-500">Digital Identity Card generation &amp; printing</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="font-bold text-slate-900">✅ Language Lexicon &amp; Dress</p>
            <p className="text-slate-500">Preserving Tarahi Bote dialect &amp; traditional attire</p>
          </div>
        </div>
      </div>
    </div>
  );
}
