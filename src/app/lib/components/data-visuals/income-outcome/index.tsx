import { SelectionContext } from "lib/app/lib/context";
import { groupTransactionsByDate } from "lib/app/helpers/data/groupTransactionByDate";
import sortArrayByDateStringAscending from "lib/app/lib/func/sortDates";
import { fetcher } from "lib/app/lib/func/fetcher";
import { Transaction } from "lib/app/lib/types/transaction";
import { useContext } from "react";
import { Accordion } from "react-bootstrap";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  AreaChart,
  Area,
} from "recharts";
import useSWR from "swr";

function generateRunningTotal(transactions: Transaction[]) {
  const groupedTransactions = groupTransactionsByDate(transactions);

  // Sort transactions in ascending order by date
  const sortedTransactions = groupedTransactions.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let runningTotal = 0;

  // Generate running total for each date
  for (const transaction of sortedTransactions) {
    runningTotal += transaction.amount;
    transaction.amount = runningTotal;
  }

  return sortedTransactions;
}

export const IncomeOutcome = () => {
  const selection = useContext(SelectionContext);
  const { data, error, isLoading } = useSWR(
    ["api/spending-averages", selection],
    fetcher
  );

  if (!data) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-grow m-5" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Accordion>
      <Accordion.Item>
        <Accordion.Header>Spending over time</Accordion.Header>
        <Accordion.Body>
          <div style={{ width: "100%", height: 300, marginTop: "32px" }}>
            <ResponsiveContainer>
              <AreaChart
                data={data && generateRunningTotal(data.yourTransactions)}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#8884d8"
                  fill="#82ca9d"
                  //   strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="uv"
                  stroke="#82ca9d"
                  strokeDasharray="3 4 5 2"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};
