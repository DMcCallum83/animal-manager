import { Animal, AnimalType } from "./types";
import { AnimalList } from "./components/animals/AnimalList";
import { useAnimals } from "./hooks/useAnimals";
import { useAnimalActions } from "./hooks/useAnimalActions";
import { useGameLoop } from "./hooks/useGameLoop";
import "./styles/index.scss";

function App() {
  const { animals, addAnimal, updateAnimal, removeAnimal } = useAnimals();
  const { feedAnimal, playWithAnimal, restAnimal } =
    useAnimalActions(updateAnimal);

  // Start the game loop for automatic metric updates
  useGameLoop(animals, updateAnimal);

  const handleFeed = (animalId: string, animal: Animal) => {
    feedAnimal(animalId, animal);
  };

  const handlePlay = (animalId: string, animal: Animal) => {
    playWithAnimal(animalId, animal);
  };

  const handleRest = (animalId: string, animal: Animal) => {
    restAnimal(animalId, animal);
  };

  const handleRemove = (animalId: string) => {
    removeAnimal(animalId);
  };

  const handleAdd = (name: string, type: AnimalType) => {
    return addAnimal(name, type);
  };

  return (
    <div className="app">
      <AnimalList
        animals={animals}
        onFeed={handleFeed}
        onPlay={handlePlay}
        onRest={handleRest}
        onRemove={handleRemove}
        onAdd={handleAdd}
      />
    </div>
  );
}

export default App;
