import { useState } from "react";
import { Button, IconAlertTriangle, IconTrash, Modal } from "naytak-react-ui";

/**
 * A Button that opens a custom destructive confirmation modal before running
 * onConfirm. Styled with a centered red warning icon, title, message and
 * "No, keep it." / "Yes, Delete!" actions.
 */
export function ConfirmButton({
  label = "Delete",
  icon = <IconTrash size={16} />,
  variant = "danger",
  title = "Delete",
  message = "This action cannot be undone.",
  confirmText = "Yes, Delete!",
  cancelText = "No, keep it.",
  color = "danger",
  onConfirm,
  children,
  ...buttonProps
}) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const handleConfirm = () => {
    close();
    onConfirm?.();
  };

  return (
    <>
      <Button
        {...buttonProps}
        variant={variant}
        leftIcon={icon}
        onClick={() => setOpen(true)}>
        {children ?? label}
      </Button>
      <Modal open={open} onClose={close}>
        <div className="confirm-modal">
          <div className="confirm-modal__icon">
            <IconAlertTriangle size={28} />
          </div>
          <h3 className="confirm-modal__title">{title}</h3>
          <p className="confirm-modal__message">{message}</p>
          <div className="confirm-modal__actions">
            <Button variant="secondary" onClick={close}>
              {cancelText}
            </Button>
            <Button
              variant={color === "danger" ? "danger" : "primary"}
              onClick={handleConfirm}>
              {confirmText}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
