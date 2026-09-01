export function StatusBadge({ positive, positiveLabel, negativeLabel }) {
    return (
        <span className={`order-status ${positive ? "paid" : "pending"}`}>
            {positive ? positiveLabel : negativeLabel}
        </span>
    );
}
