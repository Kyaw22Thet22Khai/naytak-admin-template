import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  DashboardLayout,
  DropdownMenu,
  Popover,
  SidebarItem,
  IconBell,
  IconChevronDown,
  IconKey,
  IconLogout,
  IconMenu,
  IconMoon,
  IconSun,
  IconUser,
  Stack,
  useTheme,
  useToast,
} from "naytak-react-ui";
import { NAV_ITEMS, ROUTES } from "../app/routes";
import { APP_NAME, CURRENT_USER } from "../constants/app";
import { NOTIFICATIONS } from "../constants/notifications";
import { NotificationPanel } from "../components/notificationPanel";
import { NotificationsModal } from "../components/notificationsModal";
import logo from "../assets/logo.svg";
import "./adminLayout.css";

/**
 * Admin shell rendered around every page.
 * DashboardLayout provides the sidebar, navbar, breadcrumb and content area;
 * page content is rendered into the <Outlet />.
 */
export function AdminLayout() {
  const { mode, toggleMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  // Notification bell state (navbar).
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [notifOpen, setNotifOpen] = useState(false);
  const [viewAllOpen, setViewAllOpen] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast.success("All notifications marked as read");
  };

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  };

  // The sidebar's own collapse toggle is hidden (see AdminLayout.css); the
  // hamburger in the navbar drives it by triggering the library toggler so
  // the sidebar keeps its internal collapse state.
  const toggleSidebar = () => {
    document.querySelector(".sidebar-toggler")?.click();
  };

  const sidebarToggle = (
    <Button
      variant="ghost"
      size="sm"
      aria-label="Toggle sidebar"
      leftIcon={<IconMenu size={20} />}
      onClick={toggleSidebar}
    />
  );

  const sidebar = (
    <>
      <div className="sidebar-brand">
        <img
          src={logo}
          alt={`${APP_NAME} logo`}
          className="sidebar-brand__logo"
        />
        <span className="sidebar-brand__name">{APP_NAME}</span>
      </div>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <SidebarItem
            key={item.key}
            label={item.label}
            icon={<Icon size={20} />}
            active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        );
      })}
    </>
  );

  // Profile dropdown items. TODO: wire Profile / Reset Password to real routes
  // once those pages exist; for now they show a placeholder toast.
  const profileMenuItems = [
    {
      key: "profile",
      label: "Profile",
      icon: <IconUser size={16} />,
      onClick: () => toast.info("Profile page coming soon"),
    },
    {
      key: "reset-password",
      label: "Reset Password",
      icon: <IconKey size={16} />,
      onClick: () => toast.info("Password reset coming soon"),
    },
    { key: "divider-1", divider: true },
    {
      key: "logout",
      label: "Logout",
      icon: <IconLogout size={16} />,
      danger: true,
      onClick: () => {
        toast.success("Signed out");
        navigate(ROUTES.login);
      },
    },
  ];

  const navbarActions = (
    <>
      {sidebarToggle}
      <Stack direction="row" spacing={8} align="center">
        <Popover
          open={notifOpen}
          onOpenChange={setNotifOpen}
          position="bottom"
          closeOnOutsideClick
          content={
            <NotificationPanel
              notifications={notifications}
              onMarkAllRead={markAllRead}
              onRead={markRead}
              onViewAll={() => {
                setNotifOpen(false);
                setViewAllOpen(true);
              }}
            />
          }>
          <span className="navbar-bell">
            <Button
              variant="ghost"
              size="sm"
              aria-label={`Notifications (${unreadCount} unread)`}
              leftIcon={<IconBell size={20} />}
            />
            {unreadCount > 0 && (
              <span className="navbar-bell__badge">{unreadCount}</span>
            )}
          </span>
        </Popover>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Toggle color mode"
          leftIcon={
            mode === "dark" ? <IconSun size={20} /> : <IconMoon size={20} />
          }
          onClick={toggleMode}
        />
        <DropdownMenu items={profileMenuItems} align="end">
          <div className="profile-trigger" aria-label="Account menu">
            <Avatar size="sm" text={CURRENT_USER.name} />
            <span className="profile-trigger__name">{CURRENT_USER.name}</span>
            <IconChevronDown size={16} className="profile-trigger__chevron" />
          </div>
        </DropdownMenu>
      </Stack>
    </>
  );

  const currentItem = NAV_ITEMS.find((item) => location.pathname === item.path);
  const breadcrumbItems = [
    { label: "Home", href: ROUTES.dashboard },
    ...(currentItem ? [{ label: currentItem.label }] : []),
  ];

  return (
    <DashboardLayout
      title=""
      sidebar={sidebar}
      navbarActions={navbarActions}
      breadcrumbItems={breadcrumbItems}
      footer={`${APP_NAME} © ${new Date().getFullYear()}`}>
      <Outlet />

      <NotificationsModal
        open={viewAllOpen}
        notifications={notifications}
        onClose={() => setViewAllOpen(false)}
        onRead={markRead}
        onMarkAllRead={markAllRead}
      />
    </DashboardLayout>
  );
}
