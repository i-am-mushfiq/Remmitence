import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { Card, CardBody } from "../../components/ui/Card";
import { Stepper } from "../../components/ui/Stepper";
import { useStore } from "../../store/useStore";
import { initialRegisterData, type RegisterFormData } from "./registerTypes";
import { MobileOtpStep } from "./register-steps/MobileOtpStep";
import { PinStep } from "./register-steps/PinStep";
import { IdentityDocStep } from "./register-steps/IdentityDocStep";
import { WorkPermitStep } from "./register-steps/WorkPermitStep";
import { SelfieStep } from "./register-steps/SelfieStep";
import { AddressStep } from "./register-steps/AddressStep";
import { OccupationStep } from "./register-steps/OccupationStep";
import { ReviewStep } from "./register-steps/ReviewStep";
import { VerificationPendingStep } from "./register-steps/VerificationPendingStep";

const STEP_LABELS = ["Mobile", "PIN", "Identity", "Work Permit", "Selfie", "Address", "Income", "Review"];

export default function RegisterFlow() {
  const navigate = useNavigate();
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const approveVerification = useStore((s) => s.approveVerification);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState<RegisterFormData>(initialRegisterData);

  const update = (partial: Partial<RegisterFormData>) => setData((d) => ({ ...d, ...partial }));
  const next = () => setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  const back = () => (step === 0 ? navigate("/login") : setStep((s) => s - 1));

  const handleReviewSubmit = () => {
    completeOnboarding({
      fullName: data.nidName,
      mobileNumber: `+60 ${data.mobileNumber}`,
      nidNumber: data.nidNumber,
      workPermitNumber: data.workPermitNumber,
      workPermitExpiry: new Date(data.workPermitExpiry).toISOString(),
      malaysiaAddress: { line1: data.malaysiaAddressLine, postalCode: data.malaysiaPostcode, country: "Malaysia" },
      bangladeshAddress: {
        line1: data.bangladeshAddressLine,
        division: data.bangladeshDivision,
        district: data.bangladeshDistrict,
        upazila: data.bangladeshUpazila,
        country: "Bangladesh",
      },
      occupation: data.occupation,
      employer: data.employer,
      incomeBand: data.incomeBand,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <VerificationPendingStep
        onApproved={() => {
          approveVerification();
          navigate("/");
        }}
      />
    );
  }

  const steps = [
    <MobileOtpStep key="mobile" data={data} update={update} onNext={next} onBack={back} />,
    <PinStep key="pin" data={data} update={update} onNext={next} onBack={back} />,
    <IdentityDocStep key="identity" data={data} update={update} onNext={next} onBack={back} />,
    <WorkPermitStep key="permit" data={data} update={update} onNext={next} onBack={back} />,
    <SelfieStep key="selfie" data={data} update={update} onNext={next} onBack={back} />,
    <AddressStep key="address" data={data} update={update} onNext={next} onBack={back} />,
    <OccupationStep key="occupation" data={data} update={update} onNext={next} onBack={back} />,
    <ReviewStep key="review" data={data} update={update} onNext={handleReviewSubmit} onBack={back} />,
  ];

  return (
    <AuthLayout wide>
      <div className="mb-6">
        <Stepper steps={STEP_LABELS} current={step} />
      </div>
      <Card>
        <CardBody className="sm:p-7">
          <div key={step} className="animate-fade-in">
            {steps[step]}
          </div>
        </CardBody>
      </Card>
      {step === 0 && (
        <p className="mt-5 text-center text-small text-[var(--color-text-secondary)]">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-[var(--color-primary)] hover:underline">
            Sign in
          </Link>
        </p>
      )}
    </AuthLayout>
  );
}
