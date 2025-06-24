import { renderHook, act } from "@testing-library/react";
import { useAnimals } from "../../hooks/useAnimals";
import { AnimalType } from "../../types";
import * as storage from "../../utils/storage";
import * as gameLogic from "../../utils/gameLogic";

// Mock the storage and gameLogic modules
vi.mock("../../utils/storage");
vi.mock("../../utils/gameLogic");

describe("useAnimals", () => {
  const mockLoadAnimalsFromStorage = vi.mocked(storage.loadAnimalsFromStorage);
  const mockSaveAnimalsToStorage = vi.mocked(storage.saveAnimalsToStorage);
  const mockCreateAnimal = vi.mocked(gameLogic.createAnimal);
  const mockValidateAnimalName = vi.mocked(gameLogic.validateAnimalName);

  beforeEach(() => {
    vi.clearAllMocks();
    mockLoadAnimalsFromStorage.mockReturnValue([]);
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
    expect(mockLoadAnimalsFromStorage).toHaveBeenCalledTimes(1);
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
    mockLoadAnimalsFromStorage.mockReturnValue(mockAnimals);

    const { result } = renderHook(() => useAnimals());

    expect(result.current.animals).toEqual(mockAnimals);
  });

  it("should add animal successfully", () => {
    const { result } = renderHook(() => useAnimals());

    act(() => {
      const success = result.current.addAnimal("Buddy", AnimalType.DOG);
      expect(success).toBe(true);
    });

    expect(result.current.animals).toHaveLength(1);
    expect(result.current.animals[0].name).toBe("Buddy");
    expect(result.current.animals[0].type).toBe(AnimalType.DOG);
    expect(mockCreateAnimal).toHaveBeenCalledWith("Buddy", AnimalType.DOG);
  });

  it("should not add animal with invalid name", () => {
    mockValidateAnimalName.mockReturnValue(false);
    const { result } = renderHook(() => useAnimals());

    act(() => {
      const success = result.current.addAnimal("", AnimalType.DOG);
      expect(success).toBe(false);
    });

    expect(result.current.animals).toHaveLength(0);
    expect(mockCreateAnimal).not.toHaveBeenCalled();
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
    mockLoadAnimalsFromStorage.mockReturnValue([mockAnimal]);

    const { result } = renderHook(() => useAnimals());

    act(() => {
      result.current.updateAnimal("1", { happiness: 75 });
    });

    expect(result.current.animals[0].happiness).toBe(75);
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
    mockLoadAnimalsFromStorage.mockReturnValue(mockAnimals);

    const { result } = renderHook(() => useAnimals());

    act(() => {
      result.current.removeAnimal("1");
    });

    expect(result.current.animals).toHaveLength(1);
    expect(result.current.animals[0].id).toBe("2");
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
    mockLoadAnimalsFromStorage.mockReturnValue(mockAnimals);

    const { result } = renderHook(() => useAnimals());

    const animal = result.current.getAnimal("1");
    expect(animal).toEqual(mockAnimals[0]);
  });

  it("should return undefined for non-existent animal", () => {
    const { result } = renderHook(() => useAnimals());

    const animal = result.current.getAnimal("non-existent");
    expect(animal).toBeUndefined();
  });

  it("should save animals to storage when they change", () => {
    const { result } = renderHook(() => useAnimals());

    act(() => {
      result.current.addAnimal("Buddy", AnimalType.DOG);
    });

    expect(mockSaveAnimalsToStorage).toHaveBeenCalled();
  });

  it("should not save to storage during initial load", () => {
    renderHook(() => useAnimals());

    expect(mockSaveAnimalsToStorage).not.toHaveBeenCalled();
  });

  it("should handle multiple animals", () => {
    const { result } = renderHook(() => useAnimals());

    act(() => {
      result.current.addAnimal("Buddy", AnimalType.DOG);
      result.current.addAnimal("Rusty", AnimalType.FOX);
      result.current.addAnimal("Bambi", AnimalType.DEER);
    });

    expect(result.current.animals).toHaveLength(3);
    expect(result.current.animals.map((a) => a.name)).toEqual([
      "Buddy",
      "Rusty",
      "Bambi",
    ]);
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
    mockLoadAnimalsFromStorage.mockReturnValue(mockAnimals);

    const { result } = renderHook(() => useAnimals());

    act(() => {
      result.current.updateAnimal("1", { happiness: 75 });
    });

    expect(result.current.animals[0].id).toBe("1");
    expect(result.current.animals[1].id).toBe("2");
    expect(result.current.animals[0].happiness).toBe(75);
  });
});
