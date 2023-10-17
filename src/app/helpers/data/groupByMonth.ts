import { Transaction } from "lib/app/lib/types/transaction";
import { SpendType } from "./groupBySpend";

export interface GroupedByMonth {
  month: string;
  totalAmount: number;
  transactions: Transaction[];
  spendTypes?: SpendType[];
}

export function groupObjectsByMonth(objects: Transaction[]): GroupedByMonth[] {
  // console.log("bingo");
  const groupedData: { [key: string]: GroupedByMonth } = {};

  objects.forEach((transaction) => {
    const { date, amount } = transaction;
    const [year, month, day] = date.split("-");
    const monthString = `${year}-${month.padStart(2, "0")}`;
    if (!groupedData[monthString]) {
      groupedData[monthString] = {
        month: monthString,
        totalAmount: 0,
        transactions: [],
      };
    }
    groupedData[monthString].totalAmount += amount;
    groupedData[monthString].transactions.push(transaction);
  });

  return Object.values(groupedData);
}
