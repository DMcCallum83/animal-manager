import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AddAnimalModal } from "../../components/animals/AddAnimalModal";
import { AnimalType } from "../../types";
import userEvent from "@testing-library/user-event";

describe("AddAnimalModal", () => {
  const mockOnClose = vi.fn();
  const mockOnAdd = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render when open", () => {
    render(
      <AddAnimalModal isOpen={true} onClose={mockOnClose} onAdd={mockOnAdd} />,
    );

    expect(screen.getByText("Add New Animal")).toBeInTheDocument();
    expect(screen.getByLabelText("Animal Name")).toBeInTheDocument();
    expect(screen.getByText("Animal Type")).toBeInTheDocument();
  });

  it("should not render when closed", () => {
    render(
      <AddAnimalModal isOpen={false} onClose={mockOnClose} onAdd={mockOnAdd} />,
    );

    expect(screen.queryByText("Add New Animal")).not.toBeInTheDocument();
  });

  it("should render all animal type options", () => {
    render(
      <AddAnimalModal isOpen={true} onClose={mockOnClose} onAdd={mockOnAdd} />,
    );

    expect(screen.getByText("Dog")).toBeInTheDocument();
    expect(screen.getByText("Fox")).toBeInTheDocument();
    expect(screen.getByText("Deer")).toBeInTheDocument();
    expect(screen.getByText("Bear")).toBeInTheDocument();
  });

  it("should have Dog selected by default", () => {
    render(
      <AddAnimalModal isOpen={true} onClose={mockOnClose} onAdd={mockOnAdd} />,
    );

    const dogOption = screen.getByText("Dog").closest(".animal-type-option");
    expect(dogOption).toHaveClass("selected");
  });

  it("should allow selecting different animal types", () => {
    render(
      <AddAnimalModal isOpen={true} onClose={mockOnClose} onAdd={mockOnAdd} />,
    );

    const foxOption = screen.getByText("Fox").closest(".animal-type-option");
    fireEvent.click(foxOption!);

    expect(foxOption).toHaveClass("selected");
  });

  it("should handle name input changes", () => {
    render(
      <AddAnimalModal isOpen={true} onClose={mockOnClose} onAdd={mockOnAdd} />,
    );

    const nameInput = screen.getByLabelText("Animal Name");
    fireEvent.change(nameInput, { target: { value: "Buddy" } });

    expect(nameInput).toHaveValue("Buddy");
  });

  it("should clear name error when typing", async () => {
    render(
      <AddAnimalModal isOpen={true} onClose={mockOnClose} onAdd={mockOnAdd} />,
    );

    const nameInput = screen.getByLabelText("Animal Name");

    // First, enter a valid name to enable the submit button
    await userEvent.type(nameInput, "LongNameHere!");

    // Try to submit the empty form
    const submitButton = screen.getByText("Add Animal");
    fireEvent.click(submitButton);

    expect(
      screen.getByText("Name must be between 1 and 12 characters"),
    ).toBeInTheDocument();

    // Then type to clear the error by deleting a character
    userEvent.keyboard("{Backspace}");

    await waitFor(() => {
      expect(
        screen.queryByText("Name must be between 1 and 12 characters"),
      ).not.toBeInTheDocument();
    });
  });

  it("should validate name that is too long", async () => {
    render(
      <AddAnimalModal isOpen={true} onClose={mockOnClose} onAdd={mockOnAdd} />,
    );

    const nameInput = screen.getByLabelText("Animal Name");
    fireEvent.change(nameInput, { target: { value: "a".repeat(13) } });

    const submitButton = screen.getByText("Add Animal");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Name must be between 1 and 12 characters"),
      ).toBeInTheDocument();
    });
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it("should call onAdd with correct data when form is valid", async () => {
    mockOnAdd.mockReturnValue(true);

    render(
      <AddAnimalModal isOpen={true} onClose={mockOnClose} onAdd={mockOnAdd} />,
    );

    const nameInput = screen.getByLabelText("Animal Name");
    fireEvent.change(nameInput, { target: { value: "Buddy" } });

    const foxOption = screen.getByText("Fox").closest(".animal-type-option");
    fireEvent.click(foxOption!);

    const submitButton = screen.getByText("Add Animal");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith("Buddy", AnimalType.FOX);
    });
  });

  it("should close modal and reset form when add is successful", async () => {
    mockOnAdd.mockReturnValue(true);

    render(
      <AddAnimalModal isOpen={true} onClose={mockOnClose} onAdd={mockOnAdd} />,
    );

    const nameInput = screen.getByLabelText("Animal Name");
    fireEvent.change(nameInput, { target: { value: "Buddy" } });

    const submitButton = screen.getByText("Add Animal");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("should not close modal when add fails", async () => {
    mockOnAdd.mockReturnValue(false);

    render(
      <AddAnimalModal isOpen={true} onClose={mockOnClose} onAdd={mockOnAdd} />,
    );

    const nameInput = screen.getByLabelText("Animal Name");
    fireEvent.change(nameInput, { target: { value: "Buddy" } });

    const submitButton = screen.getByText("Add Animal");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalled();
    });
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("should call onClose when cancel button is clicked", () => {
    render(
      <AddAnimalModal isOpen={true} onClose={mockOnClose} onAdd={mockOnAdd} />,
    );

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should disable submit button when form is invalid", () => {
    render(
      <AddAnimalModal isOpen={true} onClose={mockOnClose} onAdd={mockOnAdd} />,
    );

    const submitButton = screen.getByText("Add Animal");
    expect(submitButton).toBeDisabled();
  });

  it("should enable submit button when form is valid", () => {
    render(
      <AddAnimalModal isOpen={true} onClose={mockOnClose} onAdd={mockOnAdd} />,
    );

    const nameInput = screen.getByLabelText("Animal Name");
    fireEvent.change(nameInput, { target: { value: "Buddy" } });

    const submitButton = screen.getByText("Add Animal");
    expect(submitButton).not.toBeDisabled();
  });
});
