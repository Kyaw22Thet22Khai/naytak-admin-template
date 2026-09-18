/**
 * Shared chart sizing.
 *
 * The chart components take a viewBox *height* in units, then scale to 100% of
 * their container. Their viewBox WIDTH differs per chart type and is not
 * configurable — 600 for most, 400 for the funnel. So the rendered height is:
 *
 *     rendered height = card width × (height / viewBoxWidth)
 *
 * which means passing the same `height` to a bar chart and a funnel makes the
 * funnel 50% taller on screen. Sizing is therefore expressed as an aspect
 * ratio and each chart's height derived from its own viewBox width.
 */

/** Rendered chart height as a fraction of the card's width. */
export const CHART_ASPECT = 0.5;

/** viewBox widths baked into naytak-react-ui, per chart type. */
const VIEWBOX_WIDTH = {
  standard: 600, // line, bar, grouped bar, stacked bar, area, scatter, radar
  funnel: 400,
};

/** For charts on the standard 600-unit viewBox. */
export const CHART_HEIGHT = VIEWBOX_WIDTH.standard * CHART_ASPECT;

/** FunnelChart uses a 400-unit viewBox, so it needs its own height to match. */
export const FUNNEL_CHART_HEIGHT = VIEWBOX_WIDTH.funnel * CHART_ASPECT;

/**
 * Widest a square chart (gauge, donut) is allowed to render.
 *
 * These use a square viewBox and stretch to fill their container, so in a
 * half-width card an unconstrained gauge becomes several hundred pixels tall
 * and dwarfs whatever sits beside it.
 */
export const SQUARE_CHART_MAX = 260;
