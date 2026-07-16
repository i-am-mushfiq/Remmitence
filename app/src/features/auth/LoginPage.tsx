import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Fingerprint, Lock } from "lucide-react";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { Card, CardBody } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useStore } from "../../store/useStore";
import { useToast } from "../../components/ui/Toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const signIn = useStore((s) => s.signIn);
  const { push } = useToast();
  const [mobile, setMobile] = useState("11-2345 6789");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 6) {
      setError("Enter your 6-digit PIN");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      signIn();
      push({ variant: "success", title: "Welcome back", description: "Signed in successfully." });
      navigate("/");
    }, 900);
  };

  return (
    <AuthLayout>
      <Card>
        <CardBody>
          <h1 className="text-h2 text-[var(--color-text)]">Welcome back</h1>
          <p className="mt-1 text-small text-[var(--color-text-secondary)]">Sign in to manage your remittance, bills and savings.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Malaysian mobile number"
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              leftIcon={<span className="text-small font-medium">+60</span>}
            />
            <Input
              label="PIN"
              required
              type="password"
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              error={error}
              leftIcon={<Lock size={16} />}
            />
            <div className="flex justify-end">
              <Link to="/forgot-pin" className="text-tiny font-semibold text-[var(--color-primary)] hover:underline">
                Forgot PIN?
              </Link>
            </div>
            <Button type="submit" fullWidth size="lg" loading={loading}>
              Sign In
            </Button>
            <Button type="button" variant="secondary" fullWidth icon={<Fingerprint size={18} />} onClick={handleSubmit}>
              Use biometric unlock
            </Button>
          </form>
        </CardBody>
      </Card>

      <div className="mt-5 flex flex-col items-center gap-2 text-center">
        <p className="text-small text-[var(--color-text-secondary)]">
          New to RemmiNext?{" "}
          <Link to="/register" className="font-semibold text-[var(--color-primary)] hover:underline">
            Create an account
          </Link>
        </p>
        <Link to="/recover" className="text-tiny font-medium text-[var(--color-text-secondary)] hover:underline">
          Lost access to your device? Recover account
        </Link>
      </div>
    </AuthLayout>
  );
}
