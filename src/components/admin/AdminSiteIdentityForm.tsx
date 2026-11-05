/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useCommunityData } from '../../context/CommunityDataContext';
import { Check, Loader2, Save, MapPin, Phone, Mail, Globe, Sparkles, AlertCircle } from 'lucide-react';

export default function AdminSiteIdentityForm() {
  const { siteIdentity, saveSiteIdentity } = useCommunityData();

  const [formData, setFormData] = useState({
    siteName: siteIdentity.siteName || 'BoteYouthCommunityNepal',
    tagline: siteIdentity.tagline || 'Preserving Heritage • Empowering the Future',
    location: siteIdentity.location || 'Karmaiya,Sarlahi Ward 11, Bagmati Municipality, Sarlahi, Nepal',
    contactPhone: siteIdentity.contactPhone || '+977-9800000001',
    contactEmail: siteIdentity.contactEmail || 'boteyouthcommunitynepal@gmail.com',
    aboutSummary: siteIdentity.aboutSummary || 'The official collective of Bote youth and elders dedicated to indigenous river protection, Tarahi Bote language preservation, and youth empowerment in Sarlahi and across Nepal.',
    googleAnalyticsId: siteIdentity.googleAnalyticsId || '',
    favicon: siteIdentity.favicon || ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state if external siteIdentity changes
  useEffect(() => {
    setFormData({
      siteName: siteIdentity.siteName || 'BoteYouthCommunityNepal',
      tagline: siteIdentity.tagline || 'Preserving Heritage • Empowering the Future',
      location: siteIdentity.location || 'Karmaiya,Sarlahi Ward 11, Bagmati Municipality, Sarlahi, Nepal',
      contactPhone: siteIdentity.contactPhone || '+977-9800000001',
      contactEmail: siteIdentity.contactEmail || 'boteyouthcommunitynepal@gmail.com',
      aboutSummary: siteIdentity.aboutSummary || '',
      googleAnalyticsId: siteIdentity.googleAnalyticsId || '',
      favicon: siteIdentity.favicon || ''
    });
  }, [siteIdentity]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const ok = await saveSiteIdentity(formData);
      if (ok) {
        setSuccessMessage('Site Identity & Contact Info successfully updated and broadcast to all users across the internet in real-time!');
      } else {
        setSuccessMessage('Site Identity updated locally on this device. (Will broadcast to internet as soon as connected).');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save site identity.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(null), 6000);
    }
  };

  return (
    <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-lg font-bold text-slate-900 font-poppins flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#003893]" />
            <span>Community Site Identity &amp; Contact Info</span>
          </h3>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Real-Time Cloud Broadcast Active</span>
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Update official community contact phone, email, and secretariat location. All changes instantly update in real-time across the internet for all visitors.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button type="button" onClick={() => setSuccessMessage(null)} className="text-emerald-500 hover:text-emerald-800">
            &times;
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Site Name
          </label>
          <input
            type="text"
            name="siteName"
            value={formData.siteName}
            onChange={handleChange}
            required
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-semibold focus:bg-white focus:border-[#003893] focus:ring-1 focus:ring-[#003893] transition"
            placeholder="BoteYouthCommunityNepal"
          />
          <p className="text-[10px] text-slate-400 mt-1">Displayed on the top navigation bar and meta titles.</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Official Tagline
          </label>
          <input
            type="text"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            required
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-semibold focus:bg-white focus:border-[#003893] focus:ring-1 focus:ring-[#003893] transition"
            placeholder="Preserving Heritage • Empowering the Future"
          />
          <p className="text-[10px] text-slate-400 mt-1">Official motto displayed under the community brand.</p>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <span>Headquarters Location</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-semibold focus:bg-white focus:border-[#003893] focus:ring-1 focus:ring-[#003893] transition"
            placeholder="Karmaiya,Sarlahi Ward 11, Bagmati Municipality, Sarlahi, Nepal"
          />
          <p className="text-[10px] text-slate-400 mt-1">Primary physical secretariat location in Karmaiya, Sarlahi.</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official Contact Phone</span>
          </label>
          <input
            type="text"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            required
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-semibold focus:bg-white focus:border-[#003893] focus:ring-1 focus:ring-[#003893] transition"
            placeholder="+977-9800000001"
          />
          <p className="text-[10px] text-slate-400 mt-1">Direct official helpline for youth and community inquiries.</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>Official Contact Email</span>
          </label>
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            required
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-semibold focus:bg-white focus:border-[#003893] focus:ring-1 focus:ring-[#003893] transition"
            placeholder="boteyouthcommunitynepal@gmail.com"
          />
          <p className="text-[10px] text-slate-400 mt-1">Official inbox for national and international correspondence.</p>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Official Community Mission Summary
          </label>
          <textarea
            name="aboutSummary"
            rows={3}
            value={formData.aboutSummary}
            onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-[#003893] focus:ring-1 focus:ring-[#003893] transition"
            placeholder="The official collective of Bote youth and community elders dedicated to indigenous river protection, Tarahi Bote language preservation..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Google Analytics Measurement ID
          </label>
          <input
            type="text"
            name="googleAnalyticsId"
            value={formData.googleAnalyticsId}
            onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-mono focus:bg-white focus:border-[#003893] focus:ring-1 focus:ring-[#003893] transition uppercase"
            placeholder="G-XXXXXXXXXX"
          />
          <p className="text-[10px] text-slate-400 mt-1">Google Analytics 4 Web Stream Measurement ID (starts with G-).</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Website Favicon URL / Base64
          </label>
          <input
            type="text"
            name="favicon"
            value={formData.favicon}
            onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-mono focus:bg-white focus:border-[#003893] focus:ring-1 focus:ring-[#003893] transition truncate"
            placeholder="https://... or data:image/png;base64,..."
          />
          <p className="text-[10px] text-slate-400 mt-1">Official website favicon &amp; Google Search logo (.ico, .png, .svg) for search results and browser tabs.</p>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Clicking 'Save Site Identity' writes directly to cloud and updates all active users.</span>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="bg-[#003893] hover:bg-blue-900 disabled:opacity-75 text-white px-7 py-3 rounded-2xl text-xs font-black shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 text-amber-300 animate-spin" />
              <span>Saving &amp; Broadcasting Live...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Save Site Identity</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
