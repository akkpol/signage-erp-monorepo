import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
    transpilePackages: ['@signage-erp/database'],
};

export default withNextIntl(nextConfig);
