'use client'
import { useState } from "react";

// ─── Sample Data ────────────────────────────────────────────────────────────

const JOB = {
  title: "Senior Data Engineer",
  type: "Full-time · Remote",
};

const COMPANY = {
  name: "Meridian Labs",
  logo: null, // placeholder
};

const CANDIDATE = {
  name: "Ayesha Tariq",
  email: "ayesha.tariq@email.com",
};

const SCHEDULE = [
  {
    date: "2026-03-18",
    slots: [
      { start: "09:00", end: "09:30", error: "" },
      { start: "10:00", end: "10:30", error: "" },
      { start: "11:30", end: "12:00", error: "" },
      { start: "14:00", end: "14:30", error: "Interviewer unavailable" },
      { start: "15:00", end: "15:30", error: "" },
    ],
  },
  {
    date: "2026-03-19",
    slots: [
      { start: "10:00", end: "10:30", error: "" },
      { start: "11:00", end: "11:30", error: "" },
      { start: "12:00", end: "12:30", error: "" },
      { start: "16:00", end: "16:30", error: "Slot no longer available" },
    ],
  },
  {
    date: "2026-03-20",
    slots: [
      { start: "09:30", end: "10:00", error: "" },
      { start: "13:00", end: "13:30", error: "" },
    ],
  },
  {
    date: "2026-03-23",
    slots: [
      { start: "11:00", end: "11:30", error: "" },
      { start: "14:30", end: "15:00", error: "" },
      { start: "16:00", end: "16:30", error: "" },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr:any) {
  const d = new Date(dateStr + "T00:00:00");
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
    day: d.getDate(),
    month: d.toLocaleDateString("en-US", { month: "short" }),
    full: d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  };
}

function formatTime(t:any) {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${suffix}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AutoHireLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: "#1d4ed8" }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 12L6.5 4L10 12M4.5 9.5h4"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="5" r="2" fill="white" fillOpacity="0.85" />
        </svg>
      </div>
      <span className="font-semibold text-[15px] tracking-tight text-gray-900">
        Auto<span style={{ color: "#1d4ed8" }}>Hire</span>
      </span>
    </div>
  );
}

function MetaCard({ label, value, sub }:any) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex flex-col gap-0.5 min-w-0">
      <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
        {label}
      </span>
      <span className="text-[14px] font-semibold text-gray-800 truncate leading-snug">
        {value}
      </span>
      {sub && (
        <span className="text-[12px] text-gray-400 truncate">{sub}</span>
      )}
    </div>
  );
}

function DateRow({ dateStr, selected, onClick }:any) {
  const { weekday, day, month } = formatDate(dateStr);
  const isSelected = selected;
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-all duration-150 group
        ${
          isSelected
            ? "border-blue-200 bg-blue-50"
            : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
        }`}
    >
      <div
        className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center flex-shrink-0 transition-colors
          ${isSelected ? "bg-blue-600" : "bg-gray-100 group-hover:bg-gray-200"}`}
      >
        <span
          className={`text-[10px] font-semibold uppercase leading-none ${
            isSelected ? "text-blue-100" : "text-gray-400"
          }`}
        >
          {weekday}
        </span>
        <span
          className={`text-[17px] font-bold leading-tight ${
            isSelected ? "text-white" : "text-gray-700"
          }`}
        >
          {day}
        </span>
      </div>
      <div className="min-w-0">
        <div
          className={`text-[13px] font-semibold ${
            isSelected ? "text-blue-700" : "text-gray-700"
          }`}
        >
          {month} {day}
        </div>
        <div className="text-[12px] text-gray-400">{weekday}</div>
      </div>
      {isSelected && (
        <div className="ml-auto">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
        </div>
      )}
    </button>
  );
}

function SlotButton({ slot, selected, onSelect }:any) {
  const disabled = !!slot.error;
  const isSelected = selected;
  const label = `${formatTime(slot.start)} – ${formatTime(slot.end)}`;

  return (
    <button
      disabled={disabled}
      onClick={() => !disabled && onSelect(slot)}
      title={disabled ? slot.error : ""}
      className={`relative w-full text-[13px] font-medium rounded-xl border px-3 py-2.5 transition-all duration-150
        ${
          disabled
            ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
            : isSelected
            ? "border-blue-300 bg-blue-50 text-blue-700 ring-1 ring-blue-200"
            : "border-gray-100 bg-white text-gray-700 hover:border-gray-200 hover:bg-gray-50"
        }`}
    >
      {label}
      {disabled && (
        <span className="absolute top-1 right-2 text-[10px] text-gray-300">
          ✕
        </span>
      )}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          className="text-gray-400"
        >
          <rect
            x="3"
            y="5"
            width="16"
            height="14"
            rx="2.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M7 3v4M15 3v4M3 9h16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <p className="text-[14px] font-semibold text-gray-600 mb-1">
        No slots available
      </p>
      <p className="text-[13px] text-gray-400">
        There are currently no available interview slots.
        <br />
        Please check back later or contact the recruiter.
      </p>
    </div>
  );
}

