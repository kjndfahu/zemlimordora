interface Props{
    logo?: React.ReactNode,
    text: string,
}

export const Type:React.FC<Props> = ({logo, text}) => {
    return (
        <div className="flex items-center justify-start px-[10px] gap-[10px] h-[40px] rounded-[7px] text-black bg-[#D9D9D9]">
            {logo}
            {text}
        </div>
    )
}