import { render, screen, fireEvent } from "@testing-library/react";
import Register from "../pages/Register";

describe("Registration Page", () => {
  test("renders registration form", () => {
    render(<Register />);

    expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  test("shows error for invalid email", async () => {
    render(<Register />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "invalid" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "12345678" },
    });

    fireEvent.submit(screen.getByRole("form"));

    const errorMessage = await screen.findByText(
      /please enter a valid email address/i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test("shows error for short password", async () => {
    render(<Register />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "123" },
    });

    fireEvent.submit(screen.getByRole("form"));

    const errorMessage = await screen.findByText(
      /password must be at least 8 characters long/i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test("shows success message on valid input", async () => {
    render(<Register />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "12345678" },
    });

    fireEvent.submit(screen.getByRole("form"));

    const successMessage = await screen.findByText(
      /registration details are valid/i
    );
    expect(successMessage).toBeInTheDocument();
  });
});
