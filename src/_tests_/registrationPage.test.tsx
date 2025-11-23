import { render, screen, fireEvent } from "@testing-library/react";
import Register from "../Register";

describe("Registration Page", () => {
  test("renders registration form", () => {
    render(<Register />);

    expect(screen.getByText("Create Account")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  test("shows error for invalid email", () => {
    render(<Register />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "invalid" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "12345678" },
    });
    fireEvent.click(screen.getByText("Register"));

    expect(
      screen.getByText("Please enter a valid email address.")
    ).toBeInTheDocument();
  });

  test("shows error for short password", () => {
    render(<Register />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByText("Register"));

    expect(
      screen.getByText("Password must be at least 8 characters long.")
    ).toBeInTheDocument();
  });

  test("shows success message on valid input", () => {
    render(<Register />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "12345678" },
    });

    fireEvent.click(screen.getByText("Register"));

    expect(
      screen.getByText("Registration details are valid! Proceeding...")
    ).toBeInTheDocument();
  });
});
