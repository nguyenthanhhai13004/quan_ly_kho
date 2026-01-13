function generateTransactionCode(): string {
  const prefix = "KQN";
  let randomNumber = "";

  for (let i = 0; i < 10; i++) {
    randomNumber += Math.floor(Math.random() * 10);
  }

  return `${prefix}${randomNumber}`;
}
export default generateTransactionCode;