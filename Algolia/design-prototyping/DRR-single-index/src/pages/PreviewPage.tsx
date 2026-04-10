import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ComparisonQueryToolbar from "../components/ComparisonQueryToolbar";
import ComparisonView from "../components/ComparisonView";
import TestBanner from "../components/TestBanner";
import ConfirmModal from "../components/ConfirmModal";
import DeactivateModal from "../components/DeactivateModal";
import { useDRR } from "../context/DRRContext";

export default function PreviewPage() {
  const navigate = useNavigate();
  const {
    isFirstTimeUser,
    testResult,
    setActiveFlow,
    setIsFirstTimeUser,
    setIsDRRActivated,
  } = useDRR();
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  const handleActivate = () => {
    if (isFirstTimeUser) {
      setShowActivateModal(true);
    } else {
      setIsDRRActivated(true);
    }
  };

  const handleDeactivate = () => {
    setShowDeactivateModal(true);
  };

  const handleCreateTest = () => {
    if (isFirstTimeUser) {
      setActiveFlow("first-time");
      navigate("/create-variant");
    } else {
      setActiveFlow("ab");
      navigate("/create-variant");
    }
  };

  const handleModalSave = () => {
    setShowActivateModal(false);
    setIsFirstTimeUser(false);
    setIsDRRActivated(true);
  };

  const handleModalCreateTest = () => {
    setShowActivateModal(false);
    setActiveFlow("first-time");
    navigate("/create-variant");
  };

  const handleConfirmDeactivate = () => {
    setShowDeactivateModal(false);
    setIsDRRActivated(false);
  };

  return (
    <div className="p-8" style={{ animation: "fadeSlideIn 0.3s ease-out" }}>
      <PageHeader
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
        onCreateTest={handleCreateTest}
      />

      <div className="flex gap-8 mt-6 mb-6 border-b border-border-subtle">
        <button
          type="button"
          className="text-sm font-medium text-primary border-b-2 border-primary -mb-px pb-3 cursor-pointer"
        >
          Explore
        </button>
        <button
          type="button"
          onClick={() => navigate("/settings")}
          className="text-sm font-medium text-subdued pb-3 hover:text-ink cursor-pointer"
        >
          Configure
        </button>
      </div>

      <div className="flex flex-col gap-6">
        <section className="rounded-xl border border-border-subtle bg-bg-surface p-4">
          <div className="space-y-4">
            <header>
              <h2 className="text-lg font-semibold text-ink tracking-tight">Preview a query</h2>
              <p className="text-sm text-subdued mt-1 max-w-xl leading-5">
                Enter a query to see how results change across ranking configurations.
              </p>
            </header>
            <ComparisonQueryToolbar />
          </div>
        </section>

        {testResult && <TestBanner result={testResult} />}

        <section className="rounded-xl border border-border-subtle bg-bg-surface p-4">
          <div className="space-y-4">
            <header>
              <h2 className="text-lg font-semibold text-ink tracking-tight">Compare ranking outputs</h2>
              <p className="text-sm text-subdued mt-1 max-w-xl leading-5">
                Compare how this query ranks results across your selected configurations.
              </p>
            </header>
            <ComparisonView />
          </div>
        </section>
      </div>

      <ConfirmModal
        open={showActivateModal}
        title="You are updating live ranking"
        message="Activating dynamic re-ranking will change your live results straight away."
        secondaryMessage="We recommend running an A/B test first, so you can confirm the impact on clicks and conversion before it goes live."
        onCancel={() => setShowActivateModal(false)}
        onCreateTest={handleModalCreateTest}
        onSave={handleModalSave}
      />

      <DeactivateModal
        open={showDeactivateModal}
        onCancel={() => setShowDeactivateModal(false)}
        onConfirm={handleConfirmDeactivate}
      />
    </div>
  );
}
