import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
    transpilePackages: ['@signage-erp/database', '@signage-erp/types'],
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default withNextIntl(nextConfig);
// export default nextConfig;
