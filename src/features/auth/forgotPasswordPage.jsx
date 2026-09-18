import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Button,
  IconArrowLeft,
  IconMailCheck,
  Input,
  Stack,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useForm, buildValidator, required, email } from "../../hooks/useForm";
import { FormField } from "../../components/formField";
import { AuthLayout } from "./authLayout";
import { ROUTES } from "../../app/routes";
import { withNote } from "../../components/titleNote";

const validate = buildValidator({ email: [required("Email"), email] });

/**
 * Password-reset request. With no backend this always reports success — which
 * is also what real products do, so an attacker cannot use the form to learn
 * which addresses have accounts.
 */
export function ForgotPasswordPage() {
  useDocumentTitle("Reset password");
  const [sentTo, setSentTo] = useState(null);

  const form = useForm({
    initialValues: { email: "" },
    validate,
    onSubmit: async (values) => {
      await new Promise((resolve) => setTimeout(resolve, 450));
      setSentTo(values.email.trim());
    },
  });

  return (
    <AuthLayout
      title={withNote(
        sentTo ? "Check your inbox" : "Reset your password",
        sentTo
          ? null
          : "Enter the email on your account and we will send a reset link.",
      )}
      footer={
        <Link to={ROUTES.login}>
          <IconArrowLeft size={14} /> Back to sign in
        </Link>
      }>
      {sentTo ? (
        <Stack direction="column" spacing={14}>
          <Alert
            color="success"
            variant="soft"
            icon={<IconMailCheck size={18} />}>
            If an account exists for <strong>{sentTo}</strong>, a reset link is
            on its way.
          </Alert>
          <Button variant="ghost" block onClick={() => setSentTo(null)}>
            Use a different email
          </Button>
        </Stack>
      ) : (
        <form onSubmit={form.handleSubmit} noValidate>
          <Stack direction="column" spacing={14}>
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
            <Button type="submit" block loading={form.submitting}>
              {form.submitting ? "Sending…" : "Send reset link"}
            </Button>
          </Stack>
        </form>
      )}
    </AuthLayout>
  );
}
