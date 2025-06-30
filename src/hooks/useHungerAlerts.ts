import { useCallback, useMemo } from "react";
import { Animal, HungerAlert } from "../types";
import { createHungerAlert, getHungerAlertMessage } from "../utils/gameLogic";

export const useHungerAlerts = (animals: Animal[]) => {
  // Generate hunger alerts for animals that need attention
  const hungerAlerts = useMemo((): HungerAlert[] => {
    return animals
      .map((animal) => createHungerAlert(animal))
      .filter((alert): alert is HungerAlert => alert !== null)
      .sort((a, b) => {
        // Sort by urgency first, then by hunger value (highest first)
        if (a.isUrgent !== b.isUrgent) {
          return a.isUrgent ? -1 : 1;
        }
        return b.hungerValue - a.hungerValue;
      });
  }, [animals]);

  // Get urgent alerts only
  const urgentAlerts = useMemo(() => {
    return hungerAlerts.filter((alert) => alert.isUrgent);
  }, [hungerAlerts]);

  // Get non-urgent alerts only
  const nonUrgentAlerts = useMemo(() => {
    return hungerAlerts.filter((alert) => !alert.isUrgent);
  }, [hungerAlerts]);

  // Get alert messages for display
  const alertMessages = useMemo(() => {
    return hungerAlerts.map((alert) => getHungerAlertMessage(alert));
  }, [hungerAlerts]);

  // Check if any animals need urgent attention
  const hasUrgentAlerts = useMemo(() => {
    return urgentAlerts.length > 0;
  }, [urgentAlerts]);

  // Get the most urgent alert
  const mostUrgentAlert = useMemo(() => {
    return urgentAlerts[0] || null;
  }, [urgentAlerts]);

  // Get summary of hunger status
  const hungerSummary = useMemo(() => {
    const totalAnimals = animals.length;
    const hungryAnimals = hungerAlerts.length;
    const urgentCount = urgentAlerts.length;

    return {
      totalAnimals,
      hungryAnimals,
      urgentCount,
      percentageHungry:
        totalAnimals > 0 ? (hungryAnimals / totalAnimals) * 100 : 0,
      percentageUrgent:
        totalAnimals > 0 ? (urgentCount / totalAnimals) * 100 : 0,
    };
  }, [animals, hungerAlerts, urgentAlerts]);

  // Function to get alerts for a specific animal
  const getAlertsForAnimal = useCallback(
    (animalId: string): HungerAlert[] => {
      return hungerAlerts.filter((alert) => alert.animalId === animalId);
    },
    [hungerAlerts],
  );

  // Function to check if a specific animal has urgent hunger
  const isAnimalUrgentlyHungry = useCallback(
    (animalId: string): boolean => {
      return urgentAlerts.some((alert) => alert.animalId === animalId);
    },
    [urgentAlerts],
  );

  return {
    hungerAlerts,
    urgentAlerts,
    nonUrgentAlerts,
    alertMessages,
    hasUrgentAlerts,
    mostUrgentAlert,
    hungerSummary,
    getAlertsForAnimal,
    isAnimalUrgentlyHungry,
  };
};
