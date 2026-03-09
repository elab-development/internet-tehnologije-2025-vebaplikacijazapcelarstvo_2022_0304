"use client";
import { useState, useEffect } from "react";

type Hive = {
  id: number;
  naziv: string;
};

type AddActivityModalProps = {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddActivityModal({ show, onClose, onSuccess }: AddActivityModalProps) {
  const [hives, setHives] = useState<Hive[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    naslov: "",
    tip: "pregled",
    opis: "",
    datumPocetka: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    kosnicaId: ""
  });

  // Učitaj košnice za dropdown
  useEffect(() => {
    if (show) {
      fetchHives();
    }
  }, [show]);

  async function fetchHives() {
    try {
      const response = await fetch("/api/activities", {
      credentials: "include", // ovo šalje cookie automatski
      });

      if (response.ok) {
        const data = await response.json();
        setHives(data.data || []);
        
        // Automatski selektuj prvu košnicu
        if (data.data && data.data.length > 0) {
          setFormData(prev => ({ ...prev, kosnicaId: data.data[0].id.toString() }));
        }
      }
    } catch (error) {
      console.error("Greška pri učitavanju košnica:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          kosnicaId: parseInt(formData.kosnicaId)
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Greška prilikom kreiranja");
      }

      // Uspeh!
      alert("✅ Aktivnost uspešno kreirana!");
      onSuccess(); // Osveži listu
      onClose(); // Zatvori modal
      
      // Resetuj formu
      setFormData({
        naslov: "",
        tip: "pregled",
        opis: "",
        datumPocetka: new Date().toISOString().split('T')[0],
        kosnicaId: hives[0]?.id.toString() || ""
      });
      
    } catch (error: any) {
      alert("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">Nova aktivnost</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Naslov */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Naslov aktivnosti *
            </label>
            <input
              type="text"
              required
              value={formData.naslov}
              onChange={(e) => setFormData({ ...formData, naslov: e.target.value })}
              placeholder="npr. Pregled košnice"
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
            />
          </div>

          {/* Tip */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Tip aktivnosti *
            </label>
            <select
              required
              value={formData.tip}
              onChange={(e) => setFormData({ ...formData, tip: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
            >
              <option value="pregled">🔍 Pregled</option>
              <option value="hranjenje">🍯 Hranjenje</option>
              <option value="berba">🐝 Berba meda</option>
              <option value="tretman">💊 Tretman</option>
              <option value="održavanje">🔧 Održavanje</option>
            </select>
          </div>

          {/* Košnica */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Košnica *
            </label>
            {hives.length === 0 ? (
              <p className="text-sm text-red-600 dark:text-red-400">
                ⚠️ Nema dostupnih košnica. Prvo dodaj košnicu!
              </p>
            ) : (
              <select
                required
                value={formData.kosnicaId}
                onChange={(e) => setFormData({ ...formData, kosnicaId: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              >
                {hives.map(hive => (
                  <option key={hive.id} value={hive.id}>
                    {hive.naziv}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Datum */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Datum *
            </label>
            <input
              type="date"
              required
              value={formData.datumPocetka}
              onChange={(e) => setFormData({ ...formData, datumPocetka: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
            />
          </div>

          {/* Opis */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Opis
            </label>
            <textarea
              value={formData.opis}
              onChange={(e) => setFormData({ ...formData, opis: e.target.value })}
              placeholder="Detaljan opis aktivnosti..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600
                       text-gray-800 dark:text-gray-100 font-bold py-3 rounded-lg transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Otkaži
            </button>
            <button
              type="submit"
              disabled={loading || hives.length === 0}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600
                       text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Čuvanje..." : "Sačuvaj ✓"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}