import { ANIMAL_CONFIGS, getAnimalTypeConfig } from "../../data/animalConfigs";
import { AnimalType } from "../../types";

describe("animalConfigs", () => {
  describe("ANIMAL_CONFIGS", () => {
    it("should have configs for all animal types", () => {
      expect(ANIMAL_CONFIGS[AnimalType.DOG]).toBeDefined();
      expect(ANIMAL_CONFIGS[AnimalType.FOX]).toBeDefined();
      expect(ANIMAL_CONFIGS[AnimalType.DEER]).toBeDefined();
      expect(ANIMAL_CONFIGS[AnimalType.BEAR]).toBeDefined();
    });

    it("should have correct names for all animals", () => {
      expect(ANIMAL_CONFIGS[AnimalType.DOG].name).toBe("Dog");
      expect(ANIMAL_CONFIGS[AnimalType.FOX].name).toBe("Fox");
      expect(ANIMAL_CONFIGS[AnimalType.DEER].name).toBe("Deer");
      expect(ANIMAL_CONFIGS[AnimalType.BEAR].name).toBe("Bear");
    });

    it("should have image paths for all animals", () => {
      expect(ANIMAL_CONFIGS[AnimalType.DOG].image).toBeDefined();
      expect(ANIMAL_CONFIGS[AnimalType.FOX].image).toBeDefined();
      expect(ANIMAL_CONFIGS[AnimalType.DEER].image).toBeDefined();
      expect(ANIMAL_CONFIGS[AnimalType.BEAR].image).toBeDefined();
    });

    it("should have decay rates for all animals", () => {
      Object.values(ANIMAL_CONFIGS).forEach((config) => {
        expect(config.happinessDecayRate).toBeDefined();
        expect(config.hungerIncreaseRate).toBeDefined();
        expect(config.sleepinessIncreaseRate).toBeDefined();
        expect(typeof config.happinessDecayRate).toBe("number");
        expect(typeof config.hungerIncreaseRate).toBe("number");
        expect(typeof config.sleepinessIncreaseRate).toBe("number");
      });
    });

    it("should have action effectiveness for all animals", () => {
      Object.values(ANIMAL_CONFIGS).forEach((config) => {
        expect(config.actionEffectiveness).toBeDefined();
        expect(config.actionEffectiveness.play).toBeDefined();
        expect(config.actionEffectiveness.feed).toBeDefined();
        expect(config.actionEffectiveness.rest).toBeDefined();
        expect(typeof config.actionEffectiveness.play).toBe("number");
        expect(typeof config.actionEffectiveness.feed).toBe("number");
        expect(typeof config.actionEffectiveness.rest).toBe("number");
      });
    });

    it("should have positive decay rates", () => {
      Object.values(ANIMAL_CONFIGS).forEach((config) => {
        expect(config.happinessDecayRate).toBeGreaterThan(0);
        expect(config.hungerIncreaseRate).toBeGreaterThan(0);
        expect(config.sleepinessIncreaseRate).toBeGreaterThan(0);
      });
    });

    it("should have positive action effectiveness values", () => {
      Object.values(ANIMAL_CONFIGS).forEach((config) => {
        expect(config.actionEffectiveness.play).toBeGreaterThan(0);
        expect(config.actionEffectiveness.feed).toBeGreaterThan(0);
        expect(config.actionEffectiveness.rest).toBeGreaterThan(0);
      });
    });

    it("should have reasonable decay rate ranges", () => {
      Object.values(ANIMAL_CONFIGS).forEach((config) => {
        expect(config.happinessDecayRate).toBeLessThanOrEqual(1);
        expect(config.hungerIncreaseRate).toBeLessThanOrEqual(1);
        expect(config.sleepinessIncreaseRate).toBeLessThanOrEqual(1);
      });
    });

    it("should have reasonable action effectiveness ranges", () => {
      Object.values(ANIMAL_CONFIGS).forEach((config) => {
        expect(config.actionEffectiveness.play).toBeLessThanOrEqual(50);
        expect(config.actionEffectiveness.feed).toBeLessThanOrEqual(50);
        expect(config.actionEffectiveness.rest).toBeLessThanOrEqual(50);
      });
    });
  });

  describe("getAnimalTypeConfig", () => {
    it("should return correct config for DOG", () => {
      const config = getAnimalTypeConfig(AnimalType.DOG);
      expect(config.name).toBe("Dog");
      expect(config.happinessDecayRate).toBe(0.5);
      expect(config.hungerIncreaseRate).toBe(0.3);
      expect(config.sleepinessIncreaseRate).toBe(0.2);
    });

    it("should return correct config for FOX", () => {
      const config = getAnimalTypeConfig(AnimalType.FOX);
      expect(config.name).toBe("Fox");
      expect(config.happinessDecayRate).toBe(0.2);
      expect(config.hungerIncreaseRate).toBe(0.2);
      expect(config.sleepinessIncreaseRate).toBe(0.4);
    });

    it("should return correct config for DEER", () => {
      const config = getAnimalTypeConfig(AnimalType.DEER);
      expect(config.name).toBe("Deer");
      expect(config.happinessDecayRate).toBe(0.6);
      expect(config.hungerIncreaseRate).toBe(0.5);
      expect(config.sleepinessIncreaseRate).toBe(0.1);
    });

    it("should return correct config for BEAR", () => {
      const config = getAnimalTypeConfig(AnimalType.BEAR);
      expect(config.name).toBe("Bear");
      expect(config.happinessDecayRate).toBe(0.1);
      expect(config.hungerIncreaseRate).toBe(0.1);
      expect(config.sleepinessIncreaseRate).toBe(0.1);
    });

    it("should return the same config as direct access", () => {
      Object.values(AnimalType).forEach((type) => {
        const configFromFunction = getAnimalTypeConfig(type);
        const configFromObject = ANIMAL_CONFIGS[type];
        expect(configFromFunction).toBe(configFromObject);
      });
    });
  });

  describe("animal characteristics", () => {
    it("should have Dog with high happiness decay and moderate other rates", () => {
      const dogConfig = ANIMAL_CONFIGS[AnimalType.DOG];
      expect(dogConfig.happinessDecayRate).toBe(0.5); // High
      expect(dogConfig.hungerIncreaseRate).toBe(0.3); // Moderate
      expect(dogConfig.sleepinessIncreaseRate).toBe(0.2); // Moderate
    });

    it("should have Fox with low happiness decay and high sleep increase", () => {
      const foxConfig = ANIMAL_CONFIGS[AnimalType.FOX];
      expect(foxConfig.happinessDecayRate).toBe(0.2); // Low
      expect(foxConfig.hungerIncreaseRate).toBe(0.2); // Low
      expect(foxConfig.sleepinessIncreaseRate).toBe(0.4); // High
    });

    it("should have Deer with high decay rates and low sleep increase", () => {
      const deerConfig = ANIMAL_CONFIGS[AnimalType.DEER];
      expect(deerConfig.happinessDecayRate).toBe(0.6); // High
      expect(deerConfig.hungerIncreaseRate).toBe(0.5); // High
      expect(deerConfig.sleepinessIncreaseRate).toBe(0.1); // Low
    });

    it("should have Bear with very low decay rates", () => {
      const bearConfig = ANIMAL_CONFIGS[AnimalType.BEAR];
      expect(bearConfig.happinessDecayRate).toBe(0.1); // Very low
      expect(bearConfig.hungerIncreaseRate).toBe(0.1); // Very low
      expect(bearConfig.sleepinessIncreaseRate).toBe(0.1); // Very low
    });
  });

  describe("action effectiveness", () => {
    it("should have Dog with good effectiveness across all actions", () => {
      const dogConfig = ANIMAL_CONFIGS[AnimalType.DOG];
      expect(dogConfig.actionEffectiveness.play).toBe(15);
      expect(dogConfig.actionEffectiveness.feed).toBe(20);
      expect(dogConfig.actionEffectiveness.rest).toBe(15);
    });

    it("should have Fox with moderate play/feed and high rest effectiveness", () => {
      const foxConfig = ANIMAL_CONFIGS[AnimalType.FOX];
      expect(foxConfig.actionEffectiveness.play).toBe(10);
      expect(foxConfig.actionEffectiveness.feed).toBe(15);
      expect(foxConfig.actionEffectiveness.rest).toBe(20);
    });

    it("should have Deer with high play/feed and low rest effectiveness", () => {
      const deerConfig = ANIMAL_CONFIGS[AnimalType.DEER];
      expect(deerConfig.actionEffectiveness.play).toBe(20);
      expect(deerConfig.actionEffectiveness.feed).toBe(25);
      expect(deerConfig.actionEffectiveness.rest).toBe(10);
    });

    it("should have Bear with low effectiveness across all actions", () => {
      const bearConfig = ANIMAL_CONFIGS[AnimalType.BEAR];
      expect(bearConfig.actionEffectiveness.play).toBe(5);
      expect(bearConfig.actionEffectiveness.feed).toBe(10);
      expect(bearConfig.actionEffectiveness.rest).toBe(5);
    });
  });
});
