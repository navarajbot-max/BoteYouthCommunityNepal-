/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCommunityData } from '../context/CommunityDataContext';
import { MemberApplication } from '../types';
import MembershipIdCard from './MembershipIdCard';
import {
  UserCheck,
  Upload,
  CheckCircle,
  Download,
  Printer,
  Sparkles,
  Shield,
  QrCode,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Award,
  Loader2,
  Globe,
  IdCard,
  Plus,
  Search,
  X,
  Tag,
  Filter,
  Heart,
  Check
} from 'lucide-react';

export default function JoiningForm() {
  const { colors } = useTheme();
  const {
    submitMemberRegistration,
    hasJoinedCommunity,
    hideJoinOption,
    isFollowingCommunity,
    followerEmail
  } = useCommunityData();

  const [fullName, setFullName] = useState('');
  const [fullNameNepali, setFullNameNepali] = useState('');
  const [age, setAge] = useState('22');
  const [gender, setGender] = useState('Male');
  const [category, setCategory] = useState<'Youth Member' | 'Student Member' | 'General Community' | 'Cultural Advisor'>('Youth Member');
  const [district, setDistrict] = useState('Sarlahi');
  const [municipality, setMunicipality] = useState('Bagmati Municipality');
  const [ward, setWard] = useState('11');
  const [phone, setPhone] = useState('+977-98');
  const [email, setEmail] = useState(followerEmail || '');
  const [education, setEducation] = useState('Grade 12 / Higher Secondary');
  const [interests, setInterests] = useState<string[]>([
    'River Ecology Conservation',
    'Tarahi Language Documentation'
  ]);
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop');

  const [completedCard, setCompletedCard] = useState<MemberApplication | null>(() => {
    try {
      const raw = localStorage.getItem('bycn_my_membership_card');
      if (raw) {
        const p = JSON.parse(raw);
        return {
          id: p.id || `app-${Date.now()}`,
          fullName: p.name || p.fullName || 'Bote Youth Member',
          age: String(p.age || '22'),
          gender: p.gender || 'Male',
          category: p.category || 'Youth Member',
          district: p.district || 'Sarlahi',
          municipality: p.municipality || 'Bagmati Municipality',
          ward: p.ward || '11',
          phone: p.phone || '',
          email: p.email || '',
          education: p.education || 'Grade 12 / Higher Secondary',
          interestAreas: Array.isArray(p.interestAreas) ? p.interestAreas : (p.interest ? [p.interest] : ['River Ecology Conservation']),
          photoUrl: p.photoUrl || '',
          submittedAt: p.savedAt ? new Date(p.savedAt).toLocaleDateString() : new Date().toLocaleDateString(),
          membershipId: p.membershipId || 'BYCN-2026-0000'
        };
      }
    } catch {
      // ignore
    }
    return null;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);
  const [showReapplyForm, setShowReapplyForm] = useState(false);
  const [hasSavedCard, setHasSavedCard] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem('bycn_my_membership_card'));
    } catch {
      return false;
    }
  });

  const [interestCategory, setInterestCategory] = useState<string>('all');
  const [interestSearch, setInterestSearch] = useState<string>('');
  const [customInterestInput, setCustomInterestInput] = useState<string>('');

  const interestCategories = [
    { id: 'all', label: 'All Areas' },
    { id: 'culture', label: 'Culture & Heritage' },
    { id: 'environment', label: 'River & Environment' },
    { id: 'education', label: 'Education & Youth' },
    { id: 'welfare', label: 'Health & Welfare' },
    { id: 'digital', label: 'Digital & Media' },
    { id: 'advocacy', label: 'Leadership & Rights' }
  ];

  const availableInterests: { label: string; category: string; desc: string; nepali?: string }[] = [
    // Culture & Heritage
    { label: 'Tarahi & Bote Indigenous Language Documentation', category: 'culture', nepali: 'मातृभाषा संरक्षण तथा अभिलेखीकरण', desc: 'Audio recordings, linguistic dictionary work & oral stories' },
    { label: 'Traditional Wooden Boat (Dunga/Canoe) Crafting & River Navigation', category: 'culture', nepali: 'काठको डुङ्गा निर्माण तथा जलयात्रा', desc: 'Preserving canoe carving and Bagmati River navigation mastery' },
    { label: 'Cultural Gholeni Dance, Madal & Festive Music Performance', category: 'culture', nepali: 'घोलेनी नृत्य तथा मौलिक लोकगीत', desc: 'Festive performances, cultural troupe and traditional folk music' },
    { label: 'Traditional Net Weaving (Jal) & Indigenous Fishing Arts', category: 'culture', nepali: 'परम्परागत माछा मार्ने कला तथा जाल बुनाई', desc: 'Handcrafted cotton/nylon nets & ancestral fishing techniques' },
    { label: 'Indigenous Costumes, Loom Weaving & Cultural Jewelry', category: 'culture', nepali: 'मौलिक भेषभूषा तथा परम्परागत गरगहना', desc: 'Preserving handloom weaving, traditional fabrics and cultural attire' },
    { label: 'Oral History, Elder Storytelling & Folklore Archive', category: 'culture', nepali: 'मौखिक इतिहास तथा पुर्ख्यौली कथा संग्रह', desc: 'Documenting elder folklore, origin legends and genealogical archives' },
    { label: 'Traditional Bote Cuisine & River Culinary Heritage', category: 'culture', nepali: 'मौलिक खानपान तथा नदी परिकार संरक्षण', desc: 'Indigenous river fish recipes, local delicacies and food festivals' },

    // River & Environment
    { label: 'River Ecology & Bagmati River Cleanup Patrols', category: 'environment', nepali: 'नदी सफाइ तथा वातावरण संरक्षण', desc: 'Weekly river patrols, zero-plastic initiatives along Bagmati River' },
    { label: 'Water Safety, Life Guarding & Flood Rescue Support', category: 'environment', nepali: 'बाढी उद्धार तथा जल सुरक्षा स्वयंसेवक', desc: 'Emergency swift-water rescue, boat drills and monsoon flood alert' },
    { label: 'Wetland Flora, Riverine Birds & Wildlife Conservation', category: 'environment', nepali: 'सिमसार तथा जैविक विविधता संरक्षण', desc: 'Protecting aquatic species, migratory birds and river ecology' },
    { label: 'Riverbank Tree Plantation & Soil Erosion Control', category: 'environment', nepali: 'तटबन्ध वृक्षारोपण तथा भू-संरक्षण', desc: 'Bamboo and native tree planting along riverbanks to prevent erosion' },

    // Education & Youth
    { label: 'Youth Mentorship & School Homework Tutoring', category: 'education', nepali: 'युवा परामर्श तथा विद्यार्थी ट्युसन', desc: 'Mentoring Bote schoolchildren in Karmaiya and local ward schools' },
    { label: 'Scholarship Drives & Educational Stationery Support', category: 'education', nepali: 'छात्रवृत्ति तथा शैक्षिक सामग्री सहयोग', desc: 'Organizing school supplies, textbook exchanges and book drives' },
    { label: 'Career Counseling & Vocational Skill Workshops', category: 'education', nepali: 'करियर काउन्सिलिङ तथा प्राविधिक सीप', desc: 'Guidance on trade skills, technical diplomas and civil service' },
    { label: 'Sports Tournaments (Football, Volleyball & Traditional Games)', category: 'education', nepali: 'खेलकुद प्रतियोगिता तथा युवा फिटनेस', desc: 'Inter-ward tournaments, athletics and traditional community games' },

    // Health & Welfare
    { label: 'Community Health Camps & Blood Donation Mobilization', category: 'welfare', nepali: 'स्वास्थ्य शिविर तथा रक्तदान कार्यक्रम', desc: 'Free medical camps, blood grouping and health awareness drives' },
    { label: 'First Aid, Disaster Preparedness & Emergency Response', category: 'welfare', nepali: 'प्राथमिक उपचार तथा आपतकालीन व्यवस्थापन', desc: 'Community first aid training and natural disaster preparedness' },
    { label: 'Elderly Care, Social Welfare & Single Mothers Support', category: 'welfare', nepali: 'ज्येष्ठ नागरिक तथा सामाजिक कल्याण सहयोग', desc: 'Assistance for senior community members and vulnerable families' },
    { label: 'Women Handicrafts, Bamboo Weaving & Micro-Enterprise', category: 'welfare', nepali: 'महिला हस्तकला तथा बाँसका सामग्री', desc: 'Bamboo baskets, fish traps (Dhadhi) and cooperative sales' },

    // Digital & Media
    { label: 'Digital Literacy, Computer Skills & Smartphone Training', category: 'digital', nepali: 'डिजिटल साक्षरता तथा कम्प्युटर सीप', desc: 'Basic computing, email, mobile internet and online public services' },
    { label: 'Photography, Videography & Documentary Filmmaking', category: 'digital', nepali: 'फोटोग्राफी तथा भिडियो डकुमेन्ट्री', desc: 'Documenting community life, events and video storytelling' },
    { label: 'Social Media, Website & Community Journalism', category: 'digital', nepali: 'सामाजिक सञ्जाल तथा सामुदायिक पत्रकारिता', desc: 'Website management, Facebook outreach and community newsletters' },

    // Leadership & Rights
    { label: 'Indigenous Rights, Legal Awareness & Civic Education', category: 'advocacy', nepali: 'आदिवासी अधिकार तथा कानुनी सचेतना', desc: 'Indigenous nationality rights, ILO Convention 169 & legal literacy' },
    { label: 'Public Speaking, Youth Debate & Leadership Seminars', category: 'advocacy', nepali: 'नेतृत्व विकास तथा वक्तृत्वकला तालिम', desc: 'Training youth spokespersons, public speaking and civic leadership' }
  ];

  const handleInterestToggle = (item: string) => {
    if (interests.includes(item)) {
      setInterests(interests.filter(i => i !== item));
    } else {
      setInterests([...interests, item]);
    }
  };

  const handleAddCustomInterest = () => {
    const trimmed = customInterestInput.trim();
    if (!trimmed) return;
    if (!interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
    }
    setCustomInterestInput('');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoadSavedCard = () => {
    try {
      const raw = localStorage.getItem('bycn_my_membership_card');
      if (raw) {
        const p = JSON.parse(raw);
        setCompletedCard({
          id: p.id || `app-${Date.now()}`,
          fullName: p.name || p.fullName || 'Bote Youth Member',
          age: String(p.age || '22'),
          gender: p.gender || 'Male',
          category: p.category || 'Youth Member',
          district: p.district || 'Sarlahi',
          municipality: p.municipality || 'Bagmati Municipality',
          ward: p.ward || '11',
          phone: p.phone || '',
          email: p.email || '',
          education: p.education || 'Grade 12 / Higher Secondary',
          interestAreas: Array.isArray(p.interestAreas) ? p.interestAreas : (p.interest ? [p.interest] : ['River Ecology Conservation']),
          photoUrl: p.photoUrl || '',
          submittedAt: p.savedAt ? new Date(p.savedAt).toLocaleDateString() : new Date().toLocaleDateString(),
          membershipId: p.membershipId || 'BYCN-2026-0000'
        });
        window.scrollTo({ top: 200, behavior: 'smooth' });
      }
    } catch (e) {
      console.warn('Could not load saved card:', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccessMsg(null);

    const randomCode = Math.floor(1000 + Math.random() * 9000);
    let membershipId = `BYCN-2026-${randomCode}`;
    let memberId = `mem-${Date.now()}`;

    try {
      // Real-time server persistence on internet
      const result = await submitMemberRegistration({
        name: fullName || 'Bote Youth Member',
        nameNepali: fullNameNepali,
        age,
        gender,
        category,
        district,
        municipality,
        ward,
        phone,
        email,
        education,
        interest: interests.join(', '),
        photoUrl
      });

      if (result.success && result.membershipId) {
        membershipId = result.membershipId;
        if (result.memberId) memberId = result.memberId;
        setSubmitSuccessMsg(result.message || 'Your membership details have been safely registered and saved in real-time on the website database!');
      }
    } catch (err) {
      console.warn('Membership submission error:', err);
    } finally {
      setIsSubmitting(false);
    }

    const newApp: MemberApplication = {
      id: memberId,
      fullName: fullName || 'Bote Youth Member',
      age,
      gender,
      category,
      district,
      municipality,
      ward,
      phone,
      email,
      education,
      interestAreas: interests,
      photoUrl,
      submittedAt: new Date().toLocaleDateString(),
      membershipId
    };

    // Save to localStorage so member can retrieve it anytime
    try {
      localStorage.setItem('bycn_my_membership_card', JSON.stringify({
        ...newApp,
        name: newApp.fullName,
        savedAt: new Date().toISOString()
      }));
      setHasSavedCard(true);
    } catch (e) {
      console.warn(e);
    }

    setCompletedCard(newApp);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="space-y-12">
      {/* Introduction banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        {completedCard || hasJoinedCommunity ? (
          <>
            <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Verified Community Member</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-poppins text-slate-900 leading-tight">
              My Official Digital Membership Card
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              You are officially registered in the Bote Youth Community Nepal records. Your digital ID card is active below. You can save, download, or print it anytime.
            </p>
          </>
        ) : (
          <>
            <div className="inline-flex items-center space-x-2 bg-red-100 text-[#DC143C] px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <UserCheck className="w-4 h-4" />
              <span>Official Membership Registration 2026</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-poppins text-slate-900 leading-tight">
              Community Joining Form &amp; Digital ID Card
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Join <strong>BoteYouthCommunityNepal</strong> to protect our indigenous heritage, participate in river ecology patrols, access scholarship funds, and receive your official digital membership identity card.
            </p>
          </>
        )}

        {/* Quick View Saved ID Card Button if previously registered */}
        {hasSavedCard && !completedCard && (
          <div className="pt-2">
            <button
              type="button"
              onClick={handleLoadSavedCard}
              className="inline-flex items-center gap-2 bg-white border-2 border-[#003893] text-[#003893] hover:bg-blue-50 px-5 py-2 rounded-2xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <IdCard className="w-4 h-4 text-[#003893]" />
              <span>Already Registered? Click here to view your saved ID Card</span>
            </button>
          </div>
        )}
      </div>

      {/* Generated ID Card Preview if submitted / already registered */}
      {completedCard && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border-4 border-[#003893] shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <span className="text-xs font-black uppercase text-green-700 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Active Verified Member Card</span>
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">
              {completedCard.submittedAt}
            </span>
          </div>

          {/* Real High-Resolution Downloadable Membership ID Card Component */}
          <MembershipIdCard
            member={{
              id: completedCard.id,
              membershipId: completedCard.membershipId,
              name: completedCard.fullName,
              phone: completedCard.phone,
              email: completedCard.email,
              ward: completedCard.ward,
              municipality: completedCard.municipality,
              district: completedCard.district,
              age: completedCard.age,
              gender: completedCard.gender,
              category: completedCard.category,
              interest: completedCard.interestAreas.join(', '),
              education: completedCard.education,
              photoUrl: completedCard.photoUrl,
              status: 'active'
            }}
          />

          <div className="pt-2 text-center border-t border-slate-100">
            <button
              onClick={() => {
                setShowReapplyForm(!showReapplyForm);
                if (!showReapplyForm) {
                  setCompletedCard(null);
                }
              }}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold transition cursor-pointer"
            >
              &larr; Need to register another member? (Admin or Family Member)
            </button>
          </div>
        </div>
      )}

      {/* If user is already following with Gmail / hideJoinOption is true, show verified supporter card */}
      {!completedCard && hideJoinOption && !showReapplyForm && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border-2 border-emerald-300 shadow-lg text-center space-y-5">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black uppercase tracking-wider border border-emerald-200">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Gmail Follower &amp; Community Supporter</span>
            </div>
            <h3 className="text-2xl font-black font-poppins text-slate-900">
              Your Community Record Is Active
            </h3>
            <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
              {followerEmail ? (
                <>
                  You have followed Bote Youth Community Nepal via <strong>{followerEmail}</strong>. Your one-time following is registered in our database, so additional membership forms are hidden.
                </>
              ) : (
                <>
                  You are officially recorded in the Bote Youth Community Nepal system. Membership registration is already complete.
                </>
              )}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowReapplyForm(true)}
              className="bg-[#003893] hover:bg-blue-900 text-white text-xs font-bold px-6 py-3 rounded-2xl shadow transition flex items-center gap-2 cursor-pointer"
            >
              <IdCard className="w-4 h-4" />
              <span>Generate Printable Member ID Card</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Registration Form: Only shown if user hasn't joined/followed, or opted to generate ID */}
      {!completedCard && (!hideJoinOption || showReapplyForm) && (
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8"
        >
          {/* Section 1: Personal Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase text-[#DC143C] tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-100 text-[#DC143C] flex items-center justify-center text-xs">1</span>
              <span>Personal Particulars &amp; Identity</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Full Name (English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Navaraj Bote"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#DC143C]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">पूरा नाम (नेपालीमा)</label>
                <input
                  type="text"
                  placeholder="उदा. नवराज बोटे"
                  value={fullNameNepali}
                  onChange={(e) => setFullNameNepali(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#DC143C]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Age (Years) *</label>
                <input
                  type="number"
                  required
                  min="12"
                  max="95"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#DC143C]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Gender *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none"
                >
                  <option value="Male">Male (पुरुष)</option>
                  <option value="Female">Female (महिला)</option>
                  <option value="Other">Other / Prefer not to say</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase">Membership Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none font-semibold text-[#003893]"
                >
                  <option value="Youth Member">Youth Member (Age 15 - 35)</option>
                  <option value="Student Member">Student Member / Scholarship Applicant</option>
                  <option value="General Community">General Bote Community Resident</option>
                  <option value="Cultural Advisor">Senior Elder / Cultural Advisor</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Permanent & Current Address */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase text-[#003893] tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-[#003893] flex items-center justify-center text-xs">2</span>
              <span>Address &amp; Ward Coordinates</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">District *</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none"
                >
                  <option value="Sarlahi">Sarlahi (सर्लाही)</option>
                  <option value="Chitwan">Chitwan (चितवन)</option>
                  <option value="Nawalpur">Nawalpur / Nawalparasi</option>
                  <option value="Tanahun">Tanahun (तनहुँ)</option>
                  <option value="Makwanpur">Makwanpur (मकवानपुर)</option>
                  <option value="Kathmandu">Kathmandu (काठमाडौँ)</option>
                  <option value="Other">Other District</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Municipality / Rural Municipality *</label>
                <input
                  type="text"
                  required
                  value={municipality}
                  onChange={(e) => setMunicipality(e.target.value)}
                  placeholder="e.g. Bagmati Municipality"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003893]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Ward Number *</label>
                <input
                  type="text"
                  required
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  placeholder="e.g. 11"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003893]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase">Mobile Hotline / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+977-9800000000"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003893]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="member@gmail.com"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003893]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Profile Photo Upload for Digital ID */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase text-amber-700 tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs">3</span>
              <span>Member Photo for Digital ID Card</span>
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="w-24 h-28 rounded-2xl overflow-hidden border-2 border-[#DC143C] bg-white shadow shrink-0">
                <img
                  src={photoUrl && photoUrl.trim() ? photoUrl.trim() : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop'}
                  alt="Candidate Member Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2 text-center sm:text-left flex-1">
                <label className="text-xs font-bold text-slate-800 block">
                  Upload Passport Size Photo
                </label>
                <p className="text-[11px] text-slate-500">
                  This photo will be embossed directly onto your official Bote Youth Community Nepal Identity Card.
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#DC143C] file:text-white hover:file:bg-[#b51031] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Interests & Skills */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs">4</span>
                <span>Volunteer &amp; Community Interests (स्वयंसेवा तथा रुचि क्षेत्र)</span>
              </h3>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#003893] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {interests.length} Selected
                </span>
                {interests.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setInterests([])}
                    className="text-[11px] font-semibold text-slate-400 hover:text-red-600 transition"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Select one or multiple areas where you want to contribute, volunteer, or receive specialized community training.
            </p>

            {/* Category Filter Tabs & Search */}
            <div className="space-y-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <div className="flex flex-wrap items-center gap-1.5">
                {interestCategories.map((cat) => {
                  const isActive = interestCategory === cat.id;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setInterestCategory(cat.id)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#003893] text-white shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Quick Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={interestSearch}
                  onChange={(e) => setInterestSearch(e.target.value)}
                  placeholder="Filter volunteer opportunities by keyword (e.g. boat, language, tutoring, rescue, digital)..."
                  className="w-full pl-8.5 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003893]"
                />
                {interestSearch && (
                  <button
                    type="button"
                    onClick={() => setInterestSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Available Interests Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
              {availableInterests
                .filter((item) => {
                  const matchesCat = interestCategory === 'all' || item.category === interestCategory;
                  const q = interestSearch.toLowerCase().trim();
                  const matchesQuery =
                    !q ||
                    item.label.toLowerCase().includes(q) ||
                    item.desc.toLowerCase().includes(q) ||
                    (item.nepali && item.nepali.includes(q));
                  return matchesCat && matchesQuery;
                })
                .map((item) => {
                  const checked = interests.includes(item.label);
                  return (
                    <button
                      type="button"
                      key={item.label}
                      onClick={() => handleInterestToggle(item.label)}
                      className={`text-left p-3 rounded-2xl border transition-all flex items-start space-x-3 cursor-pointer ${
                        checked
                          ? 'border-[#003893] bg-blue-50/70 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white hover:bg-slate-50/50'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                          checked ? 'bg-[#003893] border-[#003893] text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {checked && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>

                      <div className="flex-1 min-w-0 space-y-0.5">
                        <span className={`text-xs block leading-snug font-bold ${checked ? 'text-[#003893]' : 'text-slate-800'}`}>
                          {item.label}
                        </span>
                        {item.nepali && (
                          <span className="text-[11px] text-[#DC143C] font-medium block">
                            {item.nepali}
                          </span>
                        )}
                        <p className="text-[11px] text-slate-500 leading-tight">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
            </div>

            {/* Custom Interest Input */}
            <div className="pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Have another personal skill or community passion? Add your custom interest:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customInterestInput}
                  onChange={(e) => setCustomInterestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomInterest();
                    }
                  }}
                  placeholder="e.g. Carpentry &amp; Woodwork, Guitar &amp; Music, Legal Aid, Drone Videography..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003893] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddCustomInterest}
                  disabled={!customInterestInput.trim()}
                  className="bg-[#003893] hover:bg-[#002b70] disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Interest</span>
                </button>
              </div>
            </div>

            {/* Currently Selected Summary Chips */}
            {interests.length > 0 && (
              <div className="pt-2 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Your Selected Interests ({interests.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {interests.map((interest) => (
                    <span
                      key={interest}
                      className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-[#003893] text-[11px] font-bold px-2.5 py-1 rounded-xl"
                    >
                      <span className="truncate max-w-[200px]">{interest}</span>
                      <button
                        type="button"
                        onClick={() => handleInterestToggle(interest)}
                        className="p-0.5 hover:bg-blue-200 rounded-full transition cursor-pointer"
                        title="Remove interest"
                      >
                        <X className="w-3 h-3 text-[#003893]" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#003893] via-[#8B0000] to-[#DC143C] hover:opacity-95 disabled:opacity-75 text-white font-extrabold py-4 rounded-2xl shadow-xl transition-all text-sm uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 text-amber-300 animate-spin" />
                  <span>Saving Details Real-Time to Website...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-5 h-5 text-amber-300" />
                  <span>Submit Registration &amp; Generate Digital ID Card</span>
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>Real-Time Internet Sync: Details saved directly to official Bote Youth Community database.</span>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
