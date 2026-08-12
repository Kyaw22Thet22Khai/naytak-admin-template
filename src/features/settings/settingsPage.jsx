import { useState } from "react";
import {
  Button,
  Card,
  Divider,
  Grid,
  GridItem,
  IconSave,
  Input,
  PasswordInput,
  Select,
  Stack,
  Switch,
  Tabs,
  TabPanel,
  Textarea,
  useToast,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { PageHeader } from "../../components/pageHeader";

const TABS = [
  { label: "General", value: "general" },
  { label: "Notifications", value: "notifications" },
  { label: "Security", value: "security" },
];

const TIMEZONE_OPTIONS = [
  { label: "(UTC-08:00) Pacific Time", value: "America/Los_Angeles" },
  { label: "(UTC-05:00) Eastern Time", value: "America/New_York" },
  { label: "(UTC+00:00) London", value: "Europe/London" },
  { label: "(UTC+01:00) Berlin", value: "Europe/Berlin" },
  { label: "(UTC+05:30) Mumbai", value: "Asia/Kolkata" },
  { label: "(UTC+08:00) Singapore", value: "Asia/Singapore" },
];

const DIGEST_OPTIONS = [
  { label: "Real time", value: "realtime" },
  { label: "Daily digest", value: "daily" },
  { label: "Weekly digest", value: "weekly" },
];

export function SettingsPage() {
  useDocumentTitle("Settings");
  const toast = useToast();

  const [general, setGeneral] = useState({
    appName: "Naytak Admin",
    supportEmail: "support@naytak.io",
    description: "Internal admin panel for the Naytak store.",
    timezone: "America/New_York",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    digest: "daily",
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    currentPassword: "",
    newPassword: "",
  });

  const setGeneralField = (field) => (e) =>
    setGeneral((prev) => ({ ...prev, [field]: e.target.value }));

  const toggleNotification = (field) => (e) =>
    setNotifications((prev) => ({ ...prev, [field]: e.target.checked }));

  const handleSave = () => {
    toast.success("Settings saved");
  };

  return (
    <Grid container fluid>
      <GridItem xs={12} spacing={2} className="mb-3">
        <PageHeader
          title="Settings"
          subtitle="Configure your workspace preferences"
          actions={
            <Button
              size="sm"
              leftIcon={<IconSave size={16} />}
              onClick={handleSave}>
              Save changes
            </Button>
          }
        />
      </GridItem>

      <GridItem xs={12} spacing={2}>
        <Tabs items={TABS} defaultValue="general">
          <TabPanel value="general">
            <Card title="General" subtitle="Basic workspace information">
              <Stack direction="column" spacing={16}>
                <Stack direction="row" spacing={12} wrap>
                  <div style={{ flex: "1 1 280px" }}>
                    <Input
                      label="App name"
                      value={general.appName}
                      onChange={setGeneralField("appName")}
                    />
                  </div>
                  <div style={{ flex: "1 1 280px" }}>
                    <Input
                      label="Support email"
                      type="email"
                      value={general.supportEmail}
                      onChange={setGeneralField("supportEmail")}
                    />
                  </div>
                </Stack>
                <Textarea
                  label="Description"
                  value={general.description}
                  onChange={setGeneralField("description")}
                  rows={3}
                  helperText="Shown on the sign-in screen and notification emails."
                />
                <Select
                  label="Timezone"
                  value={general.timezone}
                  onChange={setGeneralField("timezone")}
                  options={TIMEZONE_OPTIONS}
                />
              </Stack>
            </Card>
          </TabPanel>

          <TabPanel value="notifications">
            <Card title="Notifications" subtitle="Choose how you get notified">
              <Stack direction="column" spacing={16}>
                <Switch
                  label="Email notifications"
                  checked={notifications.email}
                  onChange={toggleNotification("email")}
                />
                <Switch
                  label="Push notifications"
                  checked={notifications.push}
                  onChange={toggleNotification("push")}
                />
                <Switch
                  label="SMS alerts for critical issues"
                  checked={notifications.sms}
                  onChange={toggleNotification("sms")}
                />
                <Divider spacing={8} />
                <Select
                  label="Digest frequency"
                  value={notifications.digest}
                  onChange={(e) =>
                    setNotifications((prev) => ({
                      ...prev,
                      digest: e.target.value,
                    }))
                  }
                  options={DIGEST_OPTIONS}
                />
              </Stack>
            </Card>
          </TabPanel>

          <TabPanel value="security">
            <Card title="Security" subtitle="Protect your account">
              <Stack direction="column" spacing={16}>
                <Switch
                  label="Two-factor authentication"
                  checked={security.twoFactor}
                  onChange={(e) =>
                    setSecurity((prev) => ({
                      ...prev,
                      twoFactor: e.target.checked,
                    }))
                  }
                />
                <Divider spacing={8} />
                <Stack direction="row" spacing={12} wrap>
                  <div style={{ flex: "1 1 280px" }}>
                    <PasswordInput
                      label="Current password"
                      value={security.currentPassword}
                      onChange={(value) =>
                        setSecurity((prev) => ({
                          ...prev,
                          currentPassword: value,
                        }))
                      }
                      placeholder="••••••••"
                    />
                  </div>
                  <div style={{ flex: "1 1 280px" }}>
                    <PasswordInput
                      label="New password"
                      value={security.newPassword}
                      onChange={(value) =>
                        setSecurity((prev) => ({
                          ...prev,
                          newPassword: value,
                        }))
                      }
                      placeholder="••••••••"
                    />
                  </div>
                </Stack>
                <div>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSecurity((prev) => ({
                        ...prev,
                        currentPassword: "",
                        newPassword: "",
                      }));
                      toast.success("Password updated");
                    }}>
                    Update password
                  </Button>
                </div>
              </Stack>
            </Card>
          </TabPanel>
        </Tabs>
      </GridItem>
    </Grid>
  );
}
