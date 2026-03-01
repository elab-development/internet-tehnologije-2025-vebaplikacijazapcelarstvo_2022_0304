"use client";

import { useState, useEffect } from "react";
import { ActivitiesBarChart, ActivitiesLineChart } from "@/components/ActivitiesChart";

type Activity = {
  id: number;
  naslov: string;
  tip: string;
  datumPocetka: string;
  izvrsena: boolean;
};

type ActivityStats = {
  tip: string;
  broj: number;
  boja: string;
};

type MonthlyStats = {
  mesec: string;
  broj: number;
};

export default function StatisticsPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsByType, setStatsByType] = useState<ActivityStats[]>([]);
  const [statsByMonth, setStatsByMonth] = useState<MonthlyStats[]>([]);

  // Učitaj aktivnosti
  useEffect(() => {
    fetchActivities();
  }, []);

  // Izračunaj statistiku kada se aktivnosti učitaju
  useEffect(() => {
    if (activities.length > 0) {
      calculateStats();
    }
  }, [activities]);

  async function fetchActivities() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch("/api/activities", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setActivities(data.data || []);
      }
    } catch (error) {
      console.error("Greška:", error);
    } finally {
      setLoading(false);
    }
  }

  function calculateStats() {
    // Statistika po tipu
    const typeCount: { [key: string]: number } = {};
    activities.forEach((activity) => {
      const tip = activity.tip.toLowerCase();
      typeCount[tip] = (typeCount[tip] || 0) + 1;
    });

    const typeColors: { [key: string]: string } = {
      pregled: "#3b82f6",    // plava
      berba: "#fbbf24",      // žuta
      hranjenje: "#10b981",  // zelena
      tretman: "#ef4444",    // crvena
      održavanje: "#8b5cf6", // ljubičasta
    };

    const statsData: ActivityStats[] = Object.entries(typeCount).map(([tip, broj]) => ({
      tip: tip.charAt(0).toUpperCase() + tip.slice(1),
      broj,
      boja: typeColors[tip] || "#6b7280",
    }));

    setStatsByType(statsData);

    // Statistika po mesecima
    const monthCount: { [key: string]: number } = {};
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "Maj", "Jun",
      "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"
    ];

    activities.forEach((activity) => {
      const date = new Date(activity.datumPocetka);
      const monthIndex = date.getMonth();
      const monthName = monthNames[monthIndex];
      monthCount[monthName] = (monthCount[monthName] || 0) + 1;
    });

    const monthlyData: MonthlyStats[] = monthNames.map((mesec) => ({
      mesec,
      broj: monthCount[mesec] || 0,
    }));

    setStatsByMonth(monthlyData);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600 dark:text-gray-400">
          Učitavanje statistike...
        </div>
      </div>
    );
  }

  // Izračunaj dodatne statistike
  const totalActivities = activities.length;
  const completedActivities = activities.filter((a) => a.izvrsena).length;
  const pendingActivities = totalActivities - completedActivities;
  const completionRate = totalActivities > 0 
    ? Math.round((completedActivities / totalActivities) * 100) 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Statistika
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Pregled i analiza vaših aktivnosti
        </p>
      </div>

      {/* Statistika kartice */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-4xl font-bold">{totalActivities}</div>
          <div className="text-sm opacity-90">Ukupno aktivnosti</div>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-4xl font-bold">{completedActivities}</div>
          <div className="text-sm opacity-90">Izvršeno</div>
        </div>
        <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-4xl font-bold">{pendingActivities}</div>
          <div className="text-sm opacity-90">Na čekanju</div>
        </div>
        <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-4xl font-bold">{completionRate}%</div>
          <div className="text-sm opacity-90">Stopa završenosti</div>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Nema podataka za prikaz statistike.
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
            Dodajte aktivnosti da biste videli statistiku.
          </p>
        </div>
      ) : (
        <>
          {/* Grafici u 2 kolone */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Bar Chart - Aktivnosti po tipu */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                📊 Aktivnosti po tipu
              </h2>
              <ActivitiesBarChart data={statsByType} />
            </div>

            
          </div>

          {/* Line Chart - Po mesecima (full width) */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              📅 Aktivnosti po mesecima
            </h2>
            <ActivitiesLineChart data={statsByMonth} />
          </div>
        </>
      )}
    </div>
  );
}