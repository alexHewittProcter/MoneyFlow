function convertDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function convertDMYtoYMD(dateStr: string): string | null {
  const parts = dateStr.split("/");

  if (parts.length !== 3) {
    return null; // Invalid format
  }

  const day = parts[0].padStart(2, "0");
  const month = parts[1].padStart(2, "0");
  const year = parts[2];

  return `${year}-${month}-${day}`;
}

export const fetcher = ([url, params]: any) => {
  const urlParams = new URLSearchParams();
  if (params) {
    const { startDate, endDate } = params;
    urlParams.append("startDate", convertDateToString(startDate));
    urlParams.append("endDate", convertDateToString(endDate));
  }

  return fetch(`${url}?${urlParams.toString()}`).then((res) => res.json());
};
