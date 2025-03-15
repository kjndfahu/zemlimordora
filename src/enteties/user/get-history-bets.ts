import axios from "axios"

export interface HistoryBet {
    id: number
    user_id: number
    amount: number
    game_name: string
    create_date: number
    reward: number
    issue: "win" | "lose"
}

interface HistoryBetsResponse {
    success: boolean
    message: string
    bets?: HistoryBet[]
}

export const getHistoryBets = async (): Promise<HistoryBetsResponse> => {
    try {
        let telegramInitData = ""
        let userId = null

        if (typeof window !== "undefined") {
            const WebApp = (await import("@twa-dev/sdk")).default
            telegramInitData = WebApp.initData
            userId = WebApp.initDataUnsafe.user?.id
        }

        const response = await axios.get<{ bets: HistoryBet[] }>(
            `https://ce99-109-120-134-48.ngrok-free.app/api/history_bets?user_id=${userId}`,
            {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    "Bypass-Tunnel-Reminder": "true",
                    "x-telegram-data": telegramInitData,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            },
        )

        // If the response is successful but there are no bets, return an empty array
        return {
            success: true,
            message: "История ставок успешно получена",
            bets: response.data.bets || [],
        }
    } catch (error) {
        // Handle 404 or empty data case gracefully without logging errors
        if (axios.isAxiosError(error)) {
            // If it's a 404 error or the server indicates no data is available
            if (
                error.response?.status === 404 ||
                error.response?.data?.message?.includes("не найден") ||
                error.response?.data?.message?.includes("нет данных")
            ) {
                return {
                    success: true,
                    message: "История ставок пуста",
                    bets: [],
                }
            }

            // For other errors, return error without console logging
            return {
                success: false,
                message: error.response?.data?.message || "Ошибка при получении истории ставок",
            }
        }

        // For non-Axios errors
        return {
            success: false,
            message: "Неизвестная ошибка при получении истории ставок",
        }
    }
}

