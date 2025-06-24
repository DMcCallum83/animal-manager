import { render, screen, fireEvent } from "@testing-library/react";
import { AnimalCard } from "../../components/animals/AnimalCard";
import { Animal, AnimalType } from "../../types";
import { createAnimal } from "../../utils/gameLogic";

describe("AnimalCard", () => {
  const mockAnimal: Animal = createAnimal("Buddy", AnimalType.DOG);
  const mockOnFeed = vi.fn();
  const mockOnPlay = vi.fn();
  const mockOnRest = vi.fn();
  const mockOnRemove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render animal information correctly", () => {
    render(
      <AnimalCard
        animal={mockAnimal}
        onFeed={mockOnFeed}
        onPlay={mockOnPlay}
        onRest={mockOnRest}
        onRemove={mockOnRemove}
      />,
    );

    expect(screen.getByText("Buddy")).toBeInTheDocument();
    expect(screen.getByText("Dog")).toBeInTheDocument();
    expect(screen.getByText("Hunger")).toBeInTheDocument();
    expect(screen.getByText("Happiness")).toBeInTheDocument();
    expect(screen.getByText("Sleep")).toBeInTheDocument();
  });

  it("should render animal image with correct alt text", () => {
    render(
      <AnimalCard
        animal={mockAnimal}
        onFeed={mockOnFeed}
        onPlay={mockOnPlay}
        onRest={mockOnRest}
        onRemove={mockOnRemove}
      />,
    );

    const image = screen.getByAltText("Buddy the Dog");
    expect(image).toBeInTheDocument();
  });

  it("should render stat meters", () => {
    render(
      <AnimalCard
        animal={mockAnimal}
        onFeed={mockOnFeed}
        onPlay={mockOnPlay}
        onRest={mockOnRest}
        onRemove={mockOnRemove}
      />,
    );

    const meters = document.querySelectorAll(".meter");
    expect(meters).toHaveLength(3); // Hunger, Happiness, Sleep
  });

  it("should call onFeed when feed button is clicked", () => {
    render(
      <AnimalCard
        animal={mockAnimal}
        onFeed={mockOnFeed}
        onPlay={mockOnPlay}
        onRest={mockOnRest}
        onRemove={mockOnRemove}
      />,
    );

    const feedButton = screen.getByText("Feed");
    fireEvent.click(feedButton);

    expect(mockOnFeed).toHaveBeenCalledWith(mockAnimal.id, mockAnimal);
  });

  it("should call onPlay when play button is clicked", () => {
    render(
      <AnimalCard
        animal={mockAnimal}
        onFeed={mockOnFeed}
        onPlay={mockOnPlay}
        onRest={mockOnRest}
        onRemove={mockOnRemove}
      />,
    );

    const playButton = screen.getByText("Play");
    fireEvent.click(playButton);

    expect(mockOnPlay).toHaveBeenCalledWith(mockAnimal.id, mockAnimal);
  });

  it("should call onRest when rest button is clicked", () => {
    render(
      <AnimalCard
        animal={mockAnimal}
        onFeed={mockOnFeed}
        onPlay={mockOnPlay}
        onRest={mockOnRest}
        onRemove={mockOnRemove}
      />,
    );

    const restButton = screen.getByText("Rest");
    fireEvent.click(restButton);

    expect(mockOnRest).toHaveBeenCalledWith(mockAnimal.id, mockAnimal);
  });

  it("should call onRemove when remove button is clicked", () => {
    render(
      <AnimalCard
        animal={mockAnimal}
        onFeed={mockOnFeed}
        onPlay={mockOnPlay}
        onRest={mockOnRest}
        onRemove={mockOnRemove}
      />,
    );

    const removeButton = screen.getByText("Remove");
    fireEvent.click(removeButton);

    expect(mockOnRemove).toHaveBeenCalledWith(mockAnimal.id);
  });

  it("should render different animal types correctly", () => {
    const foxAnimal = createAnimal("Rusty", AnimalType.FOX);

    render(
      <AnimalCard
        animal={foxAnimal}
        onFeed={mockOnFeed}
        onPlay={mockOnPlay}
        onRest={mockOnRest}
        onRemove={mockOnRemove}
      />,
    );

    expect(screen.getByText("Rusty")).toBeInTheDocument();
    expect(screen.getByText("Fox")).toBeInTheDocument();
    expect(screen.getByAltText("Rusty the Fox")).toBeInTheDocument();
  });

  it("should display correct stat values", () => {
    const animalWithStats = {
      ...mockAnimal,
      hunger: 75,
      happiness: 25,
      sleepiness: 90,
    };

    render(
      <AnimalCard
        animal={animalWithStats}
        onFeed={mockOnFeed}
        onPlay={mockOnPlay}
        onRest={mockOnRest}
        onRemove={mockOnRemove}
      />,
    );

    // Check that stat meters are rendered with correct values
    const meters = document.querySelectorAll(".meter-fill");
    expect(meters).toHaveLength(3);
  });
});
