"use client"

import {ArrowLeft, Search} from "lucide-react"
import Link from "next/link";
import type React from "react";

interface SearchBarProps {
    searchTerm: string
    setSearchTerm: (value: string) => void
}

export function SearchBar({ searchTerm, setSearchTerm }: SearchBarProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <Link href="/" className="flex items-center text-green-500 hover:text-green-400 mr-4">
                <ArrowLeft size={20} className="mr-2" />
                На главную
            </Link>
            <div className="flex gap-[20px]">
                <Link href="/banners">
                    <div
                        className="flex self-center items-center text-[15px] justify-center w-[100px] h-[30px] text-black rounded-[10px] bg-gradient-to-r from-[#00FF90] via-[#66FFA4] to-[#009353]">
                        Баннеры
                    </div>
                </Link>
                <Link href="/banners">
                    <div
                        className="flex self-center items-center text-[15px] justify-center w-[120px] h-[30px] text-black rounded-[10px] bg-gradient-to-r from-[#00FF90] via-[#66FFA4] to-[#009353]">
                        Порядок слотов
                    </div>
                </Link>
            </div>
            <h2 className="text-xl font-bold">Список пользователей</h2>
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Поиск по имени или ID"
                    className="w-full pl-10 pr-4 py-2 bg-[#1E1E1E] border border-[#333] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#43FF97]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    )
}

