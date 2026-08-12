import { render, screen } from "@testing-library/react";
import App from "./app";

test("renders the admin shell", () => {
  render(<App />);
  expect(screen.getAllByText(/dashboard/i).length).toBeGreaterThan(0);
});
