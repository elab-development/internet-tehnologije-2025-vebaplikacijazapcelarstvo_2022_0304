"use client";

import Image from "next/image";
import EditHiveModal from "./EditHiveModal";
import { useState } from "react";

type Hive = {
  id: number;
  naziv: string;
  brPcela: number;
  jacina: string;
  brRamova: number;
  createdAt: string;
};

type HiveCardProps = {
  hive: Hive;
  onDetailsClick: () => void;
  onHiveDeleted: (id: number) => void;
  onHiveUpdated: (updatedHive: Hive) => void; 
};

export default function HiveCard({ hive, onDetailsClick, onHiveUpdated }: HiveCardProps) {

  const [showEditModal, setShowEditModal] = useState(false);
  // Boje na osnovu jačine
  const getJacinaColor = (jacina: string) => {
    switch (jacina.toUpperCase()) {
      case "JAKA":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-300 dark:border-green-700";
      case "SREDNJA":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700";
      case "SLABA":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-300 dark:border-red-700";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-300 dark:border-gray-700";
    }
  };

  const getJacinaEmoji = (jacina: string) => {
    switch (jacina.toUpperCase()) {
      case "JAKA":
        return "💪";
      case "SREDNJA":
        return "👍";
      case "SLABA":
        return "⚠️";
      default:
        return "❓";
    }
  };

  return (
    <>
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1">
      {/* Slika košnice */}
      <div className="relative h-48 bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 flex items-center justify-center overflow-hidden">
        <Image 
          src="/images/beehive.png" 
          alt={hive.naziv}
          width={120}
          height={120}
          className="object-contain drop-shadow-lg hover:scale-110 transition-transform"
        />
        
        {/* Badge za jačinu - gore desno */}
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-lg ${getJacinaColor(hive.jacina)}`}>
            <span className="text-lg">{getJacinaEmoji(hive.jacina)}</span>
            {hive.jacina}
          </span>
        </div>
      </div>

      {/* Naziv košnice */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">
          {hive.naziv}
        </h3>

        {/* Akcije */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
          <button
            onClick={onDetailsClick}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors shadow-md hover:shadow-lg"
          >
            Izmeni
          </button>
          <button
            onClick={() => setShowEditModal(true)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors shadow-md hover:shadow-lg"
            >
              Detalji
            </button>
        </div>
      </div>
    </div>

    {showEditModal && (
      <EditHiveModal
        hive={hive}
        onConfirm={(updatedHive) => {
          setShowEditModal(false);
          onHiveUpdated(updatedHive);
        }}
        onCancel={() => setShowEditModal(false)}
      />
    )}
    </>
  );
}