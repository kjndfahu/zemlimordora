"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Game } from "@/enteties/games/get-games"

interface GameSliderProps {
    games: Game[]
}

export default function GameSlider({ games }: GameSliderProps) {
    const sliderRef = useRef<HTMLDivElement>(null)

    // Filter out duplicate games by ID
    const uniqueGames = games.reduce<Game[]>((acc, current) => {
        const isDuplicate = acc.find((game) => game.id === current.id)
        if (!isDuplicate) {
            return [...acc, current]
        }
        return acc
    }, [])

    const scroll = (direction: "left" | "right") => {
        if (sliderRef.current) {
            const { current } = sliderRef
            const itemWidth = current.offsetWidth / 3
            const scrollAmount = direction === "left" ? -itemWidth : itemWidth
            current.scrollBy({ left: scrollAmount, behavior: "smooth" })
        }
    }

    return (
        <div className="relative px-[20px]">
            <div
                ref={sliderRef}
                className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide snap-x"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {uniqueGames.map((game) => (
                    <div key={game.id} className="flex-shrink-0 w-[calc(33.33%-8px)] max-w-[180px] snap-start">
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden group">
                            <img
                                src={game.img_url || "/placeholder.svg"}
                                alt={game.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <button className="bg-green-500 text-black font-medium py-2 px-4 rounded-full transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                    Играть
                                </button>
                            </div>
                        </div>
                        <h3 className="mt-2 text-sm text-center truncate">{game.name}</h3>
                    </div>
                ))}
            </div>

            <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-[38%] -translate-y-1/2 -translate-x-1/2 bg-green-500 rounded-full p-1 text-black hover:bg-green-600 transition-colors"
                aria-label="Previous games"
            >
                <ChevronLeft size={24} />
            </button>

            <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-[38%] -translate-y-1/2 translate-x-1/2 bg-green-500 rounded-full p-1 text-black hover:bg-green-600 transition-colors"
                aria-label="Next games"
            >
                <ChevronRight size={24} />
            </button>
        </div>
    )
}

