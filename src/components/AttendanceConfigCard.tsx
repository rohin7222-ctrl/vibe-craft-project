'use client';

import React, { useState } from 'react';
import { SubjectInput } from '../types/attendance';
import { SECTION_OPTIONS } from '../data/timetableData';
import { 
  Layers, 
  Calendar as CalendarIcon, 
  BookOpen, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Edit3, 
  Check, 
  Sliders, 
  Percent,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';

interface AttendanceConfigCardProps {
  section: string;
  setSection: (val: string) => void;
  targetDate: string;
  setTargetDate: (val: string) => void;
  subjects: SubjectInput[];
  setSubjects: React.Dispatch<React.SetStateAction<SubjectInput[]>>;
}

export const AttendanceConfigCard: React.FC<AttendanceConfigCardProps> = ({
  section,
  setSection,
  targetDate,
  setTargetDate,
  subjects,
  setSubjects,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handlePercentageChange = (id: string, value: string) => {
    if (value === '') {
      setSubjects(prev =>
        prev.map(sub => (sub.id === id ? { ...sub, currentPercentage: 0, isEntered: false } : sub))
      );
      return;
    }
    const num = Math.min(100, Math.max(0, Number(value) || 0));
    setSubjects(prev =>
      prev.map(sub => (sub.id === id ? { ...sub, currentPercentage: num, isEntered: true } : sub))
    );
  };

  const setPresetPercentage = (id: string, pct: number) => {
    setSubjects(prev =>
      prev.map(sub => (sub.id === id ? { ...sub, currentPercentage: pct, isEntered: true } : sub))
    );
  };

  const handleFillAll = (pct: number) => {
    setSubjects(prev =>
      prev.map(sub => ({ ...sub, currentPercentage: pct, isEntered: true }))
    );
  };

  const handleClearAll = () => {
    setSubjects(prev =>
      prev.map(sub => ({ ...sub, currentPercentage: 0, isEntered: false }))
    );
  };

  const enteredCount = subjects.filter(s => s.isEntered).length;
  const avgAttendance = enteredCount > 0 
    ? Math.round(subjects.filter(s => s.isEntered).reduce((acc, s) => acc + s.currentPercentage, 0) / enteredCount)
    : 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-100/70 overflow-hidden transition-all duration-300">
      {/* Top Banner / Quick Controls */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-slate-50/80 border-b border-slate-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left Title & Status */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 flex-shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Student Attendance Settings &amp; Timetable Model
                </h2>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100/80 text-blue-700 border border-blue-200/60">
                  {enteredCount} of {subjects.length} entered
                </span>
                {enteredCount > 0 && (
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Avg: {avgAttendance}%
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Update your current course percentages below to simulate real-time targets.
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 self-start lg:self-auto flex-wrap">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                isExpanded 
                  ? 'bg-slate-900 text-white hover:bg-slate-800' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isExpanded ? 'Collapse Input Form' : 'Edit Subjects & Percentages'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Quick Selection Bar (Section & Target Date) */}
        <div className="mt-4 pt-4 border-t border-blue-100/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Section Picker */}
          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Layers className="w-3 h-3 text-blue-600" />
              Your Section
            </label>
            <select
              value={section}
              onChange={e => setSection(e.target.value)}
              className="w-full bg-white border border-slate-200/90 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer shadow-2xs"
            >
              {SECTION_OPTIONS.map(sec => (
                <option key={sec.id} value={sec.id}>
                  {sec.label}
                </option>
              ))}
            </select>
          </div>

          {/* Target Date Picker */}
          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <CalendarIcon className="w-3 h-3 text-blue-600" />
              Semester Target Date
            </label>
            <input
              type="date"
              min="2026-09-28"
              max="2026-11-29"
              value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
              className="w-full bg-white border border-slate-200/90 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer shadow-2xs"
            />
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              Quick Batch Presets (All Courses)
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[75, 80, 85, 90].map(pct => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleFillAll(pct)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 text-[11px] font-extrabold text-slate-700 transition-all cursor-pointer shadow-2xs"
                >
                  Set {pct}%
                </button>
              ))}
              <button
                type="button"
                onClick={handleClearAll}
                className="px-2.5 py-1.5 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-[11px] font-bold text-red-600 transition-all cursor-pointer shadow-2xs ml-auto"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Course Percentages Grid */}
      {isExpanded && (
        <div className="p-5 sm:p-6 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              Individual Course Attendance Inputs
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Changes update KPIs and charts automatically
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {subjects.map(sub => {
              const pct = sub.currentPercentage || 0;
              const isEntered = sub.isEntered;

              return (
                <div
                  key={sub.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isEntered
                      ? pct >= 75
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : 'border-amber-200 bg-amber-50/20'
                      : 'border-slate-200/90 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-800 truncate max-w-[170px]" title={sub.name}>
                      {sub.name}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                      !isEntered
                        ? 'bg-slate-200 text-slate-600'
                        : pct >= 75
                        ? 'bg-emerald-100 text-emerald-800'
                        : pct >= 65
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {isEntered ? `${pct}%` : 'Not Set'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={isEntered ? sub.currentPercentage : ''}
                      onChange={e => handlePercentageChange(sub.id, e.target.value)}
                      placeholder="0-100%"
                      className="w-20 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900"
                    />

                    {/* Quick Preset Chips for this subject */}
                    <div className="flex items-center gap-1">
                      {[75, 85, 90].map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPresetPercentage(sub.id, p)}
                          className={`px-2 py-1 text-[10px] font-extrabold rounded-md border transition-all cursor-pointer ${
                            isEntered && pct === p
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                          }`}
                        >
                          {p}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Percentage Slider */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sub.currentPercentage || 0}
                    onChange={e => handlePercentageChange(sub.id, e.target.value)}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Done Editing</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
