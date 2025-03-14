import type React from "react";

export default async function AdminLayout({
                                                children,
                                            }: {
    children: React.ReactNode;
}) {


    return (
        <main>
            {children}
        </main>
    )
}