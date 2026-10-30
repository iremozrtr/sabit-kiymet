import { useEffect, useMemo, useState } from "react";
import { getSubeler } from "../../../api/sabitKiymet.api";
import { hataMesaji } from "../../../api/http";
import { Modal } from "../../../components/Modal";
import { Sube } from "../../../types/sabitKiymet.types";
import "./SubeModal.scss";

interface SubeModalProps {
  seciliId?: number;
  /** Seçim callback ile geri döner — modal kendi içinde form state'ine dokunmaz. */
  onSelect: (sube: Sube) => void;
  onClose: () => void;
}

export function SubeModal({ seciliId, onSelect, onClose }: SubeModalProps) {
  const [subeler, setSubeler] = useState<Sube[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState("");
  const [ara, setAra] = useState("");

  useEffect(() => {
    let iptal = false;
    getSubeler()
      .then((d) => !iptal && setSubeler(d))
      .catch((e) => !iptal && setHata(hataMesaji(e)))
      .finally(() => !iptal && setYukleniyor(false));
    return () => {
      iptal = true;
    };
  }, []);

  const filtreli = useMemo(() => {
    const q = ara.trim().toLocaleLowerCase("tr");
    return q
      ? subeler.filter((s) => `${s.adi} ${s.sehir}`.toLocaleLowerCase("tr").includes(q))
      : subeler;
  }, [subeler, ara]);

  return (
    <Modal baslik="Şube Seç" onClose={onClose} genislik="sm">
      <input
        className="input"
        placeholder="Şube veya şehir ara…"
        value={ara}
        onChange={(e) => setAra(e.target.value)}
        autoFocus
      />
      <div className="sube-list">
        {yukleniyor && <p className="muted">Şubeler yükleniyor…</p>}
        {hata && <p className="alert alert--error">{hata}</p>}
        {!yukleniyor && !hata && filtreli.length === 0 && <p className="muted">Eşleşen şube yok.</p>}
        {filtreli.map((s) => (
          <button
            type="button"
            key={s.id}
            className={`sube-item${s.id === seciliId ? " sube-item--active" : ""}`}
            onClick={() => onSelect(s)}
          >
            <strong>{s.adi}</strong>
            <span>{s.sehir}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
}
