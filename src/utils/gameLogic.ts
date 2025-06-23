import { Animal, AnimalType } from "../types";
import { getAnimalTypeConfig } from "../data/animalConfigs";

export const createAnimal = (
  name: string,
  type: AnimalType,
  id?: string,
): Animal => {
  const now = new Date();
  return {
    id: id || crypto.randomUUID(),
    name,
    type,
    happiness: 50, // Start neutral
    hunger: 50, // Start neutral
    sleepiness: 50, // Start neutral
    createdAt: now,
    lastUpdated: now,
  };
};

export const calculateMetricChanges = (
  animal: Animal,
  timeDiffMs: number,
): Partial<Animal> => {
  const config = getAnimalTypeConfig(animal.type);
  const timeDiffSeconds = timeDiffMs / 1000;

  // Calculate new metrics
  const newHunger = Math.min(
    100,
    animal.hunger + config.hungerIncreaseRate * timeDiffSeconds,
  );
  const newSleepiness = Math.min(
    100,
    animal.sleepiness + config.sleepinessIncreaseRate * timeDiffSeconds,
  );

  // Happiness decreases faster when other needs are high
  const happinessDecayMultiplier = 1 + (newHunger + newSleepiness) / 200;
  const newHappiness = Math.max(
    0,
    animal.happiness -
      config.happinessDecayRate * happinessDecayMultiplier * timeDiffSeconds,
  );

  return {
    hunger: newHunger,
    sleepiness: newSleepiness,
    happiness: newHappiness,
    lastUpdated: new Date(),
  };
};

export const applyAction = (
  animal: Animal,
  action: "feed" | "play" | "rest",
): Partial<Animal> => {
  const config = getAnimalTypeConfig(animal.type);
  const effectiveness = config.actionEffectiveness[action];

  switch (action) {
    case "feed":
      return {
        hunger: Math.max(0, animal.hunger - effectiveness),
        lastUpdated: new Date(),
      };
    case "play":
      return {
        happiness: Math.min(100, animal.happiness + effectiveness),
        lastUpdated: new Date(),
      };
    case "rest":
      return {
        sleepiness: Math.max(0, animal.sleepiness - effectiveness),
        lastUpdated: new Date(),
      };
    default:
      return {};
  }
};

export const validateAnimalName = (name: string): boolean => {
  return name.trim().length > 0 && name.trim().length <= 12;
};

export const getAnimalStatus = (animal: Animal): string => {
  const { happiness, hunger, sleepiness } = animal;

  if (happiness < 20 || hunger > 80 || sleepiness > 80) {
    return "Poor";
  } else if (happiness < 40 || hunger > 60 || sleepiness > 60) {
    return "Fair";
  } else if (happiness > 80 && hunger < 20 && sleepiness < 20) {
    return "Excellent";
  } else {
    return "Good";
  }
};
