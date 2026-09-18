/**
 * Renders a heading with its description inline but visually secondary:
 *
 *   Analytics (Traffic, conversion and revenue insights)
 *   ^^^^^^^^^ inherits the heading's weight and colour
 *             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ muted, regular weight
 *
 * The note drops to the muted colour AND back to regular weight AND down a
 * size — colour alone is not enough separation when it sits in a bold 1.5rem
 * page title. Sizing is in `em`, so the same helper reads correctly in a page
 * header, a card title and a section heading without per-context tuning.
 *
 * Returns the title untouched when there is no note, so callers can pass a
 * conditional without guarding it.
 */
export function withNote(title, note) {
  if (!note) return title;
  return (
    <>
      {title} <span className="title-note">({note})</span>
    </>
  );
}
