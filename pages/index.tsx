import { IconDefinition, faChartLine, faGasPump, faTruck, faTruckFast, faTruckMoving, faTruckRampBox } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CategoryScale, Chart as ChartJS, ChartOptions, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import { useStoreState } from "easy-peasy";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Graph from "../components/Graph";
import { PageTitle } from "../components/PageTitle";
import http from "../lib/http";
import { store, type ApplicationStore } from "../lib/state";
import { convertTimestamp } from "../lib/utils/text";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler,
    Legend
);

const options: ChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: "top" as const
        }
    }
};

export default function Home() {
    const setLoading = store.getActions().metadata.setLoading;
    const user = useStoreState((state: ApplicationStore) => state.user.data!);
    const [metrics, setMetrics] = useState<Metrics>({
        drivers: {},
        jobs: {},
        distance: {},
        mdistance: {},
        fuel: {}
    });

    useEffect(() => {
        const a = async () => {
            setLoading(true);
            const metrics = (await http.get<Metrics>("https://api.anchen.org/metrics")).data;

            setMetrics(metrics);
            setLoading(false);
        };

        a();
    }, []);

    const filteredMetrics = {
        drivers: filterTimestamps(metrics.drivers),
        jobs: filterTimestamps(metrics.jobs),
        distance: filterTimestamps(metrics.distance),
        mdistance: filterTimestamps(metrics.mdistance, false),
        fuel: filterTimestamps(metrics.fuel)
    };

    return (
        <div className="flex flex-col items-center pt-4 h-screen w-full">
            <PageTitle title={`Welcome Back, ${user.username}`} />

            <div className="lg:grid lg:grid-cols-2 lg:gap-4 w-[95%] mt-4">
                {getGraph(filteredMetrics.drivers, "Total Drivers", faTruck, "Drivers")}
                {getGraph(filteredMetrics.jobs, "Total Jobs", faTruckRampBox, "Jobs")}
            </div>

            <div className="text-white/60 text-center text-2xl sm:text-4xl mt-4"><FontAwesomeIcon icon={faChartLine} /> VTC Stats</div>
            <div className="lg:grid lg:grid-cols-3 lg:gap-4 w-[95%]">
                {getGraph(filteredMetrics.distance, "Total Distance", faTruckMoving, "Distance (km)")}
                {getGraph(filteredMetrics.mdistance, "Monthly Distance", faTruckFast, "Distance (km)")}
                {getGraph(filteredMetrics.fuel, "Fuel Used", faGasPump, "Fuel (l)")}
            </div>
        </div>
    );
};

function getGraph(metrics: { [timestamp: string]: number }, title: string, icon: IconDefinition, label: string): JSX.Element {
    const backgroundColor = "rgba(4, 61, 71, 0.5)";
    const borderColor = "rgb(4, 61, 71)";

    const data = {
        labels: Object.keys(metrics),
        datasets: [{
            fill: true,
            label,
            data: Object.values(metrics),
            borderColor,
            backgroundColor
        }]
    };

    return <Graph title={title} icon={icon} graph={<Line options={options} data={data} />} />;
};

function filterTimestamps(metrics: { [timestamp: string]: number }, includeDay = true): { [date: string]: number } {
    const filteredMetrics: { [date: string]: { timestamp: number; value: number } } = {};

    Object.entries(metrics).forEach(([timestamp, value]) => {
        const timestampInteger = parseInt(timestamp);

        const date = new Date(timestampInteger);
        const currentDate = convertTimestamp(date.getTime(), includeDay);

        if (!filteredMetrics[currentDate] || date > new Date(filteredMetrics[currentDate]!.timestamp)) {
            filteredMetrics[currentDate] = { timestamp: timestampInteger, value };
        };
    });

    const cleanedMetrics: { [date: string]: number } = {};

    Object.entries(filteredMetrics).forEach(([date, metric]) => {
        cleanedMetrics[date] = metric.value;
    });

    return cleanedMetrics;
};


interface Metrics {
    drivers: Record<string, number>;
    jobs: Record<string, number>;
    distance: Record<string, number>;
    mdistance: Record<string, number>;
    fuel: Record<string, number>;
};