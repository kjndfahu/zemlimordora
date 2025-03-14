import Link from "next/link"
import {User} from "@/enteties/admin/get-all-users";



interface UsersCardsProps {
    users: User[]
    formatDate: (timestamp: number) => string
}

export function UsersCards({ users, formatDate }: UsersCardsProps) {
    return (
        <div className="md:hidden space-y-4">
            {users.length > 0 ? (
                users.map((user) => (
                    <div key={user.user_id} className="bg-[#1E1E1E] rounded-lg border border-[#333] py-4 px-2">
                        <div className="flex justify-between items-start mb-3">
                            <Link
                                href={`/user-profile?id=${user.user_id}`}
                                className="text-[#43FF97] text-lg font-medium hover:underline"
                            >
                                {user.username}
                            </Link>
                            <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                    !user.is_banned ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                                }`}
                            >
                {!user.is_banned ? "Активен" : "Заблокирован"}
              </span>
                        </div>

                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <div className="text-gray-400">ID:</div>
                            <div>{user.user_id}</div>

                            <div className="text-gray-400">Баланс:</div>
                            <div>${user.balance.toFixed(2)}</div>

                            <div className="text-gray-400">Регистрация:</div>
                            <div>{formatDate(user.create_date)}</div>

                            <div className="text-gray-400">Последний вход:</div>
                            <div>{formatDate(user.last_auth)}</div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="bg-[#1E1E1E] rounded-lg border border-[#333] p-6 text-center text-gray-400">
                    Пользователи не найдены
                </div>
            )}
        </div>
    )
}

