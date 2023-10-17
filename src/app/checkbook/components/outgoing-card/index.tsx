import React, { useContext, useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import { Button, ButtonGroup } from "react-bootstrap";
import { Breakdown, BreakdownIntervalContext } from "../../type";
import { convertValue } from "../../func";

interface OutgoingCardProps {
  breakdown?: Breakdown;
  onChange?: (breakdown: Breakdown) => void;
}

const OutgoingCard = (props: OutgoingCardProps) => {
  const { breakdown, onChange = (_) => {} } = props;
  const breakdownInterval = useContext(BreakdownIntervalContext);
  const [title, setTitle] = useState("");
  const [numberValue, setNumberValue] = useState(0);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (breakdown) {
      setTitle(breakdown.title);
    }
  }, [breakdown]);

  useEffect(() => {
    if (breakdown) {
      setNumberValue(breakdown[breakdownInterval]);
    }
  }, [breakdown, breakdownInterval]);

  const onSave = () => {
    onChange({
      ...breakdown,
      ...convertValue(numberValue, breakdownInterval),
      title,
    });
    if (!breakdown) {
      setTitle("");
      setNumberValue(0);
    }
    setIsEditing(false);
  };

  const onRevert = () => {
    if (breakdown) {
      setTitle(breakdown.title);
      setNumberValue(breakdown[breakdownInterval]);
    } else {
      setTitle("");
      setNumberValue(0);
    }
    setIsEditing(false);
  };

  return (
    <Card style={{ width: "45%", minWidth: "45%" }}>
      <Card.Body>
        <Form>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setIsEditing(true);
              }}
            />
          </Form.Group>

          <Form.Group controlId="formNumber">
            <Form.Label>Number</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter number"
              value={numberValue}
              onChange={(e) => {
                setNumberValue(parseFloat(e.target.value));
                setIsEditing(true);
              }}
            />
          </Form.Group>
        </Form>
      </Card.Body>
      {isEditing && (
        <ButtonGroup>
          <Button onClick={onRevert}>Cancel</Button>
          <Button onClick={onSave}>Save</Button>
        </ButtonGroup>
      )}
    </Card>
  );
};

export default OutgoingCard;
