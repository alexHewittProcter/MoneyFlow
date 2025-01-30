import { Transaction } from "../../types/transaction";
import styles from "./styles.module.scss";

export const TransactionList = ({
  transactions = [],
  label = "Transaction List",
}: {
  transactions: Transaction[];
  label?: string;
}) => {
  return (
    <div className={styles.transactionsList}>
      <p className="fs-3">{label}</p>
      <p>{transactions.length} transactions</p>
      <p>
        £
        {transactions.reduce((total, transaction) => {
          return total + transaction.amount;
        }, 0)}
      </p>
      <ul>
        {transactions
          .sort((a, b) => b.amount - a.amount)
          .map((transaction: Transaction) => (
            <li key={transaction._id}>
              <p className="fs-6 m-2">{transaction.name}</p>
              <div>
                {transaction.date && (
                  <p className="fs-6 m-2">{transaction.date}</p>
                )}{" "}
                <p className="fs-6 m-2">{transaction.amount}</p>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};
