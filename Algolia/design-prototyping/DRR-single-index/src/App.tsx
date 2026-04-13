import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import PreviewPage from "./pages/PreviewPage";
import SettingsPage from "./pages/SettingsPage";
import AbTestSelectVariationsPage from "./pages/AbTestSelectVariationsPage";
import AbTestTrafficDurationPage from "./pages/AbTestTrafficDurationPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<PreviewPage />} />
        <Route path="preview" element={<PreviewPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="ab-test/variations" element={<AbTestSelectVariationsPage />} />
        <Route path="ab-test/traffic" element={<AbTestTrafficDurationPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
