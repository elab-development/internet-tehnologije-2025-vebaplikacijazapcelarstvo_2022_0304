"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

type Notifikacija = {
  id: number;
  poruka: string;
  createdAt: string;
  seen: boolean;
  aktivnost?: {
    naslov: string;
    tip: string;
  } | null;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  uloga?: string | null;
};

export default function NotifikacijePanel({ isOpen, onClose, uloga }: Props) {
  const [notifikacije, setNotifikacije] = useState<Notifikacija[]>([]);
  const [loading, setLoading] = useState(false);
  const [poruka, setPoruka] = useState("");
  const [slanjeStatus, setSlanjeStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [slanjeMsg, setSlanjeMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchNotifikacije();
    }
  }, [isOpen]);

  async function fetchNotifikacije() {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = await res.json();
      setNotifikacije(data.data || []);
    } catch {
      // nije prijavljen
    } finally {
      setLoading(false);
    }
  }

  async function oznаciKaoProcitanu(id: number) {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setNotifikacije((prev) =>
      prev.map((n) => (n.id === id ? { ...n, seen: true } : n))
    );
  }

  async function oznаciSveKaoProcitane() {
    const neprocitane = notifikacije.filter((n) => !n.seen);
    for (const n of neprocitane) {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: n.id }),
      });
    }
    setNotifikacije((prev) => prev.map((n) => ({ ...n, seen: true })));
  }

  async function handlePosaljiNotifikaciju() {
    if (!poruka.trim()) return;
    setSlanjeStatus("loading");
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ poruka }),
      });
      const data = await res.json();
      if (res.ok) {
        setSlanjeStatus("success");
        setSlanjeMsg(data.message);
        setPoruka("");
      } else {
        setSlanjeStatus("error");
        setSlanjeMsg(data.error || "Greška pri slanju.");
      }
    } catch {
      setSlanjeStatus("error");
      setSlanjeMsg("Greška pri slanju.");
    }
    setTimeout(() => setSlanjeStatus("idle"), 4000);
  }

  const neprocitane = notifikacije.filter((n) => !n.seen).length;

  function formatirajDatum(datum: string) {
    return new Intl.DateTimeFormat("sr-RS", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(datum));
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-amber-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src="/images/bell.png" alt="Obaveštenja" width={24} height={24} />
              <h2 className="font-bold text-white text-base">Obaveštenja</h2>
              {neprocitane > 0 && (
                <span className="bg-white text-amber-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {neprocitane}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {neprocitane > 0 && (
                <button
                  onClick={oznаciSveKaoProcitane}
                  className="text-xs text-white/90 hover:text-white underline font-medium"
                >
                  Sve pročitano
                </button>
              )}
              <button
                onClick={onClose}
                className="text-white hover:text-white/70 text-2xl leading-none font-light"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : notifikacije.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center px-4">
              <span className="text-4xl mb-2">📭</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Nema obaveštenja
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {notifikacije.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.seen && oznаciKaoProcitanu(notif.id)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    !notif.seen ? "bg-amber-50 dark:bg-amber-900/10" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                        notif.aktivnost
                          ? "bg-blue-100 dark:bg-blue-900/30"
                          : "bg-orange-100 dark:bg-orange-900/30"
                      }`}
                    >
                      {notif.aktivnost
                        ? <Image src="/images/aktivnosti.png" alt="Aktivnost" width={20} height={20} />
                        : <Image src="/images/sticky-notes.png" alt="Obaveštenje" width={20} height={20} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm leading-snug ${
                          !notif.seen
                            ? "text-gray-900 dark:text-gray-100 font-medium"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {notif.poruka}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-400">
                          {formatirajDatum(notif.createdAt)}
                        </span>
                        {!notif.seen && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sekcija za slanje - samo za ADMIN */}
        {uloga === "MENADZER" && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
              📢 Pošalji obaveštenje svim korisnicima
            </p>
            <textarea
              value={poruka}
              onChange={(e) => setPoruka(e.target.value)}
              maxLength={500}
              rows={2}
              placeholder="Unesite poruku..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <div className="flex items-center justify-between mt-1 mb-2">
              <span className="text-xs text-gray-400">{poruka.length}/500</span>
            </div>
            {slanjeStatus !== "idle" && (
              <p className={`text-xs mb-2 font-medium ${
                slanjeStatus === "success" ? "text-green-600" : 
                slanjeStatus === "error" ? "text-red-600" : "text-gray-500"
              }`}>
                {slanjeStatus === "loading" ? "Slanje..." : slanjeMsg}
              </p>
            )}
            <button
              onClick={handlePosaljiNotifikaciju}
              disabled={!poruka.trim() || slanjeStatus === "loading"}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg text-sm transition-colors"
            >
              Pošalji
            </button>
          </div>
        )}
      </div>
    </>
  );
}