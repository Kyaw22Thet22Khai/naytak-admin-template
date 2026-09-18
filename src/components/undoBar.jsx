import { useCallback, useEffect, useRef, useState } from "react";
import { Button, IconUndo2, IconClose } from "naytak-react-ui";

/** How long an undo stays available, in ms. */
const UNDO_WINDOW_MS = 6000;

/**
 * Makes a destructive action reversible for a few seconds.
 *
 * A confirm dialog asks "are you sure" before the fact; undo lets the user
 * recover after it, which is what people actually need when they mis-click.
 *
 * Usage:
 *   const undo = useUndoable();
 *   undo.offer(`"${item.name}" deleted`, () => restore(item, index));
 *   …
 *   <UndoBar undo={undo} />
 */
export function useUndoable() {
  const [pending, setPending] = useState(null);
  const timerRef = useRef(null);

  const clear = useCallback(() => {
    window.clearTimeout(timerRef.current);
    setPending(null);
  }, []);

  const offer = useCallback((message, onUndo) => {
    window.clearTimeout(timerRef.current);
    setPending({ message, onUndo });
    timerRef.current = window.setTimeout(
      () => setPending(null),
      UNDO_WINDOW_MS,
    );
  }, []);

  const undo = useCallback(() => {
    pending?.onUndo?.();
    clear();
  }, [pending, clear]);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  return { pending, offer, undo, dismiss: clear };
}

/** The bar itself. Render once per page, near the bottom of the tree. */
export function UndoBar({ undo }) {
  if (!undo.pending) return null;

  return (
    <div className="undo-bar" role="status" aria-live="polite">
      <span className="undo-bar__message">{undo.pending.message}</span>
      <Button
        size="sm"
        variant="ghost"
        className="undo-bar__action"
        leftIcon={<IconUndo2 size={16} />}
        onClick={undo.undo}>
        Undo
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="undo-bar__action"
        aria-label="Dismiss"
        leftIcon={<IconClose size={16} />}
        onClick={undo.dismiss}
      />
    </div>
  );
}
