"use client";


type ButtonProps = {
text: string;
onClick?: () => void;
variant?: "primary" | "danger";
};


export default function Button({ text, onClick, variant = "primary" }: ButtonProps) {
const base = "px-4 py-2 rounded";
const styles = variant === "primary" ? "bg-yellow-400 text-black" : "bg-red-500";


return (
<button onClick={onClick} className={`${base} ${styles}`}>
{text}
</button>
);
}