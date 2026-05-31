import { FaCheck, FaClock } from "react-icons/fa";

export default function SalaryItem({ serial, name, uid, bkashNumber, points, amount, requestedAt, paid, paidAt, payFunction, id }) {

    const formatDate = (d) => {
        if (!d) return "—";
        return new Date(d).toLocaleString("en-GB", {
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        });
    };

    return (
        <tr className={paid ? "salary-row-paid" : "salary-row-pending"}>
            <td>{serial}</td>
            <td>
                <b>{name || "—"}</b>
                <small style={{ display: "block", fontSize: 10, opacity: 0.6, marginTop: 2 }}>{uid}</small>
            </td>
            <td><b>{bkashNumber || "—"}</b></td>
            <td>{points ?? "—"}</td>
            <td><b>৳{Number(amount ?? 0).toFixed(2)}</b></td>
            <td><small>{formatDate(requestedAt)}</small></td>
            <td>
                {paid
                    ? <span style={{ color: "#059669", fontWeight: 700, fontSize: 12 }}><FaCheck style={{ marginRight: 4 }} />Paid<br /><small style={{ opacity: 0.65, fontWeight: 400 }}>{formatDate(paidAt)}</small></span>
                    : <span style={{ color: "#d97706", fontWeight: 700, fontSize: 12 }}><FaClock style={{ marginRight: 4 }} />Pending</span>
                }
            </td>
            <td>
                <div className="redi-buttons d-flex">
                    <button
                        onClick={() => payFunction(id)}
                        disabled={paid}
                        className={paid ? "bg-secondary show-all" : "bg-success show-all"}
                    >
                        {paid ? "Paid" : "Mark Paid"}
                    </button>
                </div>
            </td>
        </tr>
    );
}
