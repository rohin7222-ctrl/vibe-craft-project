"""
College Attendance Predictor & Planner - Backend Calculator
Dataset and date iteration logic for college semester attendance tracking.

Semester Start: August 29, 2026
Semester End:   November 29, 2026
Current Date:   September 28, 2026 (Mocked for calculation)
"""

from datetime import datetime, date, timedelta
from typing import Dict, List, Optional, Any
import json
import math

# Exact timetable dataset for all 10+ sections extracted from college PDFs
# Format: [Monday, Tuesday, Wednesday, Thursday, Friday] represents periods per day
TIMETABLE_DATA: Dict[str, Dict[str, List[int]]] = {
    "IV_ECE_B": {
        "Behavioural Psychology": [1, 0, 2, 1, 0],
        "Wireless Communication": [0, 1, 1, 2, 0],
        "Computer Communication": [1, 2, 0, 0, 0],
        "Semiconductor Memory": [0, 2, 0, 0, 1],
        "Scripting Language": [1, 1, 0, 0, 1],
        "Machine Learning": [1, 0, 1, 0, 1],
        "Lab": [0, 0, 2, 0, 0]
    },
    "III_ECE_DS": {
        "Discrete Mathematics": [0, 0, 1, 1, 1],
        "Microprocessor": [0, 3, 0, 0, 1],
        "VLSI Design": [1, 0, 1, 1, 0],
        "Machine Learning": [0, 0, 1, 1, 1],
        "Database Design": [1, 0, 0, 1, 1],
        "Community Connect": [0, 0, 0, 1, 0],
        "Analytical Skills": [0, 0, 0, 2, 0],
        "Indian Art Form": [1, 0, 0, 0, 0],
        "Lab": [2, 0, 0, 0, 2]
    },
    "II_ECE_DS_A": {
        "Transforms & Boundary": [1, 2, 1, 1, 0],
        "Solid State Devices": [0, 0, 1, 1, 1],
        "Computer Organization": [0, 1, 1, 1, 1],
        "Digital Logic": [0, 1, 1, 0, 1],
        "Electromagnetic Theory": [1, 1, 0, 0, 1],
        "Professional Ethics": [0, 0, 0, 1, 0],
        "Universal Human Values": [2, 2, 0, 0, 0],
        "Verbal Reasoning": [0, 2, 2, 0, 0],
        "Social Engineering": [1, 0, 0, 0, 0],
        "Lab": [2, 0, 0, 2, 0]
    },
    "III_BME": {
        "Probability": [0, 0, 2, 1, 1],
        "Microcontrollers": [1, 0, 1, 1, 0],
        "Biomedical Signal": [0, 0, 2, 1, 0],
        "Biometrics": [0, 0, 1, 0, 1],
        "Modern Wireless": [1, 0, 0, 1, 1],
        "Medical Imaging": [1, 0, 1, 0, 1],
        "Analytical Skills": [2, 0, 2, 0, 0],
        "Indian Art Form": [1, 0, 0, 0, 0],
        "Community Connect": [0, 0, 0, 2, 2],
        "Lab": [2, 0, 2, 0, 0]
    },
    "II_BME": {
        "Transforms": [0, 0, 2, 1, 1],
        "Biomedical Signals": [1, 0, 1, 1, 0],
        "Electric Circuits": [1, 1, 0, 0, 1],
        "Digital Logic": [0, 1, 0, 1, 1],
        "Medical Physics": [1, 1, 0, 1, 0],
        "Professional Ethics": [0, 0, 0, 0, 1],
        "Universal Human Values": [0, 0, 2, 0, 2],
        "Verbal Reasoning": [0, 2, 2, 0, 0],
        "Social Engineering": [0, 0, 1, 0, 0],
        "Lab": [0, 2, 0, 2, 0]
    },
    "I_ECE_A": {
        "Philosophy": [2, 0, 1, 0, 0],
        "Advanced Calculus": [1, 1, 0, 1, 1],
        "Chemistry": [1, 1, 1, 0, 1],
        "PCB Design": [0, 1, 0, 0, 1],
        "Programming": [0, 1, 1, 0, 1],
        "Biology": [1, 0, 0, 0, 1],
        "Aptitude": [1, 0, 0, 2, 0],
        "NSS": [0, 0, 0, 1, 0],
        "German": [0, 0, 0, 1, 1],
        "Labs & Workshop": [2, 2, 4, 0, 0]
    },
    "I_ECE_B_EEE": {
        "Biology / Electrical": [1, 0, 1, 0, 0],
        "CDC": [1, 0, 2, 0, 0],
        "Philosophy": [2, 0, 1, 0, 0],
        "Chemistry": [1, 1, 1, 0, 1],
        "Calculus": [1, 1, 0, 1, 1],
        "PCB Design": [0, 1, 0, 1, 0],
        "Programming": [0, 1, 1, 1, 0],
        "German": [0, 0, 0, 1, 2],
        "Labs & Workshop": [2, 2, 2, 2, 0]
    },
    "I_ECE_DS": {
        "Biology": [1, 0, 0, 1, 0],
        "CDC": [1, 0, 2, 0, 0],
        "Philosophy": [2, 1, 0, 0, 0],
        "Chemistry": [1, 2, 0, 1, 0],
        "Calculus": [1, 1, 1, 1, 0],
        "PCB Design": [0, 1, 0, 1, 0],
        "Programming": [0, 1, 0, 1, 0],
        "German": [0, 0, 0, 1, 1],
        "Labs & Workshop": [2, 2, 2, 0, 2]
    },
    "IV_ECE_A": {
        "Behavioural Psychology": [0, 1, 0, 1, 1],
        "Wireless Communication": [0, 1, 1, 1, 0],
        "Computer Communication": [2, 0, 0, 0, 1],
        "Semiconductor": [2, 0, 0, 0, 1],
        "Scripting": [0, 0, 1, 1, 1],
        "Machine Learning": [1, 0, 1, 1, 0],
        "Lab": [0, 2, 0, 0, 0]
    },
    "III_ECE_B": {
        "Discrete Math": [1, 0, 1, 1, 1],
        "Microprocessor": [1, 1, 2, 0, 0],
        "VLSI": [0, 1, 0, 2, 0],
        "System & Network": [1, 1, 0, 0, 1],
        "Machine Learning": [1, 0, 0, 0, 2],
        "Community Connect": [0, 1, 0, 0, 1],
        "Analytical Skills": [0, 1, 1, 0, 0],
        "Indian Art": [0, 0, 1, 0, 0],
        "Lab": [2, 0, 0, 2, 0]
    },
    "II_ECE_DS_B": {
        "Transforms": [0, 1, 1, 1, 1],
        "Solid State": [1, 0, 0, 1, 1],
        "Computer Org": [2, 0, 0, 1, 1],
        "Digital Logic": [2, 0, 1, 0, 0],
        "Electromagnetic": [1, 0, 1, 1, 0],
        "Professional Ethics": [0, 0, 0, 0, 1],
        "Universal Human Values": [0, 0, 1, 1, 0],
        "Verbal Reasoning": [0, 0, 0, 1, 1],
        "Social Engineering": [0, 1, 1, 0, 0],
        "Lab": [2, 2, 0, 0, 0]
    },
    "III_ECE_A": {
        "Discrete Math": [1, 0, 0, 1, 1],
        "Microprocessor": [0, 1, 2, 1, 0],
        "VLSI": [1, 0, 1, 0, 1],
        "System & Network": [2, 0, 1, 0, 0],
        "Machine Learning": [1, 1, 1, 0, 0],
        "Community Connect": [0, 0, 0, 2, 0],
        "Analytical": [0, 0, 0, 2, 0],
        "Indian Art": [1, 0, 0, 0, 0],
        "Lab": [0, 0, 0, 2, 2]
    }
}


