interface DateRange {
  startDate: string;
  endDate: string;
}

export function isLessThanOneMonth(dateRange: DateRange): boolean {
  const startDate = new Date(dateRange.startDate);
  const endDate = new Date(dateRange.endDate);

  // Create a new date that's one month after the start date
  const oneMonthAfterStartDate = new Date(startDate);
  oneMonthAfterStartDate.setMonth(oneMonthAfterStartDate.getMonth() + 1);

  // If the end date is before this new date, it's less than one month
  return endDate < oneMonthAfterStartDate;
}
