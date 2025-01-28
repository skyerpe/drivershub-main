const trail = "…";
export function fitText(string: string, length: number, includeTrail = true): string {
    if (string.length <= length) return string;
    if (includeTrail) return `${string.slice(0, length - trail.length).trimEnd()}${trail}`;
    return string.slice(0, length);
};

export function formatListToHuman(list: string[]): string {
    // join list with ", " and add "and" before last item
    if (list.length === 1) return list[0]!;
    return list.slice(0, -1).join(", ") + (list.length > 1 ? `, and ${list[list.length - 1]!}` : "");
};

export function convertTimestamp(timestamp: number, includeDay = true): string {
    const date = new Date(timestamp);
    const day = includeDay ? date.getDate() : "";
    const month = date.toLocaleString("en-US", { month: "short", timeZone: "Etc/UTC" });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`.trim();
};