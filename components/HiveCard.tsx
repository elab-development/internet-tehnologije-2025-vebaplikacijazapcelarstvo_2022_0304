"use client";

type HiveCardProps = {
  hive: {
    id: number;
    naziv: string;
    brPcela: number;
    jacina: string;
    brRamova: number;
    createdAt?: string;
  };
};

export default function HiveCard({ hive }: HiveCardProps) {
  // Boje na osnovu jačine
  const getJacinaColor = (jacina: string) => {
    switch (jacina.toUpperCase()) {
      case "JAKA":
        return "bg-green-100 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400";
      case "SREDNJA":
        return "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-500 text-yellow-700 dark:text-yellow-400";
      case "SLABA":
        return "bg-red-100 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/20 border-gray-500 text-gray-700 dark:text-gray-400";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-[1.02]">
      {/* Header sa ikonom */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {hive.naziv}
        </h3>
        <div className="text-3xl">🐝</div>
      </div>

      {/* Jačina badge */}
      <div className="mb-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border-2 ${getJacinaColor(
            hive.jacina
          )}`}
        >
          {hive.jacina}
        </span>
      </div>

      {/* Detalji */}
      <div className="space-y-2 text-gray-700 dark:text-gray-300">
        <div className="flex items-center justify-between">
          <span className="text-sm">Broj pčela:</span>
          <span className="font-semibold">{hive.brPcela.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Broj ramova:</span>
          <span className="font-semibold">{hive.brRamova}</span>
        </div>
      </div>

      {/* Akcije */}
      <div className="mt-6 flex gap-2">
        <button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg transition-colors font-medium">
          Detalji
        </button>
        <button className="px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
          ✏️
        </button>
        <button className="px-4 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors">
          🗑️
        </button>
      </div>
    </div>
  );
}