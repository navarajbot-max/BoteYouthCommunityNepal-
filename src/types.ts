/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ThemeType = 'nepali-flag' | 'royal-heritage' | 'riverine-teal' | 'midnight-cultural';

export type Language = 'en' | 'ne';

export type TabType =
  | 'home'
  | 'about'
  | 'history'
  | 'cultures'
  | 'language'
  | 'dress'
  | 'leaders'
  | 'empower'
  | 'join'
  | 'scholarships'
  | 'follow'
  | 'themes-studio'
  | 'admin'
  | 'notices';

export interface LeaderProfile {
  id: string;
  name: string;
  nameNepali: string;
  role: string; // e.g. "Youth Leader Chairman", "Community Chairman", etc.
  category: 'youth' | 'community';
  image: string;
  bio: string;
  bioNepali?: string;
  responsibilities: string[];
  phone: string;
  email: string;
  ward: string;
  term: string;
  badge: string;
}

export interface DictionaryWord {
  id: string;
  tarahi: string;
  devnagari: string;
  nepali: string;
  english: string;
  phonetic: string;
  category: string;
  exampleSentence?: string;
}

export interface CultureTradition {
  id: string;
  title: string;
  titleNepali: string;
  season: string;
  category: string;
  description: string;
  significance: string;
  image: string;
  rituals: string[];
}

export interface TraditionalDressItem {
  id: string;
  name: string;
  nameNepali: string;
  gender: 'women' | 'men' | 'both';
  materials: string;
  description: string;
  significance: string;
  image: string;
  features: string[];
}

export interface ScholarshipProgram {
  id: string;
  title: string;
  titleNepali: string;
  targetLevel: string;
  awardAmount: string;
  deadline: string;
  eligibility: string;
  description: string;
  criteria: string[];
  status: 'open' | 'closed';
}

export interface MemberApplication {
  id: string;
  fullName: string;
  age: string;
  gender: string;
  category: 'Youth Member' | 'Student Member' | 'General Community' | 'Cultural Advisor';
  district: string;
  municipality: string;
  ward: string;
  phone: string;
  email: string;
  education: string;
  interestAreas: string[];
  photoUrl: string;
  submittedAt: string;
  membershipId: string;
}

export interface ThemeConfig {
  activeTheme: ThemeType;
  headerLogo: string;
  footerLogo: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface TimelineEvent {
  id: string;
  year: string;
  periodLabel: string;
  title: string;
  titleNepali: string;
  category: 'ancient' | 'governance' | 'craft' | 'modern' | 'youth';
  categoryLabel: string;
  summary: string;
  culturalImpact: string;
  riverLocation: string;
  tag: string;
  image: string;
  artifacts: string[];
}

export interface CostumeItem {
  id: string;
  name: string;
  nameNepali: string;
  category: 'ceremonial' | 'daily' | 'dance' | 'fishing' | 'wedding' | 'youth-council';
  wearer: 'men' | 'women' | 'both';
  fabric: string;
  description: string;
  culturalSignificance: string;
  accessories: string[];
  image: string;
  featured?: boolean;
}

export interface CustomDomainConfig {
  primaryDomain: string;
  additionalDomains: string[];
  domainType: '.org.np' | '.org' | '.com' | '.np' | '.net' | '.community';
  status: 'active' | 'pending-dns' | 'ssl-secured';
  cnameRecord: string;
  ipAddress: string;
  sslEnabled: boolean;
  lastVerifiedAt?: string;
}

export interface RegisteredMember {
  id: string;
  name: string;
  nameNepali?: string;
  email?: string;
  phone: string;
  ward: string;
  municipality?: string;
  district?: string;
  province?: string;
  settlement?: string;
  age: number | string;
  gender?: string;
  category: string;
  interest: string;
  education?: string;
  photoUrl?: string;
  registeredAt: string;
  updatedAt?: string;
  notes?: string;
  status: 'active' | 'verified' | 'pending';
  ipMasked?: string;
  membershipId?: string;
  isEncrypted?: boolean;
  encryptionHash?: string;
  encryptedVault?: string;
}

export interface CommunityMetric {
  id: 'population' | 'wards' | 'scholarship' | 'pride' | string;
  title: string; // e.g. "Bote Population"
  value: string; // e.g. "11,258+"
  unit?: string; // e.g. "Total Citizens", "Wards", "NPR", "%"
  subtitle: string; // e.g. "National Census 2021 Record"
  description?: string; // Detailed historical/census documentation
  sourceCitation: string; // Official government or community source
  highlightColor?: string; // Color styling for card
  lastUpdated: string;
}

export interface AutoReloadConfig {
  enabled: boolean;
  intervalSeconds: number; // 5, 10, 30, 60
  soundAlert: boolean;
  lastReloadedAt?: string;
}

export type PostPriority = 'normal' | 'high' | 'urgent';

export type PostType =
  | 'notice'
  | 'meeting'
  | 'document'
  | 'photo'
  | 'event'
  | 'new_members'
  | 'new_member'
  | 'general';

export interface PostAttachment {
  id?: string;
  name: string;
  url: string;
  size?: string;
  type?: 'pdf' | 'document' | 'spreadsheet' | 'image' | 'docx' | 'xlsx' | 'txt' | 'other' | string;
}

export interface PostNewMember {
  id?: string;
  name: string;
  nameNepali?: string;
  role?: string;
  roleOrCategory?: string;
  district?: string;
  ward?: string;
  phone?: string;
  email?: string;
  photoUrl?: string;
  message?: string;
  bio?: string;
  joinedAt?: string;
  joinedDate?: string;
}

export interface CommunityPost {
  id: string;
  type: PostType;
  title: string;
  titleNepali?: string;
  summary?: string;
  content: string;
  contentNepali?: string;
  date?: string;
  priority?: PostPriority;
  author?: string;
  authorName?: string;
  authorRole?: string;
  isPublished: boolean;
  pinned?: boolean;
  tags?: string[];
  
