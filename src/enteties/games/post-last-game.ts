import axios from "axios"
import WebApp from "@twa-dev/sdk";

export interface LastGame {
    game_id: number;
}

interface LastGameResponse {
    success: boolean
    message: string
    game?: LastGame
}

export const postLastGame = async (game_id: LastGame): Promise<LastGameResponse> => {
    try {
        const telegramInitData = WebApp.initData
        const response = await axios.post<LastGame>(`https://ce99-109-120-134-48.ngrok-free.app/api/last_games?user_id=123&game_id=7000`, {
            headers: {
                accept: "application/json",
                "ngrok-skip-browser-warning": "true",
                "Bypass-Tunnel-Reminder": "true",
                "x-telegram-data": telegramInitData,
                "Content-Type": "application/json",
            }
        })

        console.log("Last game response:", response.data)

        return {
            success: true,
            message: "Информация о получении игры получена успешно",
            game: response.data,
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Ошибка при получении награды:", error.response?.data)
            if (error.response?.status === 404 || error.response?.data?.message === "Игра не найдена") {
                return {
                    success: false,
                    message: "Сессия истекла. Пожалуйста, войдите снова.",
                }
            }
            return {
                success: false,
                message: error.response?.data?.message || "Ошибка при получении игры",
            }
        } else {
            console.error("Неизвестная ошибка:", error)
            return {
                success: false,
                message: "Неизвестная ошибка при игры",
            }
        }
    }
}

