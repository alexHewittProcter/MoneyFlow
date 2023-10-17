import { useContext, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import TaxCalculator from "tax-calculator-uk";
import { Breakdown, BreakdownIntervalContext } from "../../type";
import { BreakdownInterval } from "../../func";

const options = {
  age: 26,
  studentLoanPlan: 2,
  blind: false,
  pensionPercentage: 5,
};

interface SalaryCardProps {
  onChange: (bd: Breakdown) => void;
}

export const SalaryCard = (props: SalaryCardProps) => {
  const { onChange = () => {} } = props;
  const breakdownInterval = useContext(BreakdownIntervalContext);
  const [income, setIncome] = useState(0);
  const [afterTaxIncome, setAfterTaxIncome] =
    useState<{ [bi in BreakdownInterval]: number }>();

  useEffect(() => {
    const incomeTax = TaxCalculator(income, options).getTaxBreakdown();
    setAfterTaxIncome(incomeTax.netIncome);
  }, [income]);

  useEffect(() => {
    if (afterTaxIncome) {
      onChange({ ...afterTaxIncome, title: "Salary" });
    }
  }, [afterTaxIncome, onChange]);

  return (
    <div className="card w-50">
      <h1>Salary</h1>
      <Form.Control
        placeholder="Enter your salary"
        size="lg"
        type="number"
        onChange={(e) => setIncome(parseFloat(e.target.value))}
      />
      {afterTaxIncome && (
        <p className="display-3">{afterTaxIncome[breakdownInterval]}</p>
      )}
    </div>
  );
};
