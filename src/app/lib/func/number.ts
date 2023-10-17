export function formatNumberWithCommas(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// // Example usage:
// const num = 1234567;
// const formattedNum = formatNumberWithCommas(num);
// console.log(formattedNum);  // Outputs: "1,234,567"
