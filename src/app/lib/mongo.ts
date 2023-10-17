import { Db, MongoClient } from "mongodb";

const connectionString = "mongodb://localhost:27017/MoneyFlow";

const getConnection = (): MongoClient => {
  const client = new MongoClient(connectionString);
  return client;
};

export { getConnection };
