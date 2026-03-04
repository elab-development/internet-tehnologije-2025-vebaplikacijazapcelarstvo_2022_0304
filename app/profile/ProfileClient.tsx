"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ProfileClientProps = {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    rawRole: string;
    joinedDate: string;
    pol?: boolean | null;
  };
  stats: {
    hives: number;
    activities: number;
    notifications: number;
  };
  notifications: Array<{
    id: number;
    message: string;
    activityTitle?: string | null;
    createdAt: Date;
  }>;
};

export default function ProfileClient({ user, stats, notifications }: ProfileClientProps) {
  const router = useRouter();

  // Pol modal
  const [polModal, setPolModal] = useState(false);
  const [pol, setPol] = useState<boolean>(user.pol ?? true);
  const [trenutniPol, setTrenutniPol] = useState<boolean>(user.pol ?? true);
  const [polStatus, setPolStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [polPoruka, setPolPoruka] = useState("");

  // Lozinka modal
  const [sifraModal, setSifraModal] = useState(false);
  const [trenutnaSifra, setTrenutnaSifra] = useState("");
  const [novaSifra, setNovaSifra] = useState("");
  const [potvrdiSifru, setPotvrdiSifru] = useState("");
  const [sifraStatus, setSifraStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [sifraPoruka, setSifraPoruka] = useState("");

  async function handleLogout() {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Greška prilikom odjave:', error);
    }
  }

  async function handleSacuvajPol() {
    setPolStatus("loading");
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pol }),
      });
      const data = await res.json();
      if (res.ok) {
        setPolStatus("success");
        setPolPoruka("Pol uspešno promenjen.");
        setTrenutniPol(pol);
        setTimeout(() => {
          setPolModal(false);
          setPolStatus("idle");
          router.refresh();
        }, 1500);
      } else {
        setPolStatus("error");
        setPolPoruka(data.error || "Greška.");
      }
    } catch {
      setPolStatus("error");
      setPolPoruka("Greška pri čuvanju.");
    }
  }

  async function handleSacuvajSifru() {
    if (novaSifra !== potvrdiSifru) {
      setSifraStatus("error");
      setSifraPoruka("Lozinke se ne poklapaju.");
      return;
    }
    setSifraStatus("loading");
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trenutnaSifra, novaSifra }),
      });
      const data = await res.json();
      if (res.ok) {
        setSifraStatus("success");
        setSifraPoruka("Lozinka uspešno promenjena.");
        setTimeout(() => {
          setSifraModal(false);
          setSifraStatus("idle");
          setTrenutnaSifra("");
          setNovaSifra("");
          setPotvrdiSifru("");
        }, 1500);
      } else {
        setSifraStatus("error");
        setSifraPoruka(data.error || "Greška.");
      }
    } catch {
      setSifraStatus("error");
      setSifraPoruka("Greška pri čuvanju.");
    }
  }

  function zatvoriPolModal() {
    setPolModal(false);
    setPol(trenutniPol);
    setPolStatus("idle");
    setPolPoruka("");
  }

  function zatvoriSifraModal() {
    setSifraModal(false);
    setTrenutnaSifra("");
    setNovaSifra("");
    setPotvrdiSifru("");
    setSifraStatus("idle");
    setSifraPoruka("");
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Moj Profil
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Dobrodošli nazad, {user.name}!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEVA STRANA */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Košnice Card */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl shadow-lg border border-amber-200 dark:border-amber-800 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center">
                    <img src="/images/beehive.png" alt="Košnice" className="w-10 h-10 object-contain" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Košnice</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Vaše pčelinje kolonije</p>
                  </div>
                </div>
                <p className="text-5xl font-bold text-amber-600 dark:text-amber-400">{stats.hives}</p>
              </div>

              {stats.hives === 0 ? (
                <div className="mt-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border-2 border-dashed border-amber-300 dark:border-amber-700">
                    <div className="text-6xl mb-2">🐝</div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Nemate nijednu košnicu</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Započnite praćenje vaših pčelinjih kolonija</p>
                    <Link href="/hives">
                      <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-md hover:shadow-lg">
                        + Dodaj prvu košnicu
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <Link href="/hives">
                  <button className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors shadow-md hover:shadow-lg">
                    Pregled svih košnica →
                  </button>
                </Link>
              )}
            </div>
          </div>
          
          {/* Aktivnosti Card */}
          <Link href="/activities">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl shadow-lg border border-blue-200 dark:border-blue-800 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
                      <img src="/images/aktivnosti.png" alt="Aktivnosti" className="w-10 h-10 object-contain" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Aktivnosti</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Zakazani zadaci i pregledi</p>
                    </div>
                  </div>
                  <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">{stats.activities}</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* DESNA STRANA */}
        <div className="space-y-6">
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-24"></div>
            <div className="px-6 pb-6 -mt-12">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-gray-700 border-4 border-white dark:border-gray-800 shadow-xl mb-4">
                  <img
                    src={trenutniPol ? "/images/korisnikM.png" : "/images/korisnikZ.png"}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">{user.name}</h2>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-3">
                  <span className="text-xl">👤</span>
                  <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">{user.role}</span>
                </div>
                <div className="w-full space-y-3 mt-4 text-left">
                  <div className="flex items-start gap-3 text-sm bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <span className="text-lg">📧</span>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</p>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">{user.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Akcije */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 px-2">Brze akcije</h3>
            <div className="space-y-2">

              {/* Promeni lozinku */}
              <button
                onClick={() => setSifraModal(true)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl transition-all"
              >
                <span className="text-lg">🔑</span>
                <span>Promeni lozinku</span>
              </button>

              {/* Podešavanja */}
              <button
                onClick={() => setPolModal(true)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl transition-all"
              >
                <span className="text-lg">⚙️</span>
                <span>Podešavanja</span>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl transition-all border border-red-200 dark:border-red-800"
              >
                <span className="text-lg">🚪</span>
                <span>Odjavi se</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL - Podešavanja (pol) */}
      {polModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">⚙️ Podešavanja</h2>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Pol</p>
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setPol(true)}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-all ${
                  pol
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                    : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400"
                }`}
              >
                👨 Muško
              </button>
              <button
                onClick={() => setPol(false)}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-all ${
                  !pol
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                    : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400"
                }`}
              >
                👩 Žensko
              </button>
            </div>
            {polStatus !== "idle" && (
              <p className={`text-sm mb-4 text-center font-medium ${
                polStatus === "success" ? "text-green-600" :
                polStatus === "error" ? "text-red-600" : "text-gray-500"
              }`}>
                {polStatus === "loading" ? "Čuvanje..." : polPoruka}
              </p>
            )}
            <div className="flex gap-3">
              <button onClick={zatvoriPolModal} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                Otkaži
              </button>
              <button
                onClick={handleSacuvajPol}
                disabled={polStatus === "loading"}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm disabled:opacity-50 transition-colors"
              >
                {polStatus === "loading" ? "..." : "Sačuvaj"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL - Promena lozinke */}
      {sifraModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">🔑 Promena lozinke</h2>
            <div className="space-y-3 mb-6">
              <input
                type="password"
                placeholder="Trenutna lozinka"
                value={trenutnaSifra}
                onChange={(e) => setTrenutnaSifra(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <input
                type="password"
                placeholder="Nova lozinka (min. 6 karaktera)"
                value={novaSifra}
                onChange={(e) => setNovaSifra(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <input
                type="password"
                placeholder="Potvrdi novu lozinku"
                value={potvrdiSifru}
                onChange={(e) => setPotvrdiSifru(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            {sifraStatus !== "idle" && (
              <p className={`text-sm mb-4 text-center font-medium ${
                sifraStatus === "success" ? "text-green-600" :
                sifraStatus === "error" ? "text-red-600" : "text-gray-500"
              }`}>
                {sifraStatus === "loading" ? "Čuvanje..." : sifraPoruka}
              </p>
            )}
            <div className="flex gap-3">
              <button onClick={zatvoriSifraModal} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                Otkaži
              </button>
              <button
                onClick={handleSacuvajSifru}
                disabled={sifraStatus === "loading" || !trenutnaSifra || !novaSifra || !potvrdiSifru}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm disabled:opacity-50 transition-colors"
              >
                {sifraStatus === "loading" ? "..." : "Sačuvaj"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}