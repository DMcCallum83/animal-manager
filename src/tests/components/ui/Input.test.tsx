import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../../../components/ui/Input";

describe("Input", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render with label", () => {
    render(<Input label="Test Label" value="" onChange={mockOnChange} />);

    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("should render without label", () => {
    render(<Input value="" onChange={mockOnChange} />);

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(screen.queryByText("Test Label")).not.toBeInTheDocument();
  });

  it("should display value correctly", () => {
    render(<Input value="test value" onChange={mockOnChange} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("test value");
  });

  it("should display placeholder", () => {
    render(
      <Input placeholder="Enter text..." value="" onChange={mockOnChange} />,
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("placeholder", "Enter text...");
  });

  it("should display error message", () => {
    render(<Input error="This is an error" value="" onChange={mockOnChange} />);

    expect(screen.getByText("This is an error")).toBeInTheDocument();
  });

  it("should apply error class when error is present", () => {
    render(<Input error="Error message" value="" onChange={mockOnChange} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("input--error");
  });

  it("should be required when required prop is true", () => {
    render(<Input required value="" onChange={mockOnChange} />);

    const input = screen.getByRole("textbox");
    expect(input).toBeRequired();
  });

  it("should have correct type attribute", () => {
    render(<Input type="email" value="" onChange={mockOnChange} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("type", "email");
  });

  it("should have correct id and htmlFor when label is provided", () => {
    render(
      <Input
        label="Test Label"
        id="test-input"
        value=""
        onChange={mockOnChange}
      />,
    );

    const input = screen.getByRole("textbox");
    const label = screen.getByText("Test Label");

    expect(input).toHaveAttribute("id", "test-input");
    expect(label).toHaveAttribute("for", "test-input");
  });

  it("should apply custom className", () => {
    render(<Input className="custom-class" value="" onChange={mockOnChange} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("custom-class");
  });

  it("should combine error and custom classes correctly", () => {
    render(
      <Input
        className="custom-class"
        error="Error message"
        value=""
        onChange={mockOnChange}
      />,
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("custom-class", "input--error");
  });
});
