"use client";

interface HiveModalProps {
  hive: {
    id: number;
    name: string;
    strength: string;
    bees: number;
    honey: string;
  };
  onClose: () => void;
}

export default function HiveModal({ hive, onClose }: HiveModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-11/12 max-w-2xl p-6 relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">{hive.name}</h2>

        <p className="text-gray-600 dark:text-gray-300 mb-2">
          <span className="font-medium">Jačina:</span> {hive.strength}
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          <span className="font-medium">Broj pčela:</span> {hive.bees}
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          <span className="font-medium">Med:</span> {hive.honey}
        </p>

        <button
          onClick={onClose}
          className="mt-4 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Zatvori
        </button>
      </div>
    </div>
  );
}
