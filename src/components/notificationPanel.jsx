/**
 * Dropdown panel shown when the navbar bell is clicked.
 * - Unread items get a dot + tinted background; clicking marks them read.
 * - "Mark all read" clears the unread state on every notification.
 */
export function NotificationPanel({
  notifications,
  onMarkAllRead,
  onRead,
  onViewAll,
}) {
  return (
    <div className="notif-panel">
      <div className="notif-panel__header">
        <span className="notif-panel__title">Notifications</span>
        <button
          type="button"
          className="notif-panel__mark-all"
          onClick={onMarkAllRead}>
          Mark all read
        </button>
      </div>

      <div className="notif-panel__list">
        {notifications.length === 0 ? (
          <div className="notif-panel__empty">You're all caught up</div>
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

      <div className="notif-panel__footer">
        <button type="button" onClick={onViewAll}>
          View all notifications
        </button>
      </div>
    </div>
  );
}
