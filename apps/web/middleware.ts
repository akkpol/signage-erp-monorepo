import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    // A list of all locales that are supported
    locales: ['en', 'th', 'mm'],

    // Used when no locale matches
    defaultLocale: 'th'
});

export const config = {
    // Match only internationalized pathnames
    // Updated to properly handle all paths under locales
    matcher: [
        '/',
        '/(th|en|mm)/:path*',
        // Exclude API routes, _next, and static files
        '/((?!api|_next|_vercel|.*\\..*).*)'
    ]
};
