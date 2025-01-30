import { Transaction } from "lib/app/lib/types/transaction";
import { GroupedByMonth } from "./groupByMonth";
import { GroupedByDay } from "./groupByDay";

export const spendTypes: { [key: string]: string[] } = {
  Shopping: [
    "GUTOLOGY",
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
    "CODDIES",
    "TESCO",
    "MOONPIGCOML",
    "BAMBULAB",

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
    "GOPRO.COM",
    "LACOSTE",
    "SELFRIDGES",
    "NIKE",
    "DUSK",
    "INTERACTIVE",
    "VILNO",
    "CHAOMEI",
    "PADDLE",
    "VERY.CO.UK",
    "LHIDSCREATIVE",
    "TASCHENGMBH",
    "NUTCARE",
    "EMMAMATRATZ",
    "LEVISTRAUSS",
    "ALIPAY",
    "BIONICGYM",
    "OMEGA",
    "PENGUIN",
    "BLIZZARD",
    "SHOPDISNEY",
    "TK MAXX",
    "AGUA DE MADRE",
    "HISMILE",
    "BONUSPRINT",
  ],
  Transport: ["TFL", "UBER TRIP", "TRAINLINE", "BOOKING"],
  Food: [
    "JUST EAT.CO.UK",
    "JUSTEATCOUK",
    "GRAZE.COM",
    "DELIVEROO",
    "DOMINOS",
    "MCDONALD",
    "UBER EATS",
    "EXETER",
    "TIPJAR",
    "Pizza Pilgrims",
    "THE JUICE SMITH",
    "OLIVETO",
  ],
  "Going out": [
    "Samuel Jones",
    "F1ARCADE",
    "TEAMSPORT",
    "BOXPARK",
    "KATZENJAMMERS",
    "KRANK BROS",
    "TOKYO TEA ROOMS",
    "The Pear Tree",
    "Boom Battle Bar",
    "PUTTSHACK",
    "The Bowling Green",
    "TENPIN",
    "JONES NIGHTCLUB",
    "THURSDAY LONDON",
    "GEORGE",
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
    "The Foxley Hatch Purley",
    "GREENE KING",
    "JD Wetherspoons",
    "Old Thameside Inn",
    "The Foxley Hatch",
    "BOATERS KINGSTON",
    "GLITTERBOMB",
    "CLAYS.BAR",
    "SIXTY FOUR AND SOCIAL",
    "SWINGERS",
    "FOXLEY HATCH",
    "GEORGE SOUTHWARK",
    "FIVE GUYS",
    "MONTAGU PYKE",
    "THE WANDS AND WIZARDS T LONDON",
    "BOATERS",
  ],
  Services: [
    "SIDE+",
    "ENTS",
    "ADOBESYSTEM",
    "DRIVECRATE",
    "PRIME VIDEO",
    "HEIGHTS",
    "DIGITALOCEAN.COM",
    "AUDIBLE",
    "SPOTIFY",
    "LUMIN",
    "MANUAL",
    "BETTERHELP",
    "*INNOSUPPS",
    "DIRTEA",
    "HVMN",
    "NORTON",
    "DAZN",
    "DPLAY",
    "HIMS & HERS",
    "COLONBROOM",
    "IRACINGCOMM",
    "HOLLANDBARR",
    "BOOST",
    "POLARWISE",
    "HUMANTRA",
    "AURI",
    "DISNEYPLUS",
    "EXPRESSVPN",
    "GREENS",
    "MOONFLASH",
    "VIR",
    "MYLAS MOSS",
    "EFFECTO",
    "PATCHES",
    "UBER ONE",
    "MICROSOFT",
  ],
  Holidays: [
    "DISNEY HOLIDAYS",
    "HOTEL",
    "UNIVERSAL",
    "BOOKINGCOMU",
    "BRITISH AIRWAYS",
  ],
  Charity: ["JG", "UNHCR"],
  Interest: ["INTEREST CHARGE"],
  Statup: [
    "NGROK",
    "MONGODBCLOUD",
    "123-REG",
    "123REGLIMIT",
    "OPENAI",
    "DARIUSLUKAS",
    "NPM",
    "TRYSINTRA",
    "POSTBOX",
    "GITHUB",
  ],
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
