import { AnimalList } from "./components/animals/AnimalList";
import { useAnimals } from "./hooks/useAnimals";
import { useGameLoop } from "./hooks/useGameLoop";
import { useAnimalActions } from "./hooks/useAnimalActions";
import "./styles/index.scss";
import { useState } from "react";
import { AddAnimalModal } from "./components/animals/AddAnimalModal";
import { Button } from "./components/ui/Button";

function App() {
  const [showAddModal, setShowAddModal] = useState(false);

  const { animals, addAnimal, updateAnimal, removeAnimal } = useAnimals();
  const { feedAnimal, playWithAnimal, restAnimal } =
    useAnimalActions(updateAnimal);

  // Start the game loop for automatic metric updates
  useGameLoop(animals, updateAnimal);

  return (
    <div className="app">
      <div className="app-header">
        <h1 className="app-title">Animal Manager</h1>
        <Button
          className="add-animal-button"
          onClick={() => setShowAddModal(true)}
        >
          Add Animal
        </Button>
      </div>
      <AnimalList
        animals={animals}
        onFeed={feedAnimal}
        onPlay={playWithAnimal}
        onRest={restAnimal}
        onRemove={removeAnimal}
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
