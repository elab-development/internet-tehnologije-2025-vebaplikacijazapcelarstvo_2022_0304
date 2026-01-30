"use client";
import Link from "next/link";


export default function Navbar() {
return (
<nav className="bg-yellow-400 text-black px-6 py-4 flex gap-6">
<Link href="/">Početna</Link>
<Link href="/dashboard">Dashboard</Link>
<Link href="/hives">Košnice</Link>
<Link href="/activities">Aktivnosti</Link>
<Link href="/login">Login</Link>
</nav>
);
}