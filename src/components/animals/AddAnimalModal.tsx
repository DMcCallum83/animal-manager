import React, { useState } from "react";
import { AnimalType } from "../../types";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { getAnimalTypeConfig } from "../../data/animalConfigs";
import { validateAnimalName } from "../../utils/gameLogic";

interface AddAnimalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, type: AnimalType) => boolean;
}

export const AddAnimalModal: React.FC<AddAnimalModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState("");
  const [selectedType, setSelectedType] = useState<AnimalType>(AnimalType.DOG);
  const [nameError, setNameError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate name
    if (!validateAnimalName(name)) {
      setNameError("Name must be between 1 and 50 characters");
      return;
    }

    // Try to add animal
    const success = onAdd(name, selectedType);
    if (success) {
      // Reset form and close modal
      setName("");
      setSelectedType(AnimalType.DOG);
      setNameError("");
      onClose();
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    if (nameError) {
      setNameError("");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Animal">
      <form onSubmit={handleSubmit} className="add-animal-form">
        <Input
          label="Animal Name"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter animal name..."
          error={nameError}
          required
        />

        <div className="animal-type-selection">
          <label className="animal-type-label">Animal Type</label>
          <div className="animal-type-options">
            {Object.values(AnimalType).map((type) => {
              const config = getAnimalTypeConfig(type);
              return (
                <label key={type} className="animal-type-option">
                  <input
                    type="radio"
                    name="animalType"
                    value={type}
                    checked={selectedType === type}
                    onChange={() => setSelectedType(type)}
                  />
                  <div className="animal-type-option-content">
                    <img
                      src={config.image}
                      alt={config.name}
                      className="animal-type-image"
                    />
                    <span>{config.name}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div className="modal-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Add Animal
          </Button>
        </div>
      </form>
    </Modal>
  );
};
