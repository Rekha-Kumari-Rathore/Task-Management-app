import React, {useState, useEffect} from "react";
import Cards from "../components/Home/Cards";
import axios from "axios";

const CompletedTasks = () => {
    const [Data, setData] = useState()
    const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    
    useEffect(() => {
        fetch();
    }, []);
    const fetch = async () => {
        try {
            const response = await axios.get(
                "http://localhost:1000/api/v2/get-all-tasks", {
                    headers,
                }
            );
            console.log("Fetched data:", response.data);  // Log the entire response
            if (response.data && response.data.data) {
                setData(response.data.data.filter(task => task.completed === true));  // Set only completed tasks
            } else {
                console.error("Data structure doesn't match expected format.");
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);

           
        }
    };
    return (
    <div>
        <Cards home={"false"} data={Data} />
    </div>
    );
};

export default CompletedTasks;