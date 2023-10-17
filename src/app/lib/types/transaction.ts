export interface Transaction {
  date: string;
  name: string;
  amount: number;
  ref: string;
  account: string;
  _id?: string;
}
