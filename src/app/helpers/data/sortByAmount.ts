import { Spend } from "./getData";

export function sortObjectsByAmount(objects: any[]) {
  return objects.sort((a, b) => a.amount - b.amount);
}
