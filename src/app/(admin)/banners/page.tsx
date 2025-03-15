"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Upload, Trash2 } from "lucide-react"

interface Banner {
    id: number
    path: string
    name: string
}

export default function BannerAdmin() {
    const [banners, setBanners] = useState<Banner[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    useEffect(() => {
        fetchBanners()
    }, [])

    const fetchBanners = async () => {
        setIsLoading(true)
        try {
            const response = await fetch("/api/banners")
            if (!response.ok) throw new Error("Failed to fetch banners")
            const data = await response.json()
            setBanners(data)
        } catch (error) {
            console.error("Error loading banners:", error)
            setMessage({
                text: "Ошибка при загрузке баннеров",
                type: "error",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setIsUploading(true)

            try {
                const file = e.target.files[0]

                const formData = new FormData()
                formData.append("file", file)

                const response = await fetch("/api/banners", {
                    method: "POST",
                    body: formData,
                })

                if (!response.ok) {
                    throw new Error("Failed to upload banner")
                }

                const newBanner = await response.json()

                await fetchBanners()

                setMessage({
                    text: "Баннер успешно загружен",
                    type: "success",
                })
            } catch (error) {
                console.error("Error uploading banner:", error)
                setMessage({
                    text: "Ошибка при загрузке баннера",
                    type: "error",
                })
            } finally {
                setIsUploading(false)
            }
        }
    }

    const handleDeleteBanner = async (id: number) => {
        if (!confirm("Вы уверены, что хотите удалить этот баннер?")) {
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch(`/api/banners/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error("Failed to delete banner")
            }

            await fetchBanners()

            setMessage({
                text: "Баннер успешно удален",
                type: "success",
            })
        } catch (error) {
            console.error("Error deleting banner:", error)
            setMessage({
                text: "Ошибка при удалении баннера",
                type: "error",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const moveBanner = async (index: number, direction: "up" | "down") => {
        if ((direction === "up" && index === 0) || (direction === "down" && index === banners.length - 1)) {
            return
        }

        const newIndex = direction === "up" ? index - 1 : index + 1
        const newBanners = [...banners]
        const [movedBanner] = newBanners.splice(index, 1)
        newBanners.splice(newIndex, 0, movedBanner)

        setIsLoading(true)

        try {
            const response = await fetch("/api/banners/reorder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ids: newBanners.map((b) => b.id),
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to reorder banners")
            }

            await fetchBanners()

            setMessage({
                text: "Порядок баннеров изменен",
                type: "success",
            })
        } catch (error) {
            console.error("Error reordering banners:", error)
            setMessage({
                text: "Ошибка при изменении порядка баннеров",
                type: "error",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-8">
                    <Link href="/users" className="flex items-center text-green-500 hover:text-green-400 mr-4">
                        <ArrowLeft size={20} className="mr-2" />
                    </Link>
                    <h1 className="text-[15px] font-bold">Управление баннерами</h1>
                </div>

                {message && (
                    <div
                        className={`mb-6 p-4 rounded-lg ${message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                    >
                        {message.text}
                    </div>
                )}

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Загрузить новый баннер</h2>
                    <label
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-green-500 transition-colors ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {isUploading ? (
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mb-2"></div>
                            ) : (
                                <Upload size={40} className="text-gray-400 mb-2" />
                            )}
                            <p className="mb-2 text-sm text-gray-400">
                                <span className="font-semibold">Нажмите для загрузки</span> или перетащите файл сюда
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG или WEBP (рекомендуемый размер: 1200×160px)</p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={isUploading || isLoading}
                        />
                    </label>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Текущие баннеры ({banners.length})</h2>

                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                    ) : banners.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">Нет загруженных баннеров. Загрузите баннер выше.</div>
                    ) : (
                        <div className="space-y-4">
                            {banners.map((banner, index) => (
                                <div key={banner.id} className="flex items-center bg-gray-700 rounded-lg p-3">
                                    <div className="w-20 h-20 relative flex-shrink-0 mr-4 bg-gray-600 rounded overflow-hidden">
                                        <Image
                                            src={banner.path || "/placeholder.svg"}
                                            alt={`Баннер ${index + 1}`}
                                            width={80}
                                            height={80}
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-sm text-gray-300">Баннер #{index + 1}</p>
                                        <p className="text-xs text-gray-400">{banner.name}</p>
                                        <p className="text-xs text-gray-500">Путь: {banner.path}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleDeleteBanner(banner.id)}
                                            disabled={isLoading}
                                            className={`p-2 rounded-full ${isLoading ? "text-gray-600" : "text-red-400 hover:bg-gray-600"}`}
                                            title="Удалить"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

