/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Language } from '../types';
import { triggerFullWebsiteTranslation, purgeGoogleTranslateArtifacts } from '../utils/fullSiteTranslator';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
  isNepali: boolean;
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Language Meta
    'lang.name': 'English',
    'lang.code': 'en',
    'lang.switch_prompt': 'Switch to Nepali',

    // Brand & Ribbon
    'brand.title': 'Bote Youth Community',
    'brand.org_full': 'Bote Youth Community Nepal',
    'brand.tagline': 'Preserving Heritage • Empowering the Future',
    'brand.location': 'Karmaiya, Sarlahi District',
    'brand.ribbon_heritage': 'Bagmati & Narayani River Basin Indigenous Heritage',
    'brand.symbol': '🇳🇵',

    // Navigation Tabs
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.history': 'History',
    'nav.traditions': 'Traditions',
    'nav.cultures': 'Cultures & River Rituals',
    'nav.language': 'Bote Language (Tarahi)',
    'nav.dress': 'Culture Dress & Silver Ornaments',
    'nav.leaders': 'Leaders',
    'nav.programs': 'Programs',
    'nav.scholarships': 'Scholarships',
    'nav.notices': 'Notices',
    'nav.community': 'Community',
    'nav.admin': 'Admin',

    // Actions & Buttons
    'action.join': 'Join Us',
    'action.join_get_id': 'Join Us & Get Digital ID',
    'action.my_id': 'My Member ID',
    'action.view_id': 'View My Member ID Card',
    'action.follow': 'Follow',
    'action.following': 'Following',
    'action.verified_member': 'Verified Member',
    'action.verified_follower': 'Verified Follower Active',
    'action.search_placeholder': 'Search community...',
    'action.notifications': 'Notifications',
    'action.close': 'Close',
    'action.save': 'Save',
    'action.apply': 'Apply',
    'action.explore': 'Explore Heritage',
    'action.read_more': 'Read More',
    'action.view_program': 'View Program',

    // Hero Section
    'hero.badge': 'BoteYouthCommunityNepal | Indigenous Cultural Pride',
    'hero.title_prefix': 'Preserving Our River Heritage,',
    'hero.title_highlight': 'Empowering Bote Youth',
    'hero.subtitle': 'Official portal of the Bote Community of Karmaiya, Sarlahi District, Nepal. Safeguarding our ancient single-log canoe craft, revitalizing the endangered Tarahi Bote language, and funding education for the next generation.',

    // Footer & Contacts
    'footer.heritage_identity': 'HERITAGE & IDENTITY',
    'footer.youth_grants': 'YOUTH LEADERSHIP & GRANTS',
    'footer.central_office': 'KARMAIYA CENTRAL OFFICE',
    'footer.hotline': 'Hotline',
    'footer.email': 'Official Email',
    'footer.rights': 'Honoring Indigenous Water Traditions.',
    'footer.newsletter': 'Join Cultural Newsletter',
    'footer.newsletter_btn': 'Join',

    // Language Switcher Component
    'switcher.label': 'Language',
    'switcher.nepali': 'नेपाली',
    'switcher.english': 'English',
    'switcher.active': 'Active Language',

    // Scroll Progress & UX
    'scroll.top': 'Scroll to top',
    'scroll.progress': 'Reading Progress & Scroll to Top'
  },
  ne: {
    // Language Meta
    'lang.name': 'नेपाली',
    'lang.code': 'ne',
    'lang.switch_prompt': 'Switch to English',

    // Brand & Ribbon
    'brand.title': 'बोटे युवा समुदाय',
    'brand.org_full': 'नेपाल बोटे युवा समुदाय',
    'brand.tagline': 'सम्पदाको संरक्षण • भविष्यको सशक्तीकरण',
    'brand.location': 'कर्मैया, सर्लाही जिल्ला',
    'brand.ribbon_heritage': 'बागमती तथा नारायणी नदी तटीय आदिवासी सम्पदा',
    'brand.symbol': '🇳🇵',

    // Navigation Tabs
    'nav.home': 'गृहपृष्ठ',
    'nav.about': 'हाम्रो बारेमा',
    'nav.history': 'इतिहास',
    'nav.traditions': 'परम्परा',
    'nav.cultures': 'संस्कृति तथा जल पूजा',
    'nav.language': 'तराही बोटे भाषा',
    'nav.dress': 'सांस्कृतिक पोशाक र गहना',
    'nav.leaders': 'नेतृत्व',
    'nav.programs': 'कार्यक्रमहरू',
    'nav.scholarships': 'छात्रवृत्ति',
    'nav.notices': 'सूचनाहरू',
    'nav.community': 'समुदाय',
    'nav.admin': 'व्यवस्थापक',

    // Actions & Buttons
    'action.join': 'सदस्य बन्नुहोस्',
    'action.join_get_id': 'सदस्य बन्नुहोस् र डिजिटल परिचयपत्र लिनुहोस्',
    'action.my_id': 'मेरो परिचयपत्र',
    'action.view_id': 'मेरो डिजिटल परिचयपत्र हेर्नुहोस्',
    'action.follow': 'फलो गर्नुहोस्',
    'action.following': 'फलो गरिएको',
    'action.verified_member': 'प्रमाणित सदस्य',
    'action.verified_follower': 'सक्रिय अनुयायी (प्रमाणित)',
    'action.search_placeholder': 'समुदाय, नेतृत्व खोज्नुहोस्...',
    'action.notifications': 'सूचनाहरू',
    'action.close': 'बन्द गर्नुहोस्',
    'action.save': 'सुरक्षित गर्नुहोस्',
    'action.apply': 'आवेदन दिनुहोस्',
    'action.explore': 'सम्पदा अन्वेषण',
    'action.read_more': 'थप पढ्नुहोस्',
    'action.view_program': 'कार्यक्रम हेर्नुहोस्',

    // Hero Section
    'hero.badge': 'नेपाल बोटे युवा समुदाय | आदिवासी सांस्कृतिक गौरव',
    'hero.title_prefix': 'हाम्रो जल सम्पदाको संरक्षण,',
    'hero.title_highlight': 'बोटे युवाहरूको सशक्तीकरण',
    'hero.subtitle': 'सर्लाही जिल्लाको कर्मैयास्थित बोटे समुदायको आधिकारिक डिजिटल पोर्टल। हाम्रो प्राचीन एक-ढुङ्गे काठको डुङ्गा कलाको संरक्षण, लोपोन्मुख तराही बोटे भाषाको पुनरुत्थान, र आगामी पुस्ताको शिक्षा प्रवर्द्धन।',

    // Footer & Contacts
    'footer.heritage_identity': 'सम्पदा तथा पहिचान',
    'footer.youth_grants': 'युवा नेतृत्व तथा अनुदान',
    'footer.central_office': 'कर्मैया केन्द्रीय कार्यालय',
    'footer.hotline': 'हटलाइन',
    'footer.email': 'आधिकारिक इमेल',
    'footer.rights': 'जल सभ्यता तथा नदी परम्पराको सम्मान।',
    'footer.newsletter': 'सांस्कृतिक समाचार सदस्यता',
    'footer.newsletter_btn': 'दर्ता हुनुहोस्',

    // Language Switcher Component
    'switcher.label': 'भाषा (Language)',
    'switcher.nepali': 'नेपाली',
    'switcher.english': 'English',
    'switcher.active': 'हालको भाषा',

    // Scroll Progress & UX
    'scroll.top': 'शीर्षमा फर्कनुहोस्',
    'scroll.progress': 'पठन प्रगति तथा माथि जानुहोस्'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bycn_user_language');
      if (saved === 'ne' || saved === 'en') {
        return saved;
      }
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bycn_user_language', lang);
      document.documentElement.lang = lang;
      triggerFullWebsiteTranslation(lang);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ne' : 'en');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      purgeGoogleTranslateArtifacts();
      document.documentElement.lang = language;
      triggerFullWebsiteTranslation(language);
    }
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English dictionary
    if (TRANSLATIONS.en && TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    return fallback || key;
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
      isNepali: language === 'ne'
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
