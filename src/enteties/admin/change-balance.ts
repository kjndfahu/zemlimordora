import axios from "axios"

interface ChangeBalanceResponse {
    success: boolean
    message: string
}

export async function changeBalance(userId: number, amount: number): Promise<ChangeBalanceResponse> {
    try {
        let telegramInitData = ""

        if (typeof window !== "undefined") {
            const WebApp = (await import("@twa-dev/sdk")).default
            telegramInitData = WebApp.initData
        }

        const response = await axios.post<ChangeBalanceResponse>(
            `https://ce99-109-120-134-48.ngrok-free.app/api/admin/change_balance?user_id=${userId}&admin_username="admin"&amount=${amount}`,
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
            message: "Баланс успешно изменен",
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Ошибка при изменении баланса:", error.response?.data)
            return {
                success: false,
                message: error.response?.data?.message || "Ошибка при изменении баланса",
            }
        }
        return {
            success: false,
            message: "Неизвестная ошибка при изменении баланса",
        }
    }
}

