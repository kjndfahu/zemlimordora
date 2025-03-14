interface UserGeneralInfo {
    user_id: number
    username: string
    balance: number
    is_banned: boolean
    create_date: number
    last_auth: number
}

interface UserInformationProps {
    user: UserGeneralInfo
    formatDate: (timestamp: number) => string
}

export const UserInformation = ({ user, formatDate }: UserInformationProps) => {
    return (
        <div className="bg-[#1E1E1E] p-4 md:p-6 rounded-lg border border-[#333]">
            <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4">Информация</h3>

            <div className="space-y-2 text-[14px] md:space-y-3">
                <div>
                    <p className="text-sm text-gray-400">ID пользователя</p>
                    <p>{user.user_id}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Имя пользователя</p>
                    <p>{user.username}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Дата регистрации</p>
                    <p>{formatDate(user.create_date)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Последний вход</p>
                    <p>{formatDate(user.last_auth)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Статус</p>
                    <p>
            <span
                className={`px-2 py-1 rounded text-xs ${
                    !user.is_banned ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"
                }`}
            >
              {!user.is_banned ? "Активен" : "Заблокирован"}
            </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

