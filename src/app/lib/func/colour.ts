const colors: string[] = [
  // Blues
  "#003366",
  "#336699",
  "#3366CC",
  "#003399",
  "#000099",
  "#0000CC",
  "#000066",
  "#0066CC",
  "#0099CC",
  "#006699",
  "#0099FF",
  "#33CCFF",
  "#33FFFF",
  "#3399FF",
  "#009999",
  "#6699CC",
  "#66CCFF",
  "#3399CC",
  "#0033CC",
  "#0055FF",
  "#0038E2",
  "#003BA6",
  "#0033FF",
  "#3333FF",
  "#333399",
  "#0000FF",
  "#2389DA",
  "#2A8FBD",
  "#1F7FA8",
  "#236B8E",
  "#18567F",
  "#0A3D66",
  "#022B4F",
  "#0E2233",
  "#00161A",
  "#0A2950",
  "#265077",
  "#4173A0",
  "#5C8DB4",
  "#79A6C8",
  "#95C0DB",
  "#B2DAEE",
  "#C8E7F4",
  "#DEEEFA",
  "#F4F6FD",

  // Greens
  "#008000",
  "#008A00",
  "#009200",
  "#009A00",
  "#00A200",
  "#00AA00",
  "#00B200",
  "#00BA00",
  "#00C200",
  "#00CA00",
  "#00D200",
  "#00DA00",
  "#00E200",
  "#00EA00",
  "#00F200",
  "#00FA00",
  "#10FD10",
  "#20FF20",
  "#30FF30",
  "#40FF40",
  "#50FF50",
  "#60FF60",
  "#70FF70",
  "#80FF80",
  "#90FF90",
  "#A0FFA0",
  "#B0FFB0",
  "#C0FFC0",
  "#D0FFD0",
  "#E0FFE0",
  "#F0FFF0",
  "#00FF00",
  "#2EFF2E",
  "#5CFF5C",
  "#89FF89",
  "#B7FFB7",
  "#E4FFE4",
  "#0A800A",
  "#0F950F",
  "#149A14",
  "#199F19",
  "#1EA41E",
  "#23A923",
  "#28AE28",
  "#2DB32D",
  "#32B832",
  "#37BD37",
  "#3CC23C",
  "#42C742",
  "#47CC47",

  // Oranges
  "#FF4500",
  "#FF5500",
  "#FF6500",
  "#FF7500",
  "#FF8500",
  "#FF9500",
  "#FFA500",
  "#FFB500",
  "#FFC500",
  "#FFD500",
  "#FFE500",
  "#FFF500",
  "#FFFA00",
  "#FAE600",
  "#F5D200",
  "#F0BF00",
  "#EBAF00",
  "#E79F00",
  "#E39000",
  "#E08000",
  "#DD7000",
  "#D96000",
  "#D45000",
  "#CF4000",
  "#CA3000",
  "#C52000",
  "#C01000",
  "#BB0000",
  "#B40F00",
  "#AE1E00",
  "#A72D00",
  "#A03C00",
  "#994B00",
  "#8E5A00",
  "#836900",
  "#787800",
  "#6D8700",
  "#629600",
  "#57A500",
  "#4CB400",
  "#41C300",

  // Reds
  "#8B0000",
  "#A50000",
  "#BF0000",
  "#D90000",
  "#F30000",
  "#FF0A0A",
  "#FF2121",
  "#FF3838",
  "#FF4F4F",
  "#FF6666",
  "#FF7D7D",
  "#FF9494",
  "#FFABAB",
  "#FFC2C2",
  "#FFD9D9",
  "#FFF0F0",
  "#D32F2F",
  "#E57373",
  "#F44336",
  "#E53935",
  "#D81B60",
  "#C2185B",
  "#AD1457",
  "#880E4F",
  "#B71C1C",
  "#C62828",
  "#D32F2F",
  "#E53935",
  "#F44336",
  "#EF5350",
  "#E57373",
  "#EF9A9A",
  "#E53935",
  "#D32F2F",
  "#C62828",
  "#B71C1C",
  "#FFCDD2",
  "#FFEBEE",
  "#FF1744",
  "#F50057",
  "#C51162",
];

// console.log(colors);  // This will output the array of 200 colors

// console.log(colors); // This will output the array of 100 colors
export function getRandomColor(): string {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

// console.log(getRandomColor()); // This will output a random color from the list
