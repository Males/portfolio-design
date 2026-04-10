import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ComparisonQueryToolbar from "../components/ComparisonQueryToolbar";
import TestBanner from "../components/TestBanner";
import ComparisonView from "../components/ComparisonView";
import DeactivateModal from "../components/DeactivateModal";
import { useDRR } from "../context/DRRContext";

export default function TestRunningPage() {
  const navigate = useNavigate();
  const { testResult, setActiveFlow, setIsFirstTimeUser, setIsDRRActivated } = useDRR();
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  useEffect(() => {
    if (!testResult) {
      navigate("/");
    } else {
      setIsFirstTimeUser(false);
    }
  }, [testResult, navigate, setIsFirstTimeUser]);

  if (!testResult) return null;

  const handleCreateTest = () => {
    setActiveFlow("ab");
    navigate("/create-variant");
  };

  return (
    <div className="p-8" style={{ animation: "fadeSlideIn 0.3s ease-out" }}>
      <PageHeader
        onActivate={() => setIsDRRActivated(true)}
        onDeactivate={() => setShowDeactivateModal(true)}
        onCreateTest={handleCreateTest}
      />

      <div className="flex gap-6 mt-6 mb-6">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-sm font-medium text-primary border-b-2 border-primary pb-2 cursor-pointer"
        >
          Explore
        </button>
        <button
          type="button"
          onClick={() => navigate("/settings")}
          className="text-sm font-medium text-subdued pb-2 hover:text-ink cursor-pointer"
        >
          Configure
        </button>
      </div>

      <ComparisonQueryToolbar />

      <TestBanner result={testResult} />

      <ComparisonView />

      <DeactivateModal
        open={showDeactivateModal}
        onCancel={() => setShowDeactivateModal(false)}
        onConfirm={() => {
          setShowDeactivateModal(false);
          setIsDRRActivated(false);
        }}
      />
    </div>
  );
}
