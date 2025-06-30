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

    // Start new game loop after a delay to prevent immediate updates
    const timeoutId = setTimeout(() => {
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
    }, 1000); // Wait 1 second before starting

    // Cleanup on unmount or when dependencies change
    return () => {
      clearTimeout(timeoutId);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [animals, updateAnimal]);
};
