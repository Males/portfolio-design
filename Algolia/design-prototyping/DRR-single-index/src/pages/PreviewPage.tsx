import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ExploreConfigureTabs from "../components/ExploreConfigureTabs";
import ComparisonQueryToolbar from "../components/ComparisonQueryToolbar";
import ComparisonView from "../components/ComparisonView";
import ActiveAbTestBanner from "../components/ActiveAbTestBanner";
import ConfirmModal from "../components/ConfirmModal";
import DeactivateModal from "../components/DeactivateModal";
import { useDRR } from "../context/DRRContext";

export default function PreviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const explorePreviewRef = useRef<HTMLDivElement>(null);
  const {
    isFirstTimeUser,
    setIsFirstTimeUser,
    setIsDRRActivated,
    beginAbTestWizard,
    activeAbTest,
  } = useDRR();
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  useEffect(() => {
    if (location.state?.focusAbTestPreview !== true) return;
    const el = explorePreviewRef.current;
    requestAnimationFrame(() => {
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    navigate(".", { replace: true, state: {} });
  }, [location.state, navigate]);

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

  const handleModalSave = () => {
    setShowActivateModal(false);
    setIsFirstTimeUser(false);
    setIsDRRActivated(true);
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
        onCreateTest={() => {
          beginAbTestWizard();
          navigate("/ab-test/build");
        }}
      />

      {activeAbTest ? (
        <div className="mt-6">
          <ActiveAbTestBanner />
        </div>
      ) : null}

      <ExploreConfigureTabs active="explore" />

      <div ref={explorePreviewRef} className="mt-6 flex flex-col gap-6 scroll-mt-6">
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

        <section className="rounded-xl border border-border-subtle bg-bg-surface p-4">
          <div className="space-y-4">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <div className="min-w-0 sm:max-w-[min(100%,42rem)]">
                <h2 className="text-lg font-semibold text-ink tracking-tight">
                  {activeAbTest ? "Preview test rankings" : "Compare ranking outputs"}
                </h2>
                <p className="text-sm text-subdued mt-1 max-w-xl leading-5">
                  {activeAbTest
                    ? "Side-by-side preview of the first two arms in your running test. Use the selectors to compare other configurations."
                    : "Compare how this query ranks results across your selected configurations."}
                </p>
              </div>
              <button
                type="button"
                className="h-10 shrink-0 self-end px-3 text-sm font-medium text-ink bg-bg-surface border border-border-subtle rounded-lg hover:bg-bg-sidebar cursor-pointer sm:self-start"
              >
                Display preferences
              </button>
            </header>
            <ComparisonView />
          </div>
        </section>
      </div>

      <ConfirmModal
        open={showActivateModal}
        title="You are updating live ranking"
        message="Activating dynamic re-ranking will change your live results straight away."
        secondaryMessage="Review the comparison view on Explore to validate ranking changes before activating."
        onCancel={() => setShowActivateModal(false)}
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
