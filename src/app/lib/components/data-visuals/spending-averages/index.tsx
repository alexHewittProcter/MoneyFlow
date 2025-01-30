import { SelectionContext } from "lib/app/lib/context";
import { fetcher } from "lib/app/lib/func/fetcher";
import { formatNumberWithCommas } from "lib/app/lib/func/number";
import { useContext } from "react";
import useSWR from "swr";

import styles from "./styles.module.scss";
import { Transaction } from "lib/app/lib/types/transaction";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import {
  groupTransactionsByDate,
  groupTransactionsByMonth,
  groupTransactionsByWeek,
} from "lib/app/helpers/data/groupTransactionByDate";
import sortArrayByDateStringAscending from "lib/app/lib/func/sortDates";
import { TransactionList } from "lib/app/lib/components/transaction-list";
import { Accordion, Card } from "react-bootstrap";

export const SpendingAverages = () => {
  const selection = useContext(SelectionContext);
  const { data, error, isLoading } = useSWR(
    ["api/spending-averages", selection],
    fetcher
  );

  console.log(data);
  // console.log(selection);

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
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Overview</Accordion.Header>
        <Accordion.Body>
          <div className={styles.container}>
            <Card>
              <TransactionList
                transactions={(data && data.yourTransactions) || []}
              />
            </Card>
            <div className={styles.averagesContainer}>
              <p className="fs-1">
                £{data && formatNumberWithCommas(data.total)}
              </p>
              {data && (
                <div className={styles.averages}>
                  <p className="fs-5">{data.averages.perDay}/Per day</p>
                  <p className="fs-5">{data.averages.perWeek}/Per week</p>
                  <p className="fs-5">{data.averages.perMonth}/Per month</p>
                  <p className="fs-5">{data.averages.per30Days}/Per 30 days</p>
                  <p className="fs-5">{data.averages.per60Days}/Per 60 days</p>
                  <p className="fs-5">{data.averages.per90Days}/Per 90 days</p>
                </div>
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              // flexDirection: "column",
              flexWrap: "wrap",
              // alignItems: "center",
            }}
          >
            <div
              style={{
                width: "50%",
                height: 300,
                marginTop: "32px",
                marginBottom: "50px",
              }}
            >
              <p className="fs-5">Spending per day</p>
              <ResponsiveContainer>
                <LineChart
                  data={
                    data &&
                    sortArrayByDateStringAscending(
                      groupTransactionsByDate(data.yourTransactions)
                    ).reverse()
                  }
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
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#8884d8"
                    strokeDasharray="1 1"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>{" "}
            <div
              style={{
                width: "50%",
                height: 300,
                marginTop: "32px",
                marginBottom: "50px",
              }}
            >
              <p className="fs-5">Average Spending per day</p>
              <ResponsiveContainer>
                <LineChart
                  data={
                    data &&
                    // sortArrayByDateStringAscending(
                    data.averagesPerCadence.perDay
                    // ).reverse()
                  }
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis dataKey="average" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="average"
                    stroke="#8884d8"
                    strokeDasharray="1 1"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div
              style={{
                width: "50%",
                height: 300,
                marginTop: "32px",
                marginBottom: "50px",
              }}
            >
              <p className="fs-5">Spending per week</p>
              <ResponsiveContainer>
                <LineChart
                  data={sortArrayByDateStringAscending(
                    groupTransactionsByWeek(data.yourTransactions)
                  ).reverse()}
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
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#8884d8"
                    strokeDasharray="1 1"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div
              style={{
                width: "50%",
                height: 300,
                marginTop: "32px",
                marginBottom: "50px",
              }}
            >
              <p className="fs-5">Spending per week</p>
              <ResponsiveContainer>
                <LineChart
                  data={data && data.averagesPerCadence.perWeek}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis dataKey="average" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="average"
                    stroke="#8884d8"
                    strokeDasharray="1 1"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div
              style={{
                width: "50%",
                height: 300,
                marginTop: "32px",
                marginBottom: "50px",
              }}
            >
              <p className="fs-5">Spending per month</p>
              <ResponsiveContainer>
                <LineChart
                  data={
                    data &&
                    sortArrayByDateStringAscending(
                      groupTransactionsByMonth(data.yourTransactions)
                    ).reverse()
                  }
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
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#8884d8"
                    strokeDasharray="1 1"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div
              style={{
                width: "50%",
                height: 300,
                marginTop: "32px",
                marginBottom: "50px",
              }}
            >
              <p className="fs-5">Average Spending per month</p>
              <ResponsiveContainer>
                <LineChart
                  data={data && data.averagesPerCadence.perMonth}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis dataKey="average" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="average"
                    stroke="#8884d8"
                    strokeDasharray="1 1"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );

  return (
    <div className="accordion">
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            Overview
          </button>
        </h2>
        <div
          id="collapseOne"
          className="accordion-collapse collapse show"
          data-bs-parent="#accordionExample"
        ></div>
      </div>
    </div>
  );
};
