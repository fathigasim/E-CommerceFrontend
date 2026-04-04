import { useTranslation } from "react-i18next";
import { Button, Container } from "react-bootstrap";
import i18n from "../i18n";
import {useBootstrapDirection} from "../languagehelper/useBootstrapDirection"  
export default function LangSelector() {
  const { t } = useTranslation("navbar");
 useBootstrapDirection();
  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  const isArabic = i18n.language === "ar";

  return (
    
      <Button className="btn btn-primary"  onClick={toggleLanguage}>
        {t("Switchto")} {isArabic ? t("English") : t("Arabic")}
      </Button>
    
  );
}