import TypeAmountTable from "@/features/transactions/ui/table";

export default function TransactionsPage() {
    return (
        <div className="flex flex-col text-white px-[20px] text-[24px] gap-[20px]">
            Транзакции
            <TypeAmountTable/>
        </div>
    )
}