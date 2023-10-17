import { getURLParams } from "lib/app/lib/func/server/getURLParams";
import {
  averagePer90Days,
  averagePer30Days,
  averagePer60Days,
  averagePerDay,
  averagePerMonth,
  averagePerWeek,
} from "lib/app/lib/func/average-spend";
import { getConnection } from "lib/app/lib/mongo";
import { Transaction } from "lib/app/lib/types/transaction";

type NumberObject = { [key: string]: number };

export function roundValuesTo2DP(obj: NumberObject): NumberObject {
  const roundedObj: NumberObject = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      roundedObj[key] = parseFloat(obj[key].toFixed(2));
    }
  }

  return roundedObj;
}

export async function GET(request: Request) {
  const { startDate, endDate } = getURLParams(request.url);
  // console.log(startDate, endDate);

  const conn = getConnection();
  const db = conn.db();

  const transactions = db.collection("transactions");

  const query = {
    date: {
      // Assuming you have a 'date' field in your documents
      $gte: startDate,
      $lte: endDate,
    },
  };

  // console.log(query);

  // console.log(query);

  const yourTransactions = await transactions.find(query).toArray();

  conn.close();

  const filteredTransactions = yourTransactions.filter(
    (transaction: Transaction) => transaction.amount > 0
  );

  // calculate total
  const total =
    Math.round(
      100 *
        filteredTransactions.reduce((total, transaction) => {
          // console.log(total);
          // console.log(transaction);

          return total + transaction.amount;
        }, 0)
    ) / 100;

  const averages = {
    perDay: averagePerDay(filteredTransactions, { startDate, endDate }),
    perWeek: averagePerWeek(filteredTransactions, { startDate, endDate }),
    perMonth: averagePerMonth(filteredTransactions, { startDate, endDate }),
    per30Days: averagePer30Days(filteredTransactions, { startDate, endDate }),
    per60Days: averagePer60Days(filteredTransactions, { startDate, endDate }),
    per90Days: averagePer90Days(filteredTransactions, { startDate, endDate }),
  };

  return new Response(
    JSON.stringify({
      total,
      yourTransactions: filteredTransactions,
      averages: roundValuesTo2DP(averages),
    })
  );
}
