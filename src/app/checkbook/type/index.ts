import { createContext } from "react";

export const BreakdownIntervalContext = createContext<
  "monthly" | "yearly" | "weekly" | "daily"
>("monthly");
