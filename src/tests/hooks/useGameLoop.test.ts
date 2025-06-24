import { renderHook } from "@testing-library/react";
import { useGameLoop } from "../../hooks/useGameLoop";
import { Animal, AnimalType } from "../../types";
import * as gameLogic from "../../utils/gameLogic";

// Mock the gameLogic module
vi.mock("../../utils/gameLogic");

describe("useGameLoop", () => {
  const mockUpdateAnimal = vi.fn();
  const mockCalculateMetricChanges = vi.mocked(
    gameLogic.calculateMetricChanges,
  );

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Mock timer functions as spies
    vi.spyOn(global, "setInterval");
    vi.spyOn(global, "clearInterval");

    mockCalculateMetricChanges.mockImplementation(
      (animal: Animal, _timeDiff: number) => ({
        ...animal,
        lastUpdated: new Date(),
      }),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
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

  it("should set up interval on mount", () => {
    const animals = [createMockAnimal()];

    renderHook(() => useGameLoop(animals, mockUpdateAnimal));

    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 1000);
  });

  it("should clear interval on unmount", () => {
    const animals = [createMockAnimal()];

    const { unmount } = renderHook(() =>
      useGameLoop(animals, mockUpdateAnimal),
    );

    unmount();

    expect(clearInterval).toHaveBeenCalled();
  });

  it("should update animals after 1 second", () => {
    const animals = [createMockAnimal()];

    renderHook(() => useGameLoop(animals, mockUpdateAnimal));

    // Advance time by 1 second
    vi.advanceTimersByTime(1000);

    expect(mockCalculateMetricChanges).toHaveBeenCalled();
    expect(mockUpdateAnimal).toHaveBeenCalled();
  });

  it("should not update animals before 1 second", () => {
    const animals = [createMockAnimal()];

    renderHook(() => useGameLoop(animals, mockUpdateAnimal));

    // Advance time by 500ms
    vi.advanceTimersByTime(500);

    expect(mockCalculateMetricChanges).not.toHaveBeenCalled();
    expect(mockUpdateAnimal).not.toHaveBeenCalled();
  });

  it("should update multiple animals", () => {
    const animals = [
      createMockAnimal({ id: "animal-1" }),
      createMockAnimal({ id: "animal-2" }),
    ];

    renderHook(() => useGameLoop(animals, mockUpdateAnimal));

    vi.advanceTimersByTime(1000);

    expect(mockCalculateMetricChanges).toHaveBeenCalledTimes(2);
    expect(mockUpdateAnimal).toHaveBeenCalledTimes(2);
  });

  it("should pass correct time difference to calculateMetricChanges", () => {
    const animals = [createMockAnimal()];

    renderHook(() => useGameLoop(animals, mockUpdateAnimal));

    vi.advanceTimersByTime(1000);

    expect(mockCalculateMetricChanges).toHaveBeenCalledWith(
      animals[0],
      expect.any(Number),
    );
  });

  it("should handle animals with different lastUpdated times", () => {
    const now = Date.now();
    const animals = [
      createMockAnimal({
        id: "animal-1",
        lastUpdated: new Date(now - 2000),
      }),
      createMockAnimal({
        id: "animal-2",
        lastUpdated: new Date(now - 500),
      }),
    ];

    renderHook(() => useGameLoop(animals, mockUpdateAnimal));

    vi.advanceTimersByTime(1000);

    expect(mockCalculateMetricChanges).toHaveBeenCalledTimes(2);
  });

  it("should not update animals that were updated less than 1 second ago", () => {
    const baseTime = new Date("2023-01-01T00:00:00.000Z").getTime();
    vi.setSystemTime(baseTime);

    const animals = [
      createMockAnimal({
        lastUpdated: new Date(baseTime - 500), // Updated 500ms ago
      }),
    ];

    renderHook(() => useGameLoop(animals, mockUpdateAnimal));

    // Advance time by only 400ms (total time difference = 900ms, which is < 1000ms)
    vi.advanceTimersByTime(400);

    expect(mockCalculateMetricChanges).not.toHaveBeenCalled();
    expect(mockUpdateAnimal).not.toHaveBeenCalled();
  });

  it("should clear and recreate interval when dependencies change", () => {
    const animals1 = [createMockAnimal({ id: "animal-1" })];
    const animals2 = [createMockAnimal({ id: "animal-2" })];

    const { rerender } = renderHook(
      ({ animals }) => useGameLoop(animals, mockUpdateAnimal),
      { initialProps: { animals: animals1 } },
    );

    rerender({ animals: animals2 });

    expect(clearInterval).toHaveBeenCalled();
    expect(setInterval).toHaveBeenCalledTimes(2);
  });

  it("should handle empty animals array", () => {
    const animals: Animal[] = [];

    renderHook(() => useGameLoop(animals, mockUpdateAnimal));

    vi.advanceTimersByTime(1000);

    expect(mockCalculateMetricChanges).not.toHaveBeenCalled();
    expect(mockUpdateAnimal).not.toHaveBeenCalled();
  });

  it("should continue updating animals over multiple intervals", () => {
    const animals = [createMockAnimal()];

    renderHook(() => useGameLoop(animals, mockUpdateAnimal));

    vi.advanceTimersByTime(1000);
    vi.advanceTimersByTime(1000);
    vi.advanceTimersByTime(1000);

    expect(mockCalculateMetricChanges).toHaveBeenCalledTimes(3);
    expect(mockUpdateAnimal).toHaveBeenCalledTimes(3);
  });
});
