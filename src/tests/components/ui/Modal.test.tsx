import { render, screen, fireEvent } from "@testing-library/react";
import { Modal } from "../../../components/ui/Modal";

describe("Modal", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render when open", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Modal content</div>
      </Modal>,
    );

    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("should not render when closed", () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
        <div>Modal content</div>
      </Modal>,
    );

    expect(screen.queryByText("Test Modal")).not.toBeInTheDocument();
    expect(screen.queryByText("Modal content")).not.toBeInTheDocument();
  });

  it("should render title correctly", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Custom Title">
        <div>Content</div>
      </Modal>,
    );

    expect(screen.getByText("Custom Title")).toBeInTheDocument();
  });

  it("should render children correctly", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Child content</div>
        <button>Child button</button>
      </Modal>,
    );

    expect(screen.getByText("Child content")).toBeInTheDocument();
    expect(screen.getByText("Child button")).toBeInTheDocument();
  });

  it("should call onClose when close button is clicked", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Content</div>
      </Modal>,
    );

    const closeButton = screen.getByRole("button", { name: /×/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when backdrop is clicked", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Content</div>
      </Modal>,
    );

    const overlay = document.querySelector(".modal-overlay");
    fireEvent.click(overlay!);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should not call onClose when modal content is clicked", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Content</div>
      </Modal>,
    );

    const modalContent = document.querySelector(".modal-content");
    fireEvent.click(modalContent!);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("should have correct ARIA attributes", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Content</div>
      </Modal>,
    );

    const modal = screen.getByRole("dialog");
    expect(modal).toHaveAttribute("aria-modal", "true");
    expect(modal).toHaveAttribute("aria-labelledby");
  });

  it("should handle keyboard events", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Content</div>
      </Modal>,
    );

    // Test Escape key
    fireEvent.keyDown(document, { key: "Escape" });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should render with empty title", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="">
        <div>Content</div>
      </Modal>,
    );
    screen.logTestingPlaygroundURL();
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.queryByRole("heading")).toBeInTheDocument();
  });
});
