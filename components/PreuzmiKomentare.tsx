"use client";

import { useState } from "react";

interface Komentar {
  id: number;
  sadrzaj: string;
  createdAt: string;
  jacinaKosnice: string;
  korisnik: {
    ime: string;
    email: string;
  };
}

interface PreuzmiKomentarePDFProps {
  komentari: Komentar[];
  nazivKosnice: string;
  imeKorisnika: string;
}

// jsPDF ne podrzava srpska slova, koristimo sigurnu konverziju
function latinize(text: string): string {
  return text
    .replace(/š/g, "s").replace(/Š/g, "S")
    .replace(/č/g, "c").replace(/Č/g, "C")
    .replace(/ć/g, "c").replace(/Ć/g, "C")
    .replace(/ž/g, "z").replace(/Ž/g, "Z")
    .replace(/đ/g, "dj").replace(/Đ/g, "Dj");
}

function formatDatum(dateStr: string): string {
  const d = new Date(dateStr);
  const dan = String(d.getDate()).padStart(2, "0");
  const meseci = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "avg", "sep", "okt", "nov", "dec"];
  const mes = meseci[d.getMonth()];
  const god = d.getFullYear();
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dan}. ${mes} ${god}. ${h}:${min}`;
}

export default function PreuzmiKomentarePDF({ komentari, nazivKosnice, imeKorisnika }: PreuzmiKomentarePDFProps) {
  const [generise, setGenerise] = useState(false);

  async function ucitajLogo(): Promise<string> {
    const response = await fetch("/images/logo.png");
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }

  async function handlePreuzmi() {
    if (komentari.length === 0) return;

    setGenerise(true);
    try {
      const { jsPDF } = await import("jspdf");

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let y = 20;

      // === HEADER BLOK ===

      // Logo — gore desno
      const logo = await ucitajLogo();
      doc.addImage(logo, "PNG", pageWidth - margin - 25, y-10, 25, 25);

      // Naziv kosnice
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(180, 120, 0);
      doc.text(latinize(`Kosnica: ${nazivKosnice}`), margin, y);
      y += 8;

      // Korisnik
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);
      doc.text(latinize(`Korisnik: ${imeKorisnika}`), margin, y);
      y += 6;

      // Broj komentara
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text(`Ukupno komentara: ${komentari.length}`, margin, y);
      y += 4;

      // Datum generisanja
      doc.setFontSize(9);
      doc.setTextColor(160, 160, 160);
      doc.text(`Generisano: ${formatDatum(new Date().toISOString())}`, margin, y);
      y += 6;

      // Linija ispod headera
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;

      // === KOMENTARI ===
      komentari.forEach((komentar, index) => {
        // Izracunaj visinu komentara pre nego sto ga crtamo
        const linije = doc.splitTextToSize(latinize(komentar.sadrzaj), contentWidth);
        const visinaBloka = 6 + linije.length * 5 + 8;

        if (y + visinaBloka > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }

        // Datum — levo, bold
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(30, 30, 30);
        doc.text(formatDatum(komentar.createdAt), margin, y);

        // Jacina — desno, u boji
        const jacinaColor: Record<string, [number, number, number]> = {
          JAKA: [22, 163, 74],
          SREDNJA: [202, 138, 4],
          SLABA: [220, 38, 38],
        };
        const boja = jacinaColor[komentar.jacinaKosnice.toUpperCase()] || [100, 100, 100];
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...boja);
        doc.text(latinize(komentar.jacinaKosnice), pageWidth - margin, y, { align: "right" });
        y += 6;

        // Tekst komentara
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.text(linije, margin, y);
        y += linije.length * 5 + 3;

        // Separator (osim za poslednji)
        if (index < komentari.length - 1) {
          doc.setDrawColor(230, 230, 230);
          doc.setLineWidth(0.3);
          doc.line(margin, y, pageWidth - margin, y);
          y += 7;
        }
      });

      // === FOOTER ===
      const ukupnoStranica = doc.getNumberOfPages();
      for (let i = 1; i <= ukupnoStranica; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(180, 180, 180);
        doc.text(
          `Stranica ${i} od ${ukupnoStranica}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
      }

      const imeFajla = `komentari-${latinize(nazivKosnice).toLowerCase().replace(/\s+/g, "-")}.pdf`;
      doc.save(imeFajla);
    } catch (err) {
      console.error("Greska pri generisanju PDF-a:", err);
      alert("Greska pri generisanju PDF-a.");
    } finally {
      setGenerise(false);
    }
  }

  return (
    <button
      onClick={handlePreuzmi}
      disabled={generise || komentari.length === 0}
      className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-2.5 rounded-xl transition-colors disabled:cursor-not-allowed disabled:opacity-50 text-sm border border-gray-200 dark:border-gray-600"
    >
      {generise
        ? "Generisanje..."
        : komentari.length === 0
        ? "Nema komentara za preuzimanje"
        : "Preuzmi komentare kao PDF"}
    </button>
  );
}