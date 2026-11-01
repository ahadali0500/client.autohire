'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

// ─── API Types (based on your real response) ─────────────────────────────────

type AvailabilitySlot = {
  availability_slot_id: number;
  start_time: string; // "09:00:00"
  end_time: string;   // "09:30:00"
  is_booked: boolean;
};

type InterviewDate = {
  availability_date_id: number;
  date: string;
  availability_slots: AvailabilitySlot[];
};

type RecruitmentAgent = {
  agent_id: number;
  job_title: string;
  job_description: string;
  max_candidate: number;
  status: string;
  interview_date: InterviewDate[];
};

type CandidateHeader = {
  name?: string;
  email?: string;
};

type CandidateDataParsed = {
  header?: CandidateHeader;
};

type CandidateResult = {
  candidate_id: number;
  agent_id: number;
  candidate_file_path: string;
  candidate_data: CandidateDataParsed; // stringified JSON
  parse_status: string;
  score_status: string;
  outreach_status: string;
  interview_status: string | null;
  created_at: string;
  recruitment_agent: RecruitmentAgent;
};

type ApiResponse = {
  success: boolean;
  message: string;
  errors: unknown;
  result: CandidateResult;
};

// ─── UI Types ────────────────────────────────────────────────────────────────

type Slot = {
  start: string;
  end: string;
  error: string;
  availability_slot_id: number;
};

type ScheduleDay = {
  date: string;
  availability_date_id: number;
  slots: Slot[];
};

type Candidate = {
  name: string;
  email: string;
};

type Job = {
  title: string;
  type: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return {
    weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
    day: d.getDate(),
    month: d.toLocaleDateString('en-US', { month: 'short' }),
    full: d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
  };
}

