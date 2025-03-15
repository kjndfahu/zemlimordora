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
        let userId = null

        if (typeof window !== "undefined") {
            const WebApp = (await import("@twa-dev/sdk")).default
            telegramInitData = WebApp.initData
            userId = WebApp.initDataUnsafe.user?.id
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
        // Silently handle errors without logging to console
        let errorMessage = "Ошибка при получении платежей"

        if (axios.isAxiosError(error) && error.response?.data?.message) {
            errorMessage = error.response.data.message
        }

        return {
            success: false,
            message: errorMessage,
        }
    }
}

