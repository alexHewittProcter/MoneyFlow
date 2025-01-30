import { Transaction } from "lib/app/lib/types/transaction";

interface DateAmount {
  date: string;
  amount: number;
}

export function groupTransactionsByWeek(
  transactions: Transaction[]
): DateAmount[] {
  // Create a map to accumulate amounts by week
  const weekAmountMap: { [key: string]: number } = {};

  for (const transaction of transactions) {
    const weekStartDate = getWeekStartDate(new Date(transaction.date)); // Get the starting Monday date of the week

    const week = weekStartDate.toISOString().slice(0, 10); // Format the date as YYYY-MM-DD

    if (weekAmountMap[week]) {
      weekAmountMap[week] += transaction.amount;
    } else {
      weekAmountMap[week] = transaction.amount;
    }
  }

  // Convert the map to an array of DateAmount objects
  const groupedTransactions: DateAmount[] = [];
  for (const week in weekAmountMap) {
    groupedTransactions.push({
      date: week,
      amount: weekAmountMap[week],
    });
  }

  return groupedTransactions;
}

// Helper function to get the starting Monday date of a week
function getWeekStartDate(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust the date to the nearest Monday
  return new Date(date.setDate(diff));
}

export function groupTransactionsByMonth(
  transactions: Transaction[]
): DateAmount[] {
  // Create a map to accumulate amounts by month
  const monthAmountMap: { [key: string]: number } = {};

  for (const transaction of transactions) {
    const month = transaction.date.slice(0, 7); // Extract the year and month from the date

    if (monthAmountMap[month]) {
      monthAmountMap[month] += transaction.amount;
    } else {
      monthAmountMap[month] = transaction.amount;
    }
  }

  // Convert the map to an array of DateAmount objects
  const groupedTransactions: DateAmount[] = [];
  for (const month in monthAmountMap) {
    groupedTransactions.push({
      date: month,
      amount: monthAmountMap[month],
    });
  }

  return groupedTransactions;
}

export function groupTransactionsByDate(
  transactions: Transaction[]
): DateAmount[] {
  // Create a map to accumulate amounts by date
  const dateAmountMap: { [key: string]: number } = {};

  for (const transaction of transactions) {
    if (dateAmountMap[transaction.date]) {
      dateAmountMap[transaction.date] += transaction.amount;
    } else {
      dateAmountMap[transaction.date] = transaction.amount;
    }
  }

  // Convert the map to an array of DateAmount objects
  const groupedTransactions: DateAmount[] = [];
  for (const date in dateAmountMap) {
    groupedTransactions.push({
      date: date,
      amount: dateAmountMap[date],
    });
  }

  return groupedTransactions;
}

// // Example usage:
// const transactions: Transaction[] = [
//   {
//     date: "2023-08-18",
//     name: "Purchase A",
//     amount: 100,
//     ref: "REF001",
//     account: "ACC001",
//   },
//   {
//     date: "2023-08-18",
//     name: "Purchase B",
//     amount: 50,
//     ref: "REF002",
//     account: "ACC002",
//   },
//   {
//     date: "2023-08-19",
//     name: "Purchase C",
//     amount: 30,
//     ref: "REF003",
//     account: "ACC003",
//   },
// ];

// console.log(groupTransactionsByDate(transactions));
// // Outputs:
// // [
// //   { date: "2023-08-18", amount: 150 },
// //   { date: "2023-08-19", amount: 30 }
// // ]
