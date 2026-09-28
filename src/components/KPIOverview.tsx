'use client';

import React from 'react';
import { SubjectPrediction } from '../types/attendance';
import { 
  Percent, 
  AlertTriangle, 
  CalendarClock, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles 
} from 'lucide-react';

interface KPIOverviewProps {
  subjects: SubjectPrediction[];
  totalClassesRemaining: number;
  odDays: number;
  sickDays: number;
}

export const KPIOverview: React.FC<KPIOverviewProps> = ({
  subjects,
  totalClassesRemaining,
  odDays,
  sickDays,
}) => {
  // Only compute statistics on subjects that have actually been entered
  const enteredSubjects = subjects.filter(s => s.status !== 'pending' && s.isEntered !== false);
  const enteredCount = enteredSubjects.length;

  const avgPercentage = enteredCount > 0
    ? Math.round(enteredSubjects.reduce((sum, s) => sum + s.currentPercentage, 0) / enteredCount)
    : 0;

  // Counts by zone strictly from entered subjects
  const dangerCount = enteredSubjects.filter(s => s.status === 'danger' || s.status === 'detention').length;
  const safeCount = enteredSubjects.filter(s => s.status === 'safe').length;
  const totalBunkable = enteredSubjects.reduce((sum, s) => sum + (s.bunkableClasses || 0), 0);

  // Overall status
  const isCritical = dangerCount > 0;

  return (
    <div className="mb-6">
      {/* Friendly Onboarding Prompt when no subjects are entered yet */}
      {enteredCount === 0 && (
        <div className="mb-4 bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-emerald-50/70 border border-blue-200/80 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-blue-100" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-800">
                Awaiting Attendance Input &bull; No Default Assumptions
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
                Enter your course percentages above or click <span className="font-bold text-amber-700">75%</span> / <span className="font-bold text-emerald-700">85%</span> presets to immediately calculate streak targets and safe bunk cushions.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Overall Average */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Average Attendance
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              enteredCount === 0 
                ? 'bg-slate-100 text-slate-500' 
                : avgPercentage >= 75 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              <Percent className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {enteredCount === 0 ? '--%' : `${avgPercentage}%`}
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              enteredCount === 0
                ? 'bg-slate-100 text-slate-600'
                : avgPercentage >= 75 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}>
              {enteredCount === 0 ? 'Awaiting Input' : (avgPercentage >= 75 ? 'Healthy' : 'Below 75%')}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {enteredCount === 0 ? `0 of ${subjects.length} courses entered` : `Computed from ${enteredCount} of ${subjects.length} courses`}
          </p>
        </div>

      {/* 2. Critical Risk Level */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            At-Risk Subjects
          </span>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            isCritical ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-emerald-100 text-emerald-600'
          }`}>
            {isCritical ? <ShieldAlert className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {dangerCount}
          </span>
          <span className="text-xs text-slate-500 font-semibold">of {subjects.length} subjects</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          {dangerCount === 0 ? 'No subjects in detention risk' : 'Requires immediate attendance'}
        </p>
      </div>

      {/* 3. Classes Remaining */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Classes Remaining
          </span>
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <CalendarClock className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {totalClassesRemaining}
          </span>
          <span className="text-xs text-slate-500 font-semibold">periods</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Until Nov 29, 2026</p>
      </div>

      {/* 4. Safe Missable / Simulation Buffer */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Safe Buffer
          </span>
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {safeCount}
          </span>
          <span className="text-xs text-slate-500 font-semibold">safe courses</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          {odDays > 0 ? `+${odDays} OD Days applied` : (sickDays > 0 ? `${sickDays} Sick Leave applied` : 'Total peace-of-mind courses')}
        </p>
      </div>
    </div>
    </div>
  );
};
