export interface Account {
  type: "Credit Card" | "Bank Account";
  name: string;
  reference?: string;
  amount?: string;
  credit?: number;
  debit?: number;
  sum: number;
  label: string;
  date: string;
}
