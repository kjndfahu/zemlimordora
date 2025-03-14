"use client"
import { ArrowUpDown, Calendar, Clock, DollarSign } from "lucide-react"

interface FiltersProps {
    searchTerm: string
    setSearchTerm: (value: string) => void
    balanceSort: "asc" | "desc" | null
    registrationSort: "asc" | "desc" | null
    lastLoginSort: "asc" | "desc" | null
    balanceMin: string
    balanceMax: string
    registrationDateStart: string
    registrationDateEnd: string
    lastLoginDateStart: string
    lastLoginDateEnd: string
    setBalanceMin: (value: string) => void
    setBalanceMax: (value: string) => void
    setRegistrationDateStart: (value: string) => void
    setRegistrationDateEnd: (value: string) => void
    setLastLoginDateStart: (value: string) => void
    setLastLoginDateEnd: (value: string) => void
    toggleBalanceSort: () => void
    toggleRegistrationSort: () => void
    toggleLastLoginSort: () => void
    resetFilters: () => void
}

export function Filters({
                            searchTerm,
                            setSearchTerm,
                            balanceSort,
                            registrationSort,
                            lastLoginSort,
                            balanceMin,
                            balanceMax,
                            registrationDateStart,
                            registrationDateEnd,
                            lastLoginDateStart,
                            lastLoginDateEnd,
                            setBalanceMin,
                            setBalanceMax,
                            setRegistrationDateStart,
                            setRegistrationDateEnd,
                            setLastLoginDateStart,
                            setLastLoginDateEnd,
                            toggleBalanceSort,
                            toggleRegistrationSort,
                            toggleLastLoginSort,
                            resetFilters,
                        }: FiltersProps) {
    return (
        <div className="bg-[#1E1E1E] rounded-lg border border-[#333] p-2 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h3 className="text-base font-medium">Фильтры</h3>
            <button className="text-sm text-[#43FF97] hover:underline" onClick={resetFilters}>
        Сбросить все фильтры
    </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Balance filter */}
        <div className="space-y-2">
    <div className="flex items-center gap-2">
    <DollarSign className="h-4 w-4 text-gray-400" />
    <span className="text-sm font-medium">Баланс</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
    <input
        type="number"
    placeholder="От"
    className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#333] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#43FF97]"
    value={balanceMin}
    onChange={(e) => setBalanceMin(e.target.value)}
    />
    <input
    type="number"
    placeholder="До"
    className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#333] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#43FF97]"
    value={balanceMax}
    onChange={(e) => setBalanceMax(e.target.value)}
    />
    </div>
    </div>

    {/* Registration date filter */}
    <div className="space-y-2">
    <div className="flex items-center gap-2">
    <Calendar className="h-4 w-4 text-gray-400" />
    <span className="text-sm font-medium">Дата регистрации</span>
    </div>
    <div className="flex flex-col sm:flex-row gap-2">
    <input
        type="date"
    className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#333] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#43FF97]"
    value={registrationDateStart}
    onChange={(e) => setRegistrationDateStart(e.target.value)}
    />
    <input
    type="date"
    className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#333] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#43FF97]"
    value={registrationDateEnd}
    onChange={(e) => setRegistrationDateEnd(e.target.value)}
    />
    </div>
    </div>

    {/* Last login filter */}
    <div className="space-y-2">
    <div className="flex items-center gap-2">
    <Clock className="h-4 w-4 text-gray-400" />
    <span className="text-sm font-medium">Последний вход</span>
    </div>
    <div className="flex flex-col sm:flex-row gap-2">
    <input
        type="date"
    className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#333] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#43FF97]"
    value={lastLoginDateStart}
    onChange={(e) => setLastLoginDateStart(e.target.value)}
    />
    <input
    type="date"
    className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#333] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#43FF97]"
    value={lastLoginDateEnd}
    onChange={(e) => setLastLoginDateEnd(e.target.value)}
    />
    </div>
    </div>
    </div>

    {/* Mobile sort buttons */}
    <div className="mt-4 flex flex-wrap gap-2 md:hidden">
    <button
        onClick={toggleBalanceSort}
    className={`flex items-center gap-1 px-3 py-2 text-xs rounded-lg border ${
        balanceSort ? "border-[#43FF97] text-[#43FF97]" : "border-[#333] text-gray-400"
    }`}
>
    Баланс
    <ArrowUpDown className="h-3 w-3" />
        </button>
        <button
    onClick={toggleRegistrationSort}
    className={`flex items-center gap-1 px-3 py-2 text-xs rounded-lg border ${
        registrationSort ? "border-[#43FF97] text-[#43FF97]" : "border-[#333] text-gray-400"
    }`}
>
    Дата регистрации
    <ArrowUpDown className="h-3 w-3" />
        </button>
        <button
    onClick={toggleLastLoginSort}
    className={`flex items-center gap-1 px-3 py-2 text-xs rounded-lg border ${
        lastLoginSort ? "border-[#43FF97] text-[#43FF97]" : "border-[#333] text-gray-400"
    }`}
>
    Последний вход
    <ArrowUpDown className="h-3 w-3" />
        </button>
        </div>
        </div>
)
}

