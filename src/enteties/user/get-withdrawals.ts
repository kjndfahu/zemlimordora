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

export const getWithdrawals = async (): Promise<WithdrawalsResponse> => {
    try {
        let telegramInitData = ""
        let userId = null

        if (typeof window !== "undefined") {
            const WebApp = (await import("@twa-dev/sdk")).default
            telegramInitData = WebApp.initData
            userId = WebApp.initDataUnsafe.user?.id
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
            withdrawal_rows: response.data.withdrawal_rows || [],
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
                    message: "История выводов пуста",
                    withdrawal_rows: [],
                }
            }

            // For other errors, return error without console logging
            return {
                success: false,
                message: error.response?.data?.message || "Ошибка при получении выводов",
            }
        }

        // For non-Axios errors
        return {
            success: false,
            message: "Ошибка при получении выводов",
        }
    }
}

