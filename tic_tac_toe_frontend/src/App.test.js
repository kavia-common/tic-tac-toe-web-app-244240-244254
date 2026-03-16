import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Tic Tac Toe title and reset button", () => {
  render(<App />);
  expect(screen.getByText(/tic tac toe/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
});
