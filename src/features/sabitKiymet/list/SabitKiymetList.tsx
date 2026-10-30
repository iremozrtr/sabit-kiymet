import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { hataMesaji } from "../../../api/http";
import { deleteSabitKiymet, getSabitKiymetler } from "../../../api/sabitKiymet.api";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { Modal } from "../../../components/Modal";
import { useNotification } from "../../../components/Notification";
import { ROUTES } from "../../../routes";
import {
  DURUM_LABEL,
  DURUM_OPTIONS,
  Durum,
  KATEGORI_LABEL,
  KATEGORI_OPTIONS,
  Kategori,
  SabitKiymet,
} from "../../../types/sabitKiymet.types";
import {
  formatPara,
  formatTarih,
  hesaplaYillikAmortisman,
} from "../../../utils/_project/sabitKiymet";
import { SabitKiymetCard } from "../card/SabitKiymetCard";
import "./SabitKiymetList.scss";

export function SabitKiymetList() {
  const navigate = useNavigate();
  const bildir = useNotification();

  const [kayitlar, setKayitlar] = useState<SabitKiymet[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState("");

  const [ara, setAra] = useState("");
  const [kategori, setKategori] = useState<Kategori | "">("");
  const [durum, setDurum] = useState<Durum | "">("");

  const [silinecek, setSilinecek] = useState<SabitKiymet | null>(null);
  const [hizliEkleAcik, setHizliEkleAcik] = useState(false);

  const yukle = useCallback(async () => {
    setYukleniyor(true);
    setHata("");
    try {
      setKayitlar(await getSabitKiymetler());
    } catch (e) {
      setHata(hataMesaji(e));
    } finally {
      setYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    yukle();
  }, [yukle]);

  const filtreli = useMemo(() => {
    const q = ara.trim().toLocaleLowerCase("tr");
    return kayitlar.filter(
      (k) =>
        (!q || k.ad.toLocaleLowerCase("tr").includes(q)) &&
        (!kategori || k.kategori === kategori) &&
        (!durum || k.durum === durum)
    );
  }, [kayitlar, ara, kategori, durum]);

  const filtreVar = ara !== "" || kategori !== "" || durum !== "";

  const sil = async () => {
    if (!silinecek) return;
    try {
      await deleteSabitKiymet(silinecek.id);
      setSilinecek(null);
      bildir({ mesaj: "Kayıt silindi" });
      yukle(); // zaten listedeyiz: "listeye dön" = listeyi tazele
    } catch (e) {
      setSilinecek(null);
      bildir({ tur: "error", mesaj: `Kayıt silinemedi: ${hataMesaji(e)}` });
    }
  };

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Sabit Kıymetler</h1>
          <p className="muted">{kayitlar.length} kayıt</p>
        </div>
        <div className="page-head__actions">
          <button className="btn" onClick={() => setHizliEkleAcik(true)}>Hızlı Ekle</button>
          <Link className="btn btn--primary" to={ROUTES.yeni}>+ Yeni</Link>
        </div>
      </header>

      <div className="filters">
        <input
          className="input"
          type="search"
          placeholder="Ad ile ara…"
          aria-label="Ad ile ara"
          value={ara}
          onChange={(e) => setAra(e.target.value)}
        />
        <select className="input" aria-label="Kategori filtresi" value={kategori} onChange={(e) => setKategori(e.target.value as Kategori | "")}>
          <option value="">Tüm kategoriler</option>
          {KATEGORI_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select className="input" aria-label="Durum filtresi" value={durum} onChange={(e) => setDurum(e.target.value as Durum | "")}>
          <option value="">Tüm durumlar</option>
          {DURUM_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {filtreVar && (
          <button className="btn btn--ghost" onClick={() => { setAra(""); setKategori(""); setDurum(""); }}>
            Filtreleri temizle
          </button>
        )}
      </div>

      {yukleniyor && <p className="muted" role="status">Yükleniyor…</p>}

      {hata && (
        <div className="alert alert--error" role="alert">
          {hata} <button className="btn btn--sm" onClick={yukle}>Tekrar dene</button>
        </div>
      )}

      {!yukleniyor && !hata && filtreli.length === 0 && (
        <div className="empty">
          {kayitlar.length === 0 ? (
            <>
              <p>Henüz sabit kıymet kaydı yok.</p>
              <Link className="btn btn--primary" to={ROUTES.yeni}>İlk kaydı oluştur</Link>
            </>
          ) : (
            <p>Filtrelere uyan kayıt bulunamadı.</p>
          )}
        </div>
      )}

      {!yukleniyor && !hata && filtreli.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Ad</th>
                <th>Kategori</th>
                <th>Alış Tarihi</th>
                <th className="num">Alış Bedeli</th>
                <th className="num">Yıllık Amortisman</th>
                <th>Şube</th>
                <th>Durum</th>
                <th aria-label="İşlemler" />
              </tr>
            </thead>
            <tbody>
              {filtreli.map((k) => (
                <tr key={k.id} onDoubleClick={() => navigate(ROUTES.kart(k.id))}>
                  <td data-label="Ad"><Link to={ROUTES.kart(k.id)} className="row-link">{k.ad}</Link></td>
                  <td data-label="Kategori">{KATEGORI_LABEL[k.kategori]}</td>
                  <td data-label="Alış Tarihi">{formatTarih(k.alisTarihi)}</td>
                  <td className="num" data-label="Alış Bedeli">{formatPara(k.alisBedeli)}</td>
                  <td className="num" data-label="Yıllık Amortisman">
                    {formatPara(hesaplaYillikAmortisman(k.alisBedeli, k.amortismanOrani))}
                  </td>
                  <td data-label="Şube">{k.subeAdi || "—"}</td>
                  <td data-label="Durum">
                    <span className={`badge badge--${k.durum.toLowerCase()}`}>{DURUM_LABEL[k.durum]}</span>
                  </td>
                  <td className="actions">
                    <Link className="btn btn--sm" to={ROUTES.kart(k.id)}>Düzenle</Link>
                    <button className="btn btn--sm btn--danger" onClick={() => setSilinecek(k)}>Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {silinecek && (
        <ConfirmModal
          baslik="Kaydı sil"
          mesaj={<><strong>{silinecek.ad}</strong> kaydı kalıcı olarak silinecek. Emin misiniz?</>}
          onayEtiketi="Evet, sil"
          onOnay={sil}
          onVazgec={() => setSilinecek(null)}
        />
      )}

      {/* Aynı Kart bileşeni, modal içinde (isInModal) yeniden kullanılıyor */}
      {hizliEkleAcik && (
        <Modal baslik="Hızlı Ekle" genislik="lg" onClose={() => setHizliEkleAcik(false)}>
          <SabitKiymetCard
            isInModal
            onSaved={() => { setHizliEkleAcik(false); yukle(); }}
            onCancel={() => setHizliEkleAcik(false)}
          />
        </Modal>
      )}
    </div>
  );
}
