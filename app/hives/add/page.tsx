// app/hives/add/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddHivePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    naziv: "",
    brPcela: "",
    jacina: "SREDNJA",
    brRamova: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Niste prijavljeni. Molimo prijavite se.");
      }

      // Validacija
      if (!formData.naziv.trim()) {
        throw new Error("Naziv košnice je obavezan.");
      }

      const brPcela = parseInt(formData.brPcela);
      const brRamova = parseInt(formData.brRamova);

      if (isNaN(brPcela) || brPcela <= 0) {
        throw new Error("Broj pčela mora biti veći od 0.");
      }

      if (isNaN(brRamova) || brRamova <= 0 || brRamova > 30) {
        throw new Error("Broj ramova mora biti između 1 i 30.");
      }

      console.log("Šaljem podatke:", {
        naziv: formData.naziv.trim(),
        brPcela: brPcela,
        jacina: formData.jacina,
        brRamova: brRamova,
      });

      const response = await fetch("/api/hives", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          naziv: formData.naziv.trim(),
          brPcela: brPcela,
          jacina: formData.jacina,
          brRamova: brRamova,
        }),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok) {
        // Ako je token problem, redirect na login
        if (response.status === 401) {
          localStorage.removeItem("token");
          throw new Error("Vaša sesija je istekla. Molimo prijavite se ponovo.");
        }
        throw new Error(data.error || "Greška prilikom kreiranja košnice");
      }

      // Uspešno kreirana košnica
      setSuccess(true);
      
      // Redirect nakon 1.5 sekundi
      setTimeout(() => {
        router.push("/hives");
        router.refresh();
      }, 1500);
      
    } catch (err: any) {
      console.error("Greška:", err);
      setError(err.message);
      
      // Ako je problem sa sesijom, redirect na login nakon 3 sekunde
      if (err.message.includes("sesija") || err.message.includes("prijavite")) {
        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: string, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
  }

  // Success state
  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-8xl mb-4 animate-bounce">✅</div>
          <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            Košnica uspešno dodata!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Preusmeravanje na listu košnica...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <Link href="/hives" className="text-amber-600 dark:text-amber-400 hover:underline mb-4 inline-flex items-center gap-2 font-medium">
          <span>←</span>
          <span>Nazad na košnice</span>
        </Link>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Nova košnica
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Dodajte novu pčelinju koloniju u vašu evidenciju
        </p>
      </div>

      {/* Forma */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header kartice */}
        <div className="bg-gradient-to-r h-30 from-amber-500 via-yellow-500 to-orange-500 p-8">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-2">Kreiranje nove košnice</h2>
            <p className="text-amber-100">Popunite informacije o vašoj pčelinjoj koloniji</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {/* Error poruka */}
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 px-5 py-4 rounded-xl flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold mb-1">Greška!</p>
                <p>{error}</p>
                {error.includes("sesija") && (
                  <p className="text-sm mt-2">Preusmeravanje na login stranicu...</p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Naziv košnice */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <span>Naziv košnice *</span>
              </label>
              <input
                type="text"
                required
                value={formData.naziv}
                onChange={(e) => handleChange("naziv", e.target.value)}
                placeholder="npr. Košnica 1, Matičnjak, Livada..."
                className="w-full h-10 px-5 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-lg
                         focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                         transition-all placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            {/* Broj pčela */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <span>Broj pčela (procena) *</span>
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.brPcela}
                onChange={(e) => handleChange("brPcela", e.target.value)}
                placeholder="50000"
                className="w-full h-10 px-5 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-lg
                         focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                         transition-all placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            {/* Jačina košnice */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <span>Jačina košnice *</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Slaba */}
                <label className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all
                  ${formData.jacina === 'SLABA' 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-700'
                  }`}>
                  <input
                    type="radio"
                    name="jacina"
                    value="SLABA"
                    checked={formData.jacina === 'SLABA'}
                    onChange={(e) => handleChange("jacina", e.target.value)}
                    className="w-5 h-5 text-red-600 focus:ring-red-500"
                  />
                  <div className="ml-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">🔴</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">Slaba</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Potrebna pažnja</p>
                  </div>
                </label>

                {/* Srednja */}
                <label className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all
                  ${formData.jacina === 'SREDNJA' 
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-yellow-300 dark:hover:border-yellow-700'
                  }`}>
                  <input
                    type="radio"
                    name="jacina"
                    value="SREDNJA"
                    checked={formData.jacina === 'SREDNJA'}
                    onChange={(e) => handleChange("jacina", e.target.value)}
                    className="w-5 h-5 text-yellow-600 focus:ring-yellow-500"
                  />
                  <div className="ml-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">🟡</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">Srednja</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Stabilna</p>
                  </div>
                </label>

                {/* Jaka */}
                <label className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all
                  ${formData.jacina === 'JAKA' 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700'
                  }`}>
                  <input
                    type="radio"
                    name="jacina"
                    value="JAKA"
                    checked={formData.jacina === 'JAKA'}
                    onChange={(e) => handleChange("jacina", e.target.value)}
                    className="w-5 h-5 text-green-600 focus:ring-green-500"
                  />
                  <div className="ml-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">🟢</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">Jaka</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Odlično stanje</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Broj ramova */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <span>Broj ramova *</span>
              </label>
              <input
                type="number"
                required
                min="1"
                max="30"
                value={formData.brRamova}
                onChange={(e) => handleChange("brRamova", e.target.value)}
                placeholder="10"
                className="w-full h-10 px-5 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-lg
                         focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                         transition-all placeholder-gray-400 dark:placeholder-gray-500"
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 ml-1">
                Standardna košnica ima 10-12 ramova (maks. 30)
              </p>
            </div>
          </div>

          {/* Dugmad */}
          <div className="mt-10 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 
                       disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-5 rounded-xl 
                       transition-all shadow-lg hover:shadow-2xl disabled:cursor-not-allowed 
                       disabled:transform-none transform hover:-translate-y-1 text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  <span>Kreiranje...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>✓</span>
                  <span>Kreiraj košnicu</span>
                </span>
              )}
            </button>
            <Link href="/hives" className="flex-1">
              <button
                type="button"
                disabled={loading}
                className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 
                         dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 
                         font-bold py-5 rounded-xl transition-all shadow-md hover:shadow-lg
                         disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                Otkaži
              </button>
            </Link>
          </div>
        </form>
      </div>

      {/* Info kartica */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6">
        <div className="flex gap-4">
          <div className="text-4xl">💡</div>
          <div className="flex-1">
            <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-3 text-lg">
              Saveti za unos podataka
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-lg mt-0.5">•</span>
                <span>Naziv košnice može biti lokacija, broj ili bilo koji identifikator</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg mt-0.5">•</span>
                <span>Broj pčela je procena - može se ažurirati kasnije</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg mt-0.5">•</span>
                <span>Jačina košnice označava trenutno stanje kolonije</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg mt-0.5">•</span>
                <span>Broj ramova zavisi od tipa košnice koju koristite</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}