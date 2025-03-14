"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { getProviders, type Provider } from "@/enteties/admin/get-providers"

interface ProviderPopupProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (providerId: string | null, providerName: string | null) => void
    selectedProviderId: string | null
}

export function ProviderPopup({ isOpen, onClose, onSelect, selectedProviderId }: ProviderPopupProps) {
    const [providers, setProviders] = useState<Provider[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const response = await getProviders()

                if (response.success) {
                    console.log("Raw provider data:", response.providers)

                    // Проверяем формат данных
                    if (Array.isArray(response.providers)) {
                        // Если response.providers - это массив строк (имен провайдеров)
                        if (typeof response.providers[0] === "string") {
                            console.log("Получен массив строк, преобразуем в объекты Provider")

                            // Преобразуем массив строк в массив объектов Provider
                            const formattedProviders: Provider[] = (response.providers as string[]).map((name, index) => {
                                return {
                                    id: index + 1, // Keep numeric ID for UI purposes
                                    name: name.charAt(0).toUpperCase() + name.slice(1).replace("_", " "), // Форматируем имя для отображения
                                    img_url: `/img/providers/${name}.png`, // Предполагаемый путь к изображению
                                    originalName: name.toLowerCase(), // Store the original name in lowercase for matching
                                }
                            })

                            console.log("Formatted providers:", formattedProviders)
                            setProviders(formattedProviders)
                        } else {
                            // Если response.providers - это массив объектов Provider
                            console.log("Provider objects received:", response.providers)

                            // Ensure each provider has an originalName property for matching
                            const providersWithOriginalName = response.providers.map((provider) => ({
                                ...provider,
                                originalName: provider.name.toLowerCase(),
                            }))

                            setProviders(providersWithOriginalName)
                        }
                    } else {
                        console.error("Неожиданный формат данных:", response.providers)
                        setProviders([])
                    }
                } else {
                    console.error("Ошибка при получении провайдеров:", response.message)
                    setProviders([])
                }
            } catch (error) {
                console.error("Ошибка при получении провайдеров:", error)
                setProviders([])
            } finally {
                setLoading(false)
            }
        }

        if (isOpen) {
            fetchProviders()
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-[#1E1E1E] rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-[#333]">
                    <h2 className="text-lg font-bold">Выберите провайдера</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
                    {loading ? (
                        <div className="text-center py-4">Загрузка провайдеров...</div>
                    ) : providers.length === 0 ? (
                        <div className="text-center py-4 text-gray-400">Провайдеры не найдены</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            {/* Опция "Все провайдеры" */}
                            <button
                                key="all-providers-option"
                                onClick={() => {
                                    onSelect(null, null)
                                    onClose()
                                }}
                                className={`p-3 rounded-lg border ${
                                    selectedProviderId === null
                                        ? "border-green-500 bg-green-500 bg-opacity-10"
                                        : "border-[#333] hover:border-green-500"
                                }`}
                            >
                                Все провайдеры
                            </button>

                            {/* Список провайдеров */}
                            {providers.map((provider) => (
                                <button
                                    key={`provider-${provider.id}`}
                                    onClick={() => {
                                        console.log("Selected provider:", provider)
                                        // Use the originalName for matching with game.provider_name
                                        const providerNameForMatching = provider.originalName || provider.name.toLowerCase()
                                        onSelect(providerNameForMatching, provider.name)
                                        onClose()
                                    }}
                                    className={`p-3 rounded-lg border ${
                                        selectedProviderId === (provider.originalName || provider.name.toLowerCase())
                                            ? "border-green-500 bg-green-500 bg-opacity-10"
                                            : "border-[#333] hover:border-green-500"
                                    }`}
                                >
                                    {provider.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

