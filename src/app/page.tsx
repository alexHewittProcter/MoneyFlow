"use client";

import AppLayout from "./lib/components/layout/AppLayout";
import { BySpendType } from "./lib/components/data-visuals/by-spend-type";
import { IncomeOutcome } from "./lib/components/data-visuals/income-outcome";
import { SpendingAverages } from "./lib/components/data-visuals/spending-averages";
import { QueryBox } from "./lib/components/query-box";

export default function TimeframeView() {
  return (
    <AppLayout>
      <QueryBox>
        <SpendingAverages />
        <IncomeOutcome />
        <BySpendType />
      </QueryBox>
      <div>
        <p className="fs-1"></p>
      </div>
    </AppLayout>
  );
}
