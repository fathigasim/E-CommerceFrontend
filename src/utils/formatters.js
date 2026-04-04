import i18n from 'i18next';


export const formatters = {
    currency: (value, currency = 'SAR') =>
        new Intl.NumberFormat(i18n.language || navigator.language, {
            style: 'currency',
            currency,
        }).format(value),

    number: (value) =>
        new Intl.NumberFormat(i18n.language || navigator.language).format(value),

    date: (value) =>
        new Intl.DateTimeFormat(i18n.language || navigator.language, {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(new Date(value)),
};
