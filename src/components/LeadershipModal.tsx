/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LeaderProfile } from '../types';
import {
  X,
  Shield,
  Award,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  Send,
  User
} from 'lucide-react';

interface LeadershipModalProps {
  leader: LeaderProfile | null;
  onClose: () => void;
}

export default function LeadershipModal({ leader, onClose }: LeadershipModalProps) {
  const [messageText, setMessageText] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!leader) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setMessageText('');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border-2 border-slate-200 my-auto animate-in zoom-in-95 duration-200">
        {/* Top Header Banner with Nepali Flag Colors */}
        <div className="bg-gradient-to-r from-[#003893] via-[#8B0000] to-[#DC143C] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {leader.badge}
            </span>
            <span className="text-xs text-white/90">
              {leader.term}
            </span>
          </div>
          <h2 className="text-2xl font-black font-poppins">{leader.name}</h2>
          {leader.nameNepali && (
            <p className="text-sm font-semibold text-amber-200 mt-0.5">{leader.nameNepali}</p>
          )}
          <p className="text-xs text-white/90 font-bold uppercase tracking-wider mt-1">
            {leader.role}
          </p>
        </div>

        {/* Profile Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Top Info Grid */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-slate-100 pb-6">
            <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-[#DC143C] shadow-lg shrink-0 bg-slate-100">
              <img
                src={leader.image && leader.image.trim() ? leader.image.trim() : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'}
                alt={leader.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-3 flex-1 text-center sm:text-left">
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "{leader.bio}"
              </p>

              {/* Coordinates List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-2">
                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <Phone className="w-3.5 h-3.5 text-[#DC143C] shrink-0" />
                  <span className="font-bold truncate">{leader.phone}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <Mail className="w-3.5 h-3.5 text-[#003893] shrink-0" />
                  <span className="font-medium truncate">{leader.email}</span>
                </div>
                <div className="sm:col-span-2 flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="text-[11px] truncate">{leader.ward}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Portfolios & Responsibilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#DC143C]" />
              <span>Assigned Executive Responsibilities</span>
            </h4>
            <div className="space-y-2">
              {leader.responsibilities.map((resp, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-150"
                >
                  <CheckCircle className="w-4 h-4 text-[#003893] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{resp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Direct Message Form */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-2">
              <Send className="w-4 h-4 text-[#003893]" />
              <span>Contact {leader.role} Directly</span>
            </h4>
            {sentSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-700 text-xs p-3.5 rounded-xl font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                <span>Message dispatched to {leader.name} and logged in community records!</span>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-2">
                <textarea
                  rows={2}
                  required
                  placeholder={`Write a message, inquiry, or suggestion directly to ${leader.name}...`}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003893] text-slate-800"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#003893] hover:bg-[#002766] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2 rounded-xl transition-all"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