  // Notice specific fields
  dispatchNumber?: string;
  targetAudience?: string;
  validUntil?: string;

  // Meeting specific fields
  meetingDate?: string;
  meetingTime?: string;
  meetingLocation?: string;
  meetingVenue?: string;
  meetingLink?: string;
  meetingAgenda?: string[];
  meetingMinutes?: string;

  // Event specific fields
  eventDate?: string;
  eventStartDate?: string;
  eventEndDate?: string;
  eventTime?: string;
  eventVenue?: string;
  eventOrganizer?: string;
  eventBanner?: string;
  eventRsvpLink?: string;
  eventContactPerson?: string;
  chiefGuests?: string;
  registrationUrl?: string;

  // Files / Document specific fields
  files?: PostAttachment[];

  // Photo gallery specific fields
  photos?: string[];

  // New members specific fields
  newMembers?: PostNewMember[];

  createdAt: string;
  updatedAt?: string;
}

export interface KarmaiyaCentralOfficeDetails {
  officeName: string;
  officeNameNepali: string;
  municipality: string;
  wardNo: string;
  villageSettlement: string;
  district: string;
  province: string;
  country: string;
  postalCode: string;
  primaryPhone: string;
  secondaryPhone: string;
  hotline: string;
  officialEmail: string;
  secondaryEmail: string;
  officeHours: string;
  holidaySchedule: string;
  chiefExecutiveInCharge: string;
  viceChairperson: string;
  secretaryGeneral: string;
  treasurer: string;
  daoRegistrationNo: string;
  swcAffiliationNo: string;
  panNumber: string;
  landmark: string;
  gpsCoordinates: string;
  googleMapsEmbedUrl?: string;
  keyServices: string[];
  publicNoticeBoardNotice: string;
  publicNoticeTitle?: string;
  publicNoticePriority?: 'normal' | 'high' | 'urgent';
  publicNoticePostedAt?: string;
  publicNoticeIsPublished?: boolean;
  emergencyRiverHelpline: string;
  lastUpdated?: string;
}

export type NotificationType = 'join' | 'follow' | 'notice' | 'update' | 'system';

export interface CommunityNotification {
  id: string;
  type: NotificationType;
  title: string;
  titleNepali?: string;
  message: string;
  messageNepali?: string;
  timestamp: string; // ISO 8601 string
  read: boolean;
  targetTab?: TabType;
  metadata?: {
    memberId?: string;
    membershipId?: string;
    name?: string;
    nameNepali?: string;
    email?: string;
    phone?: string;
    ward?: string;
    municipality?: string;
    district?: string;
    category?: string;
    status?: string;
    followerCount?: number;
    notes?: string;
    postId?: string;
  };
}

export interface SiteIdentityConfig {
  siteName: string;
  tagline: string;
  location: string;
  contactPhone: string;
  contactEmail: string;
  aboutSummary?: string;
  authorizedEmails?: string[];
  officialDomains?: string[];
  headerLogo?: string;
  footerLogo?: string;
  theme?: string;
  googleAnalyticsId?: string;
  googleAnalyticsEnabled?: boolean;
  googleSiteVerificationCode?: string;
  favicon?: string;
}

export interface PollOption {
  id: string;
  text: string;
  textNepali?: string;
  votes: number;
  addedBy?: 'admin' | 'member';
  suggestedByName?: string;
  createdAt?: string;
}

export interface PollVoterLog {
  id: string;
  optionId: string;
  optionText: string;
  voterName?: string;
  voterEmail?: string;
  membershipId?: string;
  votedAt: string;
  ipMasked?: string;
}

export interface CommunityPollConfig {
  id: string;
  title: string;
  titleNepali?: string;
  subtitle: string;
  subtitleNepali?: string;
  isActive: boolean;
  allowMemberSuggestions: boolean;
  options: PollOption[];
  voterLogs: PollVoterLog[];
  totalVotes: number;
  updatedAt?: string;
}

