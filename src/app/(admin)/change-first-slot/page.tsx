"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {changeGamePriority} from "@/enteties/admin/change-first-slot";


interface Notification {
    type: "success" | "error"
    message: string
}

export default function ChangeGamePriority() {
    const [gameId, setGameId] = useState("")
    const [priority, setPriority] = useState("")
    const [loading, setLoading] = useState(false)
    const [notification, setNotification] = useState<Notification | null>(null)

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

        if (!gameId || !priority) {
            setNotification({
                type: "error",
                message: "Пожалуйста, заполните все поля",
            })
            return
        }

        try {
            setLoading(true)
            const response = await changeGamePriority({
                game_id: Number(gameId),
                priority: Number(priority),
            })

            if (response.success) {
                setNotification({
                    type: "success",
                    message: response.message,
                })
                setGameId("")
                setPriority("")
            } else {
                setNotification({
                    type: "error",
                    message: response.message,
                })
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            console.error("Error in form submission:", errorMessage)
            setNotification({
                type: "error",
                message: "Произошла ошибка при изменении приоритета",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white p-4">
            <div className="max-w-md mx-auto mt-8">
                <h1 className="text-2xl font-bold mb-6">Изменить приоритет игры</h1>

                {notification && (
                    <div
                        className={`p-3 mb-4 rounded-md ${
                            notification.type === "success"
                                ? "bg-green-500/20 border border-green-500"
                                : "bg-red-500/20 border border-red-500"
                        }`}
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

                    <div className="space-y-2">
                        <label htmlFor="priority" className="block text-sm font-medium">
                            Приоритет
                        </label>
                        <input
                            id="priority"
                            type="number"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            placeholder="Введите приоритет (больше = выше)"
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

