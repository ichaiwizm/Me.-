import { useTranslation } from "react-i18next";
import { PERSONAL_INFO } from "../personal-info";

export function usePersonalInfo() {
  const { t } = useTranslation("data");

  return {
    fullName: PERSONAL_INFO.fullName,
    title: t("personalInfo.title"),
    subtitle: t("personalInfo.subtitle"),
    contact: {
      email: PERSONAL_INFO.contact.email,
      phone: PERSONAL_INFO.contact.phone,
      location: t("personalInfo.location"),
    },
    bio: {
      short: t("personalInfo.bio.short"),
      long: t("personalInfo.bio.long"),
    },
    qualities: t("personalInfo.qualities", { returnObjects: true }) as Array<{
      trait: string;
      icon: string;
    }>,
    languages: t("personalInfo.languages", { returnObjects: true }) as Array<{
      name: string;
      level: string;
    }>,
    social: PERSONAL_INFO.social,
  };
}
