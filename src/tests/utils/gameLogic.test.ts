import { AnimalType, HungerLevel } from "../../types";
import {
  applyAction,
  calculateMetricChanges,
  createAnimal,
  validateAnimalName,
  getHungerLevel,
  isHungerUrgent,
  createHungerAlert,
  getHungerAlertMessage,
} from "../../utils/gameLogic";

describe("gameLogic", () => {
  describe("createAnimal", () => {
    it("should create an animal with default values", () => {
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
      const animal = createAnimal("Buddy", AnimalType.DOG, "test-id");

      expect(animal.id).toBe("test-id");
    });
  });

  describe("validateAnimalName", () => {
    it("should validate valid names", () => {
      expect(validateAnimalName("Buddy")).toBe(true);
      expect(validateAnimalName("A")).toBe(true);
      expect(validateAnimalName("123456789012")).toBe(true); // 12 characters
    });

    it("should reject invalid names", () => {
      expect(validateAnimalName("")).toBe(false);
      expect(validateAnimalName("   ")).toBe(false);
      expect(validateAnimalName("1234567890123")).toBe(false); // 13 characters
    });
  });

  describe("applyAction", () => {
    it("should apply feed action correctly", () => {
      const animal = createAnimal("Buddy", AnimalType.DOG);
      animal.hunger = 80;

      const changes = applyAction(animal, "feed");

      expect(changes.hunger).toBeLessThan(animal.hunger);
      expect(changes.lastUpdated).toBeInstanceOf(Date);
    });

    it("should apply play action correctly", () => {
      const animal = createAnimal("Buddy", AnimalType.DOG);
      animal.happiness = 30;

      const changes = applyAction(animal, "play");

      expect(changes.happiness).toBeGreaterThan(animal.happiness);
      expect(changes.lastUpdated).toBeInstanceOf(Date);
    });

    it("should apply rest action correctly", () => {
      const animal = createAnimal("Buddy", AnimalType.DOG);
      animal.sleepiness = 80;

      const changes = applyAction(animal, "rest");

      expect(changes.sleepiness).toBeLessThan(animal.sleepiness);
      expect(changes.lastUpdated).toBeInstanceOf(Date);
    });
  });

  describe("calculateMetricChanges", () => {
    it("should calculate metric changes over time", () => {
      const animal = createAnimal("Buddy", AnimalType.DOG);
      const timeDiffMs = 2000; // 2 seconds

      const changes = calculateMetricChanges(animal, timeDiffMs);

      expect(changes.hunger).toBeGreaterThan(animal.hunger);
      expect(changes.sleepiness).toBeGreaterThan(animal.sleepiness);
      expect(changes.happiness).toBeLessThan(animal.happiness);
      expect(changes.lastUpdated).toBeInstanceOf(Date);
    });
  });

  describe("hunger level utilities", () => {
    describe("getHungerLevel", () => {
      it("should return correct hunger levels", () => {
        expect(getHungerLevel(10)).toBe(HungerLevel.SATIATED); // Very hungry
        expect(getHungerLevel(30)).toBe(HungerLevel.HUNGRY); // Hungry
        expect(getHungerLevel(50)).toBe(HungerLevel.MODERATE); // Moderate
        expect(getHungerLevel(70)).toBe(HungerLevel.FULL); // Full
        expect(getHungerLevel(90)).toBe(HungerLevel.STUFFED); // Stuffed
      });
    });

    describe("isHungerUrgent", () => {
      it("should identify urgent hunger correctly", () => {
        expect(isHungerUrgent(60)).toBe(false);
        expect(isHungerUrgent(70)).toBe(true);
        expect(isHungerUrgent(80)).toBe(true);
        expect(isHungerUrgent(100)).toBe(true);
      });
    });

    describe("createHungerAlert", () => {
      it("should create alert for very hungry animals", () => {
        const animal = createAnimal("Buddy", AnimalType.DOG);
        animal.hunger = 15; // Very hungry

        const alert = createHungerAlert(animal);

        expect(alert).not.toBeNull();
        expect(alert?.animalId).toBe(animal.id);
        expect(alert?.hungerLevel).toBe(HungerLevel.SATIATED);
        expect(alert?.isUrgent).toBe(false);
      });

      it("should create alert for hungry animals", () => {
        const animal = createAnimal("Buddy", AnimalType.DOG);
        animal.hunger = 35; // Hungry

        const alert = createHungerAlert(animal);

        expect(alert).not.toBeNull();
        expect(alert?.hungerLevel).toBe(HungerLevel.HUNGRY);
        expect(alert?.isUrgent).toBe(false);
      });

      it("should create urgent alert for very hungry animals", () => {
        const animal = createAnimal("Buddy", AnimalType.DOG);
        animal.hunger = 75; // Urgent hunger

        const alert = createHungerAlert(animal);

        expect(alert).not.toBeNull();
        expect(alert?.isUrgent).toBe(true);
      });

      it("should not create alert for full animals", () => {
        const animal = createAnimal("Buddy", AnimalType.DOG);
        animal.hunger = 60; // Full

        const alert = createHungerAlert(animal);

        expect(alert).toBeNull();
      });

      it("should not create alert for stuffed animals", () => {
        const animal = createAnimal("Buddy", AnimalType.DOG);
        animal.hunger = 85; // Stuffed

        const alert = createHungerAlert(animal);

        expect(alert).toBeNull();
      });
    });

    describe("getHungerAlertMessage", () => {
      it("should generate correct alert messages", () => {
        const animal = createAnimal("Buddy", AnimalType.DOG);
        animal.hunger = 15;

        const alert = createHungerAlert(animal);
        const message = getHungerAlertMessage(alert!);

        expect(message).toContain("Buddy is very hungry!");
        expect(message).toContain("Hunger: 15%");
      });

      it("should include urgency prefix for urgent alerts", () => {
        const animal = createAnimal("Buddy", AnimalType.DOG);
        animal.hunger = 75;

        const alert = createHungerAlert(animal);
        const message = getHungerAlertMessage(alert!);

        expect(message).toContain("URGENT:");
        expect(message).toContain("Buddy is hungry!");
      });
    });
  });
});
