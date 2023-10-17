import { SelectionContext } from "lib/app/lib/context";
import { GroupedByMonth } from "lib/app/helpers/data/groupByMonth";
import { SpendType, spendTypes } from "lib/app/helpers/data/groupBySpend";
import { fetcher } from "lib/app/lib/func/fetcher";
import { getRandomColor } from "lib/app/lib/func/colour";
import { isLessThanOneMonth } from "lib/app/lib/func/date";
import { useContext } from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Pie,
  Cell,
  PieChart,
  Line,
  LineChart,
} from "recharts";
import useSWR from "swr";
import { SpendTypeCard } from "./spend-type-card";

import styles from "./styles.module.scss";
import { Accordion } from "react-bootstrap";
import { TransactionList } from "lib/app/lib/components/transaction-list";

export const BySpendType = () => {
  const selection = useContext(SelectionContext);
  const { data, error, isLoading } = useSWR(
    ["api/groupBySpendType", selection],
    fetcher
  );
  // console.log(data);

  // console.log(data);

  const convertMonthSpendingData = (newData: { months: GroupedByMonth[] }) => {
    if (newData) {
      return newData.months
        .map((month) => {
          if (!month.spendTypes) return {};
          const spendTypeObj = month.spendTypes.reduce((total, current) => {
            return { ...total, [current.name]: current.amount };
          }, {});
          return { month: month.month, ...spendTypeObj };
        })
        .reverse();
    }
    return [];
  };

  // console.log(convertMonthSpendingData(data));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

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
        <Accordion.Header>Spending by type</Accordion.Header>
        <Accordion.Body>
          <div>
            <div style={{ width: "100%", height: 300, marginTop: "32px" }}>
              <p className="fs-5">Spending by type over time</p>
              <ResponsiveContainer>
                <BarChart
                  data={convertMonthSpendingData(data)}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  {Object.keys(spendTypes).map((string, indx) => (
                    <Bar
                      dataKey={string}
                      key={indx}
                      stackId={indx}
                      fill={getRandomColor()}
                    />
                  ))}
                  {/* <Bar dataKey="pv" stackId="a" fill="#8884d8" />
          <Bar dataKey="amt" stackId="a" fill="#82ca9d" /> */}
                  {/* <Bar dataKey="uv" fill="#ffc658" /> */}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ width: "100%", height: 300, marginTop: "32px" }}>
              <p className="fs-5">Overall spending by type</p>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={(data && data.spendTypes) || []}
                    dataKey="amount"
                    nameKey="name"
                    fill="#82ca9d"
                    label={({ index }) => {
                      return data && data.spendTypes
                        ? data.spendTypes[index].name +
                            " " +
                            data.spendTypes[index].amount
                        : "";
                    }}
                    labelLine
                    legendType="rect"
                  >
                    {((data && data.spendTypes) || []).map(
                      (_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={getRandomColor()} />
                      )
                    )}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className={styles.spendTypeCardContainer}>
              {data &&
                data.spendTypes.map((spendType: SpendType, indx) => (
                  <SpendTypeCard spendType={spendType} key={indx} />
                ))}
            </div>
          </div>
          <TransactionList
            label="Other Transactions"
            transactions={(data && data.otherTransactions) || []}
          />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};
