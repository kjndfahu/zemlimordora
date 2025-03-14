import axios from "axios"

interface UserBet {
    id: number
    user_id: number
    amount: number
    reward: number
    issue: string
    game_name: string
    create_date: number
}

interface UserDeposit {
    id: number
    user_id: number
    amount: number
    create_date: number
}

interface UserWithdrawal {
    id: number
    user_id: number
    amount: number
    address: string
    create_date: number
}

interface UserGeneralInfo {
    user_id: number
    username: string
    balance: number
    is_banned: boolean
    create_date: number
    last_auth: number
}

interface UserOtherInfo {
    bets: UserBet[]
    deposits: UserDeposit[]
    withdrawals: UserWithdrawal[]
}

export interface UserProfileData {
    general: UserGeneralInfo
    other: UserOtherInfo
}

interface UserProfileResponse {
    success: boolean
    message: string
    data: UserProfileData | null
}

export async function getUserProfile(userId: string | number): Promise<UserProfileResponse> {
    try {
        let telegramInitData = ""

        if (typeof window !== "undefined") {
            const WebApp = (await import("@twa-dev/sdk")).default
            telegramInitData = WebApp.initData
        }

        const response = await axios.get<UserProfileData>(
            `https://ce99-109-120-134-48.ngrok-free.app/api/admin/get_user?user_id=${userId}`,
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
            message: "Данные пользователя успешно получены",
            data: response.data,
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Ошибка при получении данных пользователя:", error.response?.data)
            return {
                success: false,
                message: error.response?.data?.message || "Ошибка при получении данных пользователя",
                data: null,
            }
        }
        return {
            success: false,
            message: "Неизвестная ошибка при получении данных пользователя",
            data: null,
        }
    }
}

