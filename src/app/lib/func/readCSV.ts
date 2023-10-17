import { csvParse } from "d3";

type Schema = {
  [key: string]: string;
};
export const readCSV = (csv: string, object: Schema) => {
  const csvValues = csvParse(csv);

  return mapObjects(csvValues, object);
};

function mapObjects(dataArray: any[], schema: Schema): any[] {
  return dataArray.map((data) => {
    const newObj: any = {};

    for (const key in schema) {
      const referenceKey = schema[key];
      newObj[key] = data[referenceKey];
    }

    return newObj;
  });
}

export default readCSV;
