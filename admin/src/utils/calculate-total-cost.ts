export function calculateTotalCost(
  items: { quantity: number; cost: number }[],
) {
  return items.reduce(
    (total, item) => total + (item.cost || 0) * (item.quantity || 0),
    0,
  );
}
