"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Korisnik = {
  id: number;
  ime: string;
  email: string;
  uloga: "ADMIN" | "KORISNIK" | "MENADZER";
  createdAt: string;
  _count: { kosnice: number; aktivnosti: number };
};

const ULOGA_LABEL: Record<string, string> = {
  ADMIN: "Administrator",
  KORISNIK: "Pčelar",
  MENADZER: "Menadžer",
};

const ULOGA_COLOR: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  KORISNIK: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  MENADZER: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
};

export default function AdminClient() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  const [korisnici, setKorisnici] = useState<Korisnik[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalTip, setModalTip] = useState<"uloga" | "sifra" | "brisanje" | null>(null);
  const [odabraniKorisnik, setOdabraniKorisnik] = useState<Korisnik | null>(null);
  const [novaUloga, setNovaUloga] = useState<"KORISNIK" | "MENADZER">("KORISNIK");
  const [novaSifra, setNovaSifra] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    fetchKorisnici();
  }, []);

  async function fetchKorisnici() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Greška pri učitavanju.");
        return;
      }
      const data = await res.json();
      setKorisnici(data.data);
    } catch {
      setError("Greška pri učitavanju korisnika.");
    } finally {
      setLoading(false);
    }
  }

  function otvoriModal(tip: "uloga" | "sifra" | "brisanje", k: Korisnik) {
    setOdabraniKorisnik(k);
    setModalTip(tip);
    setNovaUloga(k.uloga === "MENADZER" ? "MENADZER" : "KORISNIK");
    setNovaSifra("");
    setActionMsg("");
  }

  function zatvoriModal() {
    setModalTip(null);
    setOdabraniKorisnik(null);
    setActionMsg("");
  }

  async function handlePromeniUlogu() {
    if (!odabraniKorisnik) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: odabraniKorisnik.id, uloga: novaUloga }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionMsg("✅ Uloga uspešno promenjena.");
        await fetchKorisnici();
        setTimeout(zatvoriModal, 1500);
      } else {
        setActionMsg("❌ " + (data.error || "Greška."));
      }
    } catch {
      setActionMsg("❌ Greška pri ažuriranju.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleResetujSifru() {
    if (!odabraniKorisnik || !novaSifra.trim()) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: odabraniKorisnik.id, novaSifra }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionMsg("✅ Lozinka uspešno promenjena.");
        setTimeout(zatvoriModal, 1500);
      } else {
        setActionMsg("❌ " + (data.error || "Greška."));
      }
    } catch {
      setActionMsg("❌ Greška pri ažuriranju.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleObrisiKorisnika() {
    if (!odabraniKorisnik) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: odabraniKorisnik.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionMsg("✅ Korisnik obrisan.");
        await fetchKorisnici();
        setTimeout(zatvoriModal, 1200);
      } else {
        setActionMsg("❌ " + (data.error || "Greška."));
      }
    } catch {
      setActionMsg("❌ Greška pri brisanju.");
    } finally {
      setActionLoading(false);
    }
  }

  const stats = {
    ukupno: korisnici.length,
    admini: korisnici.filter((k) => k.uloga === "ADMIN").length,
    pcelari: korisnici.filter((k) => k.uloga === "KORISNIK").length,
    menadzeri: korisnici.filter((k) => k.uloga === "MENADZER").length,
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            🛠️ Admin Panel
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Upravljanje korisnicima sistema
          </p>
        </div>
        <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium transition-colors"
            >
            🚪 Odjavi se
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Ukupno", value: stats.ukupno, color: "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700" },
          { label: "Administratori", value: stats.admini, color: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" },
          { label: "Pčelari", value: stats.pcelari, color: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800" },
          { label: "Menadžeri", value: stats.menadzeri, color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-xl border p-4 text-center shadow-sm`}>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{s.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Učitavanje...</div>
      ) : error ? (
        <div className="text-center py-16 text-red-500">{error}</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Korisnik</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Uloga</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700 dark:text-gray-300">Košnice</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700 dark:text-gray-300">Aktivnosti</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Datum</th>
                  <th className="px-6 py-4 text-right font-semibold text-gray-700 dark:text-gray-300">Akcije</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {korisnici.map((k) => (
                  <tr key={k.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{k.ime}</p>
                        <p className="text-xs text-gray-400">{k.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ULOGA_COLOR[k.uloga]}`}>
                        {ULOGA_LABEL[k.uloga]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-700 dark:text-gray-300 font-medium">
                      {k._count.kosnice}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-700 dark:text-gray-300 font-medium">
                      {k._count.aktivnosti}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                      {new Date(k.createdAt).toLocaleDateString("sr-RS")}
                    </td>
                    <td className="px-6 py-4">
                      {k.uloga !== "ADMIN" && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => otvoriModal("uloga", k)}
                            className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium transition-colors"
                          >
                            Uloga
                          </button>
                          <button
                            onClick={() => otvoriModal("sifra", k)}
                            className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/40 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-medium transition-colors"
                          >
                            Lozinka
                          </button>
                          <button
                            onClick={() => otvoriModal("brisanje", k)}
                            className="px-3 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 rounded-lg text-xs font-medium transition-colors"
                          >
                            Obriši
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalTip && odabraniKorisnik && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            {modalTip === "uloga" && (
              <>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Promena uloge</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Korisnik: <strong>{odabraniKorisnik.ime}</strong>
                </p>
                <div className="flex gap-3 mb-6">
                  {(["KORISNIK", "MENADZER"] as const).map((u) => (
                    <button
                      key={u}
                      onClick={() => setNovaUloga(u)}
                      className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-all ${
                        novaUloga === u
                          ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                          : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                      }`}
                    >
                      {ULOGA_LABEL[u]}
                    </button>
                  ))}
                </div>
                {actionMsg && <p className="text-sm mb-4 text-center font-medium">{actionMsg}</p>}
                <div className="flex gap-3">
                  <button onClick={zatvoriModal} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                    Otkaži
                  </button>
                  <button
                    onClick={handlePromeniUlogu}
                    disabled={actionLoading}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm disabled:opacity-50 transition-colors"
                  >
                    {actionLoading ? "..." : "Sačuvaj"}
                  </button>
                </div>
              </>
            )}

            {modalTip === "sifra" && (
              <>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Reset lozinke</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Korisnik: <strong>{odabraniKorisnik.ime}</strong>
                </p>
                <input
                  type="password"
                  placeholder="Nova lozinka (min. 6 karaktera)"
                  value={novaSifra}
                  onChange={(e) => setNovaSifra(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl mb-4 dark:bg-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                {actionMsg && <p className="text-sm mb-4 text-center font-medium">{actionMsg}</p>}
                <div className="flex gap-3">
                  <button onClick={zatvoriModal} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                    Otkaži
                  </button>
                  <button
                    onClick={handleResetujSifru}
                    disabled={actionLoading || novaSifra.length < 6}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm disabled:opacity-50 transition-colors"
                  >
                    {actionLoading ? "..." : "Resetuj"}
                  </button>
                </div>
              </>
            )}

            {modalTip === "brisanje" && (
              <>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Brisanje korisnika</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Da li ste sigurni da želite obrisati <strong>{odabraniKorisnik.ime}</strong>?
                </p>
                <p className="text-xs text-red-500 dark:text-red-400 mb-6 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  ⚠️ Ova akcija je nepovratna. Biće obrisane sve košnice, aktivnosti i komentari.
                </p>
                {actionMsg && <p className="text-sm mb-4 text-center font-medium">{actionMsg}</p>}
                <div className="flex gap-3">
                  <button onClick={zatvoriModal} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                    Otkaži
                  </button>
                  <button
                    onClick={handleObrisiKorisnika}
                    disabled={actionLoading}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm disabled:opacity-50 transition-colors"
                  >
                    {actionLoading ? "..." : "Obriši"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}