import { useMemo, useState } from "react";

export function useTableSearch(items, matcher) {
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return items;
        return items.filter((item) => matcher(item, term));
    }, [items, searchTerm, matcher]);

    return { searchTerm, setSearchTerm, filtered };
}
