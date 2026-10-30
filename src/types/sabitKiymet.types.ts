/* ------------------------------------------------------------------ */
/*  Enum'lar                                                           */
/* ------------------------------------------------------------------ */
export enum Kategori {
  Bina = "BINA",
  Tasit = "TASIT",
  Demirbas = "DEMIRBAS",
  Makine = "MAKINE",
}

export enum Durum {
  Aktif = "AKTIF",
  Satildi = "SATILDI",
  Hurda = "HURDA",
}

/* ------------------------------------------------------------------ */
/*  Enum -> Label eşlemeleri (tek kaynak)                              */
/* ------------------------------------------------------------------ */
export const KATEGORI_LABEL: Record<Kategori, string> = {
  [Kategori.Bina]: "Bina",
  [Kategori.Tasit]: "Taşıt",
  [Kategori.Demirbas]: "Demirbaş",
  [Kategori.Makine]: "Makine",
};

export const DURUM_LABEL: Record<Durum, string> = {
  [Durum.Aktif]: "Aktif",
  [Durum.Satildi]: "Satıldı",
  [Durum.Hurda]: "Hurda",
};

/* ------------------------------------------------------------------ */
/*  Enum -> Dropdown option (label eşlemesinden üretilir)              */
/* ------------------------------------------------------------------ */
export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

function toOptions<T extends string>(labels: Record<T, string>): SelectOption<T>[] {
  return (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));
}

export const KATEGORI_OPTIONS = toOptions(KATEGORI_LABEL);
export const DURUM_OPTIONS = toOptions(DURUM_LABEL);

/* ------------------------------------------------------------------ */
/*  Veri modeli                                                        */
/* ------------------------------------------------------------------ */
export interface Sube {
  id: number;
  adi: string;
  sehir: string;
}

export interface SabitKiymet {
  id: number;
  ad: string;
  kategori: Kategori;
  alisTarihi: string; // YYYY-MM-DD
  alisBedeli: number;
  amortismanOrani: number; // yıllık %
  durum: Durum;
  subeId: number; // 0 = seçilmedi
  subeAdi: string;
}

/** Formik'in yönettiği değerler: id sunucu tarafından verilir. */
export type SabitKiymetForm = Omit<SabitKiymet, "id">;
