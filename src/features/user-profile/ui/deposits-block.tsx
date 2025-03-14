interface Deposit {
    id: number
    user_id: number
    amount: number
    create_date: number
}

interface DepositsBlockProps {
    deposits: Deposit[]
    formatDateTime: (timestamp: number) => string
}

export const DepositsBlock = ({ deposits, formatDateTime }: DepositsBlockProps) => {
    return (
        <div>
            <h3 className="text-[14px] font-medium mb-4">История депозитов</h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="bg-[#2A2A2A] text-[14px] text-left">
                        <th className="px-4 py-3 font-medium">ID</th>
                        <th className="px-4 py-3 font-medium">Дата</th>
                        <th className="px-4 py-3 font-medium">Сумма</th>
                    </tr>
                    </thead>
                    <tbody>
                    {deposits.map((deposit) => (
                        <tr key={deposit.id} className="border-t text-[14px] border-[#333] hover:bg-[#2A2A2A]">
                            <td className="px-4 py-3 text-gray-400">{deposit.id}</td>
                            <td className="px-4 py-3">{formatDateTime(deposit.create_date)}</td>
                            <td className="px-4 py-3 font-medium text-[#43FF97]">${deposit.amount.toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {deposits.length === 0 && <div className="text-center py-8 text-gray-400">Депозиты не найдены</div>}
        </div>
    )
}

