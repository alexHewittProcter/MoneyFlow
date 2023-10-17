import { filterArrayByDateRange } from "lib/app/helpers/data/filterByDate";
import { Spend, getData } from "lib/app/helpers/data/getData";
import { groupObjectsByDay } from "lib/app/helpers/data/groupByDay";
import {
  GroupedByMonth,
  groupObjectsByMonth,
} from "lib/app/helpers/data/groupByMonth";
import { SpendType, groupBySpendType } from "lib/app/helpers/data/groupBySpend";
import { sortObjectsByAmount } from "lib/app/helpers/data/sortByAmount";
import { getURLParams } from "lib/app/lib/func/server/getURLParams";
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

  const yourTransactions = await transactions.find(query).toArray();

  const filteredTransactions = yourTransactions.filter(
    (transaction: Transaction) => transaction.amount > 0
  );

  conn.close();

  const monthGroup = groupObjectsByMonth(
    filteredTransactions as unknown as Transaction[]
  ).map((month: GroupedByMonth) => ({
    ...month,
    spendTypes: groupBySpendType(month.transactions).spendTypes,
  }));

  const groupBySpendTypesReturn = groupBySpendType(
    filteredTransactions as unknown as Transaction[]
  );

  return new Response(
    JSON.stringify({
      months: monthGroup,
      spendTypes: groupBySpendTypesReturn.spendTypes.map(
        (spendType: SpendType) => {
          return {
            ...spendType,
            months: groupObjectsByMonth(spendType.transactions).reverse(),
            days: groupObjectsByDay(spendType.transactions).reverse(),
          };
        }
      ),
      otherTransactions: groupBySpendTypesReturn.otherTransactions,
    })
  );
}
