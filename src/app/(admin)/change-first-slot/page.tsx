"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {changeFirstSlot} from "@/enteties/admin/change-first-slot";


interface Notification {
    type: "success" | "error"
    message: string
}

export default function ChangeFirstSlot() {
    const [gameId, setGameId] = useState("")
    const [loading, setLoading] = useState(false)
    const [notification, setNotification] = useState<Notification | null>(null)

    // Auto-hide notification after 3 seconds
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [notification])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!gameId) {
            setNotification({
                type: "error",
                message: "Пожалуйста, введите ID игры",
            })
            return
        }

        try {
            setLoading(true)
            const response = await changeFirstSlot(Number(gameId))

            if (response.success) {
                setNotification({
                    type: "success",
                    message: response.message,
                })
                setGameId("")
            } else {
                setNotification({
                    type: "error",
                    message: response.message,
                })
            }
        } catch (error) {
            setNotification({
                type: "error",
                message: "Произошла ошибка при изменении первого слота",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white p-4">
            <div className="max-w-md mx-auto mt-8">
                <h1 className="text-2xl font-bold mb-6">Изменить первый слот</h1>

                {notification && (
                    <div
                        className={`p-3 mb-4 rounded-md ${notification.type === "success" ? "bg-green-500/20 border border-green-500" : "bg-red-500/20 border border-red-500"}`}
                    >
                        {notification.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="gameId" className="block text-sm font-medium">
                            ID игры
                        </label>
                        <input
                            id="gameId"
                            type="number"
                            value={gameId}
                            onChange={(e) => setGameId(e.target.value)}
                            placeholder="Введите ID игры"
                            className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full p-2 rounded-md bg-green-500 hover:bg-green-600 text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? "Сохранение..." : "Сохранить"}
                    </button>
                </form>
            </div>
        </div>
    )
}

