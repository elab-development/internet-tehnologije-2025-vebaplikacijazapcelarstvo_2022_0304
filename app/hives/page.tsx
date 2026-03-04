"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import HiveCard from "@/components/HiveCard";
import HiveModal from "@/components/DetailsHive";
import SearchFilter from "@/components/SearchFilter";
import dynamic from "next/dynamic";
const AllHivesMap = dynamic(() => import("@/components/AllHivesMap"), {
  ssr: false,
});

type Hive = {
  id: number;
  naziv: string;
  brPcela: number;
  jacina: string;
  brRamova: number;
  createdAt: string;
  latitude?: number | null;
  longitude?: number | null;
};

export default function HivesPage() {
  const [hives, setHives] = useState<Hive[]>([]);
  const [filteredHives, setFilteredHives] = useState<Hive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterJacina, setFilterJacina] = useState("sve");

  const [selectedHive, setSelectedHive] = useState<Hive | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchHives();
  }, []);

  async function fetchHives() {
    try {
      setLoading(true);

      const response = await fetch("/api/hives", {});

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
        (hive) => hive.jacina.toLowerCase() === filterJacina.toLowerCase(),
      );
    }

    // Pretraga po nazivu
    if (searchQuery) {
      result = result.filter((hive) =>
        hive.naziv.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredHives(result);
  }, [searchQuery, filterJacina, hives]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter: string) => {
    setFilterJacina(filter);
  };

  const handleDetailsClick = (hive: Hive) => {
    setSelectedHive(hive);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHive(null);
  };

  const handleHiveDeleted = (deletedHiveId: number) => {
    setHives(hives.filter((h) => h.id !== deletedHiveId));
    setFilteredHives(filteredHives.filter((h) => h.id !== deletedHiveId));
  };
  const handleHiveUpdated = (updatedHive: Hive) => {
    setHives(hives.map((h) => (h.id === updatedHive.id ? updatedHive : h)));
    setFilteredHives(
      filteredHives.map((h) => (h.id === updatedHive.id ? updatedHive : h)),
    );
  };

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
        <div
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
                      text-red-600 dark:text-red-400 px-6 py-4 rounded-xl max-w-md"
        >
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
            <Image
              src="/images/beehive.png"
              alt="Košnice"
              width={50}
              height={50}
              className="block"
            />
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
      <SearchFilter
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        placeholder="Pretražite košnice po nazivu..."
      />

      {/*Broj rezultata*/}
      <div className="mb-6 flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Prikazano:{" "}
          <span className="font-bold text-amber-600 dark:text-amber-400">
            {filteredHives.length}
          </span>{" "}
          od <span className="font-bold">{hives.length}</span> košnica
        </div>
        {(searchQuery || filterJacina !== "sve") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setFilterJacina("sve");
            }}
            className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium transition-colors px-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30"
          >
            Poništi filtere ✕
          </button>
        )}
      </div>

      {/* Prikaz košnica */}
      {filteredHives.length === 0 && hives.length === 0 ? (
        /* Nema košnica uopšte */
        <div className="text-center py-16">
          <div
            className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 
                        rounded-2xl p-12 max-w-2xl mx-auto border-2 border-dashed border-amber-300 dark:border-amber-700"
          >
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
            <HiveCard
              key={hive.id}
              hive={hive}
              onDetailsClick={() => handleDetailsClick(hive)}
              onHiveDeleted={handleHiveDeleted}
              onHiveUpdated={handleHiveUpdated}
            />
          ))}
        </div>
      )}

      {/* Modal za detalje košnice */}
      {isModalOpen && selectedHive && (
        <HiveModal
          hive={selectedHive}
          onClose={handleCloseModal}
          onHiveDeleted={handleHiveDeleted}
          onHiveUpdated={handleHiveUpdated}
        />
      )}

      {/* Mapa svih košnica */}
      {hives.some((h) => h.latitude && h.longitude) && (
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              🗺️ Mapa košnica
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({hives.filter((h) => h.latitude && h.longitude).length} košnica
              na mapi)
            </span>
          </div>
          <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
            <AllHivesMap
              hives={hives}
              onHiveClick={(hive) => {
                setSelectedHive(hive);
                setIsModalOpen(true);
              }}
            />
          </div>
          {hives.some((h) => !h.latitude || !h.longitude) && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
              💡 Košnice bez postavljene lokacije se ne prikazuju na mapi.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
