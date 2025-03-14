import axios from "axios"

interface ChangeUserStatusResponse {
    success: boolean
    message: string
}

export async function changeUserStatus(userId: number, isBanned: boolean): Promise<ChangeUserStatusResponse> {
    try {
        let telegramInitData = ""

        if (typeof window !== "undefined") {
            const WebApp = (await import("@twa-dev/sdk")).default
            telegramInitData = WebApp.initData
        }

        // The API expects query parameters, not a JSON body
        const response = await axios.post<ChangeUserStatusResponse>(
            `https://ce99-109-120-134-48.ngrok-free.app/api/admin/change_user?user_id=${userId}&is_banned=${isBanned}`,
            {}, // Empty body since we're using query parameters
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
            message: isBanned ? "Пользователь заблокирован" : "Пользователь разблокирован",
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Ошибка при изменении статуса пользователя:", error.response?.data)
            return {
                success: false,
                message: error.response?.data?.message || "Ошибка при изменении статуса пользователя",
            }
        }
        return {
            success: false,
            message: "Неизвестная ошибка при изменении статуса пользователя",
        }
    }
}

