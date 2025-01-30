import { getConnection } from "lib/app/lib/mongo";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  const { breakdown } = await request.json();

  console.log(breakdown);

  const conn = getConnection();
  const db = conn.db();

  const collection = db.collection("breakdowns");

  const result = await collection.insertOne(breakdown);
  console.log(result);
  conn.close();

  return new Response(JSON.stringify({ result }));
}

export async function PUT(request: Request) {
  const { breakdown } = await request.json();
  const { _id, ...updatedBreakdown } = breakdown;
  const conn = getConnection();
  const db = conn.db();

  const breakdowns = db.collection("breakdowns");

  const result = await breakdowns.updateOne(
    { _id: new ObjectId(_id) },
    { $set: updatedBreakdown }
  );

  const yourBreakdown = await breakdowns
    .find({ _id: new ObjectId(_id) })
    .toArray();

  conn.close();

  return new Response(JSON.stringify({ breakdown: yourBreakdown }));
}
