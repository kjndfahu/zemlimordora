interface InfoBlockProps {
    username: string
    createDate: number
    lastAuth: number
    wins: number
    losses: number
    formatDate: (timestamp: number) => string
}

export const InfoBlock = ({ username, createDate, lastAuth, wins, losses, formatDate }: InfoBlockProps) => {
    return (
        <div className="space-y-4 text-[14px]">
            <p>Общая информация о пользователе {username}.</p>
            <p>
                Пользователь зарегистрирован {formatDate(createDate)} и последний раз был в сети {formatDate(lastAuth)}.
            </p>
            <p>
                За все время пользователь сделал {wins + losses} ставок, из которых выиграл {wins} и проиграл {losses}.
            </p>
        </div>
    )
}

