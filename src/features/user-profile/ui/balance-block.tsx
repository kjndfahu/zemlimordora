"use client"

import { useState } from "react"
import { PlusCircle, MinusCircle } from "lucide-react"
import {changeBalance} from "@/enteties/admin/change-balance";


interface BalanceBlockProps {
    userId: number
    balance: number
    onBalanceChange: () => void
}

export const BalanceBlock = ({ userId, balance, onBalanceChange }: BalanceBlockProps) => {
    const [addAmount, setAddAmount] = useState("")
    const [subtractAmount, setSubtractAmount] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleAddBalance = async () => {
        if (!addAmount || isNaN(Number(addAmount)) || Number(addAmount) <= 0) {
            return
        }

        setIsLoading(true)
        try {
            const response = await changeBalance(userId, Number(addAmount))
            if (response.success) {
                setAddAmount("")
                onBalanceChange()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubtractBalance = async () => {
        if (!subtractAmount || isNaN(Number(subtractAmount)) || Number(subtractAmount) <= 0) {
            return
        }

        setIsLoading(true)
        try {
            const response = await changeBalance(userId, -Number(subtractAmount))
            if (response.success) {
                setSubtractAmount("")
                onBalanceChange()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-[#1E1E1E] p-4 md:p-6 rounded-lg border border-[#333]">
            <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4">Баланс</h3>

            <div className="mb-3 md:mb-6">
                <p className="text-sm text-gray-400">Текущий баланс</p>
                <p className="text-2xl md:text-3xl font-bold text-[#43FF97]">${balance.toFixed(2)}</p>
            </div>

            <div className="space-y-3">
                <div>
                    <p className="text-sm text-gray-400 mb-1 md:mb-2">Добавить баланс</p>
                    <div className="flex text-[14px] gap-2">
                        <input
                            type="text"
                            placeholder="100"
                            value={addAmount}
                            onChange={(e) => setAddAmount(e.target.value)}
                            disabled={isLoading}
                            className="bg-[#2A2A2A] border border-[#333] rounded-lg px-3 py-2 w-full focus:outline-none focus:border-[#43FF97] disabled:opacity-50"
                        />
                        <button
                            onClick={handleAddBalance}
                            disabled={isLoading}
                            className="bg-[#43FF97] text-black px-3 py-2 rounded-lg font-medium hover:bg-[#3AE889] flex items-center gap-1 disabled:opacity-50"
                        >
                            <PlusCircle className="h-4 w-4" />
                            Добавить
                        </button>
                    </div>
                </div>

                <div>
                    <p className="text-sm text-gray-400 mb-1 md:mb-2">Убавить баланс</p>
                    <div className="flex text-[14px] gap-2">
                        <input
                            type="text"
                            placeholder="50"
                            value={subtractAmount}
                            onChange={(e) => setSubtractAmount(e.target.value)}
                            disabled={isLoading}
                            className="bg-[#2A2A2A] border border-[#333] rounded-lg px-3 py-2 w-full focus:outline-none focus:border-[#43FF97] disabled:opacity-50"
                        />
                        <button
                            onClick={handleSubtractBalance}
                            disabled={isLoading}
                            className="bg-red-500 text-white px-3 py-2 rounded-lg font-medium hover:bg-red-600 flex items-center gap-1 disabled:opacity-50"
                        >
                            <MinusCircle className="h-4 w-4" />
                            Убавить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

