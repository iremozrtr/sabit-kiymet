import * as Yup from "yup";
import { Durum, Kategori } from "../../../types/sabitKiymet.types";

export const sabitKiymetSchema = Yup.object({
  ad: Yup.string().trim().required("Ad zorunludur.").min(2, "Ad en az 2 karakter olmalı."),
  kategori: Yup.mixed<Kategori>().oneOf(Object.values(Kategori)).required(),
  alisTarihi: Yup.string(),
  alisBedeli: Yup.number()
    .typeError("Geçerli bir sayı girin.")
    .required("Alış bedeli zorunludur.")
    .moreThan(0, "Alış bedeli 0'dan büyük olmalı."),
  amortismanOrani: Yup.number()
    .typeError("Geçerli bir sayı girin.")
    .min(0, "Oran 0'dan küçük olamaz.")
    .max(100, "Oran 100'den büyük olamaz."),
  durum: Yup.mixed<Durum>().oneOf(Object.values(Durum)).required(),
  subeId: Yup.number().required(),
  subeAdi: Yup.string(),
});
