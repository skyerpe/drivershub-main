import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
    icon: IconDefinition;
    title: string;
    graph: React.ReactNode;
};

export default function Graph({ icon, title, graph }: Props) {
    return (
        <div className="flex flex-col items-center justify-center bg-white/5 backdrop-blur rounded-lg mt-4">
            <div className="text-white/60 text-center text-xl sm:text-4xl my-4">
                <FontAwesomeIcon icon={icon} /> {title}
            </div>
            {graph}
        </div>
    );
};