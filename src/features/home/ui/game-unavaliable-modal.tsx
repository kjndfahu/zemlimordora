"use client"

import { useEffect } from "react"

interface GameUnavailableModalProps {
    isOpen: boolean
    onClose: () => void
    gameName?: string
}

export function GameUnavailableModal({ isOpen, onClose, gameName }: GameUnavailableModalProps) {
    // Close modal when Escape key is pressed
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isOpen) {
                onClose()
            }
        }

        window.addEventListener("keydown", handleEscKey)
        return () => window.removeEventListener("keydown", handleEscKey)
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-[#1E1E1E] rounded-lg w-full max-w-md overflow-hidden">
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4 text-center">Игра недоступна</h2>
                    <p className="text-center mb-6">
                        {gameName ? `Игра "${gameName}" в данный момент недоступна.` : "Эта игра в данный момент недоступна."}
                        <br />
                        Пожалуйста, попробуйте позже или выберите другую игру.
                    </p>
                    <div className="flex justify-center">
                        <button
                            onClick={onClose}
                            className="bg-green-500 text-black font-medium py-2 px-6 rounded-full hover:bg-green-600 transition-colors"
                        >
                            Понятно
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

