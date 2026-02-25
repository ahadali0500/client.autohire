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
      <label className="block text-sm font-medium">{label}</label>

      <div
        className="w-full px-3 py-2 rounded-lg border-2 border-theme text-sm bg-bg"
      >
        {value.map((tag, index) => (
          <div
            key={index}
            className="
              flex items-center gap-1 
              bg-(--hover-bg) text-primary 
              px-2 py-1 rounded-md text-xs
            "
          >
            {tag}
            <button
              onClick={() => handleRemove(tag)}
              className="text-red-500 hover:text-red-600 ml-1"
            >
              ×
            </button>
          </div>
        ))}

        <input
          type="text"
          value={input}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-sm"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
