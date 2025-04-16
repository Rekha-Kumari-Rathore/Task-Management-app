import React, { useState, useEffect } from "react";
import Cards from "../components/Home/Cards";
import InputData from "../components/Home/InputData";
import { MdAddCircle } from "react-icons/md";
import axios from "axios";

const AllTasks = () => {
    const [InputDiv, setInputDiv] = useState("hidden");
    const [Data, setData] = useState([]);  
    
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
                setData(response.data.data);  // Set tasks array from the `data` field
            } else {
                console.error("Data structure doesn't match expected format.");
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    return (
        <>
            <div>
                <div className="w-full flex justify-end px-4 py-2">
                    <button onClick={() => setInputDiv("fixed")}>
                        <MdAddCircle className="text-4xl text-gray-400 hover:text-gray-100 transition-all duration-300" />
                    </button>
                </div>

                {/* Safely check if tasks exist before rendering Cards */}
                {Data.length > 0 ? (
                    <Cards home={"true"} setInputDiv={setInputDiv} data={Data} fetch={fetch}/>
                ) : (
                    <p>No tasks available.</p>  // Display this if no tasks are available
                )}
            </div>
            <InputData InputDiv={InputDiv} setInputDiv={setInputDiv} />
        </>
    );
};

export default AllTasks;
