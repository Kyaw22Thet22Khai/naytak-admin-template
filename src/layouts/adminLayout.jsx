import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import {
  Link,
  Outlet,
  useHref,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Avatar,
  Button,
  DashboardLayout,
  DropdownMenu,
  Popover,
  SidebarItem,
  IconBell,
  IconChevronDown,
  IconDownload,
  IconKey,
  IconLogout,
  IconMenu,
  IconUser,
  Stack,
  useToast,
} from "naytak-react-ui";
import { NAV_ITEMS, ROUTES } from "../app/routes";
import { APP_NAME } from "../constants/app";
import { ThemeToggle } from "../components/themeToggle";
import { useAuth } from "../app/authContext";
import { NOTIFICATIONS } from "../constants/notifications";
import { NotificationPanel } from "../components/notificationPanel";
import { NotificationsModal } from "../components/notificationsModal";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useIsMobile } from "../hooks/useMediaQuery";
import { useFocusTrap, useScrollLock } from "../hooks/useFocusTrap";
import { PageSkeleton } from "../components/listSkeleton";
import { downloadProjectSource } from "../utils/exportPage";
import logo from "../assets/logo.svg";
import "./adminLayout.css";

/**
 * Admin shell rendered around every page.
 * DashboardLayout provides the sidebar, navbar, breadcrumb and content area;
 * page content renders into the <Outlet />.
 */
