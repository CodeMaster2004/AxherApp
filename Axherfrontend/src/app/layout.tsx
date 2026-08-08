import "./globals.css";
import ClientLayout from "../widgets/layout/ClientLayout";
import { ReactNode } from "react";
import { Inter } from "next/font/google";

const inter = Inter({
    subsets:["latin"],
    variable:"--font-inter",
});

type RootLayoutProps = {
    children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en">
            <body className={inter.variable}>
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}