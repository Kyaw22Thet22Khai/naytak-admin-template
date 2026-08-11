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

export function RegisterPage() {
  useDocumentTitle("Create account");
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    terms: false,
  });

  const setField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (!form.terms) {
      toast.error("Please accept the Terms & Privacy Policy");
      return;
    }
    toast.success("Account created. Please sign in.");
    navigate(ROUTES.login);
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Start managing your store in minutes"
      footer={
        <>
          Already have an account? <Link to={ROUTES.login}>Sign in</Link>
        </>
      }>
      <form onSubmit={handleSubmit}>
        <Stack direction="column" spacing={14}>
          <Input
            label="Full name"
            placeholder="Jane Doe"
            value={form.name}
            onChange={setField("name")}
            required
          />
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
            value={form.password}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, password: value }))
            }
          />
          <PasswordInput
            label="Confirm password"
            value={form.confirm}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, confirm: value }))
            }
          />
          <Checkbox
            label="I agree to the Terms & Privacy Policy"
            checked={form.terms}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, terms: e.target.checked }))
            }
          />
          <Button type="submit" block>
            Create account
          </Button>
        </Stack>
      </form>
    </AuthLayout>
  );
}
