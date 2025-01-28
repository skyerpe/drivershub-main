import { useStoreState } from "easy-peasy";
import type { ApplicationStore } from "../../lib/state";
import { formatListToHuman } from "../../lib/utils/text";

export default function Admin() {
    const user = useStoreState((state: ApplicationStore) => state.user.data!);

    return (
        <div className="flex flex-col items-center justify-center h-screen w-full" id="mainPage">
            <div className="flex flex-col items-center justify-center bg-white/5 backdrop-blur w-fit max-w-[90%] sm:max-w-[50%] rounded-lg">
                <div className="text-white/80 text-center mx-4 my-4">
                    your permissions: {formatListToHuman(user.permissions.toArray())}
                </div>
            </div>
        </div>
    );
};