"use client"

import { useEffect, useState, useRef } from "react"
import { CalendarIcon, ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import {getPayments} from "@/enteties/user/get-payments";
import {getWithdrawals} from "@/enteties/user/get-withdrawals";


type TransactionType = "all" | "deposit" | "withdrawal"

interface Transaction {
    id: number
    user_id: number
    amount: number
    create_date: number
    type: "deposit" | "withdrawal"
    address?: string
}

export default function TransactionsTable() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [transactionType, setTransactionType] = useState<TransactionType>("all")
    const calendarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError(null)
            try {
                const [paymentsResponse, withdrawalsResponse] = await Promise.all([getPayments(), getWithdrawals()])

                const allTransactions: Transaction[] = []

                if (paymentsResponse.success && paymentsResponse.payment_rows) {
                    const mappedPayments = paymentsResponse.payment_rows.map((payment) => ({
                        id: payment.id,
                        user_id: payment.user_id,
                        amount: payment.amount,
                        create_date: payment.create_date,
                        type: payment.amount > 0 ? ("deposit" as const) : ("withdrawal" as const),
                    }))
                    allTransactions.push(...mappedPayments)
                }

                if (withdrawalsResponse.success && withdrawalsResponse.withdrawal_rows) {
                    const mappedWithdrawals = withdrawalsResponse.withdrawal_rows.map((withdrawal) => ({
                        id: withdrawal.id,
                        user_id: withdrawal.user_id,
                        amount: -Math.abs(withdrawal.amount),
                        create_date: withdrawal.create_date,
                        type: "withdrawal" as const,
                        address: withdrawal.address,
                    }))
                    allTransactions.push(...mappedWithdrawals)
                }

                allTransactions.sort((a, b) => b.create_date - a.create_date)
                setTransactions(allTransactions)
            } catch (error) {
                setError("Ошибка при загрузке данных")
                console.error("Error fetching data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
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

    const formatDate = (timestamp: number): string => {
        return new Date(timestamp).toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const filteredTransactions = transactions.filter((transaction) => {
        if (transactionType === "deposit" && transaction.type !== "deposit") return false
        if (transactionType === "withdrawal" && transaction.type !== "withdrawal") return false

        if (startDate) {
            const startTimestamp = new Date(startDate).getTime()
            if (transaction.create_date < startTimestamp) return false
        }

        if (endDate) {
            const endTimestamp = new Date(endDate).getTime() + 86400000 // Add one day to include the end date
            if (transaction.create_date > endTimestamp) return false
        }

        return true
    })


    return (
        <div className="w-full rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="flex space-x-2">
                    <button
                        className={`px-3 py-1 text-sm rounded-md ${
                            transactionType === "all"
                                ? "bg-gradient-to-r from-[#00FF90] via-[#66FFA4] to-[#009353] text-black"
                                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        }`}
                        onClick={() => setTransactionType("all")}
                    >
                        Все
                    </button>
                    <button
                        className={`px-3 py-1 text-sm rounded-md ${
                            transactionType === "deposit"
                                ? "bg-gradient-to-r from-[#00FF90] via-[#66FFA4] to-[#009353] text-black"
                                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        }`}
                        onClick={() => setTransactionType("deposit")}
                    >
                        Депозит
                    </button>
                    <button
                        className={`px-3 py-1 text-sm rounded-md ${
                            transactionType === "withdrawal"
                                ? "bg-gradient-to-r from-[#00FF90] via-[#66FFA4] to-[#009353] text-black"
                                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        }`}
                        onClick={() => setTransactionType("withdrawal")}
                    >
                        Вывод
                    </button>
                </div>

                <div className="relative" ref={calendarRef}>
                    <button
                        className="flex items-center px-3 py-1 text-sm bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600"
                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    >
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {startDate && endDate ? (
                            <span>
                {new Date(startDate).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "2-digit" })}{" "}
                                - {new Date(endDate).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "2-digit" })}
              </span>
                        ) : (
                            <span>Выберите даты</span>
                        )}
                    </button>

                    {isCalendarOpen && (
                        <div className="absolute right-0 mt-1 p-3 bg-gray-700 rounded-md shadow-lg z-10">
                            <div className="flex flex-col space-y-2">
                                <div className="flex flex-col">
                                    <label className="text-xs text-gray-300 mb-1">От:</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="px-2 py-1 text-sm bg-gray-800 text-white border border-gray-600 rounded-md"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-xs text-gray-300 mb-1">До:</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="px-2 py-1 text-sm bg-gray-800 text-white border border-gray-600 rounded-md"
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

            <div className="overflow-x-auto text-[12px]">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="border-b text-white text-[18px] border-gray-600">
                        <th className="py-2 px-2 text-left font-medium">ID</th>
                        <th className="py-2 px-2 text-left font-medium">Тип</th>
                        {transactionType === "withdrawal" && <th className="py-3 px-4 text-left font-medium">Адрес</th>}
                        <th className="py-2 px-2 text-left font-medium">Дата</th>
                        <th className="py-2 px-2 text-right font-medium">Сумма</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction) => (
                            <tr
                                key={`${transaction.type}-${transaction.id}`}
                                className="border-b text-white border-gray-700 cursor-pointer hover:bg-gray-700"
                            >
                                <td className="py-2 px-2 text-gray-300">{transaction.id}</td>
                                <td className="py-2 px-2">
                    <span
                        className={`px-2 py-1 rounded text-xs font-medium flex items-center w-fit ${
                            transaction.type === "deposit" ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"
                        }`}
                    >
                      {transaction.type === "deposit" ? (
                          <>
                              <ArrowDownIcon className="h-3 w-3 mr-1" />
                              Депозит
                          </>
                      ) : (
                          <>
                              <ArrowUpIcon className="h-3 w-3 mr-1" />
                              Вывод
                          </>
                      )}
                    </span>
                                </td>
                                {transactionType === "withdrawal" && (
                                    <td className="py-2 px-2 text-gray-300 font-mono text-sm">{transaction.address || "-"}</td>
                                )}
                                <td className="py-2 px-2 text-gray-300">{formatDate(transaction.create_date)}</td>
                                <td
                                    className={`py-2 px-2 text-right font-medium ${
                                        transaction.type === "deposit" ? "text-green-400" : "text-red-400"
                                    }`}
                                >
                                    {Math.abs(transaction.amount)} ₽
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={transactionType === "withdrawal" ? 5 : 4} className="py-8 text-center text-gray-400">
                                Транзакции не найдены
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

