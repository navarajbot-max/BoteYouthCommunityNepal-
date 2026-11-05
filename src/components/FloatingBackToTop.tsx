/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function FloatingBackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const { isNepali, t } = useLanguage();

  const handleScroll = useCallback(() => {
    // Check multiple scroll sources for robust browser/iframe compatibility
    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    
    const scrollHeight =
      Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        document.documentElement.offsetHeight,
        document.body.offsetHeight
      ) - window.innerHeight;

    const percent = scrollHeight > 0 ? Math.min(Math.round((scrollTop / scrollHeight) * 100), 100) : 0;
    setScrollPercent(percent);

    // Show button once user scrolls down 80px or more
    setIsVisible(scrollTop > 80);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  const scrollToTop = () => {
    try {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } catch {
      window.scrollTo(0, 0);
    }
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          id="floating-back-to-top-btn"
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          title={
            isNepali
              ? `पृष्ठको शीर्षमा जानुहोस् (पठन: ${scrollPercent}%)`
              : `Scroll back to top (Reading progress: ${scrollPercent}%)`
          }
          aria-label={t('scroll.top', 'Back to Top')}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-1.5 sm:gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-gradient-to-r from-[#DC143C] via-[#b51031] to-[#003893] text-white shadow-2xl hover:shadow-[0_10px_25px_rgba(220,20,60,0.45)] border-2 border-white/90 cursor-pointer font-sans select-none group"
        >
          {/* Animated Arrow Icon with Circular Backing */}
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-200 group-hover:-translate-y-0.5 shrink-0">
            <ArrowUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white stroke-[2.5]" />
          </div>

          {/* Label Text */}
          <span className="font-poppins font-black tracking-wider text-[11px] sm:text-xs uppercase leading-none hidden xs:inline">
            {isNepali ? 'माथि जानुहोस्' : 'Back to Top'}
          </span>

          {/* Reading Progress Percentage Badge */}
          <span className="bg-black/35 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[10.5px] font-mono font-bold text-white/95 border border-white/20 leading-none">
            {scrollPercent}%
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