export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();

  // Current page — used for the breadcrumb and as the title of downloaded files.
  const currentItem = NAV_ITEMS.find((item) => location.pathname === item.path);

  // Basename-aware href for the breadcrumb "Home" link (BrowserRouter).
  const homeHref = useHref("/");

  // Notification state, persisted so "mark as read" survives a reload.
  const [notifications, setNotifications] = useLocalStorage(
    "notifications",
    NOTIFICATIONS,
  );
  const [notifOpen, setNotifOpen] = useState(false);
  const [viewAllOpen, setViewAllOpen] = useState(false);

  // Desktop sidebar collapse, remembered between visits.
  const [collapsed, setCollapsed] = useLocalStorage("sidebar-collapsed", false);

  /**
   * Mobile off-canvas drawer (see adminLayout.css).
   *
   * Openness is derived rather than stored: we remember which path the drawer
   * was opened on, so navigating away or widening past the breakpoint closes
   * it for free, with no effects to keep in sync.
   */
  const [openedOnPath, setOpenedOnPath] = useState(null);
  const mobileNavOpen = isMobile && openedOnPath === location.pathname;
  const closeMobileNav = useCallback(() => setOpenedOnPath(null), []);
  const drawerRef = useFocusTrap(mobileNavOpen, closeMobileNav);
  useScrollLock(mobileNavOpen);

  const shellRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast.success("All notifications marked as read");
  };

  const markRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );

  /**
   * The library Sidebar owns its collapsed state internally and exposes no
   * controlled prop, so the navbar hamburger drives it through its own toggler
   * button. The query is scoped to this shell subtree rather than the whole
   * document, and the mirrored `collapsed` value here is what gets persisted.
   */
  const toggleSidebar = () => {
    if (isMobile) {
      setOpenedOnPath(mobileNavOpen ? null : location.pathname);
      return;
    }
    const toggler = shellRef.current?.querySelector(".sidebar-toggler");
    if (!toggler) {
      console.warn(
        "Sidebar toggler not found — naytak-react-ui markup may have changed.",
      );
      return;
    }
    toggler.click();
    setCollapsed((prev) => !prev);
  };

  // Reflect the drawer state as a class so CSS can slide the sidebar in/out.
  useEffect(() => {
    const dashboard = shellRef.current?.querySelector(".dashboard");
    dashboard?.classList.toggle("mobile-nav-open", mobileNavOpen);
  }, [mobileNavOpen]);

  const sidebarToggle = (
    <Button
      variant="ghost"
      size="sm"
      aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
      aria-expanded={isMobile ? mobileNavOpen : !collapsed}
      aria-controls="admin-sidebar"
      leftIcon={<IconMenu size={20} />}
      onClick={toggleSidebar}
    />
  );

  const sidebar = (
    <div id="admin-sidebar" ref={drawerRef}>
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
        const active = location.pathname === item.path;
        return (
          <SidebarItem
            key={item.key}
            label={item.label}
            icon={<Icon size={20} />}
            active={active}
            aria-current={active ? "page" : undefined}
            onClick={() => navigate(item.path)}
          />
        );
      })}
    </div>
  );

  const profileMenuItems = [
    {
      key: "profile",
      label: "Profile",
      icon: <IconUser size={16} />,
      onClick: () => navigate(ROUTES.profile),
    },
    {
      key: "reset-password",
      label: "Reset Password",
      icon: <IconKey size={16} />,
      onClick: () => navigate(ROUTES.forgotPassword),
    },
    { key: "divider-1", divider: true },
    {
      key: "logout",
      label: "Logout",
      icon: <IconLogout size={16} />,
      danger: true,
      onClick: () => {
        signOut();
        toast.success("Signed out");
        navigate(ROUTES.login, { replace: true });
      },
    },
  ];

  // Download the whole project source as a runnable ZIP. The archive is
  // generated by the projectZipPlugin Vite plugin (node_modules/dist are
  // excluded) and served from ./project-source.zip.
  const handleDownload = async () => {
    try {
      await downloadProjectSource();
      toast.success("Downloaded project as a ZIP");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error(
        "Project archive not found — restart the dev server or rebuild",
      );
    }
  };

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
              aria-label={`Notifications, ${unreadCount} unread`}
              aria-expanded={notifOpen}
              leftIcon={<IconBell size={20} />}
            />
            {unreadCount > 0 && (
              <span className="navbar-bell__badge" aria-hidden="true">
                {unreadCount}
              </span>
            )}
          </span>
        </Popover>
        <ThemeToggle />
        <Button
          variant="ghost"
          size="sm"
          aria-label="Download project source"
          className="download-btn"
          leftIcon={<IconDownload size={20} />}
          onClick={handleDownload}>
          <span className="download-btn__label">Download</span>
        </Button>
        <DropdownMenu items={profileMenuItems} align="end">
          <button
            type="button"
            className="profile-trigger"
            aria-label="Account menu">
            <Avatar size="sm" text={user?.name ?? "User"} />
            <span className="profile-trigger__name">{user?.name}</span>
            <IconChevronDown size={16} className="profile-trigger__chevron" />
          </button>
        </DropdownMenu>
      </Stack>
    </>
  );

  const breadcrumbItems = [
    { label: "Home", href: homeHref },
    ...(currentItem ? [{ label: currentItem.label }] : []),
  ];

  return (
    <div ref={shellRef} className="admin-shell">
      {/* Lets keyboard users jump past the sidebar and navbar. */}
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <DashboardLayout
        title=""
        sidebar={sidebar}
        collapsed={collapsed}
        navbarActions={navbarActions}
        breadcrumbItems={breadcrumbItems}
        footer={
          <>
            {APP_NAME} © {new Date().getFullYear()} ·{" "}
            <Link to={ROUTES.landing}>Landing</Link>
          </>
        }>
        {/* The boundary sits here, not above the shell: the sidebar, navbar
            and breadcrumb stay on screen while the next page's chunk loads,
            and only the content area fills in. */}
        <main id="main-content" tabIndex={-1}>
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </main>

        {/* Tap-away scrim behind the mobile sidebar drawer. */}
        {mobileNavOpen && (
          <div
            className="mobile-nav-scrim"
            onClick={closeMobileNav}
            aria-hidden="true"
          />
        )}

        <NotificationsModal
          open={viewAllOpen}
          notifications={notifications}
          onClose={() => setViewAllOpen(false)}
          onRead={markRead}
          onMarkAllRead={markAllRead}
        />
      </DashboardLayout>
    </div>
  );
}
