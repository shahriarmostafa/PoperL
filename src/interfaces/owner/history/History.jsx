import HistoryItem from "./HistoryItem";
import useHistoryData from "../../../Hooks/useHistoryData";
export default function History (){
    const [isLoading, salaryData, refetch] = useHistoryData();

    return(
        <div className="analytics">
                    <div className="table revenue-table">
                        <table>
                            <tbody>
                                <tr>
                                    <th>Serial No</th>
                                    <th>Total Enrol</th>
                                    <th>Total Revenue</th>
                                    <th>Month</th>
                                    <th>Year</th>
                                </tr>
                                {
                                    salaryData.map((item, index) => {
                                        return <HistoryItem key={index} serial={index + 1} enrolls={item.enrols} revenue={item.totalRevenue} date={item.createdAt}></HistoryItem>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="redi-buttons d-flex">
                        <button className="show-all">Show All</button>
                    </div>
        </div>
    )
}