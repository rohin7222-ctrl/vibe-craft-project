'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Calendar, BookOpen, Layers, MapPin } from 'lucide-react';

interface BrandHeroProps {
  sectionDisplayName: string;
}

export const BrandHero: React.FC<BrandHeroProps> = ({ 
  sectionDisplayName 
}) => {
  return (
    <header className="pt-6 pb-4">
      {/* Top Navbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 backdrop-blur-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0 ring-4 ring-blue-50">
            <span className="text-2xl animate-pulse">🎓</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                VibeCraft <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">Attendance Predictor</span>
              </h1>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200/80 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
                Dashboard View
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Automated timetable attendance tracking, leave simulations &amp; condonation prevention.
            </p>
          </div>
        </div>

        {/* Section Pill & Room Locator Action */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {/* Prominent Link to Room Booking Page */}
          <Link
            href="/locator"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer group"
          >
            <MapPin className="w-4 h-4 text-emerald-200 group-hover:scale-110 transition-transform" />
            <span>Class Booking &amp; Map</span>
            <span className="text-[9px] uppercase px-2 py-0.5 bg-white/20 text-white rounded-full font-black">Period Finder</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 shadow-xs hover:border-slate-300 transition-all">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>{sectionDisplayName}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
