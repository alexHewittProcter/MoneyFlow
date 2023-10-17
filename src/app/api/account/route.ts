import { getConnection } from "lib/app/lib/mongo";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  const conn = getConnection();
  const db = conn.db();

  const accounts = db.collection("accounts");

  const yourAccounts = await accounts.find().toArray();

  conn.close();

  return new Response(JSON.stringify({ accounts: yourAccounts }));
}

export async function POST(request: Request) {
  const newAccount = await request.json();
  const conn = getConnection();
  const db = conn.db();

  const accounts = db.collection("accounts");

  await accounts.insertOne(newAccount);

  const yourAccounts = await accounts.find().toArray();

  conn.close();

  return new Response(JSON.stringify({ accounts: yourAccounts }));
}

export async function PUT(request: Request) {
  const { _id, ...updatedAccount } = await request.json();
  const conn = getConnection();
  const db = conn.db();

  const accounts = db.collection("accounts");

  const result = await accounts.updateOne(
    { _id: new ObjectId(_id) },
    { $set: updatedAccount }
  );

  const yourAccounts = await accounts.find().toArray();

  conn.close();

  return new Response(JSON.stringify({ accounts: yourAccounts }));
}
