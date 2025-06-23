import { AnimalType } from "../../types";
import {
  applyAction,
  calculateMetricChanges,
  createAnimal,
  getAnimalStatus,
  validateAnimalName,
} from "../../utils/gameLogic";

describe("gameLogic", () => {
  describe("createAnimal", () => {
    it("should create an animal with correct initial values", () => {
      const animal = createAnimal("Buddy", AnimalType.DOG);

      expect(animal.name).toBe("Buddy");
      expect(animal.type).toBe(AnimalType.DOG);
      expect(animal.happiness).toBe(50);
      expect(animal.hunger).toBe(50);
      expect(animal.sleepiness).toBe(50);
      expect(animal.id).toBeDefined();
      expect(animal.createdAt).toBeInstanceOf(Date);
      expect(animal.lastUpdated).toBeInstanceOf(Date);
    });

    it("should use provided id if given", () => {
      const customId = "custom-id-123";
      const animal = createAnimal("Buddy", AnimalType.DOG, customId);

      expect(animal.id).toBe(customId);
    });
  });

  describe("validateAnimalName", () => {
    it("should return true for valid names", () => {
      expect(validateAnimalName("Buddy")).toBe(true);
      expect(validateAnimalName("A")).toBe(true);
      expect(validateAnimalName("a".repeat(50))).toBe(true);
    });

    it("should return false for invalid names", () => {
      expect(validateAnimalName("")).toBe(false);
      expect(validateAnimalName("   ")).toBe(false);
      expect(validateAnimalName("a".repeat(51))).toBe(false);
    });
  });

  describe("applyAction", () => {
    it("should reduce hunger when feeding", () => {
      const animal = createAnimal("Buddy", AnimalType.DOG);
      animal.hunger = 80;

      const result = applyAction(animal, "feed");

      expect(result.hunger).toBeLessThan(80);
      expect(result.lastUpdated).toBeInstanceOf(Date);
    });

    it("should increase happiness when playing", () => {
      const animal = createAnimal("Buddy", AnimalType.DOG);
      animal.happiness = 30;

      const result = applyAction(animal, "play");

      expect(result.happiness).toBeGreaterThan(30);
      expect(result.lastUpdated).toBeInstanceOf(Date);
    });

    it("should reduce sleepiness when resting", () => {
      const animal = createAnimal("Buddy", AnimalType.DOG);
      animal.sleepiness = 90;

      const result = applyAction(animal, "rest");

      expect(result.sleepiness).toBeLessThan(90);
      expect(result.lastUpdated).toBeInstanceOf(Date);
    });
  });

  describe("calculateMetricChanges", () => {
    it("should increase hunger and sleepiness over time", () => {
      const animal = createAnimal("Buddy", AnimalType.DOG);
      const timeDiff = 5000; // 5 seconds

      const result = calculateMetricChanges(animal, timeDiff);

      expect(result.hunger).toBeGreaterThan(50);
      expect(result.sleepiness).toBeGreaterThan(50);
      expect(result.lastUpdated).toBeInstanceOf(Date);
    });

    it("should decrease happiness over time", () => {
      const animal = createAnimal("Buddy", AnimalType.DOG);
      const timeDiff = 5000; // 5 seconds

      const result = calculateMetricChanges(animal, timeDiff);

      expect(result.happiness).toBeLessThan(50);
    });

    it("should not exceed maximum values", () => {
      const animal = createAnimal("Buddy", AnimalType.DOG);
      animal.hunger = 95;
      animal.sleepiness = 95;
      const timeDiff = 10000; // 10 seconds

      const result = calculateMetricChanges(animal, timeDiff);

      expect(result.hunger).toBeLessThanOrEqual(100);
      expect(result.sleepiness).toBeLessThanOrEqual(100);
    });

    it("should not go below minimum values", () => {
      const animal = createAnimal("Buddy", AnimalType.DOG);
      animal.happiness = 5;
      const timeDiff = 10000; // 10 seconds

      const result = calculateMetricChanges(animal, timeDiff);

      expect(result.happiness).toBeGreaterThanOrEqual(0);
    });
  });

  describe("getAnimalStatus", () => {
    it('should return "Poor" for low happiness', () => {
      const animal = createAnimal("Buddy", AnimalType.DOG);
      animal.happiness = 15;

      expect(getAnimalStatus(animal)).toBe("Poor");
    });

    it('should return "Poor" for high hunger', () => {
      const animal = createAnimal("Buddy", AnimalType.DOG);
      animal.hunger = 85;

      expect(getAnimalStatus(animal)).toBe("Poor");
    });

    it('should return "Poor" for high sleepiness', () => {
      const animal = createAnimal("Buddy", AnimalType.DOG);
      animal.sleepiness = 85;

      expect(getAnimalStatus(animal)).toBe("Poor");
    });

    it('should return "Fair" for moderate values', () => {
      const animal = createAnimal("Buddy", AnimalType.DOG);
      animal.happiness = 35;
      animal.hunger = 65;

      expect(getAnimalStatus(animal)).toBe("Fair");
    });

    it('should return "Excellent" for perfect values', () => {
      const animal = createAnimal("Buddy", AnimalType.DOG);
      animal.happiness = 85;
      animal.hunger = 15;
      animal.sleepiness = 15;

      expect(getAnimalStatus(animal)).toBe("Excellent");
    });

    it('should return "Good" for default values', () => {
      const animal = createAnimal("Buddy", AnimalType.DOG);

      expect(getAnimalStatus(animal)).toBe("Good");
    });
  });
});
