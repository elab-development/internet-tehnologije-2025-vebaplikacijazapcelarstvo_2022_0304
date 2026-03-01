"use client";
import { useState } from "react";

export default function PosaljiNotifikaciju() {
  const [poruka, setPoruka] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [poruka_odgovora, setPoruka_odgovora] = useState("");

  async function handleSend() {
    if (!poruka.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ poruka }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setPoruka_odgovora(data.message);
        setPoruka("");
      } else {
        setStatus("error");
        setPoruka_odgovora(data.error || "Greška pri slanju.");
      }
    } catch {
      setStatus("error");
      setPoruka_odgovora("Greška pri slanju. Pokušajte ponovo.");
    }

    setTimeout(() => setStatus("idle"), 4000);
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl shadow-lg border border-orange-200 dark:border-orange-800 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/40 rounded-xl flex items-center justify-center text-xl">
            📢
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              Pošalji obaveštenje
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Poruka će biti poslata svim korisnicima
            </p>
          </div>
        </div>

        <textarea
          value={poruka}
          onChange={(e) => setPoruka(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="Unesite poruku za sve korisnike..."
          className="w-full px-4 py-3 rounded-xl border border-orange-200 dark:border-orange-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 placeholder-gray-400"
        />

        <div className="flex items-center justify-between mt-2 mb-3">
          <span className="text-xs text-gray-400">{poruka.length}/500 karaktera</span>
        </div>

        {status !== "idle" && (
          <div className={`mb-3 px-4 py-2 rounded-lg text-sm font-medium ${
            status === "success"
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
              : status === "error"
              ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
              : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
          }`}>
            {status === "loading" ? "Slanje u toku..." : poruka_odgovora}
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={!poruka.trim() || status === "loading"}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors shadow-md hover:shadow-lg"
        >
          {status === "loading" ? "Šalje se..." : "Pošalji svim korisnicima"}
        </button>
      </div>
    </div>
  );
}