class AttendanceCalculator:
    """
    Modular engine to calculate college attendance metrics:
    T_past, T_future, T_total, required classes to attend, and detention warnings.
    """

    def __init__(
        self,
        semester_start: str = "2026-08-29",
        semester_end: str = "2026-11-29",
        current_date: str = "2026-09-28"
    ):
        self.start_date = datetime.strptime(semester_start, "%Y-%m-%d").date()
        self.end_date = datetime.strptime(semester_end, "%Y-%m-%d").date()
        self.current_date = datetime.strptime(current_date, "%Y-%m-%d").date()

    def count_classes_between(
        self,
        schedule: Dict[str, List[int]],
        from_date: date,
        to_date: date
    ) -> Dict[str, int]:
        """
        Loops through every day from from_date to to_date (inclusive),
        skips Saturday and Sunday, and counts periods for each subject.
        """
        counts = {subject: 0 for subject in schedule}
        if from_date > to_date:
            return counts

        curr = from_date
        while curr <= to_date:
            # Monday=0, Tuesday=1, ..., Friday=4, Saturday=5, Sunday=6
            weekday = curr.weekday()
            if weekday < 5:  # Valid weekday Monday-Friday
                for subject, periods in schedule.items():
                    counts[subject] += periods[weekday]
            curr += timedelta(days=1)

        return counts

    def get_section_metrics(
        self,
        section_name: str,
        target_date_str: Optional[str] = None,
        user_percentages: Optional[Dict[str, float]] = None,
        target_percentage: float = 75.0
    ) -> Dict[str, Any]:
        """
        Calculates T_past, T_future, T_total, attended classes, and required classes to attend.
        """
        if section_name not in TIMETABLE_DATA:
            raise ValueError(
                f"Section '{section_name}' not found. Available: {list(TIMETABLE_DATA.keys())}"
            )

        schedule = TIMETABLE_DATA[section_name]
        user_percentages = user_percentages or {}

        target_date = (
            datetime.strptime(target_date_str, "%Y-%m-%d").date()
            if target_date_str
            else self.end_date
        )

        # T_past: Classes scheduled from Start Date to Current Date (inclusive)
        t_past_counts = self.count_classes_between(schedule, self.start_date, self.current_date)

        # T_future: Classes scheduled from Current Date + 1 to Target Date (inclusive)
        future_start = self.current_date + timedelta(days=1)
        t_future_counts = self.count_classes_between(schedule, future_start, target_date)

        # Classes remaining until semester end
        semester_future_counts = self.count_classes_between(schedule, future_start, self.end_date)

        subjects_result = []
        total_remaining_target = 0
        total_remaining_semester = 0
        has_detention_warning = False

        for idx, (subject, _) in enumerate(schedule.items()):
            t_past = t_past_counts.get(subject, 0)
            t_future = t_future_counts.get(subject, 0)
            t_total = t_past + t_future
            t_sem_rem = semester_future_counts.get(subject, 0)

            total_remaining_target += t_future
            total_remaining_semester += t_sem_rem

            # Student's current percentage
            current_pct = user_percentages.get(subject, 70.0)

            # Attended classes so far
            attended = round((current_pct / 100.0) * t_past) if t_past > 0 else 0

            # Target required classes overall
            target_attended = math.ceil((target_percentage / 100.0) * t_total)
            needed = max(0, target_attended - attended)

            # Maximum achievable percentage if student attends 100% of future classes
            max_achievable = (
                min(100, round(((attended + t_future) / t_total) * 100))
                if t_total > 0
                else 100
            )

            is_irreversible = max_achievable < target_percentage or needed > t_future

            if is_irreversible:
                status = "detention"
                status_text = f"Irreversible Detention! Max achievable attendance is {max_achievable}%."
                has_detention_warning = True
            elif needed == 0:
                status = "safe"
                bunkable = (attended + t_future) - target_attended
                status_text = (
                    f"You are on track! You can safely miss up to {bunkable} classes."
                    if bunkable > 0
                    else "You are on track! Keep it up."
                )
            else:
                ratio = needed / t_future if t_future > 0 else 1.0
                if ratio >= 0.70 or current_pct < target_percentage:
                    status = "danger"
                    has_detention_warning = True
                else:
                    status = "warning"
                status_text = f"You MUST attend {needed} out of {t_future} remaining classes."

            subjects_result.append({
                "subject": subject,
                "t_past": t_past,
                "t_future": t_future,
                "t_total": t_total,
                "current_percentage": current_pct,
                "target_percentage": target_percentage,
                "attended_classes": attended,
                "required_classes_to_attend": needed,
                "max_achievable_percentage": max_achievable,
                "status": status,
                "status_text": status_text,
                "is_irreversible_detention": is_irreversible
            })

        return {
            "section": section_name,
            "section_display_name": section_name.replace("_", " "),
            "target_date": target_date.isoformat(),
            "current_date": self.current_date.isoformat(),
            "semester_start": self.start_date.isoformat(),
            "semester_end": self.end_date.isoformat(),
            "total_classes_remaining_semester": total_remaining_semester,
            "total_classes_remaining_target": total_remaining_target,
            "has_detention_warning": has_detention_warning,
            "subjects": subjects_result
        }

    def calculate_leave_impact(
        self,
        section_name: str,
        leave_days: int = 3,
        user_percentages: Optional[Dict[str, float]] = None
    ) -> Dict[str, Any]:
        """
        Calculates exact percentage drop across all subjects and overall
        if student takes leave_days of medical / sick leave.
        """
        base_metrics = self.get_section_metrics(section_name, user_percentages=user_percentages)
        schedule = TIMETABLE_DATA[section_name]

        total_past_conducted = sum(s["t_past"] for s in base_metrics["subjects"])
        total_past_attended = sum(s["attended_classes"] for s in base_metrics["subjects"])
        current_overall = round((total_past_attended / total_past_conducted) * 100, 1) if total_past_conducted > 0 else 72.8

        total_missed_overall = 0
        subject_impacts = []
        max_safe_days = 20

        for s in base_metrics["subjects"]:
            subj_name = s["subject"]
            weekly_periods = sum(schedule[subj_name])
            avg_per_day = weekly_periods / 5.0
            missed = min(s["t_future"], max(1, round(leave_days * avg_per_day)))
            total_missed_overall += missed

            new_conducted = s["t_past"] + missed
            new_pct = round((s["attended_classes"] / new_conducted) * 100, 1)
            drop = round(s["current_percentage"] - new_pct, 1)

            rem_future = max(0, s["t_future"] - missed)
            max_achievable = round(((s["attended_classes"] + rem_future) / s["t_total"]) * 100)
            required_attended = math.ceil(0.75 * s["t_total"])
            needed = max(0, required_attended - s["attended_classes"])
            is_detained = max_achievable < 75 or needed > rem_future

            # safe days calculation for this subject
            cushion = (s["attended_classes"] + s["t_future"]) - required_attended
            subj_safe = max(0, math.floor(cushion / avg_per_day)) if cushion > 0 else 0
            if subj_safe < max_safe_days:
                max_safe_days = subj_safe

            status = "detention" if is_detained else ("danger" if new_pct < 75 else "safe")

            subject_impacts.append({
                "subject": subj_name,
                "current_percentage": s["current_percentage"],
                "classes_missed": missed,
                "new_percentage": new_pct,
                "percentage_drop": drop,
                "max_achievable": max_achievable,
                "status": status,
                "is_detained": is_detained
            })

        new_overall_conducted = total_past_conducted + total_missed_overall
        new_overall = round((total_past_attended / new_overall_conducted) * 100, 1) if new_overall_conducted > 0 else current_overall
        overall_drop = round(current_overall - new_overall, 1)

        return {
            "section": section_name,
            "leave_days": leave_days,
            "current_overall_percentage": current_overall,
            "projected_overall_percentage": new_overall,
            "overall_percentage_drop": overall_drop,
            "total_classes_missed": total_missed_overall,
            "max_safe_leave_days": max_safe_days,
            "subjects": subject_impacts
        }

    def calculate_od_impact(
        self,
        section_name: str,
        od_days: int = 2,
        user_percentages: Optional[Dict[str, float]] = None
    ) -> Dict[str, Any]:
        """
        Calculates exact attendance boost across all subjects and overall
        if student secures od_days of official approved On-Duty.
        """
        base_metrics = self.get_section_metrics(section_name, user_percentages=user_percentages)
        schedule = TIMETABLE_DATA[section_name]

        total_past_conducted = sum(s["t_past"] for s in base_metrics["subjects"])
        total_past_attended = sum(s["attended_classes"] for s in base_metrics["subjects"])
        current_overall = round((total_past_attended / total_past_conducted) * 100, 1) if total_past_conducted > 0 else 72.8

        total_credited_overall = 0
        subject_impacts = []

        for s in base_metrics["subjects"]:
            subj_name = s["subject"]
            weekly_periods = sum(schedule[subj_name])
            avg_per_day = weekly_periods / 5.0
            credited = min(s["t_future"], max(1, round(od_days * avg_per_day)))
            total_credited_overall += credited

            new_attended = s["attended_classes"] + credited
            new_conducted = s["t_past"] + credited
            new_pct = min(100.0, round((new_attended / newConducted if (newConducted := new_conducted) else 1) * 100, 1))
            boost = round(new_pct - s["current_percentage"], 1)

            subject_impacts.append({
                "subject": subj_name,
                "current_percentage": s["current_percentage"],
                "classes_credited": credited,
                "new_percentage": new_pct,
                "percentage_boost": boost,
                "status": "safe" if new_pct >= 75 else "danger"
            })

        new_overall_attended = total_past_attended + total_credited_overall
        new_overall_conducted = total_past_conducted + total_credited_overall
        new_overall = min(100.0, round((new_overall_attended / new_overall_conducted) * 100, 1)) if new_overall_conducted > 0 else current_overall
        overall_boost = round(new_overall - current_overall, 1)

        return {
            "section": section_name,
            "od_days": od_days,
            "current_overall_percentage": current_overall,
            "projected_overall_percentage": new_overall,
            "overall_percentage_boost": overall_boost,
            "total_classes_credited": total_credited_overall,
            "subjects": subject_impacts
        }


