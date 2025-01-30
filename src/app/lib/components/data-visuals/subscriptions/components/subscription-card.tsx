import { Subscription } from "lib/app/lib/func/subscriptions";
import React from "react";

interface SubscriptionCardProps {
  subscription: Subscription;
}

/**
 * A card component to display subscription details.
 * Background is green if `active` is true, otherwise red.
 */
export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
}) => {
  const { name, monthlyCost, totalSpent, active, transactions } = subscription;

  // Choose background color based on `active`
  const containerStyle: React.CSSProperties = {
    backgroundColor: active ? "#d4edda" : "#f8d7da",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    margin: "16px",
    flex: "1",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: "8px",
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: "bold",
  };

  const listStyle: React.CSSProperties = {
    marginTop: "8px",
    paddingLeft: "20px",
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>{name}</h2>
      <div style={{ marginBottom: "6px" }}>
        <span style={labelStyle}>Monthly Cost:</span> £{monthlyCost.toFixed(2)}
      </div>
      <div style={{ marginBottom: "6px" }}>
        <span style={labelStyle}>Total Spent:</span> £{totalSpent.toFixed(2)}
      </div>
      <div style={{ marginBottom: "6px" }}>
        <span style={labelStyle}>Active:</span> {active ? "Yes" : "No"}
      </div>

      {/* <h3 style={{ marginTop: "16px", marginBottom: "4px" }}>Transactions:</h3>
      <ul style={listStyle}>
        {transactions.map((tx) => (
          <li key={tx._id ?? `${tx.date}-${tx.name}`}>
            {tx.date} - {tx.name} - £{tx.amount.toFixed(2)}
          </li>
        ))}
      </ul> */}
    </div>
  );
};
