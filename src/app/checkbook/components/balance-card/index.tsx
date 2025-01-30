import { useContext, useMemo } from "react";
import { BreakdownIntervalContext } from "../../type";
import { Breakdown } from "lib/app/lib/types/breakdown";

interface BalanceCardProps {
  outgoings: Breakdown[];
  salary: Breakdown;
}

export const BalanceCard = (props: BalanceCardProps) => {
  const { outgoings = [], salary } = props;

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
    <div className="card w-25">
      <p className="h3 text-success">Income: {salaryForInterval}</p>
      <p className="h3 text-danger">Outgoings: {outgoingsForInterval}</p>
      <p className={`h3 text-${balance > 0 ? "success" : "danger"}`}>
        Balance: {balance}
      </p>
    </div>
  );
};
