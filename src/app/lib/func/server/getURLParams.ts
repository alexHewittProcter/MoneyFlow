export const getURLParams = (
  url: string
): { startDate: string; endDate: string } => {
  const paramObj: {
    [filters: string]: any;
    startDate: string;
    endDate: string;
  } = { startDate: "", endDate: "" };
  const params = new URL(url).searchParams;
  // console.log(params.entries());
  [...params.entries()].forEach(([key, val]) => {
    paramObj[key] = val;
  });

  return paramObj;
};
