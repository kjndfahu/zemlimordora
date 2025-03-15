import axios from "axios"

interface ChangeGamePriorityParams {
    game_id: number
    priority: number
}

interface ChangeGamePriorityResponse {
    success: boolean
    message: string
}

export const changeGamePriority = async (params: ChangeGamePriorityParams): Promise<ChangeGamePriorityResponse> => {
    try {
        let telegramInitData = ""

        if (typeof window !== "undefined") {
            const WebApp = (await import("@twa-dev/sdk")).default
            telegramInitData = WebApp.initData
        }

        const response = await axios.post<ChangeGamePriorityResponse>(
            `https://ce99-109-120-134-48.ngrok-free.app/api/admin/change_game_priority`,
            {
                game_id: params.game_id,
                priority: params.priority,
            },
            {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    "Bypass-Tunnel-Reminder": "true",
                    "x-telegram-data": telegramInitData,
                    "Content-Type": "application/json",
                },
            },
        )

        return {
            success: true,
            message: "Приоритет игры успешно изменен",
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Safe error logging to avoid potential undefined access
            console.error("Ошибка при изменении приоритета игры:", error.message)
            return {
                success: false,
                message: error.response?.data?.message || "Ошибка при изменении приоритета игры",
            }
        }
        // Handle non-Axios errors
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error("Неизвестная ошибка:", errorMessage)
        return {
            success: false,
            message: "Неизвестная ошибка при изменении приоритета игры",
        }
    }
}

