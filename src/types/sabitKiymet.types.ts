
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


export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

function toOptions<T extends string>(labels: Record<T, string>): SelectOption<T>[] {
  return (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));
}

export const KATEGORI_OPTIONS = toOptions(KATEGORI_LABEL);
export const DURUM_OPTIONS = toOptions(DURUM_LABEL);


export interface Sube {
  id: number;
  adi: string;
  sehir: string;
}

export interface SabitKiymet {
  id: number;
  ad: string;
  kategori: Kategori;
  alisTarihi: string; 
  alisBedeli: number;
  amortismanOrani: number; 
  durum: Durum;
  subeId: number; 
  subeAdi: string;
}


export type SabitKiymetForm = Omit<SabitKiymet, "id">;

