import clsx from "clsx";
import tw from "tailwind-styled-components";
import type { LeaderboardUser } from "../types";

const Row = tw.div`
    text-white/80
    mx-2 my-2
`;

interface Props {
    user: LeaderboardUser;
    needsShadow: boolean;
};

export default function LeaderboardCard({ user, needsShadow }: Props) {
    return (
        <div
            id={`${user.steamId}-card`}
            className={clsx(
                "duration-200 hover:scale-110 active:scale-110",
                "border border-gray-700",
                "bg-white/5 rounded-lg",
                "w-72",
                "py-2",
                needsShadow && "shadow-xl shadow-[#036374]/40"
            )}
        >
            <Row>#{user.position}</Row>

            <div className="text-white/80 mx-2 my-2">{user.username}</div>
            <div className="text-white/80 mx-2 my-2">{user.distance.toLocaleString()} km</div>
        </div>
    )
};