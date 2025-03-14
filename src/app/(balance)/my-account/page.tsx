import {BalanceBlock} from "@/features/my-account/container/balance-block";
import Link from "next/link";

export default function MyAccount() {
    return (
        <div className="flex flex-col text-white px-[20px] text-[24px] gap-[20px]">
            Баланс
            <BalanceBlock/>
            <Link href="/users">
                <div
                    className="flex self-center items-center justify-center w-[240px] h-[60px] text-black rounded-[10px] bg-gradient-to-r from-[#00FF90] via-[#66FFA4] to-[#009353]">
                    Страница админа
                </div>
            </Link>
        </div>
    )
}