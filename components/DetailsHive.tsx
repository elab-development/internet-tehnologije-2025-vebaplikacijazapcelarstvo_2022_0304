"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DeleteConfirmModal from "./DeleteConfirmModal";
import EditHiveModal from "./EditHiveModal";
import PreuzmiKomentarePDF from "./PreuzmiKomentare";

interface Komentar {
  id: number;
  sadrzaj: string;
  createdAt: string;
  jacinaKosnice: string;
  korisnik: {
    ime: string;
    email: string;
  };
}

interface HiveModalProps {
  hive: {
    id: number;
    naziv: string;
    jacina: string;
    brPcela: number;
    brRamova: number;
    createdAt: string;
  };
  onClose: () => void;
  onHiveDeleted: (id: number) => void;
  onHiveUpdated: (updatedHive: any) => void;
}

export default function HiveModal({ hive, onClose, onHiveDeleted, onHiveUpdated }: HiveModalProps) {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [komentari, setKomentari] = useState<Komentar[]>([]);
  const [noviKomentar, setNoviKomentar] = useState("");
  const [loadingKomentari, setLoadingKomentari] = useState(false);
  const [dodajeKomentar, setDodajeKomentar] = useState(false);
  const [komentarGreska, setKomentarGreska] = useState("");
  const [imeKorisnika, setImeKorisnika] = useState("");

  useEffect(() => {
    fetchKomentari();
    fetchKorisnik();
  }, [hive.id]);

async function fetchKorisnik() {
  const res = await fetch("/api/auth/me");
  const data = await res.json();
  if (data.data) setImeKorisnika(data.data.ime);
};

  async function fetchKomentari() {
    try {
      setLoadingKomentari(true);
      const response = await fetch(`/api/hives/${hive.id}/comments`);
      const data = await response.json();
      if (response.ok) setKomentari(data.data);
    } catch (err) {
      console.error("Greška pri ucitavanju komentara:", err);
    } finally {
      setLoadingKomentari(false);
    }
  }

  async function handleDodajKomentar() {
    if (!noviKomentar.trim()) return;
    try {
      setDodajeKomentar(true);
      setKomentarGreska("");
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sadrzaj: noviKomentar.trim(), kosnicaId: hive.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Greška prilikom dodavanja komentara.");
      setNoviKomentar("");
      await fetchKomentari();
    } catch (err: any) {
      setKomentarGreska(err.message);
    } finally {
      setDodajeKomentar(false);
    }
  }

  const getJacinaColor = (jacina: string) => {
    switch (jacina.toUpperCase()) {
      case "JAKA": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-300 dark:border-green-700";
      case "SREDNJA": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700";
      case "SLABA": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-300 dark:border-red-700";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/hives/${hive.id}`, { method: "DELETE", credentials: "include" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Greška prilikom brisanja košnice");
      onHiveDeleted(hive.id);
      onClose();
      router.refresh();
    } catch (error: any) {
      alert(error.message || "Greška prilikom brisanja košnice");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl relative">

          {/* Header */}
          <div className="flex items-center justify-between px-8 pt-7 pb-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center shadow">
                <span className="text-white text-lg font-bold">K</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{hive.naziv}</h2>
                <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold border ${getJacinaColor(hive.jacina)}`}>
                  {hive.jacina}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl font-bold w-9 h-9 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all"
            >
              ×
            </button>
          </div>

          {/* Body — dve kolone */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">

            {/* Leva kolona — detalji i akcije */}
            <div className="px-8 py-6 flex flex-col gap-4">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Detalji kosnice</h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-100 dark:border-amber-800">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Broj pcela</p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{hive.brPcela.toLocaleString()}</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-100 dark:border-yellow-800">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Broj ramova</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{hive.brRamova}</p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Datum kreiranja</p>
                <p className="text-base font-semibold text-blue-600 dark:text-blue-400">
                  {new Date(hive.createdAt).toLocaleDateString("sr-RS", {
                    weekday: "long", day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
              </div>

              {/* Akcije */}
              <div className="flex gap-3 mt-auto pt-2">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  {isDeleting ? "Brisanje..." : "Obrisi kosnicu"}
                </button>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  Izmeni kosnicu
                </button>
              </div>
            </div>

            {/* Desna kolona — komentari */}
            <div className="px-8 py-6 flex flex-col gap-4">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Komentari {komentari.length > 0 && <span className="text-amber-500 normal-case font-normal">({komentari.length})</span>}
              </h3>

              {/* Unos komentara */}
              <div>
                <textarea
                  value={noviKomentar}
                  onChange={(e) => setNoviKomentar(e.target.value)}
                  placeholder="Unesite komentar..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none text-sm"
                />
                {komentarGreska && <p className="text-red-500 text-xs mt-1">{komentarGreska}</p>}
                <button
                  onClick={handleDodajKomentar}
                  disabled={dodajeKomentar || !noviKomentar.trim()}
                  className="mt-2 w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 dark:disabled:bg-amber-800 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:cursor-not-allowed text-sm"
                >
                  {dodajeKomentar ? "Dodavanje..." : "Dodaj komentar"}
                </button>
                <div className="mt-3">
                <PreuzmiKomentarePDF 
                 komentari={komentari}
                 nazivKosnice={hive.naziv}
                 imeKorisnika={imeKorisnika}
                 />
                 </div>
              </div>

              {/* Lista komentara — skroluje se samo ova oblast */}
              <div className="flex flex-col gap-2 overflow-y-auto max-h-48 pr-1">
                {loadingKomentari ? (
                  <p className="text-gray-400 text-sm text-center py-4">Ucitavanje...</p>
                ) : komentari.length === 0 ? (
                  <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-4">Nema komentara za ovu kosnicu.</p>
                ) : (
                  komentari.map((komentar) => (
                    <div
                      key={komentar.id}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800 dark:text-gray-100 text-xs">{komentar.korisnik.ime}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${getJacinaColor(komentar.jacinaKosnice)}`}>
                            {komentar.jacinaKosnice}
                            </span>
                            </div>
                            <span className="text-xs text-gray-400">
                          {new Date(komentar.createdAt).toLocaleDateString("sr-RS", { day: "numeric", month: "short", year: "numeric" })}
                          {" "}
                          {new Date(komentar.createdAt).toLocaleTimeString("sr-RS", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{komentar.sadrzaj}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <DeleteConfirmModal
          itemName={hive.naziv}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {showEditModal && (
        <EditHiveModal
          hive={hive}
          onConfirm={(updatedHive) => {
            setShowEditModal(false);
            onHiveUpdated(updatedHive);
            onClose();
          }}
          onCancel={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}