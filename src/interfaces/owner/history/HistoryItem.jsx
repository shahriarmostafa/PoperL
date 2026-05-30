export default function HistoryItem ({serial, enrolls, revenue, month, year}){

    const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
      ];

    return (
        <tr>
            <td>{serial}</td>
            <td>{enrolls}</td>
            <td>{revenue} Tk</td>
            <td>{monthNames[month - 1] || monthNames[0]}</td>
            <td>{year}</td>
        </tr>
    )
}