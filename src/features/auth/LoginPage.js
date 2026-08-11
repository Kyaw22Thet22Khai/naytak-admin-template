import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Checkbox,
  Input,
  PasswordInput,
  Stack,
  useToast,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { AuthLayout } from "./AuthLayout";
import { ROUTES } from "../../app/routes";

export function LoginPage() {
  useDocumentTitle("Sign in");
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const setField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.password) {
      toast.error("Please enter your password");
      return;
    }
    toast.success("Signed in successfully");
    navigate(ROUTES.dashboard);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to={ROUTES.register}>Create one</Link>
        </>
      }>
      <form onSubmit={handleSubmit}>
        <Stack direction="column" spacing={14}>
          <Input
            label="Email"
            type="email"
            placeholder="you@naytak.io"
            value={form.email}
            onChange={setField("email")}
            required
          />
          <PasswordInput
            label="Password"
            placeholder="••••••••"
            value={form.password}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, password: value }))
            }
          />
          <Stack direction="row" justify="space-between" align="center">
            <Checkbox
              label="Remember me"
              checked={form.remember}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, remember: e.target.checked }))
              }
            />
            <Link to="#">Forgot password?</Link>
          </Stack>
          <Button type="submit" block>
            Sign in
          </Button>
        </Stack>
      </form>
    </AuthLayout>
  );
}
