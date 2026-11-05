/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType, ScholarshipProgram } from '../types';
import { SCHOLARSHIPS_DATA } from '../data/communityData';
import {
  Award,
  Calendar,
  UserCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  Send,
  X,
  GraduationCap
} from 'lucide-react';

interface ScholarshipsViewProps {
  setCurrentTab: (tab: TabType) => void;
}

export default function ScholarshipsView({ setCurrentTab }: ScholarshipsViewProps) {
  const [applyingProgram, setApplyingProgram] = useState<ScholarshipProgram | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('+977-98');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantGpa, setApplicantGpa] = useState('');
  const [applicantEssay, setApplicantEssay] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      setApplyingProgram(null);
      setApplicantName('');
      setApplicantEssay('');
    }, 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#DC143C]">
          <GraduationCap className="w-4 h-4 text-[#003893]" />
          <span>Educational Mobility &amp; Equity</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-poppins text-slate-900 leading-tight">
          Bote Youth Scholarships Center 2026
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
          We believe that higher education is the most potent catalyst to uplift the Bote indigenous community. Our annual scholarship pools are funded through cooperative matching contributions and international solidarity grants to ensure financial hardship never interrupts a Bote student’s degree.
        </p>
      </div>

      {/* Programs List */}
      <div className="space-y-6">
        {SCHOLARSHIPS_DATA.map((prog) => (
          <div
            key={prog.id}
            className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-8 items-start md:items-center hover:shadow-md transition-shadow"
          >
            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase text-[#DC143C] bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                  Grant: {prog.awardAmount}
                </span>
                <span className="text-xs text-slate-500 font-bold">
                  {prog.targetLevel}
                </span>
              </div>

              <div>
                <h3 className="font-poppins font-black text-xl sm:text-2xl text-slate-900 leading-tight">
                  {prog.title}
                </h3>
                <p className="text-xs font-bold text-[#003893] mt-0.5">
                  {prog.titleNepali}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {prog.description}
              </p>

              {/* Criteria */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Mandatory Selection Criteria:
                </span>
                {prog.criteria.map((crt, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs text-slate-700">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                    <span>{crt}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold pt-1">
                <span className="flex items-center text-red-600">
                  <Clock className="w-4 h-4 mr-1.5" />
                  Deadline: <strong>{prog.deadline}</strong>
                </span>
                <span>Eligibility: {prog.eligibility}</span>
              </div>
            </div>

            <button
              onClick={() => setApplyingProgram(prog)}
              className="w-full md:w-auto bg-[#DC143C] hover:bg-[#b51031] text-white text-xs font-black uppercase tracking-wider px-8 py-4 rounded-2xl shadow-md transition-all shrink-0"
            >
              Apply for Scholarship &rarr;
            </button>
          </div>
        ))}
      </div>

      {/* Application Popup Modal */}
      {applyingProgram && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border-2 border-slate-200 my-auto animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-[#003893] via-[#8B0000] to-[#DC143C] text-white p-6 relative">
              <button
                onClick={() => setApplyingProgram(null)}
                className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full uppercase">
                Official Grant Application
              </span>
              <h3 className="text-xl font-black font-poppins mt-2 text-white">
                {applyingProgram.title}
              </h3>
              <p className="text-xs text-amber-200 font-bold mt-0.5">
                Stipend Amount: {applyingProgram.awardAmount}
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              {appliedSuccess ? (
                <div className="bg-green-50 border border-green-200 text-green-700 text-xs p-6 rounded-2xl text-center space-y-2 font-bold">
                  <CheckCircle className="w-10 h-10 text-green-600 mx-auto" />
                  <p className="text-base">Scholarship Filing Dispatched!</p>
                  <p className="text-slate-600 font-normal">
                    The Education Committee will verify your ward records and contact you on <strong>{applicantPhone}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Student Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ram Prasad Bote"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#DC143C]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Mobile Phone *</label>
                      <input
                        type="tel"
                        required
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#DC143C]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Latest SEE / College GPA *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. GPA 3.12"
                        value={applicantGpa}
                        onChange={(e) => setApplicantGpa(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#DC143C]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="student@gmail.com"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#DC143C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Motivation Statement (100 - 300 words) *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Briefly state how you will use this education to empower the Bote community in Sarlahi..."
                      value={applicantEssay}
                      onChange={(e) => setApplicantEssay(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#DC143C]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#DC143C] hover:bg-[#b51031] text-white text-xs font-black uppercase tracking-wider py-3.5 rounded-xl shadow transition-all"
                    >
                      Submit Scholarship Filing
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
