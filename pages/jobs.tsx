import { Dropdown } from "flowbite-react";
import { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import { useDebouncedCallback } from "use-debounce";
import { PageTitle } from "../components/PageTitle";
import http from "../lib/http";
import { store } from "../lib/state";
import type { APIJob, APIStats } from "../types";

export default function Jobs() {
    const setLoading = store.getActions().metadata.setLoading;
    const [limit, setLimit] = useState(10);
    const [skip, setSkip] = useState(0);

    const debounceJobs = useDebouncedCallback(() => http.get<APIJob[]>(`https://api.anchen.org/jobs?limit=${limit}&skip=${skip}`)
        .then((res) => {
            setLoading(false);
            setJobs(res.data);
        }), 500);

    const [jobs, setJobs] = useState<APIJob[]>([]);
    const [total, setTotal] = useState(0);

    const [statsExpiration, setStatsExpiration] = useState(Date.now());
    useEffect(() => {
        if (!jobs.length) setLoading(true);

        debounceJobs();

        if (statsExpiration < Date.now()) {
            http.get<APIStats>("https://api.anchen.org/stats")
                .then((res) => {
                    setTotal(res.data.jobs);
                });
            setStatsExpiration(Date.now() + 1000 * 30);
        };
    }, [limit, skip, statsExpiration, debounceJobs]);
    useEffect(() => {
        const resize = () => {
            const { innerHeight, innerWidth } = window;

            if (innerWidth > 800 && innerHeight < 1280) setLimit(10);
            else if (innerHeight < 1280) setLimit(5);
        };

        window.addEventListener("resize", resize);
        resize();
    }, []);

    return (
        <div className="flex flex-col items-center pt-4 h-screen w-full">
            <PageTitle title="Jobs" />

            <div className="flex flex-col items-center my-6 w-full">
                <div className="overflow-auto shadow-md sm:rounded-lg max-w-[85%]">
                    <table className="text-center text-white/80">
                        <thead className="text-gray-400 bg-gray-700">
                            <tr>
                                <HeadElement>
                                    Driver
                                </HeadElement>
                                <HeadElement>
                                    Source
                                </HeadElement>
                                <HeadElement>
                                    Destination
                                </HeadElement>
                                <HeadElement>
                                    Cargo
                                </HeadElement>
                                <HeadElement>
                                    Distance
                                </HeadElement>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.length
                                ? jobs.map((job, i) => (
                                    <tr
                                        key={i}
                                        className="border-b bg-gray-800 border-gray-700 hover:bg-gray-700"
                                    >
                                        <BodyElement>
                                            {job.driver.username}
                                        </BodyElement>
                                        <BodyElement>
                                            {job.source_city} ({job.source_company})
                                        </BodyElement>
                                        <BodyElement>
                                            {job.destination_city} ({job.destination_company})
                                        </BodyElement>
                                        <BodyElement>
                                            {job.cargo.name}
                                        </BodyElement>
                                        <BodyElement>
                                            {Math.round(job.driven_distance).toLocaleString()}km
                                        </BodyElement>
                                    </tr>
                                ))
                                : Array(limit).fill(0).map((_, i) => (
                                    <tr
                                        key={i}
                                        className="border-b bg-gray-800 border-gray-700"
                                    >
                                        <BodyElement>
                                            -
                                        </BodyElement>
                                        <BodyElement>
                                            -
                                        </BodyElement>
                                        <BodyElement>
                                            -
                                        </BodyElement>
                                        <BodyElement>
                                            -
                                        </BodyElement>
                                        <BodyElement>
                                            -
                                        </BodyElement>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col items-center justify-center text-center text-white/80 my-2">
                    <div className="mx-2">
                        Showing {(skip + 1).toLocaleString()} to {(skip + limit).toLocaleString()} of {total.toLocaleString()} entries
                    </div>

                    <div className="flex flex-row items-center justify-center">
                        <PaginationButton
                            onClick={() => {
                                if (skip - limit < 0) setSkip(0);
                                else setSkip(skip - limit);
                            }}
                            disabled={skip === 0}
                        >
                            Previous
                        </PaginationButton>
                        <PaginationButton
                            onClick={() => setSkip(skip + limit)}
                            disabled={skip + limit >= total}
                        >
                            Next
                        </PaginationButton>
                    </div>

                    <Dropdown
                        label={limit}
                        inline={true}
                        dismissOnClick={true}
                    >
                        <Dropdown.Item onClick={() => setLimit(5)}>
                            5
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setLimit(10)}>
                            10
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setLimit(15)}>
                            15
                        </Dropdown.Item>
                    </Dropdown>
                </div>
            </div>
        </div>
    );
};

const PaginationButton = tw.button`
    text-white/80
    bg-white/5
    rounded-lg

    px-2
    py-1

    mx-1
    my-2

    duration-200
    hover:bg-white/10
    active:bg-white/10

    disabled:opacity-50
`;
const HeadElement = tw.th`
    px-6
    py-2
`;
const BodyElement = tw.th`
    px-6
    py-2

    font-normal
`;