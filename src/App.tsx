/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { CommunityDataProvider } from './context/CommunityDataContext';
import { LanguageProvider } from './context/LanguageContext';
import { TabType, LeaderProfile } from './types';
import { AnimatePresence, motion } from 'motion/react';
import ErrorBoundary from './components/ErrorBoundary';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import JoiningForm from './components/JoiningForm';
import ThemeCustomizerModal from './components/ThemeCustomizerModal';
import LeadershipModal from './components/LeadershipModal';
import ScrollProgressBar from './components/ScrollProgressBar';
import FloatingBackToTop from './components/FloatingBackToTop';

// Views
import HomeView from './views/HomeView';
import AboutView from './views/AboutView';
import HistoryView from './views/HistoryView';
import CulturesView from './views/CulturesView';
import LanguageView from './views/LanguageView';
import CultureDressView from './views/CultureDressView';
import LeadersView from './views/LeadersView';
import EmpowerView from './views/EmpowerView';
import ScholarshipsView from './views/ScholarshipsView';
import FollowView from './views/FollowView';
import ThemeStudioView from './views/ThemeStudioView';
import AdminPanelView from './views/AdminPanelView';
import NoticesView from './views/NoticesView';

const TAB_HASH_MAP: Record<string, TabType> = {
  home: 'home',
  about: 'about',
  history: 'history',
  culture: 'cultures',
  cultures: 'cultures',
  language: 'language',
  dress: 'dress',
  costumes: 'dress',
  leaders: 'leaders',
  leadership: 'leaders',
  empower: 'empower',
  join: 'join',
  register: 'join',
  scholarships: 'scholarships',
  scholarship: 'scholarships',
  notices: 'notices',
  notice: 'notices',
  follow: 'follow',
  'themes-studio': 'themes-studio',
  admin: 'admin',
  'central-office': 'home'
};

function getInitialTab(): TabType {
  if (typeof window === 'undefined') return 'home';
  const rawHash = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
  if (rawHash && TAB_HASH_MAP[rawHash]) {
    return TAB_HASH_MAP[rawHash];
  }
  return 'home';
}

function MainApp() {
  const [currentTab, setCurrentTab] = useState<TabType>(getInitialTab);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState<LeaderProfile | null>(null);
  const { colors } = useTheme();

  // Sync hash change from browser navigation (back/forward, external hash links)
  useEffect(() => {
    const handleHashChange = () => {
      const targetTab = getInitialTab();
      setCurrentTab(targetTab);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // Update URL hash and scroll to top on tab change
  const handleSetTab = (tab: TabType) => {
    setCurrentTab(tab);
    if (window.location.hash.replace(/^#\/?/, '') !== tab) {
      window.history.pushState(null, '', `#${tab}`);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  return (
    <div
      className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col font-sans selection:bg-[#DC143C] selection:text-white"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {/* Scroll-to-Top Progress Bar (Pinned at the very top of viewport) */}
      <ScrollProgressBar />

      {/* Sticky Responsive Header with Custom Logo and Theme Trigger */}
      <Header
        currentTab={currentTab}
        setCurrentTab={handleSetTab}
        openCustomizer={() => setIsCustomizerOpen(true)}
        onSelectLeader={(leader) => setSelectedLeader(leader)}
      />

      {/* Main View Router with Modern Animated Page Transitions */}
      <main className="flex-1 overflow-x-hidden flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 14, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.995 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 w-full"
          >
            {currentTab === 'home' && (
              <HomeView
                setCurrentTab={handleSetTab}
                openCustomizer={() => setIsCustomizerOpen(true)}
                onSelectLeader={(leader) => setSelectedLeader(leader)}
              />
            )}
            {currentTab === 'about' && <AboutView setCurrentTab={handleSetTab} />}
            {currentTab === 'history' && <HistoryView setCurrentTab={handleSetTab} />}
            {currentTab === 'cultures' && <CulturesView setCurrentTab={handleSetTab} />}
            {currentTab === 'language' && <LanguageView setCurrentTab={handleSetTab} />}
            {currentTab === 'dress' && <CultureDressView setCurrentTab={handleSetTab} />}
            {currentTab === 'leaders' && (
              <LeadersView
                setCurrentTab={handleSetTab}
                onSelectLeader={(leader) => setSelectedLeader(leader)}
              />
            )}
            {currentTab === 'empower' && <EmpowerView setCurrentTab={handleSetTab} />}
            {currentTab === 'join' && (
              <div className="py-10">
                <JoiningForm />
              </div>
            )}
            {currentTab === 'scholarships' && <ScholarshipsView setCurrentTab={handleSetTab} />}
            {currentTab === 'notices' && <NoticesView setCurrentTab={handleSetTab} />}
            {currentTab === 'follow' && <FollowView setCurrentTab={handleSetTab} />}
            {currentTab === 'themes-studio' && (
              <ThemeStudioView
                setCurrentTab={handleSetTab}
                openCustomizer={() => setIsCustomizerOpen(true)}
              />
            )}
            {currentTab === 'admin' && (
              <AdminPanelView setCurrentTab={handleSetTab} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer with Logo & Contact */}
      <Footer
        setCurrentTab={handleSetTab}
        openCustomizer={() => setIsCustomizerOpen(true)}
      />

      {/* Modals */}
      <ThemeCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
      />

      <LeadershipModal
        leader={selectedLeader}
        onClose={() => setSelectedLeader(null)}
      />

      {/* Floating Back-to-Top Button (Appears in bottom-right on scroll) */}
      <FloatingBackToTop />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <CommunityDataProvider>
          <LanguageProvider>
            <MainApp />
          </LanguageProvider>
        </CommunityDataProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
