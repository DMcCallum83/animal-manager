import { renderHook, act } from "@testing-library/react";
import { useAnimals } from "../../hooks/useAnimals";
import { AnimalType } from "../../types";
import { animalsStore } from "../../utils/storage";
import * as gameLogic from "../../utils/gameLogic";

// Mock the storage and gameLogic modules
vi.mock("../../utils/storage", () => ({
  animalsStore: {
    subscribe: vi.fn(),
    getSnapshot: vi.fn(),
    update: vi.fn(),
  },
}));
vi.mock("../../utils/gameLogic");

describe("useAnimals", () => {
  const mockAnimalsStore = vi.mocked(animalsStore);
  const mockCreateAnimal = vi.mocked(gameLogic.createAnimal);
  const mockValidateAnimalName = vi.mocked(gameLogic.validateAnimalName);

  beforeEach(() => {
    vi.clearAllMocks();
    mockAnimalsStore.getSnapshot.mockReturnValue([]);
    mockAnimalsStore.subscribe.mockImplementation((callback: () => void) => {
      // Return a cleanup function
      return () => {};
    });
    mockCreateAnimal.mockImplementation((name: string, type: AnimalType) => ({
      id: "test-uuid-123",
      name,
      type,
      happiness: 50,
      hunger: 50,
      sleepiness: 50,
      createdAt: new Date(),
      lastUpdated: new Date(),
    }));
    mockValidateAnimalName.mockReturnValue(true);
  });

  it("should initialize with empty animals array", () => {
    const { result } = renderHook(() => useAnimals());

    expect(result.current.animals).toEqual([]);
    expect(mockAnimalsStore.getSnapshot).toHaveBeenCalled();
  });

  it("should load animals from storage on mount", () => {
    const mockAnimals = [
      {
        id: "1",
        name: "Buddy",
        type: AnimalType.DOG,
        happiness: 50,
        hunger: 50,
        sleepiness: 50,
        createdAt: new Date(),
        lastUpdated: new Date(),
      },
    ];
    mockAnimalsStore.getSnapshot.mockReturnValue(mockAnimals);

    const { result } = renderHook(() => useAnimals());

    expect(result.current.animals).toEqual(mockAnimals);
  });

  it("should add animal successfully", () => {
    const { result } = renderHook(() => useAnimals());

    act(() => {
      const success = result.current.addAnimal("Buddy", AnimalType.DOG);
      expect(success).toBe(true);
    });

    expect(mockCreateAnimal).toHaveBeenCalledWith("Buddy", AnimalType.DOG);
    expect(mockAnimalsStore.update).toHaveBeenCalled();
  });

  it("should not add animal with invalid name", () => {
    mockValidateAnimalName.mockReturnValue(false);
    const { result } = renderHook(() => useAnimals());

    act(() => {
      const success = result.current.addAnimal("", AnimalType.DOG);
      expect(success).toBe(false);
    });

    expect(mockCreateAnimal).not.toHaveBeenCalled();
    expect(mockAnimalsStore.update).not.toHaveBeenCalled();
  });

  it("should update animal", () => {
    const mockAnimal = {
      id: "1",
      name: "Buddy",
      type: AnimalType.DOG,
      happiness: 50,
      hunger: 50,
      sleepiness: 50,
      createdAt: new Date(),
      lastUpdated: new Date(),
    };
    mockAnimalsStore.getSnapshot.mockReturnValue([mockAnimal]);

    const { result } = renderHook(() => useAnimals());

    act(() => {
      result.current.updateAnimal("1", { happiness: 75 });
    });

    expect(mockAnimalsStore.update).toHaveBeenCalledWith([
      { ...mockAnimal, happiness: 75 },
    ]);
  });

  it("should remove animal", () => {
    const mockAnimals = [
      {
        id: "1",
        name: "Buddy",
        type: AnimalType.DOG,
        happiness: 50,
        hunger: 50,
        sleepiness: 50,
        createdAt: new Date(),
        lastUpdated: new Date(),
      },
      {
        id: "2",
        name: "Rusty",
        type: AnimalType.FOX,
        happiness: 50,
        hunger: 50,
        sleepiness: 50,
        createdAt: new Date(),
        lastUpdated: new Date(),
      },
    ];
    mockAnimalsStore.getSnapshot.mockReturnValue(mockAnimals);

    const { result } = renderHook(() => useAnimals());

    act(() => {
      result.current.removeAnimal("1");
    });

    expect(mockAnimalsStore.update).toHaveBeenCalledWith([mockAnimals[1]]);
  });

  it("should get animal by id", () => {
    const mockAnimals = [
      {
        id: "1",
        name: "Buddy",
        type: AnimalType.DOG,
        happiness: 50,
        hunger: 50,
        sleepiness: 50,
        createdAt: new Date(),
        lastUpdated: new Date(),
      },
    ];
    mockAnimalsStore.getSnapshot.mockReturnValue(mockAnimals);

    const { result } = renderHook(() => useAnimals());

    const animal = result.current.getAnimal("1");
    expect(animal).toEqual(mockAnimals[0]);
  });

  it("should return undefined for non-existent animal", () => {
    const { result } = renderHook(() => useAnimals());

    const animal = result.current.getAnimal("non-existent");
    expect(animal).toBeUndefined();
  });

  it("should update store when adding animals", () => {
    const { result } = renderHook(() => useAnimals());

    act(() => {
      result.current.addAnimal("Buddy", AnimalType.DOG);
    });

    expect(mockAnimalsStore.update).toHaveBeenCalled();
  });

  it("should handle multiple animals", () => {
    const { result } = renderHook(() => useAnimals());

    act(() => {
      result.current.addAnimal("Buddy", AnimalType.DOG);
      result.current.addAnimal("Rusty", AnimalType.FOX);
      result.current.addAnimal("Bambi", AnimalType.DEER);
    });

    expect(mockAnimalsStore.update).toHaveBeenCalledTimes(3);
  });

  it("should maintain animal order after updates", () => {
    const mockAnimals = [
      {
        id: "1",
        name: "Buddy",
        type: AnimalType.DOG,
        happiness: 50,
        hunger: 50,
        sleepiness: 50,
        createdAt: new Date(),
        lastUpdated: new Date(),
      },
      {
        id: "2",
        name: "Rusty",
        type: AnimalType.FOX,
        happiness: 50,
        hunger: 50,
        sleepiness: 50,
        createdAt: new Date(),
        lastUpdated: new Date(),
      },
    ];
    mockAnimalsStore.getSnapshot.mockReturnValue(mockAnimals);

    const { result } = renderHook(() => useAnimals());

    act(() => {
      result.current.updateAnimal("1", { happiness: 75 });
    });

    expect(mockAnimalsStore.update).toHaveBeenCalledWith([
      { ...mockAnimals[0], happiness: 75 },
      mockAnimals[1],
    ]);
  });
});
