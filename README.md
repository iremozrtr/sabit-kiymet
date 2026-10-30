# Sabit Kıymet Yönetim Modülü (React · TypeScript · Formik)

## Çalıştırma
```bash
npm install
npm run dev        # mock API (json-server :3001) + Vite (:5173)
npm run typecheck
npm run build
```
Kaydetme hatası senaryosu: bir kaydın adına `hata-test` yazıp kaydedin (mock API 500 döner).

## Yapı
- `types/` interface + enum + enum→label + enum→option (tek kaynak)
- `api/` fetch katmanı, `features/sabitKiymet/{list,card,modal}`
- `utils/_project/sabitKiymet/index.ts` amortisman + format util'leri
- Kart `isInModal` ile Liste'deki "Hızlı Ekle" modalında yeniden kullanılır
- Şube seçimi: SubeModal → callback → Kart'ta tek `setValues`
