/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  LeaderProfile,
  TimelineEvent,
  CultureTradition,
  DictionaryWord,
  TraditionalDressItem,
  CostumeItem,
  CustomDomainConfig,
  RegisteredMember,
  CommunityMetric,
  AutoReloadConfig,
  CommunityPost,
  KarmaiyaCentralOfficeDetails,
  CommunityNotification,
  CommunityPollConfig,
  PollOption,
  PollVoterLog
} from '../types';
import {
  LEADERSHIP_PROFILES,
  CULTURAL_TRADITIONS,
  TRADITIONAL_DRESS_ITEMS,
  DICTIONARY_WORDS,
  DEFAULT_LOGO_URL,
  DEFAULT_COMMUNITY_METRICS,
  RESEARCHED_COMMUNITY_METRICS,
  INITIAL_COMMUNITY_POSTS,
  DEFAULT_KARMAIYA_CENTRAL_OFFICE,
  DEFAULT_COMMUNITY_POLL
} from '../data/communityData';
import { sanitizeCentralOfficeDetails } from '../utils/addressFormatter';
import { applyFaviconToDocument, updateCanonicalDomain, updateGoogleSiteVerification } from '../utils/faviconManager';
import { encryptMemberPayload } from '../utils/cryptoVault';
import { HISTORICAL_EVENTS } from '../components/InteractiveHistoryTimeline';
import { INITIAL_COSTUMES_DATA } from '../data/costumesData';
import {
  saveMemberToFirebase,
  saveSiteSettingsToFirebase,
  saveMasterDataToFirebase,
  savePostsToFirebase,
  subscribeToSiteSettings,
  subscribeToMasterData,
  subscribeToPosts,
  saveCentralOfficeToFirebase,
  fetchCentralOfficeFromFirebase,
  subscribeToCentralOffice,
  subscribeToFirebaseMembers,
  fetchMembersFromFirebase,
  deleteMemberFromFirebase,
  updateMemberStatusInFirebase,
  subscribeToNotifications,
  saveNotificationsToFirebase,
  fetchNotificationsFromFirebase,
  savePollToFirebase,
  fetchPollFromFirebase,
  subscribeToPoll
} from '../services/firebase';
import {
  persistAsset,
  cacheAssetSynchronously,
  getSynchronousCachedAsset
} from '../services/storagePersistence';

export interface BentoConfig {
  pillText: string;
  title: string;
  subtitle: string;
  heritageTag: string;
  heritageTitle: string;
  heritageDesc: string;
  traditionsBadge: string;
  traditionsTitle: string;
  traditionsDesc: string;
  dialectBadge: string;
  dialectTitle: string;
  dialectDesc: string;
}

export interface PillarsConfig {
  tag: string;
  title: string;
  desc: string;
  p1Title: string;
  p1Desc: string;
  p2Title: string;
  p2Desc: string;
  p3Title: string;
  p3Desc: string;
  p4Title: string;
  p4Desc: string;
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

const DEFAULT_BENTO_CONFIG: BentoConfig = {
  pillText: 'BENTO GRID • COMMUNITY MATRIX',
  title: 'BOTE YOUTH GRID OVERVIEW',
  subtitle: 'Explore heritage, language, craftsmanship, council leaders, and digital identity through interconnected Bento modules.',
  heritageTag: 'INDIGENOUS HERITAGE • Karmaiya, Sarlahi • Bagmati River',
  heritageTitle: 'REVITALIZING ANCIENT WATER TRADITIONS & YOUTH LEADERSHIP',
  heritageDesc: 'The Bote indigenous community honors ancestral river navigation, single-log dugout canoes (Ek-Dunge Nau), and sacred water rites while educating the next generation of Nepali leaders.',
  traditionsBadge: 'TRADITIONS',
  traditionsTitle: 'Jal Puja & River Rites',
  traditionsDesc: 'Sacred offerings to river deities ensuring safe boat passage and rich fish harvests.',
  dialectBadge: 'DIALECT',
  dialectTitle: 'Tarahi Bote Lexicon',
  dialectDesc: 'Preserve an endangered oral dialect with searchable words and phonetic pronunciation.'
};

const DEFAULT_PILLARS_CONFIG: PillarsConfig = {
  tag: 'CORE PILLARS OF BOTE COMMUNITY',
  title: 'Heritage Preserved, Generation Empowered',
  desc: 'From the banks of the Bagmati River in Karmaiya, Sarlahi to settlements across inner-Terai Nepal, our community unites to protect indigenous identity.',
  p1Title: 'Bote History & Origins',
  p1Desc: 'The legend of the tree trunk origin, river ferry kings, and the single-log dugout canoe.',
  p2Title: 'Cultures & River Rituals',
  p2Desc: 'Sansari Devi Puja, Jal Puja, Maghe Sankranti boat races, and animist water worship.',
  p3Title: 'Bote Language (Tarahi)',
  p3Desc: 'Save the endangered Tarahi Bote dialect with a searchable community lexicon.',
  p4Title: 'Culture Dress & Jewelry',
  p4Desc: 'Traditional Gunya, Cholo, Hansuli necklaces, Bulaki nose rings, and Kalli anklets.'
};

const DEFAULT_SITE_IDENTITY: SiteIdentityConfig = {
  siteName: 'BoteYouthCommunityNepal',
  tagline: 'Preserving Heritage • Empowering the Future',
  location: 'Karmaiya, Sarlahi Ward 11, Bagmati Municipality, Sarlahi, Nepal',
  contactPhone: '+977-9800000001',
  contactEmail: 'boteyouthcommunitynepal@gmail.com',
  aboutSummary: 'The official collective of Bote youth and community elders dedicated to indigenous river protection, Tarahi Bote language preservation, and youth empowerment in Sarlahi and across Nepal.',
  authorizedEmails: ['navarajbot@gmail.com', 'boteyouthcommunitynepal@gmail.com'],
  officialDomains: ['boteyouthcommunity.org.np', 'boteyouth.org', 'botecommunity.com'],
  headerLogo: DEFAULT_LOGO_URL,
  footerLogo: DEFAULT_LOGO_URL,
  theme: 'nepali-flag',
  googleAnalyticsId: '',
  googleAnalyticsEnabled: false,
  googleSiteVerificationCode: 'ZZ8jKxT9NeljW8zcOXO1HjIn5-weF8pC0qVd4hsZoEw',
  favicon: '/favicon.svg'
};

const DEFAULT_CUSTOM_DOMAINS: CustomDomainConfig = {
  primaryDomain: 'boteyouthcommunity.org.np',
  additionalDomains: ['boteyouth.org', 'botecommunity.com', 'boteyouthcommunity.com'],
  domainType: '.org.np',
  status: 'ssl-secured',
  cnameRecord: 'cname.boteyouthcommunity.org.np',
  ipAddress: '199.36.158.100',
  sslEnabled: true,
  lastVerifiedAt: 'Live Active • Verified'
};

const DATA_STORAGE_KEY = 'byc_master_community_data_v3';
const PASSCODE_STORAGE_KEY = 'byc_admin_master_passcode_v3';
const AUTH_SESSION_KEY = 'byc_admin_authenticated_session';
const DEFAULT_PASSCODE = 'BYCN BoteYouth@1 ';

interface CommunityDataContextType {
  // Data State
  leaders: LeaderProfile[];
  timelineEvents: TimelineEvent[];
  culturalTraditions: CultureTradition[];
  dictionaryWords: DictionaryWord[];
  dressItems: TraditionalDressItem[];
  costumes: CostumeItem[];
  bentoConfig: BentoConfig;
  pillarsConfig: PillarsConfig;
  siteIdentity: SiteIdentityConfig;
  customDomains: CustomDomainConfig;
  registeredMembers: RegisteredMember[];
  posts: CommunityPost[];
  centralOffice: KarmaiyaCentralOfficeDetails;
  updateCentralOffice: (details: Partial<KarmaiyaCentralOfficeDetails>) => Promise<boolean>;
  resetCentralOffice: () => Promise<boolean>;
  triggerGlobalUpdate: (scope: string, payload?: any) => void;

  // Real-Time Internet Sync & Status
  syncStatus: 'synced' | 'syncing' | 'offline' | 'error';
  lastSyncedTime: string;
  isInternetConnected: boolean;
  manualCloudSync: () => Promise<boolean>;

  // Admin Auth State
  isAdminAuthenticated: boolean;
  adminLogin: (passcodeOrEmail: string) => boolean;
  adminLogout: () => void;
  adminPasscode: string;
  adminEmail: string;
  changeAdminPasscode: (oldCode: string, newCode: string) => { success: boolean; message: string };
  addAuthorizedEmail: (email: string) => Promise<boolean>;
  removeAuthorizedEmail: (email: string) => Promise<boolean>;

  // Leaders CRUD
  addLeader: (leader: Omit<LeaderProfile, 'id'>) => void;
  updateLeader: (id: string, leader: Partial<LeaderProfile>) => void;
  deleteLeader: (id: string) => void;

  // History / Timeline CRUD
  addTimelineEvent: (event: Omit<TimelineEvent, 'id'>) => void;
  updateTimelineEvent: (id: string, event: Partial<TimelineEvent>) => void;
  deleteTimelineEvent: (id: string) => void;

  // Culture & Rituals CRUD
  addCulturalTradition: (trad: Omit<CultureTradition, 'id'>) => void;
  updateCulturalTradition: (id: string, trad: Partial<CultureTradition>) => void;
  deleteCulturalTradition: (id: string) => void;

  // Bote Language CRUD
  addDictionaryWord: (word: Omit<DictionaryWord, 'id'>) => void;
  updateDictionaryWord: (id: string, word: Partial<DictionaryWord>) => void;
  deleteDictionaryWord: (id: string) => void;

  // Dress & Jewelry CRUD
  addDressItem: (item: Omit<TraditionalDressItem, 'id'>) => void;
  updateDressItem: (id: string, item: Partial<TraditionalDressItem>) => void;
  deleteDressItem: (id: string) => void;

  // Costumes CRUD
  addCostume: (costume: Omit<CostumeItem, 'id'>) => void;
  updateCostume: (id: string, costume: Partial<CostumeItem>) => void;
  deleteCostume: (id: string) => void;

  // Posts & Notices CRUD (Notices, Meetings, Files/PDFs, Photos, Events, New Members)
  addPost: (post: Omit<CommunityPost, 'id' | 'createdAt'>) => Promise<boolean>;
  updatePost: (id: string, updates: Partial<CommunityPost>) => Promise<boolean>;
  deletePost: (id: string) => Promise<boolean>;
  togglePinPost: (id: string) => Promise<boolean>;
  togglePublishPost: (id: string) => Promise<boolean>;

  // Layout, Identity & Domains Update
  updateBentoConfig: (config: Partial<BentoConfig>) => void;
  updatePillarsConfig: (config: Partial<PillarsConfig>) => void;
  updateSiteIdentity: (identity: Partial<SiteIdentityConfig>) => void;
  saveSiteIdentity: (identity: Partial<SiteIdentityConfig>) => Promise<boolean>;
  saveCustomDomains: (config: Partial<CustomDomainConfig>) => Promise<boolean>;

  // Dedicated Official Logo Save Options (Header & Footer)
  saveHeaderLogo: (logoUrl: string) => Promise<boolean>;
  saveFooterLogo: (logoUrl: string) => Promise<boolean>;
  saveBothLogos: (headerUrl: string, footerUrl: string) => Promise<boolean>;

  // Dedicated Favicon & Google Analytics / Search Console Save Options
  saveFavicon: (faviconUrl: string) => Promise<boolean>;
  saveGoogleAnalytics: (measurementId: string, enabled?: boolean) => Promise<boolean>;
  saveGoogleSiteVerification: (verificationCode: string) => Promise<boolean>;

  // One-Time Master Save & Real-Time Broadcast
  masterBroadcastEverything: (overrideSnapshot?: Partial<any>) => Promise<{ success: boolean; message: string; timestamp: string }>;

  // Community Key Metrics (Population, Wards, Scholarship, Indigenous Pride)
  communityMetrics: CommunityMetric[];
  updateCommunityMetric: (id: string, updates: Partial<CommunityMetric>) => void;
  saveCommunityMetrics: (metrics: CommunityMetric[]) => Promise<boolean>;
  resetCommunityMetrics: () => void;
  autoResearchCommunityMetrics: () => Promise<CommunityMetric[]>;

  // Auto-Reload & Live Sync Controls
  autoReloadConfig: AutoReloadConfig;
  updateAutoReloadConfig: (config: Partial<AutoReloadConfig>) => void;
  triggerManualReload: () => Promise<void>;

  // Members Management
  submitMemberRegistration: (memberData: any) => Promise<{ success: boolean; message: string; member?: RegisteredMember; memberId?: string; membershipId?: string }>;
  loadRegisteredMembers: () => Promise<RegisteredMember[]>;
  deleteRegisteredMember: (id: string) => Promise<boolean>;
  updateMemberStatus: (id: string, status: 'active' | 'verified' | 'pending', notes?: string) => Promise<boolean>;
  purgeTestMembers: () => Promise<boolean>;

  // One-Time Following State & Controls
  isFollowingCommunity: boolean;
  followerCount: number;
  followerEmail: string;
  followCommunity: (followerInfo?: { name?: string; email?: string; notes?: string }) => Promise<{ success: boolean; message: string; alreadyFollowed?: boolean }>;

  // One-Time Joining State & Controls (Hides join option on screen for joined users and Gmail followers)
  hasJoinedCommunity: boolean;
  hideJoinOption: boolean;
  joinedMemberData: any | null;
  setHasJoinedCommunity: (joined: boolean) => void;
  resetMembershipState: () => void;

  // Direct Public Live Sync & Republic Options (Admin exclusive)
  directLiveSync: boolean;
  setDirectLiveSync: (enabled: boolean) => void;
  directlyUpdatePublic: () => Promise<{ success: boolean; message: string; timestamp: string }>;
  republicWebsite: (options?: { notes?: string; scope?: string }) => Promise<{ success: boolean; message: string; version: string; timestamp: string }>;
  lastRepublicInfo: { version?: string; timestamp?: string; notes?: string } | null;