# ==========================================
# FastAPI Web Server (Optional / Ready to Serve)
# ==========================================
try:
    from fastapi import FastAPI, HTTPException, Query
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel, Field

    app = FastAPI(
        title="College Attendance Predictor API",
        version="1.0.0",
        description="Calculates T_past, T_future, T_total and classes required to meet attendance goals."
    )

    # Enable CORS for React / Next.js frontend
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    calc = AttendanceCalculator()

    class PredictionRequest(BaseModel):
        section_name: str = Field(..., example="IV_ECE_B")
        target_date: Optional[str] = Field("2026-11-29", example="2026-11-29")
        target_percentage: Optional[float] = Field(75.0, example=75.0)
        user_percentages: Optional[Dict[str, float]] = Field(
            default_factory=dict,
            example={"Behavioural Psychology": 65.0, "Wireless Communication": 72.0}
        )

    @app.get("/api/sections")
    def list_sections():
        """Returns all available sections."""
        return {
            "sections": [
                {"id": k, "label": k.replace("_", " ")}
                for k in TIMETABLE_DATA.keys()
            ]
        }

    @app.get("/api/timetable/{section_name}")
    def get_timetable(
        section_name: str,
        target_date: Optional[str] = Query("2026-11-29")
    ):
        """Returns subjects, T_past, T_future, and T_total for a section."""
        try:
            return calc.get_section_metrics(section_name, target_date_str=target_date)
        except ValueError as err:
            raise HTTPException(status_code=404, detail=str(err))

    @app.post("/api/predict")
    def predict_attendance(req: PredictionRequest):
        """Calculates prediction with custom current percentages."""
        try:
            return calc.get_section_metrics(
                section_name=req.section_name,
                target_date_str=req.target_date,
                user_percentages=req.user_percentages,
                target_percentage=req.target_percentage
            )
        except ValueError as err:
            raise HTTPException(status_code=404, detail=str(err))

    class LeaveImpactRequest(BaseModel):
        section_name: str = Field(..., example="IV_ECE_B")
        leave_days: int = Field(3, example=3)
        user_percentages: Optional[Dict[str, float]] = Field(default_factory=dict)

    class ODImpactRequest(BaseModel):
        section_name: str = Field(..., example="IV_ECE_B")
        od_days: int = Field(2, example=2)
        user_percentages: Optional[Dict[str, float]] = Field(default_factory=dict)

    @app.post("/api/leave-impact")
    def get_leave_impact(req: LeaveImpactRequest):
        """Calculates exact attendance drop for medical / sick leave."""
        try:
            return calc.calculate_leave_impact(
                section_name=req.section_name,
                leave_days=req.leave_days,
                user_percentages=req.user_percentages
            )
        except ValueError as err:
            raise HTTPException(status_code=404, detail=str(err))

    @app.post("/api/od-impact")
    def get_od_impact(req: ODImpactRequest):
        """Calculates exact attendance boost for On-Duty (OD)."""
        try:
            return calc.calculate_od_impact(
                section_name=req.section_name,
                od_days=req.od_days,
                user_percentages=req.user_percentages
            )
        except ValueError as err:
            raise HTTPException(status_code=404, detail=str(err))

