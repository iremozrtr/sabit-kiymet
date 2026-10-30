import { Navigate, Route, Routes } from "react-router-dom";
import { NotificationProvider } from "./components/Notification";
import { SabitKiymetCardPage } from "./features/sabitKiymet/card/SabitKiymetCardPage";
import { SabitKiymetList } from "./features/sabitKiymet/list/SabitKiymetList";
import { ROUTES } from "./routes";

export default function App() {
  return (
    <NotificationProvider>
      <div className="app-bar">
        <strong>Datasoft</strong>
        <span>Sabit Kıymet Yönetimi</span>
      </div>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.liste} replace />} />
        <Route path={ROUTES.liste} element={<SabitKiymetList />} />
        <Route path={ROUTES.yeni} element={<SabitKiymetCardPage />} />
        <Route path="/sabit-kiymet/:id" element={<SabitKiymetCardPage />} />
        <Route path="*" element={<div className="page"><p className="alert alert--error">Sayfa bulunamadı.</p></div>} />
      </Routes>
    </NotificationProvider>
  );
}
