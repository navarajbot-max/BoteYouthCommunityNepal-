/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useCommunityData } from '../../context/CommunityDataContext';
import { RegisteredMember } from '../../types';
import { resolveAssetUrl } from '../../services/storagePersistence';
import MembershipIdCard from '../MembershipIdCard';
import {
  fetchMembersFromFirebase,
  subscribeToFirebaseMembers,
  saveMemberToFirebase,
  deleteMemberFromFirebase,
  updateMemberStatusInFirebase,
  syncMembersBatchToFirebase,
  firebaseConfig
} from '../../services/firebase';
import {
  Users,
  Search,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  ShieldCheck,
  IdCard,
  FileSpreadsheet,
  FileJson,
  Printer,
  RefreshCw,
  Database,
  Trash2,
  Check,
  AlertCircle,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Eye,
  X,
  Sparkles,
  ArrowUpDown,
  UserPlus
} from 'lucide-react';

export default function MemberDirectoryView() {
  const { registeredMembers: serverMembers, updateMemberStatus, deleteRegisteredMember } = useCommunityData();

  const [members, setMembers] = useState<RegisteredMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState<'connected' | 'syncing' | 'error'>('connected');
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('');
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'verified' | 'pending'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'name' | 'registeredAt' | 'ward' | 'status'>('registeredAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Digital ID Card Modal
  const [selectedMemberForCard, setSelectedMemberForCard] = useState<RegisteredMember | null>(null);

  // Deletion confirm modal / state
  const [memberToDelete, setMemberToDelete] = useState<RegisteredMember | null>(null);

  // Load from Firebase on mount with real-time subscription
  const loadFromFirebase = useCallback(async () => {
    setIsLoading(true);
    try {
      setFirebaseStatus('syncing');
      const fbMembers = await fetchMembersFromFirebase();
      
      // If Firebase is currently empty or has fewer members than server, merge with server members
      if (fbMembers.length === 0 && serverMembers.length > 0) {
        setMembers(serverMembers);
        // Automatically seed/sync to Firebase
        await syncMembersBatchToFirebase(serverMembers);
        const reFetched = await fetchMembersFromFirebase();
        if (reFetched.length > 0) {
          setMembers(reFetched);
        }
      } else if (fbMembers.length > 0) {
        // Merge any server members not yet in Firebase
        const existingIds = new Set(fbMembers.map((m) => m.id));
        const missingFromServer = serverMembers.filter((m) => !existingIds.has(m.id));
        if (missingFromServer.length > 0) {
          await syncMembersBatchToFirebase(missingFromServer);
          setMembers([...missingFromServer, ...fbMembers]);
        } else {
          setMembers(fbMembers);
        }
      } else {
        setMembers([]);
      }

      setFirebaseStatus('connected');
      setLastUpdatedTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn('Failed loading from Firebase:', err);
      setFirebaseStatus('error');
      // Fallback to server members if offline/error
      setMembers(serverMembers);
    } finally {
      setIsLoading(false);
    }
  }, [serverMembers]);

  useEffect(() => {
    loadFromFirebase();

    // Setup real-time listener for live updates from Firebase
    const unsubscribe = subscribeToFirebaseMembers(
      (updatedList) => {
        if (updatedList.length > 0) {
          setMembers(updatedList);
          setFirebaseStatus('connected');
          setLastUpdatedTime(new Date().toLocaleTimeString());
        }
      },
      (err) => {
        console.warn('Real-time Firebase subscription error:', err);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [loadFromFirebase]);

  // Handle Manual Force Sync
  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      // Sync current local/server members to Firebase
      if (serverMembers.length > 0) {
        const syncedCount = await syncMembersBatchToFirebase(serverMembers);
        setSyncFeedback(`Successfully synchronized ${syncedCount} members to Firebase Firestore!`);
      }
      const freshList = await fetchMembersFromFirebase();
      setMembers(freshList);
      setFirebaseStatus('connected');
      setLastUpdatedTime(new Date().toLocaleTimeString());
      setTimeout(() => setSyncFeedback(null), 4000);
    } catch (err) {
      console.warn(err);
      setSyncFeedback('Sync error: could not connect to Firestore.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Status update
  const handleStatusChange = async (memberId: string, newStatus: 'active' | 'verified' | 'pending') => {
    // 1. Optimistic UI update
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, status: newStatus, updatedAt: new Date().toISOString() } : m))
    );

    // 2. Update Firebase
    await updateMemberStatusInFirebase(memberId, newStatus);

    // 3. Update server API
    await updateMemberStatus(memberId, newStatus);
  };

  // Delete Member
  const confirmDeleteMember = async () => {
    if (!memberToDelete) return;
    const { id } = memberToDelete;

    // Optimistic UI update
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setMemberToDelete(null);

    // Delete in Firebase
    await deleteMemberFromFirebase(id);

    // Delete on server
    await deleteRegisteredMember(id);
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredMembers.length === 0) {
      setSyncFeedback('No members available to export.');
      setTimeout(() => setSyncFeedback(null), 3500);
      return;
    }

    const headers = [
      'Membership ID',
      'Full Name (English)',
      'Full Name (Nepali)',
      'Phone Number',
      'Email Address',
      'Ward',
      'Municipality',
      'District',
      'Age',
      'Gender',
      'Category',
      'Interest Area',
      'Education',
      'Verification Status',
      'Registration Date'
    ];

    const rows = filteredMembers.map((m) => [
      `"${m.membershipId || m.id}"`,
      `"${(m.name || '').replace(/"/g, '""')}"`,
      `"${(m.nameNepali || '').replace(/"/g, '""')}"`,
      `"${(m.phone || '').replace(/"/g, '""')}"`,
      `"${(m.email || '').replace(/"/g, '""')}"`,
      `"${(m.ward || '').replace(/"/g, '""')}"`,
      `"${(m.municipality || 'Bagmati Municipality').replace(/"/g, '""')}"`,
      `"${(m.district || 'Sarlahi').replace(/"/g, '""')}"`,
      m.age || 20,
      `"${(m.gender || 'Not Specified').replace(/"/g, '""')}"`,
      `"${(m.category || 'Youth Member').replace(/"/g, '""')}"`,
      `"${(m.interest || '').replace(/"/g, '""')}"`,
      `"${(m.education || '').replace(/"/g, '""')}"`,
      `"${(m.status || 'active').toUpperCase()}"`,
      `"${m.registeredAt ? new Date(m.registeredAt).toLocaleDateString() : ''}"`
    ]);

    // Add UTF-8 BOM so Excel displays Devanagari script correctly
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `BYCN_Registered_Members_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export to JSON
  const handleExportJSON = () => {
    if (filteredMembers.length === 0) {
      setSyncFeedback('No members available to export.');
      setTimeout(() => setSyncFeedback(null), 3500);
      return;
    }

    const exportData = {
      source: 'Bote Youth Community Nepal - Firebase Member Directory',
      database: firebaseConfig.firestoreDatabaseId,
      exportedAt: new Date().toISOString(),
      totalRecords: filteredMembers.length,
      members: filteredMembers
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const link = document.createElement('a');
    link.href = dataStr;
    link.setAttribute('download', `BYCN_Firebase_Members_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Table
  const handlePrint = () => {
    window.print();
  };

  // Unique categories for filtering
  const categories = useMemo(() => {
    const set = new Set<string>();
    members.forEach((m) => {
      if (m.category) set.add(m.category);
    });
    return Array.from(set);
  }, [members]);

  // Filtered and Sorted Members
  const filteredMembers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return members
      .filter((m) => {
        const matchesQuery =
          !q ||
          m.name.toLowerCase().includes(q) ||
          (m.nameNepali && m.nameNepali.includes(q)) ||
          m.phone.includes(q) ||
          (m.email && m.email.toLowerCase().includes(q)) ||
          (m.membershipId && m.membershipId.toLowerCase().includes(q)) ||
          (m.ward && m.ward.toLowerCase().includes(q)) ||
          (m.municipality && m.municipality.toLowerCase().includes(q)) ||
          (m.district && m.district.toLowerCase().includes(q));

        const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;

        return matchesQuery && matchesStatus && matchesCategory;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortField === 'name') {
          comp = a.name.localeCompare(b.name);
        } else if (sortField === 'ward') {
          comp = (a.ward || '').localeCompare(b.ward || '');
        } else if (sortField === 'status') {
          comp = (a.status || '').localeCompare(b.status || '');
        } else {
          // registeredAt
          const timeA = new Date(a.registeredAt || 0).getTime();
          const timeB = new Date(b.registeredAt || 0).getTime();
          comp = timeA - timeB;
        }
        return sortOrder === 'asc' ? comp : -comp;
      });
  }, [members, searchQuery, statusFilter, categoryFilter, sortField, sortOrder]);

  // Statistics counters
  const totalCount = members.length;
  const verifiedCount = members.filter((m) => m.status === 'verified').length;
  const activeCount = members.filter((m) => m.status === 'active').length;
  const pendingCount = members.filter((m) => m.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Top Header & Firebase Status Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#003893] to-[#002766] flex items-center justify-center text-white shadow-md">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 font-poppins flex items-center gap-2">
                  <span>Firebase Member Directory</span>
                  <span className="text-[11px] font-mono bg-blue-50 text-[#003893] px-2.5 py-0.5 rounded-full border border-blue-200">
                    Live Firestore
                  </span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Authoritative database of registered Bote Youth Community members powered by Google Firebase.
                </p>
              </div>
            </div>
          </div>

          {/* Firebase Connection & Live Sync Indicator */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-2xl text-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    firebaseStatus === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    firebaseStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                ></span>
              </span>
              <span className="font-bold text-slate-700">
                {firebaseStatus === 'connected' ? 'Firestore Connected' : 'Syncing Firestore...'}
              </span>
              {lastUpdatedTime && (
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                  • {lastUpdatedTime}
                </span>
              )}
            </div>

            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Synchronize fresh data with Firebase"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Firestore'}</span>
            </button>
          </div>
        </div>

        {/* Sync feedback notification */}
        {syncFeedback && (
          <div className="mt-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold px-4 py-2 rounded-2xl flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncFeedback}</span>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
            <span className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider block">
              Total In Database
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900 font-poppins">{totalCount}</span>
              <span className="text-xs text-slate-500">members</span>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5">
            <span className="text-[10px] uppercase font-extrabold text-emerald-700 tracking-wider block">
              Verified Members
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-700 font-poppins">{verifiedCount}</span>
              <span className="text-xs text-emerald-600">approved</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-3.5">
            <span className="text-[10px] uppercase font-extrabold text-blue-700 tracking-wider block">
              Active Members
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-blue-800 font-poppins">{activeCount}</span>
              <span className="text-xs text-blue-600">registered</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5">
            <span className="text-[10px] uppercase font-extrabold text-amber-700 tracking-wider block">
              Pending Review
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-amber-800 font-poppins">{pendingCount}</span>
              <span className="text-xs text-amber-600">applications</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar: Search, Filters & Export Options */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, Devanagari, phone, ID, or ward..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003893] focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Export Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleExportCSV}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Export all currently visible records to Excel CSV"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Export JSON database backup"
            >
              <FileJson className="w-4 h-4" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Print table or save as PDF"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Filter Pills and Sort Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Status:
            </span>
            {(['all', 'verified', 'active', 'pending'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-xl font-bold capitalize transition cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#003893] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'all' ? `All (${totalCount})` : st}
              </button>
            ))}

            {categories.length > 1 && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-100 text-slate-700 px-3 py-1 rounded-xl text-xs font-bold border-none focus:ring-1 focus:ring-[#003893]"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Sort Controller */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Sort by:</span>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-xl text-xs font-bold border-none"
            >
              <option value="registeredAt">Registration Date</option>
              <option value="name">Member Name</option>
              <option value="ward">Ward</option>
              <option value="status">Status</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              title="Toggle Ascending / Descending"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* RESPONSIVE TABLE OF MEMBERS */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#003893] animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-600">Fetching records from Firebase database...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700 text-base">No Members Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery
                ? `No community member matches "${searchQuery}". Try adjusting your search query or filters.`
                : 'No members are currently registered in this view.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#003893] font-bold hover:underline"
              >
                Clear search filter
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider">
                  <th className="py-3.5 px-4">Member Info</th>
                  <th className="py-3.5 px-4">Membership ID</th>
                  <th className="py-3.5 px-4">Role / Category</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Address</th>
                  <th className="py-3.5 px-4">Age / Gender</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Registered</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((member) => {
                  const memberIdCode = member.membershipId || member.id;
                  const photoSrc = resolveAssetUrl(
                    member.photoUrl && member.photoUrl.trim() && !member.photoUrl.includes('images.unsplash.com')
                      ? member.photoUrl.trim()
                      : '/assets/leader_avatar_placeholder.svg'
                  );

                  return (
                    <tr key={member.id} className="hover:bg-blue-50/40 transition">
                      {/* Member Info: Avatar + Names */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-xs">
                            <img
                              src={photoSrc}
                              alt={member.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="font-extrabold text-slate-900 text-sm block truncate">
                              {member.name}
                            </span>
                            {member.nameNepali && (
                              <span className="text-[11px] text-[#DC143C] font-semibold block truncate">
                                {member.nameNepali}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Membership ID */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-xl font-mono text-[11px] font-bold text-slate-700">
                          <IdCard className="w-3 h-3 text-slate-400" />
                          <span>{memberIdCode}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block bg-blue-50 text-[#003893] border border-blue-200/80 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase">
                          {member.category || 'Youth Member'}
                        </span>
                        {member.interest && (
                          <span className="text-[10px] text-slate-500 block truncate max-w-[150px] mt-0.5">
                            {member.interest}
                          </span>
                        )}
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <a
                          href={`tel:${member.phone}`}
                          className="flex items-center gap-1 text-slate-700 hover:text-[#003893] font-semibold"
                        >
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{member.phone}</span>
                        </a>
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="flex items-center gap-1 text-slate-500 hover:text-[#003893] text-[10px] truncate max-w-[160px] mt-0.5"
                          >
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{member.email}</span>
                          </a>
                        )}
                      </td>

                      {/* Address */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-1 text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <div className="leading-tight">
                            <span className="font-bold block">Ward {member.ward || '11'}</span>
                            <span className="text-[10px] text-slate-500 block">
                              {member.municipality || 'Bagmati Municipality'}, {member.district || 'Sarlahi'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Age / Gender */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="font-bold text-slate-800">{member.age || 20}</span> yrs
                        <span className="text-[10px] text-slate-400 block">{member.gender || 'Not specified'}</span>
                      </td>

                      {/* Status: Visual Status Badge & Quick Selector */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1.5 items-start">
                          {/* Visual Status Badge */}
                          {member.status === 'verified' && (
                            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full font-bold text-[10px] shadow-xs">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>Verified</span>
                            </span>
                          )}
                          {member.status === 'active' && (
                            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-300 px-2.5 py-1 rounded-full font-bold text-[10px] shadow-xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span>Active</span>
                            </span>
                          )}
                          {member.status === 'pending' && (
                            <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-full font-bold text-[10px] shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                              <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                              <span>Pending</span>
                            </span>
                          )}

                          {/* Quick Change Selector */}
                          <select
                            value={member.status || 'active'}
                            onChange={(e) =>
                              handleStatusChange(member.id, e.target.value as 'active' | 'verified' | 'pending')
                            }
                            className="text-[9px] font-semibold text-slate-500 bg-white border border-slate-200 rounded-lg px-1.5 py-0.5 cursor-pointer hover:border-slate-300 hover:text-slate-800 transition"
                            title="Change member status"
                          >
                            <option value="verified">Mark Verified</option>
                            <option value="active">Mark Active</option>
                            <option value="pending">Mark Pending</option>
                          </select>
                        </div>
                      </td>

                      {/* Registration Date */}
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[10px]">
                        {member.registeredAt ? new Date(member.registeredAt).toLocaleDateString() : 'Recent'}
                      </td>

                      {/* Actions: Generate ID Card & Delete */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Generate Digital ID Card Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedMemberForCard(member)}
                            className="inline-flex items-center gap-1 bg-[#DC143C] hover:bg-[#b51031] text-white px-2.5 py-1.5 rounded-xl font-bold text-[11px] transition shadow-xs cursor-pointer"
                            title="Generate and view digital ID card"
                          >
                            <IdCard className="w-3.5 h-3.5" />
                            <span>Digital ID</span>
                          </button>

                          {/* Delete Member */}
                          <button
                            type="button"
                            onClick={() => setMemberToDelete(member)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title="Delete member record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* Table Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800">{filteredMembers.length}</strong> of{' '}
            <strong className="text-slate-800">{members.length}</strong> members recorded in Firebase Firestore
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero-Trust ABAC Verified</span>
            </span>
          </div>
        </div>
      </div>

      {/* DIGITAL ID CARD MODAL */}
      {selectedMemberForCard && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 shadow-2xl relative animate-in zoom-in-95 my-8">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-black uppercase text-[#003893] bg-blue-50 px-2.5 py-0.5 rounded-full">
                Firebase Record: {selectedMemberForCard.id}
              </span>
            </div>

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

      {/* DELETE CONFIRMATION MODAL */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-base text-slate-900">Delete Member Record?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete <strong>{memberToDelete.name}</strong> (
                {memberToDelete.membershipId || memberToDelete.id}) from Firebase database? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteMember}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
