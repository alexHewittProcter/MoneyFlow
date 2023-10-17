import { createContext } from "react";

export interface Breakdown {
  monthly: number;
  yearly: number;
  weekly: number;
  daily: number;
  title: string;
  id?: string;
}

export const BreakdownIntervalContext = createContext<
  "monthly" | "yearly" | "weekly" | "daily"
>("monthly");
