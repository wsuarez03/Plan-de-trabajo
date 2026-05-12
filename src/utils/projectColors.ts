const colors = [
  '#3B82F6',
  '#EF4444',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
  '#F97316'
];

export function getRandomProjectColor() {
  return colors[
    Math.floor(Math.random() * colors.length)
  ];
}

