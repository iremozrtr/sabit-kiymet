export const ROUTES = {
  liste: "/sabit-kiymet",
  yeni: "/sabit-kiymet/ekle",
  kart: (id: number | string) => `/sabit-kiymet/${id}`,
} as const;
