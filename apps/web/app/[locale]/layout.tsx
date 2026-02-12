import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google"; // Using Inter for Clean Modern look
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "PrintFlow ERP",
  description: "Modern ERP for Signage Business",
  manifest: "/manifest.json",
};

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'th' }, { locale: 'mm' }];
}

import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const { children } = props;

  // Ensure that the incoming `locale` is valid
  if (!['en', 'th', 'mm'].includes(locale)) {
    notFound();
  }

  // Enable static rendering
  unstable_setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>
            <div className="flex min-h-screen bg-app overflow-hidden">
              <Sidebar locale={locale} />

              <main className="flex-1 ml-64 p-6 relative flex flex-col h-screen overflow-hidden">
                {/* Background glow effects */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-magenta-500/10 blur-[120px] rounded-full pointer-events-none" />

                <TopBar locale={locale} />

                <div className="relative z-10 glass rounded-3xl flex-1 p-6 shadow-2xl border border-white/5 overflow-hidden">
                  <div className="h-full overflow-y-auto scrollbar-hide">
                    {children}
                  </div>
                </div>
              </main>
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
