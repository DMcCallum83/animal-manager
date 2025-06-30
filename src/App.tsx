import { AnimalList } from "./components/animals/AnimalList";
import { useAnimals } from "./hooks/useAnimals";
import { useGameLoop } from "./hooks/useGameLoop";
import { useAnimalActions } from "./hooks/useAnimalActions";
import { useHungerAlerts } from "./hooks/useHungerAlerts";
import { HungerAlertNotification } from "./components/animals/HungerAlertNotification";
import "./styles/index.scss";
import { useState } from "react";
import { AddAnimalModal } from "./components/animals/AddAnimalModal";
import { Button } from "./components/ui/Button";

function App() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(
    new Set(),
  );

  const { animals, addAnimal, updateAnimal, removeAnimal } = useAnimals();
  const { feedAnimal, playWithAnimal, restAnimal } =
    useAnimalActions(updateAnimal);

  // Get hunger alerts
  const { hungerAlerts, urgentAlerts, hasUrgentAlerts, hungerSummary } =
    useHungerAlerts(animals);

  // Filter out dismissed alerts - not entirely convinced this is behaving
  const activeAlerts = hungerAlerts.filter(
    (alert) =>
      !dismissedAlerts.has(`${alert.animalId}-${alert.timestamp.getTime()}`),
  );

  // Start the game loop for automatic metric updates
  useGameLoop(animals, updateAnimal);

  const handleDismissAlert = (alertId: string) => {
    setDismissedAlerts((prev) => new Set([...prev, alertId]));
  };

  const handleFeedFromAlert = (animalId: string) => {
    const animal = animals.find((a) => a.id === animalId);
    if (animal) {
      feedAnimal(animalId, animal);
    }
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1 className="app-title">Animal Manager</h1>
        <div className="app-header-actions">
          {hasUrgentAlerts && (
            <div className="urgent-indicator">
              ⚠️ {urgentAlerts.length} animals need urgent feeding!
            </div>
          )}
          <Button
            className="add-animal-button"
            onClick={() => setShowAddModal(true)}
          >
            Add Animal
          </Button>
        </div>
      </div>

      {/* Hunger Summary */}
      {hungerSummary.totalAnimals > 0 && (
        <div className="hunger-summary">
          <div className="summary-item">
            <span className="summary-label">Total Animals:</span>
            <span className="summary-value">{hungerSummary.totalAnimals}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Hungry:</span>
            <span className="summary-value hungry">
              {hungerSummary.hungryAnimals} (
              {Math.round(hungerSummary.percentageHungry)}%)
            </span>
          </div>
          {hungerSummary.urgentCount > 0 && (
            <div className="summary-item urgent">
              <span className="summary-label">Urgent:</span>
              <span className="summary-value urgent">
                {hungerSummary.urgentCount} (
                {Math.round(hungerSummary.percentageUrgent)}%)
              </span>
            </div>
          )}
        </div>
      )}

      <AnimalList
        animals={animals}
        onFeed={feedAnimal}
        onPlay={playWithAnimal}
        onRest={restAnimal}
        onRemove={removeAnimal}
      />

      {/* Hunger Alert Notifications */}
      <HungerAlertNotification
        alerts={activeAlerts}
        onDismiss={handleDismissAlert}
        onFeedAnimal={handleFeedFromAlert}
        maxDisplayed={3}
      />

      <AddAnimalModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addAnimal}
      />
    </div>
  );
}

export default App;
