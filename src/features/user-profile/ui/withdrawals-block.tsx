interface Withdrawal {
    id: number
    user_id: number
    amount: number
    address: string
    create_date: number
}

interface WithdrawalsBlockProps {
    withdrawals: Withdrawal[]
    formatDateTime: (timestamp: number) => string
}

export const WithdrawalsBlock = ({ withdrawals, formatDateTime }: WithdrawalsBlockProps) => {
    return (
        <div>
            <h3 className="text-[14px] font-medium mb-4">История выводов</h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="bg-[#2A2A2A] text-[14px] text-left">
                        <th className="px-4 py-3 font-medium">ID</th>
                        <th className="px-4 py-3 font-medium">Дата</th>
                        <th className="px-4 py-3 font-medium">Сумма</th>
                        <th className="px-4 py-3 font-medium">Адрес</th>
                    </tr>
                    </thead>
                    <tbody>
                    {withdrawals.map((withdrawal) => (
                        <tr key={withdrawal.id} className="border-t text-[14px] border-[#333] hover:bg-[#2A2A2A]">
                            <td className="px-4 py-3 text-gray-400">{withdrawal.id}</td>
                            <td className="px-4 py-3">{formatDateTime(withdrawal.create_date)}</td>
                            <td className="px-4 py-3 font-medium text-red-400">${withdrawal.amount.toFixed(2)}</td>
                            <td className="px-4 py-3 text-gray-400">{withdrawal.address}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {withdrawals.length === 0 && <div className="text-center py-8 text-gray-400">Выводы не найдены</div>}
        </div>
    )
}

