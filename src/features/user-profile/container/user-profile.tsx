"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { getUserProfile, type UserProfileData } from "@/enteties/admin/get-user-profile"

import { WithdrawalsBlock } from "@/features/user-profile/ui/withdrawals-block"
import { DepositsBlock } from "@/features/user-profile/ui/deposits-block"
import { BetsBlock } from "@/features/user-profile/ui/bets-block"
import { InfoBlock } from "@/features/user-profile/ui/info-block"
import { UserInformation } from "@/features/user-profile/ui/user-information"
import { BalanceBlock } from "@/features/user-profile/ui/balance-block"
import { StatisticsBlock } from "@/features/user-profile/ui/statistics-block"
import { Ban, CheckCircle, Loader2 } from "lucide-react"
import {changeUserStatus} from "@/enteties/admin/change-user-status";
import Link from "next/link";

export const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
}

export const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}

export default function UserProfile() {
    const searchParams = useSearchParams()
    const userId = searchParams.get("id") || "1"

    const [userData, setUserData] = useState<UserProfileData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<"info" | "deposits" | "withdrawals" | "bets">("info")
    const [isChangingStatus, setIsChangingStatus] = useState(false)

    const handleBalanceChange = () => {
        // TODO: Implement balance change logic
        console.log("Balance change requested")
    }

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true)
            try {
                const response = await getUserProfile()
                if (response.success && response.data) {
                    setUserData(response.data)
                } else {
                    setError(response.message)
                }
            } catch (error) {
                setError("Ошибка при загрузке данных пользователя")
                console.error("Error fetching user data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()
    }, [userId])

    const handleStatusChange = async () => {
        if (!userData) return

        setIsChangingStatus(true)
        try {
            const response = await changeUserStatus(userData.general.user_id, !userData.general.is_banned)
            if (response.success) {
                const updatedData = await getUserProfile()
                if (updatedData.success && updatedData.data) {
                    setUserData(updatedData.data)
                }
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsChangingStatus(false)
        }
    }

    if (loading) {
        return <div className="text-center py-8">Загрузка...</div>
    }

    if (error || !userData) {
        return <div className="text-center py-8 text-red-500">{error || "Данные не найдены"}</div>
    }

    const { general, other } = userData


    const totalBets = other.bets.length
    const wins = other.bets.filter((bet) => bet.issue === "win").length
    const losses = totalBets - wins

    return (
        <div>
            <div
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4 mb-4 md:mb-6">
                <Link href="/users">
                    <div
                        className="flex self-center items-center text-[15px] justify-center w-[100px] h-[30px] text-black rounded-[10px] bg-gradient-to-r from-[#00FF90] via-[#66FFA4] to-[#009353]">
                        Вернуться обратно
                    </div>
                </Link>
                <h2 className="text-lg md:text-xl font-bold">Профиль пользователя</h2>
                <div className="flex gap-2">
                    <button
                        onClick={handleStatusChange}
                        disabled={isChangingStatus}
                        className={`flex items-center gap-1 px-2 md:px-3 py-1 md:py-2 text-sm rounded-lg ${
                            !general.is_banned
                                ? "bg-red-900 text-red-200 hover:bg-red-800"
                                : "bg-green-900 text-green-200 hover:bg-green-800"
                        } disabled:opacity-50`}
                    >
                        {isChangingStatus ? (
                            <Loader2 className="h-4 w-4 animate-spin"/>
                        ) : !general.is_banned ? (
                            <>
                                <Ban className="h-4 w-4"/>
                                Заблокировать
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-4 w-4"/>
                                Разблокировать
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-6 mb-4 md:mb-6">
                <UserInformation user={general} formatDate={formatDate}/>
                <BalanceBlock userId={general.user_id} balance={general.balance} onBalanceChange={handleBalanceChange} />
                <StatisticsBlock wins={wins} losses={losses} />
            </div>

            <div className="bg-[#1E1E1E] rounded-lg border border-[#333] overflow-hidden">
                <div className="flex overflow-x-auto border-b border-[#333]">
                    <button
                        className={`px-3 py-2 md:px-4 md:py-3 text-sm md:text-base font-medium whitespace-nowrap ${activeTab === "info" ? "text-[#43FF97] border-b-2 border-[#43FF97]" : "text-gray-400"}`}
                        onClick={() => setActiveTab("info")}
                    >
                        Общая информация
                    </button>
                    <button
                        className={`px-3 py-2 md:px-4 md:py-3 text-sm md:text-base font-medium whitespace-nowrap ${activeTab === "deposits" ? "text-[#43FF97] border-b-2 border-[#43FF97]" : "text-gray-400"}`}
                        onClick={() => setActiveTab("deposits")}
                    >
                        Депозиты
                    </button>
                    <button
                        className={`px-3 py-2 md:px-4 md:py-3 text-sm md:text-base font-medium whitespace-nowrap ${activeTab === "withdrawals" ? "text-[#43FF97] border-b-2 border-[#43FF97]" : "text-gray-400"}`}
                        onClick={() => setActiveTab("withdrawals")}
                    >
                        Выводы
                    </button>
                    <button
                        className={`px-3 py-2 md:px-4 md:py-3 text-sm md:text-base font-medium whitespace-nowrap ${activeTab === "bets" ? "text-[#43FF97] border-b-2 border-[#43FF97]" : "text-gray-400"}`}
                        onClick={() => setActiveTab("bets")}
                    >
                        История ставок
                    </button>
                </div>

                <div className="p-3 md:p-4">
                    {activeTab === "info" && (
                        <InfoBlock
                            username={general.username}
                            createDate={general.create_date}
                            lastAuth={general.last_auth}
                            wins={wins}
                            losses={losses}
                            formatDate={formatDate}
                        />
                    )}

                    {activeTab === "deposits" && <DepositsBlock deposits={other.deposits} formatDateTime={formatDateTime} />}

                    {activeTab === "withdrawals" && (
                        <WithdrawalsBlock withdrawals={other.withdrawals} formatDateTime={formatDateTime} />
                    )}

                    {activeTab === "bets" && <BetsBlock bets={other.bets} formatDateTime={formatDateTime} />}
                </div>
            </div>
        </div>
    )
}

