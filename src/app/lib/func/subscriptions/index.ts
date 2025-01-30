import { Transaction } from "../../types/transaction";

export interface Subscription {
  /** A substring from `spendTypes` that matched (e.g. "SPOTIFY" or "ADOBESYSTEM") */
  name: string;
  /** The recurring monthly charge (based on transaction.amount) */
  monthlyCost: number;
  /** Sum of all matched transactions' amounts */
  totalSpent: number;
  /** True if the last transaction happened within 30 days of "today" */
  active: boolean;
  /** (Optional) The actual transactions that form this subscription */
  transactions: Transaction[];
}

/**
 * Finds possible monthly subscriptions among the provided transactions,
 * using the known substrings in `spendTypes`.
 *
 * Criteria for subscription:
 *  1. Transaction name contains one of the known substrings (case-insensitive).
 *  2. The amounts are the same.
 *  3. The dates of at least 2-3 consecutive transactions are ~1 month apart (±2 days).
 *  4. "active" = true if there's a transaction in the last 30 days.
 */
export function findMonthlySubscriptions(
  spendTypes: { [category: string]: string[] },
  transactions: Transaction[]
): Subscription[] {
  if (!transactions?.length) return [];

  // 1. Parse and sort transactions by date ascending
  const parsed = transactions
    .map((tx) => ({
      ...tx,
      dateObj: new Date(tx.date), // for easier date comparison
      matchedSubstring: matchKnownSubstring(tx.name, spendTypes),
    }))
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  // 2. Group them by (matchedSubstring, amount).
  //    If a transaction doesn't match any substring, we skip it—can't be a "known" subscription.
  type GroupKey = string; // e.g. "SPOTIFY||9.99"
  const groups: Record<GroupKey, typeof parsed> = {};

  for (const tx of parsed) {
    if (!tx.matchedSubstring) {
      continue; // we skip transactions that don't match any known substring
    }
    const key = `${tx.matchedSubstring}||${tx.amount}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(tx);
  }

  // 3. Within each group, look for monthly patterns.
  const subs: Subscription[] = [];

  for (const groupKey of Object.keys(groups)) {
    const [subName, amountStr] = groupKey.split("||");
    const groupAmount = parseFloat(amountStr);

    const txsInGroup = groups[groupKey].sort(
      (a, b) => a.dateObj.getTime() - b.dateObj.getTime()
    );

    // Check if there's a monthly pattern
    if (isLikelyMonthlySubscription(txsInGroup)) {
      // Build the subscription object
      const totalSpent = txsInGroup.reduce((sum, t) => sum + t.amount, 0);
      const lastTxDate = txsInGroup[txsInGroup.length - 1].dateObj;

      // "active" if last transaction is within 30 days from now
      const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
      const now = new Date();
      const active = now.getTime() - lastTxDate.getTime() <= THIRTY_DAYS_MS;

      subs.push({
        name: subName,
        monthlyCost: groupAmount,
        totalSpent,
        active,
        transactions: txsInGroup.map(stripInternalProps),
      });
    }
  }

  return subs;
}

/**
 * Returns a string (the matched substring) if the transaction name includes
 * any of the known substrings from spendTypes (case-insensitive).
 * If no match, returns undefined.
 */
function matchKnownSubstring(
  txName: string,
  spendTypes: { [category: string]: string[] }
): string | undefined {
  const upperName = txName.toUpperCase();

  for (const category of Object.keys(spendTypes)) {
    for (const candidate of spendTypes[category]) {
      const upperCandidate = candidate.toUpperCase();
      if (upperName.includes(upperCandidate)) {
        // Return the first substring that matches
        return candidate;
      }
    }
  }
  return undefined;
}

/**
 * Check if transactions in a group occur in monthly intervals ±2 days.
 * We require at least 2 consecutive "1-month-apart" gaps (which implies 3 total transactions).
 * You can tweak this logic.
 */
function isLikelyMonthlySubscription(
  txs: (Transaction & { dateObj: Date })[]
): boolean {
  if (txs.length < 5) {
    return false;
  }

  let monthlyGaps = 0;

  for (let i = 1; i < txs.length; i++) {
    const prev = txs[i - 1].dateObj;
    const curr = txs[i].dateObj;
    const daysDiff = Math.abs(diffInDays(prev, curr));

    // If the difference is 28..32 days, consider it a "1-month" gap
    if (daysDiff >= 25 && daysDiff <= 35) {
      monthlyGaps++;
    }
  }

  // For a subscription, let's say we want at least 2 monthly gaps (>= 3 occurrences).
  return monthlyGaps >= 2;
}

/**
 * Inclusive difference in days (ignoring time of day).
 */
function diffInDays(d1: Date, d2: Date): number {
  const day1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const day2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return (day2 - day1) / (1000 * 60 * 60 * 24);
}

/**
 * Remove any internal dateObj from the transaction before returning the final result.
 */
function stripInternalProps(
  tx: Transaction & { dateObj?: Date; matchedSubstring?: string }
): Transaction {
  const { dateObj, matchedSubstring, ...rest } = tx;
  return rest;
}
