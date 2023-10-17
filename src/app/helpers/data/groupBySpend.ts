import { Transaction } from "lib/app/lib/types/transaction";
import { GroupedByMonth } from "./groupByMonth";
import { GroupedByDay } from "./groupByDay";

export const spendTypes: { [key: string]: string[] } = {
  Shopping: [
    "AMAZON",
    "APPLE",
    "SHOPDISNEY.CO.UK",
    "LEGO",
    "OCULUS DIGITAL",
    "DECATHLON",
    "ASOS",
    "EBAY",
    "Costco",
    "PLAYSTATION",
    "SAINSBURY",
    "IKEA",
    "ALIPAYUSINC",
    "KICKSTARTER",
    "NINTENDO",
    "ETSY",
    "TESCO",
    "MOONPIGCOML",
    "*GOPRO",
    "*SAMSUNG",
    "SP BIONICGYM USA",
    "WICKED BRICK",
    "INDIEGOGO",
    "REMY",
    "BLACKBOARD",
    "DOMESTIKA",
    "MANTASLEEP",
    "SIMABRAND",
  ],
  Transport: ["TFL", "UBER TRIP"],
  Food: [
    "JUST EAT.CO.UK",
    "JUSTEATCOUK",
    "GRAZE.COM",
    "DELIVEROO",
    "DOMINOS",
    "MCDONALD",
    "UBER EATS",
    "TIPJAR",
  ],
  "Going out": [
    "BOXPARK",
    "KATZENJAMMERS",
    "KRANK BROS",
    "TOKYO TEA ROOMS",
    "JONES NIGHTCLUB",
    "CINEMA",
    "BE AT ONE FARRINGDON",
    "TEAM SPORT",
    "WETHERSPOON",
    "PEMBROKE",
    "STONEGATE",
    "BOATERS KINGSTON",
    "THE OLD THAMESIDE INN LONDON",
    "FOXLEY HATCH PURLEY",
    "WH SMITH LONDON BRIDGE LONDON",
    "TOWN AND CITY PUB GROUP",
  ],
  Services: [
    "SIDE+",
    "ADOBESYSTEM",
    "DRIVECRATE",
    "PRIME VIDEO",
    "HEIGHTS",
    "DIGITALOCEAN.COM",
    "AUDIBLE",
    "SPOTIFY",
    "LUMIN",
    "TRAINLINE",
    "MANUAL",
    "BETTERHELP",
    "*INNOSUPPS",
    "DIRTEA",
    "HVMN",
    "NORTON",
    "123-REG",
    "DAZN",
    "DPLAY",
  ],
  Holidays: ["DISNEY HOLIDAYS", "HOTEL"],
  Charity: ["JG"],
  Interest: ["INTEREST CHARGE"],
};

const getSpendKeys = () =>
  Object.keys(spendTypes).reduce((acc: string[], curr: string) => {
    return [...acc, ...spendTypes[curr]];
  }, []);

export interface GroupedBySpend {
  name: string;
  amount: number;
  transactions: Transaction[];
}

export function groupBySpend(data: Transaction[]): {
  spends: GroupedBySpend[];
  otherTransactions: Transaction[];
} {
  const otherTransactions: Transaction[] = [];

  const groups: {
    [key: string]: { amount: number; transactions: Transaction[] };
  } = {};
  const groupKeys = getSpendKeys();
  let foundKey = false;
  for (let index = 0; index < data.length; index++) {
    for (let key = 0; key < groupKeys.length && !foundKey; key++) {
      const keyName = groupKeys[key];
      if (data[index].name.includes(keyName)) {
        foundKey = true;
        if (!groups[keyName]) {
          groups[keyName] = { amount: 0, transactions: [] };
        }
        groups[keyName].amount += data[index].amount;
        groups[keyName].transactions.push(data[index]);
      }
    }
    if (!foundKey) {
      otherTransactions.push(data[index]);
      // console.log(data[index].name);
      // console.log(data[index].amount);
      //   groups[data[index].description] = data[index].amount;
    }
    foundKey = false;
  }

  return {
    spends: Object.keys(groups).map((groupName) => ({
      ...groups[groupName],
      name: groupName,
      amount: Math.round(groups[groupName].amount * 100) / 100,
    })),
    otherTransactions,
  };
}

export interface SpendType {
  name: string;
  amount: number;
  groupedSpend: { name: string; amount: number }[];
  transactions: Transaction[];
  months?: GroupedByMonth[];
  days?: GroupedByDay[];
}

export function groupBySpendType(data: Transaction[]): {
  spendTypes: SpendType[];
  otherTransactions: Transaction[];
} {
  const groups: {
    [key: string]: SpendType;
  } = {};

  const spendTypeStrings = Object.keys(spendTypes);
  const groupBySpendReturn = groupBySpend(data);
  const groupedBySpend = groupBySpendReturn.spends;
  console.log(groupedBySpend);
  // console.log(spendTypeStrings);
  spendTypeStrings.forEach((spendType: string) => {
    const typesToSearch = spendTypes[spendType];
    for (let index = 0; index < groupedBySpend.length; index++) {
      const groupedSpend = groupedBySpend[index];
      // console.log(groupedSpend);
      // console.log(groups[spendType]);
      if (typesToSearch.includes(groupedSpend.name)) {
        if (!groups[spendType]) {
          groups[spendType] = {
            name: "",
            amount: 0,
            transactions: [],
            groupedSpend: [],
          };
        }

        groups[spendType].amount += groupedSpend.amount;
        groups[spendType].groupedSpend.push(groupedSpend);
        groups[spendType].transactions.push(...groupedSpend.transactions);
      }
    }
  });

  return {
    spendTypes: Object.keys(groups).map((groupName) => ({
      ...groups[groupName],
      name: groupName,
      amount: Math.round(groups[groupName].amount * 100) / 100,
    })),
    otherTransactions: groupBySpendReturn.otherTransactions,
  };
}
