/**
 * A quiet label that groups a set of panels.
 *
 * Pages like the Dashboard otherwise present six panels at identical visual
 * weight in a uniform grid, which gives the eye nothing to latch onto. These
 * headings cost almost no vertical space but turn one flat wall of cards into
 * two or three readable groups.
 *
 * Pass a title already combined with `withNote` when it needs a description.
 */
export function SectionHeading({ title, actions }) {
  return (
    <div className="section-heading">
      <h3 className="section-heading__title">{title}</h3>
      {actions && <div className="section-heading__actions">{actions}</div>}
    </div>
  );
}
