import { AnimalType, AnimalTypeConfig } from "../types";
import dogImage from "../assets/images/animal-dog.svg";
import foxImage from "../assets/images/animal-fox.svg";
import deerImage from "../assets/images/animal-deer.svg";
import bearImage from "../assets/images/animal-bear.svg";

export const ANIMAL_CONFIGS: Record<AnimalType, AnimalTypeConfig> = {
  [AnimalType.DOG]: {
    name: "Dog",
    image: dogImage,
    happinessDecayRate: 0.5, // High happiness decay
    hungerIncreaseRate: 0.3, // Moderate hunger increase
    sleepinessIncreaseRate: 0.2, // Moderate sleep increase
    actionEffectiveness: {
      play: 15, // Good play effectiveness
      feed: 20, // Good feed effectiveness
      rest: 15, // Good rest effectiveness
    },
  },
  [AnimalType.FOX]: {
    name: "Fox",
    image: foxImage,
    happinessDecayRate: 0.2, // Low happiness decay
    hungerIncreaseRate: 0.2, // Low hunger increase
    sleepinessIncreaseRate: 0.4, // High sleep increase
    actionEffectiveness: {
      play: 10, // Moderate play effectiveness
      feed: 15, // Moderate feed effectiveness
      rest: 20, // High rest effectiveness
    },
  },
  [AnimalType.DEER]: {
    name: "Deer",
    image: deerImage,
    happinessDecayRate: 0.6, // High happiness decay
    hungerIncreaseRate: 0.5, // High hunger increase
    sleepinessIncreaseRate: 0.1, // Low sleep increase
    actionEffectiveness: {
      play: 20, // High play effectiveness
      feed: 25, // High feed effectiveness
      rest: 10, // Low rest effectiveness
    },
  },
  [AnimalType.BEAR]: {
    name: "Bear",
    image: bearImage,
    happinessDecayRate: 0.1, // Very low happiness decay
    hungerIncreaseRate: 0.1, // Very low hunger increase
    sleepinessIncreaseRate: 0.1, // Very low sleep increase
    actionEffectiveness: {
      play: 5, // Low play effectiveness
      feed: 10, // Low feed effectiveness
      rest: 5, // Low rest effectiveness
    },
  },
};

export const getAnimalTypeConfig = (type: AnimalType): AnimalTypeConfig => {
  return ANIMAL_CONFIGS[type];
};
