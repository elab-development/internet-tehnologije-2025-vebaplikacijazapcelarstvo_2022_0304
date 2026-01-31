"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();

  // Podaci korisnika (kasnije iz baze/session)
  const user = {
    name: "Pera Perić",
    email: "pera",
    role: "Administrator",
    joinedDate: "15. Januar 2025"
  };

  function handleLogout() {
    // Ovde bi išla logika za brisanje session-a
    // Redirect na login
    router.push("/");
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Profil
      </h1>

      {/* Grid layout - dve kolone */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEVA STRANA - Statistika (2/3 širine) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Košnice - Link */}
          <Link href="/hives">
            <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-40">
              {/* Slika sa leve strane */}
              <img 
                src="/images/beehive.png" 
                alt="Košnice" 
                className="w-30 h-30 object-contain"
              />
              {/* Tekst i broj */}
              <div className="flex flex-col justify-center items-center sm:items-start">
                <p className="text-4xl font-bold text-amber-600 dark:text-amber-400 mb-1">5</p>
                <p className="text-xl font-semibold text-amber-800 dark:text-amber-300">Košnice</p>
              </div>
            </div>
          </Link>
          
          {/* Aktivnosti - Link */}
          <Link href="/activities">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-40">
              {/* Slika sa leve strane */}
              <img 
                src="/images/aktivnosti.png" 
                alt="Aktivnosti" 
                className="w-30 h-30 object-contain mr-6"
              />
              {/* Tekst i broj */}
              <div className="flex flex-col">
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">12</p>
                <p className="text-xl font-semibold text-blue-800 dark:text-blue-300">Aktivnosti</p>
              </div>
            </div>
          </Link>

          {/* Notifikacije */}
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300">
                Notifikacije
              </h3>
              <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                3
              </span>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-2 rounded">
                📋 Nova aktivnost zakazana za sutra
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-2 rounded">
                🐝 Košnica #3 zahteva pregled
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-2 rounded">
                🍯 Vreme za berbu meda - Košnica #1
              </div>
            </div>
          </div>
        </div>

        {/* DESNA STRANA - Profil info i akcije (1/3 širine) */}
        <div className="space-y-4">
          
          {/* Kartica sa korisničkim podacima */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-700 mb-4">
                <img 
                  src="/images/korisnikM.png" 
                  alt="Korisnički avatar" 
                  className="w-full h-full object-cover"
                />            
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {user.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{user.role}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {user.email}
              </p>
            </div>
          </div>

          {/* Akcije - diskretnije */}
          <div className="space-y-2">
            {/* Promeni lozinku */}
            <button className="w-full bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium py-2 rounded-lg transition-colors">
              Promeni lozinku
            </button>

            {/* Podešavanja */}
            <button className="w-full bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium py-2 rounded-lg transition-colors">
              Podešavanja naloga
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium py-2 rounded-lg transition-colors border border-red-200 dark:border-red-800"
            >
              Odjavi se
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}