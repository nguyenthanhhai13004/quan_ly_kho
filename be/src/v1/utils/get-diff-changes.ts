export function getDiffChangesArray(
  oldData: Record<string, any>,
  newData: Record<string, any>
) {
  const changes: Array<{
    field: string;
    old_value: any;
    new_value: any;
  }> = [];

  for (const key of Object.keys(newData)) {
    if (newData[key] !== oldData[key]) {
      changes.push({
        field: key,
        old_value: oldData[key],
        new_value: newData[key],
      });
    }
  }

  return changes.length > 0 ? changes : undefined;
}
