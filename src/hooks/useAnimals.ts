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

  const addAnimal = useCallback((name: string, type: AnimalType): boolean => {
    if (!validateAnimalName(name)) {
      return false;
    }
    const currentAnimals = animalsStore.getSnapshot();
    const newAnimal = createAnimal(name, type);
    const updatedAnimals = [...currentAnimals, newAnimal];
    animalsStore.update(updatedAnimals);
    return true;
  }, []);

  const updateAnimal = useCallback(
    (id: string, updates: Partial<Animal>) => {
      const currentAnimals = animalsStore.getSnapshot();
      const updatedAnimals = currentAnimals.map((animal) =>
        animal.id === id ? { ...animal, ...updates } : animal,
      );
      animalsStore.update(updatedAnimals);
    },
    [], // No dependencies - function is now stable
  );

  const removeAnimal = useCallback((id: string) => {
    const currentAnimals = animalsStore.getSnapshot();
    const updatedAnimals = currentAnimals.filter((animal) => animal.id !== id);
    animalsStore.update(updatedAnimals);
  }, []);

  const getAnimal = useCallback((id: string) => {
    const currentAnimals = animalsStore.getSnapshot();
    return currentAnimals.find((animal) => animal.id === id);
  }, []);

  return {
    animals,
    addAnimal,
    updateAnimal,
    removeAnimal,
    getAnimal,
  };
};
