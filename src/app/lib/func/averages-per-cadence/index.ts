import { Transaction } from "../../types/transaction";

export interface AverageEntry {
  /**
   * For day-cadence, something like "2025-01-24".
   * For week-cadence, something like "2025-01-26 (week end)".
   * For month-cadence, something like "2025-01".
   */
  period: string;
  /**
   * Rolling 90-day average, but scaled to "per day/week/month"
   * depending on the chosen cadence.
   */
  average: number;
}

/**
 * Returns an array of rolling 90-day averages, where the "average" is scaled to be
 * "average spend per day" (if cadence=day), "average spend per week" (if cadence=week),
 * or "average spend per month" (if cadence=month).
 *
 * For each bucket end date D:
 *   1) Consider the 90-day window [D-89, D], or less if data doesn't go that far back.
 *   2) Sum all transaction amounts in that window => S.
 *   3) Let w = number of days in that window (inclusive).
 *   4) Base average = S / w (the daily average).
 *   5) Scale it up if needed:
 *       - day   => averageDaily = (S / w) * 1       (no change)
 *       - week  => averageWeekly = (S / w) * 7
 *       - month => averageMonthly = (S / w) * 30.4375  (approx days per month)
 */
export function getRolling90DayAverages(
  transactions: Transaction[],
  cadence: "day" | "week" | "month"
): AverageEntry[] {
  if (!transactions?.length) return [];

  // 1. Parse & sort transactions by ascending date.
  const parsed = transactions
    .map((tx) => ({
      ...tx,
      dateObj: truncateTime(new Date(tx.date)), // e.g., 2025-01-15T00:00:00.000Z
    }))
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  const earliestTxDate = parsed[0].dateObj;
  const latestTxDate = parsed[parsed.length - 1].dateObj;

  // 2. Generate "end dates" for each bucket (day/week/month).
  const endDates = generateCadenceEndDates(
    earliestTxDate,
    latestTxDate,
    cadence
  );

  // Determine the scale factor for each cadence:
  // - day: factor = 1   (since dividing by w days gives daily average)
  // - week: factor = 7  (multiply daily average by 7 to get weekly)
  // - month: factor ~ 30.4375
  const scaleFactor = cadence === "day" ? 1 : cadence === "week" ? 7 : 30.4375; // Or 30 if you prefer a round number

  const results: AverageEntry[] = [];

  // 3. For each bucket "end date", compute the rolling window sum, then scale to get the per-cadence average.
  for (const endDate of endDates) {
    // The ideal start of the 90-day window is (endDate - 89 days).
    const idealStart = new Date(endDate);
    idealStart.setDate(idealStart.getDate() - 89);

    // But if our earliest data is later than that, we clamp the start.
    const actualStart =
      idealStart < earliestTxDate ? earliestTxDate : idealStart;

    // Sum amounts in [actualStart, endDate].
    let sum = 0;
    for (const tx of parsed) {
      if (tx.dateObj > endDate) break; // we've passed the window
      if (tx.dateObj >= actualStart && tx.dateObj <= endDate) {
        sum += tx.amount;
      }
    }

    // Number of actual days in the window [actualStart..endDate] inclusive.
    const windowDays = diffInDaysInclusive(actualStart, endDate);

    // Avoid dividing by zero if, for some edge case, start > end.
    const dailyAverage = windowDays > 0 ? sum / windowDays : 0;

    // Scale the daily average to the user's chosen cadence
    const finalAverage = dailyAverage * scaleFactor;

    // Format the endDate as the period label (e.g. "2025-01-24" or "2025-W04" or "2025-01")
    const periodKey = formatPeriodKey(endDate, cadence);

    results.push({
      period: periodKey,
      average: finalAverage,
    });
  }

  return results;
}

/**
 * Generate a list of "end dates" between [start, end] inclusive, based on the desired cadence.
 *   - "day": every calendar day
 *   - "week": every "week end" (defined here as Sunday — you can adapt)
 *   - "month": the last day of each month
 */
function generateCadenceEndDates(
  start: Date,
  end: Date,
  cadence: "day" | "week" | "month"
): Date[] {
  const results: Date[] = [];
  const current = truncateTime(new Date(start));

  while (current <= end) {
    switch (cadence) {
      case "day": {
        // The "end date" is the current date.
        results.push(new Date(current));
        current.setDate(current.getDate() + 1);
        break;
      }
      case "week": {
        // We'll define "week end" as Sunday. You can change to Monday-based if needed.
        const weekEnd = getEndOfWeek(current);
        if (weekEnd > end) {
          // If it overshoots the range, clamp to 'end'
          if (current <= end) {
            results.push(new Date(Math.min(weekEnd.getTime(), end.getTime())));
          }
        } else {
          results.push(weekEnd);
        }
        // Move current to the day after that Sunday
        current.setTime(weekEnd.getTime());
        current.setDate(current.getDate() + 1);
        break;
      }
      case "month": {
        const monthEnd = getEndOfMonth(current);
        if (monthEnd > end) {
          if (current <= end) {
            results.push(new Date(Math.min(monthEnd.getTime(), end.getTime())));
          }
        } else {
          results.push(monthEnd);
        }
        // Move current to day after that month-end
        current.setTime(monthEnd.getTime());
        current.setDate(current.getDate() + 1);
        break;
      }
    }
  }

  // Remove duplicates (if any) and sort
  return results
    .filter((d, i, arr) => i === 0 || d.getTime() !== arr[i - 1].getTime())
    .sort((a, b) => a.getTime() - b.getTime());
}

/**
 * Truncate a Date to midnight (no time part).
 * Helps avoid partial-day issues.
 */
function truncateTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * "Week end" = Sunday.
 * For a Monday-based approach, you'd need to adapt this logic.
 */
function getEndOfWeek(date: Date): Date {
  const temp = truncateTime(date);
  // dayOfWeek: 0=Sunday, 1=Monday, ... 6=Saturday
  const dayOfWeek = temp.getDay();
  // Move forward until Sunday
  temp.setDate(temp.getDate() + ((7 - dayOfWeek) % 7));
  return temp;
}

/**
 * Returns the last day of the same month for the given date
 * (e.g. 2025-01-31 if date is in Jan 2025).
 */
function getEndOfMonth(date: Date): Date {
  const year = date.getFullYear();
  const month = date.getMonth();
  // The day before the first of next month
  const firstOfNext = new Date(year, month + 1, 1);
  firstOfNext.setDate(firstOfNext.getDate() - 1);
  return firstOfNext;
}

/**
 * Inclusive difference in days.
 * If start = end, diff is 1. If end < start, returns 0.
 */
function diffInDaysInclusive(start: Date, end: Date): number {
  if (end < start) return 0;
  const startTime = Date.UTC(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );
  const endTime = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.floor((endTime - startTime) / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Format the bucket end date into a string label, depending on the cadence.
 */
function formatPeriodKey(
  date: Date,
  cadence: "day" | "week" | "month"
): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  switch (cadence) {
    case "day":
      return `${y}-${m}-${d}`;
    case "week":
      // e.g. "2025-01-26 (week end)"
      return `${y}-${m}-${d}`;
    case "month":
      // e.g. "2025-01"
      return `${y}-${m}`;
  }
}
