"use client";
import { ButtonGroup, Button } from "react-bootstrap";
import AppLayout from "../lib/components/layout/AppLayout";
import { SalaryCard } from "./components/salary-card";
import { useState } from "react";
import { OutgoingsCard } from "./components/outgoings-card";

import styles from "./styles.module.scss";
import { Breakdown, BreakdownIntervalContext } from "./type";
import { BalanceCard } from "./components/balance-card";

const CheckbookPage = () => {
  const [breakdownInterval, setBreakdownInterval] = useState("monthly");

  const [outgoings, setOutgoings] = useState<Breakdown[]>([]);
  const [salary, setSalary] = useState<Breakdown>();

  console.log(outgoings);

  return (
    <AppLayout>
      <BreakdownIntervalContext.Provider value={breakdownInterval}>
        <div className="display-1">Checkbook</div>
        <ButtonGroup>
          <Button
            variant="light"
            active={breakdownInterval === "daily"}
            onClick={() => setBreakdownInterval("daily")}
          >
            Daily
          </Button>
          <Button
            variant="light"
            active={breakdownInterval === "weekly"}
            onClick={() => setBreakdownInterval("weekly")}
          >
            Weekly
          </Button>
          <Button
            variant="light"
            active={breakdownInterval === "monthly"}
            onClick={() => setBreakdownInterval("monthly")}
          >
            Monthly
          </Button>
          <Button
            variant="light"
            active={breakdownInterval === "yearly"}
            onClick={() => setBreakdownInterval("yearly")}
          >
            Yearly
          </Button>
        </ButtonGroup>
        <div className={styles.container}>
          <OutgoingsCard onChange={setOutgoings} />
          <SalaryCard onChange={setSalary} />
          <BalanceCard salary={salary} outgoings={outgoings} />
        </div>
      </BreakdownIntervalContext.Provider>
    </AppLayout>
  );
};

export default CheckbookPage;
