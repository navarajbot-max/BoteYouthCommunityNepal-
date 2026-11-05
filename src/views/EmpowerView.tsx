/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TabType } from '../types';
import { useCommunityData } from '../context/CommunityDataContext';
import {
  Flame,
  Shield,
  Heart,
  Users,
  Compass,
  ArrowRight,
  CheckCircle,
  TreePine,
  Laptop,
  GraduationCap,
  IdCard
} from 'lucide-react';

interface EmpowerViewProps {
  setCurrentTab: (tab: TabType) => void;
}

export default function EmpowerView({ setCurrentTab }: EmpowerViewProps) {
  const { hasJoinedCommunity, isFollowingCommunity, followerCount, followCommunity } = useCommunityData();
  const initiatives = [
    {
      id: 'emp-1',
      title: 'Bagmati River Ecology Patrols & Anti-Mining Watch',
      tag: 'Ecology & Sacred Waters',
      icon: TreePine,
      color: '#00695C',
      description: 'Bote youth volunteers conduct weekly boat patrols along the Bagmati and Narayani riverbanks. We document illegal mechanical sand extraction, monitor water siltation around sacred Sansari Puja ghats, and organize Saturday morning plastics cleanups.',
      achievements: [
        'Over 4.5 tons of plastic debris removed from riverbanks in 2025',
        'Formal joint appeal submitted to Sarlahi Chief District Officer to halt mechanical gravel mining',
        'Water acidity and fish habitat testing with environmental university researchers'
      ]
    },
    {
      id: 'emp-2',
      title: 'Elder Oral Folklore & Language Documentation Circles',
      tag: 'Linguistic Revitalization',
      icon: Heart,
      color: '#DC143C',
      description: 'Pairing tech-savvy Bote youth with village elders aged 60+ to audio-record traditional fishing chants, folk stories, and botanical river terminology that exist only in oral memory.',
      achievements: [
        'Over 45 hours of high-fidelity oral narrative tapes digitized',
        'Publishing the conversational Tarahi Bote Lexicon app for primary schoolers',
        'Weekend village language circles hosted at the Karmaiya Community Center'
      ]
    },
    {
      id: 'emp-3',
      title: 'Women’s Grass Weaving & Eco-Homestay Cooperatives',
      tag: 'Economic Independence',
      icon: Users,
      color: '#003893',
      description: 'Led by Community Vice President Sita Bote, transforming wild elephant grass (*choya*) weaving into modern homeware products (placemats, baskets, and bags) and operating authentic clay-walled Bote homestays for travelers.',
      achievements: [
        '40+ Bote women generating steady independent monthly income',
        'Zero-interest emergency credit pool for school enrollment and health emergencies',
        '10% of homestay proceeds reinvested into the Youth Higher Education Scholarship Fund'
      ]
    },
    {
      id: 'emp-4',
      title: 'Higher Secondary & University Academic Mentorship',
      tag: 'Educational Leadership',
      icon: GraduationCap,
      color: '#D97706',
      description: 'Providing after-school tutoring for Bote children in Karmaiya, guiding Grade 11/12 students with college application essays, and sponsoring university engineering, nursing, and science students.',
      achievements: [
        'SEE graduation rate in Karmaiya increased from 5% to 45%',
        '18 full-tuition scholarship grants awarded in 2025-2026 academic cycle',
        'Mentorship circles connecting university alumni with primary school children'
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#DC143C]">
          <Flame className="w-4 h-4 text-amber-500" />
          <span>Action on the Ground</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-poppins text-slate-900 leading-tight">
          Youth Empower &amp; Save Our Cultures
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
          We believe heritage preservation is not passive nostalgia — it is active community empowerment. Through river ecology patrols, language archives, women's cooperatives, and educational grants, Bote youth are leading real social transformation in Sarlahi and beyond.
        </p>
      </div>

      {/* Initiatives Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {initiatives.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-lg transition-shadow border-t-4"
              style={{ borderTopColor: item.color }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md"
                    style={{ backgroundColor: item.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {item.tag}
                  </span>
                </div>

                <h3 className="font-poppins font-extrabold text-xl text-slate-900 leading-tight">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    Key Outcomes &amp; Action:
                  </span>
                  {item.achievements.map((ach, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setCurrentTab('join')}
                  className="text-xs font-bold flex items-center space-x-1.5 transition-colors"
                  style={{ color: item.color }}
                >
                  <span>Volunteer for this program</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to Action Banner - Conditionally renders based on join status */}
      {!hasJoinedCommunity ? (
        <div className="bg-gradient-to-r from-[#003893] to-[#DC143C] text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-black font-poppins text-white">Join the Youth Committee Movement</h3>
            <p className="text-xs text-white/90">Sign up online to receive your official Bote Youth Community Nepal membership ID.</p>
          </div>
          <button
            onClick={() => setCurrentTab('join')}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-8 py-3.5 rounded-full text-xs uppercase tracking-wider shadow-lg shrink-0 transition-transform active:scale-95 cursor-pointer"
          >
            Fill Joining Form &rarr;
          </button>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="bg-emerald-700 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm inline-flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Official Youth Member</span>
            </span>
            <h3 className="text-2xl font-black font-poppins text-white">Your Community Membership is Active</h3>
            <p className="text-xs text-emerald-100">You are enrolled in community records. Access program volunteering and your digital identity card.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentTab('join')}
              className="bg-white hover:bg-emerald-50 text-emerald-900 font-black px-7 py-3.5 rounded-full text-xs uppercase tracking-wider shadow-lg shrink-0 transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <IdCard className="w-4 h-4 text-emerald-700" />
              <span>View Member ID Card</span>
            </button>
            <button
              onClick={() => setCurrentTab('follow')}
              className="bg-emerald-700/60 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-full text-xs uppercase tracking-wider border border-emerald-500 shadow-md shrink-0 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-red-300 fill-red-300" />
              <span>Follow Updates ({followerCount})</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
