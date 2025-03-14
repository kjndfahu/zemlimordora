"use client"

import Link from "next/link"
import { ArrowUpDown } from "lucide-react"
import {User} from "@/enteties/admin/get-all-users";


interface UsersTableProps {
    users: User[]
    formatDate: (timestamp: number) => string
    balanceSort: "asc" | "desc" | null
    registrationSort: "asc" | "desc" | null
    lastLoginSort: "asc" | "desc" | null
    toggleBalanceSort: () => void
    toggleRegistrationSort: () => void
    toggleLastLoginSort: () => void
}

export function UsersTable({
                               users,
                               formatDate,
                               balanceSort,
                               registrationSort,
                               lastLoginSort,
                               toggleBalanceSort,
                               toggleRegistrationSort,
                               toggleLastLoginSort,
                           }: UsersTableProps) {
    return (
        <div className="bg-[#1E1E1E] rounded-lg border border-[#333] overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="border-b border-[#333]">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Имя пользователя</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                            <button className="flex items-center gap-1" onClick={toggleBalanceSort}>
                                Баланс
                                <ArrowUpDown className={`h-4 w-4 ${balanceSort ? "text-[#43FF97]" : "text-gray-400"}`} />
                            </button>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                            <button className="flex items-center gap-1" onClick={toggleRegistrationSort}>
                                Дата регистрации
                                <ArrowUpDown className={`h-4 w-4 ${registrationSort ? "text-[#43FF97]" : "text-gray-400"}`} />
                            </button>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                            <button className="flex items-center gap-1" onClick={toggleLastLoginSort}>
                                Последний вход
                                <ArrowUpDown className={`h-4 w-4 ${lastLoginSort ? "text-[#43FF97]" : "text-gray-400"}`} />
                            </button>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Статус</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.user_id} className="border-b border-[#333] hover:bg-[#252525]">
                                <td className="px-4 py-3 text-sm">{user.user_id}</td>
                                <td className="px-4 py-3 text-sm">
                                    <Link href={`/user-profile?id=${user.user_id}`} className="text-[#43FF97] hover:underline">
                                        {user.username}
                                    </Link>
                                </td>
                                <td className="px-4 py-3 text-sm">${user.balance.toFixed(2)}</td>
                                <td className="px-4 py-3 text-sm">{formatDate(user.create_date)}</td>
                                <td className="px-4 py-3 text-sm">{formatDate(user.last_auth)}</td>
                                <td className="px-4 py-3 text-sm">
                    <span
                        className={`px-2 py-1 rounded-full text-xs ${
                            !user.is_banned ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                        }`}
                    >
                      {!user.is_banned ? "Активен" : "Заблокирован"}
                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                                Пользователи не найдены
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

