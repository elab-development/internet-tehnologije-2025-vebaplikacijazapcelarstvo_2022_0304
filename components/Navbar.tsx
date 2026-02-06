"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";





export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/hives", label: "Košnice" },
    { href: "/activities", label: "Aktivnosti" },
    { href: "/profile", label: "Profil" },
  ];

  return (
    <nav className="bg-amber-500 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/profile" className="text-2xl font-bold hover:text-amber-100 transition-colors">
        Pčelarstvo
        </Link>

        {/* Navigacioni linkovi */}
        <ul className="flex space-x-6">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`hover:text-amber-100 transition-colors font-medium ${
                  pathname === link.href
                    ? "border-b-2 border-white pb-1"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}