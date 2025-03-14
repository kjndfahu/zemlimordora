"use client"

import { useEffect, useState, useRef } from "react"
import { CalendarIcon } from "lucide-react"
import { getHistoryBets, type HistoryBet } from "@/enteties/user/get-history-bets"

type ResultFilter = "all" | "win" | "loss"

export default function History() {
    const [bets, setBets] = useState<HistoryBet[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [resultFilter, setResultFilter] = useState<ResultFilter>("all")
    const calendarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchBets = async () => {
            try {
                const response = await getHistoryBets()
                if (response.success && response.bets) {
                    setBets(response.bets)
                } else {
                    setError(response.message)
                }
            } catch (error) {
                setError("Ошибка при загрузке истории ставок")
            } finally {
                setLoading(false)
            }
        }

        fetchBets()
    }, [])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setIsCalendarOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const formatDateTime = (timestamp: number): string => {
        return new Date(timestamp * 1000).toLocaleString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const formatDateOnly = (timestamp: number): string => {
        return new Date(timestamp * 1000).toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
        })
    }

    const formatTimeOnly = (timestamp: number): string => {
        return new Date(timestamp * 1000).toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const filteredBets = bets
        .filter((bet) => {
            if (resultFilter === "win" && bet.issue !== "win") return false
            if (resultFilter === "loss" && bet.issue !== "lose") return false

            if (startDate) {
                const startTimestamp = new Date(startDate).getTime() / 1000
                if (bet.create_date < startTimestamp) return false
            }

            if (endDate) {
                const endTimestamp = new Date(endDate).getTime() / 1000 + 86400 // Add one day to include the end date
                if (bet.create_date > endTimestamp) return false
            }

            return true
        })
        .sort((a, b) => b.create_date - a.create_date)

    return (
        <div className="w-full rounded-lg">
            <h2 className="text-[24px] mb-3 md:mb-4 text-white">История ставок</h2>

            <div className="flex flex-col md:flex-row justify-between gap-2 md:items-center mb-3 md:mb-4">
                <div className="flex text-[14px] space-x-1 md:space-x-2">
                    <button
                        className={`px-2 py-1 rounded-md transition-colors ${
                            resultFilter === "all"
                                ? "bg-gradient-to-r from-[#00FF90] via-[#66FFA4] to-[#009353] text-black"
                                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        }`}
                        onClick={() => setResultFilter("all")}
                    >
                        Все
                    </button>
                    <button
                        className={`px-2 py-1 rounded-md transition-colors ${
                            resultFilter === "win"
                                ? "bg-gradient-to-r from-[#00FF90] via-[#66FFA4] to-[#009353] text-black"
                                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        }`}
                        onClick={() => setResultFilter("win")}
                    >
                        Выигрыши
                    </button>
                    <button
                        className={`px-2 py-1 rounded-md transition-colors ${
                            resultFilter === "loss"
                                ? "bg-gradient-to-r from-[#00FF90] via-[#66FFA4] to-[#009353] text-black"
                                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        }`}
                        onClick={() => setResultFilter("loss")}
                    >
                        Проигрыши
                    </button>
                </div>

                <div className="relative" ref={calendarRef}>
                    <button
                        className="flex items-center px-2 py-1 text-[14px] bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600"
                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    >
                        <CalendarIcon className="h-4 w-4 mr-1 md:mr-2" />
                        {startDate && endDate ? (
                            <span className="truncate max-w-[150px] md:max-w-none">
                {new Date(startDate).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "2-digit" })}{" "}
                                - {new Date(endDate).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "2-digit" })}
              </span>
                        ) : (
                            <span>Выберите даты</span>
                        )}
                    </button>

                    {isCalendarOpen && (
                        <div className="absolute right-0 mt-1 p-2 md:p-3 bg-gray-700 rounded-md shadow-lg z-10">
                            <div className="flex flex-col space-y-2">
                                <div className="flex flex-col">
                                    <label className="text-xs text-gray-300 mb-1">От:</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="px-2 py-1 text-xs md:text-sm bg-gray-800 text-white border border-gray-600 rounded-md"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-xs text-gray-300 mb-1">До:</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="px-2 py-1 text-xs md:text-sm bg-gray-800 text-white border border-gray-600 rounded-md"
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        setStartDate("")
                                        setEndDate("")
                                    }}
                                    className="text-xs text-gray-300 hover:text-white self-end"
                                >
                                    Сбросить
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="border-b border-gray-700">
                        <th className="py-3 px-3 text-left font-medium text-white">Дата и время</th>
                        <th className="py-3 px-3 text-left font-medium text-white">Игра</th>
                        <th className="py-3 px-3 text-right font-medium text-white">Сумма</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredBets.map((bet) => (
                        <tr key={bet.id} className="border-b border-gray-700 hover:bg-gray-700">
                            <td className="py-3 px-3 text-gray-300">{formatDateTime(bet.create_date)}</td>
                            <td className="py-3 px-3 text-gray-300">{bet.game_name}</td>
                            <td
                                className={`py-3 px-3 text-right font-medium ${bet.issue === "win" ? "text-green-400" : "text-red-400"}`}
                            >
                                {bet.issue === "win" ? `+${bet.reward}` : `-${bet.amount}`} ₽
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
                {filteredBets.map((bet) => (
                    <div key={bet.id} className="bg-gray-700 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <div className="text-xs text-white">{formatDateOnly(bet.create_date)}</div>
                                <div className="text-xs text-gray-300">{formatTimeOnly(bet.create_date)}</div>
                            </div>
                            <div className={`text-right font-medium ${bet.issue === "win" ? "text-green-400" : "text-red-400"}`}>
                                {bet.issue === "win" ? `+${bet.reward}` : `-${bet.amount}`} ₽
                            </div>
                        </div>
                        <div className="text-sm text-white">{bet.game_name}</div>
                    </div>
                ))}
            </div>

            {filteredBets.length === 0 && <div className="text-center py-8 text-gray-400">Нет данных для отображения</div>}
        </div>
    )
}

