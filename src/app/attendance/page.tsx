'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SubjectInput, SubjectPrediction, SimulationSettings } from '@/types/attendance';
import { 
  calculateAttendanceMetrics, 
  SEMESTER_END_DATE 
} from '@/utils/attendanceCalculator';
import { TIMETABLE_DATA } from '@/data/timetableData';
import { InputScreen } from '@/components/InputScreen';
import { DashboardScreen } from '@/components/DashboardScreen';
import { BrandHero } from '@/components/BrandHero';
import { ChatbotWidget } from '@/components/ChatbotWidget';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

// Helper to extract clean initial subject inputs from a section in TIMETABLE_DATA (no hardcoded low percentages)
const getInitialSubjectsForSection = (sectionKey: string): SubjectInput[] => {
  const schedule = TIMETABLE_DATA[sectionKey] || TIMETABLE_DATA['IV_ECE_B'];
  
  return Object.keys(schedule).map((name, index) => ({
    id: `subj-${index + 1}`,
    name,
    currentPercentage: 0,
    isEntered: false,
  }));
};

export default function Home() {
  // Application State
  const [section, setSection] = useState<string>('IV_ECE_B');
  const [targetDate, setTargetDate] = useState<string>(SEMESTER_END_DATE);
  const [subjects, setSubjects] = useState<SubjectInput[]>(() =>
    getInitialSubjectsForSection('IV_ECE_B')
  );
  const [predictions, setPredictions] = useState<SubjectPrediction[]>([]);
  const [totalClassesRemaining, setTotalClassesRemaining] = useState<number>(45);
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'split' | 'dashboard' | 'input'>('split');

  // Leave & OD Simulator State
  const [simulation, setSimulation] = useState<SimulationSettings>({
    odDays: 0,
    sickDays: 0,
  });

  // Calculation function using the real college timetable metrics & simulation
  const runCalculations = useCallback((
    currentSection: string,
    currentTargetDate: string,
    currentSubjects: SubjectInput[],
    currentSimulation: SimulationSettings
  ) => {
    const userPercentages: Record<string, number> = {};
    for (const s of currentSubjects) {
      if (s.isEntered) {
        userPercentages[s.name] = s.currentPercentage;
      }
    }

    const metrics = calculateAttendanceMetrics(
      currentSection,
      currentTargetDate,
      userPercentages,
      75,
      currentSimulation
    );

    // Map metrics to SubjectPrediction format
    const formattedPredictions: SubjectPrediction[] = metrics.subjects.map(m => ({
      id: m.id,
      name: m.name,
      currentPercentage: m.currentPercentage,
      targetPercentage: m.targetPercentage,
      remainingClasses: m.tFuture,
      requiredClassesToAttend: m.requiredClassesToAttend,
      status: m.status,
      statusText: m.statusText,
      isIrreversibleDetention: m.isIrreversibleDetention,
      maxAchievablePercentage: m.maxAchievablePercentage,
      iconType: m.iconType,
      tPast: m.tPast,
      tFuture: m.tFuture,
      tTotal: m.tTotal,
      bunkableClasses: m.bunkableClasses,
      odCredit: m.odCredit,
      sickDeduction: m.sickDeduction,
      consecutiveClassesNeeded: m.consecutiveClassesNeeded,
      immediateBunkableClasses: m.immediateBunkableClasses,
      isEntered: m.isEntered,
    }));

    setPredictions(formattedPredictions);
    setTotalClassesRemaining(metrics.totalClassesRemainingSemester);
  }, []);

  // When section changes, auto-populate subjects for that section and recompute
  const handleSectionChange = (newSection: string) => {
    setSection(newSection);
    const newSubjects = getInitialSubjectsForSection(newSection);
    setSubjects(newSubjects);
    runCalculations(newSection, targetDate, newSubjects, simulation);
  };

  // Perform calculation when section, targetDate, subjects, or simulation changes
  useEffect(() => {
    runCalculations(section, targetDate, subjects, simulation);
  }, [runCalculations, section, targetDate, subjects, simulation]);

  /**
   * Predict handler - Calls /api/predict or updates local model
   */
  const handlePredict = async () => {
    setIsPredicting(true);

    try {
      const userPercentages: Record<string, number> = {};
      subjects.forEach(s => { 
        if (s.isEntered) {
          userPercentages[s.name] = s.currentPercentage; 
        }
      });

      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section,
          targetDate,
          userPercentages,
          targetPercentage: 75,
          simulation,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const data = json.data;
        const formatted: SubjectPrediction[] = data.subjects.map((m: any) => ({
          id: m.id,
          name: m.name,
          currentPercentage: m.currentPercentage,
          targetPercentage: m.targetPercentage,
          remainingClasses: m.tFuture,
          requiredClassesToAttend: m.requiredClassesToAttend,
          status: m.status,
          statusText: m.statusText,
          isIrreversibleDetention: m.isIrreversibleDetention,
          maxAchievablePercentage: m.maxAchievablePercentage,
          iconType: m.iconType,
          tPast: m.tPast,
          tFuture: m.tFuture,
          tTotal: m.tTotal,
          bunkableClasses: m.bunkableClasses,
          odCredit: m.odCredit,
          sickDeduction: m.sickDeduction,
          consecutiveClassesNeeded: m.consecutiveClassesNeeded,
          immediateBunkableClasses: m.immediateBunkableClasses,
          isEntered: m.isEntered,
        }));
        setPredictions(formatted);
        setTotalClassesRemaining(data.totalClassesRemainingSemester);
      } else {
        runCalculations(section, targetDate, subjects, simulation);
      }
    } catch {
      runCalculations(section, targetDate, subjects, simulation);
    } finally {
      setIsPredicting(false);
      // On mobile screens, automatically show the dashboard tab on calculate
      if (window.innerWidth < 1024) {
        setViewMode('dashboard');
      }
    }
  };

  const handleGoBack = () => {
    setViewMode('input');
  };

  const sectionDisplayName = section.replace(/_/g, ' ');

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 relative selection:bg-blue-600 selection:text-white pb-24">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-50/70 via-indigo-50/30 to-transparent pointer-events-none -z-10" />
      
      {/* Corner Decorative Accent */}
      <div className="absolute bottom-6 left-6 grid grid-cols-4 gap-2 opacity-25 pointer-events-none hidden sm:grid">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header & Navbar */}
        <BrandHero 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          sectionDisplayName={sectionDisplayName} 
        />

        {/* ======================================================== */}
        {/* 1. SPLIT VIEW (Desktop Side-by-Side: Input on Left, Dashboard on Right) */}
        {/* ======================================================== */}
        {viewMode === 'split' && (
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form */}
            <div className="lg:col-span-5">
              <InputScreen
                section={section}
                setSection={handleSectionChange}
                targetDate={targetDate}
                setTargetDate={setTargetDate}
                subjects={subjects}
                setSubjects={setSubjects}
                onPredict={handlePredict}
                isPredicting={isPredicting}
              />
            </div>

            {/* Right Column: Live Dashboard */}
            <div className="lg:col-span-7">
              <DashboardScreen
                section={sectionDisplayName}
                targetDate={targetDate}
                totalClassesRemaining={totalClassesRemaining}
                subjects={predictions}
                onGoBack={handleGoBack}
                simulation={simulation}
                setSimulation={setSimulation}
              />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. FULL DASHBOARD VIEW (Spacious, Complete Insights) */}
        {/* ======================================================== */}
        {viewMode === 'dashboard' && (
          <div className="mt-4 max-w-5xl mx-auto">
            <DashboardScreen
              section={sectionDisplayName}
              targetDate={targetDate}
              totalClassesRemaining={totalClassesRemaining}
              subjects={predictions}
              onGoBack={handleGoBack}
              simulation={simulation}
              setSimulation={setSimulation}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. FOCUSED INPUT VIEW (For mobile or quick form filling) */}
        {/* ======================================================== */}
        {viewMode === 'input' && (
          <div className="mt-4 max-w-xl mx-auto">
            <InputScreen
              section={section}
              setSection={handleSectionChange}
              targetDate={targetDate}
              setTargetDate={setTargetDate}
              subjects={subjects}
              setSubjects={setSubjects}
              onPredict={handlePredict}
              isPredicting={isPredicting}
            />
          </div>
        )}
      </div>

      {/* Floating Return to Room Booking Page Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <Link
          href="/locator"
          className="group flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white px-4 py-3 rounded-full shadow-2xl shadow-emerald-500/35 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border-2 border-emerald-400/40"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div className="flex flex-col text-left pr-1">
            <span className="text-xs font-black tracking-wide leading-tight">
              Room Booking &amp; Map
            </span>
            <span className="text-[10px] text-emerald-100 font-semibold leading-tight">
              Return to Vacant Rooms ➔
            </span>
          </div>
        </Link>
      </div>

      {/* Floating Attendance Advisor AI Chatbot */}
      <ChatbotWidget
        section={section}
        sectionDisplayName={sectionDisplayName}
        targetDate={targetDate}
        totalClassesRemaining={totalClassesRemaining}
        subjects={predictions}
        simulation={simulation}
      />
    </div>
  );
}
