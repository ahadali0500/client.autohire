"use client";

import { useState, KeyboardEvent, ChangeEvent } from "react";

interface TagInputProps {
  label: string;
  placeholder: string;
  value: string[];
  onChange: (val: string[]) => void;
}

export default function TagInput({
  label,
  placeholder,
  value,
  onChange,
}: TagInputProps) {
  const [input, setInput] = useState<string>("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();

      const newTag = input.trim().replace(",", "");
      if (!newTag) return;

      if (!value.includes(newTag)) {
        onChange([...value, newTag]);
      }

      setInput("");
    }

    if (e.key === "Backspace" && input === "") {
      onChange(value.slice(0, -1));
    }
  };

  const handleRemove = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="block text-sm">{label}</label>

      <div
        className="w-full px-3 py-2 rounded-lg border-2 border-theme bg-bg flex flex-wrap items-center gap-2"
      >
        {value.map((tag, index) => (
          <div
            key={index}
            className="
              flex items-center gap-1 
              bg-hover-bg text-primary 
              px-2 py-1 rounded-md text-sm
            "
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemove(tag)}
              className="text-red-500 hover:text-red-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}

        <input
          type="text"
          value={input}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-sm min-w-[120px]"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
