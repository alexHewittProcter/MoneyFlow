import { Transaction } from "lib/app/lib/types/transaction";

interface DateAmount {
  date: string;
  amount: number;
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
