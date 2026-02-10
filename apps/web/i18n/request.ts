import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    if (!locale || !['en', 'th', 'mm'].includes(locale)) {
        locale = 'th';
    }

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
