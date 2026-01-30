"use client";


type InputProps = {
placeholder: string;
type?: string;
value: string;
onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};


export default function Input({ placeholder, type = "text", value, onChange }: InputProps) {
return (
<input
className="border p-2 rounded text-black w-full"
placeholder={placeholder}
type={type}
value={value}
onChange={onChange}
/>
);
}