except ImportError:
    app = None


# ==========================================
# Standalone CLI Demo
# ==========================================
if __name__ == "__main__":
    import sys

    calculator = AttendanceCalculator()
    demo_section = "IV_ECE_B"
    print("=" * 65)
    print(f"COLLEGE ATTENDANCE PREDICTOR - METRICS FOR {demo_section}")
    print("=" * 65)

    sample_percentages = {
        "Behavioural Psychology": 65.0,
        "Wireless Communication": 72.0,
        "Computer Communication": 82.0,
        "Semiconductor Memory": 70.0,
        "Scripting Language": 78.0,
        "Machine Learning": 60.0,
        "Lab": 85.0
    }

    result = calculator.get_section_metrics(
        section_name=demo_section,
        target_date_str="2026-11-29",
        user_percentages=sample_percentages,
        target_percentage=75.0
    )

    print(f"Semester Start: {result['semester_start']}")
    print(f"Current Date:   {result['current_date']}")
    print(f"Target Date:    {result['target_date']}")
    print(f"Total Remaining Classes: {result['total_classes_remaining_semester']}")
    print(f"Detention Warning Active: {result['has_detention_warning']}")
    print("-" * 65)
    print(f"{'Subject':<25} | {'T_past':<6} | {'T_future':<8} | {'T_total':<7} | {'Needed':<6} | Status")
    print("-" * 65)

    for s in result["subjects"]:
        print(f"{s['subject']:<25} | {s['t_past']:<6} | {s['t_future']:<8} | {s['t_total']:<7} | {s['required_classes_to_attend']:<6} | {s['status'].upper()}")

    print("=" * 65)
    print("Run `uvicorn backend.attendance_calculator:app --reload --port 8000` to start FastAPI server.")
