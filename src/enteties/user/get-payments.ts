import axios from "axios"

export interface Payment {
    id: number
    user_id: number
    amount: number
    create_date: string
}

interface PaymentsResponse {
    success: boolean
    message: string
    payment_rows?: Payment[]
}

export const getPayments = async (): Promise<PaymentsResponse> => {
    try {
        let telegramInitData = ""
        let userId = 123

        if (typeof window !== "undefined") {
            const WebApp = (await import("@twa-dev/sdk")).default
            telegramInitData = WebApp.initData
        }

        const response = await axios.get<{ payment_rows: Payment[] }>(
            `https://ce99-109-120-134-48.ngrok-free.app/api/payments?user_id=${userId}`,
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
            message: "Платежи успешно получены",
            payment_rows: response.data.payment_rows,
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Ошибка при получении платежей:", error.response?.data)
            return {
                success: false,
                message: error.response?.data?.message || "Ошибка при получении платежей",
            }
        }
        return {
            success: false,
            message: "Неизвестная ошибка при получении платежей",
        }
    }
}

