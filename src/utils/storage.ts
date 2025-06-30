import { Animal } from "../types";

const STORAGE_KEY = "animal-manager-data";

interface SerializedAnimal extends Omit<Animal, "createdAt" | "lastUpdated"> {
  createdAt: string;
  lastUpdated: string;
}

// Store implementation for useSyncExternalStore
let listeners: (() => void)[] = [];

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

// Subscribe to storage changes (for cross-tab synchronization)
const subscribeToStorage = (callback: () => void) => {
  listeners.push(callback);

  // Listen for storage events from other tabs
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      callback();
    }
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    listeners = listeners.filter((listener) => listener !== callback);
    window.removeEventListener("storage", handleStorageChange);
  };
};

// Get current state from localStorage
const getSnapshot = (): Animal[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const serializedAnimals: SerializedAnimal[] = JSON.parse(stored);
    return serializedAnimals.map((animal) => ({
      ...animal,
      createdAt: new Date(animal.createdAt),
      lastUpdated: new Date(animal.lastUpdated),
    }));
  } catch (error) {
    console.error("Failed to load animals from storage:", error);
    return [];
  }
};

// Update the store and notify listeners
const updateStore = (animals: Animal[]) => {
  try {
    const serializedAnimals = animals.map((animal) => ({
      ...animal,
      createdAt: animal.createdAt.toISOString(),
      lastUpdated: animal.lastUpdated.toISOString(),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedAnimals));
    notifyListeners();
  } catch (error) {
    console.error("Failed to save animals to storage:", error);
  }
};

// Export the store interface for useSyncExternalStore
export const animalsStore = {
  subscribe: subscribeToStorage,
  getSnapshot,
  update: updateStore,
};

// Legacy functions for backward compatibility
export const saveAnimalsToStorage = (animals: Animal[]): void => {
  updateStore(animals);
};

export const loadAnimalsFromStorage = (): Animal[] => {
  return getSnapshot();
};

export const clearStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    notifyListeners();
  } catch (error) {
    console.error("Failed to clear storage:", error);
  }
};
