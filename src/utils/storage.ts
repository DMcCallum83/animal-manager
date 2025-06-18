import { Animal } from "../types";

const STORAGE_KEY = "animal-manager-data";

interface SerializedAnimal extends Omit<Animal, "createdAt" | "lastUpdated"> {
  createdAt: string;
  lastUpdated: string;
}

export const saveAnimalsToStorage = (animals: Animal[]): void => {
  try {
    const serializedAnimals = animals.map((animal) => ({
      ...animal,
      createdAt: animal.createdAt.toISOString(),
      lastUpdated: animal.lastUpdated.toISOString(),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedAnimals));
  } catch (error) {
    console.error("Failed to save animals to storage:", error);
  }
};

export const loadAnimalsFromStorage = (): Animal[] => {
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

export const clearStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear storage:", error);
  }
};
