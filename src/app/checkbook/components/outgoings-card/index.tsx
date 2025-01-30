import { useEffect, useState } from "react";
import OutgoingCard from "../outgoing-card";
import classNames from "classnames";

import styles from "./styles.module.scss";
import { Breakdown } from "lib/app/lib/types/breakdown";

// // Example usage:
// let breakdown = convertValue(1000, BreakdownInterval.MONTHLY);
// console.log(breakdown);

interface OutgoingsCardProps {
  outgoings: Breakdown[];
}

export const OutgoingsCard = (props: OutgoingsCardProps) => {
  const { outgoings = [] } = props;

  return (
    <div className={classNames(styles.outgoingCardList)}>
      <OutgoingCard />
      {outgoings.map((og) => (
        <OutgoingCard breakdown={og} key={og.id} />
      ))}
    </div>
  );
};
