import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  GridItem,
  IconSave,
  Input,
  PasswordInput,
  Stack,
  Textarea,
  useToast,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { PageHeader } from "../../components/pageHeader";
import { FormField } from "../../components/formField";
import {
  useForm,
  buildValidator,
  required,
  email,
  minLength,
} from "../../hooks/useForm";
import { useAuth } from "../../app/authContext";
import "./profile.css";
import { withNote } from "../../components/titleNote";

const profileValidator = buildValidator({
  name: [required("Name")],
  email: [required("Email"), email],
});

const passwordValidator = buildValidator({
  current: [required("Current password")],
  next: [required("New password"), minLength(6, "New password")],
  confirm: [
    required("Password confirmation"),
    (value, values) =>
      value !== values.next ? "Passwords do not match." : undefined,
  ],
});

/** Account page reached from the navbar profile menu. */
export function ProfilePage() {
  useDocumentTitle("Profile");
  const toast = useToast();
  const { user } = useAuth();

  const details = useForm({
    initialValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      title: "Operations lead",
      bio: "Runs the Naytak storefront and keeps the catalog tidy.",
    },
    validate: profileValidator,
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
      toast.success("Profile updated");
    },
  });

  const password = useForm({
    initialValues: { current: "", next: "", confirm: "" },
    validate: passwordValidator,
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
      password.reset();
      toast.success("Password updated");
    },
  });

  return (
    <Grid container fluid>
      <GridItem xs={12} spacing={2} className="mb-3">
        <PageHeader title={withNote("Profile", "Your account details")} />
      </GridItem>

      <GridItem xs={12} md={4} spacing={2} className="mb-3">
        <Card className="h-100">
          <Stack direction="column" spacing={12} align="center">
            <Avatar size="lg" text={details.values.name || "User"} />
            <div className="profile-identity">
              <div className="profile-identity__name">
                {details.values.name}
              </div>
              <div className="profile-identity__email">
                {details.values.email}
              </div>
            </div>
            <Badge color="primary" variant="soft">
              {user?.role ?? "Member"}
            </Badge>
          </Stack>
        </Card>
      </GridItem>

      <GridItem xs={12} md={8} spacing={2} className="mb-3">
        <Card
          title={withNote("Details", "How you appear across the workspace")}>
          <form onSubmit={details.handleSubmit} noValidate>
            <Stack direction="column" spacing={16}>
              <Stack direction="row" spacing={12} wrap>
                <FormField error={details.errors.name} className="field-grow">
                  <Input
                    id="name"
                    name="name"
                    label="Full name"
                    value={details.values.name}
                    onChange={details.handleChange("name")}
                    onBlur={details.handleBlur("name")}
                  />
                </FormField>
                <FormField error={details.errors.email} className="field-grow">
                  <Input
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
                    value={details.values.email}
                    onChange={details.handleChange("email")}
                    onBlur={details.handleBlur("email")}
                  />
                </FormField>
              </Stack>
              <Input
                label="Job title"
                value={details.values.title}
                onChange={details.handleChange("title")}
              />
              <Textarea
                label="Bio"
                aria-label="Bio"
                rows={3}
                value={details.values.bio}
                onChange={details.handleChange("bio")}
              />
              <div>
                <Button
                  type="submit"
                  size="sm"
                  loading={details.submitting}
                  leftIcon={<IconSave size={16} />}>
                  Save changes
                </Button>
              </div>
            </Stack>
          </form>

          <Divider spacing={20} />

          <form onSubmit={password.handleSubmit} noValidate>
            <Stack direction="column" spacing={16}>
              <h3 className="profile-section-title">Change password</h3>
              <FormField error={password.errors.current}>
                <PasswordInput
                  id="current"
                  label="Current password"
                  autoComplete="current-password"
                  value={password.values.current}
                  onChange={password.handleValue("current")}
                />
              </FormField>
              <Stack direction="row" spacing={12} wrap>
                <FormField error={password.errors.next} className="field-grow">
                  <PasswordInput
                    id="next"
                    label="New password"
                    autoComplete="new-password"
                    value={password.values.next}
                    onChange={password.handleValue("next")}
                  />
                </FormField>
                <FormField
                  error={password.errors.confirm}
                  className="field-grow">
                  <PasswordInput
                    id="confirm"
                    label="Confirm new password"
                    autoComplete="new-password"
                    value={password.values.confirm}
                    onChange={password.handleValue("confirm")}
                  />
                </FormField>
              </Stack>
              <div>
                <Button
                  type="submit"
                  size="sm"
                  variant="secondary"
                  loading={password.submitting}>
                  Update password
                </Button>
              </div>
            </Stack>
          </form>
        </Card>
      </GridItem>
    </Grid>
  );
}
