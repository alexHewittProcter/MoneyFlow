import { getConnection } from "lib/app/lib/mongo";
import { Transaction } from "lib/app/lib/types/transaction";
import { ObjectId } from "mongodb";

const convertToRefs = (transactions: Transaction[]) => {
  return transactions.map((transaction: Transaction) => transaction.ref);
};

export async function POST(request: Request) {
  const { transactions } = await request.json();
  const conn = getConnection();
  const db = conn.db();

  const collection = db.collection("transactions");
  // await collection.deleteMany();
  // console.log(transactions);

  // Check if any duplicate transations
  const refs = convertToRefs(transactions);
  const duplicates = await collection.find({ ref: { $in: refs } }).toArray();
  //   console.log(duplicates);

  const duplicateRefs = convertToRefs(duplicates as unknown as Transaction[]);

  const transactionsToAdd = transactions.filter(
    (trans: Transaction) => !duplicateRefs.includes(trans.ref)
  );
  // console.log(transactionsToAdd);
  if (transactionsToAdd.length > 0) {
    await collection.insertMany(transactionsToAdd);
  }

  const yourTransactions = await collection.find().toArray();

  conn.close();

  return new Response(JSON.stringify({ transactions: yourTransactions }));
}
