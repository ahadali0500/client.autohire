'use client'

import React, { useState } from "react";

type Slot = {
  start: string;
  end: string;
  error?: string;
};

type DateAvailability = {
  date: string;
  slots: Slot[];
  error?: string;
};

const timeOptions = Array.from({ length: 96 }, (_, i) => {
  const h = Math.floor((i * 15) / 60);
  const m = (i * 15) % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
});

const MultiDateSlotPicker = () => {
  const [data, setData] = useState<DateAvailability[]>([]);

  // ➕ Add Date
  const addDate = () => {
    setData([...data, { date: "", slots: [] }]);
  };

  // ❌ Remove Date
  const removeDate = (index: number) => {
    const updated = [...data];
    updated.splice(index, 1);
    setData(updated);
  };

  // 📅 Update Date (WITH DUPLICATE CHECK)
  const updateDate = (index: number, value: string) => {
    const updated = [...data];
    updated[index].date = value;

    // reset all errors
    updated.forEach((d) => (d.error = ""));

    // check duplicates
    const dates = updated.map((d) => d.date).filter(Boolean);
    const duplicates = dates.filter(
      (d, i) => dates.indexOf(d) !== i
    );

    updated.forEach((d) => {
      if (duplicates.includes(d.date)) {
        d.error = "This date is already selected";
      }
    });

    setData(updated);
  };

  // ➕ Add Slot
  const addSlot = (dateIndex: number) => {
    const updated = [...data];
    updated[dateIndex].slots.push({ start: "", end: "" });
    setData(updated);
  };

  // ❌ Remove Slot
  const removeSlot = (dateIndex: number, slotIndex: number) => {
    const updated = [...data];
    updated[dateIndex].slots.splice(slotIndex, 1);
    setData(updated);
  };

  // ✏ Update Slot
  const updateSlot = (
    dateIndex: number,
    slotIndex: number,
    field: "start" | "end",
    value: string
  ) => {
    const updated = [...data];
    updated[dateIndex].slots[slotIndex][field] = value;

    validateSlots(updated, dateIndex);
    setData(updated);
  };

  // 🔍 Validation
  const validateSlots = (state: DateAvailability[], dateIndex: number) => {
    const slots = state[dateIndex].slots;

    slots.forEach((s) => (s.error = ""));

    for (let i = 0; i < slots.length; i++) {
      const { start, end } = slots[i];

      if (!start || !end) {
        slots[i].error = "Required";
        continue;
      }

      if (start >= end) {
        slots[i].error = "Invalid time range";
      }
    }

    const sorted = [...slots].sort((a, b) =>
      a.start.localeCompare(b.start)
    );

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].start < sorted[i - 1].end) {
        sorted[i].error = "Overlapping slot";
      }
    }
  };

  // 💾 Submit
  const handleSubmit = () => {
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-8">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">
            Availability Setup
          </h1>
          <p className="text-[var(--subtext)] text-sm">
            Add multiple dates and define available time slots
          </p>
        </div>

        {/* DATE CARDS */}
        <div className="space-y-4">
          {data.map((d, dateIndex) => (
            <div
              key={dateIndex}
              className="p-5 rounded-xl border border-theme card-theme shadow-sm hover:shadow-md transition"
            >
              {/* DATE HEADER */}
              <div className="flex justify-between items-center mb-3">
                <input
                  type="date"
                  value={d.date}
                  onChange={(e) =>
                    updateDate(dateIndex, e.target.value)
                  }
                  className="border border-theme bg-transparent p-2 rounded w-60"
                />

                <button
                  onClick={() => removeDate(dateIndex)}
                  className="text-sm px-3 py-1 rounded bg-[var(--error)] text-white"
                >
                  Remove
                </button>
              </div>

              {/* DATE ERROR */}
              {d.error && (
                <p className="text-[var(--error)] text-sm mb-2">
                  {d.error}
                </p>
              )}

              {/* SLOTS */}
              <div className="space-y-2">
                {d.slots.map((slot, slotIndex) => (
                  <div key={slotIndex}>
                    <div className="flex gap-2">
                      <select
                        value={slot.start}
                        onChange={(e) =>
                          updateSlot(
                            dateIndex,
                            slotIndex,
                            "start",
                            e.target.value
                          )
                        }
                        className="flex-1 p-2 border border-theme rounded select-theme"
                      >
                        <option value="">Start</option>
                        {timeOptions.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>

                      <select
                        value={slot.end}
                        onChange={(e) =>
                          updateSlot(
                            dateIndex,
                            slotIndex,
                            "end",
                            e.target.value
                          )
                        }
                        className="flex-1 p-2 border border-theme rounded select-theme"
                      >
                        <option value="">End</option>
                        {timeOptions.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>

                      <button
                        onClick={() =>
                          removeSlot(dateIndex, slotIndex)
                        }
                        className="px-3 rounded bg-[var(--error)] text-white"
                      >
                        ✕
                      </button>
                    </div>

                    {/* SLOT ERROR */}
                    {slot.error && (
                      <p className="text-[var(--error)] text-xs mt-1">
                        {slot.error}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* ADD SLOT */}
              <button
                onClick={() => addSlot(dateIndex)}
                className="mt-3 text-sm px-3 py-1 rounded bg-[var(--primary-light)] text-[var(--primary)]"
              >
                + Add Slot
              </button>
            </div>
          ))}
        </div>

        {/* ADD DATE */}
        <button
          onClick={addDate}
          className="mt-6 px-5 py-2 rounded bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
        >
          + Add Date
        </button>

        {/* SAVE */}
        <button
          onClick={handleSubmit}
          className="mt-4 w-full py-3 rounded bg-[var(--success)] text-white text-lg"
        >
          Save Availability
        </button>
      </div>
    </div>
  );
};

export default MultiDateSlotPicker;