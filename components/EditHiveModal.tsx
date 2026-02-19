"use client";
import { useState } from "react";

interface EditHiveModalProps {
  hive: {
    id: number;
    naziv: string;
    brPcela: number;
    jacina: string;
    brRamova: number;
  };
  onConfirm: (updatedHive: any) => void;
  onCancel: () => void;
}

export default function EditHiveModal({ hive, onConfirm, onCancel }: EditHiveModalProps) {
  const [naziv, setNaziv] = useState(hive.naziv);
  const [brPcela, setBrPcela] = useState(hive.brPcela);
  const [jacina, setJacina] = useState(hive.jacina.toUpperCase());
  const [brRamova, setBrRamova] = useState(hive.brRamova);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit() {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/hives/${hive.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ naziv, brPcela, jacina, brRamova }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Greška prilikom izmene");

      onConfirm(data.data);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-11/12 max-w-md p-8 relative animate-fadeIn border-2 border-amber-200 dark:border-amber-900">
        
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
            <span className="text-5xl">✏️</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          Izmeni košnicu
        </h2>

        <div className="space-y-4 mb-6">
          {/* Naziv */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Naziv</label>
            <input
              type="text"
              value={naziv}
              onChange={(e) => setNaziv(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Broj pčela - stepper sa korakom 500 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Broj pčela</label>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setBrPcela(prev => Math.max(0, prev - 500))}
                className="w-14 h-14 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-800 dark:text-white text-2xl font-bold transition-colors flex items-center justify-center"
              >
                −
              </button>
              <span className="flex-1 text-center text-lg font-semibold text-gray-800 dark:text-white py-3">
                {brPcela.toLocaleString()}
              </span>
              <button
                type="button"
                onClick={() => setBrPcela(prev => prev + 500)}
                className="w-14 h-14 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-800 dark:text-white text-2xl font-bold transition-colors flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Jačina - dugmad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jačina</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setJacina("SLABA")}
                className={`py-3 rounded-xl font-semibold text-sm border-2 transition-all ${
                  jacina === "SLABA"
                    ? "bg-red-500 border-red-500 text-white shadow-md"
                    : "bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 hover:bg-red-100"
                }`}
              >
                Slaba
              </button>
              <button
                type="button"
                onClick={() => setJacina("SREDNJA")}
                className={`py-3 rounded-xl font-semibold text-sm border-2 transition-all ${
                  jacina === "SREDNJA"
                    ? "bg-yellow-500 border-yellow-500 text-white shadow-md"
                    : "bg-yellow-50 border-yellow-200 text-yellow-600 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400 hover:bg-yellow-100"
                }`}
              >
                Srednja
              </button>
              <button
                type="button"
                onClick={() => setJacina("JAKA")}
                className={`py-3 rounded-xl font-semibold text-sm border-2 transition-all ${
                  jacina === "JAKA"
                    ? "bg-green-500 border-green-500 text-white shadow-md"
                    : "bg-green-50 border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 hover:bg-green-100"
                }`}
              >
                Jaka
              </button>
            </div>
          </div>

          {/* Broj ramova - stepper sa korakom 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Broj ramova</label>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setBrRamova(prev => Math.max(0, prev - 1))}
                className="w-14 h-14 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-800 dark:text-white text-2xl font-bold transition-colors flex items-center justify-center"
              >
                −
              </button>
              <span className="flex-1 text-center text-lg font-semibold text-gray-800 dark:text-white py-3">
                {brRamova}
              </span>
              <button
                type="button"
                onClick={() => setBrRamova(prev => prev + 1)}
                className="w-14 h-14 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-800 dark:text-white text-2xl font-bold transition-colors flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-semibold px-6 py-3 rounded-xl transition-colors">
            Otkaži
          </button>
          <button onClick={handleSubmit} disabled={isSaving} className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-md">
            {isSaving ? "Čuvanje..." : "💾 Sačuvaj"}
          </button>
        </div>
      </div>
    </div>
  );
}