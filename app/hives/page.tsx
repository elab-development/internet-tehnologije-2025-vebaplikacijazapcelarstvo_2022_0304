"use client";
import { useState, useEffect } from "react";
import SearchFilter from "@/components/SearchFilter";
import HiveCard from "@/components/HiveCard";

type Hive = {
  id: number;
  naziv: string;
  brPcela: number;
  jacina: string;
  brRamova: number;
  createdAt: string;
};

export default function HivesPage() {
  const [hives, setHives] = useState<Hive[]>([]);
  const [filteredHives, setFilteredHives] = useState<Hive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterJacina, setFilterJacina] = useState("sve");

  // Fetch košnice sa API-ja
  useEffect(() => {
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

    fetchHives();
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600 dark:text-gray-400">
          Učitavanje...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
                      text-red-600 dark:text-red-400 px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Košnice
      </h1>

      {/* Search & Filter Component */}
      <SearchFilter
        onSearch={setSearchQuery}
        onFilterChange={setFilterJacina}
        placeholder="Pretraži košnice po nazivu..."
      />

      {/* Prikaz broja rezultata */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Prikazano: {filteredHives.length} od {hives.length} košnica
      </div>

      {/* Grid košnica */}
      {filteredHives.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Nema košnica koje odgovaraju kriterijumima.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHives.map((hive) => (
            <HiveCard key={hive.id} hive={hive} />
          ))}
        </div>
      )}
    </div>
  );
}