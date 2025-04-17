import React , {useEffect, useState} from "react";
import Cards from "../components/Home/Cards";
import axios from "axios";

const ImportantTasks = () => {
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
                "http://localhost:1000/api/v2/get-imp-tasks", {
                    headers,
                }
            );
            console.log("Fetched data:", response.data);  // Log the entire response
            if (response.data && response.data.data) {
                setData(response.data.data);  // Set tasks array from the `data` field
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

export default ImportantTasks;