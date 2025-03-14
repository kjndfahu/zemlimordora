interface StatisticsBlockProps {
    wins: number
    losses: number
}

export const StatisticsBlock = ({ wins, losses }: StatisticsBlockProps) => {
    const totalGames = wins + losses
    const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0

    return (
        <div className="bg-[#1E1E1E] p-4 md:p-6 rounded-lg border border-[#333]">
            <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4">Статистика</h3>

            <div className="space-y-2 md:space-y-3">
                <div>
                    <p className="text-sm text-gray-400">Всего выигрышей</p>
                    <p className="text-xl font-medium text-[#43FF97]">{wins}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Всего проигрышей</p>
                    <p className="text-xl font-medium text-red-400">{losses}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Соотношение</p>
                    <p className="text-xl font-medium">{winRate.toFixed(1)}%</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Всего игр</p>
                    <p className="text-xl font-medium">{totalGames}</p>
                </div>
            </div>
        </div>
    )
}

