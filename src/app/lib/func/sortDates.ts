export default function sortArrayByDateStringAscending(array: any[]): any[] {
  return array.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
