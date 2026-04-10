import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import PreviewPage from "./pages/PreviewPage";
import SettingsPage from "./pages/SettingsPage";
import CreateVariantPage from "./pages/CreateVariantPage";
import PreviewVariantPage from "./pages/PreviewVariantPage";
import SetParametersPage from "./pages/SetParametersPage";
import TestRunningPage from "./pages/TestRunningPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<PreviewPage />} />
        <Route path="preview" element={<PreviewPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="create-variant" element={<CreateVariantPage />} />
        <Route path="preview-variant" element={<PreviewVariantPage />} />
        <Route path="set-parameters" element={<SetParametersPage />} />
        <Route path="test-running" element={<TestRunningPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
