'use client';

import React from 'react';
import { 
  Calendar, 
  Clock, 
  Zap, 
  Snowflake, 
  CheckCircle2, 
  Sparkles, 
  MapPin,
  ChevronRight
} from 'lucide-react';
import { 
  DayOfWeek, 
  DAYS_OF_WEEK, 
  PERIOD_TIMINGS, 
  getCurrentPeriodFromTime, 
  getCurrentDayOfWeek,
  ROOM_DATA
} from '@/data/roomData';

interface TopBookingBarProps {
  selectedDay: DayOfWeek;
  setSelectedDay: (day: DayOfWeek) => void;
  selectedPeriod: number;
  setSelectedPeriod: (p: number) => void;
  rooms?: RoomSchedule[];
}

export const TopBookingBar: React.FC<TopBookingBarProps> = ({
  selectedDay,
  setSelectedDay,
  selectedPeriod,
  setSelectedPeriod,
  rooms,
}) => {
  const currentLiveDay = getCurrentDayOfWeek();
  const currentLivePeriod = getCurrentPeriodFromTime();

  const handleSyncToLive = () => {
    setSelectedDay(currentLiveDay);
    setSelectedPeriod(currentLivePeriod);
  };

  const currentPeriodInfo = PERIOD_TIMINGS.find(p => p.period === selectedPeriod);
  const periodIndex = selectedPeriod - 1;

  // Use dynamic rooms list if provided, fallback to ROOM_DATA
  const activeRooms = rooms || ROOM_DATA;

  // Compute live availability stats for this Day & Period directly
  const freeRoomsNow = activeRooms.filter(r => (r.occupied[selectedDay]?.[periodIndex] ?? 1) === 0);
  const acFreeCount = freeRoomsNow.filter(r => r.isAC).length;

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-emerald-200/70 shadow-xl shadow-emerald-50/60 mb-6 space-y-5 transition-all">
      {/* Top Banner: Day & Live Sync */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 flex-shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Class Booking &bull; Date &amp; Period Selector
              </h2>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Top Priority Filter
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Pick your target weekday and class period to instantly view real-time classroom availability.
            </p>
          </div>
        </div>

        {/* Live Sync Action & Availability Count */}
        <div className="flex items-center gap-2.5 self-start lg:self-auto flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs font-bold text-emerald-900 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{freeRoomsNow.length} / {ROOM_DATA.length} Free</span>
            <span className="text-slate-400 font-normal">({acFreeCount} AC)</span>
          </div>

          <button
            type="button"
            onClick={handleSyncToLive}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold shadow-md shadow-teal-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            <span>Sync to Live Now (P{currentLivePeriod})</span>
          </button>
        </div>
      </div>

      {/* Row 1: Weekday Selection Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            1. Select Day of the Week
          </span>
          <span className="text-xs font-semibold text-slate-500">
            Selected: <strong className="text-slate-900">{selectedDay}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {DAYS_OF_WEEK.map(day => {
            const isSelected = selectedDay === day;
            const isToday = currentLiveDay === day;

            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`relative px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between border ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/20 ring-2 ring-emerald-500/30'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200/90 text-slate-700 hover:text-slate-900'
                }`}
              >
                <span className="tracking-tight">{day}</span>
                {isToday && (
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                    isSelected 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    Today
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 2: Period Selection Grid (1 to 9) */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              2. Select Period (Periods 1 &ndash; 9)
            </span>
          </div>

          {currentPeriodInfo && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs font-bold text-emerald-800">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentPeriodInfo.label}: {currentPeriodInfo.timeRange}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5">
          {PERIOD_TIMINGS.map(pt => {
            const isSelected = selectedPeriod === pt.period;
            const isCurrentLive = currentLivePeriod === pt.period && selectedDay === currentLiveDay;

            // Room count for this individual period
            const pIdx = pt.period - 1;
            const freeInThisPeriod = activeRooms.filter(r => (r.occupied[selectedDay]?.[pIdx] ?? 1) === 0).length;

            return (
              <button
                key={pt.period}
                type="button"
                onClick={() => setSelectedPeriod(pt.period)}
                className={`py-2.5 px-1.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center relative group ${
                  isSelected
                    ? 'border-emerald-600 bg-gradient-to-b from-emerald-500 to-teal-600 text-white font-black shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400/30 scale-[1.02]'
                    : 'border-slate-200/90 bg-white hover:border-emerald-300 text-slate-700 hover:bg-emerald-50/40 hover:shadow-2xs'
                }`}
              >
                {isCurrentLive && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white animate-ping" />
                )}
                <div className="flex items-center gap-1">
                  <span className="text-xs font-black">P{pt.period}</span>
                </div>
                <span className={`text-[10px] truncate max-w-full font-semibold ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                  {pt.startTime}
                </span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold mt-1 ${
                  isSelected 
                    ? 'bg-white/20 text-white' 
                    : freeInThisPeriod > 0 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'bg-rose-50 text-rose-600'
                }`}>
                  {freeInThisPeriod} free
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
