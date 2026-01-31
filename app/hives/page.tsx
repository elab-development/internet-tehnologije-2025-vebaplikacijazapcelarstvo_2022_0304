"use client";
import { useState } from "react";
import HiveCard from "@/components/HiveCard";
import HiveModal from "@/components/DetailsHive";

// Primer podataka - kasnije ćete ove podatke dobijati iz baze
const hives = [
  {
    id: 1,
    name: "Košnica #1",
    strength: "8 ramova",
    bees: 50000,
    honey: "15 kg"
  },
  {
    id: 2,
    name: "Košnica #2",
    strength: "6 ramova",
    bees: 40000,
    honey: "10 kg"
  },
  {
    id: 3,
    name: "Košnica #3",
    strength: "10 ramova",
    bees: 60000,
    honey: "20 kg"
  },
  {
    id: 4,
    name: "Košnica #4",
    strength: "7 ramova",
    bees: 45000,
    honey: "12 kg"
  },
];

export default function HivesPage() {
  const [selectedHive, setSelectedHive] = useState<typeof hives[0] | null>(null);

  function openModal(hive: typeof hives[0]) {
    setSelectedHive(hive);
  }

  function closeModal() {
    setSelectedHive(null);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Moje košnice
        </h1>
        <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors">
          + Dodaj košnicu
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {hives.map((hive) => (
          <HiveCard
            key={hive.id}
            id={hive.id}
            name={hive.name}
            strength={hive.strength}
            onClick={() => openModal(hive)}
          />
        ))}
      </div>

      {hives.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">Nemate dodanih košnica</p>
          <p className="text-sm">Kliknite na dugme "Dodaj košnicu" da započnete</p>
        </div>
      )}

      {/* Modal */}
      {selectedHive && (
        <HiveModal hive={selectedHive} onClose={closeModal} />
      )}
    </div>
  );
}