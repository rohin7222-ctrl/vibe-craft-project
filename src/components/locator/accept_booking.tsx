'use client';

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  Snowflake, 
  Wind, 
  User, 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  QrCode, 
  Copy, 
  Check, 
  Share2, 
  RotateCcw,
  Zap,
  Building2,
  Ticket
} from 'lucide-react';
import { RoomSchedule, DayOfWeek, PERIOD_TIMINGS } from '@/data/roomData';

export interface BookingRecord {
  id: string;
  roomName: string;
  floor: string;
  isAC: boolean;
  day: DayOfWeek;
  period: number;
  timeRange: string;
  studentName: string;
  department: string;
  purpose: string;
  timestamp: string;
}

interface AcceptBookingProps {
  room: RoomSchedule;
  selectedDay: DayOfWeek;
  selectedPeriod: number;
  existingBooking?: BookingRecord | null;
  onConfirmBooking: (booking: BookingRecord) => void;
  onCancelBooking?: () => void;
  onClose?: () => void;
}

export const PURPOSE_PRESETS = [
  '📚 Focused Self Study',
  '💻 Team Project Dev & Coding',
  '👥 Club / Hackathon Sync',
  '🎤 Seminar & Presentation Prep',
  '🔬 Specialized Lab Practice'
];

export const AcceptBookingModal: React.FC<AcceptBookingProps> = ({
  room,
  selectedDay,
  selectedPeriod,
  existingBooking,
  onConfirmBooking,
  onCancelBooking,
  onClose,
}) => {
  const periodIndex = selectedPeriod - 1;
  const currentTiming = PERIOD_TIMINGS[periodIndex];

  const [studentName, setStudentName] = useState<string>(existingBooking?.studentName || '');
  const [department, setDepartment] = useState<string>(existingBooking?.department || 'ECE / Data Science');
  const [purpose, setPurpose] = useState<string>(existingBooking?.purpose || PURPOSE_PRESETS[0]);
  const [customPurpose, setCustomPurpose] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(!!existingBooking);
  const [activeBooking, setActiveBooking] = useState<BookingRecord | null>(existingBooking || null);
  const [copied, setCopied] = useState<boolean>(false);

  const isAlreadyOccupied = !existingBooking && (room.occupied[selectedDay]?.[periodIndex] ?? 1) === 1;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const finalPurpose = customPurpose.trim() || purpose;
      const newBooking: BookingRecord = {
        id: `VCB-${Math.floor(1000 + Math.random() * 9000)}`,
        roomName: room.room,
        floor: room.floor,
        isAC: room.isAC,
        day: selectedDay,
        period: selectedPeriod,
        timeRange: currentTiming?.timeRange || '09:00 AM - 09:50 AM',
        studentName: studentName.trim(),
        department: department.trim() || 'General Studies',
        purpose: finalPurpose,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      onConfirmBooking(newBooking);
      setActiveBooking(newBooking);
      setBookingConfirmed(true);
      setIsSubmitting(false);
    }, 400);
  };

  const handleCopyPass = () => {
    if (!activeBooking) return;
    const text = `🎟️ *VibeCraft Campus Room Pass: ${activeBooking.id}*\n📍 *Room:* ${activeBooking.roomName} (${activeBooking.floor})\n📅 *Day & Time:* ${activeBooking.day}, Period ${activeBooking.period} (${activeBooking.timeRange})\n👤 *Booked By:* ${activeBooking.studentName} (${activeBooking.department})\n🎯 *Purpose:* ${activeBooking.purpose}\nStatus: OCCUPIED / RESERVED`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Gradient Ribbon */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-start justify-between gap-4 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
              <Ticket className="w-3.5 h-3.5 text-emerald-400" />
              <span>Campus Room Booking Authority</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>{bookingConfirmed ? 'Active Booking Pass' : 'Accept Classroom Booking'}</span>
              <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                bookingConfirmed || isAlreadyOccupied
                  ? 'bg-rose-500/30 text-rose-200 border border-rose-400/40'
                  : 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40'
              }`}>
                {bookingConfirmed ? 'OCCUPIED (YOURS)' : isAlreadyOccupied ? 'OCCUPIED' : 'FREE TO BOOK'}
              </span>
            </h3>

            <p className="text-xs text-slate-300 mt-1">
              {bookingConfirmed 
                ? 'This room has been reserved and is now marked as Occupied across campus maps.'
                : 'Confirm reservation to mark this room as Occupied for your study session.'}
            </p>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Room Specs Header Pill */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center font-black shadow-md shadow-emerald-500/20 flex-shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-black text-slate-900">{room.room}</h4>
                  {room.isAC ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-100/70 text-cyan-800 text-[10px] font-bold">
                      <Snowflake className="w-3 h-3 text-cyan-600" />
                      AC
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700 text-[10px] font-semibold">
                      <Wind className="w-3 h-3 text-slate-500" />
                      Non-AC
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{room.floor}</span>
                  <span>&bull;</span>
                  <span>{room.room.includes('Lab') ? 'Specialized Lab' : 'Lecture Hall'}</span>
                </div>
              </div>
            </div>

            {/* Day & Period Badge */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs">
                <span>{selectedDay}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-black text-emerald-800 shadow-2xs">
                <span>Period {selectedPeriod}</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* CASE 1: CONFIRMED BOOKING PASS TICKET                    */}
          {/* ========================================================= */}
          {bookingConfirmed && activeBooking ? (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              {/* Digital Boarding Pass Ticket */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 border border-emerald-500/30 shadow-xl">
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                      OFFICIAL CAMPUS ACCESS PASS
                    </span>
                    <h4 className="text-2xl font-black tracking-tight text-white mt-0.5">
                      {activeBooking.roomName}
                    </h4>
                    <p className="text-xs text-slate-300 font-medium">
                      {activeBooking.floor} &bull; {activeBooking.timeRange}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-mono">PASS REF #</span>
                    <span className="text-base font-black text-emerald-300 font-mono tracking-wider">
                      {activeBooking.id}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-b border-white/10 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Lead Student</span>
                    <span className="font-bold text-white text-sm">{activeBooking.studentName}</span>
                    <span className="text-[11px] text-slate-300 block">{activeBooking.department}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Session Purpose</span>
                    <span className="font-bold text-emerald-200 text-xs leading-snug block">
                      {activeBooking.purpose}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Booked at {activeBooking.timestamp}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Status: OCCUPIED &bull; RESERVED</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyPass}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
                      <span>{copied ? 'Copied' : 'Share Pass'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Release / Cancel Booking Action */}
              {onCancelBooking && (
                <div className="pt-1 flex items-center justify-between">
                  <p className="text-xs text-slate-500 font-medium">
                    Finished your session early? You can free this room for other students.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onCancelBooking();
                      setBookingConfirmed(false);
                      setActiveBooking(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                    <span>Cancel / Release Room</span>
                  </button>
                </div>
              )}
            </div>
          ) : isAlreadyOccupied ? (
            /* ======================================================= */
            /* CASE 2: ROOM OCCUPIED BY SCHEDULE (CANNOT BOOK)         */
            /* ======================================================= */
            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
              <h4 className="text-sm font-black text-rose-900 flex items-center gap-2">
                <span>🔴 Classroom Is Currently Occupied</span>
              </h4>
              <p className="text-xs text-rose-700 leading-relaxed font-medium">
                This room is occupied during {selectedDay} Period {selectedPeriod} by an existing college class schedule or verified reservation. Please choose another period or pick a free room from the locator.
              </p>
            </div>
          ) : (
            /* ======================================================= */
            /* CASE 3: ACCEPT BOOKING FORM                             */
            /* ======================================================= */
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Student Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    Student / Lead Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name (e.g. Rahul / Sneha)"
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 transition-all"
                  />
                </div>

                {/* Department / Batch */}
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    Department / Section
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. IV ECE B / III DS"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 transition-all"
                  />
                </div>
              </div>

              {/* Purpose Selector */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Purpose of Booking
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PURPOSE_PRESETS.map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setPurpose(p);
                        setCustomPurpose('');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        purpose === p && !customPurpose
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Purpose Input */}
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Or enter specific activity (e.g. Final Year Project Review Meeting)..."
                  value={customPurpose}
                  onChange={e => setCustomPurpose(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
                />
              </div>

              {/* Notice */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  Once confirmed, this classroom will instantly be marked as <strong>OCCUPIED</strong> across all campus room maps and locator searches.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !studentName.trim()}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] text-white font-black text-sm shadow-xl shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>Processing Reservation...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                    <span>Accept &amp; Confirm Booking (Set to Occupied)</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">
            Campus Room Booking System &bull; Live Synchronization
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
