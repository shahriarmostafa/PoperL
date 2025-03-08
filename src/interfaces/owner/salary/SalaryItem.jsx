export default function SalaryItem ({serial, name, uid, points, earning, paid, payFunction}) {
    return(
        <tr>
            <td>{serial}</td>
            <td>{name}</td>
            <td>{uid}</td>
            <td>{earning}</td>
            <td>{points}</td>
            <td>
                <div className="redi-buttons d-flex">
                    <button onClick={() => payFunction(uid)} disabled={paid} className={paid? `bg-secondary show-all` :`bg-success show-all`}>{paid? "Paid": "Pay"}</button>
                </div>
            </td>
        </tr>
    )
}