import { MobileDateTimePicker } from "@mui/x-date-pickers";
import { Button, Label, Modal, Spinner, TextInput, Textarea } from "flowbite-react";
import moment from "moment";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import anchenAPI from "../lib/anchenAPI";
import { getTMPEvent } from "../lib/utils/fetchers";
import type { Event } from "../types";

interface Props {
    data: Partial<Event>;
    show: boolean;
    setShown: Dispatch<SetStateAction<number | "new">>;
};

export default function EventModal({ data, show, setShown }: Props) {
    const id = `${data.id ?? "new"}`;
    const [loading, setLoading] = useState(false);

    const getEventId = () => {
        const el = document.getElementById(`eventId-${id}`) as HTMLInputElement;
        return parseInt(el.value);
    };
    const getLocation = () => {
        const el = document.getElementById(`location-${id}`) as HTMLInputElement;
        return el.value;
    };
    const setLocation = (location: string) => {
        const el = document.getElementById(`location-${id}`) as HTMLInputElement;
        el.value = location;
    };
    const getDestination = () => {
        const el = document.getElementById(`destination-${id}`) as HTMLInputElement;
        return el.value;
    };
    const setDestination = (destination: string) => {
        const el = document.getElementById(`destination-${id}`) as HTMLInputElement;
        el.value = destination;
    };
    const [meetup, setMeetup] = useState(data.meetup ?? Date.now());
    const [departure, setDeparture] = useState(data.departure ?? Date.now());
    const getSlotId = () => {
        const el = document.getElementById(`slotId-${id}`) as HTMLInputElement;
        return el.value;
    };
    const setSlotId = (slotId: number) => {
        const el = document.getElementById(`slotId-${id}`) as HTMLInputElement;
        el.value = `${slotId}`;
    };
    const getSlotImage = () => {
        const el = document.getElementById(`slotImage-${id}`) as HTMLInputElement;
        return el.value;
    };
    const setSlotImage = (slotImage: string) => {
        const el = document.getElementById(`slotImage-${id}`) as HTMLInputElement;
        el.value = slotImage;
    };
    const getNote = () => {
        const el = document.getElementById(`note-${id}`) as HTMLInputElement;
        return el.value;
    };
    const setNote = (note: string) => {
        const el = document.getElementById(`note-${id}`) as HTMLInputElement;
        el.value = note;
    };

    useEffect(() => {
    }, [show]);

    return (
        <Modal
            id={`event-modal-${id}`}
            show={show}
            size="3xl"
            popup={true}
            onClose={() => {
                if (!data.id) {
                    setLocation("");
                    setDestination("");
                    setMeetup(Date.now());
                    setDeparture(Date.now());
                    setSlotId("" as any);
                    setSlotImage("");
                    setNote("");
                } else {
                    setLocation(data.location!);
                    setDestination(data.destination!);
                    setMeetup(data.meetup!);
                    setDeparture(data.departure!);
                    setSlotId(data.slot_id!);
                    setSlotImage(data.slot_image!);
                    setNote(data.notes!);
                };

                setShown(0);
            }}
        >
            <Modal.Header className="bg-gray-800" />
            <Modal.Body className="bg-gray-800">
                <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
                    <h3 className="text-xl font-medium text-white">
                        {data.id ? `Edit event "${data.name}"` : "Create a new event"}
                    </h3>
                    <div>
                        <div className="mt-2 mb-0.5 block">
                            <Label
                                value="TruckersMP event ID"
                                className="text-white"
                            />
                        </div>
                        <TextInput
                            id={`eventId-${id}`}
                            type="number"
                            placeholder="1234"
                            defaultValue={data.id}
                            required={true}
                        />
                        <Button
                            isProcessing={loading}
                            processingSpinner={<Spinner />}
                            className="mb-2 mt-0.5"
                            size="xs"
                            onClick={async () => {
                                const eventId = getEventId();

                                if (!eventId) toast.error("Invalid event ID");
                                else {
                                    const offset = moment(Date.now()).utcOffset() * 60 * 1000;
                                    const tmpevent = await getTMPEvent(eventId);

                                    setLocation(`${tmpevent.departure.city} (${tmpevent.departure.location})`);
                                    setDestination(`${tmpevent.arrive.city} (${tmpevent.arrive.location})`);
                                    setMeetup(moment(tmpevent.start_at).add(offset).add(-1800000).toDate().getTime());
                                    setDeparture(moment(tmpevent.start_at).add(offset).toDate().getTime());
                                };
                                // .format("YYYY-MM-DDTHH:mm")
                            }}>magik</Button>

                        <div className="mb-4 flex space-x-1">
                            <div className="w-1/2">
                                <div className="mt-2 mb-0.5 block">
                                    <Label
                                        value="Starting location"
                                        className="text-white"
                                    />
                                </div>
                                <TextInput
                                    id={`location-${id}`}
                                    placeholder="Dover (Slots)"
                                    defaultValue={data.location}
                                    required={true}
                                />
                            </div>
                            <div className="w-1/2">
                                <div className="mt-2 mb-0.5 block">
                                    <Label
                                        value="Destination"
                                        className="text-white"
                                    />
                                </div>
                                <TextInput
                                    id={`destination-${id}`}
                                    placeholder="Cardiff (Mine)"
                                    defaultValue={data.destination}
                                    required={true}
                                />
                            </div>
                        </div>

                        <div className="flex space-x-1">
                            <MobileDateTimePicker
                                label="Meetup time"
                                value={moment(meetup)}
                                onChange={(date) => {
                                    setMeetup(date!.toDate().getTime());
                                }}
                            />
                            <MobileDateTimePicker
                                label="Departure time"
                                value={moment(departure)}
                                onChange={(date) => {
                                    setDeparture(date!.toDate().getTime());
                                }}
                            />
                        </div>

                        <div className="flex space-x-1">
                            <div className="w-2/6">
                                <div className="mt-2 mb-0.5 block">
                                    <Label
                                        value="Slot (optional)"
                                        className="text-white"
                                    />
                                </div>
                                <TextInput
                                    id={`slotId-${id}`}
                                    placeholder="1"
                                    defaultValue={data.slot_id}
                                />
                            </div>
                            <div className="w-4/6">
                                <div className="mt-2 mb-0.5 block">
                                    <Label
                                        value="Slot image link (optional)"
                                        className="text-white"
                                    />
                                </div>
                                <TextInput
                                    id={`slotImage-${id}`}
                                    placeholder="https://cdn.discordapp.com/attachments/992837899559125105/1059225005579325440/image.png"
                                    defaultValue={data.slot_image}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-2 mb-0.5 block">
                        <Label
                            value="Notes (optional)"
                            className="text-white"
                        />
                    </div>
                    <Textarea
                        className="resize-y m-0"
                        id={`note-${id}`}
                        defaultValue={data.notes}
                    />

                    <div className="flex flex-row space-x-2 w-full">
                        <Button
                            isProcessing={loading}
                            processingSpinner={<Spinner />}
                            onClick={async () => {
                                const eventId = getEventId();
                                const location = getLocation();
                                const destination = getDestination();
                                const slotId = getSlotId();
                                const slotImage = getSlotImage();
                                const notes = getNote();

                                if (!eventId || !location || !destination || !meetup || meetup < 0 || !departure || departure < 0)
                                    return toast.error("Please fill in all required fields");

                                const event = {
                                    eventId,
                                    location,
                                    destination,
                                    meetup,
                                    departure,
                                    slotId,
                                    slotImage,
                                    notes
                                };

                                setLoading(true);
                                const res = await anchenAPI.post("/events", event, {
                                    headers: {
                                        Authorization: `Bearer ${localStorage.getItem("access_token")}`
                                    }
                                }).catch((e) => {
                                    if (e.response?.status === 403) {
                                        toast.error("Not enough permissions!");
                                        return;
                                    };
                                });
                                setLoading(false);

                                console.log(res);

                                return;
                            }}>
                            {data.id ? "Save" : "Create"}
                        </Button>
                        {data.id ? <Button
                            isProcessing={loading}
                            processingSpinner={<Spinner />}
                            color="failure"
                            onClick={async () => {
                                const eventId = getEventId();

                                if (!eventId) return toast.error("Invalid event ID");

                                setLoading(true);
                                const res = await anchenAPI.delete("/events", {
                                    data: { eventId },
                                    headers: {
                                        Authorization: `Bearer ${localStorage.getItem("access_token")}`
                                    }
                                }).catch((e) => {
                                    if (e.response?.status === 403) {
                                        toast.error("Not enough permissions!");
                                        return;
                                    };
                                });
                                setLoading(false);

                                console.log(res);

                                return;
                            }}>
                            Delete
                        </Button> : <></>}
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};