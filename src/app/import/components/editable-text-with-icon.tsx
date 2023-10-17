import React, { useState } from "react";

interface Props {
  text: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
}

const EditableTextWithIcon: React.FC<Props> = ({
  text,
  onChange,
  placeholder = "",
}) => {
  const [isEditing, setIsEditing] = useState(text ? false : true);
  const [currentText, setCurrentText] = useState(text);

  const handleIconOrTextClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    onChange(currentText);
  };

  const handleRevert = () => {
    setCurrentText(text);
    setIsEditing(false);
  };

  return (
    <div>
      {!isEditing ? (
        <span onClick={handleIconOrTextClick}>
          {/* Placeholder for icon, replace with your icon component or image */}
          <span role="img" aria-label="edit-icon">
            ✏️
          </span>
          {currentText}
        </span>
      ) : (
        <div>
          <input
            type="text"
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            placeholder={placeholder}
          />
          <button onClick={handleRevert}>Revert</button>
          <button onClick={handleSave}>Save</button>
        </div>
      )}
    </div>
  );
};

export default EditableTextWithIcon;
