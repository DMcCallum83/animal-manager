import { useEffect, useRef } from "react";
import { Animal } from "../types";
import { calculateMetricChanges } from "../utils/gameLogic";

export const useGameLoop = (
  animals: Animal[],
  updateAnimal: (id: string, updates: Partial<Animal>) => void,
) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start new game loop
    intervalRef.current = setInterval(() => {
      const now = Date.now();

      animals.forEach((animal) => {
        const timeDiff = now - animal.lastUpdated.getTime();

        // Only update if at least 1 second has passed
        if (timeDiff >= 1000) {
          const updates = calculateMetricChanges(animal, timeDiff);
          updateAnimal(animal.id, updates);
        }
      });
    }, 1000); // Update every second

    // Cleanup on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [animals, updateAnimal]);
};
