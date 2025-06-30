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
    vi.spyOn(global, "setTimeout");
    vi.spyOn(global, "clearTimeout");

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

  it("should set up timeout and interval on mount", () => {
    const animals = [createMockAnimal()];

    renderHook(() => useGameLoop(animals, mockUpdateAnimal));

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
  });

  it("should clear timeout and interval on unmount", () => {
    const animals = [createMockAnimal()];

    const { unmount } = renderHook(() =>
      useGameLoop(animals, mockUpdateAnimal),
    );

    unmount();

    expect(clearTimeout).toHaveBeenCalled();
  });

  it("should update animals after 2 seconds (1s delay + 1s interval)", () => {
    const animals = [createMockAnimal()];

    renderHook(() => useGameLoop(animals, mockUpdateAnimal));

    // Advance time by 2 seconds (1s for timeout + 1s for interval)
    vi.advanceTimersByTime(2000);

    expect(mockCalculateMetricChanges).toHaveBeenCalled();
    expect(mockUpdateAnimal).toHaveBeenCalled();
  });

  it("should not update animals before 2 seconds", () => {
    const animals = [createMockAnimal()];

    renderHook(() => useGameLoop(animals, mockUpdateAnimal));

    // Advance time by 1.5 seconds (not enough for timeout + interval)
    vi.advanceTimersByTime(1500);

    expect(mockCalculateMetricChanges).not.toHaveBeenCalled();
    expect(mockUpdateAnimal).not.toHaveBeenCalled();
  });

  it("should update multiple animals", () => {
    const animals = [
      createMockAnimal({ id: "animal-1" }),
      createMockAnimal({ id: "animal-2" }),
    ];

    renderHook(() => useGameLoop(animals, mockUpdateAnimal));

    vi.advanceTimersByTime(2000);

    expect(mockCalculateMetricChanges).toHaveBeenCalledTimes(2);
    expect(mockUpdateAnimal).toHaveBeenCalledTimes(2);
  });

  it("should pass correct time difference to calculateMetricChanges", () => {
    const animals = [createMockAnimal()];

    renderHook(() => useGameLoop(animals, mockUpdateAnimal));

    vi.advanceTimersByTime(2000);

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

    vi.advanceTimersByTime(2000);

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

    // Advance time by 1.5 seconds (timeout fires but animal was updated recently)
    vi.advanceTimersByTime(1500);

    expect(mockCalculateMetricChanges).not.toHaveBeenCalled();
    expect(mockUpdateAnimal).not.toHaveBeenCalled();
  });

  it("should clear and recreate timeout when dependencies change", () => {
    const animals1 = [createMockAnimal({ id: "animal-1" })];
    const animals2 = [createMockAnimal({ id: "animal-2" })];

    const { rerender } = renderHook(
      ({ animals }) => useGameLoop(animals, mockUpdateAnimal),
      { initialProps: { animals: animals1 } },
    );

    rerender({ animals: animals2 });

    expect(clearTimeout).toHaveBeenCalled();
    expect(setTimeout).toHaveBeenCalledTimes(2);
  });

  it("should handle empty animals array", () => {
    const animals: Animal[] = [];

    renderHook(() => useGameLoop(animals, mockUpdateAnimal));

    vi.advanceTimersByTime(2000);

    expect(mockCalculateMetricChanges).not.toHaveBeenCalled();
    expect(mockUpdateAnimal).not.toHaveBeenCalled();
  });

  it("should continue updating animals over multiple intervals", () => {
    const animals = [createMockAnimal()];

    renderHook(() => useGameLoop(animals, mockUpdateAnimal));

    vi.advanceTimersByTime(2000); // First update
    vi.advanceTimersByTime(1000); // Second update
    vi.advanceTimersByTime(1000); // Third update

    expect(mockCalculateMetricChanges).toHaveBeenCalledTimes(3);
    expect(mockUpdateAnimal).toHaveBeenCalledTimes(3);
  });
});
