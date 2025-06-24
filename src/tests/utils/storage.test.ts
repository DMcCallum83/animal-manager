import {
  saveAnimalsToStorage,
  loadAnimalsFromStorage,
} from "../../utils/storage";
import { Animal, AnimalType } from "../../types";

describe("storage", () => {
  let mockStorage: Record<string, string>;

  beforeEach(() => {
    // Clear any existing mocks
    vi.clearAllMocks();

    // Create fresh storage for each test
    mockStorage = {};

    // Mock localStorage methods
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: (key: string) => mockStorage[key] || null,
        setItem: (key: string, value: string) => {
          mockStorage[key] = value;
        },
        removeItem: (key: string) => {
          delete mockStorage[key];
        },
        clear: () => {
          mockStorage = {};
        },
        length: Object.keys(mockStorage).length,
        key: (index: number) => Object.keys(mockStorage)[index] || null,
      },
      writable: true,
    });
  });

  const mockAnimals: Animal[] = [
    {
      id: "test-uuid-123",
      name: "Buddy",
      type: AnimalType.DOG,
      happiness: 50,
      hunger: 50,
      sleepiness: 50,
      createdAt: new Date("2023-01-01T00:00:00.000Z"),
      lastUpdated: new Date("2023-01-01T12:00:00.000Z"),
    },
  ];

  describe("saveAnimalsToStorage", () => {
    it("should save animals to localStorage", () => {
      saveAnimalsToStorage(mockAnimals);

      const stored = localStorage.getItem("animal-manager-data");
      expect(stored).toBeDefined();
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].name).toBe("Buddy");
      expect(parsed[0].type).toBe("dog");
    });

    it("should serialize dates to ISO strings", () => {
      saveAnimalsToStorage(mockAnimals);

      const stored = localStorage.getItem("animal-manager-data");
      const parsed = JSON.parse(stored!);

      expect(parsed[0].createdAt).toBe("2023-01-01T00:00:00.000Z");
      expect(parsed[0].lastUpdated).toBe("2023-01-01T12:00:00.000Z");
    });

    it("should handle empty animals array", () => {
      saveAnimalsToStorage([]);

      const stored = localStorage.getItem("animal-manager-data");
      const parsed = JSON.parse(stored!);

      expect(parsed).toEqual([]);
    });

    it("should handle multiple animals", () => {
      const multipleAnimals = [
        ...mockAnimals,
        {
          id: "test-uuid-456",
          name: "Rusty",
          type: AnimalType.FOX,
          happiness: 75,
          hunger: 25,
          sleepiness: 60,
          createdAt: new Date("2023-01-02T00:00:00.000Z"),
          lastUpdated: new Date("2023-01-02T12:00:00.000Z"),
        },
      ];

      saveAnimalsToStorage(multipleAnimals);

      const stored = localStorage.getItem("animal-manager-data");
      const parsed = JSON.parse(stored!);

      expect(parsed).toHaveLength(2);
      expect(parsed[0].name).toBe("Buddy");
      expect(parsed[1].name).toBe("Rusty");
    });

    it("should handle localStorage errors gracefully", () => {
      // Mock localStorage.setItem to throw an error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn().mockImplementation(() => {
        throw new Error("Storage quota exceeded");
      });

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => saveAnimalsToStorage(mockAnimals)).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to save animals to storage:",
        expect.any(Error),
      );

      // Restore original function
      localStorage.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });
  });

  describe("loadAnimalsFromStorage", () => {
    it("should load animals from localStorage", () => {
      const serializedAnimals = [
        {
          id: "test-uuid-123",
          name: "Buddy",
          type: "dog",
          happiness: 50,
          hunger: 50,
          sleepiness: 50,
          createdAt: "2023-01-01T00:00:00.000Z",
          lastUpdated: "2023-01-01T12:00:00.000Z",
        },
      ];

      localStorage.setItem(
        "animal-manager-data",
        JSON.stringify(serializedAnimals),
      );

      const loaded = loadAnimalsFromStorage();

      expect(loaded).toHaveLength(1);
      expect(loaded[0].name).toBe("Buddy");
      expect(loaded[0].type).toBe(AnimalType.DOG);
      expect(loaded[0].createdAt).toBeInstanceOf(Date);
      expect(loaded[0].lastUpdated).toBeInstanceOf(Date);
    });

    it("should return empty array when no data is stored", () => {
      const loaded = loadAnimalsFromStorage();

      expect(loaded).toEqual([]);
    });

    it("should deserialize dates from ISO strings", () => {
      const serializedAnimals = [
        {
          id: "test-uuid-123",
          name: "Buddy",
          type: "dog",
          happiness: 50,
          hunger: 50,
          sleepiness: 50,
          createdAt: "2023-01-01T00:00:00.000Z",
          lastUpdated: "2023-01-01T12:00:00.000Z",
        },
      ];

      localStorage.setItem(
        "animal-manager-data",
        JSON.stringify(serializedAnimals),
      );

      const loaded = loadAnimalsFromStorage();

      expect(loaded[0].createdAt).toEqual(new Date("2023-01-01T00:00:00.000Z"));
      expect(loaded[0].lastUpdated).toEqual(
        new Date("2023-01-01T12:00:00.000Z"),
      );
    });

    it("should handle invalid JSON gracefully", () => {
      localStorage.setItem("animal-manager-data", "invalid json");

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const loaded = loadAnimalsFromStorage();

      expect(loaded).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to load animals from storage:",
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });

    it("should handle localStorage errors gracefully", () => {
      // Mock localStorage.getItem to throw an error
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = vi.fn().mockImplementation(() => {
        throw new Error("Storage access denied");
      });

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const loaded = loadAnimalsFromStorage();

      expect(loaded).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to load animals from storage:",
        expect.any(Error),
      );

      // Restore original function
      localStorage.getItem = originalGetItem;
      consoleSpy.mockRestore();
    });

    it("should handle different animal types", () => {
      const serializedAnimals = [
        {
          id: "test-uuid-123",
          name: "Buddy",
          type: "dog",
          happiness: 50,
          hunger: 50,
          sleepiness: 50,
          createdAt: "2023-01-01T00:00:00.000Z",
          lastUpdated: "2023-01-01T12:00:00.000Z",
        },
        {
          id: "test-uuid-456",
          name: "Rusty",
          type: "fox",
          happiness: 75,
          hunger: 25,
          sleepiness: 60,
          createdAt: "2023-01-02T00:00:00.000Z",
          lastUpdated: "2023-01-02T12:00:00.000Z",
        },
      ];

      localStorage.setItem(
        "animal-manager-data",
        JSON.stringify(serializedAnimals),
      );

      const loaded = loadAnimalsFromStorage();

      expect(loaded).toHaveLength(2);
      expect(loaded[0].type).toBe(AnimalType.DOG);
      expect(loaded[1].type).toBe(AnimalType.FOX);
    });
  });
});
