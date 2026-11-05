/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Firestore,
  Unsubscribe
} from 'firebase/firestore';
import { RegisteredMember, KarmaiyaCentralOfficeDetails, CommunityPost, CommunityNotification, CommunityPollConfig } from '../types';

export const firebaseConfig = {
  projectId: "intrepid-container-dghtt",
  appId: "1:304976336404:web:d63fdefb479092f6e53901",
  apiKey: "AIzaSyB7IR8RFXQXQQqiyoBMk8KJs2vtBRo7tY4",
  authDomain: "intrepid-container-dghtt.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-boteyouthcommuni-33bab8a3-45fd-4fe0-8042-c6c14138a400",
  storageBucket: "intrepid-container-dghtt.firebasestorage.app",
  messagingSenderId: "304976336404"
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
  }
  return app;
}

export function getFirestoreDb(): Firestore {
  if (!db) {
    const fApp = getFirebaseApp();
    try {
      // Initialize with specific databaseId if provided
      if (firebaseConfig.firestoreDatabaseId) {
        db = getFirestore(fApp, firebaseConfig.firestoreDatabaseId);
      } else {
        db = getFirestore(fApp);
      }
    } catch {
      // Fallback to default firestore instance
      db = getFirestore(fApp);
    }
  }
  return db;
}

const MEMBERS_COLLECTION = 'community_members';

/**
 * Fetch all community members directly from Firebase Firestore.
 */
export async function fetchMembersFromFirebase(): Promise<RegisteredMember[]> {
  try {
    const firestore = getFirestoreDb();
    const colRef = collection(firestore, MEMBERS_COLLECTION);
    const snapshot = await getDocs(colRef);
    
    const members: RegisteredMember[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as Partial<RegisteredMember>;
      members.push({
        id: docSnap.id,
        name: data.name || 'Member',
        nameNepali: data.nameNepali || '',
        email: data.email || '',
        phone: data.phone || '',
        ward: data.ward || '11',
        municipality: data.municipality || 'Bagmati Municipality',
        district: data.district || 'Sarlahi',
        age: data.age || 20,
        gender: data.gender || 'Not Specified',
        category: data.category || 'Youth Member',
        interest: data.interest || 'Cultural Heritage & River Conservation',
        education: data.education || 'Secondary / Higher Secondary',
        photoUrl: data.photoUrl || '',
        registeredAt: data.registeredAt || new Date().toISOString(),
        updatedAt: data.updatedAt,
        notes: data.notes,
        status: (data.status as 'active' | 'verified' | 'pending') || 'active',
        membershipId: data.membershipId || `BYCN-2026-0000`,
        ipMasked: data.ipMasked
      });
    });

    // Sort by registeredAt descending
    members.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
    return members;
  } catch (err) {
    console.warn('Error fetching members from Firebase Firestore:', err);
    return [];
  }
}

/**
 * Save or update a member in Firebase Firestore.
 */
