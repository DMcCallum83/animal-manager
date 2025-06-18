import React, { useState } from "react";
import { Animal, AnimalType } from "../../types";
import { AnimalCard } from "./AnimalCard";
import { AddAnimalModal } from "./AddAnimalModal";

interface AnimalListProps {
  animals: Animal[];
  onFeed: (animalId: string, animal: Animal) => void;
  onPlay: (animalId: string, animal: Animal) => void;
  onRest: (animalId: string, animal: Animal) => void;
  onRemove: (animalId: string) => void;
  onAdd: (name: string, type: AnimalType) => boolean;
}

export const AnimalList: React.FC<AnimalListProps> = ({
  animals,
  onFeed,
  onPlay,
  onRest,
  onRemove,
  onAdd,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddAnimal = (name: string, type: AnimalType) => {
    return onAdd(name, type);
  };

  return (
    <div className="animal-page">
      <button onClick={() => setShowAddModal(true)}>Add Animal</button>

      <div className="animal-wrapper">
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

      <AddAnimalModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddAnimal}
      />
    </div>
  );
};
