import { faChevronDown, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useRouter } from "next/router";
import { encode } from "querystring";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import io from "socket.io-client";
import EventCard from "../../components/EventCard";
import EventModal from "../../components/EventModal";
import { apiUrl } from "../../lib/contants";
import type { Event } from "../../types";

export default function AdminEvents() {
    const router = useRouter();
    const [shown, setShown] = useState<number | "new">(0);
    const [events, setEvents] = useState<Event[]>([]);
    const eventToFind = parseInt(new URLSearchParams(encode(router.query)).get("id") || "") || null;

    useEffect(() => {
        const ws = io(apiUrl, {
            path: "/events",
            extraHeaders: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`
            },
            timeout: 5000
        });

        ws.on("connect", () => {
            console.log("ws connect");

            ws.emit("get events");
        });

        ws.on("disconnect", (m) => {
            console.info("ws disconnect", m);
        });

        ws.on("exception", (e) => {
            console.error("ws exception", e);
            const message: string = e.message || e;

            toast.error(message);
        });

        ws.on("new event", (data: Event) => {
            console.log("ws new event", data);

            setEvents((prev) => {
                const index = prev.findIndex((event) => event.id === data.id);
                if (index === -1) return [...prev, data];
                else prev[index] = data;
                return prev;
            });

            if (data.id === shown) setShown(0);

            if (data.id === eventToFind) {
                const date = new Date(data.departure);
                const month = date.toLocaleString("en-US", { month: "long" });
                const year = date.getFullYear();

                const el = document.getElementById(`events-${year}-dropdown`)!;
                const icon = document.getElementById(`events-${year}-dropdown-icon`)!;
                el.classList.remove("hidden");
                icon.classList.add("rotate-180");

                const el2 = document.getElementById(`events-${month}-dropdown`)!;
                const icon2 = document.getElementById(`events-${month}-dropdown-icon`)!;
                el2.classList.remove("hidden");
                icon2.classList.add("rotate-180");

                setShown(data.id);
            };
        });

        ws.on("event updated", (data: Event) => {
            console.log("ws event updated", data);

            setEvents((prev) => prev.map((event) => event.id === data.id ? data : event));

            if (data.id === shown) setShown(0);
        });

        ws.on("event deleted", (eventId: number) => {
            console.log("ws event deleted", eventId);

            setEvents((prev) => prev.filter((event) => event.id !== eventId));

            if (eventId === shown) setShown(0);
        });

        return () => {
            ws.disconnect();
        };
    }, []);

    const eventsPerMonth = events
        .sort((a, b) => a.departure - b.departure)
        .reduce<{ [year: number]: { [month: string]: Event[] } }>((acc, event) => {
            const date = new Date(event.departure);
            const month = date.toLocaleString("en-US", { month: "long" });
            const year = date.getFullYear();

            if (!acc[year]) acc[year] = {};
            if (!acc[year]![month]) acc[year]![month] = [];

            acc[year]![month]!.push(event);

            return acc;
        }, {});

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <div className="flex flex-col items-center h-screen w-full" id="mainPage">
                <div className="flex flex-wrap flex-row justify-center text-center my-8 max-w-[90%]">
                    {Object.entries(eventsPerMonth).map(([year, months]) =>
                        <div key={year} className="flex flex-col items-center justify-center w-full">
                            <div
                                className="text-3xl text-white/80 mb-4 p-2 border border-gray-700 bg-white/5 rounded-lg select-none"
                                onClick={() => {
                                    const el = document.getElementById(`events-${year}-dropdown`)!;
                                    const icon = document.getElementById(`events-${year}-dropdown-icon`)!;
                                    el.classList.toggle("hidden");
                                    icon.classList.toggle("rotate-180");
                                }}
                            >
                                {year}{` (${Object.values(months).reduce((prev, next) => prev + next.length, 0)}) `}
                                <FontAwesomeIcon icon={faChevronDown} size="xs" id={`events-${year}-dropdown-icon`} />
                            </div>

                            <div
                                id={`events-${year}-dropdown`}
                                className="flex flex-wrap flex-row justify-center text-center hidden"
                            >
                                {Object.entries(months).map(([month, events]) =>
                                    <div key={month} className="flex flex-col items-center justify-center w-full">
                                        <div
                                            className="text-2xl text-white/80 mb-4 p-2 border border-gray-700 bg-white/5 rounded-lg select-none"
                                            onClick={() => {
                                                const el = document.getElementById(`events-${month}-dropdown`)!;
                                                const icon = document.getElementById(`events-${month}-dropdown-icon`)!;
                                                el.classList.toggle("hidden");
                                                icon.classList.toggle("rotate-180");
                                            }}
                                        >
                                            {month}{` (${events.length}) `}
                                            <FontAwesomeIcon icon={faChevronDown} size="xs" id={`events-${month}-dropdown-icon`} />
                                        </div>

                                        <div
                                            id={`events-${month}-dropdown`}
                                            className="flex flex-wrap flex-row justify-center text-center hidden"
                                        >
                                            {events.map((event) =>
                                                <EventCard
                                                    key={event.name}
                                                    data={event}
                                                    shown={shown}
                                                    setShown={setShown}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div
                        id={`new`}
                        className="flex flex-col items-center justify-center border border-gray-700 bg-white/5 w-fit rounded-lg mx-2 my-2"
                        onClick={() => {
                            setShown("new");
                        }}
                    >
                        <div className="text-gray-400 border-2 border-gray-700 rounded-2xl mt-6 mb-2">
                            <FontAwesomeIcon icon={faPlus} size="4x" className="mx-2 my-2" />
                        </div>

                        <div className="text-white/80 mx-4 mt-2 mb-6">Create new event</div>
                    </div>

                    <EventModal data={{}} show={shown === "new"} setShown={setShown} />
                </div>
            </div>
        </LocalizationProvider>
    );
};