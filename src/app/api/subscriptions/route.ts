import { spendTypes } from "lib/app/helpers/data/groupBySpend";
import { getURLParams } from "lib/app/lib/func/server/getURLParams";
import { findMonthlySubscriptions } from "lib/app/lib/func/subscriptions";
import { getConnection } from "lib/app/lib/mongo";
import { Transaction } from "lib/app/lib/types/transaction";

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

  const yourTransactions: Transaction[] = (await transactions
    .find(query)
    .toArray()) as unknown as Transaction[];

  conn.close();

  const filteredTransactions: Transaction[] = yourTransactions.filter(
    (transaction: Transaction) => transaction.amount > 0
  );

  return new Response(
    JSON.stringify({
      subscriptions: findMonthlySubscriptions(spendTypes, filteredTransactions),
    })
  );
}
