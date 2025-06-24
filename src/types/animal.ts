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
