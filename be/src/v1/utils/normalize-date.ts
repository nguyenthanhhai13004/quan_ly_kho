const normalizeDate = (value: string | null | undefined) => {
  return value && value.trim() !== "" ? value : null;
};
export default normalizeDate;