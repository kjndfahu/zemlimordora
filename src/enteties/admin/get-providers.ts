import axios from "axios"

export interface Provider {
    id: number
    name: string
    img_url: string
}

interface ProvidersResponse {
    success: boolean
    message: string
    providers: Provider[]
}

export async function getProviders(): Promise<ProvidersResponse> {
    try {
        let telegramInitData = ""

        if (typeof window !== "undefined") {
            const WebApp = (await import("@twa-dev/sdk")).default
            telegramInitData = WebApp.initData
        }

        const response = await axios.get<{ providers: Provider[] }>(
            "https://ce99-109-120-134-48.ngrok-free.app/api/providers",
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
            message: "Провайдеры успешно получены",
            providers: response.data.providers,
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Ошибка при получении провайдеров:", error.response?.data)
            return {
                success: false,
                message: error.response?.data?.message || "Ошибка при получении провайдеров",
                providers: [],
            }
        }
        return {
            success: false,
            message: "Неизвестная ошибка при получении провайдеров",
            providers: [],
        }
    }
}

