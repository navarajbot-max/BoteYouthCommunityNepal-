import React, { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Shield,
  Save,
  RotateCcw,
  CheckCircle,
  ExternalLink,
  Plus,
  Trash2,
  Table,
  LayoutGrid,
  Sparkles,
  Navigation,
  FileText,
  AlertCircle,
  Megaphone,
  Send,
  Radio,
  Eye,
  Pin,
  Share2,
  CheckCircle2,
  Bell,
  Calendar,
  X,
  Tag,
  Flame,
  Copy,
  Check,
  Smartphone,
  Tablet as TabletIcon,
  PhoneCall
} from 'lucide-react';
import { useCommunityData } from '../../context/CommunityDataContext';
import { KarmaiyaCentralOfficeDetails } from '../../types';
import { DEFAULT_KARMAIYA_CENTRAL_OFFICE } from '../../data/communityData';
import {
  formatCentralOfficeAddress,
  getCentralOfficeMapsUrl,
  formatTelLink,
  sanitizeCentralOfficeDetails
} from '../../utils/addressFormatter';

interface Props {
  onNavigateToPublic?: () => void;
  showNotification?: (msg: string) => void;
}

export const AdminCentralOfficeEditor: React.FC<Props> = ({
  onNavigateToPublic,
  showNotification
}) => {
  const {
    centralOffice,
    updateCentralOffice,
    resetCentralOffice,
    lastSyncedTime,
    addPost,
    triggerGlobalUpdate,
    playNotificationChime
  } = useCommunityData();

  // Local draft state initialized with sanitized context data
  const [formData, setFormData] = useState<KarmaiyaCentralOfficeDetails>(() =>
    sanitizeCentralOfficeDetails(centralOffice || DEFAULT_KARMAIYA_CENTRAL_OFFICE)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [newServiceInput, setNewServiceInput] = useState('');
  const [tableCategory, setTableCategory] = useState<'all' | 'location' | 'contact' | 'statutory' | 'notice'>('all');
  const [tableSearch, setTableSearch] = useState('');
  const [copiedTableKey, setCopiedTableKey] = useState<string | null>(null);

  const handleCopyTable = (text: string, key: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedTableKey(key);
      if (showNotification) {
        showNotification(`📋 Copied to clipboard: ${text}`);
      }
      setTimeout(() => setCopiedTableKey(null), 2500);
    } catch {}
  };

  const handleSanitizeAndAutoFill = () => {
    const fixed = sanitizeCentralOfficeDetails(formData);
    setFormData(fixed);
    if (showNotification) {
      showNotification('✅ Repaired & auto-filled all missing/undefined fields with authentic Karmaiya Central Office defaults!');
    }
  };

  // Notice post form state for Feature 6: Central कार्यालय Public सूचना Board सूचना
  const [noticeTitle, setNoticeTitle] = useState(
    formData.publicNoticeTitle || 'केन्द्रीय कार्यालय सार्वजनिक सूचना'
  );
  const [noticePriority, setNoticePriority] = useState<'normal' | 'high' | 'urgent'>(
    (formData.publicNoticePriority as 'normal' | 'high' | 'urgent') || 'urgent'
  );
  const [postToPublicCard, setPostToPublicCard] = useState(true);
  const [crossPostToNoticesFeed, setCrossPostToNoticesFeed] = useState(true);
  const [sendLiveNotification, setSendLiveNotification] = useState(true);
  const [pinInNoticesFeed, setPinInNoticesFeed] = useState(true);
  const [isPostingNotice, setIsPostingNotice] = useState(false);
  const [postFeedback, setPostFeedback] = useState<string | null>(null);
  const [copiedNotice, setCopiedNotice] = useState(false);

  // Keep local draft in sync if centralOffice changes externally (e.g. from Firebase or Broadcast)
  useEffect(() => {
    if (centralOffice) {
      const sanitized = sanitizeCentralOfficeDetails(centralOffice);
      setFormData(sanitized);
      if (sanitized.publicNoticeTitle) {
        setNoticeTitle(sanitized.publicNoticeTitle);
      }
      if (sanitized.publicNoticePriority) {
        setNoticePriority(sanitized.publicNoticePriority as 'normal' | 'high' | 'urgent');
      }
    }
  }, [centralOffice]);

  const PRESET_NOTICES = [
    {
      label: '🏢 कार्यालय सेवा तथा समय',
      title: 'केन्द्रीय कार्यालय खुला रहने तथा सेवा प्रवाह सम्बन्धी सूचना',
      text: 'सूचना: केन्द्रीय कार्यालय कर्मैयामा नयाँ सदस्यता दर्ता, परिचयपत्र वितरण तथा छात्रवृत्ति आवेदन फाराम उपलब्ध छ। सबै युवा सदस्यहरू कार्यालय समय (आइतबार–शुक्रबार, बिहान १०:०० देखि ५:०० सम्म) मा सम्पर्क गर्न सक्नुहुनेछ।',
      priority: 'normal' as const
    },
    {
      label: '🤝 केन्द्रीय युवा भेला आह्वान',
      title: 'केन्द्रीय साधारण सभा तथा राष्ट्रिय युवा भेला आह्वान',
      text: 'अत्यन्त जरूरी आह्वान: बोटे युवा समुदाय नेपालको केन्द्रीय साधारण सभा तथा राष्ट्रिय युवा नेतृत्व भेला केन्द्रीय कार्यालय कर्मैया, सर्लाहीमा आयोजना हुने भएकोले सम्पूर्ण सल्लाहकार, पदाधिकारी, वडा प्रतिनिधि तथा युवा सदस्यहरूको गरिमामय उपस्थितिका लागि हार्दिक अनुरोध गरिन्छ।',
      priority: 'urgent' as const
    },
    {
      label: '🌊 नदी तटीय सतर्कता',
      title: 'बागमती नदी तटीय सतर्कता तथा युवा स्वयंसेवक टोली परिचालन',
      text: 'आकस्मिक सूचना: बागमती नदी तटीय क्षेत्रमा वर्षा तथा बाढीको बहाव बढेकाले माझी-बोटे समुदाय, डुङ्गा चालक तथा नदी किनारका बासिन्दाहरूलाई विशेष सतर्कता अपनाउन र केन्द्रीय कार्यालयको २४/७ नदी गस्ती हटलाइन (+९७७-९८०६३८९२१२) मा सम्पर्क गर्न अनुरोध गर्दछौं।',
      priority: 'urgent' as const
    },
    {
      label: '🎓 जेहेन्दार छात्रवृत्ति',
      title: 'बोटे जेहेन्दार विद्यार्थी उच्च शिक्षा छात्रवृत्ति आवेदन खुला',
      text: 'शैक्षिक सूचना: शैक्षिक सत्रका लागि बोटे समुदायका जेहेन्दार तथा आर्थिक रूपमा विपन्न विद्यार्थीहरूका लागि उच्च शिक्षा तथा प्राविधिक छात्रवृत्ति आवेदन फाराम खुला गरिएको छ। इच्छुक विद्यार्थीहरूले केन्द्रीय कार्यालय तथा अनलाइन पोर्टलबाट फाराम प्राप्त गर्न सक्नुहुनेछ।',
      priority: 'high' as const
    },
    {
      label: '🪪 सदस्यता दर्ता अभियान',
      title: 'नयाँ सदस्यता दर्ता तथा डिजिटल परिचयपत्र वितरण अभियान',
      text: 'सार्वजनिक सूचना: कर्मैया लगायत देशभर छरिएर रहेका बोटे युवा सदस्यहरूको अभिलेखीकरण तथा डिजिटल परिचयपत्र (QR ID Card) वितरण अभियान संचालन भइरहेको छ। सम्पर्क: +९७७-९८०६३८९२१२ / boteyouthcommunitynepal@gmail.com।',
      priority: 'normal' as const
    }
  ];

  const handleApplyPreset = (preset: typeof PRESET_NOTICES[0]) => {
    setNoticeTitle(preset.title);
    setNoticePriority(preset.priority);
    setFormData((prev) => ({
      ...prev,
      publicNoticeBoardNotice: preset.text,
      publicNoticeTitle: preset.title,
      publicNoticePriority: preset.priority
    }));
    if (showNotification) {
      showNotification(`नमूना लोड गरियो: "${preset.label}"`);
    }
  };

  const handlePostNotice = async () => {
    const noticeContent = (formData.publicNoticeBoardNotice || '').trim();
    if (!noticeContent) {
      if (showNotification) showNotification('कृपया सूचनाको व्यहोरा (Notice Announcement) लेख्नुहोस्!');
      return;
    }

    try {
      setIsPostingNotice(true);
      setPostFeedback(null);

      const postedTimestamp = new Date().toISOString();

      // 1. Prepare updated central office details with publication metadata
      const updatedDetails: KarmaiyaCentralOfficeDetails = {
        ...formData,
        publicNoticeBoardNotice: noticeContent,
        publicNoticeTitle: noticeTitle.trim() || 'केन्द्रीय कार्यालय सार्वजनिक सूचना',
        publicNoticePriority: noticePriority,
        publicNoticePostedAt: postedTimestamp,
        publicNoticeIsPublished: true
      };

      setFormData(updatedDetails);

      // Save to Central Office database & broadcast
      await updateCentralOffice(updatedDetails);

      // 2. Cross-post to Community Notices Board if option is enabled
      if (crossPostToNoticesFeed) {
        try {
          await addPost({
            type: 'notice',
            title: noticeTitle.trim() || 'केन्द्रीय कार्यालय सार्वजनिक सूचना (Official Notice)',
            titleNepali: noticeTitle.trim() || 'केन्द्रीय कार्यालय सार्वजनिक सूचना',
            summary: noticeContent.length > 150 ? noticeContent.substring(0, 150) + '...' : noticeContent,
            content: noticeContent,
            contentNepali: noticeContent,
            author: 'केन्द्रीय कार्यालय (कर्मैया)',
            authorName: formData.chiefExecutiveInCharge || 'केन्द्रीय कार्यालय (कर्मैया, सर्लाही)',
            authorRole: 'Official Headquarter Announcement',
            priority: noticePriority,
            pinned: pinInNoticesFeed,
            isPublished: true,
            tags: ['Central Office', 'सूचना', 'कर्मैया', 'Announcement']
          });
        } catch (postErr) {
          console.warn('Cross-posting error:', postErr);
        }
      }

      // 3. Send Live Notification Alert if option is enabled
      if (sendLiveNotification) {
        try {
          playNotificationChime?.();
          await fetch('/api/notifications/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'notice',
              name: 'केन्द्रीय कार्यालय (कर्मैया)',
              category: 'Notice',
              ward: `${formData.villageSettlement || 'Karmaiya'}, Ward ${formData.wardNo || '11'}`
            })
          }).catch(() => {});
        } catch (notifErr) {
          console.warn('Live notification trigger:', notifErr);
        }
      }

      // Broadcast event across active windows
      if (triggerGlobalUpdate) {
        triggerGlobalUpdate('central_office_notice', updatedDetails);
      }

      const successMsg = 'प्रकाशित गरिएको छ। धन्यवाद';
      setPostFeedback(`✅ ${successMsg} — Public Contact Card, सूचना Widget र Community Board मा प्रसारण सम्पन्न भयो!`);

      if (showNotification) {
        showNotification(`📢 प्रकाशित गरिएको छ। धन्यवाद — केन्द्रीय कार्यालय सूचना सार्वजनिक बोर्डमा पोष्ट भयो!`);
      }
    } catch (err) {
      console.error('Failed to post notice:', err);
      setPostFeedback('सूचना पोष्ट गर्न सकिएन। कृपया नेटवर्क जाँच गर्नुहोस्।');
      if (showNotification) {
        showNotification('Failed to post announcement. Please check network connection.');
      }
    } finally {
      setIsPostingNotice(false);
    }
  };

  const handleUnpublishNotice = async () => {
    try {
      setIsPostingNotice(true);
      const updatedDetails: KarmaiyaCentralOfficeDetails = {
        ...formData,
        publicNoticeIsPublished: false
      };
      setFormData(updatedDetails);
      await updateCentralOffice(updatedDetails);
      setPostFeedback('सूचना सार्वजनिक बोर्डबाट हटाइएको छ (Unpublished successfully)');
      if (showNotification) showNotification('सूचना सार्वजनिक बोर्डबाट हटाइएको छ।');
    } catch (err) {
      console.error('Failed to unpublish:', err);
    } finally {
      setIsPostingNotice(false);
    }
  };

  const handleChange = (field: keyof KarmaiyaCentralOfficeDetails, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddService = () => {
    if (!newServiceInput.trim()) return;
    const updatedServices = [...(formData.keyServices || []), newServiceInput.trim()];
    handleChange('keyServices', updatedServices);
    setNewServiceInput('');
  };

  const handleRemoveService = (index: number) => {
    const updatedServices = (formData.keyServices || []).filter((_, i) => i !== index);
    handleChange('keyServices', updatedServices);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const cleaned = sanitizeCentralOfficeDetails(formData);
      const success = await updateCentralOffice(cleaned);
      if (success) {
        setFormData(cleaned);
        setSaveSuccess(true);
        if (showNotification) {
          showNotification('✅ Karmaiya Central Office details saved to cloud database & broadcasted to live website!');
        }
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Failed to save Central Office details:', err);
      if (showNotification) {
        showNotification('Failed to save Central Office details. Please check network.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    await resetCentralOffice();
    setFormData(sanitizeCentralOfficeDetails(DEFAULT_KARMAIYA_CENTRAL_OFFICE));
    if (showNotification) {
      showNotification('Karmaiya Central Office details reset to official defaults.');
    }
  };

  return (
    <div id="admin-central-office-editor" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Option 5 — Official Office Details &amp; Coordinates
            </span>
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Synced: {lastSyncedTime || 'Real-time'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-poppins flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <span>Karmaiya Central Office Full Details</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            Manage the official headquarter details, registration numbers, contact hotlines, executive leadership, GPS coordinates, and key services for Bote Youth Community Nepal (बागमती-११, कर्मैया, सर्लाही).
          </p>
        </div>

        {/* View Mode Toggle & Primary Actions */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center shrink-0">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Card Form</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Official Table</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleSanitizeAndAutoFill}
            className="px-3 py-2 rounded-xl border border-emerald-300 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition flex items-center gap-1.5 shadow-2xs"
            title="Auto-fill missing or undefined fields with authentic Karmaiya Central Office defaults"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Fix Undefined / Fill Defaults</span>
            <span className="sm:hidden">Auto-Fix</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition flex items-center gap-1.5"
            title="Reset to default authentic Karmaiya details"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black transition flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving to Cloud...</span>
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle className="w-4 h-4 text-white" />
                <span>Saved &amp; Broadcasted!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Details</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* View Mode 1: Comprehensive Responsive Card Form */}
      {viewMode === 'cards' && (
        <div className="space-y-6">
          {/* Group 1: Office Nomenclature & Legal Registrations */}
          <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <Shield className="w-4 h-4 text-blue-700" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                1. Official Headquarter Nomenclature &amp; Statutory Registrations
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Office Name (English)
                </label>
                <input
                  type="text"
                  value={formData.officeName || ''}
                  onChange={(e) => handleChange('officeName', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Office Name (Nepali — कार्यालयको नाम)
                </label>
                <input
                  type="text"
                  value={formData.officeNameNepali || ''}
                  onChange={(e) => handleChange('officeNameNepali', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium font-nepali"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  DAO Registration No. (जिल्ला प्रशासन कार्यालय दर्ता नं.)
                </label>
                <input
                  type="text"
                  value={formData.daoRegistrationNo || ''}
                  onChange={(e) => handleChange('daoRegistrationNo', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Social Welfare Council Affiliation No. (समाज कल्याण परिषद् आवद्धता नं.)
                </label>
                <input
                  type="text"
                  value={formData.swcAffiliationNo || ''}
                  onChange={(e) => handleChange('swcAffiliationNo', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Permanent Account Number (PAN / स्थायी लेखा नं.)
                </label>
                <input
                  type="text"
                  value={formData.panNumber || ''}
                  onChange={(e) => handleChange('panNumber', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Postal / Pin Code
                </label>
                <input
                  type="text"
                  value={formData.postalCode || ''}
                  onChange={(e) => handleChange('postalCode', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Group 2: Geographical Location & Physical Address */}
          <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <MapPin className="w-4 h-4 text-red-600" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                2. Exact Location, Municipal Ward &amp; GPS Coordinates
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Settlement / Village (टोल / बस्ती)
                </label>
                <input
                  type="text"
                  value={formData.villageSettlement || ''}
                  onChange={(e) => handleChange('villageSettlement', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ward Number (वडा नं.)
                </label>
                <input
                  type="text"
                  value={formData.wardNo || ''}
                  onChange={(e) => handleChange('wardNo', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Municipality (नगरपालिका / गाउँपालिका)
                </label>
                <input
                  type="text"
                  value={formData.municipality || ''}
                  onChange={(e) => handleChange('municipality', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  District (जिल्ला)
                </label>
                <input
                  type="text"
                  value={formData.district || ''}
                  onChange={(e) => handleChange('district', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Province (प्रदेश)
                </label>
                <input
                  type="text"
                  value={formData.province || ''}
                  onChange={(e) => handleChange('province', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Country (देश)
                </label>
                <input
                  type="text"
                  value={formData.country || ''}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Landmark &amp; River Basin Description
                </label>
                <input
                  type="text"
                  value={formData.landmark || ''}
                  onChange={(e) => handleChange('landmark', e.target.value)}
                  placeholder="e.g. Bagmati Riverbank Confluence, East of Bagmati Bridge..."
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  GPS Coordinates (Latitude, Longitude)
                </label>
                <input
                  type="text"
                  value={formData.gpsCoordinates || ''}
                  onChange={(e) => handleChange('gpsCoordinates', e.target.value)}
                  placeholder="27.1350° N, 85.4720° E"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Google Maps Link / URL
                </label>
                <input
                  type="url"
                  value={formData.googleMapsEmbedUrl || ''}
                  onChange={(e) => handleChange('googleMapsEmbedUrl', e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Group 3: Direct Contact Hotlines & Digital Dispatch */}
          <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <Phone className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                3. Official Phone Numbers, Emergency River Patrol &amp; Email Dispatch
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Official Phone
                </label>
                <input
                  type="text"
                  value={formData.primaryPhone || ''}
                  onChange={(e) => handleChange('primaryPhone', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Secondary Official Phone
                </label>
                <input
                  type="text"
                  value={formData.secondaryPhone || ''}
                  onChange={(e) => handleChange('secondaryPhone', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/80">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-600" />
                    <span>24/7 Hotline Number</span>
                  </label>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
                    Footer &amp; Public
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="+977-9806389212"
                  value={formData.hotline || ''}
                  onChange={(e) => handleChange('hotline', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-mono font-bold text-slate-800"
                />
                <p className="text-[10px] text-amber-800/80 mt-1">
                  Shown in the website footer ("Hotline: ...") and public emergency contact cards.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Emergency River Helpline
                </label>
                <input
                  type="text"
                  value={formData.emergencyRiverHelpline || ''}
                  onChange={(e) => handleChange('emergencyRiverHelpline', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Email (Primary)
                </label>
                <input
                  type="email"
                  value={formData.officialEmail || ''}
                  onChange={(e) => handleChange('officialEmail', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Secondary / Coordinator Email
                </label>
                <input
                  type="email"
                  value={formData.secondaryEmail || ''}
                  onChange={(e) => handleChange('secondaryEmail', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Group 4: Office Timings & Executive Leadership in Charge */}
          <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <Clock className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                4. Office Operational Timings &amp; Responsible Executive Officers
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Office Working Hours
                </label>
                <input
                  type="text"
                  value={formData.officeHours || ''}
                  onChange={(e) => handleChange('officeHours', e.target.value)}
                  placeholder="Sunday – Friday: 10:00 AM – 5:00 PM"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Holiday Schedule &amp; Festival Closures
                </label>
                <input
                  type="text"
                  value={formData.holidaySchedule || ''}
                  onChange={(e) => handleChange('holidaySchedule', e.target.value)}
                  placeholder="Closed on Saturdays & Public Holidays"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chief Executive in Charge (President / Head)
                </label>
                <input
                  type="text"
                  value={formData.chiefExecutiveInCharge || ''}
                  onChange={(e) => handleChange('chiefExecutiveInCharge', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Vice-Chairperson
                </label>
                <input
                  type="text"
                  value={formData.viceChairperson || ''}
                  onChange={(e) => handleChange('viceChairperson', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  General Secretary
                </label>
                <input
                  type="text"
                  value={formData.secretaryGeneral || ''}
                  onChange={(e) => handleChange('secretaryGeneral', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Central Treasurer
                </label>
                <input
                  type="text"
                  value={formData.treasurer || ''}
                  onChange={(e) => handleChange('treasurer', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Group 5: Key Headquarters Desks & Services Provided */}
          <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  5. Key Services &amp; Desks Available at Central Office
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-bold">
                {formData.keyServices?.length || 0} active services
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newServiceInput}
                onChange={(e) => setNewServiceInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddService();
                  }
                }}
                placeholder="Add a new service or desk (e.g. Tarahi Audio Archiving, Canoe Apprenticeship...)"
                className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
              />
              <button
                type="button"
                onClick={handleAddService}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {(formData.keyServices || []).map((service, index) => (
                <div
                  key={index}
                  className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-black flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-xs font-medium text-slate-800">{service}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveService(index)}
                    className="text-slate-400 hover:text-red-600 transition p-1"
                    title="Remove service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Group 6: Central कार्यालय Public सूचना Board सूचना (नेपाली Announcement) - Comprehensive Post & Send Options */}
          <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-amber-50/70 rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-sm space-y-6 relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-200/30 rounded-full blur-2xl pointer-events-none" />

            {/* Header with Title and Live Publication Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/80 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10.5px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 border border-amber-400/80 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                    <Megaphone className="w-3 h-3 text-amber-800" />
                    <span>Feature 6</span>
                  </span>
                  {formData.publicNoticeIsPublished !== false && formData.publicNoticeBoardNotice ? (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                      <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                      <span>प्रकाशित गरिएको छ। धन्यवाद (Live on Public Board)</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-3 py-0.5 rounded-full flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      <span>अप्रकाशित / ड्राफ्ट (Draft Notice)</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 font-poppins flex items-center gap-2 mt-1">
                  <Megaphone className="w-5 h-5 text-amber-700 shrink-0" />
                  <span>6. Central कार्यालय Public सूचना Board सूचना (नेपाली Announcement)</span>
                </h3>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  This announcement appears on the public contact card and सूचना widget for visiting समुदाय members. Admins can configure, draft, post, broadcast, and cross-publish announcements with zero delay.
                </p>
              </div>

              {/* Quick Navigation to Live Preview */}
              {onNavigateToPublic && (
                <button
                  type="button"
                  onClick={onNavigateToPublic}
                  className="px-3 py-1.5 rounded-xl border border-amber-300 bg-white/90 text-amber-900 text-xs font-bold hover:bg-amber-100 transition flex items-center gap-1.5 shadow-2xs self-start sm:self-center shrink-0 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-700" />
                  <span>Preview on Contact Card</span>
                </button>
              )}
            </div>

            {/* Quick 1-Click Nepali Announcement Templates */}
            <div className="space-y-2 bg-white/70 p-4 rounded-2xl border border-amber-200/80">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>द्रुत नेपाली सूचना नमूनाहरू (1-Click Notice Templates):</span>
                </label>
                <span className="text-[10px] text-slate-500 font-medium">Click any template to auto-fill form</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {PRESET_NOTICES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-amber-100/80 text-slate-800 border border-amber-200 transition flex items-center gap-1.5 shadow-2xs hover:border-amber-400 active:scale-95 cursor-pointer"
                  >
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notice Composer Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                {/* Notice Heading Input */}
                <div className="sm:col-span-8">
                  <label className="block text-xs font-black text-slate-800 mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-700" />
                    <span>Notice Title / शीर्षक (नेपाली):</span>
                  </label>
                  <input
                    type="text"
                    value={noticeTitle}
                    onChange={(e) => {
                      setNoticeTitle(e.target.value);
                      handleChange('publicNoticeTitle', e.target.value);
                    }}
                    placeholder="उदा. केन्द्रीय कार्यालय सार्वजनिक सूचना (सदस्यता दर्ता तथा छात्रवृत्ति)..."
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-medium font-nepali text-slate-900"
                  />
                </div>

                {/* Notice Urgency Priority Selector */}
                <div className="sm:col-span-4">
                  <label className="block text-xs font-black text-slate-800 mb-1 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-700" />
                    <span>Urgency Level / प्राथमिकता:</span>
                  </label>
                  <select
                    value={noticePriority}
                    onChange={(e) => {
                      const val = e.target.value as 'normal' | 'high' | 'urgent';
                      setNoticePriority(val);
                      handleChange('publicNoticePriority', val);
                    }}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-bold text-slate-800"
                  >
                    <option value="urgent">🔴 अत्यन्त जरूरी सूचना (Urgent)</option>
                    <option value="high">🟡 महत्वपूर्ण सूचना (High Priority)</option>
                    <option value="normal">🔵 सामान्य सूचना (Normal / General)</option>
                  </select>
                </div>
              </div>

              {/* Notice Body Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                    <span>Notice Announcement Body / सूचनाको पूर्ण व्यहोरा (नेपाली Announcement):</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-500">
                    {(formData.publicNoticeBoardNotice || '').length} characters
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={formData.publicNoticeBoardNotice || ''}
                  onChange={(e) => handleChange('publicNoticeBoardNotice', e.target.value)}
                  placeholder="केन्द्रीय कार्यालयबाट जारी सूचनाको पूर्ण विवरण यहाँ लेख्नुहोस् (उदा. सूचना: केन्द्रीय कार्यालय कर्मैयामा नयाँ सदस्यता दर्ता, परिचयपत्र वितरण तथा छात्रवृत्ति आवेदन फाराम उपलब्ध छ...)"
                  className="w-full px-4 py-3 text-xs bg-white border-2 border-amber-300 rounded-2xl focus:ring-2 focus:ring-amber-500 font-medium font-nepali leading-relaxed text-slate-900 shadow-inner"
                />
              </div>
            </div>

            {/* Dedicated Post & Send Options (Channel Routing & Cross-Posting) */}
            <div className="bg-white/80 p-5 rounded-2xl border border-amber-300/80 space-y-3.5">
              <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                <label className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-2">
                  <Send className="w-4 h-4 text-amber-700" />
                  <span>पोष्ट तथा प्रसारण विकल्पहरू (Send &amp; Post Options):</span>
                </label>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Real-time Multi-Channel
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Option 1: Public Contact Card & सूचना Widget */}
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/60 border border-amber-200 cursor-pointer hover:bg-amber-50 transition">
                  <input
                    type="checkbox"
                    checked={postToPublicCard}
                    onChange={(e) => setPostToPublicCard(e.target.checked)}
                    className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <span className="font-black text-slate-900 block flex items-center gap-1.5">
                      <span>📌 Public Contact Card &amp; सूचना Widget</span>
                      <span className="text-[9.5px] bg-amber-200 text-amber-900 font-black px-1.5 py-0.2 rounded">
                        Primary
                      </span>
                    </span>
                    <span className="text-[11px] text-slate-600 leading-snug block mt-0.5">
                      भ्रमण गर्ने सम्पूर्ण समुदाय सदस्यहरूका लागि सार्वजनिक सम्पर्क कार्ड तथा सूचना विजेटमा तुरुन्त प्रत्यक्ष प्रदर्शित हुनेछ।
                    </span>
                  </div>
                </label>

                {/* Option 2: Cross-post to Community Notices Board */}
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/60 border border-blue-200 cursor-pointer hover:bg-blue-50 transition">
                  <input
                    type="checkbox"
                    checked={crossPostToNoticesFeed}
                    onChange={(e) => setCrossPostToNoticesFeed(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-black text-slate-900 block flex items-center gap-1.5">
                      <span>📢 Community Notices पाटीमा पनि पोष्ट गर्नुहोस्</span>
                      <span className="text-[9.5px] bg-blue-100 text-blue-800 font-black px-1.5 py-0.2 rounded">
                        Feed
                      </span>
                    </span>
                    <span className="text-[11px] text-slate-600 leading-snug block mt-0.5">
                      मुख्य 'सूचना पाटी' फिडमा आधिकारिक सूचनाको रूपमा सूचीकृत भई समुदाय सदस्यहरूले खोजी र डाउनलोड गर्न सक्नेछन्।
                    </span>
                  </div>
                </label>

                {/* Option 3: Pin in Community Notices Board */}
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-purple-50/60 border border-purple-200 cursor-pointer hover:bg-purple-50 transition">
                  <input
                    type="checkbox"
                    checked={pinInNoticesFeed}
                    disabled={!crossPostToNoticesFeed}
                    onChange={(e) => setPinInNoticesFeed(e.target.checked)}
                    className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 disabled:opacity-50"
                  />
                  <div>
                    <span className="font-black text-slate-900 block flex items-center gap-1.5">
                      <Pin className="w-3.5 h-3.5 text-purple-700" />
                      <span>सूचना पाटीको शीर्षस्थानमा पिन (Pin to Top) गर्नुहोस्</span>
                    </span>
                    <span className="text-[11px] text-slate-600 leading-snug block mt-0.5">
                      सूचना पाटीको सबैभन्दा माथि पिन गरिएको ब्यानरको रूपमा पहिलो प्राथमिकतामा राखिनेछ।
                    </span>
                  </div>
                </label>

                {/* Option 4: Send Live Broadcast Notification Alert */}
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 cursor-pointer hover:bg-emerald-50 transition">
                  <input
                    type="checkbox"
                    checked={sendLiveNotification}
                    onChange={(e) => setSendLiveNotification(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-black text-slate-900 block flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-emerald-700" />
                      <span>समुदाय सदस्यहरूलाई प्रत्यक्ष सूचना अलर्ट (Live Notification &amp; Chime)</span>
                    </span>
                    <span className="text-[11px] text-slate-600 leading-snug block mt-0.5">
                      वेबसाइटमा सक्रिय रहेका सम्पूर्ण सदस्यहरूलाई तत्काल सूचना संकेत तथा ध्वनि अलर्ट पठाइनेछ।
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Post Action Buttons & Feedback */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                {/* Main Post / Publish Button */}
                <button
                  type="button"
                  onClick={handlePostNotice}
                  disabled={isPostingNotice || !(formData.publicNoticeBoardNotice || '').trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white text-xs font-black transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isPostingNotice ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>प्रसारण हुँदैछ (Posting Announcement)...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>
                        {formData.publicNoticeIsPublished !== false && formData.publicNoticeBoardNotice
                          ? '📢 अद्यावधिक / पुनः पोष्ट गर्नुहोस् (Update & Post Now)'
                          : '📢 पोष्ट / प्रकाशित गर्नुहोस् (Post Announcement Now)'}
                      </span>
                    </>
                  )}
                </button>

                {/* Clear / Unpublish Button */}
                {formData.publicNoticeBoardNotice && (
                  <button
                    type="button"
                    onClick={handleUnpublishNotice}
                    disabled={isPostingNotice}
                    className="px-3.5 py-2.5 rounded-xl border border-red-200 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    title="सूचना सार्वजनिक बोर्डबाट हटाउनुहोस्"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>सूचना हटाउनुहोस् (Unpublish)</span>
                  </button>
                )}
              </div>

              {/* Public Link Share / Preview button */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(
                        `${noticeTitle}\n${formData.publicNoticeBoardNotice}\n— केन्द्रीय कार्यालय, कर्मैया, सर्लाही`
                      );
                      setCopiedNotice(true);
                      setTimeout(() => setCopiedNotice(false), 3000);
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl border border-amber-300 text-xs font-bold text-amber-900 bg-white hover:bg-amber-100/60 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>{copiedNotice ? 'कपी गरियो!' : 'सूचना कपी गर्नुहोस्'}</span>
                </button>
              </div>
            </div>

            {/* Post Confirmation Message (Shows exact Nepali message: "प्रकाशित गरिएको छ। धन्यवाद") */}
            {postFeedback && (
              <div className="p-4 bg-emerald-100/90 border border-emerald-300 text-emerald-950 rounded-2xl text-xs font-black flex items-center gap-2.5 shadow-sm animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <div className="flex-1">
                  <div className="font-extrabold text-emerald-900">प्रकाशित गरिएको छ। धन्यवाद</div>
                  <div className="text-[11px] font-normal text-emerald-800/90 mt-0.5">
                    {postFeedback}
                  </div>
                </div>
              </div>
            )}

            {/* Live Interactive Preview Card as it appears on the public contact card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-300 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                <span className="text-[11px] font-black uppercase text-amber-900 tracking-wider flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span>सार्वजनिक सम्पर्क कार्ड तथा सूचना विजेटमा देखिने प्रत्यक्ष रूप (Live Public Preview):</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  प्रकाशित गरिएको छ। धन्यवाद
                </span>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50/60 p-4 rounded-xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Megaphone className="w-4 h-4" />
                    </span>
                    <div>
                      <h5 className="text-xs font-black text-slate-900 font-poppins">
                        {noticeTitle || 'केन्द्रीय कार्यालय सार्वजनिक सूचना'}
                      </h5>
                      <span className="text-[10px] text-slate-500">
                        {formData.officeNameNepali || 'बोटे युवा समुदाय केन्द्रीय कार्यालय, कर्मैया-११, सर्लाही'}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                    noticePriority === 'urgent'
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : noticePriority === 'high'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-blue-100 text-blue-900 border border-blue-300'
                  }`}>
                    {noticePriority === 'urgent'
                      ? '🔴 अत्यन्त जरूरी सूचना'
                      : noticePriority === 'high'
                      ? '🟡 महत्वपूर्ण सूचना'
                      : '🔵 सामान्य सूचना'}
                  </span>
                </div>

                <p className="text-xs font-medium font-nepali text-slate-800 leading-relaxed bg-white/80 p-3 rounded-lg border border-amber-100">
                  {formData.publicNoticeBoardNotice || 'सूचना: केन्द्रीय कार्यालय कर्मैयामा नयाँ सदस्यता दर्ता, परिचयपत्र वितरण तथा छात्रवृत्ति आवेदन फाराम उपलब्ध छ। सबै युवा सदस्यहरू कार्यालय समयमा सम्पर्क गर्न सक्नुहुनेछ।'}
                </p>

                <div className="flex items-center justify-between text-[10.5px] text-slate-500 pt-1">
                  <span>
                    कार्यकारी प्रमुख: <strong>{formData.chiefExecutiveInCharge || 'Navaraj Bot (Bote)'}</strong>
                  </span>
                  <span className="font-mono text-[10px]">
                    २४/७ हटलाइन: {formData.hotline || formData.primaryPhone || '+977-9806389212'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Mode 2: Official Structured Table View & Tablet Responsive Editor */}
      {viewMode === 'table' && (
        <div className="space-y-4">
          {/* Table Controls & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1 shrink-0">
                <TabletIcon className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden md:inline">Category:</span>
              </span>
              {[
                { id: 'all', label: 'All Fields' },
                { id: 'location', label: '📍 Location & Address' },
                { id: 'contact', label: '📞 Hotlines & Phones' },
                { id: 'statutory', label: '🏛️ Leadership & Legal' },
                { id: 'notice', label: '📢 Public Notice' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setTableCategory(cat.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    tableCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Search parameter..."
                className="w-full sm:w-44 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
              {tableSearch && (
                <button
                  type="button"
                  onClick={() => setTableSearch('')}
                  className="text-xs text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Responsive Table Container with Horizontal Scroll for Tablets */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs bg-white">
            <table className="w-full min-w-[700px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-bold">
                  <th className="py-3 px-4 w-1/4">Field / Parameter</th>
                  <th className="py-3 px-4 w-5/12">Live Value &amp; Clickable Preview</th>
                  <th className="py-3 px-4 w-1/3">Direct Inline Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {/* 1. Office Name English */}
                {(tableCategory === 'all' || tableCategory === 'location') &&
                  (!tableSearch || 'office name english'.includes(tableSearch.toLowerCase())) && (
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Office Name (English)</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-slate-900">{formData.officeName}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyTable(formData.officeName || '', 'officeName')}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
                            title="Copy Office Name"
                          >
                            {copiedTableKey === 'officeName' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={formData.officeName || ''}
                          onChange={(e) => handleChange('officeName', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 font-medium"
                        />
                      </td>
                    </tr>
                  )}

                {/* 2. Office Name Nepali */}
                {(tableCategory === 'all' || tableCategory === 'location') &&
                  (!tableSearch || 'office name nepali'.includes(tableSearch.toLowerCase())) && (
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Office Name (नेपाली)</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium font-nepali text-emerald-800 font-bold">
                        <div className="flex items-center justify-between gap-2">
                          <span>{formData.officeNameNepali}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyTable(formData.officeNameNepali || '', 'officeNameNepali')}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
                            title="Copy Nepali Name"
                          >
                            {copiedTableKey === 'officeNameNepali' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={formData.officeNameNepali || ''}
                          onChange={(e) => handleChange('officeNameNepali', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 font-nepali"
                        />
                      </td>
                    </tr>
                  )}

                {/* 3. Full Computed Public Address (Never Undefined) */}
                {(tableCategory === 'all' || tableCategory === 'location') &&
                  (!tableSearch || 'headquarters address full location'.includes(tableSearch.toLowerCase())) && (
                    <tr className="bg-emerald-50/40 hover:bg-emerald-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#DC143C] shrink-0" />
                          <span>
                            Full Formatted Address
                            <span className="block text-[10px] text-slate-500 font-normal">
                              Live Website Footer &amp; Contact Display
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-1.5">
                          <p className="font-semibold text-slate-900 text-xs leading-relaxed">
                            {formatCentralOfficeAddress(formData)}
                          </p>
                          <div className="flex items-center gap-2">
                            <a
                              href={getCentralOfficeMapsUrl(formData)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] inline-flex items-center gap-1 transition shadow-2xs"
                              title="Test open in Google Maps"
                            >
                              <MapPin className="w-2.5 h-2.5" />
                              <span>Open Google Maps</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleCopyTable(formatCentralOfficeAddress(formData), 'fullAddress')}
                              className="px-2 py-0.5 rounded-md bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-[10px] font-medium inline-flex items-center gap-1 transition"
                            >
                              {copiedTableKey === 'fullAddress' ? (
                                <span className="text-emerald-600 font-bold flex items-center gap-1">
                                  <Check className="w-2.5 h-2.5" /> Copied
                                </span>
                              ) : (
                                <>
                                  <Copy className="w-2.5 h-2.5" />
                                  <span>Copy Address</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[11px] text-slate-600">
                        <span className="text-emerald-800 font-bold bg-emerald-100/70 border border-emerald-300 px-2 py-0.5 rounded-full inline-block mb-1">
                          Auto-formatted cleanly
                        </span>
                        <p className="text-[10px] text-slate-500">
                          To edit specific address parts, use the Settlement, Ward, Municipality, District rows below.
                        </p>
                      </td>
                    </tr>
                  )}

                {/* 4. Village Settlement */}
                {(tableCategory === 'all' || tableCategory === 'location') &&
                  (!tableSearch || 'village settlement गाउँ कर्मैया'.includes(tableSearch.toLowerCase())) && (
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800 pl-8">
                        ↳ Village / Settlement (गाउँ / टोल)
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {formData.villageSettlement || 'Karmaiya (कर्मैया)'}
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          placeholder="Karmaiya (कर्मैया)"
                          value={formData.villageSettlement || ''}
                          onChange={(e) => handleChange('villageSettlement', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 font-medium"
                        />
                      </td>
                    </tr>
                  )}

                {/* 5. Ward Number */}
                {(tableCategory === 'all' || tableCategory === 'location') &&
                  (!tableSearch || 'ward no वडा नं'.includes(tableSearch.toLowerCase())) && (
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800 pl-8">
                        ↳ Ward Number (वडा नं.)
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {formData.wardNo || 'Ward No. 11 (वडा नं. ११)'}
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          placeholder="Ward No. 11 (वडा नं. ११)"
                          value={formData.wardNo || ''}
                          onChange={(e) => handleChange('wardNo', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 font-medium"
                        />
                      </td>
                    </tr>
                  )}

                {/* 6. Municipality */}
                {(tableCategory === 'all' || tableCategory === 'location') &&
                  (!tableSearch || 'municipality बागमती नगरपालिका'.includes(tableSearch.toLowerCase())) && (
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800 pl-8">
                        ↳ Municipality (नगरपालिका / गाउँपालिका)
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {formData.municipality || 'Bagmati Municipality (बागमती नगरपालिका)'}
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          placeholder="Bagmati Municipality (बागमती नगरपालिका)"
                          value={formData.municipality || ''}
                          onChange={(e) => handleChange('municipality', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 font-medium"
                        />
                      </td>
                    </tr>
                  )}

                {/* 7. District */}
                {(tableCategory === 'all' || tableCategory === 'location') &&
                  (!tableSearch || 'district सर्लाही जिल्ला'.includes(tableSearch.toLowerCase())) && (
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800 pl-8">
                        ↳ District (जिल्ला)
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {formData.district || 'Sarlahi (सर्लाही)'}
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          placeholder="Sarlahi (सर्लाही)"
                          value={formData.district || ''}
                          onChange={(e) => handleChange('district', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 font-medium"
                        />
                      </td>
                    </tr>
                  )}

                {/* 8. Province & Country */}
                {(tableCategory === 'all' || tableCategory === 'location') &&
                  (!tableSearch || 'province country मधेश प्रदेश नेपाल'.includes(tableSearch.toLowerCase())) && (
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800 pl-8">
                        ↳ Province &amp; Country (प्रदेश / देश)
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {formData.province || 'Madhesh Province (मधेश प्रदेश)'}, {formData.country || 'Nepal (नेपाल)'}
                      </td>
                      <td className="py-3 px-4 space-y-1">
                        <input
                          type="text"
                          placeholder="Province"
                          value={formData.province || ''}
                          onChange={(e) => handleChange('province', e.target.value)}
                          className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Country"
                          value={formData.country || ''}
                          onChange={(e) => handleChange('country', e.target.value)}
                          className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white"
                        />
                      </td>
                    </tr>
                  )}

                {/* 9. Landmark */}
                {(tableCategory === 'all' || tableCategory === 'location') &&
                  (!tableSearch || 'landmark river basin bagmati bridge'.includes(tableSearch.toLowerCase())) && (
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800">
                        <div className="flex items-center gap-2">
                          <Navigation className="w-4 h-4 text-slate-600 shrink-0" />
                          <span>Landmark &amp; River Basin</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {formData.landmark || 'Bagmati Riverbank Confluence, East of Bagmati Bridge, Near Ward No. 11 Office'}
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={formData.landmark || ''}
                          onChange={(e) => handleChange('landmark', e.target.value)}
                          placeholder="Landmark description..."
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        />
                      </td>
                    </tr>
                  )}

                {/* 10. GPS Coordinates & Google Maps */}
                {(tableCategory === 'all' || tableCategory === 'location') &&
                  (!tableSearch || 'gps coordinates google maps embed'.includes(tableSearch.toLowerCase())) && (
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>GPS Coordinates &amp; Maps Link</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700 font-mono">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span>{formData.gpsCoordinates || '27.1350° N, 85.4720° E'}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyTable(formData.gpsCoordinates || '27.1350° N, 85.4720° E', 'gps')}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
                              title="Copy GPS Coordinates"
                            >
                              {copiedTableKey === 'gps' ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          {formData.googleMapsEmbedUrl && (
                            <a
                              href={formData.googleMapsEmbedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-blue-600 hover:underline flex items-center gap-1 font-sans"
                            >
                              <span>Direct Google Maps Navigation</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 space-y-1">
                        <input
                          type="text"
                          placeholder="27.1350° N, 85.4720° E"
                          value={formData.gpsCoordinates || ''}
                          onChange={(e) => handleChange('gpsCoordinates', e.target.value)}
                          className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white font-mono"
                        />
                        <input
                          type="url"
                          placeholder="Google Maps URL..."
                          value={formData.googleMapsEmbedUrl || ''}
                          onChange={(e) => handleChange('googleMapsEmbedUrl', e.target.value)}
                          className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white font-mono text-[11px]"
                        />
                      </td>
                    </tr>
                  )}

                {/* 11. 24/7 Hotline Number (Clickable test + edit) */}
                {(tableCategory === 'all' || tableCategory === 'contact') &&
                  (!tableSearch || 'hotline 24/7 phone नदी गस्ती'.includes(tableSearch.toLowerCase())) && (
                    <tr className="bg-amber-50/60 hover:bg-amber-50 transition-colors border-y border-amber-200">
                      <td className="py-3.5 px-4 font-bold text-amber-950">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                          <div>
                            <span className="font-black">24/7 Central River Hotline</span>
                            <span className="block text-[10px] font-normal text-amber-800">
                              Directly shown in website footer &amp; emergency card
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="space-y-1">
                            <a
                              href={`tel:${formatTelLink(formData.hotline)}`}
                              className="text-sm font-mono font-black text-amber-950 hover:underline hover:text-amber-800 block"
                              title="Click to test call Hotline"
                            >
                              {formData.hotline || '+977-9806389212'}
                            </a>
                            <span className="text-[10px] text-amber-800/80 font-semibold block">
                              Clickable tel: link for instant calling
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <a
                              href={`tel:${formatTelLink(formData.hotline)}`}
                              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition inline-flex items-center gap-1 shadow-2xs"
                              title="Test direct call"
                            >
                              <PhoneCall className="w-3 h-3" />
                              <span>Call</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => handleCopyTable(formData.hotline || '+977-9806389212', 'hotline')}
                              className="p-1 rounded-lg bg-white border border-amber-300 text-slate-700 hover:text-slate-900 transition"
                              title="Copy Hotline Number"
                            >
                              {copiedTableKey === 'hotline' ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <input
                          type="text"
                          placeholder="+977-9806389212"
                          value={formData.hotline || ''}
                          onChange={(e) => handleChange('hotline', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border-2 border-amber-400 rounded-xl bg-white font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
                        />
                      </td>
                    </tr>
                  )}

                {/* 12. Primary Official Phone */}
                {(tableCategory === 'all' || tableCategory === 'contact') &&
                  (!tableSearch || 'primary phone executive desk'.includes(tableSearch.toLowerCase())) && (
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-600 shrink-0" />
                          <span>Primary Phone (Executive Desk)</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800 font-mono">
                        <div className="flex items-center justify-between gap-2">
                          <a
                            href={`tel:${formatTelLink(formData.primaryPhone)}`}
                            className="hover:underline hover:text-blue-700 font-bold"
                            title="Click to test call"
                          >
                            {formData.primaryPhone || '+977-9806389212'}
                          </a>
                          <div className="flex items-center gap-1">
                            <a
                              href={`tel:${formatTelLink(formData.primaryPhone)}`}
                              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold"
                            >
                              Call
                            </a>
                            <button
                              type="button"
                              onClick={() => handleCopyTable(formData.primaryPhone || '', 'primaryPhone')}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
                              title="Copy number"
                            >
                              {copiedTableKey === 'primaryPhone' ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          placeholder="+977-9806389212"
                          value={formData.primaryPhone || ''}
                          onChange={(e) => handleChange('primaryPhone', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-mono"
                        />
                      </td>
                    </tr>
                  )}

                {/* 13. Secondary Phone */}
                {(tableCategory === 'all' || tableCategory === 'contact') &&
                  (!tableSearch || 'secondary phone'.includes(tableSearch.toLowerCase())) && (
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>Secondary Phone</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700 font-mono">
                        <div className="flex items-center justify-between gap-2">
                          <span>{formData.secondaryPhone || '+977-9800000001'}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyTable(formData.secondaryPhone || '', 'secPhone')}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
                            title="Copy number"
                          >
                            {copiedTableKey === 'secPhone' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          placeholder="+977-9800000001"
                          value={formData.secondaryPhone || ''}
                          onChange={(e) => handleChange('secondaryPhone', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-mono"
                        />
                      </td>
                    </tr>
                  )}

                {/* 14. Emergency River Rescue Helpline */}
                {(tableCategory === 'all' || tableCategory === 'contact') &&
                  (!tableSearch || 'emergency river helpline rescue'.includes(tableSearch.toLowerCase())) && (
                    <tr className="bg-red-50/40 hover:bg-red-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-red-950">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-red-600 shrink-0" />
                          <span>Emergency River Rescue Helpline</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-red-950 font-mono">
                        <div className="flex items-center justify-between gap-2">
                          <a
                            href={`tel:${formatTelLink(formData.emergencyRiverHelpline || '+977-9806389212')}`}
                            className="font-bold hover:underline"
                          >
                            {formData.emergencyRiverHelpline || '+977-9806389212'}
                          </a>
                          <div className="flex items-center gap-1">
                            <a
                              href={`tel:${formatTelLink(formData.emergencyRiverHelpline || '+977-9806389212')}`}
                              className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold"
                            >
                              Call
                            </a>
                            <button
                              type="button"
                              onClick={() => handleCopyTable(formData.emergencyRiverHelpline || '+977-9806389212', 'helpline')}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
                              title="Copy helpline"
                            >
                              {copiedTableKey === 'helpline' ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          placeholder="+977-9806389212"
                          value={formData.emergencyRiverHelpline || ''}
                          onChange={(e) => handleChange('emergencyRiverHelpline', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-red-300 rounded-lg bg-white font-mono"
                        />
                      </td>
                    </tr>
                  )}

                {/* 15. Official Email Dispatch */}
                {(tableCategory === 'all' || tableCategory === 'contact') &&
                  (!tableSearch || 'official email dispatch boteyouthcommunitynepal@gmail.com'.includes(tableSearch.toLowerCase())) && (
                    <tr className="bg-blue-50/40 hover:bg-blue-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                          <div>
                            <span className="font-bold">Official Email Dispatch</span>
                            <span className="block text-[10px] font-normal text-slate-500">
                              Public website footer &amp; inquiries contact
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800 font-mono">
                        <div className="flex items-center justify-between gap-2">
                          <a
                            href={`mailto:${formData.officialEmail || 'boteyouthcommunitynepal@gmail.com'}`}
                            className="text-xs font-bold text-blue-700 hover:underline hover:text-blue-900 truncate"
                            title="Click to compose email"
                          >
                            {formData.officialEmail || 'boteyouthcommunitynepal@gmail.com'}
                          </a>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <a
                              href={`mailto:${formData.officialEmail || 'boteyouthcommunitynepal@gmail.com'}`}
                              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition shadow-2xs"
                            >
                              Email
                            </a>
                            <button
                              type="button"
                              onClick={() => handleCopyTable(formData.officialEmail || 'boteyouthcommunitynepal@gmail.com', 'officialEmail')}
                              className="p-1 rounded-lg bg-white border border-blue-200 text-slate-600 hover:text-slate-900 transition"
                              title="Copy email address"
                            >
                              {copiedTableKey === 'officialEmail' ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <input
                          type="email"
                          value={formData.officialEmail || ''}
                          onChange={(e) => handleChange('officialEmail', e.target.value)}
                          placeholder="boteyouthcommunitynepal@gmail.com"
                          className="w-full px-3 py-1.5 text-xs border border-blue-300 rounded-xl bg-white font-mono focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  )}

                {/* 16. Secondary Email */}
                {(tableCategory === 'all' || tableCategory === 'contact') &&
                  (!tableSearch || 'secondary email liaison scholarships'.includes(tableSearch.toLowerCase())) && (
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>Secondary / Liaison Email</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700 font-mono">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate">{formData.secondaryEmail || 'navarajbot@gmail.com'}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyTable(formData.secondaryEmail || 'navarajbot@gmail.com', 'secEmail')}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
                            title="Copy secondary email"
                          >
                            {copiedTableKey === 'secEmail' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="email"
                          value={formData.secondaryEmail || ''}
                          onChange={(e) => handleChange('secondaryEmail', e.target.value)}
                          placeholder="navarajbot@gmail.com"
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-mono"
                        />
                      </td>
                    </tr>
                  )}

                {/* 17. Working Hours & Holidays */}
                {(tableCategory === 'all' || tableCategory === 'statutory') &&
                  (!tableSearch || 'working hours office timings holiday'.includes(tableSearch.toLowerCase())) && (
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-600 shrink-0" />
                          <span>Working Hours &amp; Schedule</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        <p>{formData.officeHours || 'Sunday – Friday: 10:00 AM – 5:00 PM'}</p>
                        <p className="text-[10px] text-slate-500 italic mt-0.5">{formData.holidaySchedule}</p>
                      </td>
                      <td className="py-3 px-4 space-y-1">
                        <input
                          type="text"
                          value={formData.officeHours || ''}
                          onChange={(e) => handleChange('officeHours', e.target.value)}
                          placeholder="Office Hours..."
                          className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white"
                        />
                        <input
                          type="text"
                          value={formData.holidaySchedule || ''}
                          onChange={(e) => handleChange('holidaySchedule', e.target.value)}
                          placeholder="Holiday Schedule..."
                          className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white text-[11px]"
                        />
                      </td>
                    </tr>
                  )}

                {/* 18. Chief Executive In-Charge */}
                {(tableCategory === 'all' || tableCategory === 'statutory') &&
                  (!tableSearch || 'chief executive incharge navaraj president'.includes(tableSearch.toLowerCase())) && (
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Chief Executive In-Charge</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {formData.chiefExecutiveInCharge || 'Navaraj Bot (Bote) — Youth Council President'}
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={formData.chiefExecutiveInCharge || ''}
                          onChange={(e) => handleChange('chiefExecutiveInCharge', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        />
                      </td>
                    </tr>
                  )}

                {/* 19. Vice Chairperson, General Secretary, Treasurer */}
                {(tableCategory === 'all' || tableCategory === 'statutory') &&
                  (!tableSearch || 'vice chairperson secretary general treasurer'.includes(tableSearch.toLowerCase())) && (
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800">
                        Executive Officers
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-700 space-y-0.5">
                        <p><strong>Vice-Chair:</strong> {formData.viceChairperson}</p>
                        <p><strong>General Sec:</strong> {formData.secretaryGeneral}</p>
                        <p><strong>Treasurer:</strong> {formData.treasurer}</p>
                      </td>
                      <td className="py-3 px-4 space-y-1">
                        <input
                          type="text"
                          placeholder="Vice-Chairperson"
                          value={formData.viceChairperson || ''}
                          onChange={(e) => handleChange('viceChairperson', e.target.value)}
                          className="w-full px-2 py-0.5 text-xs border border-slate-300 rounded"
                        />
                        <input
                          type="text"
                          placeholder="Secretary General"
                          value={formData.secretaryGeneral || ''}
                          onChange={(e) => handleChange('secretaryGeneral', e.target.value)}
                          className="w-full px-2 py-0.5 text-xs border border-slate-300 rounded"
                        />
                        <input
                          type="text"
                          placeholder="Treasurer"
                          value={formData.treasurer || ''}
                          onChange={(e) => handleChange('treasurer', e.target.value)}
                          className="w-full px-2 py-0.5 text-xs border border-slate-300 rounded"
                        />
                      </td>
                    </tr>
                  )}

                {/* 20. Statutory DAO, SWC, PAN */}
                {(tableCategory === 'all' || tableCategory === 'statutory') &&
                  (!tableSearch || 'dao reg swc affiliation pan number'.includes(tableSearch.toLowerCase())) && (
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-600 shrink-0" />
                          <span>Statutory Registration (DAO / SWC / PAN)</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs font-mono text-slate-700 space-y-0.5">
                        <p>DAO: {formData.daoRegistrationNo}</p>
                        <p>SWC: {formData.swcAffiliationNo}</p>
                        <p>PAN: {formData.panNumber}</p>
                      </td>
                      <td className="py-3 px-4 space-y-1">
                        <input
                          type="text"
                          placeholder="DAO Registration"
                          value={formData.daoRegistrationNo || ''}
                          onChange={(e) => handleChange('daoRegistrationNo', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-mono"
                        />
                        <input
                          type="text"
                          placeholder="SWC Affiliation"
                          value={formData.swcAffiliationNo || ''}
                          onChange={(e) => handleChange('swcAffiliationNo', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-mono"
                        />
                        <input
                          type="text"
                          placeholder="PAN Number"
                          value={formData.panNumber || ''}
                          onChange={(e) => handleChange('panNumber', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-mono"
                        />
                      </td>
                    </tr>
                  )}

                {/* 21. Central कार्यालय Public सूचना Board सूचना */}
                {(tableCategory === 'all' || tableCategory === 'notice') &&
                  (!tableSearch || 'public notice सूचना board announcement'.includes(tableSearch.toLowerCase())) && (
                    <tr className="bg-amber-50/50 hover:bg-amber-50/80 transition-colors border-t-2 border-amber-300">
                      <td className="py-4 px-4 font-bold text-amber-950">
                        <div className="flex items-center gap-2">
                          <Megaphone className="w-4 h-4 text-amber-600 shrink-0" />
                          <div>
                            <span className="font-black">Public सूचना Board Notice</span>
                            <span className="block text-[10px] font-normal text-amber-800">
                              Feature 6: Visitor Notice on Contact Card
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
                            {noticeTitle || 'कार्यालय सूचना'}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            noticePriority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {noticePriority === 'urgent' ? '🔴 अत्यन्त जरूरी' : '🟡 महत्वपूर्ण'}
                          </span>
                          {formData.publicNoticeIsPublished !== false ? (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                              ✓ प्रकाशित गरिएको छ
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                              Draft
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium font-nepali text-slate-800 line-clamp-2 bg-white/80 p-2 rounded border border-amber-200">
                          {formData.publicNoticeBoardNotice || 'कुनै सूचना छैन'}
                        </p>
                      </td>
                      <td className="py-4 px-4 space-y-2">
                        <input
                          type="text"
                          value={noticeTitle}
                          onChange={(e) => {
                            setNoticeTitle(e.target.value);
                            handleChange('publicNoticeTitle', e.target.value);
                          }}
                          placeholder="Notice Title..."
                          className="w-full px-2.5 py-1 text-xs border border-amber-300 rounded-lg bg-white font-nepali"
                        />
                        <textarea
                          rows={2}
                          value={formData.publicNoticeBoardNotice || ''}
                          onChange={(e) => handleChange('publicNoticeBoardNotice', e.target.value)}
                          placeholder="सूचनाको व्यहोरा..."
                          className="w-full px-2.5 py-1 text-xs border border-amber-300 rounded-lg bg-white font-nepali text-xs"
                        />
                        <button
                          type="button"
                          onClick={handlePostNotice}
                          disabled={isPostingNotice || !formData.publicNoticeBoardNotice?.trim()}
                          className="w-full px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition shadow-2xs disabled:opacity-50 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>पोष्ट / प्रकाशित गर्नुहोस् (Broadcast)</span>
                        </button>
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Live Public Visitor Experience Preview Card (Verifies Footer & Contact Card) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h4 className="font-poppins font-black text-sm uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span>Live Website Public Contact Card &amp; Footer Preview</span>
            </h4>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Test how public visitors interact with Karmaiya Central Office links:
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Card 1: Address Link */}
          <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#DC143C]" />
              <span>Headquarters Location (Clickable Maps)</span>
            </span>
            <p className="text-xs text-slate-200 font-medium leading-relaxed">
              {formatCentralOfficeAddress(formData)}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href={getCentralOfficeMapsUrl(formData)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition flex items-center gap-1"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <button
                type="button"
                onClick={() => handleCopyTable(formatCentralOfficeAddress(formData), 'prevAddr')}
                className="px-2 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] transition"
              >
                {copiedTableKey === 'prevAddr' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Card 2: 24/7 Hotline */}
          <div className="bg-slate-800/90 p-4 rounded-2xl border border-amber-500/30 space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>24/7 River Hotline (Clickable tel:)</span>
            </span>
            <a
              href={`tel:${formatTelLink(formData.hotline || '+977-9806389212')}`}
              className="text-base font-mono font-black text-amber-300 hover:underline block"
              title="Click to call Hotline"
            >
              Hotline: {formData.hotline || formData.primaryPhone || '+977-9806389212'}
            </a>
            <div className="flex items-center gap-2 pt-1">
              <a
                href={`tel:${formatTelLink(formData.hotline || '+977-9806389212')}`}
                className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-black transition flex items-center gap-1 shadow-2xs"
              >
                <PhoneCall className="w-3 h-3" />
                <span>Call Hotline</span>
              </a>
              <button
                type="button"
                onClick={() => handleCopyTable(formData.hotline || '+977-9806389212', 'prevHotline')}
                className="px-2 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] transition"
              >
                {copiedTableKey === 'prevHotline' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Card 3: Official Email */}
          <div className="bg-slate-800/90 p-4 rounded-2xl border border-blue-500/30 space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>Official Email (Clickable mailto:)</span>
            </span>
            <a
              href={`mailto:${formData.officialEmail || 'boteyouthcommunitynepal@gmail.com'}`}
              className="text-xs font-mono font-bold text-blue-300 hover:underline block truncate"
              title="Click to compose email"
            >
              {formData.officialEmail || 'boteyouthcommunitynepal@gmail.com'}
            </a>
            <div className="flex items-center gap-2 pt-1">
              <a
                href={`mailto:${formData.officialEmail || 'boteyouthcommunitynepal@gmail.com'}`}
                className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition flex items-center gap-1"
              >
                <Mail className="w-3 h-3" />
                <span>Compose Mail</span>
              </a>
              <button
                type="button"
                onClick={() => handleCopyTable(formData.officialEmail || 'boteyouthcommunitynepal@gmail.com', 'prevEmail')}
                className="px-2 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] transition"
              >
                {copiedTableKey === 'prevEmail' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Save & Live Preview Action Bar */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-700">
            Saving updates this official data on Firebase Firestore, Express disk storage, and notifies all connected users.
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {onNavigateToPublic && (
            <button
              type="button"
              onClick={onNavigateToPublic}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview on Public Site</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Karmaiya Details</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
