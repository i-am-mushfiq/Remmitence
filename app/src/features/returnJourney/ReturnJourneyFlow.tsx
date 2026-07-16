import { PageHeader } from "../../components/ui/PageHeader";
import { Stepper } from "../../components/ui/Stepper";
import { useStore } from "../../store/useStore";
import { DeclareReturnStep } from "./DeclareReturnStep";
import { SettleInstructionsStep } from "./SettleInstructionsStep";
import { FinalReportStep } from "./FinalReportStep";
import { ClosureStep } from "./ClosureStep";

const STAGE_INDEX: Record<string, number> = { not_started: 0, declared: 1, settling: 1, report_ready: 2, closed: 3 };
const STEP_LABELS = ["Declare Return", "Settle Instructions", "Final Report", "Closure"];

export default function ReturnJourneyFlow() {
  const returnJourney = useStore((s) => s.returnJourney);
  const advanceReturnJourney = useStore((s) => s.advanceReturnJourney);

  return (
    <div>
      <PageHeader title="Return-to-Bangladesh Journey" description="Your guided, dignified account closure and consolidation" back="/account" />

      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <Stepper steps={STEP_LABELS} current={STAGE_INDEX[returnJourney.stage]} />
        </div>

        <div className="animate-fade-in">
          {returnJourney.stage === "not_started" && <DeclareReturnStep onDeclared={() => advanceReturnJourney("settling")} />}
          {(returnJourney.stage === "declared" || returnJourney.stage === "settling") && (
            <SettleInstructionsStep onNext={() => advanceReturnJourney("report_ready")} />
          )}
          {returnJourney.stage === "report_ready" && <FinalReportStep onNext={() => advanceReturnJourney("closed")} />}
          {returnJourney.stage === "closed" && <ClosureStep />}
        </div>
      </div>
    </div>
  );
}
