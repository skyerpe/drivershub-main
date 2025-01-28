import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
    icon: IconDefinition;
    title: string;
    description: string;
};

export default function Stat({ icon, title, description }: Props) {
    return (
        <div className="flex flex-col items-center justify-center bg-white/5 backdrop-blur rounded-lg mt-4 pb-4">
            <div className="text-white/60 text-center text-4xl my-4"><FontAwesomeIcon icon={icon} /> {title}</div>
            <hr className="w-full h-1 px-8 mx-auto my-4 border-0 rounded bg-gray-700" />
            <div className="text-white/80 text-center text-3xl mx-4 mt-4">{description}</div>
        </div>
    );
};