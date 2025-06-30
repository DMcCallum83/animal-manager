import { Animal, AnimalType, HungerLevel, HungerAlert } from "../types";
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

// Hunger level utilities
export const getHungerLevel = (hungerValue: number): HungerLevel => {
  if (100 - hungerValue >= 20) return HungerLevel.STUFFED; // 80-100: Very full
  if (100 - hungerValue >= 60) return HungerLevel.FULL; // 60-79: Getting full
  if (100 - hungerValue >= 40) return HungerLevel.MODERATE; // 40-59: Moderate hunger
  if (100 - hungerValue >= 20) return HungerLevel.HUNGRY; // 20-39: Hungry
  return HungerLevel.SATIATED; // 0-19: Very hungry
};

export const isHungerUrgent = (hungerValue: number): boolean => {
  return hungerValue >= 70; // Urgent when hunger is 70% or higher
};

export const createHungerAlert = (animal: Animal): HungerAlert | null => {
  const hungerLevel = getHungerLevel(animal.hunger);
  const isUrgent = isHungerUrgent(animal.hunger);

  // Only create alerts for hungry animals (hunger level SATIATED or HUNGRY)
  if (
    hungerLevel !== HungerLevel.SATIATED &&
    hungerLevel !== HungerLevel.HUNGRY
  ) {
    return null;
  }

  return {
    animalId: animal.id,
    animalName: animal.name,
    animalType: animal.type,
    hungerLevel,
    hungerValue: animal.hunger,
    timestamp: new Date(),
    isUrgent,
  };
};

export const getHungerAlertMessage = (alert: HungerAlert): string => {
  const urgency = alert.isUrgent ? "URGENT: " : "";
  const level =
    alert.hungerLevel === HungerLevel.SATIATED ? "very hungry" : "hungry";
  return `${urgency}${alert.animalName} is ${level}! (Hunger: ${Math.round(alert.hungerValue)}%)`;
};
