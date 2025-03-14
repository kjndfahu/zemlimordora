"use client"

import { useState, useEffect } from "react"
import { MainLogo, ProfileLogo } from "@/shared/icons"
import Link from "next/link"
import {getUser} from "@/enteties/user/me";


export const Header = () => {
    const [balance, setBalance] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true)
                const response = await getUser()

                if (response.success && response.user) {
                    setBalance(response.user.balance)
                    setError(null)
                } else {
                    console.error("Failed to fetch user data:", response.message)
                    setError(response.message)
                }
            } catch (err) {
                console.error("Error fetching user data:", err)
                setError("Ошибка при загрузке данных")
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()
    }, [])

    const formatBalance = (balance: number) => {
        return new Intl.NumberFormat("ru-RU").format(balance)
    }

    return (
        <div className="flex items-center justify-between bg-black px-[5px] py-[20px]">
            <Link href="/">
                <MainLogo className="w-[140px] h-[40px]" />
            </Link>
            <div className="flex items-center gap-[5px]">
                <Link href="/my-account">
                    <div className="flex items-center w-[30px] h-[30px] rounded-full bg-gradient-to-r from-[#00FF90] via-[#66FFA4] to-[#009353] justify-center border-[2px] border-[#4B4B4B]">
                        <ProfileLogo className="w-[15px] h-[15px]" />
                    </div>
                </Link>
                <div className="flex items-center justify-center w-[120px] h-[30px] text-[14px] font-medium text-black rounded-full bg-gradient-to-r from-[#00FF90] via-[#66FFA4] to-[#009353] border-[2px] border-[#4B4B4B]">
                    {loading ? (
                        <span className="animate-pulse">Загрузка...</span>
                    ) : error ? (
                        <span className="text-red-800 text-xs">Ошибка</span>
                    ) : (
                        <>Баланс: {balance !== null ? `${formatBalance(balance)}$` : "0$"}</>
                    )}
                </div>
            </div>
        </div>
    )
}

