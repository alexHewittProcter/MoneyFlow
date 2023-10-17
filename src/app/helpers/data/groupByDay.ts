import { Transaction } from "lib/app/lib/types/transaction";
import { SpendType } from "./groupBySpend";

export interface GroupedByDay {
  day: string;
  totalAmount: number;
  transactions: Transaction[];
  spendTypes?: SpendType[];
}

export function groupObjectsByDay(objects: Transaction[]): GroupedByDay[] {
  const groupedData: { [key: string]: GroupedByDay } = {};

  objects.forEach((transaction) => {
    const { date, amount } = transaction;
    const [year, month, day] = date.split("-");
    const dayString = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}`;
    if (!groupedData[dayString]) {
      groupedData[dayString] = {
        day: dayString,
        totalAmount: 0,
        transactions: [],
      };
    }
    groupedData[dayString].totalAmount += amount;
    groupedData[dayString].transactions.push(transaction);
  });

  return Object.values(groupedData);
}
