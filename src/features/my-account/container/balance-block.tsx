"use client"

import {User} from "@/enteties/user/me";

export const BalanceBlock = ({user}:{user:User}) => {

    return (
        <div className="flex flex-col gap-2 text-[20px] py-[20px] px-[20px] w-full h-[200px] rounded-[20px] bg-[#414141]">
            ID
            <h3>{user?.user_id}</h3>
            Баланс
            <h3>{user?.balance}$</h3>
        </div>
    )
}

