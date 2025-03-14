import axios from "axios"

export interface User {
    user_id: number
    username: string
    balance: number
    is_banned: boolean
    create_date: number
    last_auth: number
}

interface UsersResponse {
    success: boolean
    message: string
    users: User[]
}

export const getUsers = async (): Promise<UsersResponse> => {
    try {
        let telegramInitData = ""

        if (typeof window !== "undefined") {
            const WebApp = (await import("@twa-dev/sdk")).default
            telegramInitData = WebApp.initData
        }

        const response = await axios.get<{ users: User[] }>("https://ce99-109-120-134-48.ngrok-free.app/api/admin/users", {
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Bypass-Tunnel-Reminder": "true",
                "x-telegram-data": telegramInitData,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })

        return {
            success: true,
            message: "Пользователи успешно получены",
            users: response.data.users,
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Ошибка при получении пользователей:", error.response?.data)
            return {
                success: false,
                message: error.response?.data?.message || "Ошибка при получении пользователей",
                users: [],
            }
        }
        return {
            success: false,
            message: "Неизвестная ошибка при получении пользователей",
            users: [],
        }
    }
}

