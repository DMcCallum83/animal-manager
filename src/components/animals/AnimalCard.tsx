import { Animal, HungerLevel } from "../../types";
import { StatMeter } from "./StatMeter";
import { Button } from "../ui/Button";
import { getAnimalTypeConfig } from "../../data/animalConfigs";
import { getHungerLevel, isHungerUrgent } from "../../utils/gameLogic";

import "./AnimalCard.scss";

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
  const hungerLevel = getHungerLevel(animal.hunger);
  const isUrgentlyHungry = isHungerUrgent(animal.hunger);

  const getHungerIcon = () => {
    switch (hungerLevel) {
      case HungerLevel.SATIATED:
        return "😫";
      case HungerLevel.HUNGRY:
        return "😋";
      case HungerLevel.MODERATE:
        return "😐";
      case HungerLevel.FULL:
        return "😊";
      case HungerLevel.STUFFED:
        return "🤤";
      default:
        return "🍽️";
    }
  };

  const getHungerClass = () => {
    if (isUrgentlyHungry) return "urgent-hunger";
    if (
      hungerLevel === HungerLevel.SATIATED ||
      hungerLevel === HungerLevel.HUNGRY
    ) {
      return "hungry";
    }
    return "";
  };

  return (
    <div className={`animal-card-container ${getHungerClass()}`}>
      <h1 className="animal-card-header">
        {animal.name}
        {isUrgentlyHungry && <span className="hunger-warning">⚠️</span>}
      </h1>
      <div className="animal-card-image-wrapper">
        <img
          src={config.image}
          alt={`${animal.name} the ${config.name}`}
          className="animal-image"
        />
        <h2>{config.name}</h2>
      </div>
      <div className="animal-card-stats">
        <div className={`stat hunger-stat ${getHungerClass()}`}>
          <div className="stat-header">
            <strong>Hunger {getHungerIcon()}</strong>
            {isUrgentlyHungry && (
              <span className="urgent-indicator">URGENT!</span>
            )}
          </div>
          <StatMeter value={animal.hunger} statusReversed />
          <button
            className={`action-button ${isUrgentlyHungry ? "urgent-feed" : ""}`}
            onClick={() => onFeed(animal.id, animal)}
          >
            {isUrgentlyHungry ? "🍖 Feed Now!" : "Feed"}
          </button>
        </div>
        <div className="stat">
          <strong>Happiness</strong>
          <StatMeter value={animal.happiness} />
          <button
            className="action-button"
            onClick={() => onPlay(animal.id, animal)}
          >
            Play
          </button>
        </div>
        <div className="stat">
          <strong>Sleep</strong>
          <StatMeter value={animal.sleepiness} statusReversed />
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
        className="animal-card-remove-button"
      >
        Remove
      </Button>
    </div>
  );
};
