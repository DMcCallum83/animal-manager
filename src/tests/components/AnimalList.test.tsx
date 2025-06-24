import { render, screen } from "@testing-library/react";
import { AnimalList } from "../../components/animals/AnimalList";
import { AnimalType } from "../../types";
import { createAnimal } from "../../utils/gameLogic";

describe("AnimalList", () => {
  const mockOnFeed = vi.fn();
  const mockOnPlay = vi.fn();
  const mockOnRest = vi.fn();
  const mockOnRemove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render empty list when no animals", () => {
    render(
      <AnimalList
        animals={[]}
        onFeed={mockOnFeed}
        onPlay={mockOnPlay}
        onRest={mockOnRest}
        onRemove={mockOnRemove}
      />,
    );

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.queryByText("Buddy")).not.toBeInTheDocument();
  });

  it("should render single animal", () => {
    const animals = [createAnimal("Buddy", AnimalType.DOG)];

    render(
      <AnimalList
        animals={animals}
        onFeed={mockOnFeed}
        onPlay={mockOnPlay}
        onRest={mockOnRest}
        onRemove={mockOnRemove}
      />,
    );

    expect(screen.getByText("Buddy")).toBeInTheDocument();
    expect(screen.getByText("Dog")).toBeInTheDocument();
  });

  it("should render multiple animals", () => {
    const animals = [
      createAnimal("Buddy", AnimalType.DOG),
      createAnimal("Rusty", AnimalType.FOX),
      createAnimal("Bambi", AnimalType.DEER),
    ];

    render(
      <AnimalList
        animals={animals}
        onFeed={mockOnFeed}
        onPlay={mockOnPlay}
        onRest={mockOnRest}
        onRemove={mockOnRemove}
      />,
    );

    expect(screen.getByText("Buddy")).toBeInTheDocument();
    expect(screen.getByText("Rusty")).toBeInTheDocument();
    expect(screen.getByText("Bambi")).toBeInTheDocument();
    expect(screen.getByText("Dog")).toBeInTheDocument();
    expect(screen.getByText("Fox")).toBeInTheDocument();
    expect(screen.getByText("Deer")).toBeInTheDocument();
  });

  it("should render correct number of animal cards", () => {
    const animals = [
      createAnimal("Buddy", AnimalType.DOG),
      createAnimal("Rusty", AnimalType.FOX),
    ];

    render(
      <AnimalList
        animals={animals}
        onFeed={mockOnFeed}
        onPlay={mockOnPlay}
        onRest={mockOnRest}
        onRemove={mockOnRemove}
      />,
    );

    const animalCards = document.querySelectorAll(".animal-card-container");
    expect(animalCards).toHaveLength(2);
  });

  it("should pass correct props to animal cards", () => {
    const animals = [createAnimal("Buddy", AnimalType.DOG)];

    render(
      <AnimalList
        animals={animals}
        onFeed={mockOnFeed}
        onPlay={mockOnPlay}
        onRest={mockOnRest}
        onRemove={mockOnRemove}
      />,
    );

    // Check that action buttons are present (indicating props were passed)
    expect(screen.getByText("Feed")).toBeInTheDocument();
    expect(screen.getByText("Play")).toBeInTheDocument();
    expect(screen.getByText("Rest")).toBeInTheDocument();
    expect(screen.getByText("Remove")).toBeInTheDocument();
  });

  it("should render different animal types correctly", () => {
    const animals = [
      createAnimal("Buddy", AnimalType.DOG),
      createAnimal("Rusty", AnimalType.FOX),
      createAnimal("Bambi", AnimalType.DEER),
      createAnimal("Yogi", AnimalType.BEAR),
    ];

    render(
      <AnimalList
        animals={animals}
        onFeed={mockOnFeed}
        onPlay={mockOnPlay}
        onRest={mockOnRest}
        onRemove={mockOnRemove}
      />,
    );

    expect(screen.getByText("Dog")).toBeInTheDocument();
    expect(screen.getByText("Fox")).toBeInTheDocument();
    expect(screen.getByText("Deer")).toBeInTheDocument();
    expect(screen.getByText("Bear")).toBeInTheDocument();
  });
});
