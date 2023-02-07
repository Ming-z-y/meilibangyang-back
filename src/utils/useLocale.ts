import { useContext } from "react";
import { GlobalContext } from "@/context";
import defaultLocale from "../locale";

function useLocale(locale: {
  "en-US": Record<string, unknown>;
  "zh-CN": Record<string, unknown>;
}) {
  const lang = useContext(GlobalContext).lang || 'zh-CN';
  return (locale || defaultLocale)[lang] || {};
}

export default useLocale;
