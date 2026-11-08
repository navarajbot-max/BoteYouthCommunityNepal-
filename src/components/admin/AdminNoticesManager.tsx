/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { useCommunityData } from '../../context/CommunityDataContext';
import {
  CommunityPost,
  PostType,
  PostAttachment,
  PostNewMember,
  PostPriority
} from '../../types';
import {
  Megaphone,
  Calendar,
  FileText,
  Image as ImageIcon,
  Users,
  Plus,
  Search,
  Pin,
  Trash2,
  Edit,
  Eye,
  Download,
  Upload,
  Clock,
  MapPin,
  Video,
  ExternalLink,
  CheckCircle2,
  X,
  Sparkles,
  AlertCircle,
  FileSpreadsheet,
  FileCheck
} from 'lucide-react';

export default function AdminNoticesManager() {
  const {
    posts,
    addPost,
    updatePost,
    deletePost,
    togglePinPost,
    togglePublishPost,
    manualCloudSync
  } = useCommunityData();

  const [filterType, setFilterType] = useState<PostType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'preview'>('posts');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [postType, setPostType] = useState<PostType>('notice');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('BYCN Central Committee');
  const [authorRole, setAuthorRole] = useState('Admin Council');
  const [priority, setPriority] = useState<PostPriority>('normal');
  const [tagsInput, setTagsInput] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  // Notice Specific
  const [dispatchNumber, setDispatchNumber] = useState('');
  const [targetAudience, setTargetAudience] = useState('All Community & Youth Members');
  const [validUntil, setValidUntil] = useState('');

  // Meeting Specific
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingVenue, setMeetingVenue] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [agendas, setAgendas] = useState<string[]>(['']);
  const [meetingMinutes, setMeetingMinutes] = useState('');

  // Document / Files Specific
  const [files, setFiles] = useState<PostAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Photos Specific
  const [photos, setPhotos] = useState<string[]>([]);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Event Details Specific
  const [eventBanner, setEventBanner] = useState('');
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [eventRsvpLink, setEventRsvpLink] = useState('');
  const [eventContactPerson, setEventContactPerson] = useState('');
  const [chiefGuests, setChiefGuests] = useState('');

  // New Members Details Specific
  const [newMembers, setNewMembers] = useState<PostNewMember[]>([]);

  // Open modal for Create
  const handleOpenCreate = (type: PostType = 'notice') => {
    setEditingPostId(null);
    setPostType(type);
    setTitle('');
    setSummary('');
    setContent('');
    setAuthorName('BYCN Central Committee');
    setAuthorRole('Admin Council');
    setPriority('normal');
    setTagsInput(type === 'notice' ? 'Notice, Community' : type === 'meeting' ? 'Meeting, Discussion' : type === 'document' ? 'PDF, Circular' : type === 'event' ? 'Event, Youth' : 'Welcome, Members');
    setIsPinned(false);
    setIsPublished(true);
    setDispatchNumber(`BYCN-2026-${Math.floor(100 + Math.random() * 900)}`);
    setTargetAudience('All Community & Youth Members');
    setValidUntil('');
    setMeetingDate(new Date().toISOString().split('T')[0]);
    setMeetingTime('11:00 AM NPT');
    setMeetingVenue('Karmaiya Community Hall, Sarlahi');
    setMeetingLink('');
    setAgendas(['Annual Community Review', 'Youth Empowerment Workshop']);
    setMeetingMinutes('');
    setFiles([]);
    setPhotos([]);
    setEventBanner('/uploads/header_logo_1789693983380_aok4s.png');
    setEventStartDate(new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]);
    setEventEndDate(new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]);
    setEventVenue('Karmaiya, Sarlahi District, Madhesh Province');
    setEventRsvpLink('');
    setEventContactPerson('BYCN Office (+977-9800000000)');
    setChiefGuests('Community Elders & Ward Representatives');
    setNewMembers([]);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (post: CommunityPost) => {
    setEditingPostId(post.id);
    setPostType(post.type);
    setTitle(post.title);
    setSummary(post.summary || '');
    setContent(post.content);
    setAuthorName(post.authorName || 'BYCN Central Committee');
    setAuthorRole(post.authorRole || 'Admin');
    setPriority(post.priority || 'normal');
    setTagsInput((post.tags || []).join(', '));
    setIsPinned(!!post.pinned);
    setIsPublished(post.isPublished !== false);
    setDispatchNumber(post.dispatchNumber || '');
    setTargetAudience(post.targetAudience || '');
    setValidUntil(post.validUntil || '');
    setMeetingDate(post.meetingDate || '');
    setMeetingTime(post.meetingTime || '');
    setMeetingVenue(post.meetingVenue || '');
    setMeetingLink(post.meetingLink || '');
    setAgendas(post.meetingAgenda && post.meetingAgenda.length > 0 ? post.meetingAgenda : ['']);
    setMeetingMinutes(post.meetingMinutes || '');
    setFiles(post.files || []);
    setPhotos(post.photos || []);
    setEventBanner(post.eventBanner || '');
    setEventStartDate(post.eventStartDate || '');
    setEventEndDate(post.eventEndDate || '');
    setEventVenue(post.eventVenue || '');
    setEventRsvpLink(post.eventRsvpLink || '');
    setEventContactPerson(post.eventContactPerson || '');
    setChiefGuests(post.chiefGuests || '');
    setNewMembers(post.newMembers || []);
    setIsModalOpen(true);
  };

  // Handle Agenda Items
  const handleAddAgenda = () => setAgendas([...agendas, '']);
  const handleUpdateAgenda = (idx: number, val: string) => {
    const updated = [...agendas];
    updated[idx] = val;
    setAgendas(updated);
  };
  const handleRemoveAgenda = (idx: number) => {
    setAgendas(agendas.filter((_, i) => i !== idx));
  };

  // Handle File Upload (PDFs, Docs)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    setIsUploading(true);
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      const reader = new FileReader();

      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          const res = await fetch('/api/upload-file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileData: base64Data,
              fileName: file.name,
              category: 'document'
            })
          });
          const data = await res.json();
          const fileUrl = data.success ? data.url : base64Data;
          const sizeKb = Math.round(file.size / 1024);
          const sizeFormatted = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

          let fileExt = 'pdf';
          if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) fileExt = 'docx';
          else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) fileExt = 'xlsx';
          else if (file.name.endsWith('.txt')) fileExt = 'txt';
          else if (file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg')) fileExt = 'image';

          setFiles((prev) => [
            ...prev,
            {
              id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              name: file.name,
              url: fileUrl,
              size: sizeFormatted,
              type: fileExt
            }
          ]);
        } catch (err) {
          console.warn('File upload fallback:', err);
          setFiles((prev) => [
            ...prev,
            {
              id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              name: file.name,
              url: base64Data,
              size: `${Math.round(file.size / 1024)} KB`,
              type: 'pdf'
            }
          ]);
        }
      };
      reader.readAsDataURL(file);
    }
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle Photo Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedPhotos = e.target.files;
    if (!uploadedPhotos || uploadedPhotos.length === 0) return;

    setIsUploading(true);
    for (let i = 0; i < uploadedPhotos.length; i++) {
      const file = uploadedPhotos[i];
      const reader = new FileReader();

      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          const res = await fetch('/api/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: base64Data,
              category: 'post_photo'
            })
          });
          const data = await res.json();
          const photoUrl = data.success ? data.url : base64Data;
          setPhotos((prev) => [...prev, photoUrl]);
        } catch (err) {
          console.warn('Photo upload fallback:', err);
          setPhotos((prev) => [...prev, base64Data]);
        }
      };
      reader.readAsDataURL(file);
    }
    setIsUploading(false);
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  // Handle New Member Add
  const handleAddNewMemberRow = () => {
    setNewMembers([
      ...newMembers,
      {
        id: `mem-${Date.now()}`,
        name: '',
        role: 'Youth General Member',
        ward: 'Bagmati Municipality, Ward 1',
        photoUrl: '',
        joinedDate: new Date().toISOString().split('T')[0],
        bio: '',
        email: '',
        phone: ''
      }
    ]);
  };

  const handleUpdateNewMember = (idx: number, field: keyof PostNewMember, value: string) => {
    const updated = [...newMembers];
    updated[idx] = { ...updated[idx], [field]: value };
    setNewMembers(updated);
  };

  const handleRemoveNewMember = (idx: number) => {
    setNewMembers(newMembers.filter((_, i) => i !== idx));
  };

  // Save Post
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFeedback('Post title is required.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const postPayload: Omit<CommunityPost, 'id' | 'createdAt'> = {
      type: postType,
      title: title.trim(),
      summary: summary.trim(),
      content: content.trim(),
      authorName: authorName.trim(),
      authorRole: authorRole.trim(),
      priority,
      pinned: isPinned,
      isPublished,
      tags,
      // Specific attributes
      dispatchNumber: postType === 'notice' ? dispatchNumber.trim() : undefined,
      targetAudience: postType === 'notice' ? targetAudience.trim() : undefined,
      validUntil: postType === 'notice' ? validUntil : undefined,
      meetingDate: postType === 'meeting' ? meetingDate : undefined,
      meetingTime: postType === 'meeting' ? meetingTime : undefined,
      meetingVenue: postType === 'meeting' ? meetingVenue : undefined,
      meetingLink: postType === 'meeting' ? meetingLink : undefined,
      meetingAgenda: postType === 'meeting' ? agendas.filter((a) => a.trim().length > 0) : undefined,
      meetingMinutes: postType === 'meeting' ? meetingMinutes : undefined,
      files: postType === 'document' || files.length > 0 ? files : undefined,
      photos: postType === 'photo' || photos.length > 0 ? photos : undefined,
      eventBanner: postType === 'event' ? eventBanner : undefined,
      eventStartDate: postType === 'event' ? eventStartDate : undefined,
      eventEndDate: postType === 'event' ? eventEndDate : undefined,
      eventVenue: postType === 'event' ? eventVenue : undefined,
      eventRsvpLink: postType === 'event' ? eventRsvpLink : undefined,
      eventContactPerson: postType === 'event' ? eventContactPerson : undefined,
      chiefGuests: postType === 'event' ? chiefGuests : undefined,
      newMembers: postType === 'new_members' ? newMembers : undefined
    };

    if (editingPostId) {
      await updatePost(editingPostId, postPayload);
      setFeedback('Post updated successfully and synced to server!');
    } else {
      await addPost(postPayload);
      setFeedback('New post published successfully and visible to public!');
    }

    setIsModalOpen(false);
    setTimeout(() => setFeedback(null), 4000);
  };

  // Filter and Search logic
  const filteredPosts = posts.filter((post) => {
    if (filterType !== 'all' && post.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchContent = post.content.toLowerCase().includes(q);
      const matchTags = (post.tags || []).some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchTags) return false;
    }
    return true;
  });

  const getPostTypeBadge = (type: PostType) => {
    switch (type) {
      case 'notice':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300"><Megaphone className="w-3 h-3 text-amber-700" /> Notice (सूचना)</span>;
      case 'meeting':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300"><Calendar className="w-3 h-3 text-blue-700" /> Meeting (बैठक)</span>;
      case 'document':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300"><FileText className="w-3 h-3 text-rose-700" /> Files &amp; PDF</span>;
      case 'photo':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300"><ImageIcon className="w-3 h-3 text-emerald-700" /> Photos (फोटो)</span>;
      case 'event':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300"><Sparkles className="w-3 h-3 text-purple-700" /> Event Details</span>;
      case 'new_members':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-900 border border-teal-300"><Users className="w-3 h-3 text-teal-700" /> New Members</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Post Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-[#003893] to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                Official Communications Desk
              </span>
              <span className="bg-white/10 text-slate-200 text-xs px-2.5 py-0.5 rounded-full">
                {posts.length} Total Posts
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-poppins">
              Admin Posts &amp; Community Notices
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Publish official notices, scheduled meetings with agendas, downloadable PDF documents &amp; circulars, photo galleries, upcoming event itineraries, and newly registered member introductions directly to the public website.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleOpenCreate('notice')}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Post Notice</span>
            </button>
            <button
              onClick={() => handleOpenCreate('meeting')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>New Meeting</span>
            </button>
            <button
              onClick={() => handleOpenCreate('document')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Upload PDF / Files</span>
            </button>
            <button
              onClick={() => handleOpenCreate('new_members')}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Users className="w-4 h-4" />
              <span>Add New Members</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-emerald-700 hover:text-emerald-900">&times;</button>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterType === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Posts ({posts.length})
          </button>
          <button
            onClick={() => setFilterType('notice')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              filterType === 'notice'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Notices ({posts.filter((p) => p.type === 'notice').length})</span>
          </button>
          <button
            onClick={() => setFilterType('meeting')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              filterType === 'meeting'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Meetings ({posts.filter((p) => p.type === 'meeting').length})</span>
          </button>
          <button
            onClick={() => setFilterType('document')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              filterType === 'document'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF &amp; Files ({posts.filter((p) => p.type === 'document').length})</span>
          </button>
          <button
            onClick={() => setFilterType('photo')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              filterType === 'photo'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Photos ({posts.filter((p) => p.type === 'photo').length})</span>
          </button>
          <button
            onClick={() => setFilterType('event')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              filterType === 'event'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Events ({posts.filter((p) => p.type === 'event').length})</span>
          </button>
          <button
            onClick={() => setFilterType('new_members')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              filterType === 'new_members'
                ? 'bg-teal-600 text-white'
                : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>New Members ({posts.filter((p) => p.type === 'new_members').length})</span>
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, tag or keyword..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003893] bg-slate-50"
          />
        </div>
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No posts found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? `No posts matching "${searchQuery}". Clear your search query or filter.`
              : 'Click "Post Notice" or one of the quick buttons above to publish your first communication.'}
          </p>
          <button
            onClick={() => handleOpenCreate('notice')}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[#003893] text-white text-xs font-bold rounded-xl hover:bg-blue-900 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Notice</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className={`bg-white rounded-2xl border transition hover:shadow-md flex flex-col justify-between overflow-hidden ${
                post.pinned
                  ? 'border-amber-400 ring-2 ring-amber-300/40 shadow-xs'
                  : 'border-slate-200'
              }`}
            >
              {/* Card Header & Banner */}
              <div>
                {/* Event banner or First photo */}
                {post.eventBanner && (
                  <div className="h-36 w-full overflow-hidden bg-slate-100 relative">
                    <img
                      src={post.eventBanner}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      {getPostTypeBadge(post.type)}
                    </div>
                  </div>
                )}

                {!post.eventBanner && post.photos && post.photos.length > 0 && (
                  <div className="h-36 w-full overflow-hidden bg-slate-100 relative">
                    <img
                      src={post.photos[0]}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-xs font-bold">
                      +{post.photos.length} Photos
                    </div>
                    <div className="absolute top-2 right-2">
                      {getPostTypeBadge(post.type)}
                    </div>
                  </div>
                )}

                <div className="p-5 space-y-3">
                  {!post.eventBanner && (!post.photos || post.photos.length === 0) && (
                    <div className="flex items-center justify-between gap-2">
                      {getPostTypeBadge(post.type)}
                      {post.priority && post.priority !== 'normal' && (
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                          post.priority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {post.priority}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Pin badge */}
                  {post.pinned && (
                    <div className="flex items-center gap-1 text-[11px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md w-fit border border-amber-200">
                      <Pin className="w-3 h-3 fill-amber-600" />
                      <span>Pinned Announcement</span>
                    </div>
                  )}

                  <h3 className="font-bold text-slate-900 text-base line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  {post.summary && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {post.summary}
                    </p>
                  )}

                  {/* Specific Information Indicators */}
                  {post.type === 'meeting' && (
                    <div className="p-2.5 bg-blue-50/80 rounded-xl border border-blue-100 text-[11px] text-blue-900 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{post.meetingDate} {post.meetingTime ? `at ${post.meetingTime}` : ''}</span>
                      </div>
                      {post.meetingVenue && (
                        <div className="flex items-center gap-1.5 text-slate-600 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{post.meetingVenue}</span>
                        </div>
                      )}
                      {post.meetingAgenda && post.meetingAgenda.length > 0 && (
                        <span className="inline-block text-[10px] text-blue-700 font-semibold">
                          {post.meetingAgenda.length} agenda items listed
                        </span>
                      )}
                    </div>
                  )}

                  {post.type === 'document' && post.files && post.files.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-black text-slate-400">Attached Documents:</span>
                      {post.files.slice(0, 2).map((file, fIdx) => (
                        <div
                          key={file.id || `${post.id}-file-${fIdx}-${file.name}`}
                          className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <FileText className="w-3.5 h-3.5 text-red-600 shrink-0" />
                            <span className="font-semibold text-slate-800 truncate text-[11px]">{file.name}</span>
                          </div>
                          {file.size && <span className="text-[10px] text-slate-400 shrink-0">{file.size}</span>}
                        </div>
                      ))}
                      {post.files.length > 2 && (
                        <span className="text-[10px] text-slate-500 font-bold block">
                          +{post.files.length - 2} more files attached
                        </span>
                      )}
                    </div>
                  )}

                  {post.type === 'new_members' && post.newMembers && post.newMembers.length > 0 && (
                    <div className="p-2.5 bg-teal-50 rounded-xl border border-teal-100 text-xs text-teal-900 space-y-1.5">
                      <span className="text-[10px] font-black uppercase text-teal-700">
                        {post.newMembers.length} New Member(s) Introduced:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {post.newMembers.slice(0, 3).map((m, mIdx) => (
                          <span key={m.id || `${post.id}-member-${mIdx}-${m.name}`} className="text-[10.5px] bg-white px-2 py-0.5 rounded-md border border-teal-200 font-bold">
                            {m.name || 'Member'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {post.type === 'event' && (
                    <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-100 text-[11px] text-purple-900 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Clock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>Date: {post.eventStartDate || 'Upcoming'}</span>
                      </div>
                      {post.eventVenue && (
                        <div className="flex items-center gap-1.5 text-slate-600 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{post.eventVenue}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-400">
                    <span>By: {post.authorName || 'Admin'}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-1">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => togglePinPost(post.id)}
                    className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      post.pinned
                        ? 'bg-amber-100 text-amber-800'
                        : 'text-slate-400 hover:text-amber-600 hover:bg-slate-200'
                    }`}
                    title={post.pinned ? 'Unpin post' : 'Pin to top of public website'}
                  >
                    <Pin className={`w-3.5 h-3.5 ${post.pinned ? 'fill-amber-600' : ''}`} />
                  </button>

                  <button
                    onClick={() => togglePublishPost(post.id)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                      post.isPublished !== false
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                    title="Toggle public visibility"
                  >
                    {post.isPublished !== false ? 'Live' : 'Draft'}
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(post)}
                    className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Edit post"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      deletePost(post.id);
                      setFeedback('Post deleted.');
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete post"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-4xl border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 to-[#003893] text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                  {postType === 'notice' && <Megaphone className="w-5 h-5 text-amber-400" />}
                  {postType === 'meeting' && <Calendar className="w-5 h-5 text-blue-400" />}
                  {postType === 'document' && <FileText className="w-5 h-5 text-rose-400" />}
                  {postType === 'photo' && <ImageIcon className="w-5 h-5 text-emerald-400" />}
                  {postType === 'event' && <Sparkles className="w-5 h-5 text-purple-400" />}
                  {postType === 'new_members' && <Users className="w-5 h-5 text-teal-400" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {editingPostId ? 'Edit Community Post' : 'Create New Community Post'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Directly updates public notices, meetings, documents, and news in real-time.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSavePost} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* 1. Post Type Selector */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-2">
                  Select Post Category / Type *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {[
                    { id: 'notice', label: 'Notice', icon: Megaphone, color: 'hover:border-amber-500' },
                    { id: 'meeting', label: 'Meeting', icon: Calendar, color: 'hover:border-blue-500' },
                    { id: 'document', label: 'PDF / Files', icon: FileText, color: 'hover:border-rose-500' },
                    { id: 'photo', label: 'Photos', icon: ImageIcon, color: 'hover:border-emerald-500' },
                    { id: 'event', label: 'Event Details', icon: Sparkles, color: 'hover:border-purple-500' },
                    { id: 'new_members', label: 'New Members', icon: Users, color: 'hover:border-teal-500' }
                  ].map((t) => {
                    const IconComp = t.icon;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setPostType(t.id as PostType)}
                        className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                          postType === t.id
                            ? 'bg-[#003893] text-white border-[#003893] shadow-sm ring-2 ring-blue-300'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                        <span className="text-xs font-bold">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Common Fields: Title, Summary, Author, Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Post Title (English &amp; Nepali) *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Annual Bote Youth Council Assembly 2026 or छात्रवृत्ति आवेदन सूचना"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#003893] text-sm font-semibold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Brief Summary / Teaser
                  </label>
                  <input
                    type="text"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Short 1-2 sentence overview for cards and notifications..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#003893] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Author / Organization Unit
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="BYCN Central Committee"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#003893] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as PostPriority)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#003893] text-xs bg-white"
                  >
                    <option value="normal">Normal (साधारण)</option>
                    <option value="high">High (महत्वपूर्ण)</option>
                    <option value="urgent">Urgent / Emergency (अत्यन्त जरुरी)</option>
                  </select>
                </div>
              </div>

              {/* 3. TYPE-SPECIFIC SECTIONS */}

              {/* === NOTICE SPECIFIC === */}
              {postType === 'notice' && (
                <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                    <Megaphone className="w-4 h-4 text-amber-700" />
                    <span>Notice &amp; Circular Attributes (सूचना विवरण)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-amber-900 mb-1">Dispatch Number (चलानी नं.)</label>
                      <input
                        type="text"
                        value={dispatchNumber}
                        onChange={(e) => setDispatchNumber(e.target.value)}
                        placeholder="BYCN-2026-104"
                        className="w-full px-3 py-1.5 rounded-lg border border-amber-300 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-amber-900 mb-1">Target Audience</label>
                      <input
                        type="text"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        placeholder="All Members, Youth, General Public"
                        className="w-full px-3 py-1.5 rounded-lg border border-amber-300 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-amber-900 mb-1">Valid Till Date</label>
                      <input
                        type="date"
                        value={validUntil}
                        onChange={(e) => setValidUntil(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-amber-300 text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* === MEETING SPECIFIC === */}
              {postType === 'meeting' && (
                <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-4">
                  <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                    <Calendar className="w-4 h-4 text-blue-700" />
                    <span>Scheduled Meeting Details (बैठक विवरण)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-blue-900 mb-1">Meeting Date *</label>
                      <input
                        type="date"
                        value={meetingDate}
                        onChange={(e) => setMeetingDate(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-blue-300 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-blue-900 mb-1">Meeting Time</label>
                      <input
                        type="text"
                        value={meetingTime}
                        onChange={(e) => setMeetingTime(e.target.value)}
                        placeholder="11:00 AM NPT"
                        className="w-full px-3 py-1.5 rounded-lg border border-blue-300 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-blue-900 mb-1">Physical Venue</label>
                      <input
                        type="text"
                        value={meetingVenue}
                        onChange={(e) => setMeetingVenue(e.target.value)}
                        placeholder="Karmaiya Community Center"
                        className="w-full px-3 py-1.5 rounded-lg border border-blue-300 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-blue-900 mb-1">
                      Online Video Call Link (Google Meet / Zoom)
                    </label>
                    <input
                      type="url"
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                      placeholder="https://meet.google.com/abc-defg-hij"
                      className="w-full px-3 py-1.5 rounded-lg border border-blue-300 text-xs bg-white"
                    />
                  </div>

                  {/* Agendas List */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[11px] font-bold text-blue-900">Meeting Agendas (कार्यसूची):</label>
                      <button
                        type="button"
                        onClick={handleAddAgenda}
                        className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Agenda Item</span>
                      </button>
                    </div>
                    <div className="space-y-2">
                      {agendas.map((agenda, aIdx) => (
                        <div key={aIdx} className="flex items-center gap-2">
                          <span className="text-xs font-bold text-blue-600 w-5 text-right">{aIdx + 1}.</span>
                          <input
                            type="text"
                            value={agenda}
                            onChange={(e) => handleUpdateAgenda(aIdx, e.target.value)}
                            placeholder={`Agenda item ${aIdx + 1}`}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-blue-300 text-xs bg-white"
                          />
                          {agendas.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveAgenda(aIdx)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* === FILES / PDF SPECIFIC === */}
              {(postType === 'document' || files.length > 0) && (
                <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                      <FileText className="w-4 h-4 text-rose-700" />
                      <span>Files, Documents &amp; PDF Attachments (कागजात तथा डाउनलोडहरू)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload Files / PDF</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  {files.length === 0 ? (
                    <div className="p-6 border-2 border-dashed border-rose-300 rounded-xl text-center space-y-2 bg-white/60">
                      <FileCheck className="w-6 h-6 text-rose-400 mx-auto" />
                      <p className="text-xs text-rose-800 font-medium">
                        No files uploaded yet. Click above to attach official circulars, constitutions, financial reports, or forms.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {files.map((f, fIdx) => (
                        <div
                          key={f.id || `file-upload-${fIdx}-${f.name}`}
                          className="flex items-center justify-between p-3 bg-white rounded-xl border border-rose-200 text-xs shadow-xs"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                            <div>
                              <span className="font-bold text-slate-800 block truncate">{f.name}</span>
                              <span className="text-[10px] text-slate-400">{f.size || 'Document'}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={f.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline text-xs flex items-center gap-1 font-bold"
                            >
                              <Download className="w-3 h-3" />
                              <span>Preview / Download</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => setFiles(files.filter((_, i) => i !== fIdx))}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* === PHOTOS SPECIFIC === */}
              {(postType === 'photo' || photos.length > 0) && (
                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                      <ImageIcon className="w-4 h-4 text-emerald-700" />
                      <span>Photo Album / Image Gallery (तस्विर संग्रह)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Add Photos</span>
                    </button>
                    <input
                      ref={photoInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>

                  {photos.length === 0 ? (
                    <div className="p-6 border-2 border-dashed border-emerald-300 rounded-xl text-center space-y-2 bg-white/60">
                      <ImageIcon className="w-6 h-6 text-emerald-400 mx-auto" />
                      <p className="text-xs text-emerald-800 font-medium">
                        No photos added yet. Click &quot;Add Photos&quot; to upload ceremony, workshop, or community pictures.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {photos.map((img, pIdx) => (
                        <div key={pIdx} className="relative group rounded-xl overflow-hidden border border-emerald-200 aspect-video bg-slate-100">
                          <img src={img} alt="Post item" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setPhotos(photos.filter((_, i) => i !== pIdx))}
                            className="absolute top-1.5 right-1.5 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* === EVENT DETAILS SPECIFIC === */}
              {postType === 'event' && (
                <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-3">
                  <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-purple-700" />
                    <span>Event Details &amp; Schedule (कार्यक्रम विवरण)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-purple-900 mb-1">Event Banner Image URL</label>
                      <input
                        type="url"
                        value={eventBanner}
                        onChange={(e) => setEventBanner(e.target.value)}
                        placeholder="/uploads/banner.jpg or https://..."
                        className="w-full px-3 py-1.5 rounded-lg border border-purple-300 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-purple-900 mb-1">Event Venue / Location</label>
                      <input
                        type="text"
                        value={eventVenue}
                        onChange={(e) => setEventVenue(e.target.value)}
                        placeholder="Karmaiya, Sarlahi District"
                        className="w-full px-3 py-1.5 rounded-lg border border-purple-300 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-purple-900 mb-1">Start Date &amp; Time</label>
                      <input
                        type="date"
                        value={eventStartDate}
                        onChange={(e) => setEventStartDate(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-purple-300 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-purple-900 mb-1">RSVP Link or Contact Person</label>
                      <input
                        type="text"
                        value={eventContactPerson}
                        onChange={(e) => setEventContactPerson(e.target.value)}
                        placeholder="Contact Person (+977-9800000000)"
                        className="w-full px-3 py-1.5 rounded-lg border border-purple-300 text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* === NEW MEMBERS DETAILS SPECIFIC === */}
              {postType === 'new_members' && (
                <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-teal-900 font-bold text-xs">
                      <Users className="w-4 h-4 text-teal-700" />
                      <span>New Member Details &amp; Welcoming (नयाँ सदस्यहरूको विवरण)</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddNewMemberRow}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Member</span>
                    </button>
                  </div>

                  {newMembers.length === 0 ? (
                    <div className="p-6 border-2 border-dashed border-teal-300 rounded-xl text-center space-y-2 bg-white/60">
                      <Users className="w-6 h-6 text-teal-400 mx-auto" />
                      <p className="text-xs text-teal-800 font-medium">
                        No new members added to this announcement yet. Click &quot;Add Member&quot; to introduce newly joined youth!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {newMembers.map((m, mIdx) => (
                        <div key={m.id || `member-row-${mIdx}`} className="p-3.5 bg-white rounded-2xl border border-teal-200 space-y-3 shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-teal-800">Member #{mIdx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveNewMember(mIdx)}
                              className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Remove</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <div>
                              <label className="block text-[10.5px] font-bold text-slate-600 mb-1">Full Name *</label>
                              <input
                                type="text"
                                required
                                value={m.name}
                                onChange={(e) => handleUpdateNewMember(mIdx, 'name', e.target.value)}
                                placeholder="e.g. Ramesh Bote"
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[10.5px] font-bold text-slate-600 mb-1">Role / Designation</label>
                              <input
                                type="text"
                                value={m.role}
                                onChange={(e) => handleUpdateNewMember(mIdx, 'role', e.target.value)}
                                placeholder="Youth Member / Cultural Coordinator"
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[10.5px] font-bold text-slate-600 mb-1">Ward / Location</label>
                              <input
                                type="text"
                                value={m.ward}
                                onChange={(e) => handleUpdateNewMember(mIdx, 'ward', e.target.value)}
                                placeholder="Bagmati Municipality-1"
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[10.5px] font-bold text-slate-600 mb-1">Photo URL or Upload</label>
                              <input
                                type="text"
                                value={m.photoUrl || ''}
                                onChange={(e) => handleUpdateNewMember(mIdx, 'photoUrl', e.target.value)}
                                placeholder="https://..."
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[10.5px] font-bold text-slate-600 mb-1">Joined Date</label>
                              <input
                                type="date"
                                value={m.joinedDate || ''}
                                onChange={(e) => handleUpdateNewMember(mIdx, 'joinedDate', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[10.5px] font-bold text-slate-600 mb-1">Email / Phone</label>
                              <input
                                type="text"
                                value={m.email || ''}
                                onChange={(e) => handleUpdateNewMember(mIdx, 'email', e.target.value)}
                                placeholder="contact@example.com"
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10.5px] font-bold text-slate-600 mb-1">Welcome Message / Bio</label>
                            <input
                              type="text"
                              value={m.bio || ''}
                              onChange={(e) => handleUpdateNewMember(mIdx, 'bio', e.target.value)}
                              placeholder="Hearty welcome to the community family! Dedicated to Bote cultural preservation."
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 4. Full Content (Markdown / Detailed text) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Detailed Content / Description *
                </label>
                <textarea
                  rows={5}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Provide complete details, circular body text, meeting resolutions, or public announcements..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#003893] text-xs font-mono"
                />
              </div>

              {/* 5. Tags and Visibility Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Notice, Youth, Karmaiya, Assembly"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#003893] text-xs"
                  />
                </div>

                <div className="flex items-center gap-6 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPinned}
                      onChange={(e) => setIsPinned(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                    />
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Pin className="w-3.5 h-3.5 text-amber-600" /> Pin to Top of Website
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-bold text-slate-700">
                      Publish to Public Immediately
                    </span>
                  </label>
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#003893] hover:bg-blue-900 text-white text-xs font-bold shadow-md transition flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{editingPostId ? 'Save Changes' : 'Publish Post Live'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
