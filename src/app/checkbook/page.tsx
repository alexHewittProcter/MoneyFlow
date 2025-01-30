"use client";
import { ButtonGroup, Button } from "react-bootstrap";
import AppLayout from "../lib/components/layout/AppLayout";
import { SalaryCard } from "./components/salary-card";
import { useMemo, useState } from "react";
import { OutgoingsCard } from "./components/outgoings-card";

import styles from "./styles.module.scss";
import { BreakdownIntervalContext } from "./type";
import { BalanceCard } from "./components/balance-card";
import { Breakdown } from "../lib/types/breakdown";
import { fetcher } from "../lib/func/fetcher";
import useSWR from "swr";

const CheckbookPage = () => {
  const { data, error, isLoading } = useSWR(
    ["api/checkbook/breakdowns"],
    fetcher
  );

  console.log(data);

  const [breakdownInterval, setBreakdownInterval] = useState("monthly");

  const outgoings = useMemo(
    () => (data ? data.breakdowns.filter((bd) => bd.title !== "Salary") : []),
    [data]
  );

  const salary = useMemo(
    () =>
      data ? data.breakdowns.filter((bd) => bd.title === "Salary")[0] : null,
    [data]
  );

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
          <OutgoingsCard outgoings={outgoings} />
          <SalaryCard salary={salary} />
          <BalanceCard salary={salary} outgoings={outgoings} />
        </div>
      </BreakdownIntervalContext.Provider>
    </AppLayout>
  );
};

export default CheckbookPage;
