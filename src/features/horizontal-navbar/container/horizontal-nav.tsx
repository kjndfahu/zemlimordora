"use client"

import Link from "next/link"
import { useRef, useState, useEffect, type MouseEvent } from "react"
import { usePathname } from "next/navigation"

export default function HorizontalNav() {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [activeType, setActiveType] = useState("")
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)
    const pathname = usePathname()

    // Update active type based on current path
    useEffect(() => {
        // Extract the route name from the pathname
        const route = pathname.split("/")[1] || "my-account"
        setActiveType(route)

        // Scroll to the active button if it's not visible
        if (scrollContainerRef.current) {
            const activeButton = scrollContainerRef.current.querySelector(`.active-button`)
            if (activeButton) {
                const containerRect = scrollContainerRef.current.getBoundingClientRect()
                const buttonRect = activeButton.getBoundingClientRect()

                // Check if button is outside the visible area
                if (buttonRect.left < containerRect.left || buttonRect.right > containerRect.right) {
                    activeButton.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
                }
            }
        }
    }, [pathname])

    const handleMouseDown = (e: MouseEvent) => {
        if (!scrollContainerRef.current) return

        setIsDragging(true)
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
        setScrollLeft(scrollContainerRef.current.scrollLeft)

        document.body.style.cursor = "grabbing"
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !scrollContainerRef.current) return

        const x = e.pageX - scrollContainerRef.current.offsetLeft
        const walk = (x - startX) * 2
        scrollContainerRef.current.scrollLeft = scrollLeft - walk
    }

    const handleMouseUp = () => {
        setIsDragging(false)
        document.body.style.cursor = "default"
    }

    useEffect(() => {
        const handleMouseLeave = () => {
            setIsDragging(false)
            document.body.style.cursor = "default"
        }

        document.addEventListener("mouseup", handleMouseUp)
        document.addEventListener("mouseleave", handleMouseLeave)

        return () => {
            document.removeEventListener("mouseup", handleMouseUp)
            document.removeEventListener("mouseleave", handleMouseLeave)
            document.body.style.cursor = "default"
        }
    }, [])

    // Define navigation items to make the code more maintainable
    const navItems = [
        { path: "/my-account", label: "Мой Аккаунт", type: "my-account" },
        { path: "/deposit", label: "Депозит", type: "deposit" },
        { path: "/withdraw", label: "Вывод", type: "withdraw" },
        { path: "/transactions", label: "Транзакции", type: "transactions" },
        { path: "/bet-history", label: "История ставок", type: "bet-history" },
    ]

    return (
        <div className="w-full py-4">
            <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto px-4 scrollbar-hide cursor-grab"
                style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                {navItems.map((item) => (
                    <Link href={item.path} key={item.type}>
                        <button
                            className={`min-w-[180px] rounded-[12px] py-3 text-black flex-shrink-0 ${
                                activeType === item.type
                                    ? "bg-gradient-to-r from-[#00FF90] via-[#66FFA4] to-[#009353] active-button"
                                    : "bg-[#5E5E5E] text-white border-[1px] border-[#43FF97]"
                            }`}
                            onClick={(e) => {
                                if (isDragging) {
                                    e.preventDefault()
                                }
                            }}
                        >
                            {item.label}
                        </button>
                    </Link>
                ))}
            </div>
        </div>
    )
}

