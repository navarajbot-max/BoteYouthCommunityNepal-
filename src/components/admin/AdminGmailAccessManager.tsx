/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCommunityData } from '../../context/CommunityDataContext';
import { Mail, Plus, Trash2, ShieldCheck, Key, CheckCircle, AlertCircle, Info, Lock } from 'lucide-react';

export default function AdminGmailAccessManager() {
  const { siteIdentity, addAuthorizedEmail, removeAuthorizedEmail } = useCommunityData();
  const [newGmailInput, setNewGmailInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const authorizedEmails = siteIdentity.authorizedEmails || ['navarajbot@gmail.com', 'boteyouthcommunitynepal@gmail.com'];

  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setErrorMsg(null);

    const clean = newGmailInput.trim().toLowerCase();
    if (!clean || !clean.includes('@') || !clean.includes('.')) {
      setErrorMsg('Please enter a valid Gmail address (e.g. user@gmail.com).');
      return;
    }

    if (authorizedEmails.map((e) => e.toLowerCase()).includes(clean)) {
      setErrorMsg('This Gmail address already has full administrative access.');
      return;
    }

    const success = await addAuthorizedEmail(clean);
    if (success) {
      setStatusMessage(`Full administrative access successfully granted to ${clean}!`);
      setNewGmailInput('');
    } else {
      setErrorMsg('Failed to grant access. Please try again.');
    }
  };

  const handleRemoveEmail = async (email: string) => {
    if (email.toLowerCase() === 'navarajbot@gmail.com') {
      setErrorMsg('The primary owner Gmail (navarajbot@gmail.com) cannot be removed.');
      return;
    }
    await removeAuthorizedEmail(email);
    setStatusMessage(`Administrative access revoked from ${email}.`);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-bold text-slate-900 font-poppins">
              Authorized Google Accounts &amp; Gmail Access
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Grant full administrative control to your own secondary Gmail or trusted community committee members.
          </p>
        </div>

        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Role-Based Access Control (RBAC)</span>
        </span>
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-emerald-500 hover:text-emerald-800">&times;</button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* How it works guidance box */}
      <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 text-xs text-blue-950 space-y-2">
        <div className="font-bold flex items-center gap-1.5 text-blue-900">
          <Info className="w-4 h-4 text-blue-700" />
          <span>How to use your own Gmail for full website access:</span>
        </div>
        <ol className="list-decimal pl-5 space-y-1 text-blue-900/90 text-[11px] leading-relaxed">
          <li>Enter your Gmail address below (e.g. <code>yourname@gmail.com</code>) and click <strong>Grant Full Admin Access</strong>.</li>
          <li>That email address will be stored on the server's secured whitelist and broadcast across the internet in real-time.</li>
          <li>On the Admin Panel login screen or via your Google session, entering your authorized Gmail address unlocks full editing access to images, logos, leaders, timeline, language, costumes, and member rosters.</li>
        </ol>
      </div>

      {/* Add new Gmail form */}
      <form onSubmit={handleAddEmail} className="space-y-3">
        <label className="block text-xs font-bold text-slate-700">
          Add Another Gmail Address for Full Access
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="email"
              value={newGmailInput}
              onChange={(e) => setNewGmailInput(e.target.value)}
              placeholder="e.g. secondary.account@gmail.com"
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:border-red-600"
            />
          </div>
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Grant Full Access</span>
          </button>
        </div>
      </form>

      {/* Current Authorized List */}
      <div className="space-y-2 pt-2">
        <div className="text-xs font-bold text-slate-700">
          Currently Authorized Google &amp; Gmail Accounts ({authorizedEmails.length}):
        </div>
        <div className="space-y-2">
          {authorizedEmails.map((email) => {
            const isPrimary = email.toLowerCase() === 'navarajbot@gmail.com';
            return (
              <div
                key={email}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                    G
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span>{email}</span>
                      {isPrimary && (
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                          Primary Owner
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Full Read/Write/Delete/Broadcast Permissions across all community data
                    </div>
                  </div>
                </div>

                {!isPrimary && (
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(email)}
                    className="p-2 text-slate-400 hover:text-red-600 transition"
                    title="Revoke admin access"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
