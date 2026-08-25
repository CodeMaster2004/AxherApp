import "./globals.css";
import ClientLayout from "../widgets/layout/ClientLayout";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";


const inter = Inter({
    subsets:["latin"],
    variable:"--font-inter",
});

type RootLayoutProps = {
    children: ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
    const locale = await getLocale();
    const messages = await getMessages();
    return (
        <html lang={locale}>
            <body className={inter.variable}>
                <NextIntlClientProvider
                    locale={locale}
                    messages={messages}
                >
                    <ClientLayout>{children}</ClientLayout>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}