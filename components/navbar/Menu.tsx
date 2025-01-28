import { faArrowRight, faChartSimple, faChevronDown, faGears, faPieChart, faRightFromBracket, faToolbox } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useStoreState } from "easy-peasy";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import handleLogout from "../../lib/handleLogout";
import { closeNavbar, toggleNavbar } from "../../lib/navbar";
import type { ApplicationStore } from "../../lib/state";
import Can from "../Can";

export default function Menu() {
    "translate-x-80"; // tailwind is funny

    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);
    const user = useStoreState((state: ApplicationStore) => state.user.data!);

    // @ts-ignore
    const version = process.env.NEXT_PUBLIC_VERSION!;
    // @ts-ignore
    const commit = process.env.NEXT_PUBLIC_COMMIT!;

    useEffect(() => {
        document.querySelectorAll("[data-collapse-toggle]").forEach((triggerEl) => {
            const el = document.getElementById(triggerEl.getAttribute("data-collapse-toggle")!)!;
            const icon = document.getElementById(triggerEl.getAttribute("data-collapse-icon") ?? "")!;

            triggerEl.addEventListener("click", () => {
                if (el.classList.contains("hidden")) {
                    el.classList.remove("hidden");
                    el.classList.add("max-h-0");
                    setTimeout(() => {
                        el.classList.add("max-h-96");
                        el.classList.remove("max-h-0");
                    }, 1);
                } else {
                    el.classList.remove("max-h-96");
                    el.classList.add("max-h-0");
                    setTimeout(() => {
                        el.classList.add("hidden");
                        el.classList.remove("max-h-0");
                    }, 200);
                };

                icon.classList.toggle("rotate-180");
            });
        });
        document.querySelectorAll("[data-drawer-show]").forEach((triggerEl) => {
            triggerEl.addEventListener("click", () => {
                toggleNavbar();
            });
        });

        const handleClick = (e: MouseEvent) => {
            if (menuRef.current?.contains(e.target as Node)) {
                return;
            };

            closeNavbar();
        };

        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, []);

    return (
        <div ref={menuRef}>
            <div id="drawer-navigation" className={clsx(
                "fixed inset-y-0 left-0 p-4 w-80 bg-gray-800 text-white transform-gpu -translate-x-full transition-transform duration-[400ms] ease-in-out z-50"
            )}>
                <h5 className="text-base font-semibold text-gray-400 uppercase">Menu</h5>
                <div className="py-4 overflow-y-auto">
                    <div className="flex flex-col mx-auto w-fit mb-2">
                        <Image
                            className="rounded-full w-24 h-24 mb-2 mx-auto"
                            alt="user avatar"
                            src={user.avatarURL!}
                            height={4096}
                            width={4096} />
                        <div className="mx-auto">
                            <span className="text-white font-semibold text-xl">{user.username}</span>
                        </div>
                    </div>
                    <div
                        className="text-gray-400 bg-transparent hover:bg-gray-600 hover:text-white rounded-lg py-2 text-lg items-center w-full font-medium flex justify-center mb-2 hover:cursor-pointer"
                        onClick={() => handleLogout(router)}
                    >
                        <FontAwesomeIcon icon={faRightFromBracket} className="w-5 h-5 mr-2" /> Logout
                    </div>
                    {/* <div className="grid grid-cols-3 gap-4">
                        <Link
                            href="/"
                            className="text-gray-400 bg-transparent hover:bg-gray-600 hover:text-white rounded-lg p-2 text-lg items-center w-fit font-medium flex place-self-center"
                        >
                            <FontAwesomeIcon icon={faXmark} className="w-5 h-5 mr-2" />
                        </Link>
                        <Link
                            href="/"
                            className="text-gray-400 bg-transparent hover:bg-gray-600 hover:text-white rounded-lg p-2 text-lg items-center w-fit font-medium flex place-self-center"
                        >
                            <FontAwesomeIcon icon={faXmark} className="w-5 h-5 mr-2" />
                        </Link>
                        <Link
                            href="/"
                            className="text-gray-400 bg-transparent hover:bg-gray-600 hover:text-white rounded-lg p-2 text-lg items-center w-fit font-medium flex place-self-center"
                        >
                            <FontAwesomeIcon icon={faXmark} className="w-5 h-5 mr-2" />
                        </Link>
                    </div> */}
                    <hr className="my-4 w-full h-px border-0 bg-gray-700" />
                    <ul className="space-y-2">
                        <li>
                            <Link href="/" className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700">
                                <FontAwesomeIcon icon={faPieChart} size="lg" className="w-5" />
                                <span className="ml-3">Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/jobs" className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700">
                                <FontAwesomeIcon icon={faToolbox} size="lg" className="w-5" />
                                <span className="ml-3">Jobs</span>
                            </Link>
                        </li>
                        <li>
                            <button
                                className="flex items-center w-full p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700"
                                aria-controls="leaderboard-dropdown"
                                data-collapse-toggle="leaderboard-dropdown"
                                data-collapse-icon="leaderboard-dropdown-icon"
                            >
                                <FontAwesomeIcon icon={faChartSimple} size="lg" className="w-5" />
                                <span className="flex-1 ml-3 text-left whitespace-nowrap">Leaderboard</span>
                                <FontAwesomeIcon icon={faChevronDown} id="leaderboard-dropdown-icon" className={clsx(
                                    "w-5 h-5 transform-gpu transition-transform duration-300 ease-in-out"
                                )} />
                            </button>
                            <ul id="leaderboard-dropdown" className={clsx(
                                "hidden",
                                "overflow-hidden py-2 space-y-2 transform-gpu transition-max-h duration-300 ease-in-out w-full bg-gray-800 text-white rounded-lg"
                            )}>
                                <li>
                                    <Link
                                        href="/leaderboard/monthly"
                                        className="flex items-center w-full p-2 text-base font-normal text-white rounded-lg pl-11 hover:bg-gray-700"
                                    >
                                        Monthly
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/leaderboard/alltime"
                                        className="flex items-center w-full p-2 text-base font-normal text-white rounded-lg pl-11 hover:bg-gray-700"
                                    >
                                        All Time
                                    </Link>
                                </li>
                            </ul>
                        </li>

                        <Can permissions={"Access"}>
                            <hr className="my-4 mx-auto w-48 h-1 bg-gray-700 rounded border-0 md:my-10" />

                            <li>
                                <Link
                                    href="/admin"
                                    className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700"
                                >
                                    <FontAwesomeIcon icon={faGears} size="lg" className="w-5" />
                                    <span className="ml-3">Admin panel</span>
                                </Link>
                            </li>
                        </Can>
                    </ul>
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                    <span className="text-gray-400 text-sm whitespace-nowrap">v{version} (commit: {commit})</span>
                </div>
            </div>

            <div id="drawer-opener" className="fixed bottom-6 left-0 text-white transform-gpu transition-transform duration-[400ms] ease-in-out z-50">
                <button
                    data-drawer-show
                    className="flex justify-center items-center p-3 text-white bg-gray-800 rounded-r-2xl hover:bg-gray-700"
                >
                    <FontAwesomeIcon id="opener-icon" icon={faArrowRight} className="h-5 transform-gpu transition-transform duration-[400ms] ease-in-out" />
                </button>
            </div>
        </div>
    );
};