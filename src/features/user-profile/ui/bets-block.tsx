interface Bet {
    id: number
    user_id: number
    amount: number
    reward: number
    issue: string
    game_name: string
    create_date: number
}

interface BetsBlockProps {
    bets: Bet[]
    formatDateTime: (timestamp: number) => string
}

export const BetsBlock = ({ bets, formatDateTime }: BetsBlockProps) => {
    return (
        <div>
            <h3 className="text-[14px] font-medium mb-4">История ставок</h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="bg-[#2A2A2A] text-[14px] text-left">
                        <th className="px-4 py-3 font-medium">ID</th>
                        <th className="px-4 py-3 font-medium">Дата</th>
                        <th className="px-4 py-3 font-medium">Игра</th>
                        <th className="px-4 py-3 font-medium">Сумма</th>
                        <th className="px-4 py-3 font-medium">Выигрыш</th>
                        <th className="px-4 py-3 font-medium">Результат</th>
                    </tr>
                    </thead>
                    <tbody>
                    {bets.map((bet) => (
                        <tr key={bet.id} className="border-t text-[14px] border-[#333] hover:bg-[#2A2A2A]">
                            <td className="px-4 py-3 text-gray-400">{bet.id}</td>
                            <td className="px-4 py-3">{formatDateTime(bet.create_date)}</td>
                            <td className="px-4 py-3">{bet.game_name}</td>
                            <td className="px-4 py-3">${bet.amount.toFixed(2)}</td>
                            <td className="px-4 py-3">${bet.reward.toFixed(2)}</td>
                            <td className="px-4 py-3">
                  <span
                      className={`px-2 py-1 rounded text-xs ${
                          bet.issue === "win" ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"
                      }`}
                  >
                    {bet.issue === "win" ? "Выигрыш" : "Проигрыш"}
                  </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {bets.length === 0 && <div className="text-center py-8 text-gray-400">Ставки не найдены</div>}
        </div>
    )
}

