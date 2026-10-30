const BASE_URL = "/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(BASE_URL + path, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError("Sunucuya ulaşılamadı. Bağlantınızı kontrol edin.", 0);
  }

  if (!res.ok) {
    let message = `İşlem başarısız (HTTP ${res.status}).`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
    }
    throw new ApiError(message, res.status);
  }
  return (await res.json()) as T;
}

export function hataMesaji(err: unknown): string {
  return err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu.";
}
