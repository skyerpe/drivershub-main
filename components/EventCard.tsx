import { faCalendarDays, faLocationDot, faPenToSquare, faPlaneDeparture, faTag, faTicket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "flowbite-react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import tw from "tailwind-styled-components";
import { fitText } from "../lib/utils/text";
import type { Event } from "../types";
import EventModal from "./EventModal";

const Description = tw.div`
    text-white/80
    mx-4
    my-0.5
`;

interface Props {
    data: Event;
    shown: number | "new";
    setShown: Dispatch<SetStateAction<number | "new">>;
};

export default function EventCard({ data, shown, setShown }: Props) {
    return (
        <>
            <div
                id={`${data.id}`}
                className="flex flex-col items-center border border-gray-700 bg-white/5 w-96 rounded-lg mx-2 my-2"
            >
                <Image
                    src={data.banner ?? "https://static.truckersmp.com/images/bg/ets.jpg"}
                    alt="event banner"
                    width={4096}
                    height={4096}
                    className="w-full h-20 sm:h-24 rounded-t-lg"
                />

                <Description>
                    ID: {data.id}
                </Description>
                <Description>
                    <Link
                        href={`https://truckersmp.com/events/${data.id}`}
                        target="_blank" className="text-blue-500"
                    >
                        <FontAwesomeIcon icon={faTag} /> {fitText(data.name, 35)}
                    </Link>
                </Description>
                <Description>
                    <FontAwesomeIcon icon={faCalendarDays} /> {moment(data.departure).format("DD MMMM YYYY HH:mm")}
                </Description>
                <Description>
                    <FontAwesomeIcon icon={faPlaneDeparture} /> {fitText(data.location, 35)}
                </Description>
                <Description>
                    <FontAwesomeIcon icon={faLocationDot} /> {fitText(data.destination, 35)}
                </Description>
                <Description>
                    <FontAwesomeIcon icon={faTicket} /> Slot: {data.slot_id ?? "None."}
                    {data.slot_image
                        ? <> (<Link href={data.slot_image} target="_blank" className="text-blue-500">Image</Link>)</>
                        : <></>}
                </Description>

                <Button
                    className="text-white my-1"
                    onClick={() => {
                        setShown(data.id);
                    }}
                >
                    <FontAwesomeIcon icon={faPenToSquare} />
                </Button>

                <EventModal data={data} show={shown === data.id} setShown={setShown} />
            </div>
        </>
    );
};