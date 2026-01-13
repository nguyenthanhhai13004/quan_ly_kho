const API = import.meta.env.VITE_API_URL;
export default function getImgSrc(src: string) {
  if (!src) return "";
  if (src.startsWith("blob:")) return src;
  if (/^https?:\/\//.test(src)) return src;
  const cleanSrc = src.replace(/^(\/+)/, "");
  return `${API}/${cleanSrc}`;
}