/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ThemeType } from '../types';
import { generateBloggerXmlTheme, generateWordPressThemeZip } from '../utils/themeGenerators';
import { DEFAULT_LOGO_URL } from '../data/communityData';
import {
  X,
  Palette,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Download,
  Copy,
  Check,
  Code,
  FileCode,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThemeCustomizerModal({ isOpen, onClose }: ThemeCustomizerModalProps) {
  const {
    theme,
    setTheme,
    headerLogo,
    footerLogo,
    setHeaderLogo,
    setFooterLogo,
    resetLogos,
    handleLogoFileUpload,
    colors
  } = useTheme();

  const [activeTab, setActiveTab] = useState<'themes' | 'logo' | 'export'>('themes');
  const [logoTarget, setLogoTarget] = useState<'both' | 'header' | 'footer'>('both');
  const [copiedCode, setCopiedCode] = useState(false);
  const [exportFormat, setExportFormat] = useState<'blogger' | 'wordpress'>('blogger');
  const [dragOver, setDragOver] = useState(false);

  if (!isOpen) return null;

  const themesList: {
    id: ThemeType;
    name: string;
    description: string;
    flagColors: string[];
    tag: string;
  }[] = [
    {
      id: 'nepali-flag',
      name: 'Nepali Flag Prime (Red, White & Blue)',
      description: 'Authentic Nepali flag aesthetic with majestic Crimson Red, Royal Navy Blue borders, and Crisp White highlights.',
      flagColors: ['#DC143C', '#003893', '#FFFFFF'],
      tag: 'Recommended 🇳🇵'
    },
    {
      id: 'royal-heritage',
      name: 'Royal Heritage Gold & Crimson',
      description: 'Traditional royal palace theme featuring deep temple maroon, brass gold, and warm parchment accents.',
      flagColors: ['#990000', '#D97706', '#1A365D'],
      tag: 'Traditional'
    },
    {
      id: 'riverine-teal',
      name: 'Sacred Bagmati Riverine Teal',
      description: 'Evoking the sacred waters of Bagmati & Narayani rivers, ancient wooden dugouts, and tranquil riverside nature.',
      flagColors: ['#00695C', '#0D47A1', '#FFB300'],
      tag: 'Riverine'
    },
    {
      id: 'midnight-cultural',
      name: 'Midnight Cultural Prestige (Dark)',
      description: 'High-contrast dark mode luxury with crimson embers, luminous cyan, and silver typography.',
      flagColors: ['#020617', '#EF4444', '#3B82F6'],
      tag: 'Dark Mode'
    }
  ];

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      try {
        await handleLogoFileUpload(file, logoTarget);
      } catch (err: any) {
        console.warn('Upload failed:', err?.message || err);
      }
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await handleLogoFileUpload(file, logoTarget);
      } catch (err: any) {
        console.warn('Upload failed:', err?.message || err);
      }
    }
  };

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

  const handleCopyCode = () => {
    const codeToCopy = exportFormat === 'blogger' ? bloggerCode : wpFiles['style.css'] + '\n\n' + wpFiles['index.php'];
    navigator.clipboard.writeText(codeToCopy);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadBloggerXml = () => {
    const blob = new Blob([bloggerCode], { type: 'text/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Bote-Youth-Community-Nepal-Blogger-Theme-v2.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadWordPressFiles = () => {
    // Generate downloadable combined file or individual php
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden shadow-2xl border-2 border-slate-200 flex flex-col my-auto">
        {/* Top Header Ribbon */}
        <div className="bg-gradient-to-r from-[#002868] via-[#8B0000] to-[#DC143C] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
              <Palette className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold font-poppins leading-tight flex items-center gap-2">
                <span>Theme Studio &amp; Logo Customizer</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live v2.5
                </span>
              </h2>
              <p className="text-xs text-white/80">
                Choose website theme, upload own custom logo for header/footer, or export Blogger XML &amp; WordPress themes.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-3">
          <button
            onClick={() => setActiveTab('themes')}
            className={`pb-3 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'themes'
                ? 'border-[#DC143C] text-[#DC143C]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>1. Website Themes (Flag Red, White &amp; Blue)</span>
          </button>
          <button
            onClick={() => setActiveTab('logo')}
            className={`pb-3 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'logo'
                ? 'border-[#DC143C] text-[#DC143C]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>2. Upload Own Logo (Header &amp; Footer)</span>
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`pb-3 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'export'
                ? 'border-[#DC143C] text-[#DC143C]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>3. Blogger XML &amp; WordPress Export</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: THEMES SELECTION */}
          {activeTab === 'themes' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-poppins">
                  Select Design Theme (Feels Like Nepali Flag)
                </h3>
                <p className="text-xs text-slate-500">
                  Switch the full website theme in real-time. The prime look celebrates authentic Red, White and Royal Blue flag tones.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {themesList.map((th) => {
                  const isSelected = theme === th.id;
                  return (
                    <div
                      key={th.id}
                      onClick={() => setTheme(th.id)}
                      className={`cursor-pointer rounded-2xl p-5 border-2 transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#DC143C] bg-red-50/40 shadow-lg scale-[1.01]'
                          : 'border-slate-200 hover:border-slate-300 bg-white shadow-sm'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {th.tag}
                          </span>
                          {isSelected && (
                            <span className="flex items-center text-xs font-extrabold text-[#DC143C]">
                              <Check className="w-4 h-4 mr-1" /> Active
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 font-poppins">
                          {th.name}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {th.description}
                        </p>
                      </div>

                      {/* Color swatches preview */}
                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Palette</span>
                        <div className="flex items-center space-x-2">
                          {th.flagColors.map((c, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 rounded-full border border-slate-300 shadow-sm"
                              style={{ backgroundColor: c }}
                              title={c}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                <div className="text-xs text-slate-600">
                  Current Theme: <strong className="text-slate-900 capitalize">{theme.replace('-', ' ')}</strong> (Nepali Flag Colors Applied)
                </div>
                <div className="flex gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#DC143C] border border-white inline-block"></span>
                  <span className="w-4 h-4 rounded-full bg-[#003893] border border-white inline-block"></span>
                  <span className="w-4 h-4 rounded-full bg-white border border-slate-300 inline-block"></span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD OWN LOGO */}
          {activeTab === 'logo' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-poppins">
                  Upload Your Own Logo (Header &amp; Footer)
                </h3>
                <p className="text-xs text-slate-500">
                  Replace the default emblem with your custom organization logo. Changes persist across the site in real-time.
                </p>
              </div>

              {/* Target Selector */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">Apply upload to:</span>
                {(['both', 'header', 'footer'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setLogoTarget(t)}
                    className={`text-xs px-3 py-1.5 rounded-full font-bold capitalize transition-all ${
                      logoTarget === t
                        ? 'bg-[#003893] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t === 'both' ? 'Both Header & Footer' : `${t} only`}
                  </button>
                ))}
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => document.getElementById('custom-logo-input')?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  dragOver
                    ? 'border-[#DC143C] bg-red-50/50 scale-[1.01]'
                    : 'border-slate-300 hover:border-[#DC143C] bg-slate-50/60 hover:bg-white'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-red-100 text-[#DC143C] flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 animate-bounce" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  Click to Browse or Drag &amp; Drop Logo File
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Supports PNG, JPG, WEBP, or SVG (Transparent background recommended).
                </p>
                <input
                  type="file"
                  id="custom-logo-input"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>

              {/* Live Preview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-4">
                  <img
                    src={headerLogo && headerLogo.trim() ? headerLogo.trim() : DEFAULT_LOGO_URL}
                    alt="Header Logo Preview"
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#DC143C] shadow-md bg-white shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#DC143C] tracking-wider">
                      Header Logo Active
                    </span>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">BoteYouthCommunityNepal</p>
                    <p className="text-[11px] text-slate-500 truncate max-w-[220px]">{(headerLogo || DEFAULT_LOGO_URL).slice(0, 35)}...</p>
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center gap-4 text-white">
                  <img
                    src={footerLogo && footerLogo.trim() ? footerLogo.trim() : DEFAULT_LOGO_URL}
                    alt="Footer Logo Preview"
                    className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shadow-md bg-white shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                      Footer Logo Active
                    </span>
                    <p className="text-xs font-bold text-white mt-0.5">BoteYouthCommunityNepal</p>
                    <p className="text-[11px] text-slate-400 truncate max-w-[220px]">{(footerLogo || DEFAULT_LOGO_URL).slice(0, 35)}...</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={resetLogos}
                  className="text-xs text-slate-500 hover:text-red-600 font-bold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Default Bote Community Emblem</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: BLOGGER XML & WORDPRESS EXPORT */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 font-poppins">
                    Export Full Working Website Theme
                  </h3>
                  <p className="text-xs text-slate-500">
                    Get pure Blogger XML Theme v2 or WordPress Theme source code containing your custom logo and Nepali flag colors.
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setExportFormat('blogger')}
                    className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                      exportFormat === 'blogger'
                        ? 'bg-[#DC143C] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Blogger XML Theme v2
                  </button>
                  <button
                    onClick={() => setExportFormat('wordpress')}
                    className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                      exportFormat === 'wordpress'
                        ? 'bg-[#003893] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    WordPress Theme
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="text-xs text-slate-600">
                  Format: <strong>{exportFormat === 'blogger' ? 'Blogger XML Template (.xml)' : 'WordPress Theme Files (.txt / code)'}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied Code!' : 'Copy Code'}</span>
                  </button>
                  {exportFormat === 'blogger' ? (
                    <button
                      onClick={handleDownloadBloggerXml}
                      className="bg-[#DC143C] hover:bg-[#b51031] text-white text-xs font-bold px-5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Blogger XML (.xml)</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleDownloadWordPressFiles}
                      className="bg-[#003893] hover:bg-[#002766] text-white text-xs font-bold px-5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download WordPress Theme</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Code preview block */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Live Generated Code Preview ({exportFormat === 'blogger' ? 'Blogger XML v2' : 'WordPress style.css & index.php'})
                </span>
                <pre className="bg-slate-950 text-slate-200 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-72 border border-slate-800 leading-relaxed">
                  <code>
                    {exportFormat === 'blogger'
                      ? bloggerCode.slice(0, 1800) + '\n\n... [Click "Download Blogger XML" or "Copy Code" for complete 350+ line theme XML]'
                      : wpFiles['style.css'] + '\n\n' + wpFiles['index.php']}
                  </code>
                </pre>
              </div>

              {/* Instructions */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-1">
                <strong className="block font-bold">How to Install in Blogger:</strong>
                <p>
                  1. Download the <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300">.xml</code> file above.<br />
                  2. Open your Blogger dashboard &rarr; <strong>Theme</strong> &rarr; Click the <strong>Customize</strong> drop-down &rarr; <strong>Restore</strong> &rarr; Upload this XML file.<br />
                  3. Your blog now displays the modern Bote Youth Community Nepal responsive theme with your custom colors!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-between items-center">
          <span className="text-xs text-slate-500">
            Current Theme: <strong className="text-slate-800 capitalize">{theme}</strong>
          </span>
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all"
          >
            Close &amp; View Site
          </button>
        </div>
      </div>
    </div>
  );
}
