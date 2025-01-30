import { getConnection } from "lib/app/lib/mongo";

export async function GET(request: Request) {
  const conn = getConnection();
  const db = conn.db();

  const breakdowns = db.collection("breakdowns");

  const yourBreakdowns = await breakdowns.find().toArray();

  conn.close();

  return new Response(JSON.stringify({ breakdowns: yourBreakdowns }));
}
