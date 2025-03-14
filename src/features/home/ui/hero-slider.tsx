"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface Banner {
    id: number
    path: string
    name: string
}

export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [banners, setBanners] = useState<Banner[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Функция для получения списка баннеров
        const loadBanners = async () => {
            try {
                const response = await fetch("/api/banners")
                if (!response.ok) throw new Error("Failed to fetch banners")
                const data = await response.json()
                setBanners(data)
            } catch (error) {
                console.error("Error loading banners:", error)
                setBanners([])
            } finally {
                setIsLoading(false)
            }
        }

        loadBanners()
    }, [])

    // Функция для получения корректного индекса даже для отрицательных значений
    const getSlideIndex = (index: number) => {
        return (index + banners.length) % banners.length
    }

    useEffect(() => {
        if (banners.length === 0) return

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
        }, 5000)

        return () => clearInterval(interval)
    }, [banners.length])

    // Если нет баннеров, показываем заглушку
    if (isLoading) {
        return <div className="h-[160px] bg-gray-800 animate-pulse"></div>
    }

    if (banners.length === 0) {
        return (
            <div className="h-[160px] bg-gray-800 flex items-center justify-center">
                <p className="text-gray-400">Нет доступных баннеров</p>
            </div>
        )
    }

    return (
        <div className="relative mb-5">
            <div className="overflow-hidden">
                <div className="relative w-full h-[160px]">
                    {banners.map((banner, index) => (
                        <div
                            key={banner.id}
                            className={`absolute top-0 left-0 w-full h-full flex gap-[10px] transition-transform duration-500 ease-in-out`}
                            style={{
                                transform: `translateX(${(index - currentSlide) * 100}%)`,
                                zIndex: index === currentSlide ? 10 : 0,
                                opacity: Math.abs(index - currentSlide) <= 1 ? 1 : 0,
                            }}
                        >
                            <div className="w-[8%] flex-shrink-0">
                                <div className="relative w-full h-[160px] overflow-hidden">
                                    <Image
                                        src={banners[getSlideIndex(index - 1)].path || "/placeholder.svg"}
                                        alt={`Баннер ${getSlideIndex(index - 1) + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            <div className="w-[80%] flex-shrink-0">
                                <div className="relative w-full h-[160px] overflow-hidden">
                                    <Image
                                        src={banner.path || "/placeholder.svg"}
                                        alt={`Баннер ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            <div className="w-[12%] flex-shrink-0">
                                <div className="relative w-full h-[160px] overflow-hidden">
                                    <Image
                                        src={banners[getSlideIndex(index + 1)].path || "/placeholder.svg"}
                                        alt={`Баннер ${getSlideIndex(index + 1) + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-[-20px] left-0 right-0 flex justify-center gap-1">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full ${currentSlide === index ? "bg-green-500" : "bg-white bg-opacity-50"}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

