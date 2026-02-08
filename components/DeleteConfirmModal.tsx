"use client";

interface DeleteConfirmModalProps {
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({ itemName, onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-11/12 max-w-md p-8 relative animate-fadeIn border-2 border-red-200 dark:border-red-900">
        
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <span className="text-5xl">⚠️</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-3">
          Obriši košnicu?
        </h2>

        {/* Message */}
        <p className="text-center text-gray-600 dark:text-gray-400 mb-2">
          Da li ste sigurni da želite da obrišete košnicu:
        </p>
        <p className="text-center text-xl font-bold text-red-600 dark:text-red-400 mb-6">
          "{itemName}"
        </p>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
          <p className="text-sm text-red-800 dark:text-red-300 text-center">
            <strong>⚠️ Upozorenje:</strong> Ova akcija je nepovratna. Svi podaci vezani za ovu košnicu će biti trajno obrisani.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Otkaži
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-md hover:shadow-lg"
          >
            🗑️ Obriši
          </button>
        </div>
      </div>
    </div>
  );
}