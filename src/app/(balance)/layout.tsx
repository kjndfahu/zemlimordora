import type React from "react";
import HorizontalNav from "@/features/horizontal-navbar/container/horizontal-nav";

export default async function BalanceLayout({
                                                     children,
                                                 }: {
    children: React.ReactNode;
}) {


    return (
        <main>
            <HorizontalNav/>
            {children}
        </main>
    )
}