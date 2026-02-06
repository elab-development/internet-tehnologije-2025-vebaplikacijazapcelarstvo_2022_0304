"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [ime, setIme] = useState("");
  const [email, setEmail] = useState("");
  const [sifra, setSifra] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (sifra.length < 6) {
      setError("Lozinka mora imati minimum 6 karaktera");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ime,
          email,
          sifra,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Greška prilikom registracije");
        return;
      }

      setSuccess(true);
      
      setTimeout(() => {
        router.push("/");
      }, 2000);
      
    } catch (err: any) {
      console.error("Greška:", err);
      setError("Greška prilikom registracije. Pokušajte ponovo.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/images/logo.png" 
              alt="Pčelarstvo Logo" 
              className="w-24 h-24 object-contain"
            />            
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Kreirajte nalog
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Unesite svoje podatke za registraciju
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ime i prezime
            </label>
            <input
              type="text"
              placeholder="Unesite ime i prezime"
              value={ime}
              onChange={(e) => setIme(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email adresa
            </label>
            <input
              type="email"
              placeholder="Unesite email adresu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Lozinka
            </label>
            <input
              type="password"
              placeholder="Minimum 6 karaktera"
              value={sifra}
              onChange={(e) => setSifra(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              required
              minLength={6}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Lozinka mora imati minimum 6 karaktera
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg text-sm">
              ✅ Uspešno ste se registrovali! Preusmeravanje na login...
            </div>
          )}

          <button
            type="submit"
            disabled={success}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            {success ? "Uspešno!" : "Registruj se"}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 text-sm font-medium transition-colors"
            >
              Već imate nalog? Prijavite se
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-600 dark:text-blue-400">
            💡 Nakon registracije, možete se odmah prijaviti sa svojim email-om i lozinkom
          </p>
        </div>
      </div>
    </div>
  );
}