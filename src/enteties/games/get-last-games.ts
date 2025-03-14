import type { ProviderType } from "@/kernel/types"
import axios from "axios"

export interface LastGames {
    id: number
    name: string
    img_url: string
    category: string
    provider_name: ProviderType
    is_first: boolean
}

export interface LastGamesData {
    games: LastGames[]
}

interface LastGamesResponse {
    success: boolean
    message: string
    games?: LastGames[]
}

export const getLastGames = async (): Promise<LastGamesResponse> => {
    try {
        let telegramInitData = ""
        let userId = null

        if (typeof window !== "undefined") {
            const WebApp = (await import("@twa-dev/sdk")).default
            telegramInitData = WebApp.initData
            userId  = 123;
        }

        const response = await axios.get<LastGamesData>(`https://ce99-109-120-134-48.ngrok-free.app/api/last_games`, {
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Bypass-Tunnel-Reminder": "true",
                "x-telegram-data": telegramInitData,
                "Content-Type": "application/json",
            },
            params:{
                user_id: userId
            }
        })

        return {
            success: true,
            message: "Игры успешно получены",
            games: response.data.games,
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

