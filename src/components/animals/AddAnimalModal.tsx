import React, { useReducer } from "react";
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

// Form state type
type FormState = {
  animalName: string;
  selectedType: AnimalType;
  nameError: string;
};

// Form action types
type FormAction =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_TYPE"; payload: AnimalType }
  | { type: "SET_ERROR"; payload: string }
  | { type: "RESET_FORM" };

// Initial form state
const initialFormState: FormState = {
  animalName: "",
  selectedType: AnimalType.DOG,
  nameError: "",
};

// Form reducer
const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "SET_NAME":
      return {
        ...state,
        animalName: action.payload,
        nameError: state.nameError ? "" : state.nameError, // Clear error when typing
      };
    case "SET_TYPE":
      return { ...state, selectedType: action.payload };
    case "SET_ERROR":
      return { ...state, nameError: action.payload };
    case "RESET_FORM":
      return initialFormState;
    default:
      return state;
  }
};

export const AddAnimalModal: React.FC<AddAnimalModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [formState, dispatch] = useReducer(formReducer, initialFormState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate name
    if (!validateAnimalName(formState.animalName)) {
      dispatch({
        type: "SET_ERROR",
        payload: "Name must be between 1 and 12 characters",
      });
      return;
    }

    // Try to add animal
    const success = onAdd(formState.animalName, formState.selectedType);
    if (success) {
      resetFormAndCloseModal();
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    dispatch({ type: "SET_NAME", payload: newName });
  };

  const handleTypeSelect = (type: AnimalType) => {
    dispatch({ type: "SET_TYPE", payload: type });
  };

  const resetFormAndCloseModal = () => {
    dispatch({ type: "RESET_FORM" });
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
          value={formState.animalName}
          onChange={handleNameChange}
          placeholder="Enter animal name..."
          error={formState.nameError}
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
                  className={`animal-type-option ${formState.selectedType === type ? "selected" : ""}`}
                  onClick={() => handleTypeSelect(type)}
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
            disabled={!formState.animalName || !formState.selectedType}
          >
            Add Animal
          </Button>
        </div>
      </form>
    </Modal>
  );
};
