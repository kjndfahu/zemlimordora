import axios from "axios"

export interface User {
    user_id: number
    balance: number
    username: string
    is_banned: boolean
}

interface UserResponse {
    success: boolean
    message: string
    user?: User
    isNgrokWarning?: boolean
}

export const getUser = async (): Promise<UserResponse> => {
    try {
        let telegramInitData = ""
        let userId = null

        if (typeof window !== "undefined") {
            const WebApp = (await import("@twa-dev/sdk")).default
            telegramInitData = WebApp.initData
            userId = 123
        }

        const response = await axios.get<User>(`https://ce99-109-120-134-48.ngrok-free.app/api/me?user_id=${userId}`, {
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Bypass-Tunnel-Reminder": "true",
                "x-telegram-data": telegramInitData,
                "Content-Type": "application/json",
            },
        })

        console.log(response.data, "response")

        return {
            success: true,
            message: "Информация о пользователе успешно получена",
            user: response.data,
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Ошибка при получении пользователя:", error.response?.data)
            if (error.response?.status === 404 || error.response?.data?.message === "Пользователь не найден") {
                return {
                    success: false,
                    message: "Сессия истекла. Пожалуйста, войдите снова.",
                }
            }
            return {
                success: false,
                message: error.response?.data?.message || "Ошибка при получении пользователя",
            }
        } else {
            console.error("Неизвестная ошибка:", error)
            return {
                success: false,
                message: "Неизвестная ошибка при получении пользователя",
            }
        }
    }
}

