import type { ProviderType } from "@/kernel/types"
import axios from "axios"

export interface Game {
    id: number
    name: string
    img_url: string
    category: string
    provider_name: ProviderType
    is_first: boolean
    priority: number // Added priority field
}

export interface GamesData {
    games: Game[]
}

interface GameResponse {
    success: boolean
    message: string
    games?: Game[]
    isNgrokWarning?: boolean
}

export const getGames = async (): Promise<GameResponse> => {
    try {
        let telegramInitData = ""

        if (typeof window !== "undefined") {
            const WebApp = (await import("@twa-dev/sdk")).default
            telegramInitData = WebApp.initData
        }

        const response = await axios.get<GamesData>(`https://ce99-109-120-134-48.ngrok-free.app/api/games`, {
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Bypass-Tunnel-Reminder": "true",
                "x-telegram-data": telegramInitData,
                "Content-Type": "application/json",
            },
        })

        // Sort games by priority in descending order
        const sortedGames = response.data.games.sort((a, b) => (b.priority || 0) - (a.priority || 0))

        return {
            success: true,
            message: "Игры успешно получены",
            games: sortedGames,
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Ошибка при получении игр:", error.response?.data)
            if (error.response?.status === 404 || error.response?.data?.message === "Игры не найдены") {
                return {
                    success: false,
                    message: "Сессия истекла. Пожалуйста, войдите снова.",
                }
            }
            return {
                success: false,
                message: error.response?.data?.message || "Ошибка при получении игр",
            }
        } else {
            console.error("Неизвестная ошибка:", error)
            return {
                success: false,
                message: "Неизвестная ошибка при получении игр",
            }
        }
    }
}

