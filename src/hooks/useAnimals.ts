import { useCallback } from "react";
import { useSyncExternalStore } from "react";
import { Animal, AnimalType } from "../types";
import { createAnimal, validateAnimalName } from "../utils/gameLogic";
import { animalsStore } from "../utils/storage";

export const useAnimals = () => {
  // Use useSyncExternalStore to automatically sync with localStorage
  const animals = useSyncExternalStore(
    animalsStore.subscribe,
    animalsStore.getSnapshot,
    () => [], // Server-side fallback
  );

  const addAnimal = useCallback(
    (name: string, type: AnimalType): boolean => {
      if (!validateAnimalName(name)) {
        return false;
      }

      const newAnimal = createAnimal(name, type);
      const updatedAnimals = [...animals, newAnimal];
      animalsStore.update(updatedAnimals);
      return true;
    },
    [animals],
  );

  const updateAnimal = useCallback(
    (id: string, updates: Partial<Animal>) => {
      const updatedAnimals = animals.map((animal) =>
        animal.id === id ? { ...animal, ...updates } : animal,
      );
      animalsStore.update(updatedAnimals);
    },
    [animals],
  );

  const removeAnimal = useCallback(
    (id: string) => {
      const updatedAnimals = animals.filter((animal) => animal.id !== id);
      animalsStore.update(updatedAnimals);
    },
    [animals],
  );

  const getAnimal = useCallback(
    (id: string) => {
      return animals.find((animal) => animal.id === id);
    },
    [animals],
  );

  return {
    animals,
    addAnimal,
    updateAnimal,
    removeAnimal,
    getAnimal,
  };
};
