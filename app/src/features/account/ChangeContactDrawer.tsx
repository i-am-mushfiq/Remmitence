import { useState } from "react";
import { Drawer } from "../../components/ui/Drawer";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { OTPInput } from "../../components/ui/OTPInput";
import { useStore } from "../../store/useStore";
import { useToast } from "../../components/ui/Toast";

export function ChangeContactDrawer({ target, onClose }: { target: "mobile" | "email" | null; onClose: () => void }) {
  const updateUser = useStore((s) => s.updateUser);
  const { push } = useToast();
  const [stage, setStage] = useState<"input" | "otp">("input");
  const [value, setValue] = useState("");

  const close = () => {
    onClose();
    setTimeout(() => {
      setStage("input");
      setValue("");
    }, 300);
  };

  const handleVerified = () => {
    if (target === "mobile") updateUser({ mobileNumber: `+60 ${value}` });
    if (target === "email") updateUser({ email: value });
    push({ variant: "success", title: target === "mobile" ? "Mobile number updated" : "Email address updated" });
    close();
  };

  return (
    <Drawer open={!!target} onClose={close} title={target === "mobile" ? "Change Mobile Number" : "Change Email Address"}>
      {stage === "input" ? (
        <div className="space-y-4">
          <Input
            label={target === "mobile" ? "New Malaysian mobile number" : "New email address"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={target === "mobile" ? "11-2345 6789" : "you@example.com"}
          />
          <Button fullWidth disabled={!value} onClick={() => setStage("otp")}>
            Send Verification Code
          </Button>
        </div>
      ) : (
        <div>
          <p className="mb-5 text-small text-[var(--color-text-secondary)]">
            Enter the code sent to {target === "mobile" ? `+60 ${value}` : value}. For mobile changes, we also verify your current number.
          </p>
          <OTPInput onComplete={(code) => /^\d{6}$/.test(code) && handleVerified()} />
        </div>
      )}
    </Drawer>
  );
}
