// constants/typeColors.js
export const TYPE_COLORS = {
  fire: "#FF4C4C",
  water: "#4C9EFF",
  grass: "#4CAF50",
  electric: "#FFD700",
  psychic: "#FF6BA8",
  ice: "#74D7EC",
  dragon: "#6A3DE8",
  dark: "#3D3D3D",
  fairy: "#FF9EC9",
  normal: "#A8A878",
  fighting: "#C03028",
  flying: "#A890F0",
  poison: "#A040A0",
  ground: "#E0C068",
  rock: "#B8A038",
  bug: "#A8B820",
  ghost: "#705898",
  steel: "#B8B8D0",
};

export function getTypeColor(type) {
  return TYPE_COLORS[type] || "#A8A878";
}
