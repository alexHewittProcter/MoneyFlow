import { Transaction } from "../types/transaction";

export interface DateRange {
  startDate: string;
  endDate: string;
}

function daysBetweenDates(startDate: Date, endDate: Date): number {
  const oneDayInMillis = 24 * 60 * 60 * 1000;
  return (
    Math.round((endDate.getTime() - startDate.getTime()) / oneDayInMillis) + 1
  );
}

export function averageTransactionPerPeriod(
  transactions: Transaction[],
  dateRange: DateRange,
  periodInDays: number
): number {
  const startDate = new Date(dateRange.startDate);
  const endDate = new Date(dateRange.endDate);

  const totalDays = daysBetweenDates(startDate, endDate);
  const relevantTransactions = transactions.filter(
    (tx) => new Date(tx.date) >= startDate && new Date(tx.date) <= endDate
  );

  const totalAmount = relevantTransactions.reduce(
    (sum, tx) => sum + tx.amount,
    0
  );
  const numberOfPeriods = totalDays / periodInDays;

  return totalAmount / numberOfPeriods;
}

export function averagePerDay(
  transactions: Transaction[],
  dateRange: DateRange
): number {
  return averageTransactionPerPeriod(transactions, dateRange, 1);
}

export function averagePerWeek(
  transactions: Transaction[],
  dateRange: DateRange
): number {
  return averageTransactionPerPeriod(transactions, dateRange, 7);
}

export function averagePerMonth(
  transactions: Transaction[],
  dateRange: DateRange
): number {
  return averageTransactionPerPeriod(transactions, dateRange, 30); // Approximate month as 30 days
}

export function averagePer30Days(
  transactions: Transaction[],
  dateRange: DateRange
): number {
  return averageTransactionPerPeriod(transactions, dateRange, 30);
}

export function averagePer60Days(
  transactions: Transaction[],
  dateRange: DateRange
): number {
  return averageTransactionPerPeriod(transactions, dateRange, 60);
}

export function averagePer90Days(
  transactions: Transaction[],
  dateRange: DateRange
): number {
  return averageTransactionPerPeriod(transactions, dateRange, 90);
}

// If you want to test the functions within the module, you can use the example below:

// const transactionsExample: Transaction[] = [
//     { date: "2023-01-01", name: "Shop1", amount: 50, ref: "R001", account: "A1" },
//     { date: "2023-01-02", name: "Shop2", amount: 30, ref: "R002", account: "A1" },
//     // ... other transactions
// ];
// const myDateRange: DateRange = {
//     startDate: "2023-01-01",
//     endDate: "2023-01-31"
// };

// console.log(averagePerDay(transactionsExample, myDateRange));
// console.log(averagePerWeek(transactionsExample, myDateRange));
// console.log(averagePerMonth(transactionsExample, myDateRange));
// console.log(averagePer30Days(transactionsExample, myDateRange));
// console.log(averagePer60Days(transactionsExample, myDateRange));
// console.log(averagePer90Days(transactionsExample, myDateRange));
