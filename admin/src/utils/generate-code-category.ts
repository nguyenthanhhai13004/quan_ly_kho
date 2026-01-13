export default function generateCodeCategory(name: string) {
  if (!name) throw new Error("Tên category không hợp lệ");

  const words = name.trim().split(/\s+/);

  let prefix = "";
  if (words.length === 1) {
    prefix = words[0].toUpperCase();
  } else {
    prefix = words.map((w) => w[0].toUpperCase()).join("");
  }

  const randomChars = Array.from({ length: 4 }, () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return chars.charAt(Math.floor(Math.random() * chars.length));
  }).join("");

  return `${prefix}-${randomChars}`;
}
