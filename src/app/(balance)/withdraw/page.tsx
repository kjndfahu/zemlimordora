import {DepositTypes} from "@/features/deposit/ui/deposit-types";

export default function WithdrawPage() {
    return (
        <div className="flex flex-col text-white px-[20px] text-[24px] gap-[20px]">
            <DepositTypes/>
            <div
                className="flex self-center items-center justify-center w-[240px] h-[60px] text-black rounded-[10px] bg-gradient-to-r from-[#00FF90] via-[#66FFA4] to-[#009353]">
                Вывод
            </div>
        </div>
    )
}