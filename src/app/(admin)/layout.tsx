"use client"

import type React from "react"
import { useUser } from "@/features/my-account/context/user-context"
import {redirect} from "next/navigation";

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode
}) {
    const { user } = useUser()

    if (!user) {
        return null
    }

    if (!user.is_admin) {
        redirect('/')
    }

    return <main>{children}</main>
}

