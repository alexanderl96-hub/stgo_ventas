export const getColorStyle = (colors) => {
  if (!colors) return "#ccc";

  const colorMap = {
    golden: "gold",
    grey: "gray"
  };

  const colorString = Array.isArray(colors)
    ? colors.join(" ")
    : colors;

  const colorArray = colorString
    .toLowerCase()
    .replace(/and/g, "")
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(color => colorMap[color] || color);

  if (colorArray.length === 1) {
    return colorArray[0];
  }

  return `linear-gradient(45deg, ${colorArray.join(", ")})`;
};