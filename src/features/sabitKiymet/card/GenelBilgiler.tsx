import { FormikProps } from "formik";
import { FormField } from "../../../components/FormField";
import {
  DURUM_OPTIONS,
  KATEGORI_OPTIONS,
  SabitKiymetForm,
} from "../../../types/sabitKiymet.types";
import { formatPara } from "../../../utils/_project/sabitKiymet";

interface GenelBilgilerProps {
  formik: FormikProps<SabitKiymetForm>;
  yillikAmortisman: number;
  onSubeSec: () => void;
  onSubeTemizle: () => void;
}
export function GenelBilgiler({ formik, yillikAmortisman, onSubeSec, onSubeTemizle }: GenelBilgilerProps) {
  const { values, errors, touched, handleChange, handleBlur } = formik;
  const hata = (alan: keyof SabitKiymetForm) => (touched[alan] ? errors[alan] : undefined);
  return (
    <div className="form-grid">
      <FormField etiket="Ad" htmlFor="ad" zorunlu hata={hata("ad")}>
        <input id="ad" name="ad" className="input" value={values.ad} onChange={handleChange} onBlur={handleBlur} />
      </FormField>

      <FormField etiket="Kategori" htmlFor="kategori">
        <select id="kategori" name="kategori" className="input" value={values.kategori} onChange={handleChange}>
          {KATEGORI_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField etiket="Alış Tarihi" htmlFor="alisTarihi" hata={hata("alisTarihi")}>
        <input
          id="alisTarihi"
          name="alisTarihi"
          type="date"
          className="input"
          value={values.alisTarihi}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </FormField>
      <FormField etiket="Alış Bedeli (₺)" htmlFor="alisBedeli" zorunlu hata={hata("alisBedeli")}>       <input
          id="alisBedeli"
          name="alisBedeli"
          type="number"
          min="0"
          step="0.01"
          className="input"
          value={values.alisBedeli}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </FormField>

      <FormField etiket="Amortisman Oranı (% / yıl)" htmlFor="amortismanOrani" hata={hata("amortismanOrani")}>
        <input
          id="amortismanOrani"
          name="amortismanOrani"
          type="number"
          min="0"
          max="100"
          step="0.01"
          className="input"
          value={values.amortismanOrani}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </FormField>

      <FormField etiket="Yıllık Amortisman" htmlFor="yillikAmortisman" yardim="Alış bedeli × oran — otomatik hesaplanır">
        <output id="yillikAmortisman" className="input input--readonly" data-testid="yillik-amortisman">
          {formatPara(yillikAmortisman)}
        </output>
      </FormField>

      <FormField etiket="Durum" htmlFor="durum">
        <select id="durum" name="durum" className="input" value={values.durum} onChange={handleChange}>
          {DURUM_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField etiket="Şube" htmlFor="subeAdi">
        <div className="sube-picker">
          <input
            id="subeAdi"
            className="input input--readonly"
            value={values.subeAdi}
            placeholder="Şube seçilmedi"
            readOnly
            onClick={onSubeSec}
          />
          <button type="button" className="btn" onClick={onSubeSec}>
            Seç
          </button>
          {values.subeId !== 0 && (
            <button type="button" className="btn btn--ghost" onClick={onSubeTemizle} aria-label="Şubeyi temizle">
              × 
            </button>
          )}
        </div>
      </FormField>
    </div>
  );
}
