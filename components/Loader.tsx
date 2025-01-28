import { Transition } from "@headlessui/react";
import { useStoreState } from "easy-peasy";
import { Spinner } from "flowbite-react";
import type { ApplicationStore } from "../lib/state";

export default function Loader() {
    const isFetching = useStoreState((state: ApplicationStore) => state.metadata.isFetching);
    const isLoading = useStoreState((state: ApplicationStore) => state.metadata.isLoading);

    return (
        <Transition
            className="fixed h-screen w-full z-50 flex items-center justify-center backdrop-blur-lg"
            show={isLoading || isFetching}
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <Spinner size="xl" />
        </Transition>
    );
};