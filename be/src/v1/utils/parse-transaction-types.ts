import TransactionTypeEnum from "../cores/enums/transaction-type.enum";

export function parseTransactionTypes(input?: string | string[]): number[] {
  if (!input) {
    return [
      TransactionTypeEnum.IMPORT,
      TransactionTypeEnum.EXPORT,
      TransactionTypeEnum.ALLOCATION_RETURN,
      TransactionTypeEnum.DISPOSAL,
    ];
  }

  if (Array.isArray(input)) {
    return input.map(Number).filter(n => !isNaN(n));
  }

  return input
    .split(",")
    .map(s => parseInt(s.trim(), 10))
    .filter(n => !isNaN(n));
}