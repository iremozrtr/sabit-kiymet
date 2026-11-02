import { Link, useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../../routes";
import { SabitKiymetCard } from "./SabitKiymetCard";

export function SabitKiymetCardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const geriListeye = () => navigate(ROUTES.liste);

  const sayisalId = id === undefined ? undefined : Number(id);
  if (sayisalId !== undefined && !Number.isInteger(sayisalId)) {
    return (
      <div className="page">
        <p className="alert alert--error">Geçersiz kayıt numarası.</p>
        <Link to={ROUTES.liste}>Listeye dön</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <Link to={ROUTES.liste} className="back-link">← Sabit Kıymetler</Link>
      <SabitKiymetCard id={sayisalId} onSaved={geriListeye} onDeleted={geriListeye} onCancel={geriListeye} />
    </div>
  );
}
