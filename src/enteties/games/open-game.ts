import axios from "axios"
import WebApp from "@twa-dev/sdk"

export interface OpenGameData {
    user_id: number
    game_id: number
    play_url: string
}

interface OpenGameResponse {
    success: boolean
    message: string
    game?: OpenGameData
}

export const openGame = async (game_id: { game_id: number }): Promise<OpenGameResponse> => {
    try {
        const telegramInitData = WebApp.initData
        // Hardcoded user_id for testing, replace with actual user ID in production
        const userId = 123

        const response = await axios.post<OpenGameData>(
            `https://ce99-109-120-134-48.ngrok-free.app/api/open_game?user_id=${userId}&game_id=${game_id.game_id}`,
            null,
            {
                headers: {
                    accept: "application/json",
                    "ngrok-skip-browser-warning": "true",
                    "Bypass-Tunnel-Reminder": "true",
                    "x-telegram-data": telegramInitData,
                    "Content-Type": "application/json",
                },
            },
        )

        console.log("Open game response:", response.data)

        if (response.data.play_url) {
            // Redirect to the game URL if provided
            window.location.href = response.data.play_url
        }

        return {
            success: true,
            message: "Информация о открытии игры получена успешно",
            game: response.data,
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Use type assertion to fix TypeScript error
            const errorData = error.response?.data as Record<string, unknown> | undefined
            const errorMessage = errorData ? JSON.stringify(errorData) : error.message
            // eslint-disable-next-line no-console
            console.error("Ошибка при получении игры:", errorMessage)

            if (error.response?.status === 404 || (errorData && errorData.message === "Игра не найдена")) {
                return {
                    success: false,
                    message: "Сессия истекла. Пожалуйста, войдите снова.",
                }
            }

            // Handle case when game is unavailable
            return {
                success: false,
                message:
                    errorData && typeof errorData.message === "string" ? errorData.message : "Игра в данный момент недоступна",
            }
        } else {
            // For non-Axios errors, safely log them
            const errorMessage = error instanceof Error ? error.message : String(error)
            // eslint-disable-next-line no-console
            console.error("Неизвестная ошибка:", errorMessage)
            return {
                success: false,
                message: "Игра в данный момент недоступна",
            }
        }
    }
}

