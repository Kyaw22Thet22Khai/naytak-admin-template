import { Spinner } from "naytak-react-ui";

/** Full-area loading state used for lazy/suspense or async sections. */
export function PageLoader({ label = "Loading…" }) {
  return (
    <div className="page-loader">
      <Spinner size="md" label={label} />
    </div>
  );
}
