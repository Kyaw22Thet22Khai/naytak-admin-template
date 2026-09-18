import { describe, expect, test } from "vitest";
import {
  buildValidator,
  required,
  email,
  minLength,
  positiveNumber,
} from "./useForm";

describe("validators", () => {
  test("required rejects empty and whitespace-only values", () => {
    expect(required("Name")("")).toMatch(/required/);
    expect(required("Name")("   ")).toMatch(/required/);
    expect(required("Name")(undefined)).toMatch(/required/);
    expect(required("Name")("Jane")).toBeUndefined();
    // `false` is a real answer for a checkbox, but not a filled-in one.
    expect(required("Terms")(false)).toBeUndefined();
  });

  test("email accepts valid addresses and rejects malformed ones", () => {
    expect(email("jane@naytak.io")).toBeUndefined();
    expect(email("jane+tag@sub.naytak.co.uk")).toBeUndefined();
    expect(email("jane@")).toMatch(/valid email/);
    expect(email("jane.naytak.io")).toMatch(/valid email/);
    expect(email("jane @naytak.io")).toMatch(/valid email/);
    // Empty is `required`'s job, not this one's.
    expect(email("")).toBeUndefined();
  });

  test("minLength counts characters", () => {
    expect(minLength(6, "Password")("12345")).toMatch(/at least 6/);
    expect(minLength(6, "Password")("123456")).toBeUndefined();
  });

  test("positiveNumber rejects negatives and non-numbers", () => {
    expect(positiveNumber("Price")("-1")).toMatch(/cannot be negative/);
    expect(positiveNumber("Price")("abc")).toMatch(/must be a number/);
    expect(positiveNumber("Price")("0")).toBeUndefined();
    expect(positiveNumber("Price")("12.50")).toBeUndefined();
  });
});

describe("buildValidator", () => {
  const validate = buildValidator({
    email: [required("Email"), email],
    password: [required("Password"), minLength(6, "Password")],
    confirm: [
      (value, values) =>
        value !== values.password ? "Passwords do not match." : undefined,
    ],
  });

  test("reports the first failure per field", () => {
    const errors = validate({ email: "", password: "abc", confirm: "abc" });
    // `required` runs before `email`, so that is the message shown.
    expect(errors.email).toMatch(/required/);
    expect(errors.password).toMatch(/at least 6/);
  });

  test("gives cross-field rules access to the whole form", () => {
    expect(
      validate({ email: "a@b.co", password: "secret", confirm: "secret" })
        .confirm,
    ).toBeUndefined();
    expect(
      validate({ email: "a@b.co", password: "secret", confirm: "typo" })
        .confirm,
    ).toMatch(/do not match/);
  });

  test("returns no errors for a valid form", () => {
    const errors = validate({
      email: "jane@naytak.io",
      password: "secret",
      confirm: "secret",
    });
    expect(Object.values(errors).filter(Boolean)).toHaveLength(0);
  });
});
