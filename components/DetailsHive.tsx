"use client";

interface HiveModalProps {
  hive: {
    id: number;
    naziv: string;
    jacina: string;
    brPcela: number;
    brRamova: number;
    createdAt: string;
  };
  onClose: () => void;
}

export default function HiveModal({ hive, onClose }: HiveModalProps) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-11/12 max-w-2xl p-8 relative animate-fadeIn">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-3xl font-bold w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all"
          aria-label="Zatvori"
        >
          ×
        </button>

        {/* Header sa ikonom */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
            🐝
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {hive.naziv}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Detalji košnice
            </p>
          </div>
        </div>

        {/* Jačina badge */}
        <div className="mb-6">
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 ${getJacinaColor(hive.jacina)}`}>
            <span className="text-lg">💪</span>
            Jačina: {hive.jacina}
          </span>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Broj pčela */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-5 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🐝</span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Broj pčela
              </span>
            </div>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {hive.brPcela.toLocaleString()}
            </p>
          </div>

          {/* Broj ramova */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-5 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">📦</span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Broj ramova
              </span>
            </div>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {hive.brRamova}
            </p>
          </div>

          {/* Datum kreiranja */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800 md:col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">📅</span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Datum kreiranja
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {new Date(hive.createdAt).toLocaleDateString('sr-RS', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Akcije */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Zatvori
          </button>
          <button
            onClick={() => window.location.href = `/hives/${hive.id}/edit`}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-md hover:shadow-lg"
          >
            Izmeni košnicu
          </button>
        </div>
      </div>
    </div>
  );
}