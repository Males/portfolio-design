import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import PreviewPage from "./pages/PreviewPage";
import SettingsPage from "./pages/SettingsPage";
import AbTestBuildPage from "./pages/AbTestBuildPage";
import AbTestConfigurePage from "./pages/AbTestConfigurePage";
import AbTestReviewPage from "./pages/AbTestReviewPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<PreviewPage />} />
        <Route path="preview" element={<PreviewPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="ab-test/build" element={<AbTestBuildPage />} />
        <Route path="ab-test/configure" element={<AbTestConfigurePage />} />
        <Route path="ab-test/review" element={<AbTestReviewPage />} />
        <Route path="ab-test/variations" element={<Navigate to="/ab-test/build" replace />} />
        <Route path="ab-test/test-type" element={<Navigate to="/ab-test/build" replace />} />
        <Route path="ab-test/traffic" element={<Navigate to="/ab-test/configure" replace />} />
        <Route path="ab-test" element={<Navigate to="/ab-test/build" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
