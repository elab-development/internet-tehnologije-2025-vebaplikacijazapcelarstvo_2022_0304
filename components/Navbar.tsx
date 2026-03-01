"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import NotifikacijePanel from "@/components/NotifikacijePanel";

export default function Navbar() {
  const pathname = usePathname();
  const [panelOtvoren, setPanelOtvoren] = useState(false);
  const [neprocitane, setNeprocitane] = useState(0);

 const links = [
    { href: "/hives", label: "Košnice", icon: "/images/beehive.png" },
    { href: "/activities", label: "Aktivnosti", icon: "/images/aktivnosti.png" },
    { href: "/profile", label: "Profil", icon: "/images/profile.png" },
    { href: "/statistics", label: "Statistika", icon: "/images/statistics.png" },
  ];

  useEffect(() => {
    fetchBrojNeprocitanih();
  }, []);

  async function fetchBrojNeprocitanih() {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = await res.json();
      const broj = (data.data || []).filter((n: { seen: boolean }) => !n.seen).length;
      setNeprocitane(broj);
    } catch {
      // nije prijavljen
    }
  }

  function handleZatvoriPanel() {
    setPanelOtvoren(false);
    fetchBrojNeprocitanih();
  }

  return (
    <>
      <nav className="bg-amber-500 text-white h-14 shadow-lg">
        <div className="container mx-auto px-2 h-full flex justify-between items-center">
          <Link href="/profile" className="flex items-center gap-2 text-2xl font-bold hover:text-amber-100 transition-colors">
            <div className="bg-white/80 backdrop-blur rounded-full p-1 shadow">
              <Image src="/images/logo.png" alt="Košnica PLUS logo" width={36} height={36} />
            </div>
            <span>Košnica PLUS</span>
          </Link>

          <div className="flex items-center gap-4">
            <ul className="flex space-x-6">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`hover:text-amber-100 transition-colors font-medium flex items-center gap-1 ${
                      pathname === link.href ? "border-b-2 border-white pb-1" : ""
                    }`}
                  >
                    {link.icon && (
                      <Image src={link.icon} alt={link.label} width={20} height={20} />
                    )}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Zvonce */}
            <button
              onClick={() => setPanelOtvoren(true)}
              className="relative p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <Image src="/images/bell.png" alt="Obaveštenja" width={24} height={24} />
              {neprocitane > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {neprocitane > 9 ? "9+" : neprocitane}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <NotifikacijePanel isOpen={panelOtvoren} onClose={handleZatvoriPanel} />
    </>
  );
}