import { Spend } from "./getData";

export function filterArrayByDateRange(
  array: Spend[],
  start: string = "",
  end: string = ""
) {
  if (start == "" || end == "") {
    return array;
  }
  const startDate = new Date(start);
  const endDate = new Date(end);

  return array.filter((item) => {
    const [day, month, year] = item.date.split("/");
    const date = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    return date >= startDate && date <= endDate;
  });
}
