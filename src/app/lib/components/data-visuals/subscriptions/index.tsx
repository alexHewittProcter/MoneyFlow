import { SelectionContext } from "lib/app/lib/context";
import { GroupedByMonth } from "lib/app/helpers/data/groupByMonth";
import { SpendType, spendTypes } from "lib/app/helpers/data/groupBySpend";
import { fetcher } from "lib/app/lib/func/fetcher";
import { getRandomColor } from "lib/app/lib/func/colour";
import { isLessThanOneMonth } from "lib/app/lib/func/date";
import { useContext, useMemo } from "react";
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

import styles from "./styles.module.scss";
import { Accordion } from "react-bootstrap";
import { TransactionList } from "lib/app/lib/components/transaction-list";
import { SubscriptionCard } from "./components/subscription-card";

export const SubscriptionsBox = () => {
  const selection = useContext(SelectionContext);
  const { data, error, isLoading } = useSWR(
    ["api/subscriptions", selection],
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
  const totalMonthlyCost = useMemo(() => {
    if (!data) {
      return 0;
    }
    return data.subscriptions.reduce(
      (total: number, subscription: any) =>
        subscription.active ? total + subscription.monthlyCost : total,
      0
    );
  }, [data]);

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
          £{totalMonthlyCost.toFixed(2)}{" "}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              flex: 4,
            }}
          >
            {data.subscriptions
              .filter((subscription: any) => subscription.active)
              .map((subscription: any) => (
                <SubscriptionCard subscription={subscription} />
              ))}

            {data.subscriptions
              .filter((subscription: any) => !subscription.active)
              .map((subscription: any) => (
                <SubscriptionCard subscription={subscription} />
              ))}
          </div>
          {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};
