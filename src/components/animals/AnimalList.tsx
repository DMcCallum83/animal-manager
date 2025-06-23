import React from "react";
import { AnimalCard } from "./AnimalCard";
import { Animal } from "../../types";

interface AnimalListProps {
  animals: Animal[];
  onFeed: (animalId: string, animal: Animal) => void;
  onPlay: (animalId: string, animal: Animal) => void;
  onRest: (animalId: string, animal: Animal) => void;
  onRemove: (animalId: string) => void;
}

export const AnimalList: React.FC<AnimalListProps> = ({
  animals,
  onFeed,
  onPlay,
  onRest,
  onRemove,
}) => {
  return (
    <div className="animal-page">
      <div className="animal-cards-wrapper">
        {animals.map((animal) => (
          <AnimalCard
            key={animal.id}
            animal={animal}
            onFeed={onFeed}
            onPlay={onPlay}
            onRest={onRest}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
};
