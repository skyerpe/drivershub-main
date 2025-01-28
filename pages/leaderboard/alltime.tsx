import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStoreState } from "easy-peasy";
import { useEffect, useState } from "react";
import LeaderboardCard from "../../components/LeaderboardCard";
import http from "../../lib/http";
import { store, type ApplicationStore } from "../../lib/state";
import type { LeaderboardUser } from "../../types";

export default function AlltimeLeaderboard() {
    const setLoading = store.getActions().metadata.setLoading;
    const user = useStoreState((state: ApplicationStore) => state.user.data!);
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);

    useEffect(() => {
        setLoading(true);

        const a = async () => {
            console.time("leaderboard ready");
            console.time("fetch users");
            const users = (await http.get<LeaderboardUser[]>("https://api.anchen.org/leaderboard/alltime")).data;
            console.timeEnd("fetch users");

            if (!users.length) {
                console.log("no users");
                setLoading(false);
                return;
            };

            setLeaderboard(users);
            console.timeEnd("leaderboard ready");
            setLoading(false);
        };

        a();
    }, []);

    return (
        <div className="flex flex-col text-center justify-center items-center">
            <div className="bg-gradient-to-b from-[#036374] to-[#043d47] shadow-lg shadow-[#036374]/40 backdrop-blur w-[90%] rounded-lg mt-6">
                <div className="text-white/80 font-semibold text-center text-3xl my-4">All Time leaderboard</div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 justify-center text-center my-6">
                {leaderboard.map((data) =>
                    <LeaderboardCard key={data.steamId} user={data} needsShadow={data.steamId === user.steamId} />
                )}
            </div>

            {leaderboard.some((s) => s.steamId === user.steamId) ? <div className="fixed bottom-6 right-6">
                <button
                    className="bg-[#036374] hover:bg-[#043d47] text-white/80 text-center text-xl rounded-lg w-10 h-10 flex justify-center items-center"
                    onClick={() => {
                        document.getElementById(`${user.steamId}-card`)?.scrollIntoView({ behavior: "smooth" });
                    }}
                >
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                </button>
            </div> : <></>}
        </div>
    );
};