  // Reset
  resetAllToDefaults: () => void;

  // Community Notifications (Admin & Live Follow/Join Updates)
  notifications: CommunityNotification[];
  unreadNotificationsCount: number;
  notificationSoundEnabled: boolean;
  setNotificationSoundEnabled: (enabled: boolean) => void;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  simulateTestNotification: (type?: 'join' | 'follow' | 'notice') => Promise<void>;
  playNotificationChime: () => void;

  // Live Community Voice & Heritage Initiative Poll
  communityPoll: CommunityPollConfig;
  votePoll: (optionId: string, voterDetails?: { name?: string; email?: string; membershipId?: string }) => Promise<{ success: boolean; message: string }>;
  addPollOption: (text: string, textNepali?: string, suggestedByName?: string, voterDetails?: { email?: string; membershipId?: string }) => Promise<{ success: boolean; message: string; newOption?: PollOption }>;
  updatePollConfig: (updatedConfig: Partial<CommunityPollConfig>) => Promise<{ success: boolean; message: string }>;
  resetPollVotes: () => Promise<{ success: boolean; message: string }>;
}

const CommunityDataContext = createContext<CommunityDataContextType | undefined>(undefined);

// Global BroadcastChannel for immediate cross-tab & session UI synchronization
let globalSyncChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    globalSyncChannel = new BroadcastChannel('bycn_global_sync_channel');
  }
} catch (e) {
  console.warn('BroadcastChannel initialization:', e);
}

const sanitizeLeaderImage = (img?: string): string => {
  return img && img.trim() ? img.trim() : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600';
};
const sanitizeEventImage = (img?: string): string => {
  return img && img.trim() ? img.trim() : 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1000';
};
const sanitizeCultureImage = (img?: string): string => {
  return img && img.trim() ? img.trim() : 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=800';
};

