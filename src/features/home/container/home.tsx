"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Search, ChevronDown } from "lucide-react"
import HeroSlider from "@/features/home/ui/hero-slider"
import GameSlider from "@/features/home/ui/game-slider"
import GameGrid from "@/features/home/ui/game-grid"
import { ProviderPopup } from "@/features/home/ui/provider-popup"
import { getLastGames } from "@/enteties/games/get-last-games"
import type { Game } from "@/enteties/games/get-games"
import slots from "../../../../public/img/slots.png"
import live from "../../../../public/img/live.png"

export default function Home() {
    const [isProviderPopupOpen, setIsProviderPopupOpen] = useState(false)
    const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null)
    const [selectedProviderName, setSelectedProviderName] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [lastGames, setLastGames] = useState<Game[]>([])
    const [loadingLastGames, setLoadingLastGames] = useState(true)
    const [activeFilters, setActiveFilters] = useState<string[]>([])

    const handleProviderSelect = (providerId: string | null, providerName: string | null) => {
        console.log("Selected provider in Home component:", { id: providerId, name: providerName })
        setSelectedProviderId(providerId)
        setSelectedProviderName(providerName)
        updateActiveFilters("provider", providerName)
    }

    const handleCategorySelect = (category: string | null) => {
        console.log("Selected category:", category)
        setSelectedCategory(category)
        updateActiveFilters("category", category === "slots" ? "Слоты" : category === "live_dealers" ? "Live игры" : null)
    }

    const updateActiveFilters = (type: "provider" | "category", value: string | null) => {
        if (value === null) {
            // Remove this filter type
            setActiveFilters((prev) => prev.filter((filter) => !filter.startsWith(type)))
        } else {
            // Add or update this filter
            const newFilters = [...activeFilters.filter((filter) => !filter.startsWith(type))]
            newFilters.push(`${type}:${value}`)
            setActiveFilters(newFilters)
        }
    }

    const clearAllFilters = () => {
        setSelectedProviderId(null)
        setSelectedProviderName(null)
        setSelectedCategory(null)
        setSearchTerm("")
        setActiveFilters([])
    }

    useEffect(() => {
        const fetchLastGames = async () => {
            try {
                const response = await getLastGames()
                if (response.success && response.games) {
                    setLastGames(response.games)
                }
            } catch (error) {
                console.error("Ошибка при загрузке последних игр:", error)
            } finally {
                setLoadingLastGames(false)
            }
        }

        fetchLastGames()
    }, [])

    return (
        <main className="flex min-h-screen flex-col text-white">
            <HeroSlider />

            <div className="grid grid-cols-2 gap-4 px-[20px] mt-4">
                <div
                    className={`relative rounded-lg overflow-hidden group cursor-pointer ${selectedCategory === "slots" ? "ring-2 ring-green-500" : ""}`}
                    onClick={() => handleCategorySelect(selectedCategory === "slots" ? null : "slots")}
                >
                    <Image
                        src={slots || "/placeholder.svg"}
                        alt="Слоты"
                        width={300}
                        height={150}
                        className="w-full h-auto brightness-50 transition-transform duration-300 group-hover:scale-110"
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[17px] font-bold">СЛОТЫ</span>
                </div>
                <div
                    className={`relative rounded-lg overflow-hidden group cursor-pointer ${selectedCategory === "live_dealers" ? "ring-2 ring-green-500" : ""}`}
                    onClick={() => handleCategorySelect(selectedCategory === "live_dealers" ? null : "live_dealers")}
                >
                    <Image
                        src={live || "/placeholder.svg"}
                        alt="Live игры"
                        width={300}
                        height={150}
                        className="w-full h-auto brightness-50 transition-transform duration-300 group-hover:scale-110"
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[17px] font-bold">LIVE ИГРЫ</span>
                </div>
            </div>

            <div className="flex items-center gap-2 px-[20px] mt-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Поиск игр"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-2 pl-10 pr-3 bg-gray-800 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <button
                    onClick={() => setIsProviderPopupOpen(true)}
                    className="flex items-center gap-1 bg-green-500 text-black font-medium py-2 px-4 rounded-full hover:bg-green-600 transition-colors"
                >
                    <span>{selectedProviderName || "Все провайдеры"}</span>
                    <ChevronDown size={18} />
                </button>
            </div>

            {!loadingLastGames && lastGames.length > 0 && (
                <div className="mt-6 px-[20px]">
                    <h2 className="text-[15px] mb-4">Последние игры</h2>
                    <GameSlider games={lastGames} />
                </div>
            )}

            <div className="px-[20px] pb-20 mt-6">
                <h2 className="text-xl font-bold mb-4">Все Игры</h2>
                <GameGrid selectedProviderId={selectedProviderId} searchTerm={searchTerm} selectedCategory={selectedCategory} />
            </div>

            <ProviderPopup
                isOpen={isProviderPopupOpen}
                onClose={() => setIsProviderPopupOpen(false)}
                onSelect={handleProviderSelect}
                selectedProviderId={selectedProviderId}
            />
        </main>
    )
}

