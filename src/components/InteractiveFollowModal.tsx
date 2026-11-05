/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCommunityData } from '../context/CommunityDataContext';
import {
  Heart,
  CheckCircle,
  X,
  Mail,
  User,
  ShieldCheck,
  Bell,
  Sparkles,
  Users,
  Send,
  Loader2
} from 'lucide-react';

interface InteractiveFollowModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  initialName?: string;
}

export default function InteractiveFollowModal({
  isOpen,
  onClose,
  initialEmail = '',
  initialName = ''
}: InteractiveFollowModalProps) {
  const {
    isFollowingCommunity,
    followerCount,
    followerEmail,
    followCommunity
  } = useCommunityData();

  const [email, setEmail] = useState(initialEmail || followerEmail || '');
  const [name, setName] = useState(initialName || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{ message: string; count: number } | null>(null);

  if (!isOpen) return null;

  const handleSubmitFollow = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage('Please enter your Gmail or Email address.');
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid Gmail address (e.g. name@gmail.com).');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await followCommunity({
        name: name.trim() || 'Bote Youth Community Follower',
        email: cleanEmail,
        notes: 'One-time Gmail follower registration'
      });

      if (res.success) {
        setSuccessResult({
          message: res.message,
          count: followerCount + (res.alreadyFollowed ? 0 : 1)
        });
        setTimeout(() => {
          onClose();
        }, 2200);
      } else {
        setErrorMessage(res.message || 'Could not record follow. Please check your connection.');
      }
    } catch (err: any) {
      setErrorMessage('An error occurred while synchronizing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Ribbon */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#003893] to-[#DC143C] text-white flex items-center justify-center shadow-md shrink-0">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                🇳🇵 One-Time Follow
              </span>
              <span className="text-[10px] font-bold text-slate-500 font-mono">
                {followerCount.toLocaleString()} Followers
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 font-poppins mt-0.5">
              Follow Bote Youth Community
            </h3>
          </div>
        </div>

        {/* Success State */}
        {successResult || isFollowingCommunity ? (
          <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-900 p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 font-black text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Verified Community Follower Active!</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              {successResult?.message ||
                `You are officially following with ${followerEmail || 'your verified Gmail'}. Follower state is persisted locally and synchronized.`}
            </p>
            <div className="pt-2 border-t border-emerald-200 flex items-center justify-between text-[11px] font-bold text-emerald-800">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>One-Time Duplicate Prevention Active</span>
              </span>
              <span className="bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full">
                ✓ Following
              </span>
            </div>
          </div>
        ) : (
          /* Form for following */
          <form onSubmit={handleSubmitFollow} className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Follow Bote Youth Community Nepal to receive immediate alerts for river conservation patrols, Tarahi language dictionaries, cultural festivals, and youth scholarships.
            </p>

            {/* Error Message */}
            {errorMessage && (
              <div className="text-xs bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl font-bold flex items-center gap-2">
                <span>⚠️ {errorMessage}</span>
              </div>
            )}

            {/* Gmail / Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase flex items-center justify-between">
                <span>Gmail / Email Address *</span>
                <span className="text-[10px] text-slate-400 font-normal">One-time follow</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DC143C] focus:bg-white"
                />
              </div>
            </div>

            {/* Supporter Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase flex items-center justify-between">
                <span>Your Name (Optional)</span>
                <span className="text-[10px] text-slate-400 font-normal">Community supporter</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Bote or Solidarity Supporter"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DC143C] focus:bg-white"
                />
              </div>
            </div>

            {/* Feature Badges */}
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 text-[11px] text-slate-600 space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>One-Time Follow &amp; Join Synchronization</span>
              </div>
              <p className="text-[10.5px] text-slate-500 leading-snug">
                State is saved locally (<code className="font-mono text-[10px] bg-slate-200 px-1 py-0.5 rounded">bycn_is_following</code>) and server-synced. Once followed, join prompts are automatically handled.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 px-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 py-3 px-4 rounded-xl bg-gradient-to-r from-[#003893] to-[#DC143C] hover:opacity-95 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Synchronizing...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 text-white fill-white" />
                    <span>Follow with Gmail</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