function SuccessScreen({ selectedDate, selectedSlot }:any) {
  const { full } = formatDate(selectedDate);
  return (
    <div className="flex flex-col items-center text-center py-12 px-6">
      {/* Icon */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: "#f0fdf4" }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
        >
          <circle cx="14" cy="14" r="12" stroke="#16a34a" strokeWidth="1.5" />
          <path
            d="M9 14.5l3.5 3.5 6.5-7"
            stroke="#16a34a"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-widest text-green-600 mb-2">
        Confirmed
      </p>
      <h2 className="text-[22px] font-bold text-gray-900 tracking-tight mb-2">
        Interview Scheduled
      </h2>
      <p className="text-[14px] text-gray-500 mb-8 max-w-sm">
        Your interview has been confirmed. You'll receive a calendar invite at{" "}
        <span className="font-medium text-gray-700">{CANDIDATE.email}</span>.
      </p>

      {/* Detail card */}
      <div className="w-full max-w-sm border border-gray-100 rounded-2xl p-5 bg-white text-left mb-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              className="text-blue-600"
            >
              <rect
                x="2"
                y="3"
                width="14"
                height="12"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path
                d="M5 2v2M13 2v2M2 7h14"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-gray-800">{full}</p>
            <p className="text-[13px] text-blue-600 font-medium mt-0.5">
              {formatTime(selectedSlot.start)} – {formatTime(selectedSlot.end)}
            </p>
            <p className="text-[12px] text-gray-400 mt-1">{JOB.title}</p>
          </div>
        </div>
      </div>

      <button
        className="flex items-center gap-2 border border-gray-200 rounded-xl px-5 py-2.5 text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          className="text-gray-500"
        >
          <path
            d="M12 2H3a1 1 0 00-1 1v10a1 1 0 001 1h9a1 1 0 001-1V3a1 1 0 00-1-1z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M5 1v2M10 1v2M2 5h11"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
        Add to Calendar
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InterviewScheduler() {
  const schedule = SCHEDULE || [];
  const [selectedDate, setSelectedDate] = useState(
    schedule.length > 0 ? schedule[0].date : null
  );
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const activeSchedule = schedule.find((s) => s.date === selectedDate);
  const slots = activeSchedule?.slots || [];

  function handleDateSelect(dateStr:any) {
    setSelectedDate(dateStr);
    setSelectedSlot(null);
  }

  function handleConfirm() {
    if (selectedSlot) setConfirmed(true);
  }

  if (schedule.length === 0) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <div className="bg-white border border-gray-100 rounded-2xl p-8 max-w-md w-full">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <div
        className="min-h-screen bg-gray-50 py-8 px-4"
        // style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="max-w-3xl mx-auto">
          {/* ── Top brand bar ── */}
          <div className="flex items-center justify-between mb-8 px-1">
            <AutoHireLogo />
            <span className="text-[12px] text-gray-400 font-medium">
              Interview Scheduling
            </span>
          </div>

          {/* ── Header ── */}
          <div className="mb-6 px-1">
            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight leading-snug">
              {JOB.title} Interview
            </h1>
            <p className="text-[14px] text-gray-500 mt-1">
              Select a date and time for your interview
            </p>
          </div>

          {/* ── Meta info cards ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <MetaCard label="Company" value={COMPANY.name} />
            <MetaCard label="Candidate" value={CANDIDATE.name} />
            <MetaCard label="Email" value={CANDIDATE.email} />
            <MetaCard label="Role Type" value={JOB.type} />
          </div>

          {/* ── Main scheduler card ── */}
          {confirmed ? (
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <SuccessScreen
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
              />
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              {/* Card header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <p className="text-[14px] font-semibold text-gray-800">
                  Available Times
                </p>
                <span className="text-[12px] text-gray-400">
                  {schedule.length} date{schedule.length !== 1 ? "s" : ""}{" "}
                  available
                </span>
              </div>

              {/* Two-column body */}
              <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
                {/* Left: Date list */}
                <div className="border-b md:border-b-0 md:border-r border-gray-100 p-4 flex flex-col gap-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1 px-1">
                    Date
                  </p>
                  {schedule.map((s) => (
                    <DateRow
                      key={s.date}
                      dateStr={s.date}
                      selected={s.date === selectedDate}
                      onClick={() => handleDateSelect(s.date)}
                    />
                  ))}
                </div>

                {/* Right: Time slots */}
                <div className="p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Time Slot
                    </p>
                    <span className="text-[11px] text-gray-400 bg-gray-50 border border-gray-100 rounded-md px-2 py-0.5">
                      All times in PKT
                    </span>
                  </div>

                  {slots.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center py-10">
                      <p className="text-[13px] text-gray-400">
                        No slots for this date
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {slots.map((slot, i) => (
                        <SlotButton
                          key={i}
                          slot={slot}
                          selected={
                            selectedSlot?.start === slot.start &&
                            selectedSlot?.end === slot.end
                          }
                          onSelect={setSelectedSlot}
                        />
                      ))}
                    </div>
                  )}

                  {/* Disabled slot note */}
                  {slots.some((s) => s.error) && (
                    <p className="text-[11px] text-gray-400 mt-3 px-1">
                      Greyed-out slots are currently unavailable.
                    </p>
                  )}
                </div>
              </div>

              {/* ── Confirmation bar ── */}
              <div className="border-t border-gray-100 px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  {/* Summary */}
                  <div className="min-w-0">
                    {selectedSlot && selectedDate ? (
                      <div>
                        <p className="text-[12px] text-gray-400 mb-0.5">
                          Selected
                        </p>
                        <p className="text-[14px] font-semibold text-gray-800 truncate">
                          {formatDate(selectedDate).full}
                        </p>
                        <p className="text-[13px] text-blue-600 font-medium">
                          {formatTime(selectedSlot?.start)} –{" "}
                          {formatTime(selectedSlot?.end)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[13px] text-gray-400">
                        Select a date and time to continue
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <button
                    disabled={!selectedSlot}
                    onClick={handleConfirm}
                    className={`flex-shrink-0 px-6 py-2.5 rounded-xl text-[14px] font-semibold transition-all duration-150
                      ${
                        selectedSlot
                          ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Footer ── */}
          <div className="mt-8 text-center">
            <p className="text-[12px] text-gray-400">
              Powered by{" "}
              <span className="font-semibold text-gray-500">AutoHire</span> ·
              Interview Scheduling
            </p>
          </div>
        </div>
      </div>
    </>
  );
}