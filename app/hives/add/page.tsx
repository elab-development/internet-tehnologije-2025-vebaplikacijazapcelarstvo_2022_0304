"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function AddHivePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    naziv: "",
    brPcela: 0,
    jacina: "SREDNJA",
    brRamova: 10,
  });

  async function handleSubmit() {
    setLoading(true);
    setError("");

    try {
      if (!formData.naziv.trim()) throw new Error("Naziv košnice je obavezan.");
      if (formData.brPcela <= 0) throw new Error("Broj pčela mora biti veći od 0.");
      if (formData.brRamova <= 0 || formData.brRamova > 30) throw new Error("Broj ramova mora biti između 1 i 30.");

      const response = await fetch("/api/hives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          naziv: formData.naziv.trim(),
          brPcela: formData.brPcela,
          jacina: formData.jacina,
          brRamova: formData.brRamova,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Greška prilikom kreiranja košnice.");

      setSuccess(true);
      setTimeout(() => { router.push("/hives"); router.refresh(); }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center flex flex-col items-center">
          <Image src="/images/ok.png" alt="Uspešno" width={80} height={80} className="mb-4 animate-bounce" />
          <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">Košnica uspešno dodata!</h2>
          <p className="text-gray-600 dark:text-gray-400">Preusmeravanje na listu košnica...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex gap-4 items-start">
      <Link href="/hives" className="mt-2 flex flex-col items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-700 transition-colors font-medium bg-white dark:bg-gray-800 border-2 border-amber-200 dark:border-amber-900 rounded-2xl p-4 shadow-md hover:shadow-lg">
        <Image src="/images/arrow-backward.png" alt="Nazad" width={32} height={32} />
        <span className="text-xs writing-mode-vertical">Nazad</span>
      </Link>

      <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-amber-200 dark:border-amber-900">
        {/* Header */}
        <div className="flex justify-center pt-8 pb-4">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
            <Image src="/images/bee.png" alt="Nazad" width={60} height={60} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          Nova košnica
        </h2>

        <div className="px-8 pb-8 space-y-4">
          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-2">
              <span>⚠️</span>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Naziv */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Naziv</label>
            <input
              type="text"
              value={formData.naziv}
              onChange={(e) => setFormData(prev => ({ ...prev, naziv: e.target.value }))}
              placeholder="npr. Košnica 1, Livada..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Broj pčela - stepper */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Broj pčela</label>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, brPcela: Math.max(0, prev.brPcela - 500) }))}
                className="w-14 h-14 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-800 dark:text-white text-2xl font-bold transition-colors flex items-center justify-center">
                −
              </button>
              <span className="flex-1 text-center text-lg font-semibold text-gray-800 dark:text-white py-3">
                {formData.brPcela.toLocaleString()}
              </span>
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, brPcela: prev.brPcela + 500 }))}
                className="w-14 h-14 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-800 dark:text-white text-2xl font-bold transition-colors flex items-center justify-center">
                +
              </button>
            </div>
          </div>

          {/* Jačina - dugmad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jačina</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "SLABA", label: "Slaba", active: "bg-red-500 border-red-500 text-white shadow-md", inactive: "bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 hover:bg-red-100" },
                { value: "SREDNJA", label: "Srednja", active: "bg-yellow-500 border-yellow-500 text-white shadow-md", inactive: "bg-yellow-50 border-yellow-200 text-yellow-600 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400 hover:bg-yellow-100" },
                { value: "JAKA", label: "Jaka", active: "bg-green-500 border-green-500 text-white shadow-md", inactive: "bg-green-50 border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 hover:bg-green-100" },
              ].map((opt) => (
                <button key={opt.value} type="button" onClick={() => setFormData(prev => ({ ...prev, jacina: opt.value }))}
                  className={`py-3 rounded-xl font-semibold text-sm border-2 transition-all ${formData.jacina === opt.value ? opt.active : opt.inactive}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Broj ramova - stepper */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Broj ramova</label>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, brRamova: Math.max(1, prev.brRamova - 1) }))}
                className="w-14 h-14 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-800 dark:text-white text-2xl font-bold transition-colors flex items-center justify-center">
                −
              </button>
              <span className="flex-1 text-center text-lg font-semibold text-gray-800 dark:text-white py-3">
                {formData.brRamova}
              </span>
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, brRamova: Math.min(30, prev.brRamova + 1) }))}
                className="w-14 h-14 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-800 dark:text-white text-2xl font-bold transition-colors flex items-center justify-center">
                +
              </button>
            </div>
          </div>

          {/* Dugmad */}
          <div className="flex gap-3 pt-2">
            <Link href="/hives" className="flex-1">
              <button type="button" disabled={loading}
                className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-semibold px-6 py-3 rounded-xl transition-colors">
                Otkaži
              </button>
            </Link>
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-md">
              {loading ? "Kreiranje..." : "Kreiraj košnicu"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}