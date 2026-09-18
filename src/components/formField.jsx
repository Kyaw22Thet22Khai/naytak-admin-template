import { cloneElement, isValidElement, useId } from "react";

/**
 * Wraps one form control and renders its validation message underneath.
 *
 * naytak-react-ui inputs have no error slot of their own, so this owns the
 * message, the `aria-invalid` / `aria-describedby` wiring, and the class that
 * turns the control's border red.
 */
export function FormField({ error, children, className = "" }) {
  const errorId = useId();
  const invalid = Boolean(error);

  // Pass the a11y attributes down to the control when it accepts DOM props.
  const control =
    isValidElement(children) && invalid
      ? cloneElement(children, {
          "aria-invalid": true,
          "aria-describedby": errorId,
        })
      : children;

  return (
    <div
      className={`form-field ${invalid ? "form-field--invalid" : ""} ${className}`.trim()}>
      {control}
      {invalid && (
        <p className="form-field__error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
