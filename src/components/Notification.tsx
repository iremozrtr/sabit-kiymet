import { createContext, ReactNode, useCallback, useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Notification.scss";

type Tur = "success" | "error" | "info";

export interface BildirimGirdisi {
  tur?: Tur;
  mesaj: string;
  link?: { etiket: string; to: string };
}

interface Bildirim extends BildirimGirdisi {
  id: number;
  tur: Tur;
}

const NotificationContext = createContext<(b: BildirimGirdisi) => void>(() => {});

export const useNotification = () => useContext(NotificationContext);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [liste, setListe] = useState<Bildirim[]>([]);
  const sayac = useRef(0);

  const kapat = useCallback((id: number) => setListe((l) => l.filter((b) => b.id !== id)), []);

  const bildir = useCallback(
    (b: BildirimGirdisi) => {
      const id = ++sayac.current;
      setListe((l) => [...l, { ...b, id, tur: b.tur ?? "success" }]);
      window.setTimeout(() => kapat(id), 6000);
    },
    [kapat]
  );

  return (
    <NotificationContext.Provider value={bildir}>
      {children}
      <div className="notif-stack" aria-live="polite">
        {liste.map((b) => (
          <div key={b.id} className={`notif notif--${b.tur}`} role="status">
            <span className="notif__msg">{b.mesaj}</span>
            {b.link && (
              <Link className="notif__link" to={b.link.to} onClick={() => kapat(b.id)}>
                {b.link.etiket}
              </Link>
            )}
            <button className="notif__x" onClick={() => kapat(b.id)} aria-label="Kapat">
              ×
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}