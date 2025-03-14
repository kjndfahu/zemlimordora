import axios from "axios"

export interface Withdrawal {
    id: number
    user_id: number
    amount: number
    address: string
    create_date: number
}

interface WithdrawalsResponse {
    success: boolean
    message: string
    withdrawal_rows?: Withdrawal[]
}

export const getWithdrawals = async (userId = 123): Promise<WithdrawalsResponse> => {
    try {
        let telegramInitData = ""

        if (typeof window !== "undefined") {
            const WebApp = (await import("@twa-dev/sdk")).default
            telegramInitData = WebApp.initData
        }

        const response = await axios.get<{ withdrawal_rows: Withdrawal[] }>(
            `https://ce99-109-120-134-48.ngrok-free.app/api/withdrawals?user_id=${userId}`,
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
            message: "Выводы успешно получены",
            withdrawal_rows: response.data.withdrawal_rows,
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Ошибка при получении выводов:", error.response?.data)
            return {
                success: false,
                message: error.response?.data?.message || "Ошибка при получении выводов",
            }
        }
        return {
            success: false,
            message: "Неизвестная ошибка при получении выводов",
        }
    }
}

