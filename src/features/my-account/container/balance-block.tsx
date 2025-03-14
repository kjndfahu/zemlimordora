'use client'

import {useEffect, useState} from "react";
import {getUser, User} from "@/enteties/user/me";

export const BalanceBlock = () => {
    const [user, setUser] = useState<User>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await getUser()
                if (response.success && response.user) {
                    setUser(response.user)
                }
            } catch (error) {
                console.error("Ошибка при загрузке игр:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchGames()
    }, [])

    console.log(user)

    return (
        <div
            className="flex flex-col gap-2 text-[20px] py-[20px] px-[20px] w-full h-[200px] rounded-[20px] bg-[#414141]">
            ID
            <h3>{user?.user_id}</h3>
            Баланс
            <h3>{user?.balance}</h3>
        </div>
    )
}