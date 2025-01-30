import { selection } from "d3";
import { SelectionContext } from "lib/app/lib/context";
import { SpendType } from "lib/app/helpers/data/groupBySpend";
import { TransactionList } from "lib/app/lib/components/transaction-list";
import { getRandomColor } from "lib/app/lib/func/colour";
import { isLessThanOneMonth } from "lib/app/lib/func/date";
import { useContext, useEffect, useState } from "react";
import { Card, Tooltip } from "react-bootstrap";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Line,
  Pie,
  PieChart,
  Cell,
} from "recharts";
import sortArrayByDateStringAscending from "lib/app/lib/func/sortDates";

export const SpendTypeCard = ({ spendType }: { spendType: SpendType }) => {
  const selection = useContext(SelectionContext);

  const [view, setView] = useState<"month" | "day">("month");

  useEffect(() => {
    setView(isLessThanOneMonth(selection) ? "day" : "month");
  }, [selection]);

  return (
    <Card>
      <h5 className="card-title fs-5">{spendType.name}</h5>
      <div
        style={{
          width: "100%",
          height: 300,
          marginTop: "32px",
          marginBottom: "50px",
        }}
      >
        <ResponsiveContainer>
          <LineChart
            data={
              view == "day"
                ? sortArrayByDateStringAscending(spendType.days!)
                : sortArrayByDateStringAscending(spendType.months!).reverse()
            }
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={view} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalAmount"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div
        style={{
          width: "100%",
          height: 300,
          marginTop: "32px",
          marginBottom: "50px",
        }}
      >
        <p className="fs-5">Overall spending by type</p>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={(spendType && spendType.groupedSpend.reverse()) || []}
              dataKey="amount"
              nameKey="name"
              fill="#82ca9d"
              label={({ index }) => {
                return spendType && spendType.groupedSpend
                  ? spendType.groupedSpend[index].name +
                      "\n" +
                      spendType.groupedSpend[index].amount
                  : "";
                // if (!spendType) {
                //   return <></>;
                // }
                return (
                  <div>
                    <p>{spendType.groupedSpend[index].name}</p>
                    <p>{spendType.groupedSpend[index].amount}</p>
                  </div>
                );
              }}
              labelLine
              legendType="rect"
            >
              {((spendType && spendType.groupedSpend) || []).map(
                (_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={getRandomColor()} />
                )
              )}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <TransactionList
        transactions={spendType.groupedSpend}
        label="Grouped transactions"
      />
      <TransactionList transactions={spendType.transactions} />
    </Card>
  );
};
