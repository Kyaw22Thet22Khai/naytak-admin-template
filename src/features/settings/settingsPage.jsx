import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Divider,
  Grid,
  GridItem,
  IconRefreshCw,
  IconSave,
  Input,
  Select,
  Stack,
  Switch,
  Tabs,
  TabPanel,
  Textarea,
  useToast,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useResetDemoData } from "../../app/dataContext";
import { PageHeader } from "../../components/pageHeader";
import { ConfirmButton } from "../../components/confirmButton";
import { FormField } from "../../components/formField";
import { useForm, buildValidator, required, email } from "../../hooks/useForm";
import { APP_NAME } from "../../constants/app";
import { withNote } from "../../components/titleNote";

const TABS = [
  { label: "General", value: "general" },
  { label: "Notifications", value: "notifications" },
  { label: "Data", value: "data" },
];

const TIMEZONE_OPTIONS = [
  { label: "(UTC-08:00) Pacific Time", value: "America/Los_Angeles" },
  { label: "(UTC-05:00) Eastern Time", value: "America/New_York" },
  { label: "(UTC+00:00) London", value: "Europe/London" },
  { label: "(UTC+01:00) Berlin", value: "Europe/Berlin" },
  { label: "(UTC+05:30) Mumbai", value: "Asia/Kolkata" },
  { label: "(UTC+06:30) Yangon", value: "Asia/Yangon" },
  { label: "(UTC+08:00) Singapore", value: "Asia/Singapore" },
];

const DIGEST_OPTIONS = [
  { label: "Real time", value: "realtime" },
  { label: "Daily digest", value: "daily" },
  { label: "Weekly digest", value: "weekly" },
];

const DEFAULT_GENERAL = {
  appName: APP_NAME,
  supportEmail: "support@naytak.io",
  description: "Internal admin panel for the Naytak store.",
  timezone: "America/New_York",
};

const DEFAULT_NOTIFICATIONS = {
  email: true,
  push: false,
  sms: true,
  digest: "daily",
};

const generalValidator = buildValidator({
  appName: [required("App name")],
  supportEmail: [required("Support email"), email],
});

export function SettingsPage() {
  useDocumentTitle("Settings");
  const toast = useToast();
  const resetDemoData = useResetDemoData();

  // Saved settings really persist now — "Save changes" used to fire a success
  // toast and throw the values away on the next reload.
  const [savedGeneral, setSavedGeneral] = useLocalStorage(
    "settings:general",
    DEFAULT_GENERAL,
  );
  const [notifications, setNotifications] = useLocalStorage(
    "settings:notifications",
    DEFAULT_NOTIFICATIONS,
  );
  const [justSaved, setJustSaved] = useState(false);

  const general = useForm({
    initialValues: savedGeneral,
    validate: generalValidator,
    onSubmit: async (values) => {
      setSavedGeneral(values);
      setJustSaved(true);
      toast.success("Settings saved");
    },
  });

  // Notification switches save as they are flipped — there is nothing to
  // validate, so an extra Save button would only be a step to forget.
  const setNotification = (field) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setNotifications((prev) => ({ ...prev, [field]: value }));
    toast.success("Notification preferences saved");
  };

  const handleResetData = () => {
    resetDemoData();
    toast.success("Demo data restored");
  };

  const isDirty =
    JSON.stringify(general.values) !== JSON.stringify(savedGeneral);

  return (
    <Grid container fluid>
      <GridItem xs={12} spacing={2} className="mb-3">
        <PageHeader
          title={withNote("Settings", "Configure your workspace preferences")}
          actions={
            <Button
              size="sm"
              type="submit"
              form="general-settings-form"
              disabled={!isDirty}
              loading={general.submitting}
              leftIcon={<IconSave size={16} />}>
              {isDirty ? "Save changes" : "Saved"}
            </Button>
          }
        />
      </GridItem>

      <GridItem xs={12} spacing={2}>
        <Tabs items={TABS} defaultValue="general">
          <TabPanel value="general">
            <Card title={withNote("General", "Basic workspace information")}>
              <form
                id="general-settings-form"
                onSubmit={general.handleSubmit}
                noValidate>
                <Stack direction="column" spacing={16}>
                  {justSaved && !isDirty && (
                    <Alert
                      color="success"
                      variant="soft"
                      dismissible
                      onDismiss={() => setJustSaved(false)}>
                      Your settings are saved in this browser and will be here
                      when you come back.
                    </Alert>
                  )}

                  <Stack direction="row" spacing={12} wrap>
                    <FormField
                      error={general.errors.appName}
                      className="field-grow">
                      <Input
                        id="appName"
                        name="appName"
                        label="App name"
                        value={general.values.appName}
                        onChange={general.handleChange("appName")}
                        onBlur={general.handleBlur("appName")}
                      />
                    </FormField>
                    <FormField
                      error={general.errors.supportEmail}
                      className="field-grow">
                      <Input
                        id="supportEmail"
                        name="supportEmail"
                        label="Support email"
                        type="email"
                        value={general.values.supportEmail}
                        onChange={general.handleChange("supportEmail")}
                        onBlur={general.handleBlur("supportEmail")}
                      />
                    </FormField>
                  </Stack>

                  <Textarea
                    label="Description"
                    aria-label="Description"
                    value={general.values.description}
                    onChange={general.handleChange("description")}
                    rows={3}
                    helperText="Shown on the sign-in screen and notification emails."
                  />

                  <Select
                    label="Timezone"
                    aria-label="Timezone"
                    value={general.values.timezone}
                    onChange={general.handleChange("timezone")}
                    options={TIMEZONE_OPTIONS}
                  />
                </Stack>
              </form>
            </Card>
          </TabPanel>

          <TabPanel value="notifications">
            <Card
              title={withNote(
                "Notifications",
                "Choose how you get notified — changes save immediately",
              )}>
              <Stack direction="column" spacing={16}>
                <Switch
                  label="Email notifications"
                  checked={notifications.email}
                  onChange={setNotification("email")}
                />
                <Switch
                  label="Push notifications"
                  checked={notifications.push}
                  onChange={setNotification("push")}
                />
                <Switch
                  label="SMS alerts for critical issues"
                  checked={notifications.sms}
                  onChange={setNotification("sms")}
                />
                <Divider spacing={8} />
                <Select
                  label="Digest frequency"
                  aria-label="Digest frequency"
                  value={notifications.digest}
                  onChange={setNotification("digest")}
                  options={DIGEST_OPTIONS}
                />
              </Stack>
            </Card>
          </TabPanel>

          <TabPanel value="data">
            <Card
              title={withNote(
                "Demo data",
                "Everything you change in this template is stored in your browser",
              )}>
              <Stack direction="column" spacing={16}>
                <Alert color="info" variant="soft">
                  Records you add, edit or delete are saved to this browser’s
                  local storage — no server is involved. Resetting restores the
                  original sample data and discards your changes.
                </Alert>
                <div>
                  <ConfirmButton
                    variant="secondary"
                    icon={<IconRefreshCw size={16} />}
                    label="Reset demo data"
                    title="Reset all demo data?"
                    message="Every record you have added, edited or deleted will be replaced with the original sample data. This one cannot be undone."
                    confirmText="Yes, reset it"
                    cancelText="Keep my changes"
                    onConfirm={handleResetData}
                  />
                </div>
              </Stack>
            </Card>
          </TabPanel>
        </Tabs>
      </GridItem>
    </Grid>
  );
}