function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${suffix}`;
}

function normalizeTime(time: string) {
  // "09:00:00" -> "09:00"
  return time.slice(0, 5);
}

function parseCandidateData(candidateData: CandidateDataParsed): Candidate {
  try {
    return {
      name: candidateData?.header?.name || 'Candidate',
      email: candidateData?.header?.email || 'candidate@email.com',
    };
  } catch (error) {
    console.error('Failed to read candidate_data:', error);
    return {
      name: 'Candidate',
      email: 'candidate@email.com',
    };
  }
}

function transformSchedule(interviewDates: InterviewDate[]): ScheduleDay[] {
  return interviewDates.map((day) => ({
    date: day.date,
    availability_date_id: day.availability_date_id,
    slots: day.availability_slots.map((slot) => ({
      availability_slot_id: slot.availability_slot_id,
      start: normalizeTime(slot.start_time),
      end: normalizeTime(slot.end_time),
      error: slot.is_booked ? 'Already booked' : '',
    })),
  }));
}

// ─── Components ──────────────────────────────────────────────────────────────

function AutoHireLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: '#1d4ed8' }}
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
        Auto<span style={{ color: '#1d4ed8' }}>Hire</span>
      </span>
    </div>
  );
}

function MetaCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
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

function DateRow({
  dateStr,
  selected,
  onClick,
}: {
  dateStr: string;
  selected: boolean;
  onClick: () => void;
}) {
  const { weekday, day, month } = formatDate(dateStr);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-all duration-150 group
        ${
          selected
            ? 'border-blue-200 bg-blue-50'
            : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
        }`}
    >
      <div
        className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center flex-shrink-0 transition-colors
          ${selected ? 'bg-blue-600' : 'bg-gray-100 group-hover:bg-gray-200'}`}
      >
        <span
          className={`text-[10px] font-semibold uppercase leading-none ${
            selected ? 'text-blue-100' : 'text-gray-400'
          }`}
        >
          {weekday}
        </span>
        <span
          className={`text-[17px] font-bold leading-tight ${
            selected ? 'text-white' : 'text-gray-700'
          }`}
        >
          {day}
        </span>
      </div>

      <div className="min-w-0">
        <div
          className={`text-[13px] font-semibold ${
            selected ? 'text-blue-700' : 'text-gray-700'
          }`}
        >
          {month} {day}
        </div>
        <div className="text-[12px] text-gray-400">{weekday}</div>
      </div>

      {selected && (
        <div className="ml-auto">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
        </div>
      )}
    </button>
  );
}

function SlotButton({
  slot,
  selected,
  onSelect,
}: {
  slot: Slot;
  selected: boolean;
  onSelect: (slot: Slot) => void;
}) {
  const disabled = !!slot.error;
  const label = `${formatTime(slot.start)} – ${formatTime(slot.end)}`;

  return (
    <button
      disabled={disabled}
      onClick={() => !disabled && onSelect(slot)}
      title={disabled ? slot.error : ''}
      className={`relative w-full text-[13px] font-medium rounded-xl border px-3 py-2.5 transition-all duration-150
        ${
          disabled
            ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
            : selected
            ? 'border-blue-300 bg-blue-50 text-blue-700 ring-1 ring-blue-200'
            : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200 hover:bg-gray-50'
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

function SuccessScreen({
  selectedDate,
  selectedSlot,
  candidateEmail,
  jobTitle,
}: {
  selectedDate: string;
  selectedSlot: Slot;
  candidateEmail: string;
  jobTitle: string;
}) {
  const { full } = formatDate(selectedDate);

  return (
    <div className="flex flex-col items-center text-center py-12 px-6">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: '#f0fdf4' }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
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
        Your interview has been confirmed. You&apos;ll receive a calendar invite at{' '}
        <span className="font-medium text-gray-700">{candidateEmail}</span>.
      </p>

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
            <p className="text-[12px] text-gray-400 mt-1">{jobTitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InterviewScheduler() {
  const params = useParams();
  const candidateId = params?.candidate_id as string;

  const [job, setJob] = useState<Job>({
    title: 'Interview',
    type: 'Remote',
  });

  const [candidate, setCandidate] = useState<Candidate>({
    name: 'Candidate',
    email: 'candidate@email.com',
  });

  const [schedule, setSchedule] = useState<ScheduleDay[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [confirming, setConfirming] = useState<boolean>(false);

  useEffect(() => {
    if (!candidateId) return;

    const fetchCandidateSchedule = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await fetch(`${API_BASE_URL}/agent/candidate/${candidateId}`);

        if (!res.ok) {
          throw new Error(`Failed to fetch data (${res.status})`);
        }

        const data: ApiResponse = await res.json();

        if (!data.success || !data.result) {
          throw new Error(data.message || 'Invalid API response');
        }

        const result = data.result;
        const parsedCandidate = parseCandidateData(result.candidate_data);
        const transformedSchedule = transformSchedule(
          result.recruitment_agent?.interview_date || []
        );

        setCandidate(parsedCandidate);
        setJob({
          title: result.recruitment_agent?.job_title || 'Interview',
          type: 'Remote',
        });
        setSchedule(transformedSchedule);

        setSelectedDate(
          transformedSchedule.length > 0 ? transformedSchedule[0].date : null
        );
        setSelectedSlot(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateSchedule();
  }, [candidateId]);

  const activeSchedule = schedule.find((s) => s.date === selectedDate);
  const slots = activeSchedule?.slots || [];

  function handleDateSelect(dateStr: string) {
    setSelectedDate(dateStr);
    setSelectedSlot(null);
  }

  async function handleConfirm() {
    if (!selectedSlot || !selectedDate) return;

    try {
      setConfirming(true);

      const res = await fetch(
        `${API_BASE_URL}/agent/schedule/interview`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            candidate_id: Number(candidateId),
            availability_slot_id: selectedSlot.availability_slot_id,
          }),
        }
      );

      if (!res.ok) {
        // Try to parse the error response
        let errorMessage = 'Failed to confirm booking';
        try {
          const errorData = await res.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (jsonError) {
          // If parsing fails, use the status text
          errorMessage = `Failed to confirm booking: ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }

      setConfirmed(true);
    } catch (err) {
      console.error('Confirm error:', err);
      alert(
        err instanceof Error
          ? err.message
          : 'Could not confirm booking. Please try again.'
      );
    } finally {
      setConfirming(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-8 max-w-md w-full text-center">
          <p className="text-[14px] text-gray-500">Loading schedule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-red-100 rounded-2xl p-8 max-w-md w-full text-center">
          <p className="text-[14px] font-semibold text-red-600 mb-2">
            Failed to load schedule
          </p>
          <p className="text-[13px] text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (schedule.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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

      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8 px-1">
            <AutoHireLogo />
            <span className="text-[12px] text-gray-400 font-medium">
              Interview Scheduling
            </span>
          </div>

          <div className="mb-6 px-1">
            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight leading-snug">
              {job.title} Interview
            </h1>
            <p className="text-[14px] text-gray-500 mt-1">
              Select a date and time for your interview
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            <MetaCard label="Candidate" value={candidate.name} />
            <MetaCard label="Email" value={candidate.email} />
            <MetaCard label="Role Type" value={job.type} />
          </div>

          {confirmed && selectedDate && selectedSlot ? (
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <SuccessScreen
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                candidateEmail={candidate.email}
                jobTitle={job.title}
              />
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <p className="text-[14px] font-semibold text-gray-800">
                  Available Times
                </p>
                <span className="text-[12px] text-gray-400">
                  {schedule.length} date{schedule.length !== 1 ? 's' : ''} available
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
                <div className="border-b md:border-b-0 md:border-r border-gray-100 p-4 flex flex-col gap-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1 px-1">
                    Date
                  </p>

                  {schedule.map((s) => (
                    <DateRow
                      key={s.availability_date_id}
                      dateStr={s.date}
                      selected={s.date === selectedDate}
                      onClick={() => handleDateSelect(s.date)}
                    />
                  ))}
                </div>

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
                      {slots.map((slot) => (
                        <SlotButton
                          key={slot.availability_slot_id}
                          slot={slot}
                          selected={
                            selectedSlot?.availability_slot_id ===
                            slot.availability_slot_id
                          }
                          onSelect={setSelectedSlot}
                        />
                      ))}
                    </div>
                  )}

                  {slots.some((s) => s.error) && (
                    <p className="text-[11px] text-gray-400 mt-3 px-1">
                      Greyed-out slots are currently unavailable.
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0">
                    {selectedSlot && selectedDate ? (
                      <div>
                        <p className="text-[12px] text-gray-400 mb-0.5">Selected</p>
                        <p className="text-[14px] font-semibold text-gray-800 truncate">
                          {formatDate(selectedDate).full}
                        </p>
                        <p className="text-[13px] text-blue-600 font-medium">
                          {formatTime(selectedSlot.start)} – {formatTime(selectedSlot.end)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[13px] text-gray-400">
                        Select a date and time to continue
                      </p>
                    )}
                  </div>

                  <button
                    disabled={!selectedSlot || confirming}
                    onClick={handleConfirm}
                    className={`flex-shrink-0 px-6 py-2.5 rounded-xl text-[14px] font-semibold transition-all duration-150
                      ${
                        selectedSlot && !confirming
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    {confirming ? 'Confirming...' : 'Confirm Booking'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-[12px] text-gray-400">
              Powered by <span className="font-semibold text-gray-500">AutoHire</span> ·
              Interview Scheduling
            </p>
          </div>
        </div>
      </div>
    </>
  );
}