export async function saveMemberToFirebase(member: RegisteredMember): Promise<boolean> {
  try {
    const firestore = getFirestoreDb();
    const memberId = member.id || `mem-${Date.now()}`;
    const docRef = doc(firestore, MEMBERS_COLLECTION, memberId);
    
    await setDoc(docRef, {
      ...member,
      id: memberId,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    return true;
  } catch (err) {
    console.warn('Error saving member to Firebase:', err);
    return false;
  }
}

/**
 * Delete a member from Firebase Firestore.
 */
export async function deleteMemberFromFirebase(id: string): Promise<boolean> {
  try {
    const firestore = getFirestoreDb();
    const docRef = doc(firestore, MEMBERS_COLLECTION, id);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.warn('Error deleting member from Firebase:', err);
    return false;
  }
}

/**
 * Update member verification status or notes in Firebase Firestore.
 */
export async function updateMemberStatusInFirebase(
  id: string,
  status: 'active' | 'verified' | 'pending',
  notes?: string
): Promise<boolean> {
  try {
    const firestore = getFirestoreDb();
    const docRef = doc(firestore, MEMBERS_COLLECTION, id);
    const updates: Record<string, any> = {
      status,
      updatedAt: new Date().toISOString()
    };
    if (notes !== undefined) {
      updates.notes = notes;
    }
    await updateDoc(docRef, updates);
    return true;
  } catch (err) {
    console.warn('Error updating member status in Firebase:', err);
    return false;
  }
}

/**
 * Sync batch of members to Firebase Firestore.
 */
export async function syncMembersBatchToFirebase(members: RegisteredMember[]): Promise<number> {
  let synced = 0;
  for (const member of members) {
    const success = await saveMemberToFirebase(member);
    if (success) synced++;
  }
  return synced;
}

/**
 * Real-time subscription to Firebase Firestore members collection.
 */
export function subscribeToFirebaseMembers(
  onUpdate: (members: RegisteredMember[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  try {
    const firestore = getFirestoreDb();
    const colRef = collection(firestore, MEMBERS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const members: RegisteredMember[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Partial<RegisteredMember>;
          members.push({
            id: docSnap.id,
            name: data.name || 'Member',
            nameNepali: data.nameNepali || '',
            email: data.email || '',
            phone: data.phone || '',
            ward: data.ward || '11',
            municipality: data.municipality || 'Bagmati Municipality',
            district: data.district || 'Sarlahi',
            age: data.age || 20,
            gender: data.gender || 'Not Specified',
            category: data.category || 'Youth Member',
            interest: data.interest || 'Cultural Heritage & River Conservation',
            education: data.education || 'Secondary / Higher Secondary',
            photoUrl: data.photoUrl || '',
            registeredAt: data.registeredAt || new Date().toISOString(),
            updatedAt: data.updatedAt,
            notes: data.notes,
            status: (data.status as 'active' | 'verified' | 'pending') || 'active',
            membershipId: data.membershipId || `BYCN-2026-0000`,
            ipMasked: data.ipMasked
          });
        });
        members.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
        onUpdate(members);
      },
      (err) => {
        console.warn('Firestore subscription error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to Firestore:', err);
    return () => {};
  }
}

const CONFIG_COLLECTION = 'community_config';
const CONTENT_COLLECTION = 'community_content';
const SITE_SETTINGS_DOC_ID = 'site_settings';
const MASTER_CONTENT_DOC_ID = 'master_data';

export interface FirebaseSiteSettings {
  headerLogo?: string;
  footerLogo?: string;
  theme?: string;
  siteName?: string;
  tagline?: string;
  updatedAt?: string;
  [key: string]: any;
}

/**
 * Save site identity settings (Header Logo, Footer Logo, Theme, etc.) to Firestore.
 */
export async function saveSiteSettingsToFirebase(settings: FirebaseSiteSettings): Promise<boolean> {
  try {
    const firestore = getFirestoreDb();
    const docRef = doc(firestore, CONFIG_COLLECTION, SITE_SETTINGS_DOC_ID);
    await setDoc(docRef, {
      ...settings,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn('Error saving site settings to Firebase Firestore:', err);
    return false;
  }
}

/**
 * Fetch site identity settings from Firestore.
 */
export async function fetchSiteSettingsFromFirebase(): Promise<FirebaseSiteSettings | null> {
  try {
    const firestore = getFirestoreDb();
    const docRef = doc(firestore, CONFIG_COLLECTION, SITE_SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as FirebaseSiteSettings;
    }
    return null;
  } catch (err) {
    console.warn('Error fetching site settings from Firebase Firestore:', err);
    return null;
  }
}

/**
 * Real-time listener for site identity settings from Firestore.
 */
export function subscribeToSiteSettings(
  onUpdate: (settings: FirebaseSiteSettings) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  try {
    const firestore = getFirestoreDb();
    const docRef = doc(firestore, CONFIG_COLLECTION, SITE_SETTINGS_DOC_ID);
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          onUpdate(docSnap.data() as FirebaseSiteSettings);
        }
      },
      (err) => {
        console.warn('Firestore site settings subscription error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to site settings in Firestore:', err);
    return () => {};
  }
}

/**
 * Save master community content (Leaders, History, Dress, Language, Metrics) to Firestore.
 */
export async function saveMasterDataToFirebase(data: Record<string, any>): Promise<boolean> {
  try {
    const firestore = getFirestoreDb();
    const docRef = doc(firestore, CONTENT_COLLECTION, MASTER_CONTENT_DOC_ID);
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn('Error saving master content to Firebase Firestore:', err);
    return false;
  }
}

/**
 * Fetch master community content from Firestore.
 */
export async function fetchMasterDataFromFirebase(): Promise<Record<string, any> | null> {
  try {
    const firestore = getFirestoreDb();
    const docRef = doc(firestore, CONTENT_COLLECTION, MASTER_CONTENT_DOC_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (err) {
    console.warn('Error fetching master content from Firebase Firestore:', err);
    return null;
  }
}

/**
 * Real-time listener for master community content from Firestore.
 */
export function subscribeToMasterData(
  onUpdate: (data: Record<string, any>) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  try {
    const firestore = getFirestoreDb();
    const docRef = doc(firestore, CONTENT_COLLECTION, MASTER_CONTENT_DOC_ID);
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          onUpdate(docSnap.data());
        }
      },
      (err) => {
        console.warn('Firestore master content subscription error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to master content in Firestore:', err);
    return () => {};
  }
}

export const CENTRAL_OFFICE_DOC_ID = 'central_office';

/**
 * Save Karmaiya Central Office full details to Firestore.
 */
export async function saveCentralOfficeToFirebase(office: KarmaiyaCentralOfficeDetails): Promise<boolean> {
  try {
    const firestore = getFirestoreDb();
    const docRef = doc(firestore, CONFIG_COLLECTION, CENTRAL_OFFICE_DOC_ID);
    await setDoc(docRef, {
      ...office,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn('Error saving Central Office details to Firebase Firestore:', err);
    return false;
  }
}

/**
 * Fetch Karmaiya Central Office full details from Firestore.
 */
export async function fetchCentralOfficeFromFirebase(): Promise<KarmaiyaCentralOfficeDetails | null> {
  try {
    const firestore = getFirestoreDb();
    const docRef = doc(firestore, CONFIG_COLLECTION, CENTRAL_OFFICE_DOC_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as KarmaiyaCentralOfficeDetails;
    }
    return null;
  } catch (err) {
    console.warn('Error fetching Central Office details from Firebase Firestore:', err);
    return null;
  }
}

/**
 * Real-time listener for Karmaiya Central Office details from Firestore.
 */
export function subscribeToCentralOffice(
  onUpdate: (data: KarmaiyaCentralOfficeDetails) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  try {
    const firestore = getFirestoreDb();
    const docRef = doc(firestore, CONFIG_COLLECTION, CENTRAL_OFFICE_DOC_ID);
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          onUpdate(docSnap.data() as KarmaiyaCentralOfficeDetails);
        }
      },
      (err) => {
        console.warn('Firestore Central Office subscription error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to Central Office in Firestore:', err);
    return () => {};
  }
}

export const POSTS_DOC_ID = 'community_posts';

/**
 * Save notices, meetings, documents, and community posts to Firestore.
 */
export async function savePostsToFirebase(posts: CommunityPost[]): Promise<boolean> {
  try {
    const firestore = getFirestoreDb();
    const docRef = doc(firestore, CONTENT_COLLECTION, POSTS_DOC_ID);
    await setDoc(
      docRef,
      {
        posts,
        updatedAt: new Date().toISOString(),
        lastUpdated: Date.now()
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.warn('Error saving posts to Firebase Firestore:', err);
    return false;
  }
}

/**
 * Fetch notices, meetings, documents, and community posts from Firestore.
 */
export async function fetchPostsFromFirebase(): Promise<CommunityPost[] | null> {
  try {
    const firestore = getFirestoreDb();
    const docRef = doc(firestore, CONTENT_COLLECTION, POSTS_DOC_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (Array.isArray(data.posts)) {
        return data.posts as CommunityPost[];
      }
    }
    return null;
  } catch (err) {
    console.warn('Error fetching posts from Firebase Firestore:', err);
    return null;
  }
}

/**
 * Real-time listener for community posts, notices, and documents from Firestore.
 */
export function subscribeToPosts(
  onUpdate: (posts: CommunityPost[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  try {
    const firestore = getFirestoreDb();
    const docRef = doc(firestore, CONTENT_COLLECTION, POSTS_DOC_ID);
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (Array.isArray(data.posts)) {
            onUpdate(data.posts as CommunityPost[]);
          }
        }
      },
      (err) => {
        console.warn('Firestore posts subscription error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to posts in Firestore:', err);
    return () => {};
  }
}

const NOTIFICATIONS_DOC_ID = 'community_notifications';

/**
 * Save notifications list to Firestore.
 */
export async function saveNotificationsToFirebase(notifications: CommunityNotification[]): Promise<boolean> {
  try {
    const firestore = getFirestoreDb();
    const docRef = doc(firestore, CONTENT_COLLECTION, NOTIFICATIONS_DOC_ID);
    await setDoc(
      docRef,
      {
        notifications,
        updatedAt: new Date().toISOString(),
        lastUpdated: Date.now()
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.warn('Error saving notifications to Firebase Firestore:', err);
    return false;
  }
}

/**
 * Fetch notifications list from Firestore.
 */
export async function fetchNotificationsFromFirebase(): Promise<CommunityNotification[] | null> {
  try {
    const firestore = getFirestoreDb();
    const docRef = doc(firestore, CONTENT_COLLECTION, NOTIFICATIONS_DOC_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (Array.isArray(data.notifications)) {
        return data.notifications as CommunityNotification[];
      }
    }
    return null;
  } catch (err) {
    console.warn('Error fetching notifications from Firebase Firestore:', err);
    return null;
  }
}

/**
 * Real-time listener for community notifications from Firestore.
 */
export function subscribeToNotifications(
  onUpdate: (notifications: CommunityNotification[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  try {
    const firestore = getFirestoreDb();
    const docRef = doc(firestore, CONTENT_COLLECTION, NOTIFICATIONS_DOC_ID);
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (Array.isArray(data.notifications)) {
            onUpdate(data.notifications as CommunityNotification[]);
          }
        }
      },
      (err) => {
        console.warn('Firestore notifications subscription error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to notifications in Firestore:', err);
    return () => {};
  }
}

export const POLL_DOC_ID = 'community_poll';

/**
 * Save live community poll config and votes to Firestore.
 */
export async function savePollToFirebase(poll: CommunityPollConfig): Promise<boolean> {
  try {
    const firestore = getFirestoreDb();
    const docRef = doc(firestore, CONTENT_COLLECTION, POLL_DOC_ID);
    await setDoc(
      docRef,
      {
        ...poll,
        updatedAt: new Date().toISOString(),
        lastUpdated: Date.now()
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.warn('Error saving poll to Firebase Firestore:', err);
    return false;
  }
}

/**
 * Fetch live community poll from Firestore.
 */
export async function fetchPollFromFirebase(): Promise<CommunityPollConfig | null> {
  try {
    const firestore = getFirestoreDb();
    const docRef = doc(firestore, CONTENT_COLLECTION, POLL_DOC_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as CommunityPollConfig;
    }
    return null;
  } catch (err) {
    console.warn('Error fetching poll from Firebase Firestore:', err);
    return null;
  }
}

/**
 * Real-time listener for community poll from Firestore.
 */
export function subscribeToPoll(
  onUpdate: (poll: CommunityPollConfig) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  try {
    const firestore = getFirestoreDb();
    const docRef = doc(firestore, CONTENT_COLLECTION, POLL_DOC_ID);
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          onUpdate(docSnap.data() as CommunityPollConfig);
        }
      },
      (err) => {
        console.warn('Firestore poll subscription error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to poll in Firestore:', err);
    return () => {};
  }
}

