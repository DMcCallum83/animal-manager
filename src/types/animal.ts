export enum AnimalType {
  DOG = "dog",
  FOX = "fox",
  DEER = "deer",
  BEAR = "bear",
}

export interface Animal {
  id: string;
  name: string;
  type: AnimalType;
  happiness: number; // 0-100
  hunger: number; // 0-100
  sleepiness: number; // 0-100
  createdAt: Date;
  lastUpdated: Date;
}

export interface AnimalTypeConfig {
  name: string;
  image: string;
  happinessDecayRate: number;
  hungerIncreaseRate: number;
  sleepinessIncreaseRate: number;
  actionEffectiveness: {
    play: number;
    feed: number;
    rest: number;
  };
}

export interface AnimalAction {
  type: "feed" | "play" | "rest";
  animalId: string;
  timestamp: Date;
}

// Hunger alert types
export enum HungerLevel {
  SATIATED = "satiated", // 0-19: Very hungry (needs food urgently)
  HUNGRY = "hungry", // 20-39: Hungry (needs food)
  MODERATE = "moderate", // 40-59: Moderate hunger
  FULL = "full", // 60-79: Getting full
  STUFFED = "stuffed", // 80-100: Very full
}

export interface HungerAlert {
  animalId: string;
  animalName: string;
  animalType: AnimalType;
  hungerLevel: HungerLevel;
  hungerValue: number;
  timestamp: Date;
  isUrgent: boolean; // true if hunger < 30
}
