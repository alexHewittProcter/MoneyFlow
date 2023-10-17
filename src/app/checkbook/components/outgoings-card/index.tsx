import { useEffect, useState } from "react";
import { Breakdown } from "../../type";
import OutgoingCard from "../outgoing-card";
import { v4 as uuidv4 } from "uuid";
import classNames from "classnames";

import styles from "./styles.module.scss";

// // Example usage:
// let breakdown = convertValue(1000, BreakdownInterval.MONTHLY);
// console.log(breakdown);

interface OutgoingsCardProps {
  onChange: (bd: Breakdown[]) => void;
}

export const OutgoingsCard = (props: OutgoingsCardProps) => {
  const { onChange = (_) => {} } = props;
  const [outgoings, setOutgoings] = useState<Breakdown[]>([]);

  useEffect(() => {
    onChange(outgoings);
    console.log(outgoings);
  }, [onChange, outgoings]);

  return (
    <div className={classNames(styles.outgoingCardList)}>
      <OutgoingCard
        onChange={(bd) =>
          setOutgoings((prevOgs) => [{ ...bd, id: uuidv4() }, ...prevOgs])
        }
      />
      {outgoings.map((og) => (
        <OutgoingCard
          breakdown={og}
          key={og.id}
          onChange={(bd) => {
            setOutgoings((prevOgs) => {
              prevOgs[prevOgs.findIndex((ogBd) => ogBd.id === og.id)] = bd;
              return [...prevOgs];
            });
          }}
        />
      ))}
    </div>
  );
};
