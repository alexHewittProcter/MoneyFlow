import { PropsWithChildren, useEffect, useState } from "react";
import { Button } from "react-bootstrap";

import styles from "./styles.module.scss";
import { RangeKeyDict, DateRangePicker, Range } from "react-date-range";
import { SelectionContext } from "lib/app/lib/context";

const today = new Date();
const firstDayOfCurrentMonth = new Date(
  today.getFullYear(),
  today.getMonth(),
  1
);

class DateRange {
  startDate: Date;
  endDate: Date;

  constructor(startDate: Date, endDate: Date) {
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

function lastThreeMonths(): DateRange {
  let today = new Date();
  let threeMonthsAgo = new Date(today);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  return new DateRange(threeMonthsAgo, today);
}

function lastSixMonths(): DateRange {
  let today = new Date();
  let sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return new DateRange(sixMonthsAgo, today);
}

function lastYear(): DateRange {
  let today = new Date();
  let oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  return new DateRange(oneYearAgo, today);
}

function allTime(): DateRange {
  let today = new Date();
  let startOfTime = new Date(0); // This will set the date to the UNIX epoch (1970-01-01)
  return new DateRange(startOfTime, today);
}

// // Test the functions
// console.log(lastThreeMonths()); // Returns the date range for the last 3 months
// console.log(lastSixMonths()); // Returns the date range for the last 6 months
// console.log(lastYear()); // Returns the date range for the last year
// console.log(allTime()); // Returns the date range for all time

export const QueryBox = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(false);
  // const title = "This month so far....";

  const [title, setTitle] = useState("This month so far....");
  const [selectionRange, setSelectionRange] = useState<Range>({
    startDate: firstDayOfCurrentMonth,
    endDate: new Date(),
    key: "selection",
  });

  useEffect(() => {
    const timeFrameLength = "Current_Month";

    switch (selectionRange) {
    }
  }, [selectionRange]);

  const handleSelect = (date: RangeKeyDict) => {
    Object.keys(date).forEach((key) => {
      setSelectionRange(date[key] as Range);
    });
  };

  // console.log(selectionRange);

  useEffect(() => {
    // console.log(selectionRange);
    if (selectionRange.startDate && selectionRange.endDate) {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      const startOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay())
      );
      const endOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay() + 6)
      );

      const formatDateString = (date: Date) =>
        `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

      let description = "";
      if (
        formatDateString(selectionRange.startDate) ===
          formatDateString(startOfMonth) &&
        selectionRange.endDate.getMonth() === today.getMonth() &&
        selectionRange.endDate.getFullYear() === today.getFullYear()
      ) {
        description = "The month so far.... 💰";
      } else if (
        formatDateString(selectionRange.startDate) ===
          formatDateString(startOfWeek) &&
        formatDateString(selectionRange.endDate) === formatDateString(endOfWeek)
      ) {
        description = "The week so far... ⏳";
      } else {
        description = `From ${formatDateString(
          selectionRange.startDate
        )} to ${formatDateString(selectionRange.endDate)} 📅`;
      }

      setTitle(description);
    }
  }, [selectionRange]);
  // console.log("Selection range");

  // console.log(selectionRange);

  return (
    <div>
      <div className="text-center">
        <Button variant="light" className="w-100">
          <p className="fs-1 mb-0" onClick={() => setOpen((prev) => !prev)}>
            {title}
          </p>
        </Button>
        {open && (
          <DateRangePicker
            ranges={[selectionRange]}
            onChange={handleSelect}
            months={1}
            direction="horizontal"
          />
        )}
      </div>
      <div className="m-4 d-flex justify-content-around">
        <Button
          variant="light"
          onClick={() => setSelectionRange(lastThreeMonths())}
        >
          Last 3 months
        </Button>
        <Button
          variant="light"
          onClick={() => setSelectionRange(lastSixMonths())}
        >
          Last 6 months
        </Button>
        <Button variant="light" onClick={() => setSelectionRange(lastYear())}>
          Last Year
        </Button>
        <Button variant="light" onClick={() => setSelectionRange(allTime())}>
          Of all time
        </Button>
      </div>
      <SelectionContext.Provider value={selectionRange}>
        {children}
      </SelectionContext.Provider>
    </div>
  );
};
