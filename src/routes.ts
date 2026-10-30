export const ROUTES = {
  liste: "/sabit-kiymet",
  yeni: "/sabit-kiymet/yeni",
  kart: (id: number | string) => `/sabit-kiymet/${id}`,
} as const;
