/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeType } from '../types';
import { DEFAULT_LOGO_URL } from '../data/communityData';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  headerLogo: string;
  footerLogo: string;
  setHeaderLogo: (logo: string) => void;
  setFooterLogo: (logo: string) => void;
  resetLogos: () => void;
  handleLogoFileUpload: (file: File, target: 'header' | 'footer' | 'both') => Promise<string>;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    cardBg: string;
    text: string;
    border: string;
    heroGradient: string;
    badgeBg: string;
  };
}

const THEME_COLORS: Record<ThemeType, ThemeContextType['colors']> = {
  // 🇳🇵 Authentic Nepali Flag Theme: Crimson Red, Royal Deep Blue & Crisp White
  'nepali-flag': {
    primary: '#DC143C',      // Nepali Flag Crimson Red
    secondary: '#003893',    // Nepali Flag Royal Deep Blue
    accent: '#F59E0B',       // Auspicious Sun/Moon Gold
    bg: '#F8FAFC',           // Pure Crisp Canvas
    cardBg: '#FFFFFF',
    text: '#0F172A',
    border: '#E2E8F0',
    heroGradient: 'from-[#002868] via-[#8B0000] to-[#DC143C]',
    badgeBg: 'bg-red-50 text-[#DC143C] border-red-200'
  },
  'royal-heritage': {
    primary: '#990000',
    secondary: '#1A365D',
    accent: '#D97706',
    bg: '#FFFDF9',
    cardBg: '#FFFFFF',
    text: '#1C1917',
    border: '#F3E8D8',
    heroGradient: 'from-[#1A365D] via-[#7B1113] to-[#990000]',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  'riverine-teal': {
    primary: '#00695C',
    secondary: '#0D47A1',
    accent: '#FFB300',
    bg: '#F4FBFB',
    cardBg: '#FFFFFF',
    text: '#0F172A',
    border: '#E0F2F1',
    heroGradient: 'from-[#004D40] via-[#00695C] to-[#0D47A1]',
    badgeBg: 'bg-teal-50 text-[#00695C] border-teal-200'
  },
  'midnight-cultural': {
    primary: '#EF4444',
    secondary: '#3B82F6',
    accent: '#FBBF24',
    bg: '#090D16',
    cardBg: '#131B2E',
    text: '#F8FAFC',
    border: '#1E293B',
    heroGradient: 'from-[#020617] via-[#0F172A] to-[#1E1B4B]',
    badgeBg: 'bg-slate-800 text-red-400 border-slate-700'
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    return (localStorage.getItem('bycn_theme') as ThemeType) || 'nepali-flag';
  });

  const [headerLogo, setHeaderLogoState] = useState<string>(() => {
    const saved = localStorage.getItem('bycn_header_logo');
    return saved && saved.trim() ? saved.trim() : DEFAULT_LOGO_URL;
  });

  const [footerLogo, setFooterLogoState] = useState<string>(() => {
    const saved = localStorage.getItem('bycn_footer_logo');
    return saved && saved.trim() ? saved.trim() : DEFAULT_LOGO_URL;
  });

  // Cross-tab and real-time synchronization
  useEffect(() => {
    // Initial fetch from master server to guarantee cross-device sync
    fetch('/api/community-data')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data?.siteIdentity) {
          const { headerLogo: hl, footerLogo: fl, theme: th } = json.data.siteIdentity;
          if (hl && hl.trim()) {
            setHeaderLogoState(hl.trim());
            localStorage.setItem('bycn_header_logo', hl.trim());
          }
          if (fl && fl.trim()) {
            setFooterLogoState(fl.trim());
            localStorage.setItem('bycn_footer_logo', fl.trim());
          }
          if (th && th.trim()) {
            setThemeState(th as ThemeType);
            localStorage.setItem('bycn_theme', th);
          }
        }
      })
      .catch((err) => console.warn('Failed to fetch server identity in ThemeContext:', err));

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'bycn_theme' && e.newValue) {
        setThemeState(e.newValue as ThemeType);
      }
      if (e.key === 'bycn_header_logo' && e.newValue) {
        setHeaderLogoState(e.newValue);
      }
      if (e.key === 'bycn_footer_logo' && e.newValue) {
        setFooterLogoState(e.newValue);
      }
    };

    const handleCustomUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        if (customEvent.detail.headerLogo) {
          setHeaderLogoState(customEvent.detail.headerLogo);
        }
        if (customEvent.detail.footerLogo) {
          setFooterLogoState(customEvent.detail.footerLogo);
        }
        if (customEvent.detail.theme) {
          setThemeState(customEvent.detail.theme);
        }
      } else {
        const hl = localStorage.getItem('bycn_header_logo');
        const fl = localStorage.getItem('bycn_footer_logo');
        const th = localStorage.getItem('bycn_theme');
        if (hl) setHeaderLogoState(hl);
        if (fl) setFooterLogoState(fl);
        if (th) setThemeState(th as ThemeType);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('bycn_theme_updated', handleCustomUpdate);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('bycn_theme_updated', handleCustomUpdate);
    };
  }, []);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('bycn_theme', newTheme);
  };

  const setHeaderLogo = (logo: string) => {
    const safe = logo && logo.trim() ? logo.trim() : DEFAULT_LOGO_URL;
    setHeaderLogoState(safe);
    localStorage.setItem('bycn_header_logo', safe);

    // Broadcast update to server immediately
    fetch('/api/site-logo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ headerLogo: safe })
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.siteIdentity?.headerLogo) {
          setHeaderLogoState(data.siteIdentity.headerLogo);
          localStorage.setItem('bycn_header_logo', data.siteIdentity.headerLogo);
        }
      })
      .catch((err) => console.warn('Could not sync header logo to server:', err));
  };

  const setFooterLogo = (logo: string) => {
    const safe = logo && logo.trim() ? logo.trim() : DEFAULT_LOGO_URL;
    setFooterLogoState(safe);
    localStorage.setItem('bycn_footer_logo', safe);

    // Broadcast update to server immediately
    fetch('/api/site-logo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ footerLogo: safe })
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.siteIdentity?.footerLogo) {
          setFooterLogoState(data.siteIdentity.footerLogo);
          localStorage.setItem('bycn_footer_logo', data.siteIdentity.footerLogo);
        }
      })
      .catch((err) => console.warn('Could not sync footer logo to server:', err));
  };

  const resetLogos = () => {
    setHeaderLogoState(DEFAULT_LOGO_URL);
    setFooterLogoState(DEFAULT_LOGO_URL);
    localStorage.removeItem('bycn_header_logo');
    localStorage.removeItem('bycn_footer_logo');
    fetch('/api/site-logo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ headerLogo: DEFAULT_LOGO_URL, footerLogo: DEFAULT_LOGO_URL })
    }).catch((e) => console.warn('Reset logo sync failed:', e));
  };

  const handleLogoFileUpload = (file: File, target: 'header' | 'footer' | 'both'): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please upload a valid image file'));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        if (target === 'header' || target === 'both') {
          setHeaderLogo(dataUrl);
        }
        if (target === 'footer' || target === 'both') {
          setFooterLogo(dataUrl);
        }
        resolve(dataUrl);
      };
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });
  };

  const colors = THEME_COLORS[theme];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        headerLogo,
        footerLogo,
        setHeaderLogo,
        setFooterLogo,
        resetLogos,
        handleLogoFileUpload,
        colors
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
