import { Breakdown } from "./type";

export enum BreakdownInterval {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

export function convertValue(
  value: number,
  interval: BreakdownInterval
): Breakdown {
  let daily: number, weekly: number, monthly: number, yearly: number;

  switch (interval) {
    case BreakdownInterval.DAILY:
      daily = value;
      weekly = daily * 7;
      monthly = daily * 30.44;
      yearly = daily * 365.25;
      break;
    case BreakdownInterval.WEEKLY:
      weekly = value;
      daily = weekly / 7;
      monthly = (weekly * 52) / 12;
      yearly = weekly * 52;
      break;
    case BreakdownInterval.MONTHLY:
      monthly = value;
      daily = monthly / 30.44;
      weekly = (monthly * 12) / 52;
      yearly = monthly * 12;
      break;
    case BreakdownInterval.YEARLY:
      yearly = value;
      daily = yearly / 365.25;
      weekly = yearly / 52;
      monthly = yearly / 12;
      break;
  }

  return {
    daily: daily,
    weekly: weekly,
    monthly: monthly,
    yearly: yearly,
    title: interval,
  };
}
