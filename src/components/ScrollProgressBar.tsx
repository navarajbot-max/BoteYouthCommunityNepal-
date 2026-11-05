/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { t, isNepali } = useLanguage();

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    if (scrollHeight <= 0) {
      setScrollProgress(0);
      setIsVisible(false);
      return;
    }

    const progress = Math.min(Math.max((scrollTop / scrollHeight) * 100, 0), 100);
    setScrollProgress(progress);
    setIsVisible(scrollTop > 220);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const roundedPercent = Math.round(scrollProgress);

  return (
    <>
      {/* ============================================================ */}
      {/* 1. TOP PROGRESS BAR (Fixed at the very top of the app)       */}
      {/* ============================================================ */}
      <aside
        id="scroll-to-top-progress-bar"
        aria-label={t('scroll.progress', 'Reading Progress & Scroll to Top')}
        onClick={scrollToTop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={
          isNepali
            ? `पठन प्रगति: ${roundedPercent}% | माथि जान यहाँ क्लिक गर्नुहोस्`
            : `Reading Progress: ${roundedPercent}% | Click to scroll to top`
        }
        className="fixed top-0 left-0 right-0 z-[60] h-1.5 bg-slate-200/40 backdrop-blur-xs cursor-pointer group select-none transition-all duration-200 hover:h-2.5"
      >
        {/* Dynamic Gradient Progress Track */}
        <div
          className="h-full bg-gradient-to-r from-[#DC143C] via-[#F43F5E] to-[#003893] transition-all duration-100 ease-out shadow-[0_0_10px_rgba(220,20,60,0.6)]"
          style={{ width: `${scrollProgress}%` }}
        />

        {/* Hover Tooltip / Status Badge on Bar Hover */}
        <AnimatePresence>
          {isHovered && scrollProgress > 1 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute left-1/2 -translate-x-1/2 top-3 pointer-events-none"
            >
              <div className="bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg border border-white/10 flex items-center gap-1.5 whitespace-nowrap">
                <ArrowUp className="w-3 h-3 text-red-400 animate-bounce" />
                <span>
                  {isNepali
                    ? `माथि जानुहोस् (${roundedPercent}%)`
                    : `Click to scroll to top (${roundedPercent}%)`}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </>
  );
}
