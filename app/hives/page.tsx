"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type Hive = {
  id: number;
  naziv: string;
  brPcela: number;
  jacina: string;
  brRamova: number;
  createdAt: string;
};

export default function HivesPage() {
  const router = useRouter();
  const [hives, setHives] = useState<Hive[]>([]);
  const [filteredHives, setFilteredHives] = useState<Hive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterJacina, setFilterJacina] = useState("sve");

  useEffect(() => {
    fetchHives();
  }, []);

  async function fetchHives() {
    try {
      setLoading(true);
      
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Niste prijavljeni. Molimo prijavite se.");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/hives", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Greška prilikom učitavanja košnica");
      }

      setHives(data.data);
      setFilteredHives(data.data);
      setError("");
    } catch (err: any) {
      console.error("Greška:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Filtriraj i pretraži košnice
  useEffect(() => {
    let result = hives;

    // Filter po jačini
    if (filterJacina !== "sve") {
      result = result.filter(
        (hive) => hive.jacina.toLowerCase() === filterJacina.toLowerCase()
      );
    }

    // Pretraga po nazivu
    if (searchQuery) {
      result = result.filter((hive) =>
        hive.naziv.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredHives(result);
  }, [searchQuery, filterJacina, hives]);

  // Funkcija za formatiranje jačine
  function getJacinaColor(jacina: string) {
    switch (jacina.toUpperCase()) {
      case 'JAKA':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-300 dark:border-green-700';
      case 'SREDNJA':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700';
      case 'SLABA':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-300 dark:border-red-700';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-300 dark:border-gray-700';
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-xl text-gray-600 dark:text-gray-400">
            Učitavanje košnica...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
                      text-red-600 dark:text-red-400 px-6 py-4 rounded-xl max-w-md">
          <div className="text-4xl mb-2">⚠️</div>
          <p className="font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header sa dugmetom za dodavanje */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
        <div className="flex items-center gap-3">
          <Image src="/images/beehive.png" alt="Košnice" width={50} height={50} className="block"/>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Košnice
          </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Upravljajte vašim pčelinjim kolonijama
          </p>
        </div>
        
        {/* Dugme za dodavanje nove košnice */}
        <Link href="/hives/add">
          <button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2">
            <span className="text-2xl">+</span>
            <span>Nova košnica</span>
          </button>
        </Link>
      </div>

      {/* Search & Filter sekcija */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pretraga */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              🔍 Pretraži košnice
            </label>
            <input
              type="text"
              placeholder="Unesite naziv košnice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-amber-500 focus:border-transparent
                       transition-all placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Filter po jačini */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              📊 Filtriraj po jačini
            </label>
            <select
              value={filterJacina}
              onChange={(e) => setFilterJacina(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-amber-500 focus:border-transparent
                       transition-all cursor-pointer"
            >
              <option value="sve">Sve jačine</option>
              <option value="jaka">🟢 Jaka</option>
              <option value="srednja">🟡 Srednja</option>
              <option value="slaba">🔴 Slaba</option>
            </select>
          </div>
        </div>

        {/* Broj rezultata */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Prikazano: <span className="font-bold text-amber-600 dark:text-amber-400">{filteredHives.length}</span> od <span className="font-bold">{hives.length}</span> košnica
          </div>
          {(searchQuery || filterJacina !== "sve") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterJacina("sve");
              }}
              className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
            >
              Poništi filtere
            </button>
          )}
        </div>
      </div>

      {/* Prikaz košnica */}
      {filteredHives.length === 0 && hives.length === 0 ? (
        /* Nema košnica uopšte */
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 
                        rounded-2xl p-12 max-w-2xl mx-auto border-2 border-dashed border-amber-300 dark:border-amber-700">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
              Nemate nijednu košnicu
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              Započnite sa praćenjem vaših pčelinjih kolonija
            </p>
            <Link href="/hives/add">
              <button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold px-10 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl text-lg transform hover:-translate-y-0.5">
                + Dodaj prvu košnicu
              </button>
            </Link>
          </div>
        </div>
      ) : filteredHives.length === 0 ? (
        /* Nema rezultata pretrage */
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Nema rezultata
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            Nema košnica koje odgovaraju kriterijumima pretrage.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setFilterJacina("sve");
            }}
            className="text-amber-600 dark:text-amber-400 hover:underline font-medium"
          >
            Poništi filtere
          </button>
        </div>
      ) : (
        /* Grid košnica */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHives.map((hive) => (
            <div
              key={hive.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>🏠</span>
                    {hive.naziv}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getJacinaColor(hive.jacina)}`}>
                    {hive.jacina}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="space-y-4">
                  {/* Broj pčela */}
                  <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2 font-medium">
                      <span className="text-2xl">🐝</span>
                      Broj pčela
                    </span>
                    <span className="font-bold text-lg text-amber-600 dark:text-amber-400">
                      {hive.brPcela.toLocaleString()}
                    </span>
                  </div>

                  {/* Broj ramova */}
                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2 font-medium">
                      <span className="text-2xl">📦</span>
                      Broj ramova
                    </span>
                    <span className="font-bold text-lg text-yellow-600 dark:text-yellow-400">
                      {hive.brRamova}
                    </span>
                  </div>

                  {/* Datum kreiranja */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2 text-sm">
                      <span className="text-lg">📅</span>
                      Kreirana
                    </span>
                    <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                      {new Date(hive.createdAt).toLocaleDateString('sr-RS', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Akcije */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                  <Link href={`/hives/${hive.id}`} className="flex-1">
                    <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors shadow-md hover:shadow-lg">
                      👁️ Pregled
                    </button>
                  </Link>
                  <Link href={`/hives/${hive.id}/edit`} className="flex-1">
                    <button className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-semibold py-3 rounded-xl transition-colors shadow-md hover:shadow-lg">
                      ✏️ Izmeni
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}