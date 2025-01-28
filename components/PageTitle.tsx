interface Props {
    title: string;
};

export function PageTitle({ title }: Props) {
    return (
        <div className="bg-gradient-to-b from-[#036374] to-[#043d47] shadow-lg shadow-[#036374]/40 backdrop-blur w-[95%] rounded-lg">
            <div className="text-white/80 font-semibold text-center text-2xl sm:text-3xl my-4">
                {title}
            </div>
        </div>
    );
};