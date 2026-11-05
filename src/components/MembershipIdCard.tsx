/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import {
  Download,
  Printer,
  CheckCircle,
  Shield,
  Award,
  Sparkles,
  UserCheck,
  Check,
  ExternalLink,
  QrCode,
  X,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { useCommunityData } from '../context/CommunityDataContext';

export interface MembershipCardData {
  id?: string;
  membershipId?: string;
  name: string;
  nameNepali?: string;
  phone: string;
  email?: string;
  ward: string;
  municipality?: string;
  district?: string;
  age: number | string;
  gender?: string;
  category: string;
  interest?: string;
  education?: string;
  photoUrl?: string;
  registeredAt?: string;
  status?: 'active' | 'verified' | 'pending';
}

interface MembershipIdCardProps {
  member: MembershipCardData;
  onClose?: () => void;
  showAdminControls?: boolean;
}

export default function MembershipIdCard({
  member,
  onClose,
  showAdminControls = false
}: MembershipIdCardProps) {
  const { updateMemberStatus } = useCommunityData();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState<'active' | 'verified' | 'pending'>(member.status || 'active');

  const memberId = member.membershipId || member.id || `BYCN-${new Date().getFullYear()}-0000`;
  const photo = member.photoUrl && member.photoUrl.trim()
    ? member.photoUrl.trim()
    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600';

  // Real ID Card Image Downloader & Device Saver
  const handleSaveAndDownload = async () => {
    setIsDownloading(true);
    setSaveSuccessMsg(null);

    // 1. Permanently persist ID card data to device localStorage
    try {
      localStorage.setItem('bycn_my_membership_card', JSON.stringify({
        ...member,
        membershipId: memberId,
        savedAt: new Date().toISOString()
      }));
    } catch (e) {
      console.warn('Could not save card to localStorage:', e);
    }

    try {
      if (cardRef.current) {
        // High resolution 2x scale snapshot for crystal clear print & photo quality
        const dataUrl = await toPng(cardRef.current, {
          quality: 0.98,
          pixelRatio: 2.5,
          cacheBust: true,
          backgroundColor: '#001a40'
        });

        const link = document.createElement('a');
        link.download = `BYCN_Official_ID_Card_${memberId}_${member.name.replace(/\s+/g, '_')}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setSaveSuccessMsg('✓ ID Card successfully downloaded to your device and saved to your profile!');
        setTimeout(() => setSaveSuccessMsg(null), 5000);
      } else {
        fallbackCanvasDownload();
      }
    } catch (err) {
      console.warn('HTML-to-image capture error, executing HTML5 canvas fallback:', err);
      fallbackCanvasDownload();
    } finally {
      setIsDownloading(false);
    }
  };

  // HTML5 Canvas Fallback Generator (guarantees zero CORS failures)
  const fallbackCanvasDownload = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1050;
      canvas.height = 650;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Background gradient: Deep Navy to Crimson Red
      const grad = ctx.createLinearGradient(0, 0, 1050, 650);
      grad.addColorStop(0, '#001e52');
      grad.addColorStop(0.45, '#002868');
      grad.addColorStop(0.8, '#8B0000');
      grad.addColorStop(1, '#DC143C');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1050, 650);

      // Gold border
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 10;
      ctx.strokeRect(10, 10, 1030, 630);

      // Top Header text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 34px sans-serif';
      ctx.fillText('BOTE YOUTH COMMUNITY NEPAL', 120, 65);

      ctx.fillStyle = '#FCD34D';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('बोटे युवा समुदाय नेपाल | OFFICIAL MEMBERSHIP IDENTITY CARD', 120, 95);

      // Flag emblem
      ctx.font = '50px sans-serif';
      ctx.fillText('🇳🇵', 40, 80);

      // Divider line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(30, 120);
      ctx.lineTo(1020, 120);
      ctx.stroke();

      // Membership ID Box
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(720, 35, 280, 70);
      ctx.strokeStyle = '#F59E0B';
      ctx.strokeRect(720, 35, 280, 70);

      ctx.fillStyle = '#FDE68A';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('MEMBERSHIP ID NO.', 740, 60);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(memberId, 740, 90);

      // Member particulars
      ctx.fillStyle = '#FCD34D';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('FULL NAME:', 320, 180);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText(member.name, 320, 220);

      if (member.nameNepali) {
        ctx.fillStyle = '#FCA5A5';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(member.nameNepali, 320, 255);
      }

      ctx.fillStyle = '#FCD34D';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('CATEGORY / ROLE:', 320, 305);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(member.category || 'Youth Member', 320, 335);

      ctx.fillStyle = '#FCD34D';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('CONTACT PHONE:', 320, 385);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px monospace';
      ctx.fillText(member.phone, 320, 415);

      ctx.fillStyle = '#FCD34D';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('PERMANENT ADDRESS:', 320, 465);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px sans-serif';
      const addr = `Ward ${member.ward}, ${member.municipality || 'Bagmati Municipality'}, ${member.district || 'Sarlahi'}`;
      ctx.fillText(addr, 320, 495);

      // Footer
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.moveTo(30, 560);
      ctx.lineTo(1020, 560);
      ctx.stroke();

      ctx.fillStyle = '#E2E8F0';
      ctx.font = '16px sans-serif';
      ctx.fillText('Central Secretariat: Karmaiya, Sarlahi Ward 11, Bagmati Municipality, Nepal', 50, 600);

      ctx.fillStyle = '#34D399';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('STATUS: OFFICIAL VERIFIED MEMBER', 720, 600);

      // Download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `BYCN_Official_ID_Card_${memberId}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSaveSuccessMsg('✓ ID Card downloaded to your device!');
      setTimeout(() => setSaveSuccessMsg(null), 5000);
    } catch (e) {
      console.warn('Canvas export failed:', e);
    }
  };

  // Clean Print Function
  const handlePrint = () => {
    window.print();
  };

  const handleStatusChange = async (newStatus: 'active' | 'verified' | 'pending') => {
    setCurrentStatus(newStatus);
    if (member.id) {
      await updateMemberStatus(member.id, newStatus);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Close (if modal) */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="font-extrabold text-base text-slate-900 font-poppins">
            Official Community Identity Card
          </h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {saveSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* THE OFFICIAL PHYSICAL-LOOKING DIGITAL ID CARD */}
      <div
        ref={cardRef}
        id="printable-membership-card"
        className="w-full max-w-lg mx-auto rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden border-4 border-amber-400 select-none"
        style={{
          background: 'linear-gradient(135deg, #001f4d 0%, #002e7a 40%, #700000 75%, #DC143C 100%)'
        }}
      >
        {/* Subtle Watermark Decorative Seal */}
        <div className="absolute right-4 top-16 pointer-events-none opacity-10">
          <span className="text-[120px] font-black leading-none">🇳🇵</span>
        </div>

        {/* Card Header */}
        <div className="flex items-start justify-between border-b border-white/20 pb-3 mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl filter drop-shadow">🇳🇵</span>
            <div>
              <h4 className="font-poppins font-black text-sm sm:text-base text-white tracking-wide leading-tight">
                BOTE YOUTH COMMUNITY NEPAL
              </h4>
              <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                बोटे युवा समुदाय नेपाल | Member Identity Card
              </p>
            </div>
          </div>
          <div className="bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/30 text-right shrink-0">
            <span className="text-[9px] text-amber-200 block uppercase font-extrabold tracking-wider">ID No.</span>
            <span className="text-xs sm:text-sm font-mono font-black text-white">{memberId}</span>
          </div>
        </div>

        {/* Member Photo & Particulars */}
        <div className="flex gap-4 items-center">
          {/* Photo frame */}
          <div className="w-24 h-28 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-lg bg-white shrink-0 relative">
            <img
              src={photo}
              alt={member.name}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
            <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[8px] text-amber-300 font-bold text-center py-0.5">
              {currentStatus.toUpperCase()}
            </div>
          </div>

          {/* Particulars */}
          <div className="space-y-1.5 flex-1 text-xs">
            <div>
              <span className="text-[9px] text-amber-200 uppercase font-bold tracking-wider">Full Name:</span>
              <p className="font-black text-base text-white leading-tight">{member.name}</p>
              {member.nameNepali && (
                <p className="text-xs font-semibold text-rose-200">{member.nameNepali}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-0.5 text-[11px]">
              <div>
                <span className="text-[9px] text-white/70 block uppercase font-bold">Category:</span>
                <span className="font-extrabold text-amber-300 truncate block">{member.category || 'Youth Member'}</span>
              </div>
              <div>
                <span className="text-[9px] text-white/70 block uppercase font-bold">Age / Gender:</span>
                <span className="font-semibold text-white">{member.age || 20} yrs, {member.gender || 'Bote'}</span>
              </div>
            </div>

            <div className="pt-0.5 text-[11px] text-white/90">
              <span className="text-[9px] text-white/70 block uppercase font-bold">Address:</span>
              <span className="font-medium text-white/90 leading-tight block">
                Ward {member.ward || '11'}, {member.municipality || 'Bagmati Municipality'}, {member.district || 'Sarlahi'}
              </span>
            </div>

            <div className="text-[11px] font-mono text-amber-200 flex items-center gap-1 pt-0.5">
              <Phone className="w-3 h-3 text-amber-300" />
              <span>{member.phone}</span>
            </div>
          </div>
        </div>

        {/* Card Footer Bar */}
        <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-[9px] text-white/80">
          <div className="flex items-center space-x-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-semibold">Central Council • Karmaiya, Sarlahi</span>
          </div>
          <div className="flex items-center space-x-1 font-mono font-bold text-amber-300">
            <span>ISSUED 2026</span>
          </div>
        </div>
      </div>

      {/* Admin Quick Status Bar */}
      {showAdminControls && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-bold text-slate-700">Update Membership Status:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStatusChange('verified')}
              className={`px-3 py-1 rounded-xl font-bold transition flex items-center gap-1 ${
                currentStatus === 'verified'
                  ? 'bg-blue-900 text-white shadow'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Verified</span>
            </button>
            <button
              onClick={() => handleStatusChange('active')}
              className={`px-3 py-1 rounded-xl font-bold transition flex items-center gap-1 ${
                currentStatus === 'active'
                  ? 'bg-emerald-700 text-white shadow'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Active</span>
            </button>
            <button
              onClick={() => handleStatusChange('pending')}
              className={`px-3 py-1 rounded-xl font-bold transition flex items-center gap-1 ${
                currentStatus === 'pending'
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>Pending</span>
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons: Save / Download ID Card + Print Card */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handlePrint}
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 transition shadow-xs cursor-pointer"
        >
          <Printer className="w-4 h-4 text-slate-600" />
          <span>Print Physical Card</span>
        </button>

        <button
          type="button"
          onClick={handleSaveAndDownload}
          disabled={isDownloading}
          className="bg-[#DC143C] hover:bg-[#b51031] text-white text-xs font-bold px-6 py-2.5 rounded-2xl flex items-center gap-2 transition shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
        >
          <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
          <span>{isDownloading ? 'Generating Card Image...' : 'Save & Download ID Card (PNG)'}</span>
        </button>
      </div>
    </div>
  );
}
