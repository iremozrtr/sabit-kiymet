import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { hataMesaji } from "../../../api/http";
import {
  createSabitKiymet,
  deleteSabitKiymet,
  getSabitKiymet,
  updateSabitKiymet,
} from "../../../api/sabitKiymet.api";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { useNotification } from "../../../components/Notification";
import { ROUTES } from "../../../routes";
import { SabitKiymet, SabitKiymetForm, Sube } from "../../../types/sabitKiymet.types";
import {
  bosFormDegerleri,
  hesaplaAmortismanPlani,
  hesaplaYillikAmortisman,
  toNumber,
} from "../../../utils/_project/sabitKiymet";
import { SubeModal } from "../modal/SubeModal";
import { AmortismanRaporu } from "./AmortismanRaporu";
import { GenelBilgiler } from "./GenelBilgiler";
import { sabitKiymetSchema } from "./schema";
import "./SabitKiymetCard.scss";


export interface SabitKiymetCardProps {
  id?: number;
  isInModal?: boolean;
  onSaved?: (kayit: SabitKiymet) => void;
  onDeleted?: () => void;
  onCancel?: () => void;
 
}

type Sekme = "genel" | "rapor";

export function SabitKiymetCard({ id, isInModal = false, onSaved, onDeleted, onCancel }: SabitKiymetCardProps) {
  const bildir = useNotification();
  const duzenleme = id !== undefined;

  const [baslangic, setBaslangic] = useState<SabitKiymetForm>(bosFormDegerleri);
  const [yukleniyor, setYukleniyor] = useState(duzenleme);
  const [yuklemeHatasi, setYuklemeHatasi] = useState("");
  const [kayitHatasi, setKayitHatasi] = useState("");
  const [subeModalAcik, setSubeModalAcik] = useState(false);
  const [silOnay, setSilOnay] = useState(false);
  const [sekme, setSekme] = useState<Sekme>("genel");

  useEffect(() => {
    if (id === undefined) return;
    let iptal = false;
    setYukleniyor(true);
    setYuklemeHatasi("");
    getSabitKiymet(id)
      .then(({ id: _id, ...form }) => !iptal && setBaslangic(form))
      .catch((e) => !iptal && setYuklemeHatasi(hataMesaji(e)))
      .finally(() => !iptal && setYukleniyor(false));
    return () => {
      iptal = true;
    };
  }, [id]);
  const formik = useFormik<SabitKiymetForm>({
    initialValues: baslangic,
    enableReinitialize: true,
    validationSchema: sabitKiymetSchema,
    onSubmit: async (values, helpers) => {
      setKayitHatasi("");
      const veri: SabitKiymetForm = {
        ...values,
        ad: values.ad.trim(),
        alisBedeli: toNumber(values.alisBedeli),
        amortismanOrani: toNumber(values.amortismanOrani),
      };
      try {
        const kayit = duzenleme ? await updateSabitKiymet(id, veri) : await createSabitKiymet(veri);
        bildir({
          mesaj: duzenleme ? "Kayıt güncellendi." : "Kayıt oluşturuldu.",
          link: { etiket: "Kaydı aç", to: ROUTES.kart(kayit.id) },
        });
        onSaved?.(kayit);
      } catch (e) {
        const mesaj = hataMesaji(e);
        setKayitHatasi(mesaj);
        bildir({ tur: "error", mesaj: "Kayıt kaydedilemedi." });
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const alisBedeli = toNumber(formik.values.alisBedeli);
  const amortismanOrani = toNumber(formik.values.amortismanOrani);

  const yillikAmortisman = useMemo(
    () => hesaplaYillikAmortisman(alisBedeli, amortismanOrani),
    [alisBedeli, amortismanOrani]
  );
  const amortismanPlani = useMemo(
    () => hesaplaAmortismanPlani(alisBedeli, amortismanOrani, formik.values.alisTarihi),
    [alisBedeli, amortismanOrani, formik.values.alisTarihi]
  );

  const subeSecildi = (sube: Sube) => {
    formik.setValues({
      ...formik.values,
      subeId: sube.id,
      subeAdi: sube.adi,
    });
    setSubeModalAcik(false);
  };

  const subeTemizle = () => {
    formik.setValues({ ...formik.values, subeId: 0, subeAdi: "" });
  };

  const sil = async () => {
    if (id === undefined) return;
    try {
      await deleteSabitKiymet(id);
      bildir({ mesaj: "Kayıt silindi" });
      onDeleted?.();
    } catch (e) {
      setSilOnay(false);
      setKayitHatasi(hataMesaji(e));
      bildir({ tur: "error", mesaj: "Kayıt silinemedi. " });
    }
  };

  if (yukleniyor) return <p className="muted" role="status">Kayıt yükleniyor…</p>;
  if (yuklemeHatasi) {
    return (
      <div>
        <p className="alert alert--error">{yuklemeHatasi}</p>
        <button className="btn" onClick={onCancel}>Listeye dön</button>
      </div>
    );
  }

  return (
    <form className={`kart${isInModal ? " kart--modal" : ""}`} onSubmit={formik.handleSubmit} noValidate>
      {!isInModal && (
        <header className="page-head">
          <div>
            <h1>{duzenleme ? formik.values.ad || "Sabit Kıymet" : "Yeni Sabit Kıymet"}</h1>
            <p className="muted">{duzenleme ? `Kayıt No: ${id}` : "Yeni kayıt oluşturuluyor"}</p>
          </div>
        </header>
      )}

      <div className="tabs" role="tablist">
        <button type="button" role="tab" aria-selected={sekme === "genel"} className={`tab${sekme === "genel" ? " tab--on" : ""}`} onClick={() => setSekme("genel")}>
          Genel Bilgiler
        </button>
        <button type="button" role="tab" aria-selected={sekme === "rapor"} className={`tab${sekme === "rapor" ? " tab--on" : ""}`} onClick={() => setSekme("rapor")}>
          Amortisman Raporu
        </button>
      </div>

      {kayitHatasi && <p className="alert alert--error" role="alert">{kayitHatasi}</p>}

      <section className="kart__body">
        {sekme === "genel" ? (
          <GenelBilgiler
            formik={formik}
            yillikAmortisman={yillikAmortisman}
            onSubeSec={() => setSubeModalAcik(true)}
            onSubeTemizle={subeTemizle}
          />
        ) : (
          <AmortismanRaporu satirlar={amortismanPlani} />
        )}
      </section>

      <footer className="kart__foot">
        {duzenleme && (
          <button type="button" className="btn btn--danger kart__sil" onClick={() => setSilOnay(true)}>
            Sil
          </button>
        )}
        <button type="button" className="btn" onClick={onCancel}>
          Vazgeç
        </button>
        <button type="submit" className="btn btn--primary" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </footer>

      {subeModalAcik && (
        <SubeModal seciliId={formik.values.subeId} onSelect={subeSecildi} onClose={() => setSubeModalAcik(false)} />
      )}

      {silOnay && (
        <ConfirmModal
          baslik="Kaydı sil"
          mesaj={<><strong>{formik.values.ad}</strong> Kayıt kalıcı olarak silinecek. Emin misiniz?</>}
          onayEtiketi="Evet, sil"
          onOnay={sil}
          onVazgec={() => setSilOnay(false)}
        />
      )}
    </form>
  );
}
