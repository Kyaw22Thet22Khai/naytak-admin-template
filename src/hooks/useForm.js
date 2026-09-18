import { useCallback, useState } from "react";

/**
 * Small controlled-form helper: values, per-field errors, and submit handling.
 *
 * `validate(values)` returns an object of `{ field: message }` for whatever is
 * wrong. Errors appear on blur once a field has been touched, and on submit for
 * every field, so the user is not scolded while still typing.
 */
export function useForm({ initialValues, validate, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const runValidation = useCallback(
    (nextValues) => (validate ? validate(nextValues) : {}),
    [validate],
  );

  /** Replaces all values and clears validation state (used when a modal opens). */
  const reset = useCallback(
    (nextValues = initialValues) => {
      setValues(nextValues);
      setErrors({});
      setTouched({});
      setSubmitting(false);
    },
    [initialValues],
  );

  const setValue = useCallback(
    (field, value) => {
      setValues((prev) => {
        const next = { ...prev, [field]: value };
        // Once a field is showing an error, re-check it on every keystroke so
        // the message clears the moment the input becomes valid.
        setErrors((prevErrors) =>
          prevErrors[field]
            ? { ...prevErrors, [field]: runValidation(next)[field] }
            : prevErrors,
        );
        return next;
      });
    },
    [runValidation],
  );

  /** onChange for controls that hand back a DOM event. */
  const handleChange = useCallback(
    (field) => (event) =>
      setValue(
        field,
        event?.target?.type === "checkbox"
          ? event.target.checked
          : event?.target?.value,
      ),
    [setValue],
  );

  /** onChange for controls that hand back a bare value (PasswordInput). */
  const handleValue = useCallback(
    (field) => (value) => setValue(field, value),
    [setValue],
  );

  const handleBlur = useCallback(
    (field) => () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      setErrors((prev) => ({ ...prev, [field]: runValidation(values)[field] }));
    },
    [runValidation, values],
  );

  const handleSubmit = useCallback(
    async (event) => {
      event?.preventDefault?.();
      const found = runValidation(values);
      const failed = Object.keys(found).filter((key) => found[key]);
      if (failed.length > 0) {
        setErrors(found);
        setTouched(
          failed.reduce((acc, key) => ({ ...acc, [key]: true }), touched),
        );
        // Move focus to the first problem so keyboard and screen-reader users
        // land on it rather than hunting for the red text.
        document
          .querySelector(`[name="${failed[0]}"], #${CSS.escape(failed[0])}`)
          ?.focus?.();
        return;
      }
      setSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        setErrors({ form: error?.message ?? "Something went wrong." });
      } finally {
        setSubmitting(false);
      }
    },
    [onSubmit, runValidation, touched, values],
  );

  return {
    values,
    errors,
    touched,
    submitting,
    setValue,
    setValues,
    setErrors,
    handleChange,
    handleValue,
    handleBlur,
    handleSubmit,
    reset,
  };
}

/* ---------- reusable validators ---------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const required = (label) => (value) =>
  value === undefined || value === null || String(value).trim() === ""
    ? `${label} is required.`
    : undefined;

export const email = (value) =>
  value && !EMAIL_RE.test(String(value).trim())
    ? "Enter a valid email address."
    : undefined;

export const minLength = (n, label) => (value) =>
  value && String(value).length < n
    ? `${label} must be at least ${n} characters.`
    : undefined;

export const positiveNumber = (label) => (value) => {
  if (value === "" || value === undefined || value === null) return undefined;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return `${label} must be a number.`;
  if (parsed < 0) return `${label} cannot be negative.`;
  return undefined;
};

/** Runs each field's validator chain and keeps the first failure per field. */
export function buildValidator(rules) {
  return (values) => {
    const errors = {};
    for (const [field, checks] of Object.entries(rules)) {
      for (const check of [].concat(checks)) {
        const message = check(values[field], values);
        if (message) {
          errors[field] = message;
          break;
        }
      }
    }
    return errors;
  };
}
