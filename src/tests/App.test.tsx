import { render, screen, fireEvent } from "@testing-library/react";

// Mock the hooks before importing App
vi.mock("../../hooks/useAnimals", () => ({
  useAnimals: () => ({
    animals: [],
    addAnimal: vi.fn(),
    updateAnimal: vi.fn(),
    removeAnimal: vi.fn(),
  }),
}));

vi.mock("../../hooks/useGameLoop", () => ({
  useGameLoop: vi.fn(),
}));

vi.mock("../../hooks/useAnimalActions", () => ({
  useAnimalActions: () => ({
    feedAnimal: vi.fn(),
    playWithAnimal: vi.fn(),
    restAnimal: vi.fn(),
  }),
}));

// Create a stable reference for the empty array
const stableEmptyArray: any[] = [];

// Mock the storage module to prevent useSyncExternalStore issues
vi.mock("../../utils/storage", () => ({
  animalsStore: {
    subscribe: vi.fn(() => () => {}),
    getSnapshot: vi.fn(() => stableEmptyArray),
    update: vi.fn(),
  },
}));

import App from "../App";

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the app title", () => {
    render(<App />);

    expect(screen.getByText("Animal Manager")).toBeInTheDocument();
  });

  it("should render the add animal button", () => {
    render(<App />);

    expect(screen.getByText("Add Animal")).toBeInTheDocument();
  });

  it("should open modal when add animal button is clicked", () => {
    render(<App />);

    const addButton = screen.getByText("Add Animal");
    fireEvent.click(addButton);

    expect(screen.getByText("Add New Animal")).toBeInTheDocument();
  });

  it("should render AnimalList component", () => {
    render(<App />);

    // Check that the animal list container is rendered
    const animalList = document.querySelector(".animal-page");
    expect(animalList).toBeInTheDocument();
  });

  it("should have proper app structure", () => {
    render(<App />);

    // Check for main app container
    const appContainer = document.querySelector(".app");
    expect(appContainer).toBeInTheDocument();

    // Check for app header
    const appHeader = document.querySelector(".app-header");
    expect(appHeader).toBeInTheDocument();
  });

  it("should close modal when modal close is triggered", () => {
    render(<App />);

    // Open modal
    const addButton = screen.getByText("Add Animal");
    fireEvent.click(addButton);

    expect(screen.getByText("Add New Animal")).toBeInTheDocument();

    // Close modal
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(screen.queryByText("Add New Animal")).not.toBeInTheDocument();
  });

  it("should render with empty animal list initially", () => {
    render(<App />);

    // The animal list should be empty initially
    const animalCards = document.querySelectorAll(".animal-card-container");
    expect(animalCards).toHaveLength(0);
  });
});
