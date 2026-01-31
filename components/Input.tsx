"use client";

type InputProps = {
  placeholder: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export default function Input({
  placeholder,
  type = "text",
  value,
  onChange,
  className = "",
}: InputProps) {
  return (
    <input
      className={`w-full rounded p-2 
        bg-gray-800 text-white placeholder-gray-400 
        border border-gray-700
        focus:outline-none focus:ring-2 focus:ring-amber-500
        ${className}`}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={onChange}
    />
  );
}
