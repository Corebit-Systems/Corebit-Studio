import ru from "./ru.json";
import en from "./en.json";
import me from "./me.json";
import { Dictionary } from "./types";

const dictionaries: Record<string, Dictionary> = {
  ru,
  en,
  me,
};

export function getDictionary(lang: "ru" | "en" | "me"): Dictionary {
  return dictionaries[lang];
}