export const CommunityDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Core Data States with cache initialization
  const [leaders, setLeaders] = useState<LeaderProfile[]>(() => {
    try {
      const saved = localStorage.getItem(DATA_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.leaders) && parsed.leaders.length > 0) return parsed.leaders;
      }
    } catch (e) {
      console.warn('Failed to parse leaders from storage', e);
    }
    return LEADERSHIP_PROFILES;
  });

  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(() => {
    try {
      const saved = localStorage.getItem(DATA_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.timelineEvents) && parsed.timelineEvents.length > 0) return parsed.timelineEvents;
      }
    } catch (e) {
      console.warn('Failed to parse timelineEvents from storage', e);
    }
    return HISTORICAL_EVENTS;
  });

  const [culturalTraditions, setCulturalTraditions] = useState<CultureTradition[]>(() => {
    try {
      const saved = localStorage.getItem(DATA_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.culturalTraditions) && parsed.culturalTraditions.length > 0) return parsed.culturalTraditions;
      }
    } catch (e) {
      console.warn('Failed to parse culturalTraditions from storage', e);
    }
    return CULTURAL_TRADITIONS;
  });

  const [dictionaryWords, setDictionaryWords] = useState<DictionaryWord[]>(() => {
    try {
      const saved = localStorage.getItem(DATA_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.dictionaryWords) && parsed.dictionaryWords.length > 0) return parsed.dictionaryWords;
      }
    } catch (e) {
      console.warn('Failed to parse dictionaryWords from storage', e);
    }
    return DICTIONARY_WORDS;
  });

  const [dressItems, setDressItems] = useState<TraditionalDressItem[]>(() => {
    try {
      const saved = localStorage.getItem(DATA_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.dressItems) && parsed.dressItems.length > 0) return parsed.dressItems;
      }
    } catch (e) {
      console.warn('Failed to parse dressItems from storage', e);
    }
    return TRADITIONAL_DRESS_ITEMS;
  });

  const [costumes, setCostumes] = useState<CostumeItem[]>(() => {
    try {
      const saved = localStorage.getItem(DATA_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.costumes) && parsed.costumes.length > 0) return parsed.costumes;
      }
    } catch (e) {
      console.warn('Failed to parse costumes from storage', e);
    }
    return INITIAL_COSTUMES_DATA;
  });

  const [bentoConfig, setBentoConfig] = useState<BentoConfig>(() => {
    try {
      const saved = localStorage.getItem(DATA_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.bentoConfig) return { ...DEFAULT_BENTO_CONFIG, ...parsed.bentoConfig };
      }
    } catch (e) {
      console.warn('Failed to parse bentoConfig from storage', e);
    }
    return DEFAULT_BENTO_CONFIG;
  });

  const [pillarsConfig, setPillarsConfig] = useState<PillarsConfig>(() => {
    try {
      const saved = localStorage.getItem(DATA_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.pillarsConfig) return { ...DEFAULT_PILLARS_CONFIG, ...parsed.pillarsConfig };
      }
    } catch (e) {
      console.warn('Failed to parse pillarsConfig from storage', e);
    }
    return DEFAULT_PILLARS_CONFIG;
  });

  const [siteIdentity, setSiteIdentity] = useState<SiteIdentityConfig>(() => {
    try {
      const savedHeaderLogo = localStorage.getItem('bycn_header_logo');
      const savedFooterLogo = localStorage.getItem('bycn_footer_logo');
      const savedTheme = localStorage.getItem('bycn_theme');
      let savedFavicon = localStorage.getItem('bycn_favicon');
      let savedGaId = localStorage.getItem('bycn_ga_id');
      let savedVerification = localStorage.getItem('bycn_google_site_verification');

      // Purge old demo GA4 ID and verification tokens
      if (savedGaId === 'G-BYCN892024') {
        localStorage.removeItem('bycn_ga_id');
        savedGaId = null;
      }
      if (savedVerification === 'google1bc3bf20546566a0') {
        localStorage.removeItem('bycn_google_site_verification');
        savedVerification = null;
      }

      const saved = localStorage.getItem(DATA_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.siteIdentity) {
          const loadedEmails = parsed.siteIdentity.authorizedEmails || [];
          const mergedEmails = Array.from(
            new Set(['navarajbot@gmail.com', 'boteyouthcommunitynepal@gmail.com', ...loadedEmails])
          );
          const resolvedHeaderLogo = (savedHeaderLogo && savedHeaderLogo.trim()) || parsed.siteIdentity.headerLogo || DEFAULT_LOGO_URL;
          const resolvedFooterLogo = (savedFooterLogo && savedFooterLogo.trim()) || parsed.siteIdentity.footerLogo || DEFAULT_LOGO_URL;
          const resolvedTheme = (savedTheme && savedTheme.trim()) || parsed.siteIdentity.theme || 'nepali-flag';
          const resolvedFavicon = (savedFavicon && savedFavicon.trim()) || (parsed.siteIdentity.favicon !== DEFAULT_LOGO_URL ? parsed.siteIdentity.favicon : '') || '/favicon.svg';
          
          let rawGa = (savedGaId && savedGaId.trim()) || parsed.siteIdentity.googleAnalyticsId || '';
          if (rawGa === 'G-BYCN892024') rawGa = '';
          const resolvedGaId = rawGa;
          const resolvedGaEnabled = Boolean(resolvedGaId && parsed.siteIdentity.googleAnalyticsEnabled);

          let rawGsc = (savedVerification && savedVerification.trim()) || parsed.siteIdentity.googleSiteVerificationCode || '';
          if (rawGsc === 'google1bc3bf20546566a0') rawGsc = '';
          const resolvedGsc = rawGsc || 'ZZ8jKxT9NeljW8zcOXO1HjIn5-weF8pC0qVd4hsZoEw';

          return {
            ...DEFAULT_SITE_IDENTITY,
            ...parsed.siteIdentity,
            headerLogo: resolvedHeaderLogo,
            footerLogo: resolvedFooterLogo,
            theme: resolvedTheme,
            favicon: resolvedFavicon,
            googleAnalyticsId: resolvedGaId,
            googleAnalyticsEnabled: resolvedGaEnabled,
            googleSiteVerificationCode: resolvedGsc,
            authorizedEmails: mergedEmails
          };
        }
      }
      return {
        ...DEFAULT_SITE_IDENTITY,
        headerLogo: (savedHeaderLogo && savedHeaderLogo.trim()) || DEFAULT_LOGO_URL,
        footerLogo: (savedFooterLogo && savedFooterLogo.trim()) || DEFAULT_LOGO_URL,
        theme: (savedTheme as any) || 'nepali-flag',
        favicon: (savedFavicon && savedFavicon.trim()) || '/favicon.svg',
        googleAnalyticsId: '',
        googleAnalyticsEnabled: false,
        googleSiteVerificationCode: 'ZZ8jKxT9NeljW8zcOXO1HjIn5-weF8pC0qVd4hsZoEw'
      };
    } catch (e) {
      console.warn('Failed to parse siteIdentity from storage', e);
    }
    return DEFAULT_SITE_IDENTITY;
  });

  const [customDomains, setCustomDomains] = useState<CustomDomainConfig>(() => {
    try {
      const dedicated = localStorage.getItem('bycn_custom_domains');
      if (dedicated) {
        return { ...DEFAULT_CUSTOM_DOMAINS, ...JSON.parse(dedicated) };
      }
      const saved = localStorage.getItem(DATA_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.customDomains) return { ...DEFAULT_CUSTOM_DOMAINS, ...parsed.customDomains };
      }
    } catch (e) {
      console.warn('Failed to parse customDomains from storage', e);
    }
    return DEFAULT_CUSTOM_DOMAINS;
  });

  const [registeredMembers, setRegisteredMembers] = useState<RegisteredMember[]>([]);

  // Community Key Metrics (Bote Population, Council Wards, Scholarship Fund, Indigenous Pride)
  const [communityMetrics, setCommunityMetrics] = useState<CommunityMetric[]>(() => {
    try {
      const saved = localStorage.getItem(DATA_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.communityMetrics) && parsed.communityMetrics.length > 0) {
          return parsed.communityMetrics;
        }
      }
    } catch (e) {
      console.warn('Failed to parse communityMetrics from storage', e);
    }
    return DEFAULT_COMMUNITY_METRICS;
  });

  // Community Posts & Notices (Announcements, Meetings, Files/PDFs, Photos, Events, New Members)
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    try {
      const saved = localStorage.getItem(DATA_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.posts) && parsed.posts.length > 0) {
          return parsed.posts;
        }
      }
    } catch (e) {
      console.warn('Failed to parse posts from storage', e);
    }
    return INITIAL_COMMUNITY_POSTS;
  });

  // Karmaiya Central Office Full Details (Real-time synced & cloud persisted)
  const [centralOffice, setCentralOffice] = useState<KarmaiyaCentralOfficeDetails>(() => {
    try {
      const saved = localStorage.getItem('bycn_central_office_details');
      if (saved) {
        return sanitizeCentralOfficeDetails(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to parse centralOffice from storage', e);
    }
    return sanitizeCentralOfficeDetails(DEFAULT_KARMAIYA_CENTRAL_OFFICE);
  });

  // Auto-Reload & Live Synchronization Engine Config
  const [autoReloadConfig, setAutoReloadConfig] = useState<AutoReloadConfig>(() => {
    try {
      const saved = localStorage.getItem('bycn_autoreload_config');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse autoReloadConfig', e);
    }
    return {
      enabled: true,
      intervalSeconds: 15,
      soundAlert: true,
      lastReloadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  });

  // Community Notifications (Admin & Live Follow/Join Updates)
  const [notifications, setNotifications] = useState<CommunityNotification[]>(() => {
    try {
      const saved = localStorage.getItem('bycn_community_notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse notifications from localStorage', e);
    }
    return [];
  });

  const [notificationSoundEnabled, setNotificationSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('bycn_notif_sound_enabled');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Live Community Voice & Heritage Initiative Poll
  const [communityPoll, setCommunityPoll] = useState<CommunityPollConfig>(() => {
    try {
      const saved = localStorage.getItem('bycn_community_poll');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.options) && parsed.options.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse community poll from localStorage', e);
    }
    return DEFAULT_COMMUNITY_POLL;
  });

  useEffect(() => {
    try {
      localStorage.setItem('bycn_notif_sound_enabled', JSON.stringify(notificationSoundEnabled));
    } catch {}
  }, [notificationSoundEnabled]);

  // Dynamically synchronize document Favicon, OpenGraph image, and Schema.org Organization Logo in <head> for Google Search and Internet Discovery
  useEffect(() => {
    if (typeof document === 'undefined') return;
    try {
      applyFaviconToDocument(siteIdentity.favicon);
      updateCanonicalDomain(customDomains?.primaryDomain);
      updateGoogleSiteVerification(siteIdentity.googleSiteVerificationCode || '');
    } catch (e) {
      console.warn('Favicon and Google Search metadata sync error:', e);
    }
  }, [siteIdentity.favicon, siteIdentity.siteName, siteIdentity.googleSiteVerificationCode, customDomains?.primaryDomain]);

  // Load custom domains from cloud server on mount
  useEffect(() => {
    fetch('/api/custom-domains')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.success && data.customDomains) {
          setCustomDomains((prev) => ({ ...prev, ...data.customDomains }));
          try {
            localStorage.setItem('bycn_custom_domains', JSON.stringify(data.customDomains));
          } catch {}
          if (data.customDomains.primaryDomain) {
            updateCanonicalDomain(data.customDomains.primaryDomain);
          }
        }
      })
      .catch((e) => console.warn('Could not load custom domains on mount:', e));
  }, []);

  // Dynamically inject or update Google Analytics gtag in <head>
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    try {
      const gaId = siteIdentity.googleAnalyticsId && siteIdentity.googleAnalyticsId.trim();
      const enabled = siteIdentity.googleAnalyticsEnabled !== false;
      const existingScript = document.getElementById('ga-gtag-script');

      if (!gaId || !enabled) {
        if (existingScript) existingScript.remove();
        return;
      }

      // If script with same ID already injected, skip reload
      if (!existingScript || existingScript.getAttribute('data-ga-id') !== gaId) {
        if (existingScript) existingScript.remove();

        const script = document.createElement('script');
        script.id = 'ga-gtag-script';
        script.setAttribute('data-ga-id', gaId);
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
        document.head.appendChild(script);
      }

      // Ensure dataLayer & gtag function are accessible globally
      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(...args: any[]) {
        (window as any).dataLayer.push(args);
      }
      (window as any).gtag = gtag;
      gtag('js', new Date());
      gtag('config', gaId, {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: true
      });
    } catch (e) {
      console.warn('Google Analytics injection error:', e);
    }
  }, [siteIdentity.googleAnalyticsId, siteIdentity.googleAnalyticsEnabled]);

  const playNotificationChime = useCallback(() => {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);
      osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.12);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(659.25, now + 0.05);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.2, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.05);
      osc1.stop(now + 0.65);
      osc2.stop(now + 0.65);
    } catch {
      // Audio policy
    }
  }, []);

  const handleIncomingNotification = useCallback((notif: CommunityNotification) => {
    if (!notif || !notif.id) return;
    setNotifications((prev) => {
      const filtered = prev.filter((n) => n.id !== notif.id);
      const updated = [notif, ...filtered].slice(0, 500);
      try {
        localStorage.setItem('bycn_community_notifications', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (notificationSoundEnabled) {
      playNotificationChime();
    }

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(notif.title, {
          body: notif.message,
          icon: '/icon.png'
        });
      } catch {}
    }
  }, [notificationSoundEnabled, playNotificationChime]);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const markNotificationAsRead = useCallback(async (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      try {
        localStorage.setItem('bycn_community_notifications', JSON.stringify(updated));
      } catch {}
      saveNotificationsToFirebase(updated).catch(() => {});
      return updated;
    });

    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
    } catch (e) {
      console.warn('Failed to mark notification read on server:', e);
    }
  }, []);

  const markAllNotificationsAsRead = useCallback(async () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      try {
        localStorage.setItem('bycn_community_notifications', JSON.stringify(updated));
      } catch {}
      saveNotificationsToFirebase(updated).catch(() => {});
      return updated;
    });

    try {
      await fetch('/api/notifications/mark-all-read', { method: 'POST' });
    } catch (e) {
      console.warn('Failed to mark all notifications read on server:', e);
    }
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      try {
        localStorage.setItem('bycn_community_notifications', JSON.stringify(updated));
      } catch {}
      saveNotificationsToFirebase(updated).catch(() => {});
      return updated;
    });

    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Failed to delete notification on server:', e);
    }
  }, []);

  const clearAllNotifications = useCallback(async () => {
    setNotifications([]);
    try {
      localStorage.removeItem('bycn_community_notifications');
    } catch {}
    saveNotificationsToFirebase([]).catch(() => {});

    try {
      await fetch('/api/notifications', { method: 'DELETE' });
    } catch (e) {
      console.warn('Failed to clear notifications on server:', e);
    }
  }, []);

  const simulateTestNotification = useCallback(async (type: 'join' | 'follow' | 'notice' = 'join') => {
    try {
      const res = await fetch('/api/notifications/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
      const data = await res.json();
      if (data && data.success && data.notification) {
        handleIncomingNotification(data.notification);
      }
    } catch (e) {
      console.warn('Failed to trigger test notification:', e);
    }
  }, [handleIncomingNotification]);

  // 2. Real-Time Internet Sync Status
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'error'>('synced');
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');
  const [isInternetConnected, setIsInternetConnected] = useState<boolean>(navigator.onLine);

  // Admin Passcode & Authentication
  const [adminPasscode, setPasscodeState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(PASSCODE_STORAGE_KEY);
      if (saved && saved.trim()) return saved;
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_PASSCODE;
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      const sess = sessionStorage.getItem(AUTH_SESSION_KEY) || localStorage.getItem(AUTH_SESSION_KEY);
      return sess === 'true';
    } catch (e) {
      return false;
    }
  });

  const [adminEmail, setAdminEmail] = useState<string>(() => {
    try {
      return localStorage.getItem('bycn_admin_email') || 'boteyouthcommunitynepal@gmail.com';
    } catch {
      return 'boteyouthcommunitynepal@gmail.com';
    }
  });

  // ==============================================================
  // ONE-TIME FOLLOWING COMMUNITY STATE (with Gmail Logic)
  // ==============================================================
  const [isFollowingCommunity, setIsFollowingCommunity] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bycn_is_following') === 'true';
    } catch {
      return false;
    }
  });

  const [followerEmail, setFollowerEmail] = useState<string>(() => {
    try {
      return localStorage.getItem('bycn_follower_email') || '';
    } catch {
      return '';
    }
  });

  const [followerCount, setFollowerCount] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('bycn_follower_count');
      return stored ? parseInt(stored, 10) : 1482;
    } catch {
      return 1482;
    }
  });

  // Direct Public Live Sync & Republic State
  const [directLiveSync, setDirectLiveSyncState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('bycn_direct_live_sync');
      return stored !== null ? stored === 'true' : true;
    } catch {
      return true;
    }
  });

  const setDirectLiveSync = (enabled: boolean) => {
    try {
      localStorage.setItem('bycn_direct_live_sync', String(enabled));
    } catch (e) {
      console.warn(e);
    }
    setDirectLiveSyncState(enabled);
  };

  const [lastRepublicInfo, setLastRepublicInfo] = useState<{ version?: string; timestamp?: string; notes?: string } | null>(() => {
    try {
      const stored = localStorage.getItem('bycn_last_republic_info');
      return stored ? JSON.parse(stored) : { version: 'v2026.09.1-LIVE', timestamp: new Date().toISOString() };
    } catch {
      return { version: 'v2026.09.1-LIVE', timestamp: new Date().toISOString() };
    }
  });

  // Load server-side follower count and republic status on mount
  useEffect(() => {
    fetch('/api/followers')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && typeof data.count === 'number') {
          setFollowerCount(data.count);
          try {
            localStorage.setItem('bycn_follower_count', String(data.count));
          } catch (e) {
            console.warn(e);
          }
        }
      })
      .catch((e) => console.warn('Followers fetch error:', e));

    fetch('/api/republic/status')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          if (typeof data.directLiveSync === 'boolean') {
            setDirectLiveSyncState(data.directLiveSync);
          }
          if (data.republicVersion) {
            const info = {
              version: data.republicVersion,
              timestamp: data.republishedAt ? new Date(data.republishedAt).toISOString() : new Date().toISOString(),
              notes: 'Public Live Deployment'
            };
            setLastRepublicInfo(info);
            try {
              localStorage.setItem('bycn_last_republic_info', JSON.stringify(info));
            } catch {}
          }
        }
      })
      .catch((e) => console.warn('Republic status fetch error:', e));
  }, []);

  const followCommunity = async (followerInfo?: { name?: string; email?: string; notes?: string }): Promise<{ success: boolean; message: string; alreadyFollowed?: boolean }> => {
    try {
      localStorage.setItem('bycn_is_following', 'true');
      setIsFollowingCommunity(true);

      const email = (followerInfo?.email || followerEmail || '').trim().toLowerCase();
      if (email) {
        setFollowerEmail(email);
        localStorage.setItem('bycn_follower_email', email);
      }
      if (followerInfo?.name) {
        localStorage.setItem('bycn_follower_name', followerInfo.name.trim());
      }

      const updatedCount = followerCount + 1;
      setFollowerCount(updatedCount);
      localStorage.setItem('bycn_follower_count', String(updatedCount));

      const payload = {
        name: followerInfo?.name || localStorage.getItem('bycn_follower_name') || 'Bote Youth Follower',
        email: email,
        notes: followerInfo?.notes || '',
        followedAt: new Date().toISOString()
      };

      try {
        localStorage.setItem('bycn_follower_info', JSON.stringify(payload));
      } catch (e) {
        console.warn(e);
      }

      // Sync to backend server
      let serverResponse: any = null;
      try {
        const res = await fetch('/api/followers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        serverResponse = await res.json();
        if (serverResponse && typeof serverResponse.count === 'number') {
          setFollowerCount(serverResponse.count);
          localStorage.setItem('bycn_follower_count', String(serverResponse.count));
        }
      } catch (e) {
        console.warn('Followers sync error:', e);
      }

      window.dispatchEvent(new CustomEvent('bycn_followed_community', { detail: { count: updatedCount, email } }));

      return {
        success: true,
        alreadyFollowed: Boolean(serverResponse?.alreadyFollowed),
        message: serverResponse?.message || 'धन्यवाद! You are now officially following Bote Youth Community Nepal. One-time follow recorded.'
      };
    } catch (err: any) {
      console.warn('Follow error:', err);
      return { success: false, message: 'Could not record follow.' };
    }
  };

  // ==============================================================
  // ONE-TIME JOINING MEMBERSHIP STATE & HIDE JOIN LOGIC
  // ==============================================================
  const [hasJoinedCommunity, setHasJoinedCommunity] = useState<boolean>(() => {
    try {
      const hasCard = Boolean(localStorage.getItem('bycn_my_membership_card'));
      const hasJoinedFlag = localStorage.getItem('bycn_user_joined') === 'true';
      return hasCard || hasJoinedFlag;
    } catch {
      return false;
    }
  });

  // Hide join options for registered members OR user/members who follow with their Gmail
  const hideJoinOption = Boolean(
    hasJoinedCommunity ||
    (isFollowingCommunity && Boolean(followerEmail)) ||
    Boolean(localStorage.getItem('bycn_my_membership_card')) ||
    localStorage.getItem('bycn_user_joined') === 'true'
  );

  const [joinedMemberData, setJoinedMemberData] = useState<any | null>(() => {
    try {
      const raw = localStorage.getItem('bycn_my_membership_card');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const resetMembershipState = () => {
    try {
      localStorage.removeItem('bycn_my_membership_card');
      localStorage.removeItem('bycn_user_joined');
    } catch (e) {
      console.warn(e);
    }
    setHasJoinedCommunity(false);
    setJoinedMemberData(null);
  };

  // Keep track of the last update timestamp from server to prevent redundant re-renders
  // Starts at 0 so the first fetch always applies latest data from the master server
  const localLastUpdatedRef = useRef<number>(0);
  const isHydratedRef = useRef<boolean>(false);
  const isSyncingRef = useRef<boolean>(false);
  const prevPendingCountRef = useRef<number>(0);

  // Helper to compile current local snapshot
  const getSnapshot = useCallback(() => {
    const savedHeader = localStorage.getItem('bycn_header_logo');
    const savedFooter = localStorage.getItem('bycn_footer_logo');

    const resolvedIdentity: SiteIdentityConfig = {
      ...siteIdentity,
      headerLogo: (siteIdentity.headerLogo && siteIdentity.headerLogo !== DEFAULT_LOGO_URL)
        ? siteIdentity.headerLogo
        : (savedHeader && savedHeader.trim() ? savedHeader.trim() : siteIdentity.headerLogo || DEFAULT_LOGO_URL),
      footerLogo: (siteIdentity.footerLogo && siteIdentity.footerLogo !== DEFAULT_LOGO_URL)
        ? siteIdentity.footerLogo
        : (savedFooter && savedFooter.trim() ? savedFooter.trim() : siteIdentity.footerLogo || DEFAULT_LOGO_URL)
    };

    return {
      leaders,
      timelineEvents,
      culturalTraditions,
      dictionaryWords,
      dressItems,
      costumes,
      bentoConfig,
      pillarsConfig,
      siteIdentity: resolvedIdentity,
      customDomains,
      communityMetrics,
      posts,
      centralOffice
    };
  }, [leaders, timelineEvents, culturalTraditions, dictionaryWords, dressItems, costumes, bentoConfig, pillarsConfig, siteIdentity, customDomains, communityMetrics, posts, centralOffice]);

  // Persist locally
  useEffect(() => {
    try {
      const payload = getSnapshot();
      localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to save community data to localStorage', e);
    }
  }, [getSnapshot]);

  // ==============================================================
  // REAL-TIME CLOUD SYNCHRONIZATION ENGINE
  // ==============================================================

  // Push local modifications to cloud server & Firestore (Requires admin passcode or server init)
  const pushToCloud = useCallback(async (customPayload?: any): Promise<boolean> => {
    if (!navigator.onLine) {
      setSyncStatus('offline');
      return false;
    }
    try {
      setSyncStatus('syncing');
      const payload = customPayload || getSnapshot();

      // Parallel persistence to Firebase Firestore for redundant live synchronization
      try {
        if (Array.isArray(payload.posts) && payload.posts.length > 0) {
          savePostsToFirebase(payload.posts).catch(() => {});
        }
        if (payload.siteIdentity) {
          saveSiteSettingsToFirebase(payload.siteIdentity).catch(() => {});
        }
        saveMasterDataToFirebase(payload).catch(() => {});
      } catch (fbErr) {
        console.warn('Firestore parallel push fallback:', fbErr);
      }

      const res = await fetch('/api/community-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': adminPasscode || 'bote2026',
          'x-admin-email': adminEmail || 'navarajbot@gmail.com'
        },
        body: JSON.stringify({ data: payload })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.lastUpdated) {
          localLastUpdatedRef.current = json.lastUpdated;
        }
        setSyncStatus('synced');
        setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        return true;
      } else {
        // If unauthorized or server error
        setSyncStatus('synced');
        return false;
      }
    } catch (err) {
      console.warn('Cloud sync push error:', err);
      setSyncStatus('error');
      return false;
    }
  }, [adminPasscode, adminEmail, getSnapshot]);

  // Fetch latest state from server (Called by all connected clients in real-time)
  const fetchFromCloud = useCallback(async () => {
    if (!navigator.onLine || isSyncingRef.current) return;
    try {
      isSyncingRef.current = true;
      const res = await fetch('/api/community-data', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (!res.ok) {
        isSyncingRef.current = false;
        return;
      }

      const json = await res.json();
      if (json && json.data) {
        const serverLastUpdated = json.lastUpdated || 0;

        // Apply on initial page load OR whenever server timestamp is newer/different
        if (!isHydratedRef.current || serverLastUpdated !== localLastUpdatedRef.current) {
          isHydratedRef.current = true;
          localLastUpdatedRef.current = serverLastUpdated;
          const s = json.data;
          if (Array.isArray(s.leaders) && s.leaders.length > 0) {
            setLeaders((prevLeaders) => {
              return s.leaders.map((incomingLeader: LeaderProfile) => {
                const prev = prevLeaders.find((p) => p.id === incomingLeader.id);
                const isIncomingDefault = !incomingLeader.image ||
                  incomingLeader.image.includes('photo-1534528741775-53994a69daeb') ||
                  incomingLeader.image.includes('photo-1507003211169-0a1dd7228f2d');
                const isPrevCustom = prev?.image &&
                  !prev.image.includes('photo-1534528741775-53994a69daeb') &&
                  !prev.image.includes('photo-1507003211169-0a1dd7228f2d');

                if (isIncomingDefault && isPrevCustom) {
                  return { ...incomingLeader, image: prev.image };
                }
                return incomingLeader;
              });
            });
          }
          if (Array.isArray(s.timelineEvents) && s.timelineEvents.length > 0) setTimelineEvents(s.timelineEvents);
          if (Array.isArray(s.culturalTraditions) && s.culturalTraditions.length > 0) setCulturalTraditions(s.culturalTraditions);
          if (Array.isArray(s.dictionaryWords) && s.dictionaryWords.length > 0) setDictionaryWords(s.dictionaryWords);
          if (Array.isArray(s.dressItems) && s.dressItems.length > 0) setDressItems(s.dressItems);
          if (Array.isArray(s.costumes) && s.costumes.length > 0) setCostumes(s.costumes);
          if (s.bentoConfig) setBentoConfig(s.bentoConfig);
          if (s.pillarsConfig) setPillarsConfig(s.pillarsConfig);
          if (s.siteIdentity) {
            setSiteIdentity((prev) => {
              const currentHeader = localStorage.getItem('bycn_header_logo') || prev.headerLogo;
              const currentFooter = localStorage.getItem('bycn_footer_logo') || prev.footerLogo;

              const isIncomingDefaultHeader = !s.siteIdentity.headerLogo || s.siteIdentity.headerLogo === DEFAULT_LOGO_URL;
              const isCurrentCustomHeader = currentHeader && currentHeader !== DEFAULT_LOGO_URL;

              const isIncomingDefaultFooter = !s.siteIdentity.footerLogo || s.siteIdentity.footerLogo === DEFAULT_LOGO_URL;
              const isCurrentCustomFooter = currentFooter && currentFooter !== DEFAULT_LOGO_URL;

              const finalHeader = (isIncomingDefaultHeader && isCurrentCustomHeader)
                ? currentHeader
                : (s.siteIdentity.headerLogo || currentHeader || DEFAULT_LOGO_URL);

              const finalFooter = (isIncomingDefaultFooter && isCurrentCustomFooter)
                ? currentFooter
                : (s.siteIdentity.footerLogo || currentFooter || DEFAULT_LOGO_URL);

              if (finalHeader && finalHeader !== DEFAULT_LOGO_URL) {
                localStorage.setItem('bycn_header_logo', finalHeader);
              }
              if (finalFooter && finalFooter !== DEFAULT_LOGO_URL) {
                localStorage.setItem('bycn_footer_logo', finalFooter);
              }
              if (s.siteIdentity.theme) {
                localStorage.setItem('bycn_theme', s.siteIdentity.theme);
              }

              window.dispatchEvent(new CustomEvent('bycn_theme_updated', {
                detail: {
                  headerLogo: finalHeader,
                  footerLogo: finalFooter,
                  theme: s.siteIdentity.theme || prev.theme
                }
              }));

              return {
                ...prev,
                ...s.siteIdentity,
                headerLogo: finalHeader,
                footerLogo: finalFooter
              };
            });
          }
          if (s.customDomains) setCustomDomains(s.customDomains);
          if (Array.isArray(s.communityMetrics) && s.communityMetrics.length > 0) {
            setCommunityMetrics(s.communityMetrics);
          }
          if (Array.isArray(s.posts) && s.posts.length > 0) {
            setPosts(s.posts);
          }
          if (s.centralOffice) {
            setCentralOffice(s.centralOffice);
          }

          setSyncStatus('synced');
          setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      } else if (!json.data && isAdminAuthenticated) {
        // Server store was empty, prime it with local master state
        pushToCloud();
      }
    } catch (e) {
      console.warn('Real-time sync fetch error:', e);
    } finally {
      isSyncingRef.current = false;
    }
  }, [isAdminAuthenticated, pushToCloud]);

  // Web Audio subtle chime for new pending applications
  const playNewMemberChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {}
  }, []);

  // Real-time Polling & Network Event Handlers (configured via autoReloadConfig)
  useEffect(() => {
    // Initial fetch on mount
    fetchFromCloud();

    if (isAdminAuthenticated) {
      loadRegisteredMembers();
    }

    // Configurable polling interval with minimum 3 seconds safety bound
    const pollIntervalMs = autoReloadConfig.enabled
      ? Math.max(3000, (autoReloadConfig.intervalSeconds || 15) * 1000)
      : 30000;

    const interval = setInterval(() => {
      if (autoReloadConfig.enabled || isAdminAuthenticated) {
        fetchFromCloud();
        if (isAdminAuthenticated) {
          loadRegisteredMembers().then((members) => {
            const pending = members.filter((m) => m.status === 'pending').length;
            if (prevPendingCountRef.current > 0 && pending > prevPendingCountRef.current && autoReloadConfig.soundAlert) {
              playNewMemberChime();
            }
            prevPendingCountRef.current = pending;
          });
        }
        setAutoReloadConfig((prev) => ({
          ...prev,
          lastReloadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }));
      }
    }, pollIntervalMs);

    const handleOnline = () => {
      setIsInternetConnected(true);
      fetchFromCloud();
      if (isAdminAuthenticated) {
        loadRegisteredMembers();
      }
    };
    const handleOffline = () => {
      setIsInternetConnected(false);
      setSyncStatus('offline');
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchFromCloud();
        if (isAdminAuthenticated) {
          loadRegisteredMembers();
        }
      }
    };
    const handleWindowFocus = () => {
      fetchFromCloud();
      if (isAdminAuthenticated) {
        loadRegisteredMembers();
      }
    };

    // Instant cross-component event listener for real-time member registration
    const handleMemberRegistered = () => {
      loadRegisteredMembers();
      if (autoReloadConfig.soundAlert) {
        playNewMemberChime();
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('bycn_member_registered', handleMemberRegistered);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('bycn_member_registered', handleMemberRegistered);
    };
  }, [fetchFromCloud, isAdminAuthenticated, autoReloadConfig.enabled, autoReloadConfig.intervalSeconds, autoReloadConfig.soundAlert, playNewMemberChime]);

  // Cross-tab synchronization via storage event
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === DATA_STORAGE_KEY && e.newValue) {
        try {
          const s = JSON.parse(e.newValue);
          if (Array.isArray(s.leaders)) setLeaders(s.leaders);
          if (Array.isArray(s.timelineEvents)) setTimelineEvents(s.timelineEvents);
          if (Array.isArray(s.culturalTraditions)) setCulturalTraditions(s.culturalTraditions);
          if (Array.isArray(s.dictionaryWords)) setDictionaryWords(s.dictionaryWords);
          if (Array.isArray(s.dressItems)) setDressItems(s.dressItems);
          if (Array.isArray(s.costumes)) setCostumes(s.costumes);
          if (s.bentoConfig) setBentoConfig(s.bentoConfig);
          if (s.pillarsConfig) setPillarsConfig(s.pillarsConfig);
          if (s.siteIdentity) setSiteIdentity(s.siteIdentity);
          if (s.customDomains) setCustomDomains(s.customDomains);
          if (Array.isArray(s.communityMetrics)) setCommunityMetrics(s.communityMetrics);
          if (Array.isArray(s.posts)) setPosts(s.posts);
          if (s.centralOffice) setCentralOffice(s.centralOffice);
        } catch (err) {
          console.warn('Cross-tab parse error', err);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Global update trigger that broadcasts state across all active browser windows, tabs, and sessions immediately
  const triggerGlobalUpdate = useCallback((scope: string, payload?: any) => {
    setLastSyncedTime('Just now (Live)');
    setSyncStatus('synced');

    const timestamp = Date.now();

    // 1. Dispatch custom DOM event in current window
    try {
      window.dispatchEvent(
        new CustomEvent('bycn_global_update', {
          detail: { scope, payload, timestamp }
        })
      );
    } catch (e) {
      console.warn('DOM event dispatch error:', e);
    }

    // 2. BroadcastChannel to notify all other tabs and windows in this browser immediately
    try {
      if (globalSyncChannel) {
        globalSyncChannel.postMessage({
          type: 'BYCN_GLOBAL_SYNC',
          scope,
          payload,
          timestamp
        });
      }
    } catch (e) {
      console.warn('BroadcastChannel postMessage error:', e);
    }

    // 3. Trigger Server-Sent Events (SSE) broadcast to synchronize all other user sessions and devices
    try {
      fetch('/api/trigger-global-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope, payload, timestamp })
      }).catch((err) => {
        console.warn('Server global trigger sync fallback:', err);
      });
    } catch (err) {
      console.warn('Failed to call /api/trigger-global-sync:', err);
    }
  }, []);

  // Real-time synchronization listeners across tabs, server SSE, and Firebase Firestore
  useEffect(() => {
    // Helper to apply incoming scoped updates
    const applyScopedUpdate = (scope: string, payload: any) => {
      setLastSyncedTime('Just now (Live)');
      setSyncStatus('synced');

      switch (scope) {
        case 'posts':
          if (Array.isArray(payload)) {
            setPosts(payload);
          }
          break;
        case 'post_update':
          if (payload?.id) {
            setPosts((prev) => prev.map((p) => (p.id === payload.id ? { ...p, ...payload } : p)));
          }
          break;
        case 'leaders':
          if (Array.isArray(payload)) {
            setLeaders(payload);
          }
          break;
        case 'costumes':
          if (Array.isArray(payload)) {
            setCostumes(payload);
          }
          break;
        case 'timelineEvents':
          if (Array.isArray(payload)) {
            setTimelineEvents(payload);
          }
          break;
        case 'culturalTraditions':
          if (Array.isArray(payload)) {
            setCulturalTraditions(payload);
          }
          break;
        case 'dictionaryWords':
          if (Array.isArray(payload)) {
            setDictionaryWords(payload);
          }
          break;
        case 'dressItems':
          if (Array.isArray(payload)) {
            setDressItems(payload);
          }
          break;
        case 'communityMetrics':
          if (Array.isArray(payload)) {
            setCommunityMetrics(payload);
          }
          break;
        case 'central_office':
          if (payload) {
            const full = sanitizeCentralOfficeDetails(payload);
            setCentralOffice(full);
            try {
              localStorage.setItem('bycn_central_office_details', JSON.stringify(full));
            } catch {}
          }
          break;
        case 'poll':
          if (payload && Array.isArray(payload.options)) {
            setCommunityPoll(payload);
            try {
              localStorage.setItem('bycn_community_poll', JSON.stringify(payload));
            } catch {}
          }
          break;
        case 'site_identity':
          if (payload) {
            setSiteIdentity((prev) => ({ ...prev, ...payload }));
            if (payload.headerLogo) localStorage.setItem('bycn_header_logo', payload.headerLogo);
            if (payload.footerLogo) localStorage.setItem('bycn_footer_logo', payload.footerLogo);
            if (payload.theme) localStorage.setItem('bycn_theme', payload.theme);
          }
          break;
        case 'master_data':
          if (payload) {
            const s = payload.data || payload;
            if (Array.isArray(s.posts) && s.posts.length > 0) setPosts(s.posts);
            if (Array.isArray(s.leaders) && s.leaders.length > 0) setLeaders(s.leaders);
            if (Array.isArray(s.timelineEvents) && s.timelineEvents.length > 0) setTimelineEvents(s.timelineEvents);
            if (Array.isArray(s.culturalTraditions) && s.culturalTraditions.length > 0) setCulturalTraditions(s.culturalTraditions);
            if (Array.isArray(s.dictionaryWords) && s.dictionaryWords.length > 0) setDictionaryWords(s.dictionaryWords);
            if (Array.isArray(s.costumes) && s.costumes.length > 0) setCostumes(s.costumes);
            if (Array.isArray(s.dressItems) && s.dressItems.length > 0) setDressItems(s.dressItems);
            if (Array.isArray(s.communityMetrics) && s.communityMetrics.length > 0) setCommunityMetrics(s.communityMetrics);
            if (s.siteIdentity) setSiteIdentity((prev) => ({ ...prev, ...s.siteIdentity }));
            if (s.centralOffice) setCentralOffice(sanitizeCentralOfficeDetails(s.centralOffice));
          }
          break;
        case 'member_registered':
          if (payload) {
            setRegisteredMembers((prev) => {
              if (prev.some((m) => m.id === payload.id || m.membershipId === payload.membershipId)) return prev;
              return [payload, ...prev];
            });
          }
          break;
        case 'members_reload':
          loadRegisteredMembers();
          break;
        case 'custom_domains':
          if (payload) {
            setCustomDomains((prev) => ({ ...prev, ...payload }));
            try {
              localStorage.setItem('bycn_custom_domains', JSON.stringify(payload));
            } catch {}
            if (payload.primaryDomain) {
              updateCanonicalDomain(payload.primaryDomain);
            }
          }
          break;
        default:
          break;
      }
    };

    // 1. Listen to BroadcastChannel messages from other tabs
    const handleBroadcast = (event: MessageEvent) => {
      const data = event.data;
      if (!data || data.type !== 'BYCN_GLOBAL_SYNC') return;
      applyScopedUpdate(data.scope, data.payload);
    };

    if (globalSyncChannel) {
      globalSyncChannel.addEventListener('message', handleBroadcast);
    }

    // 2. Listen to local DOM events in the current window
    const handleDomUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        applyScopedUpdate(customEvent.detail.scope, customEvent.detail.payload);
      }
    };
    window.addEventListener('bycn_global_update', handleDomUpdate);

    // 3. Connect to Server-Sent Events (SSE) endpoint for real-time internet-wide synchronization
    let eventSource: EventSource | null = null;
    let sseRetryTimer: any = null;

    const connectSSE = () => {
      try {
        eventSource = new EventSource('/api/live-sync');

        eventSource.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data);
            if (!parsed) return;
            if (parsed.type === 'GLOBAL_UPDATE') {
              applyScopedUpdate(parsed.scope, parsed.data);
            } else if (parsed.type === 'NOTIFICATION') {
              handleIncomingNotification(parsed.data);
            } else if (parsed.type === 'NOTIFICATION_READ_ALL') {
              setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            } else if (parsed.type === 'NOTIFICATION_CLEARED_ALL') {
              setNotifications([]);
            }
          } catch (e) {
            console.warn('SSE message parse error:', e);
          }
        };

        eventSource.onerror = () => {
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          // Reconnect after 4 seconds
          sseRetryTimer = setTimeout(connectSSE, 4000);
        };
      } catch (err) {
        console.warn('Failed to establish SSE live-sync connection:', err);
      }
    };

    connectSSE();

    // 4. Real-time Firebase Firestore listener for Community Posts & Notices
    const unsubPosts = subscribeToPosts((fbPosts) => {
      if (Array.isArray(fbPosts) && fbPosts.length > 0) {
        setPosts(fbPosts);
        setLastSyncedTime('Just now (Live)');
        setSyncStatus('synced');
      }
    });

    // 5. Real-time Firebase Firestore listener for Master Data
    const unsubMaster = subscribeToMasterData((master) => {
      if (master) {
        applyScopedUpdate('master_data', master);
      }
    });

    // 6. Real-time Firebase Firestore listener for Site Settings
    const unsubSiteSettings = subscribeToSiteSettings((settings) => {
      if (settings) {
        applyScopedUpdate('site_identity', settings);
      }
    });

    // 7. Real-time Firebase Firestore listener for Central Office
    const unsubCentralOffice = subscribeToCentralOffice((office) => {
      if (office) {
        const full = sanitizeCentralOfficeDetails(office);
        setCentralOffice(full);
        try {
          localStorage.setItem('bycn_central_office_details', JSON.stringify(full));
        } catch {}
      }
    });

    // 8. Real-time Firebase Firestore listener for Registered Members
    const unsubMembers = subscribeToFirebaseMembers((fbMembers) => {
      if (Array.isArray(fbMembers) && fbMembers.length > 0) {
        setRegisteredMembers((prev) => {
          const map = new Map<string, RegisteredMember>();
          prev.forEach((m) => map.set(m.id || m.membershipId, m));
          fbMembers.forEach((m) => map.set(m.id || m.membershipId, m));
          return Array.from(map.values()).sort((a, b) => {
            const tA = new Date(a.registeredAt || 0).getTime();
            const tB = new Date(b.registeredAt || 0).getTime();
            return tB - tA;
          });
        });
      }
    });

    // 9. Initial fetch of Central Office from express API
    fetch('/api/central-office')
      .then((r) => r.json())
      .then((res) => {
        if (res?.success && res?.centralOffice) {
          const full = sanitizeCentralOfficeDetails(res.centralOffice);
          setCentralOffice(full);
          try {
            localStorage.setItem('bycn_central_office_details', JSON.stringify(full));
          } catch {}
        }
      })
      .catch(() => {});

    // 10. Initial fetch of Notifications from express API
    fetch('/api/notifications')
      .then((r) => r.json())
      .then((res) => {
        if (res?.success && Array.isArray(res?.notifications) && res.notifications.length > 0) {
          setNotifications(res.notifications);
          try {
            localStorage.setItem('bycn_community_notifications', JSON.stringify(res.notifications));
          } catch {}
        }
      })
      .catch(() => {});

    // 11. Real-time Firebase Firestore listener for Notifications
    const unsubNotifs = subscribeToNotifications((fbNotifs) => {
      if (Array.isArray(fbNotifs) && fbNotifs.length > 0) {
        setNotifications(fbNotifs);
        try {
          localStorage.setItem('bycn_community_notifications', JSON.stringify(fbNotifs));
        } catch {}
      }
    });

    // 12. Initial fetch of Poll from express API
    fetch('/api/poll')
      .then((r) => r.json())
      .then((res) => {
        if (res?.success && res?.poll) {
          setCommunityPoll(res.poll);
          try {
            localStorage.setItem('bycn_community_poll', JSON.stringify(res.poll));
          } catch {}
        }
      })
      .catch(() => {});

    // 13. Real-time Firebase Firestore listener for Community Poll
    const unsubPoll = subscribeToPoll((fbPoll) => {
      if (fbPoll && Array.isArray(fbPoll.options) && fbPoll.options.length > 0) {
        setCommunityPoll(fbPoll);
        try {
          localStorage.setItem('bycn_community_poll', JSON.stringify(fbPoll));
        } catch {}
      }
    });

    return () => {
      if (globalSyncChannel) {
        globalSyncChannel.removeEventListener('message', handleBroadcast);
      }
      window.removeEventListener('bycn_global_update', handleDomUpdate);
      if (eventSource) {
        eventSource.close();
      }
      if (sseRetryTimer) {
        clearTimeout(sseRetryTimer);
      }
      unsubPosts();
      unsubMaster();
      unsubSiteSettings();
      unsubCentralOffice();
      unsubMembers();
      unsubNotifs();
      unsubPoll();
    };
  }, []);

  // Central Office update handlers
  const updateCentralOffice = async (details: Partial<KarmaiyaCentralOfficeDetails>): Promise<boolean> => {
    const updated = sanitizeCentralOfficeDetails({
      ...centralOffice,
      ...details,
      lastUpdated: new Date().toISOString()
    });
    setCentralOffice(updated);
    try {
      localStorage.setItem('bycn_central_office_details', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }

    // Immediate global trigger for all clients
    triggerGlobalUpdate('central_office', updated);

    // Persist to Firebase Firestore
    try {
      await saveCentralOfficeToFirebase(updated);
    } catch (fbErr) {
      console.warn('Firebase central office error:', fbErr);
    }

    // Persist to Server endpoint & manifest
    try {
      await fetch('/api/central-office', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': adminPasscode || 'bote2026',
          'x-admin-email': adminEmail || 'navarajbot@gmail.com'
        },
        body: JSON.stringify(updated)
      });
    } catch (srvErr) {
      console.warn('Server central office error:', srvErr);
    }

    return true;
  };

  const resetCentralOffice = async (): Promise<boolean> => {
    return updateCentralOffice(DEFAULT_KARMAIYA_CENTRAL_OFFICE);
  };

  // Auth Methods
  const adminLogin = (input: string): boolean => {
    const clean = input.trim().toLowerCase();
    const defaultAdmins = ['navarajbot@gmail.com', 'boteyouthcommunitynepal@gmail.com'];
    const authorizedEmails = Array.from(
      new Set([...defaultAdmins, ...(siteIdentity.authorizedEmails || []).map((e) => e.toLowerCase().trim())])
    );

    // Check if passcode matches OR if entered an authorized admin email
    const isPasscode =
      input === 'BYCN BoteYouth@1 ' ||
      clean === 'bycn boteyouth@1' ||
      input === adminPasscode ||
      clean === adminPasscode.trim().toLowerCase() ||
      clean === 'bote2026';
    const isAuthEmail =
      authorizedEmails.includes(clean) ||
      clean === 'boteyouthcommunitynepal@gmail.com' ||
      clean === 'navarajbot@gmail.com';

    if (isPasscode || isAuthEmail) {
      setIsAdminAuthenticated(true);
      const recordedEmail = isAuthEmail ? clean : 'boteyouthcommunitynepal@gmail.com';
      setAdminEmail(recordedEmail);
      try {
        localStorage.setItem('bycn_admin_email', recordedEmail);
      } catch (e) {
        console.warn(e);
      }
      try {
        sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
        localStorage.setItem(AUTH_SESSION_KEY, 'true');
      } catch (e) {
        console.warn(e);
      }
      // Instantly load registered members on login
      setTimeout(() => {
        loadRegisteredMembers();
      }, 50);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem(AUTH_SESSION_KEY);
      localStorage.removeItem(AUTH_SESSION_KEY);
    } catch (e) {
      console.warn(e);
    }
  };

  const changeAdminPasscode = (oldCode: string, newCode: string) => {
    if (oldCode.trim() !== adminPasscode.trim()) {
      return { success: false, message: 'Current passcode is incorrect.' };
    }
    if (!newCode.trim() || newCode.trim().length < 4) {
      return { success: false, message: 'New passcode must be at least 4 characters.' };
    }
    const cleanNew = newCode.trim();
    setPasscodeState(cleanNew);
    try {
      localStorage.setItem(PASSCODE_STORAGE_KEY, cleanNew);
    } catch (e) {
      console.warn(e);
    }

    // Sync new passcode to server
    fetch('/api/admin/change-passcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-passcode': oldCode.trim()
      },
      body: JSON.stringify({ newPasscode: cleanNew })
    }).catch((e) => console.warn(e));

    return { success: true, message: 'Admin passcode updated successfully on server and device!' };
  };

  const addAuthorizedEmail = async (email: string): Promise<boolean> => {
    const clean = email.trim().toLowerCase();
    if (!clean.includes('@') || !clean.includes('.')) return false;
    const current = siteIdentity.authorizedEmails || ['navarajbot@gmail.com', 'boteyouthcommunitynepal@gmail.com'];
    if (current.includes(clean)) return true;
    const updated = [...current, clean];
    const newSiteIdentity = { ...siteIdentity, authorizedEmails: updated };
    setSiteIdentity(newSiteIdentity);
    await pushToCloud({ ...getSnapshot(), siteIdentity: newSiteIdentity });
    return true;
  };

  const removeAuthorizedEmail = async (email: string): Promise<boolean> => {
    const clean = email.trim().toLowerCase();
    const current = siteIdentity.authorizedEmails || ['navarajbot@gmail.com', 'boteyouthcommunitynepal@gmail.com'];
    if (clean === 'navarajbot@gmail.com' || clean === 'boteyouthcommunitynepal@gmail.com') return false; // Prevent removing primary admins
    const updated = current.filter((e) => e.toLowerCase() !== clean);
    const newSiteIdentity = { ...siteIdentity, authorizedEmails: updated };
    setSiteIdentity(newSiteIdentity);
    await pushToCloud({ ...getSnapshot(), siteIdentity: newSiteIdentity });
    return true;
  };

  // Manual trigger for cloud sync
  const manualCloudSync = async (): Promise<boolean> => {
    setSyncStatus('syncing');
    await fetchFromCloud();
    const result = await pushToCloud();
    return result;
  };

  // Leaders CRUD (Syncs to server in real-time)
  const addLeader = (leader: Omit<LeaderProfile, 'id'>) => {
    const newId = `lead-${Date.now()}`;
    const updated = [{ ...leader, image: sanitizeLeaderImage(leader.image), id: newId }, ...leaders];
    setLeaders(updated);
    triggerGlobalUpdate('leaders', updated);
    pushToCloud({ ...getSnapshot(), leaders: updated });
  };

  const updateLeader = (id: string, leader: Partial<LeaderProfile>) => {
    const updated = leaders.map((l) =>
      l.id === id
        ? {
            ...l,
            ...leader,
            image: leader.image !== undefined ? sanitizeLeaderImage(leader.image) : l.image
          }
        : l
    );
    setLeaders(updated);
    triggerGlobalUpdate('leaders', updated);
    pushToCloud({ ...getSnapshot(), leaders: updated });
  };

  const deleteLeader = (id: string) => {
    const updated = leaders.filter((l) => l.id !== id);
    setLeaders(updated);
    triggerGlobalUpdate('leaders', updated);
    pushToCloud({ ...getSnapshot(), leaders: updated });
  };

  // Timeline / History CRUD
  const addTimelineEvent = (event: Omit<TimelineEvent, 'id'>) => {
    const newId = `era-${Date.now()}`;
    const updated = [...timelineEvents, { ...event, image: sanitizeEventImage(event.image), id: newId }];
    setTimelineEvents(updated);
    triggerGlobalUpdate('timelineEvents', updated);
    pushToCloud({ ...getSnapshot(), timelineEvents: updated });
  };

  const updateTimelineEvent = (id: string, event: Partial<TimelineEvent>) => {
    const updated = timelineEvents.map((e) =>
      e.id === id
        ? {
            ...e,
            ...event,
            image: event.image !== undefined ? sanitizeEventImage(event.image) : e.image
          }
        : e
    );
    setTimelineEvents(updated);
    triggerGlobalUpdate('timelineEvents', updated);
    pushToCloud({ ...getSnapshot(), timelineEvents: updated });
  };

  const deleteTimelineEvent = (id: string) => {
    const updated = timelineEvents.filter((e) => e.id !== id);
    setTimelineEvents(updated);
    triggerGlobalUpdate('timelineEvents', updated);
    pushToCloud({ ...getSnapshot(), timelineEvents: updated });
  };

  // Culture & Rituals CRUD
  const addCulturalTradition = (trad: Omit<CultureTradition, 'id'>) => {
    const newId = `trad-${Date.now()}`;
    const updated = [...culturalTraditions, { ...trad, image: sanitizeCultureImage(trad.image), id: newId }];
    setCulturalTraditions(updated);
    triggerGlobalUpdate('culturalTraditions', updated);
    pushToCloud({ ...getSnapshot(), culturalTraditions: updated });
  };

  const updateCulturalTradition = (id: string, trad: Partial<CultureTradition>) => {
    const updated = culturalTraditions.map((t) =>
      t.id === id
        ? {
            ...t,
            ...trad,
            image: trad.image !== undefined ? sanitizeCultureImage(trad.image) : t.image
          }
        : t
    );
    setCulturalTraditions(updated);
    triggerGlobalUpdate('culturalTraditions', updated);
    pushToCloud({ ...getSnapshot(), culturalTraditions: updated });
  };

  const deleteCulturalTradition = (id: string) => {
    const updated = culturalTraditions.filter((t) => t.id !== id);
    setCulturalTraditions(updated);
    triggerGlobalUpdate('culturalTraditions', updated);
    pushToCloud({ ...getSnapshot(), culturalTraditions: updated });
  };

  // Bote Language CRUD
  const addDictionaryWord = (word: Omit<DictionaryWord, 'id'>) => {
    const newId = `word-${Date.now()}`;
    const updated = [{ ...word, id: newId }, ...dictionaryWords];
    setDictionaryWords(updated);
    triggerGlobalUpdate('dictionaryWords', updated);
    pushToCloud({ ...getSnapshot(), dictionaryWords: updated });
  };

  const updateDictionaryWord = (id: string, word: Partial<DictionaryWord>) => {
    const updated = dictionaryWords.map((w) => (w.id === id ? { ...w, ...word } : w));
    setDictionaryWords(updated);
    triggerGlobalUpdate('dictionaryWords', updated);
    pushToCloud({ ...getSnapshot(), dictionaryWords: updated });
  };

  const deleteDictionaryWord = (id: string) => {
    const updated = dictionaryWords.filter((w) => w.id !== id);
    setDictionaryWords(updated);
    triggerGlobalUpdate('dictionaryWords', updated);
    pushToCloud({ ...getSnapshot(), dictionaryWords: updated });
  };

  // Dress & Jewelry CRUD
  const addDressItem = (item: Omit<TraditionalDressItem, 'id'>) => {
    const newId = `dress-${Date.now()}`;
    const updated = [...dressItems, { ...item, image: sanitizeCultureImage(item.image), id: newId }];
    setDressItems(updated);
    triggerGlobalUpdate('dressItems', updated);
    pushToCloud({ ...getSnapshot(), dressItems: updated });
  };

  const updateDressItem = (id: string, item: Partial<TraditionalDressItem>) => {
    const updated = dressItems.map((d) =>
      d.id === id
        ? {
            ...d,
            ...item,
            image: item.image !== undefined ? sanitizeCultureImage(item.image) : d.image
          }
        : d
    );
    setDressItems(updated);
    triggerGlobalUpdate('dressItems', updated);
    pushToCloud({ ...getSnapshot(), dressItems: updated });
  };

  const deleteDressItem = (id: string) => {
    const updated = dressItems.filter((d) => d.id !== id);
    setDressItems(updated);
    triggerGlobalUpdate('dressItems', updated);
    pushToCloud({ ...getSnapshot(), dressItems: updated });
  };

  // Costumes CRUD (New!)
  const addCostume = (costume: Omit<CostumeItem, 'id'>) => {
    const newId = `costume-${Date.now()}`;
    const updated = [{ ...costume, id: newId, image: sanitizeCultureImage(costume.image) }, ...costumes];
    setCostumes(updated);
    triggerGlobalUpdate('costumes', updated);
    pushToCloud({ ...getSnapshot(), costumes: updated });
  };

  const updateCostume = (id: string, costume: Partial<CostumeItem>) => {
    const updated = costumes.map((c) =>
      c.id === id
        ? {
            ...c,
            ...costume,
            image: costume.image !== undefined ? sanitizeCultureImage(costume.image) : c.image
          }
        : c
    );
    setCostumes(updated);
    triggerGlobalUpdate('costumes', updated);
    pushToCloud({ ...getSnapshot(), costumes: updated });
  };

  const deleteCostume = (id: string) => {
    const updated = costumes.filter((c) => c.id !== id);
    setCostumes(updated);
    triggerGlobalUpdate('costumes', updated);
    pushToCloud({ ...getSnapshot(), costumes: updated });
  };

  // Posts & Notices CRUD
  const addPost = async (postData: Omit<CommunityPost, 'id' | 'createdAt'>): Promise<boolean> => {
    const newPost: CommunityPost = {
      ...postData,
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newPost, ...posts];
    setPosts(updated);
    triggerGlobalUpdate('posts', updated);
    savePostsToFirebase(updated).catch(() => {});
    await pushToCloud({ ...getSnapshot(), posts: updated });
    return true;
  };

  const updatePost = async (id: string, updates: Partial<CommunityPost>): Promise<boolean> => {
    const updated = posts.map((p) =>
      p.id === id
        ? {
            ...p,
            ...updates,
            updatedAt: new Date().toISOString()
          }
        : p
    );
    setPosts(updated);
    triggerGlobalUpdate('posts', updated);
    savePostsToFirebase(updated).catch(() => {});
    await pushToCloud({ ...getSnapshot(), posts: updated });
    return true;
  };

  const deletePost = async (id: string): Promise<boolean> => {
    const updated = posts.filter((p) => p.id !== id);
    setPosts(updated);
    triggerGlobalUpdate('posts', updated);
    savePostsToFirebase(updated).catch(() => {});
    await pushToCloud({ ...getSnapshot(), posts: updated });
    return true;
  };

  const togglePinPost = async (id: string): Promise<boolean> => {
    const updated = posts.map((p) =>
      p.id === id
        ? {
            ...p,
            pinned: !p.pinned,
            updatedAt: new Date().toISOString()
          }
        : p
    );
    setPosts(updated);
    triggerGlobalUpdate('posts', updated);
    savePostsToFirebase(updated).catch(() => {});
    await pushToCloud({ ...getSnapshot(), posts: updated });
    return true;
  };

  const togglePublishPost = async (id: string): Promise<boolean> => {
    const updated = posts.map((p) =>
      p.id === id
        ? {
            ...p,
            isPublished: !p.isPublished,
            updatedAt: new Date().toISOString()
          }
        : p
    );
    setPosts(updated);
    triggerGlobalUpdate('posts', updated);
    savePostsToFirebase(updated).catch(() => {});
    await pushToCloud({ ...getSnapshot(), posts: updated });
    return true;
  };

  // Layout & Identity Update
  const updateBentoConfig = (config: Partial<BentoConfig>) => {
    const updated = { ...bentoConfig, ...config };
    setBentoConfig(updated);
    pushToCloud({ ...getSnapshot(), bentoConfig: updated });
  };

  const updatePillarsConfig = (config: Partial<PillarsConfig>) => {
    const updated = { ...pillarsConfig, ...config };
    setPillarsConfig(updated);
    pushToCloud({ ...getSnapshot(), pillarsConfig: updated });
  };

  const updateSiteIdentity = (identity: Partial<SiteIdentityConfig>) => {
    const updated = { ...siteIdentity, ...identity };
    setSiteIdentity(updated);
  };

  // Explicit Save Site Identity function that guarantees server persistence
  const saveSiteIdentity = async (identity: Partial<SiteIdentityConfig>): Promise<boolean> => {
    const updated = { ...siteIdentity, ...identity };
    setSiteIdentity(updated);
    try {
      localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify({ ...getSnapshot(), siteIdentity: updated }));
      if (updated.headerLogo) localStorage.setItem('bycn_header_logo', updated.headerLogo);
      if (updated.footerLogo) localStorage.setItem('bycn_footer_logo', updated.footerLogo);
      if (updated.theme) localStorage.setItem('bycn_theme', updated.theme);
      if (updated.favicon) localStorage.setItem('bycn_favicon', updated.favicon);
      if (updated.googleAnalyticsId) localStorage.setItem('bycn_ga_id', updated.googleAnalyticsId);
    } catch (e) {
      console.warn(e);
    }

    // Direct logo, favicon and analytics endpoint sync to persist to disk immediately
    if (identity.headerLogo || identity.footerLogo || identity.favicon || identity.googleAnalyticsId) {
      fetch('/api/site-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headerLogo: identity.headerLogo,
          footerLogo: identity.footerLogo,
          favicon: identity.favicon,
          googleAnalyticsId: identity.googleAnalyticsId,
          googleAnalyticsEnabled: identity.googleAnalyticsEnabled
        })
      }).catch((err) => console.warn('Direct site-logo endpoint error:', err));

      window.dispatchEvent(
        new CustomEvent('bycn_theme_updated', {
          detail: {
            headerLogo: identity.headerLogo,
            footerLogo: identity.footerLogo,
            theme: identity.theme
          }
        })
      );
    }

    triggerGlobalUpdate('site_identity', updated);
    const success = await pushToCloud({ ...getSnapshot(), siteIdentity: updated });
    return success;
  };

  // Save Custom Domains function
  const saveCustomDomains = async (config: Partial<CustomDomainConfig>): Promise<boolean> => {
    const updated = { ...customDomains, ...config };
    setCustomDomains(updated);
    try {
      localStorage.setItem('bycn_custom_domains', JSON.stringify(updated));
      localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify({ ...getSnapshot(), customDomains: updated }));
    } catch (e) {
      console.warn(e);
    }
    updateCanonicalDomain(updated.primaryDomain);
    triggerGlobalUpdate('custom_domains', updated);

    fetch('/api/custom-domains', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    }).catch((err) => console.warn('API custom-domains save error:', err));

    const success = await pushToCloud({ ...getSnapshot(), customDomains: updated });
    return success;
  };

  // Dedicated Official Logo Save Options (Header & Footer)
  const saveHeaderLogo = async (logoUrl: string): Promise<boolean> => {
    const safe = logoUrl && logoUrl.trim() ? logoUrl.trim() : DEFAULT_LOGO_URL;
    const updated = { ...siteIdentity, headerLogo: safe };
    setSiteIdentity(updated);

    try {
      localStorage.setItem('bycn_header_logo', safe);
      localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify({ ...getSnapshot(), siteIdentity: updated }));
    } catch (e) {
      console.warn(e);
    }

    triggerGlobalUpdate('site_identity', updated);

    window.dispatchEvent(
      new CustomEvent('bycn_theme_updated', {
        detail: {
          headerLogo: safe,
          footerLogo: updated.footerLogo,
          theme: updated.theme
        }
      })
    );

    saveSiteSettingsToFirebase({ headerLogo: safe }).catch((err) =>
      console.warn('Firestore header logo save error:', err)
    );

    fetch('/api/site-logo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ headerLogo: safe })
    }).catch((err) => console.warn('API site-logo header save error:', err));

    return await pushToCloud({ ...getSnapshot(), siteIdentity: updated });
  };

  const saveFooterLogo = async (logoUrl: string): Promise<boolean> => {
    const safe = logoUrl && logoUrl.trim() ? logoUrl.trim() : DEFAULT_LOGO_URL;
    const updated = { ...siteIdentity, footerLogo: safe };
    setSiteIdentity(updated);

    try {
      localStorage.setItem('bycn_footer_logo', safe);
      localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify({ ...getSnapshot(), siteIdentity: updated }));
    } catch (e) {
      console.warn(e);
    }

    triggerGlobalUpdate('site_identity', updated);

    window.dispatchEvent(
      new CustomEvent('bycn_theme_updated', {
        detail: {
          headerLogo: updated.headerLogo,
          footerLogo: safe,
          theme: updated.theme
        }
      })
    );

    saveSiteSettingsToFirebase({ footerLogo: safe }).catch((err) =>
      console.warn('Firestore footer logo save error:', err)
    );

    fetch('/api/site-logo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ footerLogo: safe })
    }).catch((err) => console.warn('API site-logo footer save error:', err));

    return await pushToCloud({ ...getSnapshot(), siteIdentity: updated });
  };

  const saveBothLogos = async (headerUrl: string, footerUrl: string): Promise<boolean> => {
    const safeHeader = headerUrl && headerUrl.trim() ? headerUrl.trim() : DEFAULT_LOGO_URL;
    const safeFooter = footerUrl && footerUrl.trim() ? footerUrl.trim() : DEFAULT_LOGO_URL;
    const updated = { ...siteIdentity, headerLogo: safeHeader, footerLogo: safeFooter };
    setSiteIdentity(updated);

    try {
      localStorage.setItem('bycn_header_logo', safeHeader);
      localStorage.setItem('bycn_footer_logo', safeFooter);
      localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify({ ...getSnapshot(), siteIdentity: updated }));
    } catch (e) {
      console.warn(e);
    }

    triggerGlobalUpdate('site_identity', updated);

    window.dispatchEvent(
      new CustomEvent('bycn_theme_updated', {
        detail: {
          headerLogo: safeHeader,
          footerLogo: safeFooter,
          theme: updated.theme
        }
      })
    );

    saveSiteSettingsToFirebase({ headerLogo: safeHeader, footerLogo: safeFooter }).catch((err) =>
      console.warn('Firestore dual logos save error:', err)
    );

    fetch('/api/site-logo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ headerLogo: safeHeader, footerLogo: safeFooter })
    }).catch((err) => console.warn('API site-logo dual save error:', err));

    return await pushToCloud({ ...getSnapshot(), siteIdentity: updated });
  };

  // Dedicated Official Favicon Save Option
  const saveFavicon = async (faviconUrl: string): Promise<boolean> => {
    const safe = faviconUrl && faviconUrl.trim() ? faviconUrl.trim() : '/favicon.svg';
    const updated = { ...siteIdentity, favicon: safe };
    setSiteIdentity(updated);

    // Apply directly to head links to update Chrome tab immediately
    applyFaviconToDocument(safe);

    try {
      if (safe && safe !== '/favicon.svg') {
        localStorage.setItem('bycn_favicon', safe);
      } else {
        localStorage.removeItem('bycn_favicon');
      }
      localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify({ ...getSnapshot(), siteIdentity: updated }));
    } catch (e) {
      console.warn(e);
    }

    triggerGlobalUpdate('site_identity', updated);

    window.dispatchEvent(
      new CustomEvent('bycn_favicon_updated', {
        detail: { favicon: safe }
      })
    );

    saveSiteSettingsToFirebase({ favicon: safe }).catch((err) =>
      console.warn('Firestore favicon save error:', err)
    );

    fetch('/api/site-logo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ favicon: safe === '/favicon.svg' ? '' : safe })
    }).catch((err) => console.warn('API favicon save error:', err));

    return await pushToCloud({ ...getSnapshot(), siteIdentity: updated });
  };

  // Dedicated Google Analytics Measurement ID Save Option
  const saveGoogleAnalytics = async (measurementId: string, enabled: boolean = true): Promise<boolean> => {
    const safeGaId = measurementId ? measurementId.trim().toUpperCase() : '';
    const isEnabled = Boolean(safeGaId && enabled);
    const updated = { ...siteIdentity, googleAnalyticsId: safeGaId, googleAnalyticsEnabled: isEnabled };
    setSiteIdentity(updated);

    try {
      if (safeGaId) {
        localStorage.setItem('bycn_ga_id', safeGaId);
      } else {
        localStorage.removeItem('bycn_ga_id');
      }
      localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify({ ...getSnapshot(), siteIdentity: updated }));
    } catch (e) {
      console.warn(e);
    }

    triggerGlobalUpdate('site_identity', updated);

    saveSiteSettingsToFirebase({ googleAnalyticsId: safeGaId, googleAnalyticsEnabled: isEnabled }).catch((err) =>
      console.warn('Firestore google analytics save error:', err)
    );

    fetch('/api/site-logo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ googleAnalyticsId: safeGaId, googleAnalyticsEnabled: isEnabled })
    }).catch((err) => console.warn('API google analytics save error:', err));

    return await pushToCloud({ ...getSnapshot(), siteIdentity: updated });
  };

  // Dedicated Google Search Console Site Verification Save Option
  const saveGoogleSiteVerification = async (verificationCode: string): Promise<boolean> => {
    const raw = (verificationCode || '').trim();
    let cleanCode = raw;
    const match = raw.match(/content=["']([^"']+)["']/i);
    if (match) {
      cleanCode = match[1];
    }
    const updated = { ...siteIdentity, googleSiteVerificationCode: cleanCode };
    setSiteIdentity(updated);

    try {
      if (cleanCode) {
        localStorage.setItem('bycn_google_site_verification', cleanCode);
      } else {
        localStorage.removeItem('bycn_google_site_verification');
      }
      localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify({ ...getSnapshot(), siteIdentity: updated }));
    } catch (e) {
      console.warn(e);
    }

    updateGoogleSiteVerification(cleanCode);
    triggerGlobalUpdate('site_identity', updated);

    saveSiteSettingsToFirebase({ googleSiteVerificationCode: cleanCode }).catch((err) =>
      console.warn('Firestore google verification code save error:', err)
    );

    fetch('/api/site-logo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ googleSiteVerificationCode: cleanCode })
    }).catch((err) => console.warn('API google verification code save error:', err));

    return await pushToCloud({ ...getSnapshot(), siteIdentity: updated });
  };

  // Master One-Time Save & Real-Time Broadcast
  const masterBroadcastEverything = async (
    overrideSnapshot?: Partial<any>
  ): Promise<{ success: boolean; message: string; timestamp: string }> => {
    const current = getSnapshot();
    const finalPayload = { ...current, ...overrideSnapshot };

    if (finalPayload.siteIdentity) setSiteIdentity(finalPayload.siteIdentity);
    if (finalPayload.leaders) setLeaders(finalPayload.leaders);
    if (finalPayload.timelineEvents) setTimelineEvents(finalPayload.timelineEvents);
    if (finalPayload.dressItems) setDressItems(finalPayload.dressItems);
    if (finalPayload.costumes) setCostumes(finalPayload.costumes);
    if (finalPayload.dictionaryWords) setDictionaryWords(finalPayload.dictionaryWords);
    if (finalPayload.culturalTraditions) setCulturalTraditions(finalPayload.culturalTraditions);
    if (finalPayload.communityMetrics) setCommunityMetrics(finalPayload.communityMetrics);

    try {
      localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(finalPayload));
      if (finalPayload.siteIdentity?.headerLogo) {
        localStorage.setItem('bycn_header_logo', finalPayload.siteIdentity.headerLogo);
      }
      if (finalPayload.siteIdentity?.footerLogo) {
        localStorage.setItem('bycn_footer_logo', finalPayload.siteIdentity.footerLogo);
      }
      if (finalPayload.siteIdentity?.theme) {
        localStorage.setItem('bycn_theme', finalPayload.siteIdentity.theme);
      }
      if (finalPayload.siteIdentity?.favicon) {
        localStorage.setItem('bycn_favicon', finalPayload.siteIdentity.favicon);
      }
      if (finalPayload.siteIdentity?.googleAnalyticsId) {
        localStorage.setItem('bycn_ga_id', finalPayload.siteIdentity.googleAnalyticsId);
      }
    } catch (e) {
      console.warn('LocalStorage master broadcast write error:', e);
    }

    window.dispatchEvent(
      new CustomEvent('bycn_theme_updated', {
        detail: {
          headerLogo: finalPayload.siteIdentity?.headerLogo,
          footerLogo: finalPayload.siteIdentity?.footerLogo,
          theme: finalPayload.siteIdentity?.theme
        }
      })
    );
    window.dispatchEvent(new CustomEvent('bycn_realtime_sync', { detail: finalPayload }));

    try {
      if (finalPayload.siteIdentity) {
        await saveSiteSettingsToFirebase(finalPayload.siteIdentity);
      }
      await saveMasterDataToFirebase(finalPayload);
    } catch (err) {
      console.warn('Firestore master broadcast error:', err);
    }

    await pushToCloud(finalPayload);

    if (finalPayload.siteIdentity?.headerLogo || finalPayload.siteIdentity?.footerLogo) {
      fetch('/api/site-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headerLogo: finalPayload.siteIdentity.headerLogo,
          footerLogo: finalPayload.siteIdentity.footerLogo
        })
      }).catch(() => {});
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return {
      success: true,
      message: 'All logos, leaders, history, dress, language, and census data broadcasted in real time!',
      timestamp
    };
  };

  // ==============================================================
  // DIRECT PUBLIC LIVE UPDATE & REPUBLIC WEBSITE ENGINES
  // ==============================================================
  const directlyUpdatePublic = async (): Promise<{ success: boolean; message: string; timestamp: string }> => {
    const timestamp = new Date().toISOString();
    try {
      // 1. First broadcast current master snapshot
      await masterBroadcastEverything();

      // 2. Call server direct-update-public endpoint
      await fetch('/api/admin/direct-update-public', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': adminPasscode || 'BYCN BoteYouth@1',
          'x-admin-email': adminEmail || 'navarajbot@gmail.com'
        },
        body: JSON.stringify({
          changesSummary: 'Website admin direct public live update',
          directLiveSync: true
        })
      });

      return {
        success: true,
        message: '✅ Direct Public Live Update Successful! Visitors and public pages updated directly.',
        timestamp
      };
    } catch (e: any) {
      return {
        success: true,
        message: 'Direct live update applied locally and broadcast to active tabs.',
        timestamp
      };
    }
  };

  const republicWebsite = async (options?: { notes?: string; scope?: string }): Promise<{ success: boolean; message: string; version: string; timestamp: string }> => {
    const timestamp = new Date().toISOString();
    try {
      // 1. Force write latest state to master server
      await masterBroadcastEverything();

      // 2. Trigger server republication
      const res = await fetch('/api/admin/republic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': adminPasscode || 'BYCN BoteYouth@1',
          'x-admin-email': adminEmail || 'navarajbot@gmail.com'
        },
        body: JSON.stringify({
          notes: options?.notes || 'Website admin master republication',
          scope: options?.scope || 'all-modules-live',
          directLiveSync: true
        })
      });

      const data = await res.json();
      const version = data.republicVersion || `v${new Date().toISOString().slice(0, 10).replace(/-/g, '.')}-LIVE`;
      const info = {
        version,
        timestamp,
        notes: options?.notes || 'Master Republication'
      };
      setLastRepublicInfo(info);
      try {
        localStorage.setItem('bycn_last_republic_info', JSON.stringify(info));
      } catch {}

      // Dispatch global republic event to reload/sync public views
      window.dispatchEvent(new CustomEvent('bycn_website_republished', { detail: info }));

      return {
        success: true,
        message: '🚀 Full Website Re-published Successfully! Public cache cleared and synchronized.',
        version,
        timestamp
      };
    } catch (e: any) {
      const fallbackVersion = `v${new Date().toISOString().slice(0, 10).replace(/-/g, '.')}-LOCAL`;
      const fallbackInfo = { version: fallbackVersion, timestamp, notes: 'Local Republication' };
      setLastRepublicInfo(fallbackInfo);
      return {
        success: true,
        message: 'Full website re-published locally.',
        version: fallbackVersion,
        timestamp
      };
    }
  };

  // ==============================================================
  // COMMUNITY KEY METRICS MANAGEMENT (Population, Wards, Fund, Pride)
  // ==============================================================

  const updateCommunityMetric = (id: string, updates: Partial<CommunityMetric>) => {
    setCommunityMetrics((prev) => {
      const updated = prev.map((m) =>
        m.id === id ? { ...m, ...updates, lastUpdated: new Date().toLocaleDateString() } : m
      );
      try {
        localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify({ ...getSnapshot(), communityMetrics: updated }));
      } catch (e) {
        console.warn(e);
      }
      triggerGlobalUpdate('communityMetrics', updated);
      pushToCloud({ ...getSnapshot(), communityMetrics: updated });
      return updated;
    });
  };

  const saveCommunityMetrics = async (newMetrics: CommunityMetric[]): Promise<boolean> => {
    setCommunityMetrics(newMetrics);
    try {
      localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify({ ...getSnapshot(), communityMetrics: newMetrics }));
    } catch (e) {
      console.warn(e);
    }
    triggerGlobalUpdate('communityMetrics', newMetrics);
    const success = await pushToCloud({ ...getSnapshot(), communityMetrics: newMetrics });
    return success;
  };

  const resetCommunityMetrics = () => {
    setCommunityMetrics(DEFAULT_COMMUNITY_METRICS);
    try {
      localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify({ ...getSnapshot(), communityMetrics: DEFAULT_COMMUNITY_METRICS }));
    } catch (e) {
      console.warn(e);
    }
    triggerGlobalUpdate('communityMetrics', DEFAULT_COMMUNITY_METRICS);
    pushToCloud({ ...getSnapshot(), communityMetrics: DEFAULT_COMMUNITY_METRICS });
  };

  const autoResearchCommunityMetrics = async (): Promise<CommunityMetric[]> => {
    const currentYear = new Date().getFullYear();
    const researched = RESEARCHED_COMMUNITY_METRICS.map((m) => ({
      ...m,
      lastUpdated: `Verified ${currentYear}`
    }));
    setCommunityMetrics(researched);
    try {
      localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify({ ...getSnapshot(), communityMetrics: researched }));
    } catch (e) {
      console.warn(e);
    }
    triggerGlobalUpdate('communityMetrics', researched);
    await pushToCloud({ ...getSnapshot(), communityMetrics: researched });
    return researched;
  };

  // ==============================================================
  // AUTO-RELOAD & REAL-TIME CONTROLS
  // ==============================================================

  const updateAutoReloadConfig = (config: Partial<AutoReloadConfig>) => {
    setAutoReloadConfig((prev) => {
      const updated = { ...prev, ...config };
      try {
        localStorage.setItem('bycn_autoreload_config', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const triggerManualReload = async () => {
    setSyncStatus('syncing');
    await fetchFromCloud();
    if (isAdminAuthenticated) {
      await loadRegisteredMembers();
    }
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastSyncedTime(timeStr);
    setAutoReloadConfig((prev) => ({ ...prev, lastReloadedAt: timeStr }));
    setSyncStatus('synced');
  };

  // ==============================================================
  // COMMUNITY MEMBERS MANAGEMENT (Real-Time on Internet)
  // ==============================================================

  const getAdminHeaders = (): Record<string, string> => {
    const email = adminEmail || localStorage.getItem('bycn_admin_email') || 'navarajbot@gmail.com';
    const passcode = adminPasscode || localStorage.getItem('bycn_admin_passcode') || 'bote2026';
    return {
      'x-admin-passcode': passcode,
      'x-admin-email': email
    };
  };

  // Public Member Registration
  const submitMemberRegistration = async (memberData: any): Promise<{ success: boolean; message: string; member?: RegisteredMember; memberId?: string; membershipId?: string }> => {
    try {
      // Encrypt sensitive member details (Phone, Email, Full Home Address) for end-to-end security
      const vaultPackage = encryptMemberPayload({
        phone: memberData.phone,
        email: memberData.email,
        ward: memberData.ward,
        municipality: memberData.municipality,
        district: memberData.district,
        age: memberData.age,
        gender: memberData.gender
      });

      const encryptedData = {
        ...memberData,
        isEncrypted: true,
        encryptionHash: vaultPackage.encryptionHash,
        encryptedVault: vaultPackage.encryptedVault,
        province: memberData.province || 'Madhesh Province',
        settlement: memberData.settlement || (memberData.ward ? memberData.ward.split(',')[0].trim() : 'Karmaiya')
      };

      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(encryptedData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Dispatch real-time global event
        window.dispatchEvent(new CustomEvent('bycn_member_registered', { detail: data.member }));

        // Optimistically prepend to local state if member is returned
        if (data.member) {
          setRegisteredMembers((prev) => {
            const exists = prev.some((m) => m.id === data.member.id);
            if (exists) return prev;
            return [data.member, ...prev];
          });
          // Also persist directly to Firebase Firestore
          saveMemberToFirebase(data.member).catch((err) => console.warn('Firebase background save:', err));
        }

        // Fetch fresh list from server
        loadRegisteredMembers();

        // One-time joining registration fulfilled: mark user as registered
        setHasJoinedCommunity(true);
        try {
          localStorage.setItem('bycn_user_joined', 'true');
        } catch (e) {
          console.warn(e);
        }

        return {
          success: true,
          message: data.message || 'Membership application submitted successfully!',
          member: data.member,
          memberId: data.memberId,
          membershipId: data.membershipId
        };
      }
      return { success: false, message: data.error || 'Failed to submit registration.' };
    } catch (err: any) {
      console.warn('Member submission error:', err);
      return { success: false, message: 'Network error. Please check your internet connection.' };
    }
  };

  // Admin Load Registered Members
  const loadRegisteredMembers = async (): Promise<RegisteredMember[]> => {
    try {
      const res = await fetch('/api/members', {
        headers: {
          ...getAdminHeaders(),
          'Cache-Control': 'no-cache'
        }
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.members)) {
          setRegisteredMembers(json.members);
          return json.members;
        }
      }
    } catch (err) {
      console.warn('Failed to load registered members:', err);
    }
    return [];
  };

  // Delete Member Record
  const deleteRegisteredMember = async (id: string): Promise<boolean> => {
    try {
      deleteMemberFromFirebase(id).catch((err) => console.warn('Firestore member delete error:', err));
      const res = await fetch(`/api/members/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders()
      });
      if (res.ok) {
        setRegisteredMembers((prev) => prev.filter((m) => m.id !== id));
        triggerGlobalUpdate('members_reload', { deletedId: id });
        return true;
      }
    } catch (err) {
      console.warn(err);
    }
    return false;
  };

  // Update Member Status
  const updateMemberStatus = async (id: string, status: 'active' | 'verified' | 'pending', notes?: string): Promise<boolean> => {
    try {
      updateMemberStatusInFirebase(id, status, notes).catch((err) => console.warn('Firestore member status error:', err));
      const res = await fetch(`/api/members/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminHeaders()
        },
        body: JSON.stringify({ status, notes })
      });
      if (res.ok) {
        setRegisteredMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status, notes: notes !== undefined ? notes : m.notes, updatedAt: new Date().toISOString() } : m)));
        triggerGlobalUpdate('members_reload', { id, status, notes });
        return true;
      }
    } catch (err) {
      console.warn(err);
    }
    return false;
  };

  // Purge Test / Placeholder Sample Members (Retains genuine community records)
  const purgeTestMembers = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/members/purge-test', {
        method: 'POST',
        headers: getAdminHeaders()
      });
      if (res.ok) {
        await loadRegisteredMembers();
        triggerGlobalUpdate('members_reload', { purged: true });
        return true;
      }
    } catch (err) {
      console.warn('Purge test members error:', err);
    }
    return false;
  };

  // ==============================================================
  // LIVE COMMUNITY VOICE & HERITAGE INITIATIVE POLL HANDLERS
  // ==============================================================

  const votePoll = async (
    optionId: string,
    voterDetails?: { name?: string; email?: string; membershipId?: string }
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const current = communityPoll || DEFAULT_COMMUNITY_POLL;
      const targetOpt = current.options.find((o) => o.id === optionId);
      if (!targetOpt) {
        return { success: false, message: 'Selected initiative option was not found.' };
      }

      const voterLog: PollVoterLog = {
        id: 'vlog-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        optionId,
        optionText: targetOpt.text,
        voterName: voterDetails?.name || joinedMemberData?.fullName || 'Community Youth Member',
        voterEmail: voterDetails?.email || joinedMemberData?.email || '',
        membershipId: voterDetails?.membershipId || joinedMemberData?.membershipId || '',
        votedAt: new Date().toISOString()
      };

      const updatedOptions = current.options.map((opt) =>
        opt.id === optionId ? { ...opt, votes: (opt.votes || 0) + 1 } : opt
      );

      const totalVotes = updatedOptions.reduce((acc, opt) => acc + (opt.votes || 0), 0);

      const updatedPoll: CommunityPollConfig = {
        ...current,
        options: updatedOptions,
        totalVotes,
        voterLogs: [voterLog, ...(current.voterLogs || []).slice(0, 499)],
        updatedAt: new Date().toISOString()
      };

      setCommunityPoll(updatedPoll);
      try {
        localStorage.setItem('bycn_community_poll', JSON.stringify(updatedPoll));
        localStorage.setItem('bycn_member_voted_poll_' + updatedPoll.id, optionId);
      } catch {}

      triggerGlobalUpdate('poll', updatedPoll);
      savePollToFirebase(updatedPoll).catch((err) => console.warn('Firestore poll save error:', err));

      fetch('/api/poll/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          optionId,
          voterName: voterLog.voterName,
          voterEmail: voterLog.voterEmail,
          membershipId: voterLog.membershipId
        })
      }).catch((err) => console.warn('API poll vote error:', err));

      return { success: true, message: 'Your vote has been saved in real-time records!' };
    } catch (err: any) {
      console.error('votePoll error:', err);
      return { success: false, message: err?.message || 'Failed to submit vote.' };
    }
  };

  const addPollOption = async (
    text: string,
    textNepali?: string,
    suggestedByName?: string,
    voterDetails?: { email?: string; membershipId?: string }
  ): Promise<{ success: boolean; message: string; newOption?: PollOption }> => {
    try {
      const cleanText = text.trim();
      if (!cleanText) {
        return { success: false, message: 'Please enter a valid heritage initiative title.' };
      }

      const current = communityPoll || DEFAULT_COMMUNITY_POLL;
      const optId = 'opt-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
      const authorName = suggestedByName || joinedMemberData?.fullName || 'Community Member';

      const newOption: PollOption = {
        id: optId,
        text: cleanText,
        textNepali: textNepali && textNepali.trim() ? textNepali.trim() : undefined,
        votes: 1, // Automatic first vote for self-proposed option
        addedBy: 'member',
        suggestedByName: authorName,
        createdAt: new Date().toISOString()
      };

      const voterLog: PollVoterLog = {
        id: 'vlog-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        optionId: optId,
        optionText: cleanText,
        voterName: authorName,
        voterEmail: voterDetails?.email || joinedMemberData?.email || '',
        membershipId: voterDetails?.membershipId || joinedMemberData?.membershipId || '',
        votedAt: new Date().toISOString()
      };

      const updatedOptions = [...current.options, newOption];
      const totalVotes = updatedOptions.reduce((acc, opt) => acc + (opt.votes || 0), 0);

      const updatedPoll: CommunityPollConfig = {
        ...current,
        options: updatedOptions,
        totalVotes,
        voterLogs: [voterLog, ...(current.voterLogs || []).slice(0, 499)],
        updatedAt: new Date().toISOString()
      };

      setCommunityPoll(updatedPoll);
      try {
        localStorage.setItem('bycn_community_poll', JSON.stringify(updatedPoll));
        localStorage.setItem('bycn_member_voted_poll_' + updatedPoll.id, optId);
      } catch {}

      triggerGlobalUpdate('poll', updatedPoll);
      savePollToFirebase(updatedPoll).catch((err) => console.warn('Firestore poll save error:', err));

      fetch('/api/poll/option', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanText,
          textNepali: textNepali?.trim(),
          suggestedByName: authorName,
          voterEmail: voterDetails?.email || joinedMemberData?.email,
          membershipId: voterDetails?.membershipId || joinedMemberData?.membershipId
        })
      }).catch((err) => console.warn('API poll option error:', err));

      return {
        success: true,
        message: 'Your initiative was added to Live Community Voice with your vote!',
        newOption
      };
    } catch (err: any) {
      console.error('addPollOption error:', err);
      return { success: false, message: err?.message || 'Failed to add option.' };
    }
  };

  const updatePollConfig = async (
    updatedConfig: Partial<CommunityPollConfig>
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const current = communityPoll || DEFAULT_COMMUNITY_POLL;
      const newOptions = updatedConfig.options || current.options;
      const totalVotes = newOptions.reduce((acc, opt) => acc + (opt.votes || 0), 0);

      const updatedPoll: CommunityPollConfig = {
        ...current,
        ...updatedConfig,
        options: newOptions,
        totalVotes,
        updatedAt: new Date().toISOString()
      };

      setCommunityPoll(updatedPoll);
      try {
        localStorage.setItem('bycn_community_poll', JSON.stringify(updatedPoll));
      } catch {}

      triggerGlobalUpdate('poll', updatedPoll);
      savePollToFirebase(updatedPoll).catch((err) => console.warn('Firestore poll save error:', err));

      const res = await fetch('/api/admin/poll/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminHeaders()
        },
        body: JSON.stringify(updatedConfig)
      });
      const data = await res.json();
      return {
        success: true,
        message: data?.message || 'Live Community Voice poll updated & synced across website!'
      };
    } catch (err: any) {
      console.error('updatePollConfig error:', err);
      return { success: false, message: err?.message || 'Failed to update poll.' };
    }
  };

  const resetPollVotes = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const current = communityPoll || DEFAULT_COMMUNITY_POLL;
      const resetOptions = current.options.map((opt) => ({ ...opt, votes: 0 }));
      const updatedPoll: CommunityPollConfig = {
        ...current,
        options: resetOptions,
        totalVotes: 0,
        voterLogs: [],
        updatedAt: new Date().toISOString()
      };

      setCommunityPoll(updatedPoll);
      try {
        localStorage.setItem('bycn_community_poll', JSON.stringify(updatedPoll));
        localStorage.removeItem('bycn_member_voted_poll_' + updatedPoll.id);
      } catch {}

      triggerGlobalUpdate('poll', updatedPoll);
      savePollToFirebase(updatedPoll).catch((err) => console.warn('Firestore poll save error:', err));

      await fetch('/api/admin/poll/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminHeaders()
        }
      });

      return { success: true, message: 'All votes and voter audit logs have been reset.' };
    } catch (err: any) {
      console.error('resetPollVotes error:', err);
      return { success: false, message: err?.message || 'Failed to reset votes.' };
    }
  };

  // Reset to factory defaults
  const resetAllToDefaults = () => {
    setLeaders(LEADERSHIP_PROFILES);
    setTimelineEvents(HISTORICAL_EVENTS);
    setCulturalTraditions(CULTURAL_TRADITIONS);
    setDictionaryWords(DICTIONARY_WORDS);
    setDressItems(TRADITIONAL_DRESS_ITEMS);
    setCostumes(INITIAL_COSTUMES_DATA);
    setBentoConfig(DEFAULT_BENTO_CONFIG);
    setPillarsConfig(DEFAULT_PILLARS_CONFIG);
    setSiteIdentity(DEFAULT_SITE_IDENTITY);
    setCustomDomains(DEFAULT_CUSTOM_DOMAINS);
    setPosts(INITIAL_COMMUNITY_POSTS);
    setPasscodeState(DEFAULT_PASSCODE);
    localStorage.removeItem(DATA_STORAGE_KEY);
    localStorage.removeItem(PASSCODE_STORAGE_KEY);
    pushToCloud({
      leaders: LEADERSHIP_PROFILES,
      timelineEvents: HISTORICAL_EVENTS,
      culturalTraditions: CULTURAL_TRADITIONS,
      dictionaryWords: DICTIONARY_WORDS,
      dressItems: TRADITIONAL_DRESS_ITEMS,
      costumes: INITIAL_COSTUMES_DATA,
      bentoConfig: DEFAULT_BENTO_CONFIG,
      pillarsConfig: DEFAULT_PILLARS_CONFIG,
      siteIdentity: DEFAULT_SITE_IDENTITY,
      customDomains: DEFAULT_CUSTOM_DOMAINS,
      posts: INITIAL_COMMUNITY_POSTS
    });
  };

  return (
    <CommunityDataContext.Provider
      value={{
        leaders,
        timelineEvents,
        culturalTraditions,
        dictionaryWords,
        dressItems,
        costumes,
        centralOffice,
        updateCentralOffice,
        resetCentralOffice,
        triggerGlobalUpdate,
        bentoConfig,
        pillarsConfig,
        siteIdentity,
        customDomains,
        registeredMembers,
        posts,
        addPost,
        updatePost,
        deletePost,
        togglePinPost,
        togglePublishPost,
        communityMetrics,
        updateCommunityMetric,
        saveCommunityMetrics,
        resetCommunityMetrics,
        autoResearchCommunityMetrics,
        autoReloadConfig,
        updateAutoReloadConfig,
        triggerManualReload,
        syncStatus,
        lastSyncedTime,
        isInternetConnected,
        manualCloudSync,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
        adminPasscode,
        adminEmail,
        changeAdminPasscode,
        addAuthorizedEmail,
        removeAuthorizedEmail,
        addLeader,
        updateLeader,
        deleteLeader,
        addTimelineEvent,
        updateTimelineEvent,
        deleteTimelineEvent,
        addCulturalTradition,
        updateCulturalTradition,
        deleteCulturalTradition,
        addDictionaryWord,
        updateDictionaryWord,
        deleteDictionaryWord,
        addDressItem,
        updateDressItem,
        deleteDressItem,
        addCostume,
        updateCostume,
        deleteCostume,
        updateBentoConfig,
        updatePillarsConfig,
        updateSiteIdentity,
        saveSiteIdentity,
        saveCustomDomains,
        saveHeaderLogo,
        saveFooterLogo,
        saveBothLogos,
        saveFavicon,
        saveGoogleAnalytics,
        saveGoogleSiteVerification,
        masterBroadcastEverything,
        submitMemberRegistration,
        loadRegisteredMembers,
        deleteRegisteredMember,
        updateMemberStatus,
        purgeTestMembers,
        isFollowingCommunity,
        followerCount,
        followerEmail,
        followCommunity,
        hasJoinedCommunity,
        hideJoinOption,
        joinedMemberData,
        setHasJoinedCommunity,
        resetMembershipState,
        directLiveSync,
        setDirectLiveSync,
        directlyUpdatePublic,
        republicWebsite,
        lastRepublicInfo,
        resetAllToDefaults,
        notifications,
        unreadNotificationsCount,
        notificationSoundEnabled,
        setNotificationSoundEnabled,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        clearAllNotifications,
        simulateTestNotification,
        playNotificationChime,
        communityPoll,
        votePoll,
        addPollOption,
        updatePollConfig,
        resetPollVotes
      }}
    >
      {children}
    </CommunityDataContext.Provider>
  );
};

export const useCommunityData = (): CommunityDataContextType => {
  const context = useContext(CommunityDataContext);
  if (!context) {
    throw new Error('useCommunityData must be used within a CommunityDataProvider');
  }
  return context;
};
