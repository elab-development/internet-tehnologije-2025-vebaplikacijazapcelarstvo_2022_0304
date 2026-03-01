"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";





export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/hives", label: "Košnice" },
    { href: "/activities", label: "Aktivnosti" },
    { href: "/profile", label: "Profil" },
    { href: "/statistics", label: "Statistika" },
  ];

  return (
    <nav className="bg-amber-500 text-white h-14 shadow-lg">
      <div className="container mx-auto px-2 h-full flex justify-between items-center">
        {/* Logo */}
        <Link href="/profile" className="flex items-center gap-2 text-2xl font-bold hover:text-amber-100 transition-colors">
        <div className="bg-white/80 backdrop-blur rounded-full p-1 shadow">
          <Image src="/images/logo.png" alt="Košnica PLUS logo" width={36} height={36}/>
        </div>
        
        <span>Košnica PLUS</span>
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