// app/profile/ProfileClient.tsx
"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ProfileClientProps = {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    joinedDate: string;
  };
  stats: {
    hives: number;
    activities: number;
    notifications: number;
  };
  notifications: Array<{
    id: number;
    message: string;
    activityTitle: string;
    createdAt: Date;
  }>;
};

export default function ProfileClient({ user, stats, notifications }: ProfileClientProps) {
  const router = useRouter();

  async function handleLogout() {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Greška prilikom odjave:', error);
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Moj Profil
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Dobrodošli nazad, {user.name}!
        </p>
      </div>

      {/* Grid layout - dve kolone */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEVA STRANA - Statistika (2/3 širine) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Košnice Card */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl shadow-lg border border-amber-200 dark:border-amber-800 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center">
                    <img 
                      src="/images/beehive.png" 
                      alt="Košnice" 
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                      Košnice
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Vaše pčelinje kolonije
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-5xl font-bold text-amber-600 dark:text-amber-400">
                    {stats.hives}
                  </p>
                </div>
              </div>

              {stats.hives === 0 ? (
                /* Ako NEMA košnica - prikaži poruku i dugme */
                <div className="mt-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border-2 border-dashed border-amber-300 dark:border-amber-700">
                    <div className="mb-4">
                      <div className="text-6xl mb-2">🐝</div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                        Nemate nijednu košnicu
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                        Započnite praćenje vaših pčelinjih kolonija
                      </p>
                    </div>
                    <Link href="/hives">
                      <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-md hover:shadow-lg">
                        + Dodaj prvu košnicu
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                /* Ako IMA košnica - prikaži link ka svim košnicama */
                <Link href="/hives">
                  <button className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors shadow-md hover:shadow-lg">
                    Pregled svih košnica →
                  </button>
                </Link>
              )}
            </div>
          </div>
          
          {/* Aktivnosti Card */}
          <Link href="/activities">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl shadow-lg border border-blue-200 dark:border-blue-800 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
                      <img 
                        src="/images/aktivnosti.png" 
                        alt="Aktivnosti" 
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        Aktivnosti
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Zakazani zadaci i pregledi
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {stats.activities}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Notifikacije Card */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl shadow-lg border border-purple-200 dark:border-purple-800 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="text-3xl">🔔</div>
                    {stats.notifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {stats.notifications}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                      Notifikacije
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Nepročitane poruke
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-purple-100 dark:border-purple-900"
                    >
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {notif.activityTitle}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-purple-200 dark:border-purple-800">
                    <div className="text-4xl mb-2">📭</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Nema novih notifikacija
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* DESNA STRANA - Profil info i akcije (1/3 širine) */}
        <div className="space-y-6">
          
          {/* Kartica sa korisničkim podacima */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header sa gradientom */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-24"></div>
            
            {/* Avatar */}
            <div className="px-6 pb-6 -mt-12">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-gray-700 border-4 border-white dark:border-gray-800 shadow-xl mb-4">
                  <img 
                    src="/images/korisnikM.png" 
                    alt="Korisnički avatar" 
                    className="w-full h-full object-cover"
                  />            
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                  {user.name}
                </h2>
                
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-3">
                  <span className="text-xl">👤</span>
                  <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                    {user.role}
                  </span>
                </div>

                {/* Info */}
                <div className="w-full space-y-3 mt-4 text-left">
                  <div className="flex items-start gap-3 text-sm bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <span className="text-lg">📧</span>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</p>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">{user.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Akcije */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 px-2">
              Brze akcije
            </h3>
            <div className="space-y-2">
              {/* Promeni lozinku */}
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl transition-all">
                <span className="text-lg">🔑</span>
                <span>Promeni lozinku</span>
              </button>

              {/* Podešavanja */}
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl transition-all">
                <span className="text-lg">⚙️</span>
                <span>Podešavanja</span>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl transition-all border border-red-200 dark:border-red-800"
              >
                <span className="text-lg">🚪</span>
                <span>Odjavi se</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}