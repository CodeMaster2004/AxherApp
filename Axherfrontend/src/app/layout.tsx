import "./globals.css";
import ClientLayout from "../widgets/layout/ClientLayout";
import { ReactNode } from "react";

type RootLayoutProps = {
    children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en">
            <body>
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}