/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LeaderProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import {
  Phone,
  Mail,
  MapPin,
  Shield,
  ArrowRight,
  ChevronDown,
  CheckCircle,
  ExternalLink,
  Copy,
  Check,
  Award,
  Calendar
} from 'lucide-react';

interface LeaderProfileCardProps {
  key?: React.Key;
  leader: LeaderProfile;
  onSelectLeader: (leader: LeaderProfile) => void;
  priority?: boolean;
}

export default function LeaderProfileCard({
  leader,
  onSelectLeader,
  priority = false
}: LeaderProfileCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const { isNepali } = useLanguage();
  const isYouth = leader.category === 'youth';

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(leader.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <div
      id={`leader-card-${leader.id}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      onClick={() => onSelectLeader(leader)}
      className={`relative bg-white rounded-3xl border-2 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-xl ${
        isYouth
          ? 'border-slate-200 hover:border-red-600'
          : 'border-slate-200 hover:border-blue-900'
      }`}
    >
      {/* 🇳🇵 Authentic Nepali Flag Ribbon Top Edge */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-900 via-white to-red-600" />

      {/* Main Card Content */}
      <div className="p-6 space-y-5">
        {/* Top Header: Image, Badges & Term */}
        <div className="flex items-start justify-between gap-4">
          <div className="relative">
            {/* Avatar Frame with Red/Blue Ring */}
            <div
              className={`w-20 h-20 rounded-2xl overflow-hidden p-0.5 border-2 transition-transform duration-300 group-hover:scale-105 shadow-md ${
                isYouth ? 'border-red-600 bg-red-50' : 'border-blue-800 bg-blue-50'
              }`}
            >
              <img
                src={leader.image && leader.image.trim() ? leader.image.trim() : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'}
                alt={leader.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            {/* Verified Category Dot / Icon */}
            <span
              className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] shadow-md border-2 border-white ${
                isYouth ? 'bg-red-600' : 'bg-blue-900'
              }`}
              title={isYouth ? 'Youth Council' : 'Community Elder Council'}
            >
              <Shield className="w-3 h-3" />
            </span>
          </div>

          <div className="flex flex-col items-end text-right">
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs ${
                isYouth
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-blue-50 text-blue-900 border border-blue-200'
              }`}
            >
              {leader.badge}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono font-bold mt-1.5">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{leader.term}</span>
            </div>
          </div>
        </div>

        {/* Name and Title */}
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-poppins font-black text-xl text-slate-900 leading-tight group-hover:text-red-600 transition-colors">
              {isNepali && leader.nameNepali ? leader.nameNepali : leader.name}
            </h3>
          </div>
          {(leader.nameNepali || isNepali) && (
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              {isNepali ? leader.name : leader.nameNepali}
            </p>
          )}
          <div className="mt-2 inline-flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isYouth ? 'bg-red-600 animate-pulse' : 'bg-blue-800'
              }`}
            />
            <p
              className={`text-xs font-black uppercase tracking-wider ${
                isYouth ? 'text-red-600' : 'text-blue-900'
              }`}
            >
              {leader.role}
            </p>
          </div>
        </div>

        {/* Short Bio (Static or Initial Preview) */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
          {isNepali && leader.bioNepali ? leader.bioNepali : leader.bio}
        </p>

        {/* Dynamic Detail Reveal (Accordion / Drawer on hover or click) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden space-y-3 pt-2 border-t border-slate-150"
            >
              {/* Full Bio if Nepali available */}
              {leader.bioNepali && (
                <div className="bg-red-50/60 p-2.5 rounded-xl border border-red-100 text-[11px] text-red-950 leading-relaxed">
                  <span className="font-bold block text-[10px] uppercase tracking-wider text-red-700">
                    नेपाली परिचय:
                  </span>
                  {leader.bioNepali}
                </div>
              )}

              {/* Responsibilities Preview */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Key Portfolios &amp; Initiatives:
                </span>
                <div className="space-y-1">
                  {leader.responsibilities.slice(0, 2).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-1.5 text-[11px] text-slate-700"
                    >
                      <CheckCircle
                        className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                          isYouth ? 'text-red-600' : 'text-blue-800'
                        }`}
                      />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Contact Coordinates */}
              <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Direct Contact Information:
                </span>

                {/* Phone */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <a
                    href={`tel:${leader.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 font-mono font-bold text-slate-800 hover:text-red-600 transition-colors truncate"
                  >
                    <Phone className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>{leader.phone}</span>
                  </a>
                  <button
                    onClick={handleCopyPhone}
                    className="p-1 hover:bg-slate-200 rounded-md text-slate-500 hover:text-slate-900 transition"
                    title="Copy Phone Number"
                  >
                    {copiedPhone ? (
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Email */}
                <div className="text-xs">
                  <a
                    href={`mailto:${leader.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 text-slate-700 hover:text-blue-800 transition-colors truncate"
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-800 shrink-0" />
                    <span className="truncate">{leader.email}</span>
                  </a>
                </div>

                {/* Ward */}
                <div className="flex items-start gap-2 text-[11px] text-slate-600 pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span className="leading-tight">{leader.ward}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card Action Footer */}
      <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-150 flex items-center justify-between text-xs font-bold transition-colors">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className={`flex items-center gap-1.5 transition-colors ${
            isYouth
              ? 'text-red-600 hover:text-red-700'
              : 'text-blue-900 hover:text-blue-800'
          }`}
        >
          <span>{isExpanded ? 'Less Info' : 'Quick Bio & Contact'}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        <span
          className={`flex items-center gap-1 group-hover:translate-x-1 transition-transform ${
            isYouth ? 'text-red-600' : 'text-blue-900'
          }`}
        >
          <span>Full Dossier</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}
