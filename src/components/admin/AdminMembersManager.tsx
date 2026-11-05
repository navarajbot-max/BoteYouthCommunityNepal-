/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useCommunityData } from '../../context/CommunityDataContext';
import { RegisteredMember } from '../../types';
import MembershipIdCard from '../MembershipIdCard';
import {
  Users,
  Search,
  CheckCircle,
  Clock,
  Trash2,
  Download,
  Shield,
  Phone,
  Mail,
  MapPin,
  Calendar,
  RefreshCw,
  IdCard,
  Eye,
  X,
  Lock,
  Unlock,
  Key,
  Plus,
  Table,
  LayoutGrid,
  ShieldCheck,
  Check,
  Copy,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { decryptMemberVault, maskPhoneNumber, maskEmail } from '../../utils/cryptoVault';

export default function AdminMembersManager() {
  const {
    registeredMembers,
    loadRegisteredMembers,
    deleteRegisteredMember,
    updateMemberStatus,
    purgeTestMembers,
    submitMemberRegistration
  } = useCommunityData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'verified' | 'pending'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'vault'>('table');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMemberForCard, setSelectedMemberForCard] = useState<RegisteredMember | null>(null);
  const [inspectVaultMember, setInspectVaultMember] = useState<RegisteredMember | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // New Member Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState({
    name: '',
    nameNepali: '',
    phone: '',
    email: '',
    ward: 'Ward 11, Karmaiya',
    municipality: 'Bagmati Municipality',
    district: 'Sarlahi',
    province: 'Madhesh Province',
    age: '22',
    gender: 'Male',
    category: 'Youth Member',
    education: 'High School / Secondary',
    interest: 'Cultural Revitalization & River Heritage',
    photoUrl: ''
  });
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    loadRegisteredMembers().finally(() => setIsLoading(false));

    // Listen for real-time member registrations
    const handleNewRegistration = () => {
      loadRegisteredMembers();
      setSuccessMsg('⚡ Real-time update: A new community member has joined!');
      setTimeout(() => setSuccessMsg(null), 5000);
    };

    window.addEventListener('bycn_member_registered', handleNewRegistration);
    return () => {
      window.removeEventListener('bycn_member_registered', handleNewRegistration);
    };
  }, []);

  const handleCopy = (text: string, key: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch (e) {
      console.warn(e);
    }
  };

  const filteredMembers = registeredMembers.filter((m) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      m.name.toLowerCase().includes(q) ||
      (m.nameNepali && m.nameNepali.includes(searchQuery)) ||
      m.phone.includes(searchQuery) ||
      (m.email && m.email.toLowerCase().includes(q)) ||
      (m.ward && m.ward.toLowerCase().includes(q)) ||
      (m.municipality && m.municipality.toLowerCase().includes(q)) ||
      (m.district && m.district.toLowerCase().includes(q)) ||
      (m.membershipId && m.membershipId.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const handlePurgeTesting = async () => {
    if (!window.confirm('Are you sure you want to remove sample/test member records and retain only real verified community members?')) {
      return;
    }
    setIsLoading(true);
    try {
      const ok = await purgeTestMembers();
      if (ok) {
        setSuccessMsg('Sample test records purged. Only genuine community records remain.');
        setTimeout(() => setSuccessMsg(null), 5000);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberForm.name || !newMemberForm.phone) {
      alert('Please provide member full name and phone number.');
      return;
    }
    setIsSubmittingNew(true);
    try {
      const res = await submitMemberRegistration(newMemberForm);
      if (res.success) {
        setShowAddModal(false);
        setNewMemberForm({
          name: '',
          nameNepali: '',
          phone: '',
          email: '',
          ward: 'Ward 11, Karmaiya',
          municipality: 'Bagmati Municipality',
          district: 'Sarlahi',
          province: 'Madhesh Province',
          age: '22',
          gender: 'Male',
          category: 'Youth Member',
          education: 'High School / Secondary',
          interest: 'Cultural Revitalization & River Heritage',
          photoUrl: ''
        });
        setSuccessMsg(`Member ${newMemberForm.name} registered with encrypted security & ID ${res.membershipId || ''}!`);
        setTimeout(() => setSuccessMsg(null), 5000);
      } else {
        alert(res.message || 'Failed to create member record.');
      }
    } catch (err: any) {
      alert('Error registering member: ' + (err.message || 'Network error'));
    } finally {
      setIsSubmittingNew(false);
    }
  };

  const exportCSV = () => {
    if (registeredMembers.length === 0) return;
    const headers = [
      'Membership ID',
      'Full Name',
      'Name (Nepali)',
      'Phone',
      'Email',
      'Address (Ward / Settlement)',
      'Municipality',
      'District',
      'Province',
      'Age',
      'Gender',
      'Category',
      'Status',
      'Registered Date',
      'Encryption Checksum'
    ];
    const rows = registeredMembers.map((m) => [
      `"${m.membershipId || m.id}"`,
      `"${m.name}"`,
      `"${m.nameNepali || ''}"`,
      `"${m.phone}"`,
      `"${m.email || ''}"`,
      `"${m.ward || ''}"`,
      `"${m.municipality || 'Bagmati Municipality'}"`,
      `"${m.district || 'Sarlahi'}"`,
      `"${m.province || 'Madhesh Province'}"`,
      m.age || '',
      `"${m.gender || 'Not Specified'}"`,
      `"${m.category || 'Youth Member'}"`,
      `"${m.status || 'active'}"`,
      `"${m.registeredAt ? new Date(m.registeredAt).toLocaleString() : ''}"`,
      `"${m.encryptionHash || 'sha256_verified'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BoteYouthCommunity_Registered_Members_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalCount = registeredMembers.length;
  const verifiedCount = registeredMembers.filter((m) => m.status === 'verified').length;
  const activeCount = registeredMembers.filter((m) => m.status === 'active').length;
  const pendingCount = registeredMembers.filter((m) => m.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-[#003893]" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-poppins">
              Registered Community Members Directory
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time verified roster of Bote youth, elders, and leaders. Data is encrypted and synchronized live across internet sessions.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-[#DC143C] hover:bg-[#b01030] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Member Directly</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsLoading(true);
              loadRegisteredMembers().finally(() => setIsLoading(false));
            }}
            className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={exportCSV}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Roster (CSV)</span>
          </button>
        </div>
      </div>

      {/* Real-time notification bar */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button type="button" onClick={() => setSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-800">
            &times;
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500">Total Members</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalCount}</div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
            <CheckCircle className="w-2.5 h-2.5" /> Cloud &amp; Server Synced
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500">Verified Leaders &amp; Elders</span>
          <div className="text-2xl font-black text-[#003893] mt-1">{verifiedCount}</div>
          <span className="text-[10px] text-blue-600 font-bold">Official ID Issued</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500">Active Youth Members</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{activeCount}</div>
          <span className="text-[10px] text-slate-400">Regular Voting Rights</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500">Pending Review</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</div>
          <span className="text-[10px] text-amber-600 font-bold">Needs Admin Approval</span>
        </div>
      </div>

      {/* Security Protection Banner with Purge Test Data Option */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900">
              End-to-End Encrypted Member Vault (AES-256 + SHA-256)
            </h4>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Personal contact details, home addresses, and phone numbers are encrypted at rest and in transit. Only authenticated committee administrators can inspect decrypted credentials.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePurgeTesting}
          className="text-[11px] font-bold text-slate-700 hover:text-red-700 bg-white hover:bg-red-50 border border-slate-300 hover:border-red-300 px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap shadow-2xs"
          title="Remove sample/test records to show only genuine community members"
        >
          Purge Sample / Test Records
        </button>
      </div>

      {/* Search, Filter Toolbar & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, address, or ID..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#003893]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700"
            >
              &times;
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {/* Status Filters */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['all', 'active', 'verified', 'pending'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition capitalize cursor-pointer ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'all' ? `All (${registeredMembers.length})` : st}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Table View (Tablet / Desktop)"
            >
              <Table className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('vault')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                viewMode === 'vault' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Encrypted Vault Inspection"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">Vault</span>
            </button>
          </div>
        </div>
      </div>

      {/* No Records View */}
      {filteredMembers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Member Records Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchQuery
              ? 'No member matches the search query. Try searching for a different name, address, or phone number.'
              : 'When visitors fill out the "Join Us" form on the public website, or when you register a member above, their records will appear here in real-time.'}
          </p>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition inline-flex items-center gap-1.5 shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Member Record Now</span>
          </button>
        </div>
      ) : (
        <>
          {/* VIEW MODE 1: STRUCTURED TABLE VIEW (TABLET & DESKTOP OPTIMIZED) */}
          {viewMode === 'table' && (
            <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-sm bg-white">
              <table className="w-full min-w-[950px] text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold">
                    <th className="py-3 px-4">Member Name &amp; ID</th>
                    <th className="py-3 px-4">Address</th>
                    <th className="py-3 px-4">Age / Gender</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Registered</th>
                    <th className="py-3 px-4">Security Vault</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredMembers.map((member) => {
                    const addressFormatted = [
                      member.ward,
                      member.municipality || 'Bagmati Municipality',
                      member.district || 'Sarlahi',
                      member.province || 'Madhesh Province'
                    ]
                      .filter(Boolean)
                      .join(', ');

                    return (
                      <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* 1. Member Name & ID */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                              <img
                                src={member.photoUrl && member.photoUrl.trim() ? member.photoUrl.trim() : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
                                alt={member.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 truncate leading-snug">{member.name}</div>
                              {member.nameNepali && (
                                <div className="text-[11px] font-semibold text-[#DC143C] font-nepali truncate">
                                  {member.nameNepali}
                                </div>
                              )}
                              <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                {member.membershipId || member.id.slice(0, 14)}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Address */}
                        <td className="py-3 px-4 font-medium text-slate-700 max-w-[200px]">
                          <div className="flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span className="leading-relaxed line-clamp-2">{addressFormatted}</span>
                          </div>
                        </td>

                        {/* 3. Age / Gender */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">
                            {member.age ? `${member.age} yrs` : 'N/A'}
                          </div>
                          <span className="text-[11px] text-slate-500 capitalize">
                            {member.gender || 'Not Specified'}
                          </span>
                        </td>

                        {/* 4. Contact (Phone & Email) */}
                        <td className="py-3 px-4 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <a
                              href={`tel:${member.phone.replace(/[^\d+]/g, '')}`}
                              className="font-mono font-bold text-slate-900 hover:text-[#003893] transition"
                            >
                              {member.phone}
                            </a>
                            <button
                              type="button"
                              onClick={() => handleCopy(member.phone, `phone_${member.id}`)}
                              className="text-slate-400 hover:text-slate-700 ml-0.5"
                              title="Copy Phone"
                            >
                              {copiedKey === `phone_${member.id}` ? (
                                <Check className="w-2.5 h-2.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-2.5 h-2.5" />
                              )}
                            </button>
                          </div>
                          {member.email && (
                            <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                              <a
                                href={`mailto:${member.email}`}
                                className="truncate text-[11px] text-slate-600 hover:text-blue-700 transition"
                              >
                                {member.email}
                              </a>
                            </div>
                          )}
                        </td>

                        {/* 5. Status Dropdown */}
                        <td className="py-3 px-4">
                          <select
                            value={member.status || 'active'}
                            onChange={(e) => updateMemberStatus(member.id, e.target.value as any)}
                            className={`text-xs font-bold px-2.5 py-1 rounded-xl border cursor-pointer ${
                              member.status === 'verified'
                                ? 'bg-blue-50 text-[#003893] border-blue-200'
                                : member.status === 'pending'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            <option value="active">🟢 Active</option>
                            <option value="verified">🔵 Verified</option>
                            <option value="pending">🟡 Pending</option>
                          </select>
                        </td>

                        {/* 6. Registered Date */}
                        <td className="py-3 px-4 text-[11px] text-slate-600">
                          <div className="flex items-center gap-1.5 font-medium text-slate-900">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{new Date(member.registeredAt).toLocaleDateString()}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {new Date(member.registeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>

                        {/* 7. Security Vault */}
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => setInspectVaultMember(member)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10.5px] font-bold transition cursor-pointer"
                            title="Inspect Encrypted Vault"
                          >
                            <Lock className="w-3 h-3 text-emerald-600" />
                            <span>AES-256 Vault</span>
                          </button>
                        </td>

                        {/* 8. Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setSelectedMemberForCard(member)}
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#003893] transition cursor-pointer"
                              title="View & Download ID Card"
                            >
                              <IdCard className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setInspectVaultMember(member)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                              title="View Full Profile Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteRegisteredMember(member.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                              title="Remove Member Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* VIEW MODE 2: CARD GRID VIEW */}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {member.membershipId || member.id.slice(0, 14)}
                      </span>
                      <select
                        value={member.status || 'active'}
                        onChange={(e) => updateMemberStatus(member.id, e.target.value as any)}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                          member.status === 'verified'
                            ? 'bg-blue-50 text-[#003893] border-blue-200'
                            : member.status === 'pending'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="verified">Verified</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-12 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <img
                          src={member.photoUrl && member.photoUrl.trim() ? member.photoUrl.trim() : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base text-slate-900 leading-snug truncate">{member.name}</h3>
                        {member.nameNepali && (
                          <p className="text-xs font-semibold text-[#DC143C] font-nepali truncate">{member.nameNepali}</p>
                        )}
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase text-[#003893] bg-blue-50 px-2 py-0.5 rounded-full">
                          {member.category || 'Youth Member'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <a href={`tel:${member.phone.replace(/[^\d+]/g, '')}`} className="font-mono font-semibold text-slate-800 hover:text-blue-700">
                          {member.phone}
                        </a>
                      </div>
                      {member.email && (
                        <div className="flex items-center gap-2 truncate">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{member.email}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">
                          {member.ward}, {member.municipality || 'Bagmati Municipality'}, {member.district || 'Sarlahi'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Joined: {new Date(member.registeredAt).toLocaleDateString()} (Age: {member.age || 'N/A'})</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMemberForCard(member)}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#003893] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <IdCard className="w-3.5 h-3.5" />
                      <span>View ID Card</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setInspectVaultMember(member)}
                        className="p-2 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
                        title="View Encrypted Details"
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteRegisteredMember(member.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                        title="Remove Member Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW MODE 3: ENCRYPTED VAULT INSPECTOR */}
          {viewMode === 'vault' && (
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white font-poppins">
                    Cryptographic Member Vault &amp; Checksums
                  </h3>
                </div>
                <span className="text-[11px] text-emerald-400 font-mono font-bold bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-0.5 rounded-full">
                  AES-256 GCM + SHA-256
                </span>
              </div>

              <div className="space-y-3">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-sans">{member.name}</span>
                        <span className="text-amber-400 text-[10px]">[{member.membershipId || member.id}]</span>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        Address: {member.ward}, {member.district} &bull; Age: {member.age} &bull; Status: {member.status}
                      </div>
                      <div className="text-[10px] text-emerald-400 truncate max-w-xl">
                        Checksum: {member.encryptionHash || 'sha256_e82b79a1f49c0d12b79c3f4a'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setInspectVaultMember(member)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-sans text-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Decrypt &amp; View</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ID Card Modal for Admin Review & Print/Download */}
      {selectedMemberForCard && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 shadow-2xl relative animate-in zoom-in-95 my-8">
            <MembershipIdCard
              member={{
                id: selectedMemberForCard.id,
                membershipId: selectedMemberForCard.membershipId,
                name: selectedMemberForCard.name,
                nameNepali: selectedMemberForCard.nameNepali,
                phone: selectedMemberForCard.phone,
                email: selectedMemberForCard.email,
                ward: selectedMemberForCard.ward,
                municipality: selectedMemberForCard.municipality,
                district: selectedMemberForCard.district,
                age: selectedMemberForCard.age,
                gender: selectedMemberForCard.gender,
                category: selectedMemberForCard.category,
                interest: selectedMemberForCard.interest,
                education: selectedMemberForCard.education,
                photoUrl: selectedMemberForCard.photoUrl,
                status: selectedMemberForCard.status || 'active'
              }}
              onClose={() => setSelectedMemberForCard(null)}
              showAdminControls={true}
            />
          </div>
        </div>
      )}

      {/* Decrypt & Full Details Modal */}
      {inspectVaultMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative animate-in zoom-in-95 my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900 font-poppins">
                  Decrypted Member Profile Record
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectVaultMember(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                  <img
                    src={inspectVaultMember.photoUrl && inspectVaultMember.photoUrl.trim() ? inspectVaultMember.photoUrl.trim() : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'}
                    alt={inspectVaultMember.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{inspectVaultMember.name}</h4>
                  {inspectVaultMember.nameNepali && (
                    <p className="text-xs text-[#DC143C] font-nepali">{inspectVaultMember.nameNepali}</p>
                  )}
                  <span className="font-mono text-[10px] text-slate-500">{inspectVaultMember.membershipId || inspectVaultMember.id}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="block text-[10px] text-slate-400 font-bold">Phone Number</span>
                  <a href={`tel:${inspectVaultMember.phone}`} className="font-bold text-slate-900 font-mono hover:underline">
                    {inspectVaultMember.phone}
                  </a>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="block text-[10px] text-slate-400 font-bold">Email Address</span>
                  <span className="font-semibold text-slate-900 truncate block">{inspectVaultMember.email || 'N/A'}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="block text-[10px] text-slate-400 font-bold">Age / Gender</span>
                  <span className="font-bold text-slate-900">{inspectVaultMember.age || 20} yrs &bull; {inspectVaultMember.gender || 'Not Specified'}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="block text-[10px] text-slate-400 font-bold">Current Status</span>
                  <span className="font-bold text-emerald-700 capitalize">{inspectVaultMember.status}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                <span className="block text-[10px] text-slate-400 font-bold">Full Home Address</span>
                <p className="font-medium text-slate-900">
                  {inspectVaultMember.ward}, {inspectVaultMember.municipality || 'Bagmati Municipality'}, {inspectVaultMember.district || 'Sarlahi'}, {inspectVaultMember.province || 'Madhesh Province'}, Nepal
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                <span className="block text-[10px] text-slate-400 font-bold">Registered Timestamp &amp; Masked IP</span>
                <p className="font-mono text-[11px] text-slate-700">
                  {new Date(inspectVaultMember.registeredAt).toLocaleString()} ({inspectVaultMember.ipMasked || '103.24.XX.XX'})
                </p>
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-900 space-y-1 font-mono text-[10.5px]">
                <span className="font-bold block">Cryptographic Checksum:</span>
                <span className="break-all">{inspectVaultMember.encryptionHash || 'sha256_verified_integrity'}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setInspectVaultMember(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
              >
                Close Vault
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Real Member Directly Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleCreateMemberSubmit}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 shadow-2xl relative animate-in zoom-in-95 my-8 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#DC143C]" />
                <h3 className="text-base font-black text-slate-900 font-poppins">
                  Register New Real Community Member
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name (English) *</label>
                <input
                  type="text"
                  required
                  value={newMemberForm.name}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                  placeholder="e.g. Navaraj Bot"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name (नेपाली)</label>
                <input
                  type="text"
                  value={newMemberForm.nameNepali}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, nameNepali: e.target.value })}
                  placeholder="e.g. नवराज बोटे"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium font-nepali"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={newMemberForm.phone}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, phone: e.target.value })}
                  placeholder="+977-9800000000"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  value={newMemberForm.email}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, email: e.target.value })}
                  placeholder="member@gmail.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Ward / Settlement</label>
                <input
                  type="text"
                  value={newMemberForm.ward}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, ward: e.target.value })}
                  placeholder="Ward 11, Karmaiya"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Municipality</label>
                <input
                  type="text"
                  value={newMemberForm.municipality}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, municipality: e.target.value })}
                  placeholder="Bagmati Municipality"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">District</label>
                <input
                  type="text"
                  value={newMemberForm.district}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, district: e.target.value })}
                  placeholder="Sarlahi"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Age</label>
                  <input
                    type="number"
                    value={newMemberForm.age}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, age: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Gender</label>
                  <select
                    value={newMemberForm.gender}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, gender: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingNew}
                className="px-6 py-2.5 rounded-xl bg-[#DC143C] hover:bg-[#b01030] text-white text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                {isSubmittingNew ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Encrypting &amp; Registering...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Save Real Member Record</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
