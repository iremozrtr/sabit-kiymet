import { SabitKiymet, SabitKiymetForm, Sube } from "../types/sabitKiymet.types";
import { http } from "./http";

export const getSabitKiymetler = () => http<SabitKiymet[]>("/sabitKiymetler");

export const getSabitKiymet = (id: number) => http<SabitKiymet>(`/sabitKiymetler/${id}`);

export const createSabitKiymet = (data: SabitKiymetForm) =>
  http<SabitKiymet>("/sabitKiymetler", { method: "POST", body: JSON.stringify(data) });

export const updateSabitKiymet = (id: number, data: SabitKiymetForm) =>
  http<SabitKiymet>(`/sabitKiymetler/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteSabitKiymet = (id: number) =>
  http<Record<string, never>>(`/sabitKiymetler/${id}`, { method: "DELETE" });

export const getSubeler = () => http<Sube[]>("/subeler");