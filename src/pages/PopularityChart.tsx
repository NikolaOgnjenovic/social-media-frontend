import UserPopularityChart from "../components/UserPopularityChart";
import "../css/chart.css";
import {getUserPopularity} from "../services/UserService";
import {useEffect, useState} from "react";
import {localizedStrings} from "../res/LocalizedStrings.tsx";

function PopularityChart() {
    const [data, setData] = useState<{ username: string; popularity: number; }[]>(
        []
    );

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const userPopularityData = await getUserPopularity();
        setData(userPopularityData);
    }

    return (
        <div>
            <h1 className="chart-header">{localizedStrings.chart.title}</h1>
            <div className="chart-container">
                {data ? <UserPopularityChart data={data}/> : <p>{localizedStrings.chart.loading}</p>}
            </div>
        </div>
    );
}

export default PopularityChart;
