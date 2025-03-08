export default function HistoryItem ({serial, enrolls, revenue, date}){


    const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
      ];

    return (
        <tr>
            <td>{serial}</td>
            <td>{enrolls}</td>
            <td>{revenue} Tk</td>
            <td>{monthNames[new Date(date).getMonth()]}</td>
            <td>{new Date(date).getFullYear()}</td>
        </tr>
    )
}