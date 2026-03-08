# Košnica PLUS — Aplikacija za Pčelarstvo

Aplikacija je namenjena pčelarima za digitalno upravljanje košnicama, praćenje aktivnosti i planiranje rada na pčelinjaku. Ciljevi aplikacije su omogućavanje bezbednog i lakog pristupa evidenciji košnica, praćenje napretka aktivnosti, pregled vremenske prognoze po lokaciji košnice, kao i poboljšanje korisničkog iskustva kroz jednostavnu registraciju i pregled ponude. Jedan od ciljeva je i digitalizacija pčelarskih evidencija koje se tradicionalno vode ručno.

## Funkcionalnosti aplikacije

**Za korisnike (pčelare):**
- Registracija i kreiranje korisničkog naloga
- Prijava
- Pregled i upravljanje košnicama (dodavanje, izmena, brisanje)
- Praćenje lokacije košnica na interaktivnoj mapi
- Planiranje i evidentiranje aktivnosti po košnicama
- Dodavanje komentara i beleški na košnicama
- Pregled vremenske prognoze za lokaciju košnice
- Vizualizacija statistike aktivnosti kroz grafikone
- Primanje notifikacija

**Za menadžere:**
- Sve funkcionalnosti korisnika
- Slanje notifikacija svim korisnicima

**Za administratore:**
- Pregled svih korisnika i edukatora
- Izmena uloga korisnika
- Brisanje korisnika

## Tehnologije

- **Frontend:** Next.js, React, TailwindCSS
- **Backend:** Next.js API Routes
- **Baza podataka:** MySQL 8
- **ORM:** Prisma
- **Autentifikacija:** JWT + bcryptjs
- **Mapa:** Leaflet + OpenStreetMap API
- **Vizualizacija:** Recharts
- **Vremenska prognoza:** Open-Meteo API
- **Docker:** Multi-stage build za izgradnju i deployment
- **Hosting/Deployment:** Docker Compose za lokalni razvoj

## Instalacija

**1. Kloniranje repozitorijuma:**
```bash
git clone https://github.com/elab-development/internet-tehnologije-2025-vebaplikacijazapcelarstvo_2022_0304.git
```

**2. Kreiranje `.env` fajla sa potrebnim varijablama:**
```env
DATABASE_URL=mysql://root:root1234@db:3306/pcelarstvo
JWT_SECRET=promeni-ovo-u-produkciji-minimum-32-karaktera
```

**3. Pokretanje Docker-a:**
```bash
docker compose up --build
```

Aplikacija će biti dostupna na: **http://localhost:3000**

## Struktura projekta

```
/app          - Stranice i API rute (Next.js App Router)
/components   - React komponente
/lib          - Pomoćne funkcije (auth, prisma, swagger)
/prisma       - Šema baze podataka i migracije
/__tests__    - Automatizovani testovi
/public       - Statički fajlovi
Dockerfile    - Multi-stage build za Next.js aplikaciju
docker-compose.yml - Definisanje servisa: app, db
```

## Git grane

Za razvoj projekta korišćena je Git strategija sa glavnom, integracionom i feature granama. Svaka grana ima specifičnu ulogu u razvoju i omogućava paralelan rad na različitim funkcionalnostima.

**`main`** — stabilna, produkciona verzija projekta. Sadrži samo testiran i integrisan kod spreman za deployment.

**`develop`** — integraciona grana u koju se spajaju sve feature grane. Ova grana predstavlja radnu verziju projekta pre spajanja u main.

**`feature/auth`** — grana namenjena implementaciji autentifikacije. Sadrži registraciju, prijavu, JWT tokene i zaštitu ruta. Nakon testiranja i potvrde da autentifikacija funkcioniše, ova grana se spaja u develop.

**`feature/hives`** — grana za implementaciju upravljanja košnicama. Sadrži CRUD operacije za košnice, komentare i aktivnosti. Nakon validacije se spaja u develop.

**`feature/dashboard`** — grana za statistike i vizualizaciju. Sadrži grafikone aktivnosti po tipu i mesecu, interaktivnu mapu košnica i vremensku prognozu. Nakon testiranja se spaja u develop.

**`feature/docker`** — grana namenjena implementaciji Docker podrške. Sadrži Dockerfile, .dockerignore i docker-compose.yml. Nakon testiranja i potvrde da kontejnerizacija funkcioniše, ova grana se spaja u develop.

**`feature/tests`** — grana za automatizovane testove. Sadrži folder `__tests__` sa test fajlovima za API rute i komponente. Testovi se pokreću kroz CI/CD pipeline i nakon validacije se spajaju u develop.