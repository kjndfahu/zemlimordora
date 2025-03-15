"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getUser, type User } from "@/enteties/user/me"

interface UserContextType {
    user: User | undefined
    loading: boolean
    refetchUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>()
    const [loading, setLoading] = useState(true)

    const fetchUser = async () => {
        try {
            const response = await getUser()
            if (response.success && response.user) {
                setUser(response.user)
            }
        } catch (error) {
            console.error("Ошибка при получении пользователя:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const refetchUser = async () => {
        setLoading(true)
        await fetchUser()
    }

    return <UserContext.Provider value={{ user, loading, refetchUser }}>{children}</UserContext.Provider>
}

export function useUser() {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider")
    }
    return context
}

