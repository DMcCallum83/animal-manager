import { useCallback } from "react";
import { Animal } from "../types";
import { applyAction } from "../utils/gameLogic";

export const useAnimalActions = (
  updateAnimal: (id: string, updates: Partial<Animal>) => void,
) => {
  const feedAnimal = useCallback(
    (animalId: string, currentAnimal: Animal) => {
      const updates = applyAction(currentAnimal, "feed");
      updateAnimal(animalId, updates);
    },
    [updateAnimal],
  );

  const playWithAnimal = useCallback(
    (animalId: string, currentAnimal: Animal) => {
      const updates = applyAction(currentAnimal, "play");
      updateAnimal(animalId, updates);
    },
    [updateAnimal],
  );

  const restAnimal = useCallback(
    (animalId: string, currentAnimal: Animal) => {
      const updates = applyAction(currentAnimal, "rest");
      updateAnimal(animalId, updates);
    },
    [updateAnimal],
  );

  return {
    feedAnimal,
    playWithAnimal,
    restAnimal,
  };
};
