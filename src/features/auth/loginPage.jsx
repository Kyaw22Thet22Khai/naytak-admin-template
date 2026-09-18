import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Checkbox,
  Input,
  PasswordInput,
  Stack,
  useToast,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useForm, buildValidator, required, email } from "../../hooks/useForm";
import { FormField } from "../../components/formField";
import { AuthLayout } from "./authLayout";
import { useAuth } from "../../app/authContext";
import { ROUTES } from "../../app/routes";
import { DEMO_CREDENTIALS } from "../../constants/app";
import { withNote } from "../../components/titleNote";

const validate = buildValidator({
  email: [required("Email"), email],
  password: [required("Password")],
});

export function LoginPage() {
  useDocumentTitle("Sign in");
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { signIn } = useAuth();

  // Where the guard bounced them from, so sign-in returns them there.
  const redirectTo = location.state?.from ?? ROUTES.dashboard;

  const form = useForm({
    initialValues: { email: "", password: "", remember: true },
    validate,
    onSubmit: async (values) => {
      const user = await signIn(values);
      toast.success(`Welcome back, ${user.name}`);
      navigate(redirectTo, { replace: true });
    },
  });

  const fillDemo = () =>
    form.setValues((prev) => ({ ...prev, ...DEMO_CREDENTIALS }));

  return (
    <AuthLayout
      title={withNote("Welcome back", "Sign in to your account to continue")}
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to={ROUTES.register}>Create one</Link>
        </>
      }>
      <form onSubmit={form.handleSubmit} noValidate>
        <Stack direction="column" spacing={14}>
          {form.errors.form && (
            <Alert color="danger" variant="soft">
              {form.errors.form}
            </Alert>
          )}

          <FormField error={form.errors.email}>
            <Input
              id="email"
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@naytak.io"
              value={form.values.email}
              onChange={form.handleChange("email")}
              onBlur={form.handleBlur("email")}
            />
          </FormField>

          <FormField error={form.errors.password}>
            <PasswordInput
              id="password"
              label="Password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.values.password}
              onChange={form.handleValue("password")}
            />
          </FormField>

          <Stack direction="row" justify="space-between" align="center">
            <Checkbox
              label="Remember me"
              checked={form.values.remember}
              onChange={form.handleChange("remember")}
            />
            <Link to={ROUTES.forgotPassword}>Forgot password?</Link>
          </Stack>

          <Button type="submit" block loading={form.submitting}>
            {form.submitting ? "Signing in…" : "Sign in"}
          </Button>

          {/* This template has no backend — spell out the demo account rather
              than leaving visitors to guess at a login that accepts anything. */}
          <Alert color="info" variant="soft">
            <Stack direction="column" spacing={6}>
              <span>
                Demo account: <strong>{DEMO_CREDENTIALS.email}</strong> /{" "}
                <strong>{DEMO_CREDENTIALS.password}</strong>
              </span>
              <span>
                <Button size="sm" variant="ghost" onClick={fillDemo}>
                  Fill demo credentials
                </Button>
              </span>
            </Stack>
          </Alert>
        </Stack>
      </form>
    </AuthLayout>
  );
}
