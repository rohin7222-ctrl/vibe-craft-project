'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Snowflake, 
  Wind, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  DoorOpen, 
  Layers, 
  Zap, 
  Wifi, 
  Monitor, 
  Users, 
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  RoomSchedule, 
  DayOfWeek, 
  DAYS_OF_WEEK, 
  PERIOD_TIMINGS,
  getCurrentPeriodFromTime,
  getCurrentDayOfWeek
} from '@/data/roomData';

interface ScheduleInspectorModalProps {
  room: RoomSchedule | null;
  initialDay?: DayOfWeek;
  onClose: () => void;
}

export const ScheduleInspectorModal: React.FC<ScheduleInspectorModalProps> = ({
  room,
  initialDay,
  onClose,
}) => {
  const [activeDay, setActiveDay] = useState<DayOfWeek>(() => initialDay || getCurrentDayOfWeek());
  const [activeView, setActiveView] = useState<'timeline' | 'matrix'>('timeline');
  const [filterOnlyFree, setFilterOnlyFree] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Sync active day when initialDay changes or room opens
  useEffect(() => {
    if (initialDay) {
      setActiveDay(initialDay);
    }
  }, [initialDay]);

  // Support closing modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const liveDay = getCurrentDayOfWeek();
  const livePeriod = getCurrentPeriodFromTime();

  // Weekly Stats calculation - Unconditional useMemo hook
  const weeklyTotalFree = useMemo(() => {
    if (!room) return 0;
    let total = 0;
    DAYS_OF_WEEK.forEach(d => {
      const schedule = room.occupied[d] || [];
      total += schedule.filter(p => p === 0).length;
    });
    return total;
  }, [room]);

  const weeklyTotalSlots = 5 * 9;
  const weeklyFreePct = Math.round((weeklyTotalFree / weeklyTotalSlots) * 100);

  // Day specific analysis
  const currentDaySchedule = room ? (room.occupied[activeDay] || []) : [];
  const currentDayFreeCount = currentDaySchedule.filter(p => p === 0).length;

  // Golden Window analysis for activeDay: find longest continuous streak of 0s - Unconditional hook
  const goldenWindow = useMemo(() => {
    let bestStart = -1;
    let bestLength = 0;
    let currentStart = -1;
    let currentLength = 0;

    for (let i = 0; i < currentDaySchedule.length; i++) {
      if (currentDaySchedule[i] === 0) {
        if (currentStart === -1) currentStart = i;
        currentLength++;
        if (currentLength > bestLength) {
          bestLength = currentLength;
          bestStart = currentStart;
        }
      } else {
        currentStart = -1;
        currentLength = 0;
      }
    }

    if (bestLength > 0 && bestStart !== -1) {
      const startPeriod = PERIOD_TIMINGS[bestStart];
      const endPeriod = PERIOD_TIMINGS[bestStart + bestLength - 1];
      const startTime = startPeriod?.startTime || '09:00';
      const endTime = endPeriod?.endTime || '16:50';
      return {
        startPeriodNum: bestStart + 1,
        endPeriodNum: bestStart + bestLength,
        count: bestLength,
        timeSpan: `${startPeriod?.timeRange.split(' - ')[0]} to ${endPeriod?.timeRange.split(' - ')[1]}`,
      };
    }
    return null;
  }, [currentDaySchedule]);

  // If no room is selected, return null AFTER all hooks have executed
  if (!room) return null;

  // Copy handler
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // WhatsApp Squad Pre-filled text for active day
  const freePeriodLabels = currentDaySchedule
    .map((val, idx) => (val === 0 ? `P${idx + 1} (${PERIOD_TIMINGS[idx].timeRange})` : null))
    .filter(Boolean);

  const fullDaySquadShare = `📍 *Campus Room Schedule • ${room.room} (${room.floor})*
📅 *Day:* ${activeDay}
❄️ *AC:* ${room.isAC ? 'Yes (Air Conditioned)' : 'Non-AC'}
🟢 *Free Slots (${currentDayFreeCount} Periods):*
${freePeriodLabels.length > 0 ? freePeriodLabels.map(p => `• ${p}`).join('\n') : '• No free slots today.'}
${goldenWindow ? `\n⭐ *Longest Golden Slot:* ${goldenWindow.count} unbroken hours (${goldenWindow.timeSpan})` : ''}

_Sent via Free Class Locator_`;

  const whatsappFullDayUrl = `https://wa.me/?text=${encodeURIComponent(fullDaySquadShare)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop with Blur */}
      <div 
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Modal Card */}
      <div 
        className="relative bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden z-10 transition-all transform animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Full Schedule Matrix &bull; MAX UI/UX
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 text-xs font-bold">
                  <Layers className="w-3 h-3 text-slate-300" />
                  {room.floor}
                </span>

                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  room.isAC 
                    ? 'bg-blue-500/20 border border-blue-400/40 text-blue-300' 
                    : 'bg-amber-500/20 border border-amber-400/40 text-amber-300'
                }`}>
                  {room.isAC ? <Snowflake className="w-3 h-3 animate-spin-slow" /> : <Wind className="w-3 h-3" />}
                  {room.isAC ? 'AC Classroom' : 'Ventilated Non-AC'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                <span>{room.room}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-md">
                  Schedule Inspector
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Explore every period, inspect vacancy streaks, and invite squad members with 1-click pre-filled WhatsApp links.
              </p>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer flex-shrink-0"
              title="Close (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Specs & Weekly Vacancy Highlights Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-4 pt-4 border-t border-white/10">
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Weekly Free Slots</span>
              <strong className="text-base sm:text-lg font-black text-emerald-400">
                {weeklyTotalFree} <span className="text-xs text-slate-400 font-normal">/ 45 periods</span>
              </strong>
            </div>

            <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Weekly Vacancy Rate</span>
              <strong className="text-base sm:text-lg font-black text-blue-300">
                {weeklyFreePct}% <span className="text-xs text-slate-400 font-normal">available</span>
              </strong>
            </div>

            <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Seating Capacity</span>
              <strong className="text-base sm:text-lg font-black text-white flex items-center gap-1">
                <Users className="w-4 h-4 text-slate-400" />
                60 Seats
              </strong>
            </div>

            <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Class Amenities</span>
              <div className="flex items-center gap-2 mt-1 text-slate-300 text-xs">
                <span title="Power Outlets"><Zap className="w-3.5 h-3.5 text-amber-400" /></span>
                <span title="Wi-Fi 6"><Wifi className="w-3.5 h-3.5 text-blue-400" /></span>
                <span title="Projector Ready"><Monitor className="w-3.5 h-3.5 text-emerald-400" /></span>
              </div>
            </div>
          </div>
        </div>

        {/* View Mode & Controls Toolbar */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          {/* Day Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {DAYS_OF_WEEK.map(day => {
              const count = room.occupied[day]?.filter(p => p === 0).length || 0;
              const isSelected = activeDay === day;
              const isToday = liveDay === day;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setActiveDay(day)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{day.slice(0, 3)}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isSelected
                      ? 'bg-emerald-400 text-slate-950'
                      : count > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {count} Free
                  </span>
                  {isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" title="Today" />
                  )}
                </button>
              );
            })}
          </div>

          {/* View Toggles & Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter Free Only Toggle */}
            <button
              type="button"
              onClick={() => setFilterOnlyFree(prev => !prev)}
              className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                filterOnlyFree
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Filter className="w-3 h-3" />
              <span>{filterOnlyFree ? 'Showing Free Only' : 'Show All Periods'}</span>
            </button>

            {/* View switcher: Timeline vs Matrix */}
            <div className="inline-flex rounded-xl p-0.5 bg-slate-200 text-slate-700">
              <button
                type="button"
                onClick={() => setActiveView('timeline')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeView === 'timeline' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Day Timeline
              </button>
              <button
                type="button"
                onClick={() => setActiveView('matrix')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeView === 'matrix' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                5-Day Matrix
              </button>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* 1. Golden Window Spotlight Banner */}
          {goldenWindow && activeView === 'timeline' && (
            <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border-2 border-emerald-400/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/20">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-800">
                    <span>🌟 Golden Study Window Detected</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded-md font-bold">
                      {goldenWindow.count} Unbroken Hours Free
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
                    Period {goldenWindow.startPeriodNum} to Period {goldenWindow.endPeriodNum} &bull; {goldenWindow.timeSpan}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Longest continuous vacant block on {activeDay}. Ideal for group projects, coding sprints, or undisturbed self-study.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`📍 Let's grab ${room.room} on ${activeDay}! It's free unbroken for ${goldenWindow.count} hours (${goldenWindow.timeSpan}). Come fast!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Claim Golden Slot</span>
                </a>
              </div>
            </div>
          )}

          {/* 2. Timeline View (Active Day) */}
          {activeView === 'timeline' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>{activeDay} &bull; 9 Periods Breakdown</span>
                <span>{currentDayFreeCount} of 9 Periods Available</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {PERIOD_TIMINGS.map((timing, idx) => {
                  const isFree = currentDaySchedule[idx] === 0;
                  const isLiveNow = liveDay === activeDay && livePeriod === timing.period;

                  if (filterOnlyFree && !isFree) return null;

                  const slotSquadMsg = `📍 Heading to ${room.room} (${room.floor}) for Period ${timing.period} (${timing.timeRange}). It's free! Join me.`;

                  return (
                    <div
                      key={timing.period}
                      className={`relative p-3.5 rounded-2xl border transition-all duration-150 flex flex-col justify-between ${
                        isFree
                          ? 'bg-emerald-50/40 border-emerald-200/90 hover:border-emerald-400 hover:shadow-md'
                          : 'bg-slate-50/70 border-slate-200/80 opacity-75'
                      }`}
                    >
                      {/* Live Neon Pulse if currently ongoing */}
                      {isLiveNow && (
                        <div className="absolute -top-2 -right-2 flex items-center gap-1 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md animate-bounce">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          <span>LIVE NOW</span>
                        </div>
                      )}

                      <div>
                        {/* Period Number and Status Badge */}
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-xs font-extrabold text-slate-800">
                            {timing.label}
                          </span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            isFree
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {isFree ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertCircle className="w-3 h-3 text-slate-400" />}
                            {isFree ? 'VACANT' : 'OCCUPIED'}
                          </span>
                        </div>

                        {/* Clock Timing */}
                        <div className="flex items-center gap-1 text-xs text-slate-600 font-semibold mb-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{timing.timeRange}</span>
                        </div>
                      </div>

                      {/* Bottom Action for Free Periods */}
                      {isFree ? (
                        <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between gap-1">
                          <span className="text-[11px] font-bold text-emerald-700">
                            Free for occupancy
                          </span>
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(slotSquadMsg)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 hover:text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200/80 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                            title="Invite Squad to this Period"
                          >
                            <Share2 className="w-3 h-3" />
                            <span>Squad Invite</span>
                          </a>
                        </div>
                      ) : (
                        <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-400 font-medium">
                          Scheduled Lecture / Lab in session
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* 3. Full 5-Day Weekly Master Heatmap Matrix */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Comprehensive 5-Day Weekly Schedule Heatmap</span>
                <span>Green = Available &bull; Slate = In Session</span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-xs">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="py-3 px-3 font-bold border-r border-slate-800 text-center sticky left-0 bg-slate-900 z-10">
                        Day
                      </th>
                      {PERIOD_TIMINGS.map(p => (
                        <th key={p.period} className="py-2.5 px-2 text-center font-bold min-w-[76px] border-r border-slate-800">
                          <div className="text-[11px] font-black">{p.label}</div>
                          <div className="text-[9px] text-slate-400 font-medium">{p.startTime}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS_OF_WEEK.map((day, dayIdx) => {
                      const daySchedule = room.occupied[day] || [];
                      const isToday = liveDay === day;

                      return (
                        <tr 
                          key={day} 
                          className={`border-b border-slate-200 transition-colors ${
                            isToday ? 'bg-emerald-50/30' : dayIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                          }`}
                        >
                          <td className={`py-3 px-3 font-extrabold border-r border-slate-200 text-center sticky left-0 z-10 ${
                            isToday ? 'bg-emerald-100 text-emerald-950 font-black' : 'bg-slate-100 text-slate-800'
                          }`}>
                            <div className="flex items-center justify-center gap-1">
                              <span>{day.slice(0, 3)}</span>
                              {isToday && <span className="w-2 h-2 rounded-full bg-emerald-500" title="Today" />}
                            </div>
                          </td>

                          {daySchedule.map((val, pIdx) => {
                            const isFree = val === 0;
                            const isLiveCell = isToday && livePeriod === pIdx + 1;

                            return (
                              <td
                                key={pIdx}
                                className={`p-1.5 text-center border-r border-slate-200 transition-all ${
                                  isLiveCell ? 'ring-2 ring-emerald-500 ring-inset' : ''
                                }`}
                              >
                                <div className={`py-2 px-1 rounded-xl text-[10px] font-bold transition-transform hover:scale-105 flex flex-col items-center justify-center ${
                                  isFree
                                    ? 'bg-emerald-500 text-white shadow-xs hover:bg-emerald-600 cursor-pointer'
                                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                }`}
                                title={`${day} ${PERIOD_TIMINGS[pIdx].label}: ${isFree ? 'FREE' : 'Occupied'}`}
                                onClick={() => {
                                  if (isFree) {
                                    handleCopy(
                                      `📍 ${room.room} is free on ${day} ${PERIOD_TIMINGS[pIdx].label} (${PERIOD_TIMINGS[pIdx].timeRange})!`,
                                      `${day}-P${pIdx + 1}`
                                    );
                                  }
                                }}
                                >
                                  <span>{isFree ? 'FREE' : 'BUSY'}</span>
                                  {isLiveCell && (
                                    <span className="text-[8px] bg-red-600 text-white px-1 rounded-full font-black mt-0.5">
                                      NOW
                                    </span>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-slate-400 italic">
                * Click on any green FREE cell above to immediately copy slot invite details to clipboard.
              </p>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer with Instant Share Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            <span className="font-bold text-slate-800">{room.room}</span> &bull; {activeDay} schedule &bull; {currentDayFreeCount} free periods
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Copy day schedule button */}
            <button
              type="button"
              onClick={() => handleCopy(fullDaySquadShare, 'day-schedule')}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              {copiedText === 'day-schedule' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copied Schedule!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy Day Schedule</span>
                </>
              )}
            </button>

            {/* WhatsApp Squad Share */}
            <a
              href={whatsappFullDayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black transition-all shadow-md shadow-emerald-500/20 active:scale-[0.98] cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share to Squad (WhatsApp)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
