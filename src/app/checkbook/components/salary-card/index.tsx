import { useContext, useEffect, useState } from "react";
import { Button, ButtonGroup, Form } from "react-bootstrap";
import TaxCalculator from "tax-calculator-uk";
import { BreakdownIntervalContext } from "../../type";
import { BreakdownInterval } from "../../func";
import { Breakdown } from "lib/app/lib/types/breakdown";
import { addBreakdown, updateBreakdown } from "../../actions";

const options = {
  age: 26,
  studentLoanPlan: 2,
  blind: false,
  pensionPercentage: 5,
};

interface SalaryCardProps {
  salary?: Breakdown;
}

export const SalaryCard = (props: SalaryCardProps) => {
  const { salary } = props;
  const breakdownInterval = useContext(BreakdownIntervalContext);
  const [isEditing, setIsEditing] = useState(false);

  const [income, setIncome] = useState(0);
  const [afterTaxIncome, setAfterTaxIncome] =
    useState<{ [bi in BreakdownInterval]: number }>();

  useEffect(() => {
    const incomeTax = TaxCalculator(income, options).getTaxBreakdown();
    setAfterTaxIncome(incomeTax.netIncome);
    setIsEditing(true);
  }, [income]);

  useEffect(() => {
    if (!!salary) {
      setIncome(salary?.raw!);
    }
  }, [salary]);

  const onSave = () => {
    if (salary) {
      updateBreakdown({
        ...salary,
        ...afterTaxIncome,
        raw: income,
        title: "Salary",
      });
    } else {
      addBreakdown({
        ...afterTaxIncome,
        raw: income,
        title: "Salary",
      } as Breakdown);
    }
    setIsEditing(false);
  };

  const onRevert = () => {
    if (salary) {
      setIncome(salary.raw!);
    } else {
      setIncome(0);
    }
    setIsEditing(false);
  };
  return (
    <div className="card w-50">
      <h1>Salary</h1>
      <Form.Control
        placeholder="Enter your salary"
        size="lg"
        type="number"
        onChange={(e) => setIncome(parseFloat(e.target.value))}
        value={income}
      />
      {afterTaxIncome && (
        <p className="display-3">{afterTaxIncome[breakdownInterval]}</p>
      )}
      {isEditing && (
        <ButtonGroup>
          <Button onClick={onRevert}>Cancel</Button>
          <Button onClick={onSave}>Save</Button>
        </ButtonGroup>
      )}
    </div>
  );
};
