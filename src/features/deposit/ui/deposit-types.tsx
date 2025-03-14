import {Type} from "@/features/deposit/ui/type";
import {BitcoinLogo, WalletLogo} from "@/shared/icons";

export const DepositTypes = () => {
    return (
        <div className="flex flex-col gap-[10px]">
            <Type logo={ <BitcoinLogo className="w-[20px] h-[20px]"/> } text="Крипта"/>
            <Type logo={ <WalletLogo className="w-[20px] h-[20px]"/> } text="Карта"/>
            <Type text="Другое"/>
        </div>
    )
}