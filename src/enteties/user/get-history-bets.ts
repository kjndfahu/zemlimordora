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

export const getHistoryBets = async (userId = 123): Promise<HistoryBetsResponse> => {
    try {
        let telegramInitData = ""

        if (typeof window !== "undefined") {
            const WebApp = (await import("@twa-dev/sdk")).default
            telegramInitData = WebApp.initData
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

        return {
            success: true,
            message: "История ставок успешно получена",
            bets: response.data.bets,
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Ошибка при получении истории ставок:", error.response?.data)
            return {
                success: false,
                message: error.response?.data?.message || "Ошибка при получении истории ставок",
            }
        }
        return {
            success: false,
            message: "Неизвестная ошибка при получении истории ставок",
        }
    }
}

