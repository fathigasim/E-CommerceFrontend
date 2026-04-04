import { useEffect } from "react";
import i18next from "i18next";

// export function useBootstrapDirection() {
//   useEffect(() => {
//     const updateDirection = (lang) => {
//       const isRTL = lang === "ar";

//       document.documentElement.dir = isRTL ? "rtl" : "ltr";
//       document.body.dir = isRTL ? "rtl" : "ltr";

//       document.body.classList.remove("rtl", "ltr");
//       document.body.classList.add(isRTL ? "rtl" : "ltr");

//       document.body.style.textAlign = isRTL ? "right" : "left";
//     };

//     updateDirection(i18next.language);
//     i18next.on("languageChanged", updateDirection);

//     return () => {
//       i18next.off("languageChanged", updateDirection);
//     };
//   }, []);
// }
export function useBootstrapDirection() {
  useEffect(() => {
    const updateDirection = (lang) => {
      const isRTL = lang === "ar";
      
      // This is the most important line for Bootstrap 5
      document.documentElement.dir = isRTL ? "rtl" : "ltr";
      document.documentElement.lang = lang;

      // Avoid forcing textAlign; let Bootstrap's RTL CSS handle it
      // document.body.style.textAlign = isRTL ? "right" : "left"; 
    };

    updateDirection(i18next.language);
    i18next.on("languageChanged", updateDirection);

    return () => i18next.off("languageChanged", updateDirection);
  }, []);
}