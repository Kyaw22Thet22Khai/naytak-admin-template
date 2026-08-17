import { useState } from "react";
import {
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  BarChart,
  Box,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  Divider,
  Drawer,
  DropdownMenu,
  EmptyState,
  Grid,
  GridItem,
  IconAlertCircle,
  IconBell,
  IconCheck,
  IconEdit,
  IconGrid,
  IconList,
  IconMail,
  IconMapPin,
  IconMenu,
  IconPlus,
  IconSearch,
  IconShare,
  IconTrash,
  IconUser,
  Input,
  Kbd,
  List,
  ListItem,
  Modal,
  NotchedInput,
  NotchedSelect,
  Popover,
  Progress,
  Radio,
  RadarChart,
  ScatterChart,
  SearchInput,
  SearchSelect,
  SegmentedControl,
  Select,
  Skeleton,
  Slider,
  Snackbar,
  Spinner,
  Stack,
  StackedBarChart,
  StatusDot,
  Switch,
  Table,
  TableBody,
  TableHead,
  TablePagination,
  Tabs,
  TabPanel,
  Tag,
  Textarea,
  Tooltip,
  useToast,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { PageHeader } from "../../components/pageHeader";
import "./components.css";

/** Live demo of the UI components available in naytak-react-ui. */
export function ComponentsPage() {
  useDocumentTitle("Components");
  const toast = useToast();

  // Interactive demo state.
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [segValue, setSegValue] = useState("preview");
  const [sliderValue, setSliderValue] = useState(60);
  const [switchOn, setSwitchOn] = useState(true);
  const [terms, setTerms] = useState(false);
  const [plan, setPlan] = useState("free");
  const [query, setQuery] = useState("");
  const [comment, setComment] = useState("");
  const [tags, setTags] = useState(["React", "TypeScript", "UI"]);
  const [badges, setBadges] = useState(["New", "Hot"]);

  return (
    <Grid container fluid>
      <GridItem xs={12} spacing={2} className="mb-3">
        <PageHeader
          title="Components"
          subtitle="A live showcase of the naytak-react-ui components"
        />
      </GridItem>

      {/* ---------------------------------------------------------------- */}
      {/* Buttons */}
      {/* ---------------------------------------------------------------- */}
      <GridItem xs={12} spacing={2} className="mb-2">
        <Card title="Buttons" subtitle="Variants, sizes and states">
          <Stack
            direction="row"
            spacing={8}
            wrap
            align="center"
            className="mb-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="info">Info</Button>
            <Button variant="dark">Dark</Button>
            <Button variant="light">Light</Button>
          </Stack>

          <Stack
            direction="row"
            spacing={8}
            wrap
            align="center"
            className="mb-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button outlined>Outlined</Button>
            <Button variant="danger" outlined>
              Danger outline
            </Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </Stack>

          <Stack
            direction="row"
            spacing={8}
            wrap
            align="center"
            className="mb-3">
            <Button leftIcon={<IconPlus size={16} />}>Add item</Button>
            <Button variant="ghost" leftIcon={<IconEdit size={16} />}>
              Edit
            </Button>
            <Button variant="danger" rightIcon={<IconTrash size={16} />}>
              Delete
            </Button>
            <Button
              variant="ghost"
              radius="full"
              leftIcon={<IconSearch size={16} />}>
              Rounded
            </Button>
          </Stack>

          <Button block>Block button</Button>
        </Card>
      </GridItem>

      <GridItem xs={12} spacing={2} className="mb-2">
        <Card title="Button Group" subtitle="Grouped actions">
          <Grid container>
            <GridItem xs={12} md={6} spacing={2}>
              <div className="components-label mb-1">Horizontal</div>
              <ButtonGroup aria-label="View mode">
                <Button size="sm">Day</Button>
                <Button size="sm">Week</Button>
                <Button size="sm">Month</Button>
              </ButtonGroup>
            </GridItem>
            <GridItem xs={12} md={6} spacing={2}>
              <div className="components-label mb-1">Vertical</div>
              <ButtonGroup aria-label="Clipboard actions" vertical>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<IconList size={14} />}>
                  Copy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<IconGrid size={14} />}>
                  Cut
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<IconCheck size={14} />}>
                  Paste
                </Button>
              </ButtonGroup>
            </GridItem>
          </Grid>
        </Card>
      </GridItem>

      {/* ---------------------------------------------------------------- */}
      {/* Badges */}
      {/* ---------------------------------------------------------------- */}
      <GridItem xs={12} spacing={2} className="mb-2">
        <Card title="Badges" subtitle="Colors and variants">
          <Stack
            direction="row"
            spacing={8}
            wrap
            align="center"
            className="mb-3">
            <Badge color="primary">Primary</Badge>
            <Badge color="secondary">Secondary</Badge>
            <Badge color="success">Success</Badge>
            <Badge color="warning">Warning</Badge>
            <Badge color="danger">Danger</Badge>
            <Badge color="info">Info</Badge>
            <Badge color="dark">Dark</Badge>
            <Badge color="light">Light</Badge>
          </Stack>

          <Stack
            direction="row"
            spacing={8}
            wrap
            align="center"
            className="mb-3">
            <Badge variant="pill">Pill</Badge>
            <Badge variant="outline" color="success">
              Outline
            </Badge>
            <Badge variant="dot" color="success">
              Online
            </Badge>
            <Badge leftIcon={<IconBell size={12} />} color="info">
              With icon
            </Badge>
            <Badge
              variant="pill"
              color="warning"
              removable
              onRemove={() => toast.info("Badge removed")}>
              Removable
            </Badge>
          </Stack>

          <Stack direction="row" spacing={8} wrap align="center">
            {badges.length > 0 ? (
              badges.map((badge) => (
                <Badge
                  key={badge}
                  variant="pill"
                  color="primary"
                  removable
                  onRemove={() =>
                    setBadges((prev) => prev.filter((b) => b !== badge))
                  }>
                  {badge}
                </Badge>
              ))
            ) : (
              <span className="components-muted">
                All badges removed — reset below.
              </span>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setBadges(["New", "Hot"])}>
              Reset
            </Button>
          </Stack>
        </Card>
      </GridItem>

      {/* ---------------------------------------------------------------- */}
      {/* Tags */}
      {/* ---------------------------------------------------------------- */}
      <GridItem xs={12} spacing={2} className="mb-2">
        <Card title="Tags" subtitle="Labels, filters and removable chips">
          <Stack
            direction="row"
            spacing={8}
            wrap
            align="center"
            className="mb-3">
            <Tag color="primary">Primary</Tag>
            <Tag color="success">Success</Tag>
            <Tag color="warning">Warning</Tag>
            <Tag color="danger">Danger</Tag>
            <Tag color="info">Info</Tag>
            <Tag color="dark">Dark</Tag>
          </Stack>

          <Stack
            direction="row"
            spacing={8}
            wrap
            align="center"
            className="mb-3">
            <Tag variant="outline">Outline</Tag>
            <Tag variant="soft" color="primary">
              Soft
            </Tag>
            <Tag variant="soft" color="success" icon={<IconMapPin size={12} />}>
              With icon
            </Tag>
          </Stack>

          <Stack direction="row" spacing={8} wrap align="center">
            {tags.map((tag) => (
              <Tag
                key={tag}
                variant="filled"
                removable
                onRemove={() =>
                  setTags((prev) => prev.filter((t) => t !== tag))
                }>
                {tag}
              </Tag>
            ))}
            <Tag
              variant="outline"
              selectable
              onChange={(selected) =>
                toast.info(`Selectable tag → ${selected ? "on" : "off"}`)
              }>
              Selectable
            </Tag>
          </Stack>
        </Card>
      </GridItem>

      {/* ---------------------------------------------------------------- */}
      {/* Alerts */}
      {/* ---------------------------------------------------------------- */}
      <GridItem xs={12} spacing={2} className="mb-2">
        <Card title="Alerts" subtitle="Feedback messages">
          <Grid container>
            <GridItem xs={12} md={6} spacing={2} className="mb-2">
              <Alert
                color="success"
                title="Success"
                icon={<IconCheck size={16} />}
                dismissible
                onDismiss={() => toast.info("Alert dismissed")}>
                Operation completed successfully.
              </Alert>
            </GridItem>
            <GridItem xs={12} md={6} spacing={2} className="mb-2">
              <Alert
                color="info"
                variant="soft"
                title="Information"
                icon={<IconAlertCircle size={16} />}>
                A new software update is available.
              </Alert>
            </GridItem>
            <GridItem xs={12} md={6} spacing={2} className="mb-2">
              <Alert color="warning" variant="outline" title="Warning">
                Your session expires in 10 minutes.
              </Alert>
            </GridItem>
            <GridItem xs={12} md={6} spacing={2}>
              <Alert color="danger" variant="soft">
                Something went wrong. Please try again.
              </Alert>
            </GridItem>
          </Grid>
        </Card>
      </GridItem>

      {/* ---------------------------------------------------------------- */}
      {/* Avatars */}
      {/* ---------------------------------------------------------------- */}
      <GridItem xs={12} spacing={2} className="mb-2">
        <Card title="Avatars" subtitle="Sizes, colors and groups">
          <Stack
            direction="row"
            spacing={16}
            wrap
            align="center"
            className="mb-3">
            <Avatar size="sm" text="Alice Johnson" color="primary" />
            <Avatar size="md" text="Bob Smith" color="success" />
            <Avatar size="lg" text="Carol Nguyen" color="danger" />
          </Stack>

          <Stack
            direction="row"
            spacing={16}
            wrap
            align="center"
            className="mb-3">
            <Avatar
              image="https://i.pravatar.cc/80?img=12"
              alt="User photo"
              size="lg"
            />
            <Avatar text="DE" status />
            <Avatar text="FG" color="warning" status statusColor="#f59e0b" />
          </Stack>

          <div>
            <AvatarGroup max={4}>
              <Avatar size="sm" text="Alice Johnson" color="primary" />
              <Avatar size="sm" text="Bob Smith" color="success" />
              <Avatar size="sm" text="Carol Nguyen" color="warning" />
              <Avatar size="sm" text="David Lee" color="danger" />
              <Avatar size="sm" text="Emma Wilson" color="info" />
            </AvatarGroup>
          </div>
        </Card>
      </GridItem>

      {/* ---------------------------------------------------------------- */}
      {/* Status & Progress */}
      {/* ---------------------------------------------------------------- */}
      <GridItem xs={12} spacing={2} className="mb-2">
        <Card title="Status & Progress" subtitle="Indicators and loading bars">
          <Grid container>
            <GridItem xs={12} md={6} spacing={2}>
              <div className="components-label mb-2">Status Dot</div>
              <Stack direction="row" spacing={18} wrap align="center">
                <StatusDot tone="success" label="Online" />
                <StatusDot tone="warning" label="Away" />
                <StatusDot tone="danger" label="Offline" />
                <StatusDot tone="info" label="Info" />
                <StatusDot tone="neutral" label="Neutral" />
                <StatusDot tone="success" pulse label="Live" />
              </Stack>
            </GridItem>
            <GridItem xs={12} md={6} spacing={2}>
              <div className="components-label mb-2">Progress</div>
              <Stack direction="column" spacing={10} className="mb-3">
                <div>
                  <div className="components-label">Primary · 75%</div>
                  <Progress value={75} color="primary" />
                </div>
                <div>
                  <div className="components-label">Success · 60%</div>
                  <Progress value={60} color="success" />
                </div>
                <div>
                  <div className="components-label">Warning · 40%</div>
                  <Progress value={40} color="warning" />
                </div>
                <div>
                  <div className="components-label">Danger · 25%</div>
                  <Progress value={25} color="danger" />
                </div>
              </Stack>
              <Stack direction="row" spacing={24} wrap align="center">
                <div className="components-circular">
                  <Progress
                    value={72}
                    type="circular"
                    size={84}
                    color="primary"
                  />
                  <span className="components-circular__label">72%</span>
                </div>
                <div className="components-circular">
                  <Progress
                    value={45}
                    type="circular"
                    size={84}
                    color="success"
                  />
                  <span className="components-circular__label">45%</span>
                </div>
              </Stack>
            </GridItem>
          </Grid>
        </Card>
      </GridItem>

      {/* ---------------------------------------------------------------- */}
      {/* Feedback */}
      {/* ---------------------------------------------------------------- */}
      <GridItem xs={12} spacing={2} className="mb-2">
        <Card title="Feedback" subtitle="Spinners, skeletons and empty states">
          <Stack
            direction="row"
            spacing={18}
            wrap
            align="center"
            className="mb-4">
            <Spinner size="sm" />
            <Spinner size="md" color="primary" />
            <Spinner size="lg" color="success" />
          </Stack>

          <Stack direction="column" spacing={8} className="mb-4">
            <Skeleton variant="text" width="60%" height={16} />
            <Skeleton variant="text" width="40%" height={16} />
            <Stack direction="row" spacing={12} align="center">
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="rectangular" width={220} height={12} />
            </Stack>
            <Skeleton variant="rounded" lines={2} lastLineWidth="70%" />
          </Stack>

          <EmptyState
            size="sm"
            icon={<IconMail size={28} />}
            title="No messages"
            description="Your inbox is empty — check back later."
            action={<Button size="sm">Compose</Button>}
          />
        </Card>
      </GridItem>

      {/* ---------------------------------------------------------------- */}
      {/* Form controls */}
      {/* ---------------------------------------------------------------- */}
      <GridItem xs={12} spacing={2} className="mb-2">
        <Card title="Form Controls" subtitle="Inputs, selects and toggles">
          <Grid container>
            <GridItem xs={12} md={6} spacing={2} className="mb-3">
              <Input label="Full name" placeholder="Alice Johnson" />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                className="mt-2"
                iconStart={<IconMail size={16} />}
              />
              <NotchedInput
                label="Username"
                placeholder="alice_99"
                className="mt-2"
              />
              <SearchInput
                label="Search"
                placeholder="Search anything…"
                className="mt-2"
                value={query}
                onChange={setQuery}
                clearable
              />
            </GridItem>

            <GridItem xs={12} md={6} spacing={2} className="mb-3">
              <Select
                label="Country"
                options={[
                  { label: "United States", value: "us" },
                  { label: "Germany", value: "de" },
                  { label: "Japan", value: "jp" },
                ]}
              />
              <NotchedSelect label="Role" className="mt-2">
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </NotchedSelect>
              <SearchSelect
                label="Project"
                className="mt-2"
                placeholder="Pick a project…"
                clearable
                options={[
                  { label: "Naytak Admin", value: "naytak" },
                  { label: "Landing Page", value: "landing" },
                  { label: "Mobile App", value: "mobile" },
                ]}
              />
              <Textarea
                label="Message"
                placeholder="Write something…"
                className="mt-2"
                autoResize
                maxLength={120}
                characterCount
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </GridItem>
          </Grid>

          <Divider spacing={16} className="mb-3" />

          <Stack direction="row" spacing={24} wrap className="mb-3">
            <Checkbox
              label="Remember me"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
            />
            <Switch
              label="Enable notifications"
              checked={switchOn}
              onChange={(e) => setSwitchOn(e.target.checked)}
            />
            <Radio
              name="plan"
              label="Free"
              value="free"
              checked={plan === "free"}
              onChange={(e) => setPlan(e.target.value)}
            />
            <Radio
              name="plan"
              label="Pro"
              value="pro"
              checked={plan === "pro"}
              onChange={(e) => setPlan(e.target.value)}
            />
          </Stack>

          <Slider
            label="Volume"
            min={0}
            max={100}
            step={5}
            value={sliderValue}
            onChange={setSliderValue}
            marks={[
              { value: 0, label: "0" },
              { value: 50, label: "50" },
              { value: 100, label: "100" },
            ]}
          />
        </Card>
      </GridItem>

      {/* ---------------------------------------------------------------- */}
      {/* Segmented control + Tabs */}
      {/* ---------------------------------------------------------------- */}
      <GridItem xs={12} spacing={2} className="mb-2">
        <Card
          title="Segmented Control & Tabs"
          subtitle="Switch between options">
          <Grid container>
            <GridItem xs={12} md={6} spacing={2}>
              <div className="components-label mb-2">Segmented Control</div>
              <Stack direction="column" spacing={14}>
                <SegmentedControl
                  options={[
                    { value: "preview", label: "Preview" },
                    { value: "code", label: "Code" },
                    { value: "split", label: "Split" },
                  ]}
                  value={segValue}
                  onChange={setSegValue}
                />
                <SegmentedControl
                  size="sm"
                  block
                  options={[
                    {
                      value: "list",
                      label: "List",
                      icon: <IconList size={14} />,
                    },
                    {
                      value: "grid",
                      label: "Grid",
                      icon: <IconGrid size={14} />,
                    },
                  ]}
                  defaultValue="list"
                />
              </Stack>
            </GridItem>
            <GridItem xs={12} md={6} spacing={2}>
              <div className="components-label mb-2">Tabs</div>
              <Tabs
                items={[
                  { label: "Overview", value: "overview" },
                  { label: "Activity", value: "activity" },
                  { label: "Settings", value: "settings" },
                ]}
                defaultValue="overview">
                <TabPanel value="overview">
                  <p className="components-muted">Overview tab content…</p>
                </TabPanel>
                <TabPanel value="activity">
                  <p className="components-muted">Activity tab content…</p>
                </TabPanel>
                <TabPanel value="settings">
                  <p className="components-muted">Settings tab content…</p>
                </TabPanel>
              </Tabs>
            </GridItem>
          </Grid>
        </Card>
      </GridItem>

      {/* ---------------------------------------------------------------- */}
      {/* Data display */}
      {/* ---------------------------------------------------------------- */}
      <GridItem xs={12} spacing={2} className="mb-2">
        <Card
          title="Table & Pagination"
          subtitle="Data tables with paging controls">
          <div className="table-scroll">
            <Table>
              <TableHead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </TableHead>
              <TableBody>
                <tr>
                  <td>Alice Johnson</td>
                  <td>Admin</td>
                  <td>
                    <Badge color="success">Active</Badge>
                  </td>
                  <td>Jan 12, 2026</td>
                </tr>
                <tr>
                  <td>Bob Smith</td>
                  <td>Editor</td>
                  <td>
                    <Badge color="warning">Pending</Badge>
                  </td>
                  <td>Feb 3, 2026</td>
                </tr>
                <tr>
                  <td>Carol Nguyen</td>
                  <td>Viewer</td>
                  <td>
                    <Badge color="danger">Inactive</Badge>
                  </td>
                  <td>Mar 19, 2026</td>
                </tr>
              </TableBody>
            </Table>
          </div>
          <div className="components-pagination">
            <TablePagination
              count={25}
              page={1}
              rowsPerPage={5}
              rowsPerPageOptions={[5, 10, 25]}
              onPageChange={(p) => toast.info(`Page ${p}`)}
              onRowsPerPageChange={(r) => toast.info(`Rows per page: ${r}`)}
            />
          </div>
        </Card>
      </GridItem>

      <GridItem xs={12} spacing={2} className="mb-2">
        <Card
          title="Lists, Shortcuts, Dividers & Box"
          subtitle="Content helpers">
          <Grid container>
            <GridItem xs={12} md={6} spacing={2}>
              <div className="components-label mb-2">Lists & Shortcuts</div>
              <List>
                <ListItem>Dashboard</ListItem>
                <ListItem>Analytics</ListItem>
                <ListItem>Reports</ListItem>
                <ListItem>Settings</ListItem>
              </List>
              <Stack
                direction="row"
                spacing={6}
                wrap
                align="center"
                className="mt-3">
                <span className="components-muted">Press</span>
                <Kbd>Ctrl</Kbd>
                <span className="components-muted">+</span>
                <Kbd>K</Kbd>
                <span className="components-muted">to search</span>
              </Stack>
            </GridItem>
            <GridItem xs={12} md={6} spacing={2}>
              <div className="components-label mb-2">Dividers & Box</div>
              <Stack direction="column" spacing={12}>
                <div>
                  <div className="components-label">Solid</div>
                  <Divider spacing={8} />
                </div>
                <div>
                  <div className="components-label">Dashed</div>
                  <Divider variant="dashed" spacing={8} />
                </div>
                <div>
                  <div className="components-label">Dotted</div>
                  <Divider variant="dotted" spacing={8} />
                </div>
                <Divider withText spacing={12}>
                  Section divider
                </Divider>
                <Box className="components-box">
                  Box component with custom styling
                </Box>
              </Stack>
            </GridItem>
          </Grid>
        </Card>
      </GridItem>

      {/* ---------------------------------------------------------------- */}
      {/* Overlays */}
      {/* ---------------------------------------------------------------- */}
      <GridItem xs={12} spacing={2} className="mb-2">
        <Card
          title="Overlays & Interactivity"
          subtitle="Modals, drawers, menus">
          <Stack direction="row" spacing={8} wrap align="center">
            <Button size="sm" onClick={() => setModalOpen(true)}>
              Open Modal
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setDrawerOpen(true)}>
              Open Drawer
            </Button>
            <Button
              size="sm"
              variant="success"
              onClick={() => setSnackbarOpen(true)}>
              Show Snackbar
            </Button>
            <DropdownMenu
              align="end"
              items={[
                {
                  key: "edit",
                  label: "Edit",
                  icon: <IconEdit size={14} />,
                  onClick: () => toast.info("Edit clicked"),
                },
                {
                  key: "share",
                  label: "Share",
                  icon: <IconShare size={14} />,
                  onClick: () => toast.info("Share clicked"),
                },
                { key: "divider-1", divider: true },
                {
                  key: "delete",
                  label: "Delete",
                  icon: <IconTrash size={14} />,
                  danger: true,
                  onClick: () => toast.info("Delete clicked"),
                },
              ]}>
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<IconMenu size={16} />}>
                Menu
              </Button>
            </DropdownMenu>
            <Tooltip content="This is a tooltip">
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<IconUser size={16} />}>
                Hover me
              </Button>
            </Tooltip>
            <Popover
              position="bottom"
              content={
                <div className="components-popover">Popover content</div>
              }>
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<IconAlertCircle size={16} />}>
                Popover
              </Button>
            </Popover>
          </Stack>
        </Card>
      </GridItem>

      {/* ---------------------------------------------------------------- */}
      {/* Charts */}
      {/* ---------------------------------------------------------------- */}
      <GridItem xs={12} spacing={2} className="mb-2">
        <Card title="Charts" subtitle="More chart types to explore">
          <Grid container>
            <GridItem xs={12} md={6} spacing={2} className="mb-3">
              <BarChart
                height={220}
                showValues
                data={[
                  { x: "Jan", y: 40 },
                  { x: "Feb", y: 65 },
                  { x: "Mar", y: 28 },
                  { x: "Apr", y: 80 },
                  { x: "May", y: 52 },
                ]}
              />
            </GridItem>
            <GridItem xs={12} md={6} spacing={2} className="mb-3">
              <ScatterChart
                height={220}
                data={[
                  { x: 10, y: 20 },
                  { x: 25, y: 40 },
                  { x: 40, y: 30 },
                  { x: 55, y: 70 },
                  { x: 70, y: 55 },
                  { x: 85, y: 90 },
                ]}
              />
            </GridItem>
            <GridItem xs={12} md={6} spacing={2} className="mb-3">
              <RadarChart
                size={220}
                data={[
                  { label: "UX", value: 80 },
                  { label: "Dev", value: 70 },
                  { label: "Design", value: 90 },
                  { label: "QA", value: 60 },
                  { label: "PM", value: 75 },
                ]}
              />
            </GridItem>
            <GridItem xs={12} md={6} spacing={2} className="mb-3">
              <StackedBarChart
                height={220}
                showLegend
                series={[
                  {
                    name: "Revenue",
                    data: [
                      { x: "Q1", y: 30 },
                      { x: "Q2", y: 45 },
                      { x: "Q3", y: 60 },
                    ],
                  },
                  {
                    name: "Costs",
                    data: [
                      { x: "Q1", y: 20 },
                      { x: "Q2", y: 30 },
                      { x: "Q3", y: 25 },
                    ],
                  },
                ]}
              />
            </GridItem>
          </Grid>
        </Card>
      </GridItem>

      {/* Overlays rendered at the page level */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Demo modal"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => setModalOpen(false)}>
              Confirm
            </Button>
          </>
        }>
        <p className="components-muted">
          This modal is controlled by the showcase page. Click outside or press
          Escape to close.
        </p>
      </Modal>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="right"
        size="md"
        title="Demo drawer"
        footer={
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setDrawerOpen(false)}>
            Close
          </Button>
        }>
        <p className="components-muted">
          A right-side drawer with content. Drawers are great for quick detail
          views and settings panels.
        </p>
      </Drawer>

      <Snackbar
        message="This is a snackbar notification"
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        color="success"
        position="bottom-right"
        autoHideDuration={2500}
      />
    </Grid>
  );
}
