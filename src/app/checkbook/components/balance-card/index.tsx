import { useContext, useMemo } from "react";
import { Breakdown, BreakdownIntervalContext } from "../../type";

interface BalanceCardProps {
  outgoings: Breakdown[];
  salary: Breakdown;
}

export const BalanceCard = (props: BalanceCardProps) => {
  const { outgoings, salary } = props;

  const breakdownInterval = useContext(BreakdownIntervalContext);

  const outgoingsForInterval = useMemo(() => {
    return outgoings
      .map((og) => og[breakdownInterval])
      .reduce((prev, curr) => prev + curr, 0);
  }, [outgoings, breakdownInterval]);

  const salaryForInterval = useMemo(
    () => (salary ? salary[breakdownInterval] : 0),
    [salary, breakdownInterval]
  );

  const balance = useMemo(
    () => salaryForInterval - outgoingsForInterval,
    [outgoingsForInterval, salaryForInterval]
  );

  return (
    <div className="card">
      <p className="h3">Income: {salaryForInterval}</p>
      <p className="h3">Outgoings: {outgoingsForInterval}</p>
      <p className="h3">Balance: {balance}</p>
    </div>
  );
};
