import { useState } from "react";
import { Phone } from "lucide-react";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { OTPInput } from "../../../components/ui/OTPInput";
import type { StepProps } from "../registerTypes";

export function MobileOtpStep({ data, update, onNext }: StepProps) {
  const [stage, setStage] = useState<"mobile" | "otp">(data.mobileNumber ? "otp" : "mobile");
  const [sending, setSending] = useState(false);
  const [otpError, setOtpError] = useState("");

  const sendOtp = () => {
    if (data.mobileNumber.replace(/\D/g, "").length < 9) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setStage("otp");
    }, 800);
  };

  const verifyOtp = (code: string) => {
    if (code === "000000" || /^\d{6}$/.test(code)) {
      setOtpError("");
      update({ otpVerified: true });
      setTimeout(onNext, 300);
    } else {
      setOtpError("Invalid code, please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-h2 text-[var(--color-text)]">
        {stage === "mobile" ? "Enter your mobile number" : "Verify your number"}
      </h2>
      <p className="mt-1 text-small text-[var(--color-text-secondary)]">
        {stage === "mobile"
          ? "We'll send a one-time code to verify your Malaysian mobile number."
          : `Enter the 6-digit code sent to +60 ${data.mobileNumber}`}
      </p>

      {stage === "mobile" ? (
        <div className="mt-6 space-y-5">
          <Input
            label="Malaysian mobile number"
            required
            placeholder="11-2345 6789"
            value={data.mobileNumber}
            onChange={(e) => update({ mobileNumber: e.target.value })}
            leftIcon={<Phone size={16} />}
          />
          <Button fullWidth size="lg" loading={sending} onClick={sendOtp} disabled={data.mobileNumber.replace(/\D/g, "").length < 9}>
            Send OTP
          </Button>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          <OTPInput onComplete={verifyOtp} error={otpError} />
          <p className="text-tiny text-[var(--color-text-secondary)]">
            Didn't get a code?{" "}
            <button onClick={sendOtp} className="font-semibold text-[var(--color-primary)] hover:underline">
              Resend
            </button>
          </p>
          <p className="text-tiny text-slate-400">Demo tip: any 6 digits will verify.</p>
        </div>
      )}
    </div>
  );
}
