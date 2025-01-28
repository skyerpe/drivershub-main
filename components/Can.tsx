import { useStoreState } from "easy-peasy";
import type { PermissionResolvable } from "../lib/Permissions";
import Permissions from "../lib/Permissions";
import type { ApplicationStore } from "../lib/state";

interface Props {
    permissions: PermissionResolvable;
    matchAny?: boolean;
    renderOnError?: React.ReactNode | null;
    children: React.ReactNode;
};

export default function Can({ permissions, matchAny, renderOnError, children }: Props) {
    const user = useStoreState((state: ApplicationStore) => state.user.data!);
    const resolved = Permissions.resolve(permissions);
    const names = new Permissions(resolved).toArray();

    if (matchAny && names.some((v) => user.permissions.has(v))) return <>{children}</>;
    if (!matchAny && names.every((v) => user.permissions.has(v))) return <>{children}</>;
    return <>{renderOnError}</>;
};