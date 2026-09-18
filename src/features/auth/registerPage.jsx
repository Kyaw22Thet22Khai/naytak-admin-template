import { Link, useNavigate } from "react-router-dom";
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
import {
  useForm,
  buildValidator,
  required,
  email,
  minLength,
} from "../../hooks/useForm";
import { FormField } from "../../components/formField";
import { AuthLayout } from "./authLayout";
import { useAuth } from "../../app/authContext";
import { ROUTES } from "../../app/routes";
import { withNote } from "../../components/titleNote";

const validate = buildValidator({
  name: [required("Full name")],
  email: [required("Email"), email],
  password: [required("Password"), minLength(6, "Password")],
  confirm: [
    required("Password confirmation"),
    (value, values) =>
      value !== values.password ? "Passwords do not match." : undefined,
  ],
  terms: [
    (value) =>
      value ? undefined : "Please accept the Terms & Privacy Policy.",
  ],
});

export function RegisterPage() {
  useDocumentTitle("Create account");
  const navigate = useNavigate();
  const toast = useToast();
  const { signUp } = useAuth();

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
      terms: false,
    },
    validate,
    onSubmit: async (values) => {
      await signUp(values);
      toast.success("Account created. Please sign in.");
      navigate(ROUTES.login, { replace: true });
    },
  });

  return (
    <AuthLayout
      title={withNote("Create account", "Start managing your store in minutes")}
      footer={
        <>
          Already have an account? <Link to={ROUTES.login}>Sign in</Link>
        </>
      }>
      <form onSubmit={form.handleSubmit} noValidate>
        <Stack direction="column" spacing={14}>
          {form.errors.form && (
            <Alert color="danger" variant="soft">
              {form.errors.form}
            </Alert>
          )}

          <FormField error={form.errors.name}>
            <Input
              id="name"
              name="name"
              label="Full name"
              autoComplete="name"
              placeholder="Jane Doe"
              value={form.values.name}
              onChange={form.handleChange("name")}
              onBlur={form.handleBlur("name")}
            />
          </FormField>

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
              autoComplete="new-password"
              placeholder="At least 6 characters"
              value={form.values.password}
              onChange={form.handleValue("password")}
            />
          </FormField>

          <FormField error={form.errors.confirm}>
            <PasswordInput
              id="confirm"
              label="Confirm password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={form.values.confirm}
              onChange={form.handleValue("confirm")}
            />
          </FormField>

          <FormField error={form.errors.terms}>
            <Checkbox
              label="I agree to the Terms & Privacy Policy"
              checked={form.values.terms}
              onChange={form.handleChange("terms")}
            />
          </FormField>

          <Button type="submit" block loading={form.submitting}>
            {form.submitting ? "Creating account…" : "Create account"}
          </Button>
        </Stack>
      </form>
    </AuthLayout>
  );
}
