import { Input, CopyButton, Stack } from "naytak-react-ui";

/** Read-only input with a one-click copy button. */
export function CopyField({ value, label = "Copy" }) {
  return (
    <Stack direction="row" spacing={8}>
      <Input value={value} readOnly />
      <CopyButton value={value} label={label} />
    </Stack>
  );
}
