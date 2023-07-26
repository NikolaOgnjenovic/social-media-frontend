import UserPopularityChart from "../components/UserPopularityChart.tsx";
import "../css/chart.css";
import {getUserPopularity} from "../services/UserService.ts";
import {useEffect, useState} from "react";

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
            <h1 className="chart-header">Top 5 most popular users</h1>
            <div className="chart-container">
                {data ? <UserPopularityChart data={data}/> : <p>Loading...</p>}
            </div>
        </div>
    );
}

export default PopularityChart;
