export default function generateBatchCode(): string {
  const prefix = "BATCH-";
  const timestamp = Date.now().toString().slice(-6);
  let randomNumber = "";
  for (let i = 0; i < 4; i++) {
    randomNumber += Math.floor(Math.random() * 10);
  }
  return `${prefix}${timestamp}${randomNumber}`;
}
