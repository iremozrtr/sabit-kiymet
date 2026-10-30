import { AmortismanSatiri, formatPara } from "../../../utils/_project/sabitKiymet";

export function AmortismanRaporu({ satirlar }: { satirlar: AmortismanSatiri[] }) {
  if (satirlar.length === 0) {
    return <p className="empty">Rapor için alış bedeli ve amortisman oranı 0'dan büyük olmalı.</p>;
  }
  return (
    <div className="table-wrap">
      <table className="table table--compact">
        <thead>
          <tr>
            <th>Yıl</th>
            <th className="num">Dönem Amortismanı</th>
            <th className="num">Birikmiş Amortisman</th>
            <th className="num">Net Defter Değeri</th>
          </tr>
        </thead>
        <tbody>
          {satirlar.map((s) => (
            <tr key={s.sira}>
              <td data-label="Yıl">{s.yil ?? `${s.sira}. yıl`}</td>
              <td className="num" data-label="Dönem Amortismanı">{formatPara(s.amortisman)}</td>
              <td className="num" data-label="Birikmiş Amortisman">{formatPara(s.birikmis)}</td>
              <td className="num" data-label="Net Defter Değeri">{formatPara(s.netDeger)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
