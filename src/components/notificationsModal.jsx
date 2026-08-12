import { Button, EmptyState, IconBell, Modal, Stack } from "naytak-react-ui";

/**
 * Full "All notifications" modal opened from the bell panel's "View all".
 * Reuses the same `notifications` state as the navbar bell, so unread counts
 * stay in sync between the dropdown panel, the badge and this modal.
 */
export function NotificationsModal({
  open,
  notifications,
  onClose,
  onRead,
  onMarkAllRead,
}) {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`All notifications (${unreadCount} unread)`}
      footer={
        <Stack direction="row" justify="space-between">
          <Button variant="ghost" size="sm" onClick={onMarkAllRead}>
            Mark all read
          </Button>
          <Button size="sm" onClick={onClose}>
            Close
          </Button>
        </Stack>
      }>
      <div className="notif-modal">
        {notifications.length === 0 ? (
          <EmptyState
            icon={<IconBell size={28} />}
            title="No notifications"
            description="You're all caught up."
          />
        ) : (
          notifications.map((notification) => (
            <button
              type="button"
              key={notification.id}
              className={
                notification.unread
                  ? "notif-item notif-item--unread"
                  : "notif-item"
              }
              onClick={() => onRead?.(notification.id)}>
              <span className="notif-item__dot" />
              <span className="notif-item__body">
                <span className="notif-item__title">{notification.title}</span>
                <span className="notif-item__message">
                  {notification.message}
                </span>
                <span className="notif-item__time">{notification.time}</span>
              </span>
            </button>
          ))
        )}
      </div>
    </Modal>
  );
}
