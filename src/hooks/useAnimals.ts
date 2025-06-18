import { useState, useEffect, useCallback } from "react";
import { Animal, AnimalType } from "../types";
import { createAnimal, validateAnimalName } from "../utils/gameLogic";
import { saveAnimalsToStorage, loadAnimalsFromStorage } from "../utils/storage";

export const useAnimals = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);

  // Load animals from storage on mount
  useEffect(() => {
    const storedAnimals = loadAnimalsFromStorage();
    setAnimals(storedAnimals);
  }, []);

  // Save animals to storage whenever they change
  useEffect(() => {
    saveAnimalsToStorage(animals);
  }, [animals]);

  const addAnimal = useCallback((name: string, type: AnimalType): boolean => {
    if (!validateAnimalName(name)) {
      return false;
    }

    const newAnimal = createAnimal(name, type);
    setAnimals((prev) => [...prev, newAnimal]);
    return true;
  }, []);

  const updateAnimal = useCallback((id: string, updates: Partial<Animal>) => {
    setAnimals((prev) =>
      prev.map((animal) =>
        animal.id === id ? { ...animal, ...updates } : animal,
      ),
    );
  }, []);

  const removeAnimal = useCallback((id: string) => {
    setAnimals((prev) => prev.filter((animal) => animal.id !== id));
  }, []);

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
