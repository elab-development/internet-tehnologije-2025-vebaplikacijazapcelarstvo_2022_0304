"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ActivityCalendar from "@/components/KalendarAktivnosti";
import AddActivityModal from "@/components/AddActivityModal";

// Tipovi
type Activity = {
  id: number;
  naslov: string;
  tip: string;
  opis: string;
  datumPocetka: string;
  izvrsena: boolean;
  kosnica?: {
    naziv: string;
  };
};

export default function ActivitiesPage() {
  // State
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("sve");
  const [showAddModal, setShowAddModal] = useState(false);

  // Učitavanje aktivnosti sa API-ja
  useEffect(() => {
    fetchActivities();
  }, []);

  // Filtriranje aktivnosti po tipu
  useEffect(() => {
    if (filterType === "sve") {
      setFilteredActivities(activities);
    } else {
      const filtered = activities.filter(
        (activity) => activity.tip.toLowerCase() === filterType.toLowerCase()
      );
      setFilteredActivities(filtered);
    }
  }, [filterType, activities]);

  // Funkcija za učitavanje aktivnosti
  async function fetchActivities() {
    try {
      setLoading(true);
      const response = await fetch("/api/activities", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Greška prilikom učitavanja aktivnosti");
      }

      const data = await response.json();
      setActivities(data.data || []);
      setFilteredActivities(data.data || []);
      setError("");
    } catch (err: any) {
      console.error("Greška:", err);
      setError(err.message);
      setActivities([]);
      setFilteredActivities([]);
    } finally {
      setLoading(false);
    }
  }

  // Funkcija za osvežavanje aktivnosti nakon dodavanja nove
  async function refreshActivities() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("/api/activities", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setActivities(data.data || []);
        setFilteredActivities(data.data || []);
      }
    } catch (error) {
      console.error("Greška pri osvežavanju:", error);
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600 dark:text-gray-400">
          Učitavanje aktivnosti...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-1">
            Aktivnosti
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Planirajte i pratite sve aktivnosti vezane za vaše košnice
          </p>
        </div>
        {/* Dugme na desktopu u headeru, na mobilnom fiksno dole */}
        <button
          onClick={() => setShowAddModal(true)}
          className="hidden md:flex bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg 
                     transition-all shadow-lg hover:shadow-xl items-center gap-2"
        >
          <span className="text-xl">+</span>
          <span>Nova aktivnost</span>
        </button>
      </div>

      {/* Error poruka */}
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          <p className="font-medium">Greška:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Filter dugmad — horizontalni scroll na mobilnom */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { key: "sve", label: `Sve (${activities.length})` },
          { key: "pregled", label: "Pregledi" },
          { key: "berba", label: "Berba" },
          { key: "hranjenje", label: "Hranjenje" },
          { key: "tretman", label: "Tretmani" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilterType(f.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap flex-shrink-0 ${
              filterType === f.key
                ? "bg-amber-500 text-white shadow-md"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Kalendar */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Image src="/images/aktivnosti.png" alt="Aktivnosti" width={28} height={28} />
          Kalendar aktivnosti
        </h2>
        <div className="overflow-x-auto">
          <ActivityCalendar
            activities={filteredActivities}
            onEventClick={(id) => {
              console.log("Kliknuta aktivnost ID:", id);
            }}
          />
        </div>
      </div>

      {/* Lista aktivnosti */}
      <div className="mb-20 md:mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Lista aktivnosti
        </h2>

        {filteredActivities.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Nema aktivnosti za prikaz.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-5 hover:shadow-lg transition-shadow"
              >
                {/* Status badge */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      activity.izvrsena
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                    }`}
                  >
                    {activity.izvrsena ? "✅ Izvršeno" : "⏳ Na čekanju"}
                  </span>
                </div>

                {/* Naslov */}
                <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
                  {activity.naslov}
                </h3>

                {/* Opis */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {activity.opis}
                </p>

                {/* Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="mr-2">🐝</span>
                    <span className="font-medium">
                      {activity.kosnica?.naziv || "Nepoznata košnica"}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="mr-2">📌</span>
                    <span className="capitalize">{activity.tip}</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="mr-2">📅</span>
                    <span>
                      {new Date(activity.datumPocetka).toLocaleDateString(
                        "sr-RS",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fiksno dugme na mobilnom */}
      <div className="fixed bottom-6 right-6 md:hidden z-40">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold w-14 h-14 rounded-full 
                     shadow-xl flex items-center justify-center text-3xl transition-all active:scale-95"
        >
          +
        </button>
      </div>

      {/* Modal za dodavanje aktivnosti */}
      <AddActivityModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={refreshActivities}
      />
    </div>
  );
}