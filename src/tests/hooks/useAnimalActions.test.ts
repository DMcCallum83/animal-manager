import { renderHook, act } from "@testing-library/react";
import { useAnimalActions } from "../../hooks/useAnimalActions";
import { Animal, AnimalType } from "../../types";
import * as gameLogic from "../../utils/gameLogic";

// Mock the gameLogic module
vi.mock("../../utils/gameLogic");

describe("useAnimalActions", () => {
  const mockUpdateAnimal = vi.fn();
  const mockApplyAction = vi.mocked(gameLogic.applyAction);

  beforeEach(() => {
    vi.clearAllMocks();
    mockApplyAction.mockImplementation(
      (animal: Animal, _action: "feed" | "play" | "rest") => ({
        ...animal,
        lastUpdated: new Date(),
      }),
    );
  });

  const createMockAnimal = (overrides: Partial<Animal> = {}): Animal => ({
    id: "test-uuid-123",
    name: "Buddy",
    type: AnimalType.DOG,
    happiness: 50,
    hunger: 50,
    sleepiness: 50,
    createdAt: new Date(),
    lastUpdated: new Date(),
    ...overrides,
  });

  it("should provide feedAnimal function", () => {
    const { result } = renderHook(() => useAnimalActions(mockUpdateAnimal));

    expect(result.current.feedAnimal).toBeDefined();
    expect(typeof result.current.feedAnimal).toBe("function");
  });

  it("should provide playWithAnimal function", () => {
    const { result } = renderHook(() => useAnimalActions(mockUpdateAnimal));

    expect(result.current.playWithAnimal).toBeDefined();
    expect(typeof result.current.playWithAnimal).toBe("function");
  });

  it("should provide restAnimal function", () => {
    const { result } = renderHook(() => useAnimalActions(mockUpdateAnimal));

    expect(result.current.restAnimal).toBeDefined();
    expect(typeof result.current.restAnimal).toBe("function");
  });

  it("should call feedAnimal with correct parameters", () => {
    const { result } = renderHook(() => useAnimalActions(mockUpdateAnimal));
    const mockAnimal = createMockAnimal();

    act(() => {
      result.current.feedAnimal("test-uuid-123", mockAnimal);
    });

    expect(mockApplyAction).toHaveBeenCalledWith(mockAnimal, "feed");
    expect(mockUpdateAnimal).toHaveBeenCalledWith(
      "test-uuid-123",
      expect.any(Object),
    );
  });

  it("should call playWithAnimal with correct parameters", () => {
    const { result } = renderHook(() => useAnimalActions(mockUpdateAnimal));
    const mockAnimal = createMockAnimal();

    act(() => {
      result.current.playWithAnimal("test-uuid-123", mockAnimal);
    });

    expect(mockApplyAction).toHaveBeenCalledWith(mockAnimal, "play");
    expect(mockUpdateAnimal).toHaveBeenCalledWith(
      "test-uuid-123",
      expect.any(Object),
    );
  });

  it("should call restAnimal with correct parameters", () => {
    const { result } = renderHook(() => useAnimalActions(mockUpdateAnimal));
    const mockAnimal = createMockAnimal();

    act(() => {
      result.current.restAnimal("test-uuid-123", mockAnimal);
    });

    expect(mockApplyAction).toHaveBeenCalledWith(mockAnimal, "rest");
    expect(mockUpdateAnimal).toHaveBeenCalledWith(
      "test-uuid-123",
      expect.any(Object),
    );
  });

  it("should pass action results to updateAnimal", () => {
    const mockActionResult = {
      id: "test-uuid-123",
      name: "Buddy",
      type: AnimalType.DOG,
      happiness: 60,
      hunger: 40,
      sleepiness: 50,
      createdAt: new Date(),
      lastUpdated: new Date(),
    };
    mockApplyAction.mockReturnValue(mockActionResult);

    const { result } = renderHook(() => useAnimalActions(mockUpdateAnimal));
    const mockAnimal = createMockAnimal();

    act(() => {
      result.current.feedAnimal("test-uuid-123", mockAnimal);
    });

    expect(mockUpdateAnimal).toHaveBeenCalledWith(
      "test-uuid-123",
      mockActionResult,
    );
  });

  it("should handle different animal types", () => {
    const { result } = renderHook(() => useAnimalActions(mockUpdateAnimal));
    const foxAnimal = createMockAnimal({ type: AnimalType.FOX });

    act(() => {
      result.current.feedAnimal("test-uuid-123", foxAnimal);
    });

    expect(mockApplyAction).toHaveBeenCalledWith(foxAnimal, "feed");
  });

  it("should handle multiple actions on same animal", () => {
    const { result } = renderHook(() => useAnimalActions(mockUpdateAnimal));
    const mockAnimal = createMockAnimal();

    act(() => {
      result.current.feedAnimal("test-uuid-123", mockAnimal);
      result.current.playWithAnimal("test-uuid-123", mockAnimal);
      result.current.restAnimal("test-uuid-123", mockAnimal);
    });

    expect(mockApplyAction).toHaveBeenCalledTimes(3);
    expect(mockUpdateAnimal).toHaveBeenCalledTimes(3);
  });

  it("should handle different animal IDs", () => {
    const { result } = renderHook(() => useAnimalActions(mockUpdateAnimal));
    const animal1 = createMockAnimal({ id: "animal-1" });
    const animal2 = createMockAnimal({ id: "animal-2" });

    act(() => {
      result.current.feedAnimal("animal-1", animal1);
      result.current.feedAnimal("animal-2", animal2);
    });

    expect(mockUpdateAnimal).toHaveBeenCalledWith(
      "animal-1",
      expect.any(Object),
    );
    expect(mockUpdateAnimal).toHaveBeenCalledWith(
      "animal-2",
      expect.any(Object),
    );
  });
});
