import { moment } from "obsidian";
import en from "./en";
import fr from "./fr"; // .ts
// with .json, add "resolveJsonModule": true, à tsconfig
import i18next from "i18next";

export const translations: Record<string, Record<string, string>> = {
	en: en,
	fr: fr,
};

const locale = translations[moment.locale()];
export const translationLanguage = locale ? moment.locale() : "en";

export function nestedProp(obj: object, textPath: string) {
	return textPath
		.split(".")
		.reduce(
			(o, k) =>
				o && o[k as keyof typeof o] ? o[k as keyof typeof o] : {},
			obj
		);
}

export function t(textPath: string) {
	const localizedValue =
		(locale && nestedProp(locale, textPath)) || nestedProp(en, textPath);
	if (localizedValue !== null) {
		return localizedValue;
	}
	return `invalid key : ${textPath}`;
}

export function initializeI18next(
	translationLanguage: string,
	translations: any
) {
	i18next.init({
		lng: translationLanguage,
		fallbackLng: "en",
		resources: translations,
		returnNull: false,
	});
}
