"use client"

import { useEffect, useState } from "react"
import { type Game, getGames } from "@/enteties/games/get-games"
import { openGame } from "@/enteties/games/open-game"
import { postLastGame } from "@/enteties/games/post-last-game"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { GameUnavailableModal } from "@/features/home/ui/game-unavaliable-modal"

interface GameGridProps {
    selectedProviderId: string | null
    searchTerm: string
    selectedCategory: string | null
}

export default function GameGrid({ selectedProviderId, searchTerm, selectedCategory }: GameGridProps) {
    const [games, setGames] = useState<Game[]>([])
    const [loading, setLoading] = useState(true)
    const [filteredGames, setFilteredGames] = useState<Game[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [firstSlotGame, setFirstSlotGame] = useState<Game | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [currentGameName, setCurrentGameName] = useState<string>("")
    const gamesPerPage = 18

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await getGames()
                if (response.success && response.games) {
                    console.log("Loaded games:", response.games.slice(0, 3))

                    const firstGame = response.games.find((game) => game.is_first === true) || null
                    setFirstSlotGame(firstGame)

                    setGames(response.games)
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error)
                // eslint-disable-next-line no-console
                console.error("Ошибка при загрузке игр:", errorMessage)
            } finally {
                setLoading(false)
            }
        }

        fetchGames()
    }, [])

    useEffect(() => {
        let filtered = [...games]

        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter((game) => {
                const gameCategory = game.category || ""
                return typeof gameCategory === "string" && gameCategory.toLowerCase() === selectedCategory.toLowerCase()
            })
        }

        // Filter by provider
        if (selectedProviderId !== null) {
            filtered = filtered.filter((game) => {
                const gameProviderName = game.provider_name || ""
                const selectedProvider = selectedProviderId
                return (
                    typeof gameProviderName === "string" &&
                    typeof selectedProvider === "string" &&
                    gameProviderName.toLowerCase() === selectedProvider.toLowerCase()
                )
            })
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter((game) => game.name.toLowerCase().includes(searchTerm.toLowerCase()))
        }

        // Sort games by priority first, then handle first slot game
        filtered.sort((a, b) => (b.priority || 0) - (a.priority || 0))

        // If there's a first slot game and it's in the filtered results, move it to the beginning
        if (firstSlotGame) {
            const firstSlotIndex = filtered.findIndex((game) => game.id === firstSlotGame.id)
            if (firstSlotIndex !== -1) {
                const [firstSlot] = filtered.splice(firstSlotIndex, 1)
                filtered.unshift(firstSlot)
            }
        }

        setFilteredGames(filtered)
        setCurrentPage(1)
    }, [games, selectedProviderId, searchTerm, selectedCategory, firstSlotGame])

    const handleGameClick = async (game: Game) => {
        try {
            await postLastGame({ game_id: game.id })
            const response = await openGame({ game_id: game.id })

            if (response.success) {
                console.log("Game opened successfully:", game.id)
            } else {
                // Show modal when game cannot be opened
                setCurrentGameName(game.name)
                setModalOpen(true)
                // eslint-disable-next-line no-console
                console.error("Failed to open game:", response.message)
            }
        } catch (error) {
            // Show modal for any error
            setCurrentGameName(game.name)
            setModalOpen(true)

            // Log the error safely
            const errorMessage = error instanceof Error ? error.message : String(error)
            // eslint-disable-next-line no-console
            console.error("Error opening game:", errorMessage)
        }
    }

    // Calculate pagination
    const totalPages = Math.ceil(filteredGames.length / gamesPerPage)
    const indexOfLastGame = currentPage * gamesPerPage
    const indexOfFirstGame = indexOfLastGame - gamesPerPage
    const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame)

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
            // Scroll to top of grid
            window.scrollTo({ top: document.getElementById("game-grid")?.offsetTop || 0, behavior: "smooth" })
        }
    }

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
            // Scroll to top of grid
            window.scrollTo({ top: document.getElementById("game-grid")?.offsetTop || 0, behavior: "smooth" })
        }
    }

    if (loading) {
        return <div className="text-center py-8">Загрузка...</div>
    }

    if (filteredGames.length === 0) {
        return (
            <div className="text-center py-8">
                Игры не найдены
                <div className="mt-2 text-sm text-gray-400">
                    {selectedCategory && <div>Категория: {selectedCategory}</div>}
                    {selectedProviderId && <div>Провайдер: {selectedProviderId}</div>}
                    {searchTerm && <div>Поиск: {searchTerm}</div>}
                </div>
            </div>
        )
    }

    return (
        <div>
            <div id="game-grid" className="grid grid-cols-3 gap-3">
                {currentGames.map((game) => (
                    <div key={game.id} className={`flex flex-col ${game.is_first ? "relative rounded-lg" : ""}`}>
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden group">
                            <img
                                src={game.img_url || "/placeholder.svg"}
                                alt={game.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                onClick={() => handleGameClick(game)}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <button
                                    onClick={() => handleGameClick(game)}
                                    className="bg-green-500 text-black font-medium py-2 px-4 rounded-full transform scale-75 group-hover:scale-100 transition-transform duration-300"
                                >
                                    Играть
                                </button>
                            </div>
                        </div>
                        <h3>{game.id}</h3>
                        <h3 className="mt-2 text-sm text-center truncate">{game.name}</h3>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 gap-4">
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="text-sm">
                        Страница {currentPage} из {totalPages}
                    </div>

                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}

            {/* Modal for unavailable games */}
            <GameUnavailableModal isOpen={modalOpen} onClose={() => setModalOpen(false)} gameName={currentGameName} />
        </div>
    )
}

