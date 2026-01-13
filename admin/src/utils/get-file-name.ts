export const getFileName = (base: string) => {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');

  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const hh = pad(now.getHours());
  const min = pad(now.getMinutes());
  const ss = pad(now.getSeconds());

  return `${base}_${yyyy}${mm}${dd}_${hh}${min}${ss}`;
};