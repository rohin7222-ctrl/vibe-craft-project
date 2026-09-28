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

// Helper to extract default subject inputs from a section in TIMETABLE_DATA
const getInitialSubjectsForSection = (sectionKey: string): SubjectInput[] => {
  const schedule = TIMETABLE_DATA[sectionKey] || TIMETABLE_DATA['IV_ECE_B'];
  const defaultPercentages = [65, 72, 82, 70, 78, 60, 85, 75, 68, 74];
  
  return Object.keys(schedule).map((name, index) => ({
    id: `subj-${index + 1}`,
    name,
    currentPercentage: defaultPercentages[index % defaultPercentages.length],
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
      userPercentages[s.name] = s.currentPercentage;
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
      subjects.forEach(s => { userPercentages[s.name] = s.currentPercentage; });

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
