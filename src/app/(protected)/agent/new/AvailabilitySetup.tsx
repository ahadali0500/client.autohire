import React from "react";

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
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
});

interface AvailabilitySetupProps {
  value: DateAvailability[];
  onChange: (value: DateAvailability[]) => void;

  interview_start_date?: string;
  interview_end_date?: string;
  errors?: any;
}

const AvailabilitySetup: React.FC<AvailabilitySetupProps> = ({ value, onChange, interview_start_date, interview_end_date, errors}) => {

  const data = value || [];

  const setData = (newData: DateAvailability[]) => {
    onChange(newData);
  };

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
  const updateDate = (index: number, dateValue: string) => {
    const updated = [...data];
    updated[index].date = dateValue;

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
    slotValue: string
  ) => {
    const updated = [...data];
    updated[dateIndex].slots[slotIndex][field] = slotValue;

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
  return (
    <section className="bg-card border border-theme rounded-xl p-6 space-y-6">
      <h2 className="text-xl font-semibold">Availability Setup *</h2>
      <div className="space-y-4">
        {data.map((d, dateIndex) => (
          <div key={dateIndex} className="bg-bg border border-theme rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <input
                type="date"
                value={d.date}
                min={interview_start_date?.split("T")[0]}
                max={interview_end_date?.split("T")[0]}
                onChange={(e) => updateDate(dateIndex, e.target.value)}
                className="w-full max-w-xs px-3 py-2 rounded-lg border-2 border-theme outline-none text-sm bg-bg"
              />
              <button
                onClick={() => removeDate(dateIndex)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove Date
              </button>
            </div>
            {d.error && <p className="text-red-500 text-xs mb-2">{d.error}</p>}

            {d.slots.map((s, slotIndex) => (
              <div key={slotIndex} className="flex items-center gap-2 mb-2">
                <select
                  value={s.start}
                  onChange={(e) =>
                    updateSlot(dateIndex, slotIndex, "start", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg border-2 border-theme outline-none text-sm bg-bg"
                >
                  <option value="">Start</option>
                  {timeOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <span>-</span>
                <select
                  value={s.end}
                  onChange={(e) =>
                    updateSlot(dateIndex, slotIndex, "end", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg border-2 border-theme outline-none text-sm bg-bg"
                >
                  <option value="">End</option>
                  {timeOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => removeSlot(dateIndex, slotIndex)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              onClick={() => addSlot(dateIndex)}
              className="text-sm text-blue-500 hover:underline mt-2"
            >
              + Add Time Slot
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addDate}
        className="w-full py-2 px-4 border-2 border-dashed border-theme rounded-lg hover:bg-hover-bg transition text-sm"
      >
        + Add another day
      </button>
    </section>
  );
};

export default AvailabilitySetup;

