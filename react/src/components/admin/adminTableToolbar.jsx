export function AdminTableToolbar({ placeholder, value, onChange, count, countLabel }) {
    return (
        <div className="admin-table-toolbar">
            <input
                type="text"
                className="admin-search-input"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <span className="admin-table-count">{count} {countLabel}</span>
        </div>
    );
}
