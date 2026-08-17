import logo from "../assets/logo.svg";

/**
 * Branded "Naytak" loading indicator — an animated ring spinning around the
 * Naytak logo with a label and bouncing dots. Used for page transitions and
 * lazy-loaded routes. Theme-aware via the `--naytak-*` design tokens.
 */
export function NaytakLoader({ label = "Loading" }) {
  return (
    <div className="naytak-loader" role="status" aria-live="polite">
      <div className="naytak-loader__orbit" aria-hidden="true">
        <span className="naytak-loader__ring" />
        <img src={logo} alt="" className="naytak-loader__logo" />
      </div>
      <span className="naytak-loader__label">
        {label}
        <span className="naytak-loader__dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </span>
    </div>
  );
}
