import React, { useState } from "react";
import { AnimalType } from "../../types";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { getAnimalTypeConfig } from "../../data/animalConfigs";
import { validateAnimalName } from "../../utils/gameLogic";

import "./AddAnimalModal.scss";

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
  const [animalName, setAnimalName] = useState("");
  const [selectedType, setSelectedType] = useState<AnimalType>(AnimalType.DOG);
  const [nameError, setNameError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate name
    if (!validateAnimalName(animalName)) {
      setNameError("Name must be between 1 and 12 characters");
      return;
    }

    // Try to add animal
    const success = onAdd(animalName, selectedType);
    if (success) {
      resetFormAndCloseModal();
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setAnimalName(newName);
    if (nameError) {
      setNameError("");
    }
  };

  const resetFormAndCloseModal = () => {
    setAnimalName("");
    setSelectedType(AnimalType.DOG);
    setNameError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetFormAndCloseModal}
      title="Add New Animal"
    >
      <form onSubmit={handleSubmit} className="add-animal-form">
        <Input
          label="Animal Name"
          value={animalName}
          onChange={handleNameChange}
          placeholder="Enter animal name..."
          error={nameError}
        />

        <div className="animal-type-selection">
          <label className="animal-type-label" htmlFor="animalType">
            Animal Type
          </label>
          <div className="animal-type-options" id="animalType">
            {Object.values(AnimalType).map((type) => {
              const config = getAnimalTypeConfig(type);
              return (
                <div
                  key={type}
                  className={`animal-type-option ${selectedType === type ? "selected" : ""}`}
                  onClick={() => setSelectedType(type)}
                  tabIndex={0}
                >
                  <div className="animal-type-option-content">
                    <img
                      src={config.image}
                      alt={config.name}
                      className="animal-type-image"
                    />
                    <span>{config.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-actions">
          <Button type="button" variant="danger" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!animalName || !selectedType}
          >
            Add Animal
          </Button>
        </div>
      </form>
    </Modal>
  );
};
