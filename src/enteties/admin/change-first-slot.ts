import axios from "axios"

interface ChangeFirstSlotResponse {
    success: boolean
    message: string
}

export const changeFirstSlot = async (gameId: number): Promise<ChangeFirstSlotResponse> => {
    try {
        let telegramInitData = ""

        if (typeof window !== "undefined") {
            const WebApp = (await import("@twa-dev/sdk")).default
            telegramInitData = WebApp.initData
        }

        const response = await axios.post<ChangeFirstSlotResponse>(
            `https://ce99-109-120-134-48.ngrok-free.app/api/admin/change_first_slot?game_id=${gameId}`,
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
            message: "Первый слот успешно изменен",
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Ошибка при изменении первого слота:", error.response?.data)
            return {
                success: false,
                message: error.response?.data?.message || "Ошибка при изменении первого слота",
            }
        }
        return {
            success: false,
            message: "Неизвестная ошибка при изменении первого слота",
        }
    }
}

