import { Animal } from "../../types";
import { StatMeter } from "./StatMeter";
import { Button } from "../ui/Button";
import { getAnimalTypeConfig } from "../../data/animalConfigs";

interface AnimalCardProps {
  animal: Animal;
  onFeed: (animalId: string, animal: Animal) => void;
  onPlay: (animalId: string, animal: Animal) => void;
  onRest: (animalId: string, animal: Animal) => void;
  onRemove: (animalId: string) => void;
}

export const AnimalCard: React.FC<AnimalCardProps> = ({
  animal,
  onFeed,
  onPlay,
  onRest,
  onRemove,
}) => {
  const config = getAnimalTypeConfig(animal.type);

  return (
    <div className="animal-container">
      <h1>{config.name}</h1>
      <div className="animal-animal">
        <img
          src={config.image}
          alt={`${animal.name} the ${config.name}`}
          className="animal-image"
        />
        <h2>{animal.name}</h2>
      </div>
      <div className="animal-stats">
        <div className="stat">
          <strong>Hunger:</strong>
          <StatMeter value={animal.hunger} color="#ff9800" />
          <button
            className="action-button"
            onClick={() => onFeed(animal.id, animal)}
          >
            Feed
          </button>
        </div>
        <div className="stat">
          <strong>Happiness:</strong>
          <StatMeter value={animal.happiness} color="#4caf50" />
          <button
            className="action-button"
            onClick={() => onPlay(animal.id, animal)}
          >
            Play
          </button>
        </div>
        <div className="stat">
          <strong>Sleep:</strong>
          <StatMeter value={animal.sleepiness} color="#2196f3" />
          <button
            className="action-button"
            onClick={() => onRest(animal.id, animal)}
          >
            Rest
          </button>
        </div>
      </div>
      <Button
        variant="danger"
        size="small"
        onClick={() => onRemove(animal.id)}
        className="remove-button"
      >
        Remove
      </Button>
    </div>
  );
};
