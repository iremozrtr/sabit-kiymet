/**
 * Sabit Kıymet yardımcı fonksiyonları — tek yerden export.
 * (amortisman hesapları + biçimlendirme)
 */
import { Durum, Kategori, SabitKiymetForm } from "../../../types/sabitKiymet.types";

/* ----------------------------- Format ------------------------------ */
const paraFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 2,
});

export function formatPara(deger: number): string {
  return paraFormatter.format(Number.isFinite(deger) ? deger : 0);
}

export function formatYuzde(deger: number): string {
  return `%${Number.isFinite(deger) ? deger : 0}`;
}

/** "2024-03-15" -> "15.03.2024" (saat dilimi kayması olmasın diye string üzerinden) */
export function formatTarih(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}.${m}.${y}` : iso;
}

export function bugunISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Formik number input'u boşken "" döndürebilir; güvenli sayıya çevir. */
export function toNumber(deger: unknown): number {
  const n = typeof deger === "number" ? deger : parseFloat(String(deger));
  return Number.isFinite(n) ? n : 0;
}

/* --------------------------- Amortisman ---------------------------- */
export function hesaplaYillikAmortisman(alisBedeli: number, amortismanOrani: number): number {
  return (alisBedeli * amortismanOrani) / 100;
}

export interface AmortismanSatiri {
  yil: number | null; // takvim yılı (alış tarihi yoksa null)
  sira: number; // 1. yıl, 2. yıl ...
  amortisman: number;
  birikmis: number;
  netDeger: number;
}

/** Normal (doğrusal) amortisman planı — net değer sıfırlanana kadar. */
export function hesaplaAmortismanPlani(
  alisBedeli: number,
  amortismanOrani: number,
  alisTarihi: string
): AmortismanSatiri[] {
  if (alisBedeli <= 0 || amortismanOrani <= 0) return [];
  const yillik = hesaplaYillikAmortisman(alisBedeli, amortismanOrani);
  const baslangicYili = alisTarihi ? parseInt(alisTarihi.slice(0, 4), 10) : NaN;

  const satirlar: AmortismanSatiri[] = [];
  let birikmis = 0;
  for (let sira = 1; sira <= 100 && birikmis < alisBedeli; sira++) {
    const amortisman = Math.min(yillik, alisBedeli - birikmis);
    birikmis += amortisman;
    satirlar.push({
      sira,
      yil: Number.isFinite(baslangicYili) ? baslangicYili + sira - 1 : null,
      amortisman,
      birikmis,
      netDeger: Math.max(alisBedeli - birikmis, 0),
    });
  }
  return satirlar;
}

/* ---------------------------- Başlangıç ---------------------------- */
export function bosFormDegerleri(): SabitKiymetForm {
  return {
    ad: "",
    kategori: Kategori.Demirbas,
    alisTarihi: bugunISO(),
    alisBedeli: 0,
    amortismanOrani: 0,
    durum: Durum.Aktif,
    subeId: 0,
    subeAdi: "",
  };
}
